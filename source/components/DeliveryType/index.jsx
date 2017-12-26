import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import SearchCep from './SearchCep';
import './DeliveryType.css';

function DeliveryType({
  sellerName,
  sellerDelivery,
  sellerShipping,
  title,
  type,
  isCheckStyle,
  onClick,
  name,
  selected,
  hasCepComponent,
  handleSubmit,
  loading,
  cepButton,
  largeStyle,
  hideValues,
  handleChangeText,
  errorMessage,
}) {
  function renderComponent() {
    return (
      <div styleName={`delivery-type-wrapper-reseted ${largeStyle ? 'delivery-type-large-style' : ''}`}>
        {isCheckStyle &&
          <div styleName="delivery-type-check-wrapper">
            <div styleName="delivery-type-check" />
            <input type="hidden" value="" />
          </div>
        }
        <div styleName={`delivery-type-content delivery-type-${type}`}>
          <div styleName="delivery-type-label">{title} <span>{sellerName}</span></div>
          <div styleName="delivery-type-label-detail">{sellerDelivery}</div>
        </div>
        {!hideValues &&
          <div styleName={`delivery-type-value ${!hasCepComponent ? 'delivery-type-value-column' : ''}`}>
            {hasCepComponent &&
              <SearchCep
                handleSubmit={handleSubmit}
                loading={loading}
                button={cepButton}
                value={sellerShipping}
                onChange={handleChangeText}
                errorMessage={errorMessage}
              />
            }
            {sellerShipping &&
              !hasCepComponent &&
              <CurrencyFormat value={sellerShipping} />
            }
          </div>
        }
      </div>
    );
  }
  return (
    <div
      styleName={`delivery-type-wrapper ${isCheckStyle ? 'delivery-type-wrapper-custom' : ''} ${selected === name ? 'delivery-type-wrapper-custom-active' : ''}`}
    >
      {isCheckStyle &&
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            onClick(name);
          }
          }
          styleName="delivery-type-wrapper"
        >
          {renderComponent()}
        </a>
      }
      {!isCheckStyle &&
        renderComponent()
      }
    </div>
  );
}

DeliveryType.propTypes = {
  title: PropTypes.string.isRequired,
  type: (props) => {
    if (props.type !== 'seller' && props.type !== 'lua') {
      return new Error(
        `Invalid prop value '${props.type}' supplied to prop 'type', use 'seller' or 'lua' `,
      );
    }
    return null;
  },
  sellerName: PropTypes.string,
  sellerDelivery: PropTypes.string.isRequired,
  sellerShipping: PropTypes.number,
  isCheckStyle: PropTypes.bool,
  onClick: PropTypes.func,
  handleChangeText: PropTypes.func,
  handleSubmit: PropTypes.func,
  name: PropTypes.string.isRequired,
  selected: PropTypes.string,
  hasCepComponent: PropTypes.bool,
  loading: PropTypes.bool,
  cepButton: PropTypes.bool,
  largeStyle: PropTypes.bool,
  hideValues: PropTypes.bool,
  errorMessage: PropTypes.string,
};

DeliveryType.defaultProps = {
  luaShipping: null,
  sellerName: '',
  styleType: null,
  type: () => {},
  onClick: null,
  handleSubmit: null,
  selected: '',
  hasCepComponent: null,
  loading: null,
  isCheckStyle: null,
  sellerShipping: null,
  cepButton: false,
  largeStyle: false,
  hideValues: false,
  errorMessage: null,
  handleChangeText: () => {},
};

export default DeliveryType;
