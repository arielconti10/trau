import React, { PropTypes } from 'react';
import './StaticOption.css';

function StaticOption({ value, title, id }) {
  const ifTitle = title ? 'withHeader' : 'notHeader';
  return (
    <div>
      {id === 'Cor' && <div styleName="box-option">
        {title && <div styleName="box-option-title">{title}</div>}
        <div styleName={`background-option ${ifTitle}`}>
          <i style={{ backgroundColor: value }} />
        </div>
      </div> }
      {id !== 'Cor' && <div styleName="box-option">
        {title && <div styleName="box-option-title">{title}</div>}
        <div styleName={`background-option ${ifTitle}`}>{value}</div>
      </div> }
    </div>
  );
}

StaticOption.propTypes = {
  value: PropTypes.node.isRequired,
  id: PropTypes.node.isRequired,
  title: PropTypes.string,
};

StaticOption.defaultProps = {
  title: null,
};

export default StaticOption;
