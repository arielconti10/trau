import React, { Component, PropTypes } from 'react';
import './SelectColor.css';

class SelectColor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setStateVisibleListColor = this.setStateVisibleListColor.bind(this);
    this.changeStateListColor = this.changeStateListColor.bind(this);
  }
  setStateVisibleListColor() {
    this.setState({
      visibleListColor: true,
    });
  }

  changeStateListColor() {
    const visible = !this.state.visibleListColor || false;
    this.setState({
      visibleListColor: visible,
    });
  }

  render() {
    const { variations, value } = this.props;
    const selects = variations.map((variation) => {
      window.console.log(variation);
      if (variation.type === 'color') {
        const options = variation.variations.map(item => (
          <button
            key={item.value} styleName="box-option-color-item"
            onClick={() => { this.props.handleClickChangeColor(item); }}
          >
            <i style={{ backgroundColor: item.label }} />
          </button>
        ));
        const ifTitle = variation.type ? 'withHeader' : 'notHeader';
        const visibleListColor = this.state.visibleListColor ? 'visible' : '';
        return (
          <div>
            <div styleName="box-option is-interactive medium">
              {variation.type && <div styleName="box-option-title">{variation.type}</div>}
              <button
                styleName={`background-option is-color ${ifTitle}`} data-cor={value}
                onClick={this.changeStateListColor}
              >
                {value}
                <i style={{ backgroundColor: value }} />
              </button>
              <div styleName={`box-option-color-dropdown ${visibleListColor}`}>
                {options}
              </div>
            </div>
          </div>
        );
      }
      return null;
    });
    return (
      <div>
        {selects}
      </div>
    );
  }
}

SelectColor.propTypes = Object.assign({
  variations: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string,
  handleClickChangeColor: PropTypes.func.isRequired,
});

SelectColor.defaultProps = {
  title: '',
  value: '#B22222',
};

export default SelectColor;
