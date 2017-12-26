import React, { PropTypes } from 'react';
import './ActionButton.css';

function ActionButton({ children, size, fullwidth, onClick, remakePayments, disabled }) {
  return (
    <div>
      {!remakePayments && <button
        styleName={`buy buy--${size} ${fullwidth ? 'buy--fullwidth' : ''} ${disabled ? 'buy--disabled' : 'buy--active'}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>}
      {remakePayments && <button
        styleName="resend-ticket"
        onClick={onClick}
      >
        {children}
      </button>}
    </div>
  );
}

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
  fullwidth: PropTypes.bool,
  remakePayments: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
ActionButton.defaultProps = {
  size: 'default',
  fullwidth: false,
  remakePayments: false,
  onClick: () => {},
  disabled: false,
};

export default ActionButton;
