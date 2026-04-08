import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import { DEFAULT_DATA, USE_DEFAULT_DATA } from "./defaultData";

const STORAGE_KEYS = [
  "ai-progress-department-site-v3",
  "ai-progress-department-site-v2",
  "ai-progress-department-site-v1",
];
const STORAGE_KEY = STORAGE_KEYS[0];

const LEVELS = [
  { id: 0, label: "L0", desc: "无AI介入" },
  { id: 1, label: "L1", desc: "制作辅助" },
  { id: 2, label: "L2", desc: "结伴制作" },
  { id: 3, label: "L3", desc: "半自动Agent" },
  { id: 4, label: "L4", desc: "全自动Agent" },
  { id: 5, label: "L5", desc: "AI美术团队" },
];

const MONTH_KEYS = ["apr", "may", "jun"];
const MONTH_LABELS: Record<string, string> = {
  apr: "4月",
  may: "5月",
  jun: "6月",
};

const TASK_STATUS = [
  { value: "todo", label: "待开始" },
  { value: "doing", label: "进行中" },
  { value: "done", label: "已完成" },
];

const DEFAULT_STEPS = [
  "角色原画",
  "场景原画",
  "美宣",
  "3D角色",
  "3D场景",
  "场景编辑",
  "CG动画",
  "引擎动画",
  "特效",
  "TA",
];

const glass =
  "backdrop-blur-3xl bg-white/25 border border-white/80 shadow-[0_8px_32px_rgba(140,120,180,0.15)]";
const softPanel =
  "backdrop-blur-3xl bg-white/12 border border-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_24px_rgba(140,120,180,0.1)]";

const LEVEL_SURFACES = [
  "bg-slate-50 text-slate-500 border-slate-200",
  "bg-violet-100 text-violet-700 border-violet-300",
  "bg-violet-200 text-violet-800 border-violet-400",
  "bg-purple-300 text-purple-900 border-purple-400",
  "bg-purple-600 text-white border-purple-700",
  "bg-purple-900 text-white border-purple-950",
];

function clampLevel(level: number): number {
  const num = Number(level);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(5, num));
}

interface Task {
  id: string;
  month: string;
  name: string;
  content: string;
  owner: string;
  status: string;
}

interface ForecastLevels {
  apr: number | null;
  may: number | null;
  jun: number | null;
}

interface SubStep {
  id: string;
  name: string;
  tool: string;
  notes: string;
  forecastLevels: ForecastLevels;
  tasks: Task[];
  isExpanded: boolean;
  level: number;
}

function createTask(index = 0): Task {
  return {
    id: `task-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    month: "apr",
    name: "",
    content: "",
    owner: "",
    status: "todo",
  };
}

function createForecastLevels(raw: Record<string, number | null> = {}): ForecastLevels {
  const readMonthValue = (month: string): number | null => {
    if (raw?.[month] === null || raw?.[month] === undefined || raw?.[month] === "") {
      return null;
    }
    return clampLevel(raw[month] as number);
  };

  return {
    apr: readMonthValue("apr"),
    may: readMonthValue("may"),
    jun: readMonthValue("jun"),
  };
}

function hasExplicitForecastValue(item: SubStep, month: string): boolean {
  const value = item?.forecastLevels?.[month as keyof ForecastLevels];
  if (value === null || value === undefined || value === "") return false;

  const allMonthsZero = MONTH_KEYS.every(
    (key) => (item?.forecastLevels?.[key as keyof ForecastLevels] ?? 0) === 0
  );
  if (value === 0 && clampLevel(item?.level ?? 0) > 0 && allMonthsZero) return false;

  return true;
}

function getEffectiveForecastLevel(item: SubStep, month: string): number {
  return hasExplicitForecastValue(item, month)
    ? clampLevel(item?.forecastLevels?.[month as keyof ForecastLevels] ?? 0)
    : clampLevel(item?.level ?? 0);
}

function createInitialSubSteps(): Record<string, SubStep[]> {
  return Object.fromEntries(DEFAULT_STEPS.map((step) => [step, []]));
}

function escHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAverage<T>(items: T[], accessor: (item: T) => number): number {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + accessor(item), 0) / items.length;
}

function sanitizeTasks(tasks: unknown[]): Task[] {
  if (!Array.isArray(tasks)) return [];
  return tasks.map((task: unknown, index) => {
    const t = task as Record<string, unknown>;
    return {
      id:
        typeof t?.id === "string" && (t.id as string).trim()
          ? (t.id as string)
          : `task-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      month: MONTH_KEYS.includes(t?.month as string) ? (t.month as string) : "apr",
      name: typeof t?.name === "string" ? (t.name as string) : "",
      content: typeof t?.content === "string" ? (t.content as string) : "",
      owner: typeof t?.owner === "string" ? (t.owner as string) : "",
      status: TASK_STATUS.some((item) => item.value === t?.status) ? (t.status as string) : "todo",
    };
  });
}

function sanitizeSubSteps(raw: unknown): Record<string, SubStep[]> {
  if (!raw || typeof raw !== "object") return createInitialSubSteps();

  const sanitized = createInitialSubSteps();
  Object.entries(raw as Record<string, unknown>).forEach(([step, items]) => {
    if (!Array.isArray(items)) {
      sanitized[step] = [];
      return;
    }

    sanitized[step] = items.map((item: unknown, index) => {
      const it = item as Record<string, unknown>;
      return {
        id:
          typeof it?.id === "string" && (it.id as string).trim()
            ? (it.id as string)
            : `${step}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        name: typeof it?.name === "string" ? (it.name as string) : "",
        tool: typeof it?.tool === "string" ? (it.tool as string) : "",
        notes: typeof it?.notes === "string" ? (it.notes as string) : "",
        forecastLevels: createForecastLevels((it?.forecastLevels as Record<string, number | null>) || {}),
        tasks: sanitizeTasks((it?.tasks as unknown[]) || []),
        isExpanded: !!(it?.isExpanded),
        level: clampLevel((it?.level as number) ?? 0),
      };
    });
  });

  return sanitized;
}

function runDevChecks() {
  if (typeof window === "undefined") return;
  if ((window as Window & { __AI_PROGRESS_SITE_TESTED__?: boolean }).__AI_PROGRESS_SITE_TESTED__) return;

  console.assert(getAverage([], (item: { level: number }) => item.level) === 0, "Empty average should be 0");
  console.assert(getAverage([{ level: 2 }, { level: 4 }], (item: { level: number }) => item.level) === 3, "Average should be 3");
  console.assert(clampLevel(9) === 5, "Clamp upper bound");
  console.assert(clampLevel(-2) === 0, "Clamp lower bound");
  console.assert(sanitizeSubSteps({ 测试: [{ notes: "卡点" }] }).测试[0].notes === "卡点", "Notes persist");
  console.assert(sanitizeTasks([{ month: "may", status: "done" }])[0].month === "may", "Task month persists");
  console.assert(
    getEffectiveForecastLevel({ level: 2, forecastLevels: { apr: null, may: null, jun: null } }, "apr") === 2,
    "Unset forecast should fallback to current level"
  );
  console.assert(createForecastLevels({ apr: null }).apr === null, "Null forecast should stay null");

  (window as Window & { __AI_PROGRESS_SITE_TESTED__?: boolean }).__AI_PROGRESS_SITE_TESTED__ = true;
}

function levelPillClass(level: number): string {
  return `border ${LEVEL_SURFACES[clampLevel(level)]}`;
}

function LevelDropdown({
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const selectedLevel = LEVELS[clampLevel(value)] || LEVELS[0];

  if (readOnly || disabled) {
    return (
      <div
        className={`flex h-10 w-[88px] items-center justify-between rounded-2xl px-3 text-sm font-medium ${levelPillClass(selectedLevel.id)}`}
        title={selectedLevel.desc}
      >
        <span>{selectedLevel.label}</span>
      </div>
    );
  }

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    return () => document.removeEventListener("mousedown", handlePointerDownOutside);
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: 224,
        zIndex: 99999,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative z-10">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 w-[88px] items-center justify-between rounded-2xl px-3 text-sm font-medium transition ${levelPillClass(
          selectedLevel.id
        )} hover:bg-white/70`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={selectedLevel.desc}
      >
        <span>{selectedLevel.label}</span>
        <span className="text-[10px] opacity-70">▾</span>
      </button>

      {open && menuStyle
        ? createPortal(
            <div ref={menuRef} style={menuStyle} className={`rounded-3xl p-2 ${glass}`}>
              <div className="space-y-1">
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(level.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center rounded-2xl px-3 py-2 text-left text-sm transition hover:bg-white/60 ${
                      value === level.id ? "bg-white/70" : "bg-transparent"
                    }`}
                    role="option"
                    aria-selected={value === level.id}
                  >
                    <span className="mr-2 font-semibold">{level.label}</span>
                    <span className="text-slate-500">{level.desc}</span>
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function DraggableSubStepRow({
  item,
  isDragging,
  onLevelChange,
  onFieldChange,
  onDelete,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
  onForecastLevelChange,
  onTaskAdd,
  onTaskFieldChange,
  onTaskDelete,
  readOnly = false,
}: {
  item: SubStep;
  isDragging: boolean;
  onLevelChange: (level: number) => void;
  onFieldChange: (field: string, value: string) => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onForecastLevelChange: (month: string, level: number) => void;
  onTaskAdd: () => void;
  onTaskFieldChange: (taskIndex: number, field: string, value: string) => void;
  onTaskDelete: (taskIndex: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div
      draggable={readOnly ? undefined : true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-[24px] p-3 transition duration-300 ease-out ${
        isDragging ? "scale-[0.995] opacity-60" : ""
      } ${
        item.isExpanded
          ? `${levelPillClass(item.level)} shadow-[0_18px_56px_rgba(160,140,200,0.26)]`
          : `${levelPillClass(item.level)} hover:-translate-y-[1px] hover:shadow-[0_14px_42px_rgba(160,140,200,0.20)]`
      }`}
    >
      <div
        className={`grid ${readOnly ? "grid-cols-[84px_minmax(0,1fr)_minmax(0,4fr)_36px]" : "grid-cols-[24px_84px_minmax(0,1fr)_minmax(0,4fr)_36px_36px]"} items-center gap-2.5 transition-all duration-300 ${
          item.isExpanded ? "rounded-xl bg-white/28 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" : ""
        }`}
      >
        {!readOnly && (
          <div
            className={`flex h-9 cursor-grab items-center justify-center rounded-xl ${softPanel} text-slate-400 transition-all duration-200 hover:bg-white/72 hover:text-slate-500 active:cursor-grabbing`}
            title="拖拽排序"
          >
            ⋮⋮
          </div>
        )}

        <div className="origin-left scale-[0.95]">
          <LevelDropdown value={item.level} onChange={onLevelChange} readOnly={readOnly} />
        </div>

        {readOnly ? (
          <div className="h-9 flex items-center px-3 text-sm font-semibold text-slate-900 truncate">
            {item.name || <span className="text-slate-400">未命名</span>}
          </div>
        ) : (
          <input
            value={item.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="子环节名称"
            className={`h-9 w-full rounded-xl px-3 text-sm font-semibold text-slate-900 outline-none transition-all duration-200 focus:bg-white/80 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.7)] ${softPanel}`}
          />
        )}

        {readOnly ? (
          <div className="h-9 flex items-center px-3 text-sm text-slate-500 truncate">
            {item.tool || <span className="text-slate-300">—</span>}
          </div>
        ) : (
          <input
            value={item.tool || ""}
            onChange={(e) => onFieldChange("tool", e.target.value)}
            placeholder="AI工具"
            className={`h-9 w-full rounded-xl px-3 text-sm text-slate-500 outline-none transition-all duration-200 focus:bg-white/80 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.7)] ${softPanel}`}
          />
        )}

        <button
          type="button"
          onClick={onToggleExpand}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm text-slate-600 transition-all duration-200 hover:scale-110 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(140,120,180,0.12)] active:scale-95 ${softPanel}`}
          title={item.isExpanded ? "收起详情" : "展开详情"}
        >
          <span className={`transition ${item.isExpanded ? "rotate-180" : ""}`}>▾</span>
        </button>

        {!readOnly && (
          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white/55 text-sm text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-95"
            aria-label="删除子环节"
          >
            ×
          </button>
        )}
      </div>

      {item.isExpanded && (
        <div className="mt-3 space-y-3 rounded-[20px] border border-white/70 bg-white/25 p-3 backdrop-blur-3xl">
          <div className={`rounded-[18px] px-3 py-2.5 transition-all duration-300 ${softPanel}`}>
            <div className="flex flex-wrap items-center gap-4">
              {MONTH_KEYS.map((month) => (
                <div key={month} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{MONTH_LABELS[month]}目标</span>
                  <LevelDropdown
                    value={getEffectiveForecastLevel(item, month)}
                    onChange={(level) => onForecastLevelChange(month, level)}
                    readOnly={readOnly}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[20px] p-3 transition-all duration-300 ${softPanel}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-slate-800">任务项</div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={onTaskAdd}
                  className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-xs text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(140,120,180,0.12)] active:scale-95"
                >
                  添加任务
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {(item.tasks || []).map((task, taskIndex) => (
                <div key={task.id} className={`rounded-[16px] p-2.5 transition-all duration-200 hover:bg-white/70 hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(140,120,180,0.1)] ${softPanel}`}>
                  <div className={`grid gap-2.5 ${readOnly ? "grid-cols-[90px_1.2fr_2.4fr_0.7fr_120px]" : "xl:grid-cols-[90px_1.2fr_2.4fr_0.7fr_120px_36px]"} grid-cols-[90px_1.2fr_2.4fr_0.7fr_120px]`}>
                    {readOnly ? (
                      <div className="h-9 flex items-center px-3 text-sm text-slate-500 rounded-xl">{MONTH_LABELS[task.month]}</div>
                    ) : (
                      <select
                        value={task.month}
                        onChange={(e) => onTaskFieldChange(taskIndex, "month", e.target.value)}
                        className={`h-9 rounded-xl px-3 text-sm outline-none ${softPanel}`}
                      >
                        {MONTH_KEYS.map((month) => (
                          <option key={month} value={month}>
                            {MONTH_LABELS[month]}
                          </option>
                        ))}
                      </select>
                    )}
                    {readOnly ? (
                      <div className="h-9 flex items-center px-3 text-sm font-medium text-slate-900 truncate rounded-xl">{task.name || "—"}</div>
                    ) : (
                      <input
                        value={task.name}
                        onChange={(e) => onTaskFieldChange(taskIndex, "name", e.target.value)}
                        placeholder="任务名"
                        className={`h-9 rounded-xl px-3 text-sm outline-none ${softPanel}`}
                      />
                    )}
                    {readOnly ? (
                      <div className="h-9 flex items-center px-3 text-sm text-slate-500 truncate rounded-xl">{task.content || "—"}</div>
                    ) : (
                      <input
                        value={task.content}
                        onChange={(e) => onTaskFieldChange(taskIndex, "content", e.target.value)}
                        placeholder="任务内容"
                        className={`h-9 rounded-xl px-3 text-sm outline-none ${softPanel}`}
                      />
                    )}
                    {readOnly ? (
                      <div className="h-9 flex items-center px-3 text-sm text-slate-500 truncate rounded-xl">{task.owner || "—"}</div>
                    ) : (
                      <input
                        value={task.owner}
                        onChange={(e) => onTaskFieldChange(taskIndex, "owner", e.target.value)}
                        placeholder="跟进人员"
                        className={`h-9 rounded-xl px-3 text-sm outline-none ${softPanel}`}
                      />
                    )}
                    {readOnly ? (
                      <div className="h-9 flex items-center px-3 text-sm rounded-xl">
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium ${
                          task.status === "done" ? "bg-emerald-100 text-emerald-700" : task.status === "doing" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {task.status === "done" ? "已完成" : task.status === "doing" ? "进行中" : "待开始"}
                        </span>
                      </div>
                    ) : (
                      <select
                        value={task.status}
                        onChange={(e) => onTaskFieldChange(taskIndex, "status", e.target.value)}
                        className={`h-9 rounded-xl px-3 text-sm outline-none ${softPanel}`}
                      >
                        {TASK_STATUS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onTaskDelete(taskIndex)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white/55 text-sm text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-95"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!item.tasks || item.tasks.length === 0) && (
                <div className={`rounded-[16px] border border-dashed border-white/60 px-3 py-3 text-center text-sm text-slate-400 ${softPanel}`}>
                  暂无任务项
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-500">描述 / 卡点 / 备注</label>
            {readOnly ? (
              <div className={`min-h-[84px] w-full rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${softPanel}`}>{item.notes || <span className="text-slate-400">暂无备注</span>}</div>
            ) : (
              <textarea
                value={item.notes || ""}
                onChange={(e) => onFieldChange("notes", e.target.value)}
                placeholder="填写该子环节的描述、当前卡点、问题记录或备注内容"
                className={`min-h-[84px] w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 focus:bg-white/82 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.7)] ${softPanel}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIProgressDepartmentSite({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [departmentName, setDepartmentName] = useState("游戏美术部");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [stepUiState, setStepUiState] = useState<Record<string, boolean>>({});
  const [stepWeights, setStepWeights] = useState<Record<string, number>>({});
  const [customSteps, setCustomSteps] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [subSteps, setSubSteps] = useState<Record<string, SubStep[]>>(() => {
    const base = createInitialSubSteps();

    base["角色原画"] = [
      {
        id: "role-1",
        name: "需求与风格确认",
        tool: "nanobanana / 即梦 / comfyUI",
        notes: "AI概念仍偏模糊，更多用于方向探索",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 1 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-2",
        name: "概念草图/剪影",
        tool: "nanobanana / 即梦 / comfyUI",
        notes: "复杂项目仍需人工主导，AI辅助有限",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 1 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-3",
        name: "结构草图",
        tool: "nanobanana / 即梦 / comfyUI",
        notes: "结构理解仍依赖人工",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 1 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-4",
        name: "正式线稿绘制",
        tool: "SD / banana",
        notes: "AI辅助细化，但精度不足",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-5",
        name: "配色与二分光影",
        tool: "SD / banana",
        notes: "需要人工修正颜色准确性",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-6",
        name: "基础上色",
        tool: "SD / banana",
        notes: "基础填色可辅助，但风格不稳定",
        forecastLevels: createForecastLevels({ apr: 1, may: 1, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 1,
      },
      {
        id: "role-7",
        name: "细化上色",
        tool: "SD / banana",
        notes: "细节控制不足",
        forecastLevels: createForecastLevels({ apr: 2, may: 2, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 2,
      },
      {
        id: "role-8",
        name: "最终绘制细化",
        tool: "SD / banana",
        notes: "细节质量仍需人工把控",
        forecastLevels: createForecastLevels({ apr: 2, may: 2, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 2,
      },
      {
        id: "role-9",
        name: "三视图细化",
        tool: "Nano banana + comfyUI",
        notes: "一致性与结构问题较多，需要修正",
        forecastLevels: createForecastLevels({ apr: 2, may: 2, jun: 2 }),
        tasks: [],
        isExpanded: false,
        level: 2,
      },
    ];

    return base;
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [saveState, setSaveState] = useState("saved");
  const [exportingHtml, setExportingHtml] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const data = {
      _version: 1,
      _exportedAt: new Date().toISOString(),
      departmentName,
      selectedStep,
      stepUiState,
      stepWeights,
      customSteps,
      subSteps,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = async () => {
    if (exportingHtml) return;
    setExportingHtml(true);
    const exportData = {
      departmentName,
      selectedStep,
      stepUiState,
      stepWeights,
      customSteps,
      subSteps,
    };
    try {
      const response = await fetch("/__export_readonly_html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => "未知错误");
        throw new Error("构建失败: " + errText);
      }
      const html = await response.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI美术管线进度-${(departmentName || "预览").replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("导出网页失败", err);
      alert("导出网页失败，请重试。\n\n错误：" + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExportingHtml(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = JSON.parse(evt.target?.result as string);
        if (typeof raw !== "object" || raw === null) {
          alert("文件格式错误：不是有效的 JSON 数据");
          return;
        }

        if (raw.subSteps && typeof raw.subSteps === "object") {
          const confirmMsg = `即将导入数据并覆盖当前内容。\n\n导出时间：${raw._exportedAt ? new Date(raw._exportedAt).toLocaleString("zh-CN") : "未知"}\n部门名称：${raw.departmentName || "(空)"}\n\n确认导入吗？当前数据将被替换。`;
          if (!window.confirm(confirmMsg)) return;

          if (typeof raw.departmentName === "string") setDepartmentName(raw.departmentName);
          if (typeof raw.selectedStep === "string" || raw.selectedStep === null) setSelectedStep(raw.selectedStep);
          if (raw.stepUiState && typeof raw.stepUiState === "object") setStepUiState(raw.stepUiState);
          if (raw.stepWeights && typeof raw.stepWeights === "object") setStepWeights(raw.stepWeights);
          if (Array.isArray(raw.customSteps)) setCustomSteps(raw.customSteps.filter((item: unknown) => typeof item === "string"));
          if (raw.subSteps && typeof raw.subSteps === "object") setSubSteps(sanitizeSubSteps(raw.subSteps));
        } else {
          alert("文件格式错误：缺少 subSteps 数据");
        }
      } catch (err) {
        console.error("导入失败", err);
        alert("文件解析失败：请确保是有效的 JSON 文件");
      }
    };
    reader.readAsText(file);

    if (importFileRef.current) importFileRef.current.value = "";
  };

  useEffect(() => {
    runDevChecks();
  }, []);

  const steps = useMemo(
    () => [...DEFAULT_STEPS, ...customSteps].filter((step) => !stepUiState[`deleted-${step}`]),
    [customSteps, stepUiState]
  );

  const getWeight = (step: string): number => {
    const w = stepWeights[step];
    if (w === undefined || w === null) return 1;
    const num = Number(w);
    return isNaN(num) ? 1 : Math.max(1, Math.min(3, num));
  };

  const stepLevelValues = useMemo(
    () => Object.fromEntries(steps.map((step) => [step, getAverage(subSteps[step] || [], (item) => item.level)])),
    [steps, subSteps]
  );

  const deptAverage = useMemo(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const step of steps) {
      const w = getWeight(step);
      const avg = stepLevelValues[step] || 0;
      weightedSum += avg * w;
      totalWeight += w;
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }, [steps, stepLevelValues, stepWeights]);

  const forecastDepartmentAverages = useMemo(() => {
    return MONTH_KEYS.reduce<Record<string, number>>((acc, month) => {
      let totalWeight = 0;
      let weightedSum = 0;
      for (const step of steps) {
        const items = subSteps[step] || [];
        if (items.length === 0) continue;
        const w = getWeight(step);
        const avg = getAverage(items, (item) => getEffectiveForecastLevel(item, month));
        weightedSum += avg * w;
        totalWeight += w;
      }
      acc[month] = totalWeight > 0 ? weightedSum / totalWeight : 0;
      return acc;
    }, {});
  }, [steps, subSteps, stepWeights]);

  const displayDeptLevel = clampLevel(Math.round(deptAverage));

  const taskStats = useMemo(() => {
    let doing = 0;
    let done = 0;
    for (const step of steps) {
      for (const item of subSteps[step] || []) {
        for (const task of item.tasks || []) {
          if (task.status === "doing") doing++;
          else if (task.status === "done") done++;
        }
      }
    }
    return { doing, done };
  }, [steps, subSteps]);

  const monthlyTaskStats = useMemo(() => {
    const result: Record<string, { total: number; done: number; doing: number; todo: number }> = {};
    for (const month of MONTH_KEYS) {
      let done = 0;
      let doing = 0;
      let todo = 0;
      for (const step of steps) {
        for (const item of subSteps[step] || []) {
          for (const task of item.tasks || []) {
            if (task.month === month) {
              if (task.status === "done") done++;
              else if (task.status === "doing") doing++;
              else todo++;
            }
          }
        }
      }
      result[month] = { total: done + doing + todo, done, doing, todo };
    }
    return result;
  }, [steps, subSteps]);

  useEffect(() => {
    // 部署模式：使用默认数据（只读）
    if (USE_DEFAULT_DATA) {
      const saved = DEFAULT_DATA;
      if (typeof saved.departmentName === "string") setDepartmentName(saved.departmentName);
      if (typeof saved.selectedStep === "string" || saved.selectedStep === null) setSelectedStep(saved.selectedStep);
      if (saved.stepUiState && typeof saved.stepUiState === "object") setStepUiState(saved.stepUiState);
      if (saved.stepWeights && typeof saved.stepWeights === "object") setStepWeights(saved.stepWeights);
      if (Array.isArray(saved.customSteps)) setCustomSteps(saved.customSteps.filter((item: unknown) => typeof item === "string"));
      if (saved.subSteps && typeof saved.subSteps === "object") setSubSteps(sanitizeSubSteps(saved.subSteps));
      setHasLoaded(true);
      return;
    }

    // 开发模式：使用 localStorage
    try {
      const raw = STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
      if (!raw) {
        setHasLoaded(true);
        return;
      }

      const saved = JSON.parse(raw);
      if (typeof saved.departmentName === "string") setDepartmentName(saved.departmentName);
      if (typeof saved.selectedStep === "string" || saved.selectedStep === null) setSelectedStep(saved.selectedStep);
      if (saved.stepUiState && typeof saved.stepUiState === "object") setStepUiState(saved.stepUiState);
      if (saved.stepWeights && typeof saved.stepWeights === "object") setStepWeights(saved.stepWeights);
      if (Array.isArray(saved.customSteps)) setCustomSteps(saved.customSteps.filter((item: unknown) => typeof item === "string"));
      if (saved.subSteps && typeof saved.subSteps === "object") setSubSteps(sanitizeSubSteps(saved.subSteps));
    } catch (error) {
      console.error("读取本地数据失败", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    
    // 部署模式：不保存到 localStorage
    if (USE_DEFAULT_DATA) {
      setSaveState("saved");
      return;
    }

    // 开发模式：保存到 localStorage
    setSaveState("saving");
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          departmentName,
          selectedStep,
          stepUiState,
          stepWeights,
          customSteps,
          subSteps,
        })
      );
    } catch (error) {
      console.error("保存本地数据失败", error);
      setSaveState("error");
      return;
    }

    const timer = window.setTimeout(() => {
      setSaveState("saved");
    }, 600);

    return () => window.clearTimeout(timer);
  }, [hasLoaded, departmentName, selectedStep, stepUiState, stepWeights, customSteps, subSteps]);

  const addCustomStep = () => {
    const name = customInput.trim();
    if (!name || [...DEFAULT_STEPS, ...customSteps].includes(name)) return;
    setCustomSteps((prev) => [...prev, name]);
    setSubSteps((prev) => ({ ...prev, [name]: [] }));
    setSelectedStep(name);
    setCustomInput("");
  };

  const deleteStep = (step: string) => {
    const isDefault = DEFAULT_STEPS.includes(step);
    if (isDefault) {
      setStepUiState((prev) => ({ ...prev, [`deleted-${step}`]: true }));
    } else {
      setCustomSteps((prev) => prev.filter((item) => item !== step));
    }
    if (selectedStep === step) setSelectedStep(null);
  };

  const restoreDefaultStep = (step: string) => {
    setStepUiState((prev) => {
      const next = { ...prev };
      delete next[`deleted-${step}`];
      return next;
    });
  };

  const addSubStep = () => {
    if (!selectedStep) return;
    setSubSteps((prev) => ({
      ...prev,
      [selectedStep]: [
        ...(prev[selectedStep] || []),
        {
          id: `${selectedStep}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: "",
          tool: "",
          notes: "",
          forecastLevels: createForecastLevels({ apr: null, may: null, jun: null }),
          tasks: [],
          isExpanded: false,
          level: 0,
        },
      ],
    }));
  };

  const setSubLevel = (step: string, index: number, level: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], level: clampLevel(level) };
      return { ...prev, [step]: list };
    });
  };

  const setForecastLevel = (step: string, index: number, month: string, level: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list[index] = {
        ...list[index],
        forecastLevels: {
          ...createForecastLevels(list[index].forecastLevels || {}),
          [month]: clampLevel(level),
        },
      };
      return { ...prev, [step]: list };
    });
  };

  const updateSubField = (step: string, index: number, field: string, value: string) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [step]: list };
    });
  };

  const toggleSubExpanded = (step: string, index: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], isExpanded: !list[index].isExpanded };
      return { ...prev, [step]: list };
    });
  };

  const addTaskToSubStep = (step: string, index: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list[index] = { ...list[index], tasks: [...(list[index].tasks || []), createTask(index)] };
      return { ...prev, [step]: list };
    });
  };

  const updateTaskField = (step: string, index: number, taskIndex: number, field: string, value: string) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      const tasks = [...(list[index].tasks || [])];
      if (!tasks[taskIndex]) return prev;
      tasks[taskIndex] = { ...tasks[taskIndex], [field]: value };
      list[index] = { ...list[index], tasks };
      return { ...prev, [step]: list };
    });
  };

  const deleteTask = (step: string, index: number, taskIndex: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      const tasks = [...(list[index].tasks || [])];
      if (!tasks[taskIndex]) return prev;
      tasks.splice(taskIndex, 1);
      list[index] = { ...list[index], tasks };
      return { ...prev, [step]: list };
    });
  };

  const deleteSubStep = (step: string, index: number) => {
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[index]) return prev;
      list.splice(index, 1);
      return { ...prev, [step]: list };
    });
  };

  const moveSubStep = (step: string, fromIndex: number | null, toIndex: number) => {
    if (fromIndex === null || fromIndex === toIndex) return;
    setSubSteps((prev) => {
      const list = [...(prev[step] || [])];
      if (!list[fromIndex] || !list[toIndex]) return prev;
      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);
      return { ...prev, [step]: list };
    });
  };

  const handleDragStart = (index: number) => setDraggingIndex(index);
  const handleDragOver = (event: React.DragEvent) => event.preventDefault();
  const handleDrop = (toIndex: number) => {
    if (!selectedStep) return;
    moveSubStep(selectedStep, draggingIndex, toIndex);
    setDraggingIndex(null);
  };
  const handleDragEnd = () => setDraggingIndex(null);

  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => {
      const diff = (stepLevelValues[b] || 0) - (stepLevelValues[a] || 0);
      if (diff !== 0) return diff;
      return a.localeCompare(b, "zh-Hans-CN");
    });
  }, [steps, stepLevelValues]);

  const getStepWidthPercent = (avg: number) => {
    const clamped = Math.max(0, Math.min(5, avg || 0));
    return 22 + (clamped / 5) * 78;
  };


  const openStepDetails = (step: string) => {
    setSelectedStep(step);
  };

  return (
    <div className="min-h-screen p-6 text-slate-900 bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100">
      <div className="mb-1 text-right text-[10px] leading-none text-slate-500 select-none">V1.03</div>
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-visible rounded-[36px] border border-white/80 bg-white/10 p-5 shadow-[0_12px_48px_rgba(140,120,180,0.15)] backdrop-blur-3xl">
          <div className="pointer-events-none absolute -left-10 top-16 h-20 w-20 rounded-full bg-[#f5eeff]/50 blur-2xl" />
          <div className="pointer-events-none absolute bottom-16 left-12 h-28 w-28 rounded-full bg-[#e8d8ff]/45 blur-2xl" />
          <div className="pointer-events-none absolute right-24 top-12 h-24 w-24 rounded-full bg-[#ddd0ff]/55 blur-2xl" />

          <header className={`rounded-[30px] p-7 ${glass}`}>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm tracking-[0.18em] text-slate-400">DEPARTMENT AI PROGRESS</div>
                  <div className="flex items-center gap-2">
                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={handleExportHTML}
                          disabled={exportingHtml}
                          className="rounded-full border border-purple-200/60 bg-white/50 px-3 py-1 text-xs text-purple-600 transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(140,120,180,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/50 disabled:hover:shadow-none"
                          title="导出为可双击打开的只读网页"
                        >
                          {exportingHtml ? "⏳ 构建中..." : "📄 导出网页"}
                        </button>
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="rounded-full border border-purple-200/60 bg-white/50 px-3 py-1 text-xs text-purple-600 transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(140,120,180,0.15)] active:scale-95"
                          title="导出数据为 JSON 文件"
                        >
                          ↓ 导出
                        </button>
                        <button
                          type="button"
                          onClick={() => importFileRef.current?.click()}
                          className="rounded-full border border-purple-200/60 bg-white/50 px-3 py-1 text-xs text-purple-600 transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(140,120,180,0.15)] active:scale-95"
                          title="从 JSON 文件导入数据"
                        >
                          ↑ 导入
                        </button>
                        <input
                          ref={importFileRef}
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportFile}
                        />
                      </>
                    )}
                    {!readOnly && (
                      <div
                        className={`rounded-full px-3 py-1 text-xs ${
                          saveState === "saving"
                            ? "bg-white/70 text-slate-500"
                            : saveState === "error"
                              ? "bg-red-50 text-red-600"
                              : "bg-[#f3f0ff] text-purple-700"
                        }`}
                      >
                        {saveState === "saving" ? "自动保存中..." : saveState === "error" ? "保存失败" : "已自动保存"}
                      </div>
                    )}
                    {readOnly && (
                      <div className="rounded-full bg-[#f3f0ff] px-3 py-1 text-xs text-purple-700">只读预览</div>
                    )}
                  </div>
                </div>
                <div
                  className="mt-4 w-full text-3xl font-semibold tracking-tight md:text-4xl"
                >
                  {departmentName || "部门名称"}
                </div>
                <p className="mt-3 text-sm text-slate-500">用于规划和记录部门 AI 推进进展，支持当前成熟度、4-6月目标等级、任务与月度完成情况统计。</p>

                {/* 每月任务进度条 */}
                <div className="mt-6 space-y-3">
                  {MONTH_KEYS.map((month) => {
                    const stats = monthlyTaskStats[month];
                    if (stats.total === 0) return null;
                    const maxTasks = Math.max(
                      monthlyTaskStats[MONTH_KEYS[0]].total,
                      monthlyTaskStats[MONTH_KEYS[1]].total,
                      monthlyTaskStats[MONTH_KEYS[2]].total
                    );
                    const barWidthPercent = (stats.total / maxTasks) * 100;
                    return (
                      <div key={month}>
                        <div className="text-xs text-slate-500 mb-1.5">
                          {MONTH_LABELS[month]}任务
                        </div>
                        <div
                          className="flex h-3 rounded-full overflow-hidden"
                          style={{ width: `${barWidthPercent}%` }}
                        >
                          <div
                            className="h-full bg-purple-700 rounded-l-full"
                            style={{ width: `${(stats.done / stats.total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-violet-300"
                            style={{ width: `${(stats.doing / stats.total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-slate-300 rounded-r-full"
                            style={{ width: `${(stats.todo / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex w-full flex-col gap-4 xl:w-[360px]">
                <div className={`rounded-[32px] p-6 ${levelPillClass(displayDeptLevel)} shadow-[0_18px_48px_rgba(160,140,200,0.20)]`}>
                  <div className="text-xs uppercase tracking-[0.16em] opacity-70">Current Department Level</div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-semibold">L{displayDeptLevel}</div>
                      <div className="mt-1 text-sm opacity-80">{LEVELS[displayDeptLevel].desc}</div>
                    </div>
                    <div className="text-right text-sm opacity-80">
                      <div>平均值</div>
                      <div className="mt-1 text-xl font-semibold">{deptAverage.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {MONTH_KEYS.map((month) => {
                    const avg = forecastDepartmentAverages[month] || 0;
                    const level = clampLevel(Math.round(avg));
                    return (
                      <div key={month} className={`rounded-[18px] p-3 ${levelPillClass(level)} shadow-[0_8px_20px_rgba(160,140,200,0.10)]`}>
                        <div className="text-xs opacity-70">{MONTH_LABELS[month]}</div>
                        <div className="mt-1 text-lg font-semibold">L{level}</div>
                        <div className="mt-1 text-xs opacity-75">均值 {avg.toFixed(1)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-slate-400">
                  <span>进行中 <span className="font-medium text-purple-600">{taskStats.doing}</span></span>
                  <span>已完成 <span className="font-medium text-emerald-600">{taskStats.done}</span></span>
                </div>
              </div>
            </div>
          </header>

          <main className="mt-8">
            <section className={`rounded-[30px] p-6 ${glass}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">美术环节</h3>
                  <p className="mt-2 text-sm text-slate-500">环节等级由子环节平均自动计算；4-6月预计等级由子环节目标等级自动统计。</p>
                </div>
                {!readOnly && (
                  <div className="flex w-full gap-3 lg:w-[380px]">
                    <input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="自定义环节"
                      className={`h-12 flex-1 rounded-2xl px-4 text-sm outline-none ${softPanel}`}
                    />
                    <button type="button" onClick={addCustomStep} className="rounded-2xl bg-white/75 px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-[0_4px_12px_rgba(140,120,180,0.12)] active:scale-95">
                      添加
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {sortedSteps.map((step) => {
                  const avg = stepLevelValues[step] || 0;
                  const displayLevel = clampLevel(Math.round(avg));
                  const count = (subSteps[step] || []).length;
                  const widthPercent = getStepWidthPercent(avg);

                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => openStepDetails(step)}
                      style={{ width: `${widthPercent}%` }}
                      className={`group flex min-h-[58px] items-center justify-between rounded-[18px] px-4 py-3 text-left transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(160,140,200,0.12)] ${levelPillClass(displayLevel)} ${selectedStep === step ? "ring-2 ring-white/70 shadow-[0_16px_34px_rgba(160,140,200,0.16)]" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[17px] font-semibold tracking-tight">{step}</div>
                        <div className="mt-0.5 text-[11px] opacity-75">子环节 {count} 个</div>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-base font-semibold">L{displayLevel}</div>
                          <div className="mt-0.5 text-[11px] opacity-75">均值 {avg.toFixed(1)}</div>
                        </div>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep(step);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-white/55 text-xs text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-95"
                            aria-label={`删除${step}`}
                            title="删除环节"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedStep && steps.includes(selectedStep) && (
                <div className={`mt-8 rounded-[30px] p-6 ${glass}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <div className="text-xs tracking-[0.16em] text-slate-400">STEP DETAILS</div>
                      <div className="mt-2 flex items-center gap-3">
                        <h4 className="text-2xl font-semibold tracking-tight">{selectedStep}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400">权重</span>
                          {readOnly ? (
                            <span className="text-sm font-medium text-purple-700">×{getWeight(selectedStep)}</span>
                          ) : (
                            <input
                              type="number"
                              min={1}
                              max={3}
                              step={0.5}
                              value={stepWeights[selectedStep] ?? 1}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  const clamped = Math.max(1, Math.min(3, val));
                                  setStepWeights((prev) => ({ ...prev, [selectedStep]: clamped }));
                                }
                              }}
                              onBlur={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val) || val < 1) setStepWeights((prev) => ({ ...prev, [selectedStep]: 1 }));
                                else if (val > 3) setStepWeights((prev) => ({ ...prev, [selectedStep]: 3 }));
                              }}
                              className="w-14 rounded-lg border border-purple-200/60 bg-white/50 px-2 py-1 text-center text-sm font-medium text-purple-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`rounded-[24px] px-5 py-4 ${levelPillClass(clampLevel(Math.round(stepLevelValues[selectedStep] || 0)))} shadow-[0_10px_24px_rgba(160,140,200,0.10)]`}>
                      <div className="text-sm font-semibold">L{clampLevel(Math.round(stepLevelValues[selectedStep] || 0))}</div>
                      <div className="mt-1 text-xs opacity-75">均值 {(stepLevelValues[selectedStep] || 0).toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4" onDragEnd={handleDragEnd}>
                    {(subSteps[selectedStep] || []).map((item, i) => (
                      <DraggableSubStepRow
                        key={item.id}
                        item={item}
                        isDragging={draggingIndex === i}
                        onLevelChange={(level) => setSubLevel(selectedStep, i, level)}
                        onFieldChange={(field, value) => updateSubField(selectedStep, i, field, value)}
                        onDelete={() => deleteSubStep(selectedStep, i)}
                        onToggleExpand={() => toggleSubExpanded(selectedStep, i)}
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(i)}
                        onForecastLevelChange={(month, level) => setForecastLevel(selectedStep, i, month, level)}
                        onTaskAdd={() => addTaskToSubStep(selectedStep, i)}
                        onTaskFieldChange={(taskIndex, field, value) => updateTaskField(selectedStep, i, taskIndex, field, value)}
                        onTaskDelete={(taskIndex) => deleteTask(selectedStep, i, taskIndex)}
                        readOnly={readOnly}
                      />
                    ))}
                  </div>

                  {!readOnly && (
                    <div className={`mt-6 rounded-[24px] p-4 ${softPanel}`}>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-700">新增</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setExcelModalOpen(true)} className="rounded-2xl bg-purple-100/80 px-4 py-3 text-sm font-medium text-purple-700 transition-all duration-200 hover:scale-105 hover:bg-purple-200/90 hover:shadow-[0_6px_20px_rgba(140,120,180,0.2)] active:scale-95">
                            📊 导入 Excel
                          </button>
                          <button type="button" onClick={addSubStep} className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-[0_6px_20px_rgba(140,120,180,0.15)] active:scale-95">
                            添加子环节
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {!readOnly && (
        <ExcelImportModal
          open={excelModalOpen}
          onClose={() => setExcelModalOpen(false)}
          currentStep={selectedStep}
          onConfirm={(rows) => {
          if (!selectedStep) return;
          setSubSteps((prev) => {
            const existing = prev[selectedStep] || [];
            const newItems = rows.map((row) => ({
              id: `${selectedStep}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: row.name,
              tool: row.tool,
              notes: row.notes,
              forecastLevels: createForecastLevels({
                apr: row.forecastApr,
                may: row.forecastMay,
                jun: row.forecastJun,
              }),
              tasks: [],
              isExpanded: false,
              level: row.level,
            }));
            return { ...prev, [selectedStep]: [...existing, ...newItems] };
          });
        }}
        />
      )}
    </div>
  );
}

/* ─── Excel 导入自动填表弹窗 ─── */
interface ExcelParsedRow {
  name: string;
  step: string;
  level: number;
  tool: string;
  notes: string;
  forecastApr: number | null;
  forecastMay: number | null;
  forecastJun: number | null;
}

function ExcelImportModal({
  open,
  onClose,
  onConfirm,
  currentStep,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (rows: ExcelParsedRow[]) => void;
  currentStep: string | null;
}) {
  const [parsedRows, setParsedRows] = useState<ExcelParsedRow[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setParsedRows([]);
    setFilteredCount(0);
    setLoading(false);
    setError(null);
    setFileName(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !["xlsx", "xls", "csv"].includes(ext || "")) {
      setError("请上传 Excel 文件（.xlsx / .xls / .csv）");
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);
    setParsedRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

      if (rawData.length === 0) {
        setError("Excel 文件为空");
        setLoading(false);
        return;
      }

      const rows = parseExcelRows(rawData);
      if (rows.length === 0) {
        setError("未能解析出有效的子环节数据，请检查 Excel 格式");
        setLoading(false);
        return;
      }

      // 按当前环节过滤
      if (currentStep) {
        const before = rows.length;
        const filtered = rows.filter((r) => {
          const s = String(r.step).trim();
          if (!s) return true; // 无环节列的行不过滤
          return s === currentStep;
        });
        setFilteredCount(before - filtered.length);
        setParsedRows(filtered);
        if (filtered.length === 0) {
          setError(`Excel 中没有与当前环节「${currentStep}」匹配的数据`);
          setLoading(false);
          return;
        }
      } else {
        setParsedRows(rows);
      }
    } catch (err) {
      setError(`文件解析失败: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (parsedRows.length === 0) return;
    onConfirm(parsedRows);
    handleClose();
  };

  const updateParsedRow = (index: number, field: keyof ExcelParsedRow, value: string | number | null) => {
    setParsedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/70 bg-white/30 p-6 shadow-[0_24px_64px_rgba(160,140,200,0.25)] backdrop-blur-3xl">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-900">📊 导入 Excel 子环节</h2>
          <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(100,116,139,0.2)] active:scale-95">✕</button>
        </div>

        {/* 上传区域 */}
        {!parsedRows.length && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-12 text-center transition hover:border-purple-300 hover:bg-purple-50">
              <div className="text-4xl">📊</div>
              <div className="text-sm text-slate-600">
                <button onClick={() => fileInputRef.current?.click()} className="font-medium text-purple-600 underline transition-all duration-200 hover:text-purple-700 hover:no-underline">点击上传 Excel 文件</button>
                <span className="ml-2">或拖拽文件到此处</span>
              </div>
              <div className="text-xs text-slate-400">支持 .xlsx / .xls / .csv 格式</div>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            {fileName && (
              <div className="flex items-center gap-2 rounded-xl bg-purple-50 p-3 text-sm text-purple-700">
                <span>📎</span>
                <span className="flex-1 truncate">{fileName}</span>
                {loading && <span className="animate-pulse">解析中...</span>}
              </div>
            )}

            {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              <div className="font-medium text-slate-600 mb-1">Excel 列映射说明：</div>
              <div>系统会智能识别表头并匹配以下列（不区分大小写）：</div>
              <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.5">
                <div className="font-medium text-slate-600 mt-1">支持 G78 盘点格式：</div>
                <span>• 环节 → 过滤环节（自动向下填充空单元格）</span>
                <span>• 子环节 / 名称 → 子环节名称（支持多子环节列，自动合并）</span>
                <span>• 当前AI等级 → 当前等级（自动解析 L0-L5）</span>
                <span>• AI工具 → AI 工具</span>
                <span>• 备注 / 卡点 → 备注</span>
                <span>• 4月 / 5月 / 6月（目标等级）→ 目标等级</span>
                <div className="font-medium text-slate-600 mt-1">也支持简单格式和无表头格式</div>
              </div>
              {currentStep && <div className="mt-1 text-amber-600">💡 包含"环节"列时，将自动过滤只导入当前环节（{currentStep}）的数据</div>}
            </div>
          </div>
        )}

        {/* 解析结果预览 */}
        {parsedRows.length > 0 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-purple-50 p-3 text-sm text-purple-700">
              ✅ 从 <strong>{fileName}</strong> 解析到 <strong>{parsedRows.length}</strong> 条子环节记录
              {currentStep && <span>（环节：{currentStep}）</span>}
              ，请确认后导入（可手动修改）
              {filteredCount > 0 && <div className="mt-1 text-xs text-amber-600">⚠ 已过滤 {filteredCount} 条不属于当前环节的数据</div>}
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-3">
              {parsedRows.map((row, i) => (
                <div key={i} className="rounded-xl border border-purple-100 bg-white p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">#{i + 1}</div>
                    <button onClick={() => setParsedRows((prev) => prev.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 transition-all duration-200 hover:text-red-600 hover:underline">删除</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">子环节名称</label>
                      <input value={row.name} onChange={(e) => updateParsedRow(i, "name", e.target.value)}
                        className="h-8 w-full rounded-lg border border-purple-100 bg-white px-2 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">当前等级</label>
                      <select value={row.level} onChange={(e) => updateParsedRow(i, "level", Number(e.target.value))}
                        className="h-8 w-full rounded-lg border border-purple-100 bg-white px-2 text-sm outline-none focus:border-purple-300">
                        {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label} - {l.desc}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">AI 工具</label>
                      <input value={row.tool} onChange={(e) => updateParsedRow(i, "tool", e.target.value)}
                        className="h-8 w-full rounded-lg border border-purple-100 bg-white px-2 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">备注 / 卡点</label>
                      <input value={row.notes} onChange={(e) => updateParsedRow(i, "notes", e.target.value)}
                        className="h-8 w-full rounded-lg border border-purple-100 bg-white px-2 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {MONTH_KEYS.map((month) => (
                      <div key={month} className="flex-1">
                        <label className="mb-1 block text-xs text-slate-500">{MONTH_LABELS[month]}目标</label>
                        <select value={row[`forecast${month.charAt(0).toUpperCase()}${month.slice(1)}` as keyof ExcelParsedRow] ?? ""}
                          onChange={(e) => updateParsedRow(i, `forecast${month.charAt(0).toUpperCase()}${month.slice(1)}` as keyof ExcelParsedRow, e.target.value === "" ? null : Number(e.target.value))}
                          className="h-8 w-full rounded-lg border border-purple-100 bg-white px-2 text-sm outline-none focus:border-purple-300">
                          <option value="">-</option>
                          {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setParsedRows([]); }} className="rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95">重新选择文件</button>
              <button onClick={handleConfirm} className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-purple-700 hover:scale-105 hover:shadow-[0_6px_20px_rgba(140,120,180,0.3)] active:scale-95">
                确认导入 ({parsedRows.length} 条)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** 解析等级文本（如 "L1 制作辅助"、"L0 无AI介入"、"L3 半自主Agent"）为数字 */
const parseLevel = (val: string | number): number => {
  const s = String(val).trim().replace(/\\n/g, " ");
  const m = s.match(/L(\d)/);
  return m ? clampLevel(parseInt(m[1], 10)) : 0;
};

/** 清理文本：去除首尾空白和多余换行 */
const cleanText = (val: string | number): string => {
  return String(val).trim().replace(/\\n/g, "\n").replace(/\n{2,}/g, "\n").trim();
};

/** 解析 Excel 原始数据为子环节数据行
 *
 * 支持两种常见格式：
 *
 * 格式A — 标准盘点半（G78 业务盘点）：
 *   Row0: [环节, 子环节(分类), 子环节(名称), 当前AI等级, AI工具, 备注, AI计划, 4月, 5月, 6月, Q3, Q4]
 *   Row1: (目标等级子表头，可选)
 *   Row2+: 数据行，环节数据可能只出现在首行，后续行留空（自动向下填充）
 *
 * 格式B — 简单表头格式：
 *   Row0: [环节, 名称, 等级, 工具, 备注, 4月, 5月, 6月]
 *   Row1+: 数据行
 *
 * 格式C — 无表头格式：
 *   直接按列顺序: [名称, 等级, 工具, 备注, 4月, 5月, 6月]
 */
function parseExcelRows(rawData: string[][]): ExcelParsedRow[] {
  if (rawData.length === 0) return [];

  // 判断第一行是否是表头
  const headerKeywords = [
    "子环节", "名称", "等级", "level", "工具", "tool",
    "备注", "卡点", "notes", "目标", "ai", "apr", "may", "jun",
    "4月", "5月", "6月", "环节", "部门", "step", "ai工具", "当前",
  ];
  const firstRowStr = rawData[0].join(" ").toLowerCase();
  const hasHeader = headerKeywords.some((k) => firstRowStr.includes(k.toLowerCase()));

  // 列名 → 列索引的映射
  const colMap: Record<string, number> = {};
  let dataStartIndex = 0;

  if (hasHeader && rawData.length > 1) {
    const headers = rawData[0].map((h) => String(h).trim().toLowerCase());

    // 检查第二行是否是子表头（如"4月","5月","6月"之类的月份行）
    const secondRowStr = (rawData[1] || []).join(" ").toLowerCase();
    const isSubHeader = /4月|5月|6月|apr|may|jun|q3|q4/.test(secondRowStr) && !/L\d/.test(secondRowStr);

    headers.forEach((h, idx) => {
      // 环节列：匹配"环节"、"部门"（排除"子环节"）
      if (/^环节$|^部门$|^step$/.test(h) && !/子环节/.test(h)) colMap.step = idx;
      // 子环节列：可能有多个子环节列（分类+名称），取最后一个"子环节"列作为名称
      else if (/子环节|名称|name/.test(h)) colMap.name = idx;
      // 当前AI等级列：排除含"目标"的列（"目标AI应用等级"不是当前等级）
      else if ((/当前.*等级|^等级$|level/.test(h)) && !/目标/.test(h)) colMap.level = idx;
      // AI工具列
      else if (/工具|tool|ai工具/.test(h)) colMap.tool = idx;
      // 备注列
      else if (/备注|卡点|notes|描述/.test(h)) colMap.notes = idx;
      // 月份目标列：如果第二行是子表头，月份列从第二行读取
      // 在主表头中，月份可能是合并单元格的父标题（"目标AI应用等级"）
      else if (/目标/.test(h)) {
        // 这可能是合并表头，具体月份在第二行
        // 先跳过，后面从第二行取
      }
    });

    // 如果第二行是子表头，从中提取月份列索引
    if (isSubHeader) {
      const subHeaders = rawData[1].map((h) => String(h).trim().toLowerCase());
      subHeaders.forEach((h, idx) => {
        if (/^4月$|^apr/.test(h)) colMap.apr = idx;
        else if (/^5月$|^may/.test(h)) colMap.may = idx;
        else if (/^6月$|^jun/.test(h)) colMap.jun = idx;
      });
      dataStartIndex = 2;
    } else {
      // 单行表头模式：月份直接在第一行
      headers.forEach((h, idx) => {
        if (/4月|apr/.test(h)) colMap.apr = idx;
        else if (/5月|may/.test(h)) colMap.may = idx;
        else if (/6月|jun/.test(h)) colMap.jun = idx;
      });
      dataStartIndex = 1;
    }
  }

  const rows: ExcelParsedRow[] = [];
  let lastStep = ""; // 环节向下填充

  if (hasHeader) {
    for (let i = dataStartIndex; i < rawData.length; i++) {
      const cells = rawData[i];
      if (!cells || cells.length === 0) continue;

      const hasContent = cells.some((c) => String(c).trim() !== "");
      if (!hasContent) continue;

      // 环节向下填充：如果当前行有环节值则更新，否则沿用上一行
      const rawStep = colMap.step !== undefined ? cleanText(cells[colMap.step] ?? "") : "";
      if (rawStep) lastStep = rawStep;

      // 名称：优先用 name 列；如果有子环节分类列（colMap.name 之前有"子环节"列），尝试合并
      let name = colMap.name !== undefined ? cleanText(cells[colMap.name] ?? "") : "";

      // 如果 name 列为空，但该行有其他有效内容，尝试用第二个子环节列（索引 colMap.name - 1）
      if (!name && colMap.name !== undefined && colMap.name > 0) {
        const prevCol = cleanText(cells[colMap.name - 1] ?? "");
        if (prevCol) name = prevCol;
      }

      if (!name) continue;

      const level = colMap.level !== undefined ? parseLevel(cells[colMap.level] ?? "") : 0;
      const tool = colMap.tool !== undefined ? cleanText(cells[colMap.tool] ?? "") : "";
      const notes = colMap.notes !== undefined ? cleanText(cells[colMap.notes] ?? "") : "";
      const forecastApr = colMap.apr !== undefined && String(cells[colMap.apr] ?? "").trim() ? parseLevel(cells[colMap.apr]) : null;
      const forecastMay = colMap.may !== undefined && String(cells[colMap.may] ?? "").trim() ? parseLevel(cells[colMap.may]) : null;
      const forecastJun = colMap.jun !== undefined && String(cells[colMap.jun] ?? "").trim() ? parseLevel(cells[colMap.jun]) : null;

      rows.push({ name, step: lastStep, level, tool, notes, forecastApr, forecastMay, forecastJun });
    }
  } else {
    // 无表头模式：按列顺序推断 [名称, 等级, 工具, 备注, 4月, 5月, 6月]
    for (let i = 0; i < rawData.length; i++) {
      const cells = rawData[i];
      if (!cells || cells.length === 0) continue;

      const hasContent = cells.some((c) => String(c).trim() !== "");
      if (!hasContent) continue;

      const name = cleanText(cells[0] ?? "");
      if (!name) continue;

      let level = 0;
      let tool = "";
      let notes = "";
      let forecastApr: number | null = null;
      let forecastMay: number | null = null;
      let forecastJun: number | null = null;

      for (let c = 1; c < cells.length; c++) {
        const cell = cleanText(cells[c]);
        if (!cell) continue;

        if (/L\d/.test(cell)) {
          const v = parseLevel(cell);
          if (level === 0) level = v;
          else if (forecastApr === null) forecastApr = v;
          else if (forecastMay === null) forecastMay = v;
          else if (forecastJun === null) forecastJun = v;
        } else if (!tool) {
          tool = cell;
        } else {
          notes += (notes ? " " : "") + cell;
        }
      }
      rows.push({ name, step: "", level, tool, notes, forecastApr, forecastMay, forecastJun });
    }
  }

  return rows;
}

if (typeof window !== "undefined" && typeof (window as Window & { __AI_PROGRESS_SITE_TESTED__?: boolean }).__AI_PROGRESS_SITE_TESTED__ === "undefined") {
  (window as Window & { __AI_PROGRESS_SITE_TESTED__?: boolean }).__AI_PROGRESS_SITE_TESTED__ = false;
}
