import React, { Component, PropTypes } from 'react';
import '../SelectDefault/SelectDefault.css';

class SelectDefault extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: null };
  }

  componentWillMount() {
    let description;
    if (this.props.variations && this.props.variations[0] && this.props.variations[0].description) {
      description = this.props.variations[0].description;
    }
    const value = this.props.value !== null ? this.props.value : description;
    this.setState({ value });
  }

  handleChange(event) {
    const valueTarget = event.target.value;
    if (this.props.variationId !== null) {
      this.setState({ value: valueTarget }, () => {
        this.props.handleClickChangeOption(
        { id: valueTarget, variationId: this.props.variationId });
      });
    } else {
      const item = this.props.variations.filter(x => x.id === valueTarget);
      if (item && item[0].id) {
        this.setState({ value: item[0].description }, () => {
          this.props.handleClickChangeOption({ id: valueTarget });
        });
      }
    }
  }

  render() {
    const { variations, type } = this.props;
    const options = variations.map((item) => {
      if (item) {
        return <option key={item.id} value={item.id}>{item.description}</option>;
      }
      return false;
    });

    const valueSelected = this.state.value || null;
    const ifTitle = type ? 'withHeader' : 'notHeader';
    return (
      <div styleName="select-wrapper">
        <div styleName="box-option is-interactive medium">
          {type && <div styleName="box-option-title">{type}</div>}
          <div styleName={`background-option ${ifTitle}`}>{valueSelected}</div>
          <select
            name={`${type}`}
            onChange={this.handleChange} styleName="box-option-dropdown"
          >
            {options}
          </select>
        </div>
      </div>
    );
  }
}

SelectDefault.propTypes = {
  variations: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.node,
  variationId: PropTypes.node,
  value: PropTypes.node,
  handleClickChangeOption: PropTypes.func.isRequired,
};

SelectDefault.defaultProps = {
  title: null,
  type: null,
  variationId: null,
  value: null,
};

export default SelectDefault;
