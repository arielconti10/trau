export function flatString(str) {
  const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';

  const strSplited = str.split('');
  const strLen = strSplited.length;

  for (let i = 0; i < strLen; i += 1) {
    const x = accents.indexOf(strSplited[i]);
    if (x !== -1) {
      strSplited[i] = accentsOut[x];
    }
  }
  return strSplited.join('').toLowerCase().replace(/\s+/g, '');
}
