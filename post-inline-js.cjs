/**
 * post-inline-js.cjs — Vite 构建后处理脚本
 * 
 * 原始 HTML 结构：
 * <head>
 *   <meta>...
 *   <title>...</title>
 *   <script src="app.js"></script>
 *   <link rel="stylesheet" href="app.css">
 * </head>
 * <body>...</body>
 * 
 * 目标：
 * <head>
 *   <meta>...
 *   <title>...</title>
 *   <script type="module">内联JS</script>
 *   <style>内联CSS</style>
 * </head>
 * <body>...</body>
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node post-inline-js.cjs <html-path> <dist-dir>');
  process.exit(1);
}

const htmlPath = path.resolve(args[0]);
const distDir = path.resolve(args[1]);

function processHtml() {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // ====== 第一步：读取外部文件 ======
  
  // 匹配外部 script 标签
  const scriptRegex = /<script[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/i;
  const scriptMatch = html.match(scriptRegex);
  
  let js = '';
  let scriptTag = '';
  let scriptTagIdx = -1;
  
  if (scriptMatch) {
    scriptTag = scriptMatch[0];
    scriptTagIdx = scriptMatch.index;
    const src = scriptMatch[1];
    const jsPath = path.resolve(distDir, src);
    
    if (fs.existsSync(jsPath)) {
      js = fs.readFileSync(jsPath, 'utf-8');
      console.log('[post-inline] Read JS from', src, 'size:', js.length, 'chars');
      
      // 转义 JS
      const closeTagCount = (js.match(/<\//g) || []).length;
      if (closeTagCount > 0) {
        console.log('[post-inline] Escaping', closeTagCount, '</ sequences in JS');
        js = js.replace(/<\//g, '<\\/');
      }
    }
  }
  
  // 读取 CSS 文件
  const cssFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.css'));
  let cssContent = '';
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(path.join(distDir, cssFile), 'utf-8');
    cssContent += css + '\n';
  }
  if (cssContent) {
    console.log('[post-inline] Read CSS from', cssFiles.length, 'files');
  }
  
  // ====== 第二步：构建新 HTML ======
  
  // 找关键位置
  const headCloseIdx = html.indexOf('</head>');
  
  if (headCloseIdx === -1) {
    console.log('[post-inline] Malformed HTML: missing </head>');
    return html;
  }
  
  let newHtml = '';
  
  // 如果有外部 script，替换它
  if (scriptTag && scriptTagIdx >= 0 && scriptTagIdx < headCloseIdx) {
    // Part 1: 开头到 script 标签
    newHtml += html.substring(0, scriptTagIdx);
    
    // Part 2: 内联 JS
    newHtml += '<script type="module">\n' + js + '\n</script>\n';
    
    // Part 3: script 标签后到 </head>（跳过外部 link）
    // 需要跳过 <link rel="stylesheet"...>
    const afterScript = html.substring(scriptTagIdx + scriptTag.length, headCloseIdx);
    const withoutLink = afterScript.replace(/<link[^>]*\bhref=["'][^"']*\.css["'][^>]*\/?>/gi, '');
    newHtml += withoutLink;
    
    // Part 4: 内联 CSS（如果有）
    if (cssContent) {
      newHtml += '<style>\n' + cssContent + '</style>\n';
    }
  } else {
    // 没有外部 script，直接处理
    newHtml += html.substring(0, headCloseIdx);
    if (cssContent) {
      newHtml += '<style>\n' + cssContent + '</style>\n';
    }
  }
  
  // Part 5: </head> 到结尾
  newHtml += html.substring(headCloseIdx);
  
  // 写入文件
  fs.writeFileSync(htmlPath, newHtml, 'utf-8');
  
  const finalSize = fs.statSync(htmlPath).size;
  console.log('[post-inline] Final HTML: ' + finalSize + ' bytes (' + (finalSize / 1024 / 1024).toFixed(1) + ' MB)');
  
  return newHtml;
}

processHtml();
