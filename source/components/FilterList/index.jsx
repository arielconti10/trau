import React, { PropTypes } from 'react';
import './FilterList.css';

function FilterList({ filters, onChange }) {
  if (filters) {
    return (
      <ul styleName="list">
        {filters.map(filter => (
          <li key={filter.id} styleName={`item ${filter.selected ? 'item--selected' : ''}`}>
            <button styleName="filter-btn" onClick={() => onChange(filter)}>
              {filter.name}
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

FilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    selected: PropTypes.bool,
  })).isRequired,
  onChange: PropTypes.func,
};

FilterList.defaultProps = {
  onChange: () => {},
};

export default FilterList;
