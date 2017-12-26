import React, { PropTypes } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Contact from 'Components/Contact';
import thumbor from 'Helpers/thumbor';
import './Profile.css';
import placeholder from '../../assets/imgs/placeholder.jpg';


function Profile({ slug, image, name, phone, email, center, city, title }) {
  return (
    <div styleName={`profile ${center ? 'profile--center' : ''}`}>
      <Link styleName="link" to={'/'}>
        {image &&
          <img
            styleName="img"
            src={thumbor.setImagePath(image)
            .resize(90, 90)
            .buildUrl()}
            alt={name}
          />}
        {!image && <img styleName="img" src={placeholder} alt={name} />}
      </Link>
      <div styleName="info">
        <h1 styleName="title">
          <Link styleName="link" to={'/'}>
            {title &&
              title
            }
            {!title &&
              `Loja de ${name}`
            }
          </Link>
        </h1>
        <Contact slug={slug} image={image} name={name} phone={phone} email={email}>
          {city && <span styleName="contact">{`${city}, SP`} <span styleName="contact-button"> Contatar</span></span>}
          {!city && <span> Contatar</span>}
        </Contact>
      </div>
    </div>
  );
}

Profile.propTypes = {
  slug: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  city: PropTypes.string,
  center: PropTypes.bool,
  title: PropTypes.string,
};

Profile.defaultProps = {
  image: '',
  slug: '',
  name: '',
  phone: '',
  email: '',
  city: '',
  title: '',
  center: false,
};

export default withRouter(Profile);
