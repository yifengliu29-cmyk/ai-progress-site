/**
 * 部署版本的默认数据
 * 
 * 使用方法：
 * 1. 在开发版本中点击「📤 导出数据」按钮，下载 JSON 文件
 * 2. 将 JSON 文件内容复制到下面的 DEFAULT_DATA 常量中
 * 3. 部署到 Vercel 后，其他人打开链接就能看到你的数据
 */

export const DEFAULT_DATA = {
  "_version": 1,
  "_exportedAt": "2026-04-08T09:06:53.321Z",
  "departmentName": "G78决战平安京",
  "selectedStep": "特效",
  "stepUiState": {
    "deleted-场景编辑": true
  },
  "stepWeights": {
    "CG动画": 3,
    "角色原画": 2,
    "3D角色": 3,
    "特效": 3,
    "引擎动画": 2,
    "美宣": 2,
    "UGC生产": 3,
    "测试": 3
  },
  "customSteps": [
    "UGC生产"
  ],
  "subSteps": {
    "角色原画": [
      {
        "id": "角色原画-1775210418842-ggo2fa",
        "name": "需求与风格确认",
        "tool": "nanobanana/即梦/comfyUI/MJ",
        "notes": "对于G78高设计难度、高定制化、细设计颗粒度的项目，AI概念仅能解决需求侧相对模糊的前期方向指引or相对简单的需求，在定制化需求上无法生成达到项目设计品质的设计",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775548516795-0-zczq5r",
            "month": "apr",
            "name": "跑通标杆设计方向和规范",
            "content": "",
            "owner": "德子",
            "status": "done"
          },
          {
            "id": "task-1775548531843-0-v8iuyo",
            "month": "may",
            "name": "设计AI流程搭建",
            "content": "",
            "owner": "德子",
            "status": "doing"
          },
          {
            "id": "task-1775548552635-0-a7t2ih",
            "month": "jun",
            "name": "集成天工agent",
            "content": "",
            "owner": "德子",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "角色原画-1775210418842-bh6gar",
        "name": "概念草图/剪影",
        "tool": "nanobanana/即梦/comfyUI/MJ",
        "notes": "对于G78高设计难度、高定制化、细设计颗粒度的项目，AI概念仅能解决需求侧相对模糊的前期方向指引or相对简单的需求，在定制化需求上无法生成达到项目设计品质的设计",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775548595731-1-t5gpf0",
            "month": "may",
            "name": "设计AI流程搭建",
            "content": "通过草图+AI的形式",
            "owner": "德子",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "角色原画-1775210418842-d5fl4g",
        "name": "细化上色",
        "tool": "SD/banana",
        "notes": "细化后模糊/设计细节不到位",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775548645922-2-atuks8",
            "month": "jun",
            "name": "集成到agent",
            "content": "完成细化流程SD接入天宫",
            "owner": "",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "角色原画-1775635363235-7ufx5x",
        "name": "三视图",
        "tool": "",
        "notes": "",
        "forecastLevels": {
          "apr": null,
          "may": null,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775635404049-3-4wfkvu",
            "month": "apr",
            "name": "三视图概念AI流程",
            "content": "优化原有的三视图人工流程",
            "owner": "德子",
            "status": "done"
          },
          {
            "id": "task-1775635440776-3-4wqooi",
            "month": "jun",
            "name": "集成agent",
            "content": "天工",
            "owner": "德子",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "角色原画-1775210418842-jcqacm",
        "name": "三视图细化",
        "tool": "Nano banana+comfyUI",
        "notes": "大模型一致性问题，设计结构不还原/生图后设计细节模糊/细节结构bug多/定制化花纹精度差，无法给下游环节提供准确指导，需手工修正",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775548806930-4-muf8e9",
            "month": "apr",
            "name": "跑通AI三视图流程",
            "content": "banana",
            "owner": "潘潘",
            "status": "doing"
          },
          {
            "id": "task-1775548823338-4-mo7k0f",
            "month": "may",
            "name": "集成到agent",
            "content": "生成高精度的用于CG的三视图",
            "owner": "潘潘",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      }
    ],
    "场景原画": [
      {
        "id": "场景原画-1775210409571-74g88e",
        "name": "需求与风格确认",
        "tool": "banana",
        "notes": "需要局部处理，再拼接，手绘调修",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549393594-0-2vm7z7",
            "month": "apr",
            "name": "提升AI比重",
            "content": "",
            "owner": "彦举",
            "status": "doing"
          },
          {
            "id": "task-1775549402618-0-6hwl80",
            "month": "jun",
            "name": "集成agent",
            "content": "",
            "owner": "彦举",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "场景原画-1775210409571-rdpqyk",
        "name": "概念草稿",
        "tool": "banana",
        "notes": "需要局部处理，再拼接，手绘调修",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549419297-1-rxr3si",
            "month": "apr",
            "name": "提升AI比重",
            "content": "",
            "owner": "彦举",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "场景原画-1775210409571-8gjx29",
        "name": "设计阶段",
        "tool": "banana",
        "notes": "需要局部处理，再拼接",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549438857-2-9ijpz7",
            "month": "apr",
            "name": "提升AI比重",
            "content": "",
            "owner": "彦举",
            "status": "doing"
          },
          {
            "id": "task-1775549453513-2-dfn9s4",
            "month": "jun",
            "name": "集成agent",
            "content": "可以基于需求文档直接生成对应的落版场景图",
            "owner": "彦举",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "场景原画-1775210409571-zv5j1e",
        "name": "细化阶段",
        "tool": "banana",
        "notes": "刻画表现方向差异，需要手绘处理",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549487505-3-een1xb",
            "month": "apr",
            "name": "优化生成效果",
            "content": "可以训练项目的lora",
            "owner": "彦举",
            "status": "todo"
          },
          {
            "id": "task-1775549516786-3-hkbux7",
            "month": "jun",
            "name": "集成到agent",
            "content": "输出细化完成的落版场景图",
            "owner": "彦举",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      }
    ],
    "美宣": [
      {
        "id": "美宣-1775210426516-l7md09",
        "name": "前期需求确认",
        "tool": "SD/midjourney",
        "notes": "在大场景中角色可控程度低",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775212790965-0-bjevw2",
            "month": "may",
            "name": "需求agent",
            "content": "需求的拆解读取流程等都集成在agent内，可以基于文档自动生成prompt",
            "owner": "潘潘",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "美宣-1775210426516-9gzdvz",
        "name": "反馈指引",
        "tool": "SD/banana",
        "notes": "人工调整动态/光影/氛围后，AI辅助推进",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775547752924-1-d75wqc",
            "month": "jun",
            "name": "agent反馈",
            "content": "尝试agent基于画风文档基于现有图的反馈",
            "owner": "潘潘",
            "status": "todo"
          },
          {
            "id": "task-1775634942565-1-2zsvw5",
            "month": "apr",
            "name": "项目宣传规则md",
            "content": "约束审核skill",
            "owner": "潘潘",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "美宣-1775213328909-m7vshr",
        "name": "概念设计",
        "tool": "SD/banana",
        "notes": "",
        "forecastLevels": {
          "apr": null,
          "may": null,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775547863892-2-nz858n",
            "month": "apr",
            "name": "banana宣传流程",
            "content": "",
            "owner": "潘潘",
            "status": "todo"
          },
          {
            "id": "task-1775547921403-2-p0tra7",
            "month": "jun",
            "name": "集成到agent",
            "content": "",
            "owner": "潘潘",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "美宣-1775210426516-zsqsfe",
        "name": "细化制作",
        "tool": "SD/banana",
        "notes": "AI辅助推进细化，辅助后内容与设计不符，不合理内容\n以及花纹需要手动调整",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775547939587-3-6nwq6r",
            "month": "apr",
            "name": "训练项目lora",
            "content": "高模修图",
            "owner": "潘潘",
            "status": "doing"
          },
          {
            "id": "task-1775547974644-3-f1pt0w",
            "month": "jun",
            "name": "接入agent",
            "content": "模型渲染图丢给天工，天工出高模修图完成版",
            "owner": "潘潘",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      }
    ],
    "3D角色": [
      {
        "id": "3D角色-1775210391355-06gxzd",
        "name": "大型搭建",
        "tool": "Tripo\\混元3d\\banana",
        "notes": "目前主流大模型在生成 3D 模型时，尚存在生成精度不足的问题，其输出效果暂未达到商业化高品质模型的标准。同时，模型对叠压结构的语义理解存在较大偏差，易导致出现面片粘连、层级关系混乱等典型瑕疵",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775534114414-0-m77uhy",
            "month": "apr",
            "name": "拆分组件生成流程",
            "content": "banana先做拆分清晰，分块生成，提高大型的AI占比",
            "owner": "煊赫",
            "status": "done"
          },
          {
            "id": "task-1775637773355-0-l6gah9",
            "month": "jun",
            "name": "集成天工",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "3D角色-1775616218701-kot8c1",
        "name": "局内用（动作版）",
        "tool": "Tripo\\混元3d\\banana",
        "notes": "",
        "forecastLevels": {
          "apr": null,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775616325185-1-dt8i31",
            "month": "may",
            "name": "天工接入",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "3D角色-1775210391355-zhe7dz",
        "name": "高模制作",
        "tool": "Tripo、banana",
        "notes": "目前主流大模型在生成 3D 模型时，尚存在生成精度不足的问题，其输出效果暂未达到商业化高品质模型的标准。同时，模型对叠压结构的语义理解存在较大偏差，易导致出现面片粘连、层级关系混乱等典型瑕疵",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775616696623-2-9gztzc",
            "month": "may",
            "name": "提高AI占比",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "3D角色-1775210391355-a4o9sn",
        "name": "高模细化",
        "tool": "",
        "notes": "目前主流大模型在生成 3D 模型时，尚存在生成精度不足的问题，其输出效果暂未达到商业化高品质模型的标准。同时，模型对叠压结构的语义理解存在较大偏差，易导致出现面片粘连、层级关系混乱等典型瑕疵",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775534326881-2-cz3euh",
            "month": "apr",
            "name": "细化流程反馈优化",
            "content": "通过AI生成的高模+三视图，叠给AI继续反馈外包修改",
            "owner": "煊赫",
            "status": "doing"
          },
          {
            "id": "task-1775534467215-2-b3o4xy",
            "month": "jun",
            "name": "细化agent",
            "content": "通过读取生成的模型，自动banana优化结构再生成",
            "owner": "煊赫",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "3D角色-1775210391355-qorqzr",
        "name": "拓扑/重布线",
        "tool": "Tripo",
        "notes": "可生成基本mesh，但无法满足项目定制化需求，如布线疏密规则；动画线等定制化要求，目前ai无法胜任",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775534538501-3-pf5jdh",
            "month": "apr",
            "name": "新工具探索",
            "content": "自动化的拓扑工具探索（比如blender的自动拓扑）",
            "owner": "煊赫",
            "status": "doing"
          },
          {
            "id": "task-1775534626276-3-q68rs2",
            "month": "may",
            "name": "提高AI占比",
            "content": "应用落地，AI自动化拓扑",
            "owner": "煊赫",
            "status": "todo"
          },
          {
            "id": "task-1775534663964-3-0w8o0j",
            "month": "jun",
            "name": "集成在agent内",
            "content": "并到agent流程内，自动拓扑",
            "owner": "煊赫",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "3D角色-1775210391355-lmzr5s",
        "name": "UV展开",
        "tool": "",
        "notes": "目前ai生成uv效果较差，会出现精度分布不合理；摆放不合理；无法识别对称部件等问题，对贴图精度影响较大",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775544940116-4-x9xr1e",
            "month": "apr",
            "name": "探索新的UV工具",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "3D角色-1775210391355-ay6mh0",
        "name": "烘焙",
        "tool": "",
        "notes": "nomal: 主流大模型暂时无此功能",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775545108028-5-54jc2q",
            "month": "apr",
            "name": "探索烘焙软件接入到agent",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "3D角色-1775210391355-c0lqum",
        "name": "绘制",
        "tool": "Tripo、banana",
        "notes": "diffuse/base colour：当前模型主要依赖纹理映射生成，与物体结构的匹配度较弱，难以实现拓扑结构与色彩信息的精准联动 \n金属度粗糙度: 目前也没有很好的设别方案，ai无法精确识别质感",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 1
        },
        "tasks": [
          {
            "id": "task-1775545156924-6-846vud",
            "month": "apr",
            "name": "banana细化贴图",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "3D角色-1775210391355-13arj5",
        "name": "引擎导入与设置",
        "tool": "Tripo、banana",
        "notes": "该环节对审美能力与项目深度理解要求较高，暂无ai方案替代，需人工深度参与。",
        "forecastLevels": {
          "apr": 0,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775545662278-7-bzmlr5",
            "month": "may",
            "name": "AI引擎初步联调",
            "content": "",
            "owner": "煊赫",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 0
      }
    ],
    "3D场景": [
      {
        "id": "3D场景-1775210376956-6evrfx",
        "name": "中模搭建",
        "tool": "tripo",
        "notes": "中模后续需要修改为高模和低模使用，AI生成的模型修改难度大，所以没有使用",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549123538-0-jqktha",
            "month": "may",
            "name": "集成到agent",
            "content": "可以通过概念图拆分生成必要的模型组件",
            "owner": "军培",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "3D场景-1775210376956-d9a4jq",
        "name": "贴图绘制",
        "tool": "Banana pro, KIMI, DreamMake",
        "notes": "主要用于贴图小修改，例如换色或者移除部分做旧/青苔/锈迹等。大幅度的贴图修改还不能保证和原来的贴图风格一致",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549220305-1-eypnkq",
            "month": "may",
            "name": "模型生成后贴图优化",
            "content": "使用工具优化tripo的贴图",
            "owner": "军培",
            "status": "todo"
          },
          {
            "id": "task-1775549249825-1-vslizs",
            "month": "jun",
            "name": "集成到agent",
            "content": "测试集成（若无需求）",
            "owner": "军培",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "3D场景-1775210376956-v6h26x",
        "name": "导入引擎",
        "tool": "",
        "notes": "项目场景量少，4月无需求",
        "forecastLevels": {
          "apr": 0,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549347994-2-jh8wh3",
            "month": "may",
            "name": "配置自动化",
            "content": "可以通过脚本调用打开场景落版",
            "owner": "军培",
            "status": "todo"
          },
          {
            "id": "task-1775549371202-2-deouzp",
            "month": "jun",
            "name": "集成到agent",
            "content": "",
            "owner": "军培",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "3D场景-1775549163970-fuw975",
        "name": "天空盒生成",
        "tool": "",
        "notes": "",
        "forecastLevels": {
          "apr": null,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549180402-3-2sjhza",
            "month": "may",
            "name": "天空盒AI工具",
            "content": "",
            "owner": "军培",
            "status": "todo"
          },
          {
            "id": "task-1775549196866-3-33k6jg",
            "month": "jun",
            "name": "集成到Agent",
            "content": "",
            "owner": "军培",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      }
    ],
    "场景编辑": [],
    "CG动画": [
      {
        "id": "CG动画-1775210452595-sdulsi",
        "name": "展示特写设计",
        "tool": "Gemini\\豆包\\seedance\\天工",
        "notes": "项目要需求较高文案需要按需调整\\抽卡\\生成周期\\剪辑\\",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775210799968-0-gyrich",
            "month": "may",
            "name": "天工导演agent",
            "content": "直接基于需求文档生成剧本",
            "owner": "云涛",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "CG动画-1775210452595-xl207j",
        "name": "展示特写动画",
        "tool": "Gemini\\豆包\\seedance\\天工",
        "notes": "项目要需求较高文案需要按需调整\\抽卡\\生成周期\\剪辑\\\n旧世界仍需要传统流程制作\\AI动作无法落地风格化制作",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775548227907-1-2wy3r3",
            "month": "may",
            "name": "天工制片agent",
            "content": "集成导演和制片内容，通过文档可以生成剧本后自动跑seedance，生成多版内容供审核",
            "owner": "云涛",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      }
    ],
    "引擎动画": [
      {
        "id": "引擎动画-1775210444084-mz2r2b",
        "name": "骨骼搭建",
        "tool": "",
        "notes": "AccuRIG / Character Creator / Mixamo\n这些只能应对结构简单的人体无衣服和挂件的绑定\n当服装和道具结构复杂，当前AI无法胜任",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549667697-0-oo5ufa",
            "month": "apr",
            "name": "探索骨骼搭建工具",
            "content": "",
            "owner": "军彪",
            "status": "doing"
          },
          {
            "id": "task-1775549683298-0-ub2ohv",
            "month": "may",
            "name": "提升AI生成占比",
            "content": "",
            "owner": "军彪",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "引擎动画-1775210444084-36t7hu",
        "name": "互动动作设计",
        "tool": "Gemini\\豆包\\seedance\\天工",
        "notes": "项目要需求较高文案需要按需调整\\抽卡\\生成周期\\剪辑\\",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549772404-2-ctr9as",
            "month": "apr",
            "name": "通过sd生成动作参考",
            "content": "",
            "owner": "军彪",
            "status": "doing"
          },
          {
            "id": "task-1775549802084-2-zvgx0j",
            "month": "jun",
            "name": "集成到agent",
            "content": "通过文档描述，直接生成对应的互动动作视频",
            "owner": "军彪",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "引擎动画-1775210444084-irstns",
        "name": "局内战斗功能",
        "tool": "Gemini\\豆包\\seedance\\天工",
        "notes": "当前功能类动作，需要风格加适配度加打击感，当前AI落地效果欠佳\n可辅助做设计暂无法脱离人工",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549855779-3-8ht2x0",
            "month": "jun",
            "name": "尝试跑通sd生成流程",
            "content": "等sd稳定后",
            "owner": "军彪",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "引擎动画-1775210444084-0mjbjw",
        "name": "面部动作制作",
        "tool": "",
        "notes": "涉及到资源复用骨骼迭代的问题，风格化较强",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549872610-4-g28mg6",
            "month": "apr",
            "name": "探索新AI工具落地",
            "content": "",
            "owner": "军彪",
            "status": "doing"
          },
          {
            "id": "task-1775549890888-4-ztrwoh",
            "month": "jun",
            "name": "集成agent",
            "content": "",
            "owner": "军彪",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "引擎动画-1775210444084-4so9j2",
        "name": "动作联调",
        "tool": "",
        "notes": "风格化处理及调优，AI暂时做不到，都需要人力干预",
        "forecastLevels": {
          "apr": 0,
          "may": 0,
          "jun": 0
        },
        "tasks": [],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "引擎动画-1775210444084-vof653",
        "name": "动作导出挂接",
        "tool": "",
        "notes": "",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775549907760-6-otkwxc",
            "month": "jun",
            "name": "集成客户端agent",
            "content": "",
            "owner": "军彪",
            "status": "todo"
          },
          {
            "id": "task-1775637083676-5-muwg5t",
            "month": "may",
            "name": "AI接入",
            "content": "",
            "owner": "军彪",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      }
    ],
    "特效": [
      {
        "id": "特效-1775210433658-ahtxma",
        "name": "特效原画设计",
        "tool": "banana\\天工\\seedance\\Gemini\\豆包",
        "notes": "特效内容不稳定，大部分生成效果比较单一，\n并且大部分不能分层，只能抠图但不准，就算能分层也比较乱",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549568446-0-ij61c2",
            "month": "may",
            "name": "提升AI比重",
            "content": "",
            "owner": "郑洪",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "特效-1775210433658-fhrpbz",
        "name": "特效模型设计",
        "tool": "Tripo\\混元3d\\Rodin3D",
        "notes": "特效模型的uv适配问题，目前AI模型很多不适配特效，并且很多AI面数下限也很高（tripo3d稍微好一点）",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549581300-1-8htpis",
            "month": "apr",
            "name": "提升AI比重",
            "content": "",
            "owner": "郑洪",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "特效-1775210433658-dki8bf",
        "name": "特效贴图制作",
        "tool": "banana",
        "notes": "普通状态贴图可使用，生成复杂设计的内容容易混乱。",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549591604-2-s0vhlz",
            "month": "may",
            "name": "提升AI比重",
            "content": "",
            "owner": "郑洪",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "特效-1775210433658-msf0k7",
        "name": "粒子基础形态搭建",
        "tool": "NX",
        "notes": "困难，依赖大模型的提升，NX目前缺少MCP或cli，未能接入；但可以尝试训练skills",
        "forecastLevels": {
          "apr": 0,
          "may": 0,
          "jun": 0
        },
        "tasks": [],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "特效-1775210433658-hxj14w",
        "name": "粒子动态曲线调节",
        "tool": "NX",
        "notes": "困难，依赖大模型的提升，NX目前缺少MCP或cli，未能接入；但可以尝试训练skills",
        "forecastLevels": {
          "apr": 0,
          "may": 0,
          "jun": 0
        },
        "tasks": [],
        "isExpanded": false,
        "level": 0
      },
      {
        "id": "特效-1775210433658-3bqy74",
        "name": "渲染顺序与层级调整",
        "tool": "程序同学已介入引擎AI优化",
        "notes": "程序同学已介入引擎AI优化",
        "forecastLevels": {
          "apr": 1,
          "may": 1,
          "jun": 1
        },
        "tasks": [],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "特效-1775210433658-jdz20v",
        "name": "特效工具优化",
        "tool": "序列图目前工具ImageEditor",
        "notes": "暂无完整AI接入",
        "forecastLevels": {
          "apr": 0,
          "may": 0,
          "jun": 0
        },
        "tasks": [],
        "isExpanded": false,
        "level": 1
      },
      {
        "id": "特效-1775210433658-7l2bvp",
        "name": "特效性能调试",
        "tool": "NXAI-LOD工具",
        "notes": "未开始，暂无卡点，可优先训练这块",
        "forecastLevels": {
          "apr": 1,
          "may": 2,
          "jun": 2
        },
        "tasks": [
          {
            "id": "task-1775549644106-7-2a245q",
            "month": "apr",
            "name": "优化LOD工具",
            "content": "",
            "owner": "郑洪",
            "status": "doing"
          }
        ],
        "isExpanded": false,
        "level": 1
      }
    ],
    "TA": [
      {
        "id": "TA-1775210456747-adn7xn",
        "name": "渲染shader ",
        "tool": "codemaker、Grok",
        "notes": "",
        "forecastLevels": {
          "apr": 2,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775634060141-0-67fwrp",
            "month": "may",
            "name": "集成到天工开发",
            "content": "相关的渲染需求和项目TA业务用天工开发",
            "owner": "孟博士",
            "status": "doing"
          },
          {
            "id": "task-1775634140741-0-sk78ic",
            "month": "jun",
            "name": "全自动需求处理",
            "content": "相关需求全自动编写，人工少量审核跟进",
            "owner": "孟博士",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "TA-1775210470906-ret50b",
        "name": "天工开发推进",
        "tool": "天工",
        "notes": "",
        "forecastLevels": {
          "apr": 3,
          "may": 3,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775634069453-1-26sj4d",
            "month": "apr",
            "name": "组内agent教学分享",
            "content": "skill配置搭建和案例推广等",
            "owner": "孟博士",
            "status": "doing"
          },
          {
            "id": "task-1775634196539-1-6rcv8c",
            "month": "may",
            "name": "项目知识库和skill库管理",
            "content": "搭建完整的知识库，收敛skill并且做优化内容",
            "owner": "孟博士",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      },
      {
        "id": "TA-1775635542143-cb31ol",
        "name": "NX-AI推进",
        "tool": "NX引擎编辑器的AI相关接口规划与推进",
        "notes": "",
        "forecastLevels": {
          "apr": 2,
          "may": 2,
          "jun": 3
        },
        "tasks": [
          {
            "id": "task-1775635575947-2-shbl9s",
            "month": "apr",
            "name": "引擎接口提需规划",
            "content": "各环节基于天工和NX提需推进和相关盘点",
            "owner": "孟博士",
            "status": "doing"
          },
          {
            "id": "task-1775635628474-2-rxwf50",
            "month": "jun",
            "name": "相关接口开发完成初版",
            "content": "集成到天工接口",
            "owner": "孟博士",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 1
      }
    ],
    "TA啊": [],
    "测试": [
      {
        "id": "测试-1775214041049-xx0sor",
        "name": "",
        "tool": "",
        "notes": "",
        "forecastLevels": {
          "apr": 4,
          "may": 5,
          "jun": 5
        },
        "tasks": [],
        "isExpanded": false,
        "level": 0
      }
    ],
    "UGC生产": [
      {
        "id": "UGC生产-1775211439944-ursfiq",
        "name": "设计UGC生成",
        "tool": "游戏内置banana",
        "notes": "生成效果优化和玩家反馈",
        "forecastLevels": {
          "apr": null,
          "may": 4,
          "jun": 4
        },
        "tasks": [
          {
            "id": "task-1775212513189-0-i8hnxn",
            "month": "apr",
            "name": "游戏客户端投放",
            "content": "跟进到外放客户端测试OK",
            "owner": "煊赫",
            "status": "doing"
          },
          {
            "id": "task-1775545933745-0-5wu2vk",
            "month": "may",
            "name": "优化生成效果流程",
            "content": "生图模型都需要优化，banana+即梦5.0",
            "owner": "煊赫",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 3
      },
      {
        "id": "UGC生产-1775211469798-s2ko4k",
        "name": "模型UGC生成",
        "tool": "游戏内置第三方AI模型",
        "notes": "生成效果优化和玩家反馈",
        "forecastLevels": {
          "apr": null,
          "may": 4,
          "jun": 4
        },
        "tasks": [
          {
            "id": "task-1775547273293-1-waxy6d",
            "month": "apr",
            "name": "游戏客户端投放",
            "content": "跟进到外放客户端测试OK",
            "owner": "煊赫",
            "status": "doing"
          },
          {
            "id": "task-1775547282413-1-o3lq8p",
            "month": "may",
            "name": "优化生成效果流程",
            "content": "3D生成模型都需要优化，看供应商tripo",
            "owner": "煊赫",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 3
      },
      {
        "id": "UGC生产-1775634463316-ednl1t",
        "name": "预设动作制作",
        "tool": "",
        "notes": "",
        "forecastLevels": {
          "apr": 2,
          "may": 4,
          "jun": 4
        },
        "tasks": [
          {
            "id": "task-1775634488274-2-40wqga",
            "month": "apr",
            "name": "跑通重映射骨骼 ",
            "content": "UGC制作的模型映射到预设动作上",
            "owner": "军彪",
            "status": "done"
          },
          {
            "id": "task-1775634559516-2-1hj14r",
            "month": "may",
            "name": "客户端自运行",
            "content": "无需人工配置审核，直接面向玩家",
            "owner": "煊赫",
            "status": "todo"
          }
        ],
        "isExpanded": false,
        "level": 2
      }
    ]
  }
} as const;
