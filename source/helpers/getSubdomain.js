/**
 * Get the current user slug
 * @return {String}
 */
export default () => {
  const host = window.location.host;
  const parts = host.split('.');
  let subdomain = '';
  if (parts.length >= 3) {
    subdomain = parts[0];
  }
  return subdomain;
};
