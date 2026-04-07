import React from 'react'
import { createRoot } from 'react-dom/client'
import 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/src/index.css'
import AIProgressDepartmentSite from 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/src/AIProgressDepartmentSite'

const data = {"projectName":"G78决战平安京","aiMaturityLevel":2,"artLinks":[{"name":"角色原画","subLinks":[{"name":"角色设计","aiTool":"","notes":"测试","targetLevel":2,"tasks":[]}]}]}

try { localStorage.setItem('ai-progress-department-site-v3', JSON.stringify(data)) } catch(e) {}

function ReadOnlyApp() {
  return React.createElement(AIProgressDepartmentSite, { readOnly: true })
}

createRoot(document.getElementById('root')!).render(React.createElement(ReadOnlyApp))
