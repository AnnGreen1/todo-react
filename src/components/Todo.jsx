/**
 * 待办事项组件
 * 支持查看、编辑、删除和切换完成状态
 */
import { useEffect, useRef, useState } from "react";

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

/**
 * 待办事项组件
 * @param {Object} props - 组件属性
 * @param {string} props.id - 待办事项的唯一标识符
 * @param {string} props.name - 待办事项的名称
 * @param {boolean} props.completed - 待办事项是否已完成
 * @param {Function} props.toggleTaskCompleted - 切换完成状态的回调函数
 * @param {Function} props.deleteTask - 删除任务的回调函数
 * @param {Function} props.editTask - 编辑任务的回调函数
 */
function Todo(props) {
  // 是否处于编辑模式
  const [isEditing, setEditing] = useState(false);
  // 编辑模式下的新名称
  const [newName, setNewName] = useState("");

  // 编辑输入框和编辑按钮的引用，用于焦点管理
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  // 追踪上一次的编辑状态
  const wasEditing = usePrevious(isEditing);

  /**
   * 处理输入框内容变化
   * @param {Event} event - 输入事件
   */
  function handleChange(event) {
    setNewName(event.target.value);
  }

  /**
   * 处理编辑表单提交
   * 注意：当前实现未阻止空表单提交，这是有意留给开发者的练习
   * @param {Event} event - 表单提交事件
   */
  function handleSubmit(event) {
    event.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  // 编辑模式模板：显示编辑表单
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          {/* visually-hidden: 为屏幕阅读器提供上下文 */}
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  // 查看模式模板：显示复选框、编辑和删除按钮
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditing(true);
          }}
          ref={editButtonRef}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  // 焦点管理：进入/退出编辑模式时自动聚焦到相应元素
  useEffect(() => {
    if (!wasEditing && isEditing) {
      // 进入编辑模式，聚焦到输入框
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      // 退出编辑模式，聚焦到编辑按钮
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  // 根据编辑状态渲染对应模板
  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
