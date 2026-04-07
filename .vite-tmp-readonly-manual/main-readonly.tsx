import React from 'react'
import { createRoot } from 'react-dom/client'
import 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/src/index.css'
import AIProgressDepartmentSite from 'C:/Users/gzliuyifeng/WorkBuddy/20260403153329/app/src/AIProgressDepartmentSite'

const data = {"departmentName":"测试","selectedStep":null,"stepUiState":{},"stepWeights":{},"customSteps":[],"subSteps":{}}

try { localStorage.setItem('ai-progress-department-site-v3', JSON.stringify(data)) } catch(e) {}

function App() {
  return React.createElement(AIProgressDepartmentSite, { readOnly: true })
}

createRoot(document.getElementById('root')!).render(React.createElement(App))
