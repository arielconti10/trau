import React, { Component, PropTypes } from 'react';
import Modal from 'Components/Modal';
import ModalContact from 'Components/Contact/ModalContact';
import './Contact.css';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleStateChange() {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  }

  render() {
    const { slug, image, name, phone, email, children } = this.props;
    return (
      <span>
        <button styleName="contact-btn" onClick={this.handleStateChange}>
          {children}
        </button>
        {this.state.isOpen &&
          <Modal
            slug={slug}
            isOpen={this.state.isOpen}
            onRequestClose={this.handleStateChange}
            hideCloseDefault
            isContact
          >
            <ModalContact
              slug={slug}
              image={image}
              name={name}
              phone={phone}
              email={email}
              handleStateChange={this.handleStateChange}
            />
          </Modal>}
      </span>
    );
  }
}

Contact.propTypes = {
  slug: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  children: PropTypes.node,
};

Contact.defaultProps = {
  image: '',
  slug: '',
  name: '',
  phone: '',
  email: '',
  center: false,
  children: 'Contatar',
};

export default Contact;
