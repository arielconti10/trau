import React, { PropTypes } from 'react';
import './SearchTags.css';

const SearchTags = ({
  text,
  onClick,
}) => (
  <span styleName="tag">
    {text}
    <button styleName="tag-button" onClick={onClick}>X</button>
  </span>
);

SearchTags.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SearchTags;
