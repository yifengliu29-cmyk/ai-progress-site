/**
 * Vite 配置：只读 HTML 导出 API
 *
 * 在开发模式下提供 /__export_readonly_html 端点
 * 前端 fetch 此端点 → 服务器端构建只读 HTML → 返回完整内联 HTML
 *
 * 策略：ESM 格式构建 + 内联所有资源到单个 HTML 文件
 * file:// 协议下 Chrome/Edge 支持 <script type="module">
 */
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const execFileAsync = promisify(execFile)

function exportReadonlyPlugin(): Plugin {
  return {
    name: 'export-readonly-html',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__export_readonly_html', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        try {
          // 读取请求体中的数据 JSON
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const body = Buffer.concat(chunks).toString()
          const data = JSON.parse(body)

          // 创建临时目录
          const tmpDir = resolve(__dirname, '.vite-tmp-readonly')
          if (existsSync(tmpDir)) {
            rmSync(tmpDir, { recursive: true, force: true })
          }
          mkdirSync(tmpDir, { recursive: true })

          const srcDir = resolve(__dirname, 'src')
          const rootDir = resolve(__dirname)
          const postScript = resolve(__dirname, 'post-inline-js.cjs').replace(/\\/g, '/')
          const distDir = resolve(tmpDir, 'dist').replace(/\\/g, '/')

          // 创建临时入口文件（只读模式）
          const tmpEntry = resolve(tmpDir, 'main-readonly.tsx')
          const relSrc = srcDir.replace(/\\/g, '/')
          writeFileSync(tmpEntry, `import React from 'react'
import { createRoot } from 'react-dom/client'
import '${relSrc}/index.css'
import AIProgressDepartmentSite from '${relSrc}/AIProgressDepartmentSite'

const data = ${JSON.stringify(data)}

// 注入数据到 localStorage（React 组件会从这里读取）
try { localStorage.setItem('ai-progress-department-site-v3', JSON.stringify(data)) } catch(e) {}

function App() {
  return React.createElement(AIProgressDepartmentSite, { readOnly: true })
}

createRoot(document.getElementById('root')!).render(React.createElement(App))
`, 'utf-8')

          // 创建临时 index.html
          const tmpHtml = resolve(tmpDir, 'index.html')
          writeFileSync(tmpHtml, `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI美术管线进度（只读预览）</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main-readonly.tsx"></script>
  </body>
</html>`, 'utf-8')

          // 创建临时 vite 配置 — ESM 格式，单文件输出
          const tmpConfig = resolve(tmpDir, 'vite.config.readonly.mjs')
          writeFileSync(tmpConfig, `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '${tmpDir.replace(/\\/g, '/')}',
  base: './',
  build: {
    outDir: '${distDir}',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: '${tmpHtml.replace(/\\/g, '/')}',
      output: {
        format: 'es',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
  logLevel: 'warn',
})
`, 'utf-8')

          // 执行构建
          try {
            const { stdout, stderr } = await execFileAsync('npx', ['vite', 'build', '--config', tmpConfig], {
              cwd: rootDir,
              env: { ...process.env },
              maxBuffer: 50 * 1024 * 1024,
              timeout: 180000,
              shell: true,
            })

            if (stdout) console.log('[BUILD STDOUT]', stdout)
            if (stderr) console.log('[BUILD STDERR]', stderr)

            // 检查构建产物
            if (!existsSync(distDir)) {
              res.statusCode = 500
              res.end('Build failed: dist directory not created')
              return
            }

            // 后处理：内联 JS/CSS 到 HTML
            const distHtmlPath = resolve(distDir, 'index.html')
            if (!existsSync(distHtmlPath)) {
              // 查找任何 HTML 文件
              const files = readdirSync(distDir)
              const htmlFile = files.find(f => f.endsWith('.html'))
              if (!htmlFile) {
                res.statusCode = 500
                res.end('Build failed: no HTML output found in dist. Files: ' + files.join(', '))
                return
              }
            }

            await execFileAsync('node', [postScript, distHtmlPath, distDir], {
              cwd: rootDir,
              maxBuffer: 50 * 1024 * 1024,
              timeout: 60000,
            })

            // 读取最终 HTML
            const finalHtml = readFileSync(distHtmlPath, 'utf-8')
            console.log('[EXPORT] Final HTML size:', finalHtml.length, 'chars')

            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(finalHtml)
          } catch (buildError: unknown) {
            console.error('Build error:', buildError)
            res.statusCode = 500
            const errMsg = buildError instanceof Error ? buildError.message : String(buildError)
            const stderrMsg = (buildError as { stderr?: string }).stderr || ''
            res.end('Build failed: ' + errMsg + '\n' + stderrMsg)
          } finally {
            // 清理临时文件
            try { rmSync(tmpDir, { recursive: true, force: true, maxRetries: 3 }) } catch {}
          }
        } catch (error) {
          console.error('Export error:', error)
          res.statusCode = 500
          res.end('Error: ' + (error instanceof Error ? error.message : String(error)))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), exportReadonlyPlugin()],
})
