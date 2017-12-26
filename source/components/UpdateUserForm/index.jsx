import React, { PropTypes, Component } from 'react';
import TitleHeader from 'Components/TitleHeader';
import validate from 'Helpers/Validate';
import errors from 'Helpers/Errors';
import { reduxForm, propTypes } from 'redux-form';
import './updateUserForm.css';
import placeholder from '../../assets/imgs/placeholder.jpg';

class UpdateUserForm extends Component {
  componentWillMount() {
    this.props.change('name', this.props.user.name);
    this.props.change('username', this.props.user.email);
    this.props.change('cpf', this.props.user.cpf);
    if (this.props.user.address) {
      this.props.change('telephone', this.props.user.address.telephone);
    }
  }

  render() {
    const { handleSubmit, user, showErrors } = this.props;
    const bestImage = user && user.image_url ? user.image_url : null;
    const image = bestImage && bestImage.length ? bestImage : placeholder;

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <TitleHeader showBackButton />
          <div styleName="profile">
            {user && user.image_url !== undefined &&
              <img styleName="img" src={image} alt={user.name} />
            }
            <TitleHeader styleName="text-title">Meus Dados</TitleHeader>
          </div>
          <div>
            <div styleName="box">
              <fieldset styleName="info-wrapper">
                <label htmlFor="name" styleName="field">Nome</label>
                <span styleName="input input--blocked">
                  {this.props.user.name}
                </span>
              </fieldset>
              <fieldset styleName="info-wrapper">
                <label htmlFor="username" styleName="field">Email</label>
                <span styleName="input input--blocked">
                  {this.props.user.email}
                </span>
              </fieldset>
              {this.props.user.address &&
              <fieldset styleName="info-wrapper">
                <label htmlFor="telephone" styleName="field">Telefone</label>
                <span styleName="input input--blocked">
                  {this.props.user.address.telephone}
                </span>
              </fieldset>
              }
              <fieldset styleName="info-wrapper">
                <label htmlFor="username" styleName="field">CPF</label>
                <span styleName="input input--blocked">
                  {this.props.user.cpf}
                </span>
              </fieldset>
              {showErrors && <span styleName="errors">{errors(showErrors)}</span>}
            </div>
          </div>
          <div className="row" />
        </div>
      </form>
    );
  }
}

UpdateUserForm.propTypes = Object.assign({
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showErrors: PropTypes.string,
  user: PropTypes.shape({}).isRequired,
  shop: PropTypes.shape({}).isRequired,
}, propTypes);

UpdateUserForm.defaultProps = {
  shop: {},
};

export default reduxForm({ form: 'updateUserForm', validate })(UpdateUserForm);
