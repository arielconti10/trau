import React, { PropTypes } from 'react';
import './StaticTags.css';

function StaticTags(
  {
  text,
  sep,
}) {
  return (
    <span styleName="result">“{text}”&nbsp;{sep}</span>
  );
}

StaticTags.propTypes = {
  text: PropTypes.string.isRequired,
  sep: PropTypes.string,
};

StaticTags.defaultProps = {
  view: false,
  sep: '',
};

export default StaticTags;
