/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import 'babel-polyfill';
import express from 'express';
import path from 'path';
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import prerender from 'prerender-node';
import webpackConfig from './webpack.config';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  app.use(prerender);
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });
}

app.listen(process.env.PORT || 10090, () => {
  console.log('Listening...')
});
