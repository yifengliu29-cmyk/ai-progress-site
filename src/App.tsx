import './index.css'
import AIProgressDepartmentSite from './AIProgressDepartmentSite'

function App({ readOnly = false }: { readOnly?: boolean }) {
  return <AIProgressDepartmentSite readOnly={readOnly} />
}

// 只读导出模式：从 window.__READONLY_DATA__ 加载数据
declare global {
  interface Window {
    __READONLY_DATA__?: Record<string, unknown>;
  }
}

// 动态导出只读版本
export { App }

export default function DefaultApp() {
  return <App />
}
