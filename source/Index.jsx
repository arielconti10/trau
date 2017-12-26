import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware } from 'redux-api-middleware';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import thunkMiddleware from 'redux-thunk';
import filter from 'redux-storage-decorator-filter';
import RootReducer from 'Reducers/RootReducer';
import { storage as storageConfig } from 'Config/Constants';
import authenticationMiddleware from 'Middlewares/authenticationMiddleware';
import getSubdomain from 'Helpers/getSubdomain';

import App from './App';


const subdomain = getSubdomain();
const reducer = storage.reducer(RootReducer);
let engine = createEngine(`${subdomain}_${storageConfig.storagePrefix}`);

// filter store keys to be persisted with localStorage
engine = filter(engine, [
  ['user'],
  ['cart'],
], [
  'shop',
  'shopWindow',
  'currentProduct',
  'form',
  ['user', 'error'],
  ['user', 'facebookData'],
  ['user', 'loading'],
]);

const storageMiddleware = storage.createMiddleware(engine);
const load = storage.createLoader(engine);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const store = createStore(reducer, {},
  composeEnhancers(applyMiddleware(
    authenticationMiddleware, apiMiddleware, thunkMiddleware, storageMiddleware)));


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

// load store from localStorage
load(store).then(() => {
  render(App);
});

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
