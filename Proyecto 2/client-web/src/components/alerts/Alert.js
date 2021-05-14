import React from 'react';

/**
 * Renderiza un alerta
 * @param {string} param0 variant puede danger success warning info
 * @returns 
 */
const Alert = ({variant, title, message, onStateChange}) => {
  var icon;
  switch(variant) {
    case 'danger':
      icon = 'exclamation-circle';
      break;
    case 'warning':
      icon = 'exclamation-triangle';
      break;
    case 'info':
      icon = 'info';
      break;
    case 'success':
      icon = 'check';
      break;
    default:
      icon = 'info'
      break;
  }
  /// Al hacer click ejecuta la función onStateChange
  const handleClick = () => {
    onStateChange();
  }
  return (
    <div className={`alert alert-${variant} alert-dismissible fade show my-1`} role="alert">
      <i className={`fa fa-${icon}`}></i>{" "}
      <strong>{title}</strong>{" "+message}
      <button 
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={handleClick}
        ></button>
    </div>
  )
}

export default Alert;