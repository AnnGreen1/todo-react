/**
 * 应用入口文件
 * 负责初始化 React 应用并渲染到 DOM
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 初始待办事项数据
// eslint-disable-next-line react-refresh/only-export-components
const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

// 创建 React 根节点并渲染应用
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tasks={DATA} />
  </React.StrictMode>,
)
