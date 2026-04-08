import { useState, useEffect } from 'react'
import './index.css'
import AIProgressDepartmentSite from './AIProgressDepartmentSite'

const ACCESS_PASSWORD = 'NOVIX-G78'
const STORAGE_KEY_AUTH = 'ai-progress-authenticated'

function App({ readOnly = false }: { readOnly?: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查是否已经通过验证
    const authStatus = localStorage.getItem(STORAGE_KEY_AUTH)
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ACCESS_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem(STORAGE_KEY_AUTH, 'true')
      setError('')
    } else {
      setError('密码错误，请重试')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-slate-400">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl shadow-[0_20px_60px_rgba(139,92,246,0.15)] p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 mb-4">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-slate-800 mb-2">访问验证</h1>
              <p className="text-slate-500 text-sm">请输入访问密码以继续</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入访问密码"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all placeholder:text-slate-400"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300"
              >
                验证访问
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

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
