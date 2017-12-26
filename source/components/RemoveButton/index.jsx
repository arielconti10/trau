import React, { PropTypes } from 'react';
import './RemoveButton.css';

function removeButton({ handleClick }) {
  return (
    <button onClick={handleClick} styleName="close-button" />
  );
}

removeButton.propTypes = Object.assign({
  handleClick: PropTypes.func.isRequired,
});

export default removeButton;
