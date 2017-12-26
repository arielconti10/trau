import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, propTypes } from 'redux-form';
import SearchTags from 'Components/SearchTags';
import './SearchBar.css';


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearPlaceholder = this.clearPlaceholder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.props.change('search', nextProps.searchTerm);
    }
  }

  setFocus() {
    this.searchField.getRenderedComponent().focus();
  }

  clearPlaceholder() {
    if (this.searchField) {
      this.searchField.getRenderedComponent().placeholder = '';
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
    const { handleSubmit } = this.props;
    this.searchField.getRenderedComponent().blur();
    handleSubmit();
  }

  render() {
    const {
      submitting,
      visible,
      onVisiblityChange,
      onBrandChange,
      onCategoryChange,
      onResetFilters,
      onClickSearch,
      categories,
      brands,
      searchOpen,
      searchClose,
      hideFiltersAndTabs,
      ifTagsScrolls,
      searchFilterView,
      showResults,
      searchTerm,
      checkforParameters,
      onTagsScroll } = this.props;

    const isNotMobile = window.innerWidth > 1024;
    const isMobile = window.innerWidth < 768;
    const filteredBrands = brands.filter(t => t.selected);
    const filteredCategories = categories.filter(t => t.selected);
    let tagsHideView = true;
    if (checkforParameters()) {
      tagsHideView = false;
    }

    if (!searchFilterView) {
      tagsHideView = true;
    }
    return (
      <div styleName="wrapper">
        <form
          styleName={`search-bar ${visible ? 'visible' : ''}`}
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
          onBlur={() => isNotMobile && onVisiblityChange(false)}
        >
          <Field
            styleName="input"
            type="text"
            placeholder={!tagsHideView ? this.clearPlaceholder() : 'Busque produtos, marcas, categorias...'}
            component="input"
            name="search"
            autoComplete="off"
            ref={(searchField) => { this.searchField = searchField; }}
            onFocus={() => {
              if (isNotMobile) {
                onVisiblityChange(true);
              }
            }}
            onBlur={() => {
              if (!isNotMobile) {
                onTagsScroll(true);
              }
              if (isNotMobile) {
                onVisiblityChange(false);
              }
            }}
            onClick={() => {
              if (!isNotMobile) {
                onTagsScroll(false);
                onClickSearch(true);
              }
            }}
            withRef
          />
          <button
            styleName="submit" type="submit"
            disabled={submitting}
            onClick={(e) => {
              if (!isNotMobile && !visible) {
                e.preventDefault();
                searchOpen();
                setTimeout(() => { this.setFocus(); }, 20);
              } else if (!isNotMobile && visible) {
                if (!this.searchField.value) {
                  e.preventDefault();
                  showResults();
                } else {
                  hideFiltersAndTabs();
                }
              }
            }}
          >
            Buscar
          </button>
          <button
            styleName="close" onClick={(e) => {
              e.preventDefault();
              searchClose();
              setTimeout(() => { this.props.reset('searchBar'); }, 20);
            }}
          />
        </form>
        {isMobile &&
          <div
            id="tags-wrapper"
            styleName={`tags-wrapper ${ifTagsScrolls ? 'scrolled-tags-wrapper' : ''} ${tagsHideView ? 'hide-tags-wrapper' : ''}`}
          >

              {filteredBrands.map(item =>
                <SearchTags
                  key={item.name}
                  text={item.name}
                  onClick={() => {
                    onBrandChange(item);
                    hideFiltersAndTabs();
                  }}
                />,
              )}
              {filteredCategories.map(item =>
                <SearchTags
                  key={item.name}
                  text={item.name}
                  onClick={() => {
                    onCategoryChange(item);
                    hideFiltersAndTabs();
                  }}
                />,
              )}
              {searchTerm &&
                <SearchTags
                  key={searchTerm}
                  text={searchTerm}
                  onClick={() => {
                    onResetFilters();
                    hideFiltersAndTabs();
                  }}
                />
              }

          </div>
        }
      </div>
    );
  }
}

SearchBar.propTypes = Object.assign({
  searchTerm: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  visible: PropTypes.bool,
  onVisiblityChange: PropTypes.func.isRequired,
  onClickSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onBrandChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  visualisation: PropTypes.bool.isRequired,
  ifTagsScrolls: PropTypes.bool.isRequired,
  searchFilterView: PropTypes.bool.isRequired,
  onTagsScroll: PropTypes.func.isRequired,
  checkforParameters: PropTypes.func.isRequired,
  searchOpen: PropTypes.func.isRequired,
  showResults: PropTypes.func.isRequired,
  searchClose: PropTypes.func.isRequired,
  hideFiltersAndTabs: PropTypes.func.isRequired,
}, propTypes);

SearchBar.defaultProps = {
  visible: true,
  searchTerm: '',
};


export default reduxForm({ form: 'searchBar' })(SearchBar);
