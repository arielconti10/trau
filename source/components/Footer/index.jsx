import React from 'react';
// import Profile from 'Components/Profile';
// import ListMenu from 'Components/ListMenu';
// import ListMenuItem from 'Components/ListMenu/ListMenuItem';
import './Footer.css';

// const listMenuItems = [
//   // <ListMenuItem key="0" to="/" alwaysVisible>Home</ListMenuItem>,
//   // <ListMenuItem key="1" to="/" alwaysVisible>Contatar</ListMenuItem>,
//   // <ListMenuItem key="2" to="/login" alwaysVisible>Entrar</ListMenuItem>,
//   // <ListMenuItem key="3" to="/login" alwaysVisible>Minhas Compras</ListMenuItem>,
// ];

function Footer() {
  return (
    <footer styleName="footer">
      {/* <Profile name={shop.name} slug={shop.slug} center contatar={false} /> */}

      {/* <ListMenu type="inline"> */}
      {/* {listMenuItems} */}
      {/* </ListMenu> */}

      <div styleName="lua-signature-wrapper">
        <a styleName="lua-signature-link" href="http://lua.net" target="_blank" rel="noopener noreferrer">LUA</a>
      </div>
    </footer>
  );
}

export default Footer;
