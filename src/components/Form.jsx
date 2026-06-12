/**
 * 添加新任务的表单组件
 */
import { useState } from "react";

/**
 * 表单组件
 * @param {Object} props - 组件属性
 * @param {Function} props.addTask - 添加任务的回调函数
 */
function Form(props) {
  // 输入框的值
  const [name, setName] = useState('');

  /**
   * 处理表单提交
   * 注意：当前实现未阻止空表单提交，这是有意留给开发者的练习
   * @param {Event} event - 表单提交事件
   */
  function handleSubmit(event) {
    event.preventDefault();
    props.addTask(name);
    setName("");
  }

  /**
   * 处理输入框内容变化
   * @param {Event} event - 输入事件
   */
  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
