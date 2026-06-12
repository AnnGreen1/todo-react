# TodoMatic 项目文档

## 项目概述

TodoMatic 是一个功能完整的待办事项管理应用，基于 React 构建，是 MDN（ Mozilla Developer Network ）官方 React 教程的示例项目。

**项目来源**：[MDN React 教程](https://developer.mozilla.org/zh-CN/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_todo_list_beginning)

**在线演示**：https://mdn.github.io/todo-react/

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| Vite | 5.4.21 | 构建工具 |
| nanoid | 5.1.6 | ID 生成库 |
| ESLint | 8.57.1 | 代码检查工具 |

---

## 项目结构

```
todo-react/
├── src/
│   ├── components/          # React 组件
│   │   ├── Todo.jsx         # 待办事项组件（核心组件）
│   │   ├── Form.jsx         # 添加任务表单组件
│   │   └── FilterButton.jsx # 过滤按钮组件
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 应用入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML 入口
├── package.json             # 项目配置
└── vite.config.js           # Vite 配置
```

---

## 组件架构

### 组件关系图

```
┌─────────────────────────────────────────────────────────────┐
│                        App (主组件)                          │
│  ┌─────────────┬───────────────────┬─────────────────┐    │
│  │    Form     │   FilterButton[]   │      Todo[]     │    │
│  │  (添加任务)  │    (过滤条件)       │    (任务列表)    │    │
│  └─────────────┴───────────────────┴─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 组件职责

| 组件 | 职责 | 状态管理 |
|------|------|---------|
| **App** | 主容器，管理全局状态（任务列表、过滤条件） | `tasks`, `filter` |
| **Form** | 接收用户输入，创建新任务 | `name` |
| **Todo** | 单个任务，支持查看/编辑/删除 | `isEditing`, `newName` |
| **FilterButton** | 切换过滤条件（All/Active/Completed） | 无状态 |

---

## 功能特性

### 1. 任务管理

- **添加任务**：在顶部表单输入任务名称，点击 Add 或按 Enter 添加
- **编辑任务**：点击 Edit 进入编辑模式，修改后 Save 保存或 Cancel 取消
- **删除任务**：点击 Delete 按钮删除任务
- **完成任务**：勾选复选框切换完成状态

### 2. 任务过滤

| 过滤条件 | 说明 |
|---------|------|
| All | 显示所有任务 |
| Active | 只显示未完成的任务 |
| Completed | 只显示已完成的任务 |

### 3. 无障碍设计（Accessibility）

项目采用多种无障碍最佳实践，确保视障用户也能正常使用：

| 特性 | 实现方式 | 作用 |
|------|---------|------|
| 屏幕阅读器支持 | `visually-hidden` 隐藏文本 | 按钮显示 "Edit"，屏幕阅读器播报 "Edit [任务名]" |
| 焦点管理 | `usePrevious` + `useEffect` | 删除任务后自动聚焦到标题 |
| ARIA 属性 | `aria-pressed`, `aria-labelledby` | 提供语义化信息 |
| 键盘导航 | Tab 键可访问所有功能 | 纯键盘操作支持 |

### 4. 视觉样式

- 响应式设计，支持移动端和桌面端
- 清晰的视觉层级
- 完成状态使用自定义复选框样式
- 危险操作（删除）使用红色高亮

---

## 核心概念

### 自定义 Hook：usePrevious

```jsx
function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

**用途**：获取上一次渲染时的值，用于检测状态变化。

**应用场景**：
- 检测任务数量变化 → 删除后自动聚焦
- 检测编辑模式切换 → 自动切换焦点位置

### 状态提升（Lifting State Up）

所有任务相关的状态（`tasks`, `filter`）都保存在 **App** 组件中，通过 props 传递给子组件。这是 React 的单向数据流模式。

### 条件渲染

根据 `isEditing` 状态，Todo 组件渲染不同的模板：
- `false` → 查看模式（显示任务、Edit/Delete 按钮）
- `true` → 编辑模式（显示输入框、Save/Cancel 按钮）

---

## 数据结构

### 任务对象

```typescript
interface Task {
  id: string;        // 唯一标识符，格式："todo-{nanoid}"
  name: string;      // 任务名称
  completed: boolean; // 是否已完成
}
```

### 初始数据

```javascript
const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];
```

---

## 样式系统

### 命名规范

项目使用 BEM 命名规范：

| 类名 | 含义 |
|------|------|
| `.btn` | 基础按钮 |
| `.btn__primary` | 主要按钮（黑色背景） |
| `.btn__danger` | 危险操作按钮（红色） |
| `.btn-group` | 按钮组 |
| `.input__lg` | 大尺寸输入框 |
| `.label__lg` | 大尺寸标签 |
| `.stack-small` | 小间距堆叠 |
| `.stack-large` | 大间距堆叠 |

### visually-hidden 样式

用于视觉隐藏但屏幕阅读器可见的内容：

```css
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px);
  white-space: nowrap;
}
```

---

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |

---

## 已知限制

1. **空表单提交**：当前实现允许提交空任务名，这是 MDN 教程有意留给大家修复的练习题。

---

## 扩展建议

如果你想继续改进这个项目，可以考虑：

1. 添加空表单验证
2. 实现本地存储（localStorage）持久化
3. 添加任务分类/标签功能
4. 实现拖拽排序
5. 添加编辑任务的输入验证
6. 实现批量操作（批量删除/完成）
