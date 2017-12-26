import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';
import './Loading.css';

function Loading({ opaque, onTop }) {
  return (
    <div styleName={`wrapper ${opaque ? 'wrapper--opaque' : ''} ${onTop ? 'wrapper--opaque' : ''}`}>
      <Spinner spinnerName="double-bounce" styleName="spinner" noFadeIn />
    </div>
  );
}

Loading.propTypes = {
  opaque: PropTypes.bool,
  onTop: PropTypes.bool,
};

Loading.defaultProps = {
  opaque: false,
  onTop: false,
};

export default Loading;
