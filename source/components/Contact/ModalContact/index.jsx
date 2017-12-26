import React, { PropTypes } from 'react';
import { Hiroto } from 'Helpers/Image';
import { normalizePhone } from 'Helpers/Normalize';
import './ModalContact.css';
import placeholder from '../../../assets/imgs/placeholder.jpg';

function ModalContact({ image, name, phone, email, handleStateChange }) {
  return (
    <div styleName="modal-wraper">
      {image && <img styleName="seller-image" src={Hiroto(image)} alt={name} />}
      {!image && <img styleName="seller-image" src={placeholder} alt={name} />}
      <span styleName="seller-name">{name}</span>
      {/* <span styleName="seller-location">/{slug}</span> */}
      {phone && phone !== '9999999999' &&
        <span styleName="seller-phone">
          <a href={`tel:+55 ${phone}`}>{normalizePhone(phone)}</a>
        </span>
      }
      <span styleName="seller-email">
        <a href={`mailto:${email}`}>{email}</a>
      </span>
      <button styleName="modal-close" onClick={handleStateChange} />
    </div>
  );
}

ModalContact.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  handleStateChange: PropTypes.func.isRequired,
};

ModalContact.defaultProps = {
  image: '',
  slug: '',
  name: '',
  phone: '',
  email: '',
};

export default ModalContact;
