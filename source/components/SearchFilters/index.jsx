import React, { Component, PropTypes } from 'react';
import './SearchFilters.css';

class SearchFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFilterContainer: false,
      viewFilterList: true,
      scrolledTagsWrapper: false,
      hideTagsWrapper: false,
    };
  }

  render() {
    const {
      brands,
      categories,
      visualisation,
      onCategoryChange,
      onBrandChange,
      onFilterClick,
      selectTab,
      tabsView,
      tab } = this.props;

    return (
      <div>
        <div styleName={`container ${tabsView ? 'active-container' : ''} ${!visualisation.filtersViews ? 'hide-container' : ''}`}>
          <div styleName="tabs-wrapper">
            <TabsFilters
              onClick={(t) => {
                selectTab(t);
              }}
              tabSelected={1}
              selected={tab}
            >Categorias</TabsFilters>
            <TabsFilters
              onClick={(t) => {
                selectTab(t);
              }}
              tabSelected={2}
              selected={tab}
            >Marcas</TabsFilters>
          </div>
          <div styleName={`filters ${visualisation.filtersViews ? 'active-filters' : ''}`}>
            <ItemsFiltersContent
              tabSelected={1}
              selected={tab}
            >
              {categories.map(item =>
                <ItemsFilters
                  key={item.id}
                  selected={false}
                  onClick={() => {
                    onCategoryChange(item);
                    onFilterClick(false);
                  }}
                >{item.name}</ItemsFilters>,
              )}
            </ItemsFiltersContent>
            <ItemsFiltersContent
              tabSelected={2}
              selected={tab}
            >
              {brands.map(item =>
                <ItemsFilters
                  key={item.id}
                  selected={false}
                  onClick={() => {
                    onBrandChange(item);
                    onFilterClick(false);
                  }}
                >{item.name}</ItemsFilters>,
              )}
            </ItemsFiltersContent>
          </div>
        </div>
      </div>
    );
  }
}

SearchFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
  visualisation: PropTypes.shape({
    filtersViews: PropTypes.bool.isRequired,
  }).isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onBrandChange: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  selectTab: PropTypes.func.isRequired,
  tab: PropTypes.number,
  tabsView: PropTypes.bool.isRequired,
};

SearchFilters.defaultProps = {
  tab: null,
};

function ItemsFiltersContent({ children, tabSelected, selected }) {
  return (
    <div styleName={`filters-buttons ${tabSelected === selected ? 'active-buttons' : ''}`}>
      {children}
    </div>
  );
}

ItemsFiltersContent.propTypes = {
  tabSelected: PropTypes.number.isRequired,
  selected: PropTypes.number,
  children: PropTypes.node.isRequired,
};

ItemsFiltersContent.defaultProps = {
  selected: null,
};

function ItemsFilters({ onClick, children, selected }) {
  return (
    <button
      styleName={`filters-item ${selected ? 'disable-item' : ''}`}
      disabled={selected}
      onClick={onClick}
    >{children}</button>
  );
}

ItemsFilters.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

function TabsFilters({ onClick, tabSelected, children, selected }) {
  return (
    <button
      styleName={`tab ${tabSelected === selected ? 'active-tab' : ''}`}
      onClick={() => {
        onClick(tabSelected);
      }}
    >{children}</button>
  );
}

TabsFilters.propTypes = {
  onClick: PropTypes.func.isRequired,
  tabSelected: PropTypes.number.isRequired,
  selected: PropTypes.number,
  children: PropTypes.node.isRequired,
};

TabsFilters.defaultProps = {
  selected: null,
};

export default SearchFilters;
