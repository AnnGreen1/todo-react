/**
 * 过滤按钮组件
 * 用于切换待办事项的显示过滤条件
 */

/**
 * 过滤按钮组件
 * @param {Object} props - 组件属性
 * @param {string} props.name - 过滤条件名称（All/Active/Completed）
 * @param {boolean} props.isPressed - 按钮是否处于按下状态
 * @param {Function} props.setFilter - 设置过滤条件的回调函数
 */
function FilterButton(props) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      {/* visually-hidden: 为屏幕阅读器提供完整上下文 */}
      <span className="visually-hidden">Show </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

export default FilterButton;
