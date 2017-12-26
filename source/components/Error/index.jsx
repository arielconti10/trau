import React from 'react';
import { compose, defaultProps } from 'recompose';
import Helmet from 'react-helmet';
import './styles.css';

const statusList = {
  404: 'Não encontramos a página que você está procurando.',
  default: 'Ocorreu um erro, tente novamente.',
};

const NotFound = ({ statusCode }) => (
  <section styleName="wrapper">
    <Helmet
      title={`Lua - Erro - ${statusCode}`}
      meta={[
        { name: 'prerender-status-code', content: statusCode },
      ]}
    />
    <div styleName="icon" />
    <div styleName="info">
      <div styleName="title">
        ERRO {statusCode}
      </div>
      <div styleName="text">
        {statusList[statusCode] || statusList.default}
      </div>
    </div>
  </section>
);

const enhance = compose(
  defaultProps({
    statusCode: 404,
  }),
);

export default enhance(NotFound);
