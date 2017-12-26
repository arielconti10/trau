/**
 * Image extension helper
 *
 * Helper que trata imagens sem extesão e adiciona parametros
 * de processamento para o serviço Hiroto.
 *
 * @param  string url  image url
 * @param  object opts hiroto options
 * @return string      new url image
 */

import qs from 'qs';

export default function Hiroto(url, opts) {
  const testHostname = /(reika|hiroto)/;
  if (!testHostname.exec(url)) {
    return url;
  }
  const defaultOpts = {
    size: '',
    extension: 'jpg',
    aspect: 'crop',
    quality: 75,
    skipNulls: true,
  };
  const finalOpts = Object.assign(defaultOpts, opts);
  const queryString = qs.stringify(finalOpts, {
    encodeValuesOnly: true,
    arrayFormat: 'brackets',
  });
  const testExtension = /^.+\.(jpe?g|png|gif)$/;
  return `${url}${!testExtension.exec(url) ? `.${finalOpts.extension}` : ''}?${queryString}`;
}
