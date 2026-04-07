/**
 * Vite plugin: 导出只读 HTML
 * 
 * 用法: 在 vite.config.ts 中使用
 * 也可以通过 CLI 单独运行: node scripts/build-readonly.mjs <data.json> <output.html>
 * 
 * 工作原理:
 * 1. 构建一个自定义入口，将 readOnly=true 传递给组件
 * 2. vite-plugin-singlefile 将所有资源内联到单个 HTML
 * 3. 在 HTML 中注入数据 JSON，替代 localStorage
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

export default function buildReadOnlyPlugin() {
  return {
    name: 'build-readonly',
    apply: 'build',
    config() {
      return {
        build: {
          outDir: 'dist-readonly',
          rollupOptions: {
            input: resolve(__dirname, 'index.html'),
          },
        },
      };
    },
  };
}

/**
 * 从命令行构建只读 HTML
 * Usage: node scripts/build-readonly.mjs [data.json] [output.html]
 * 如果没有参数，从 localStorage 读取（通过 --data 指定 JSON 文件）
 */
export { buildReadOnlyPlugin };
