import React, { PropTypes, Component } from 'react';
import { Hiroto } from 'Helpers/Image';
import './StoreShortcut.css';
import placeholder from '../../assets/imgs/placeholder.jpg';

class StoreShortcut extends Component {

  constructor(props) {
    super(props);
    if (window.localStorage.getItem('first-visit')) {
      this.state = { isOpenStoreShortcut: false };
    } else {
      this.state = { isOpenStoreShortcut: true };
    }
  }

  hideModal() {
    this.setState({ isOpenStoreShortcut: false });
    window.localStorage.setItem('first-visit', 'true');
  }

  render() {
    const { image, name } = this.props;
    const uagnt = window.navigator.userAgent;
    const systemMatch = uagnt.match(/iPad|iPhone|iPad|Android/);
    const isIos = uagnt.match(/iPad|iPhone|iPad/);
    const system = systemMatch ? systemMatch[0] : null;
    const systemClass = system ? system.toLowerCase() : '';

    return (
      <div styleName={`modal-bubble ${systemClass} ${this.state.isOpenStoreShortcut ? 'active' : ''}`}>
        <img styleName={`seller-avatar ${systemClass}`} src={image && image.length ? Hiroto(image) : placeholder} alt={name} />
        <span styleName="modal-title">Salve essa loja no seu celular</span>
        <ul styleName="modal-list">
          <li>1. Clique no ícone <i styleName={`os-menu-icon ${systemClass}`} /></li>
          {isIos &&
            <li>2. Selecione Adicionar para tela de início.</li>
          }
          {!isIos &&
            <li>2. Selecione Adicionar à tela inicial.</li>
          }
        </ul>
        <button styleName="close" onClick={() => { this.hideModal(); }} />
      </div>
    );
  }
}

StoreShortcut.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
};

StoreShortcut.defaultProps = {
  image: '',
  name: '',
};

export default StoreShortcut;
