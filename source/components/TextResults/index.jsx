import React, { PropTypes } from 'react';
import './TextResults.css';

function TextResults(
  {
  total,
  view,
  children,
  onResetFilters,
}) {
  return (
    <div styleName={`text-results ${view ? 'text-results-show' : ''}`}>
      <span styleName="title-results">Exibindo ({total}) resultados para: &nbsp;</span>
      <div styleName="tags-results"> {children} </div>
      <button styleName="tags-clear" onClick={onResetFilters}>Limpar tudo </button>
    </div>
  );
}

TextResults.propTypes = {
  total: PropTypes.number,
  view: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

TextResults.defaultProps = {
  view: false,
  total: null,
};

export default TextResults;
