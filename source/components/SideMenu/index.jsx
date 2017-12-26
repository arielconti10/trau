import React, { PropTypes } from 'react';
import { push as Menu } from 'react-burger-menu';
import './SideMenu.css';
import placeholder from '../../assets/imgs/placeholder.jpg';

const openMenu = (e) => {
  e.preventDefault();
};

function SideMenu({ user, onStateChange, isOpen, children }) {
  const bestImage = user && user.image_url ? user.image_url : null;
  const image = bestImage && bestImage.length ? bestImage : placeholder;

  return (
    <Menu
      pageWrapId="page-wrap" outerContainerId="outer-container"
      onStateChange={onStateChange}
      isOpen={isOpen} right
    >
      {user.token && <div>
        <img
          styleName="side-menu__avatar"
          src={image}
          alt={`Foto de ${user.name}`}
        />
        <span styleName="side-menu__user-name">{user.name}</span>
        <span styleName="side-menu__user-email">{user.email}</span>
      </div>}
      {children}
      <a onClick={openMenu} className="menu-item--small" href="">Settings</a>
    </Menu>
  );
}

SideMenu.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  onStateChange: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.email,
  }).isRequired,
};

SideMenu.defaultProps = {
  isOpen: false,
};


export default SideMenu;
