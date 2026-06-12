/**
 * 主应用组件
 * 管理待办事项的状态和过滤逻辑
 */
import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

/**
 * 自定义 Hook：获取上一次渲染时的值
 * @param {any} value - 需要追踪的值
 * @returns {any} 上一次渲染时的值
 */
function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// 过滤条件映射表：根据过滤类型返回对应的过滤函数
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

// 过滤按钮名称列表
const FILTER_NAMES = Object.keys(FILTER_MAP);

/**
 * 主应用组件
 * @param {Object} props - 组件属性
 * @param {Array} props.tasks - 初始待办事项列表
 */
function App(props) {
  // 待办事项列表状态
  const [tasks, setTasks] = useState(props.tasks);
  // 当前过滤条件状态
  const [filter, setFilter] = useState("All");

  /**
   * 切换待办事项的完成状态
   * @param {string} id - 待办事项的唯一标识符
   */
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        // 使用对象展开创建新对象，并反转 completed 属性
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  /**
   * 删除指定的待办事项
   * @param {string} id - 待办事项的唯一标识符
   */
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  /**
   * 编辑待办事项的名称
   * @param {string} id - 待办事项的唯一标识符
   * @param {string} newName - 新的待办事项名称
   */
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        // 复制任务对象并更新名称
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  // 根据当前过滤条件过滤待办事项列表并生成 Todo 组件
  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  // 生成过滤按钮列表
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  /**
   * 添加新的待办事项
   * @param {string} name - 新待办事项的名称
   */
  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  // 根据待办事项数量生成标题文本（单复数处理）
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  // 用于无障碍访问的引用：当任务减少时聚焦到标题
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  // 当任务数量减少时，将焦点移到列表标题（无障碍优化）
  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      {/* 添加新任务的表单 */}
      <Form addTask={addTask} />
      {/* 过滤按钮组 */}
      <div className="filters btn-group stack-exception">{filterList}</div>
      {/* 任务列表标题，显示剩余任务数量 */}
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      {/* 任务列表 */}
      <ul
        aria-labelledby="list-heading"
        className="todo-list stack-large stack-exception"
        role="list"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
