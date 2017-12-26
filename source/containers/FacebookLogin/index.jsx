import React from 'react';
import { webBuyerUrl, facebook } from 'Config/Constants';
import { compose } from 'recompose';
import Loading from 'Components/Loading';
import qs from 'qs';

class FacebookLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.qs = qs.parse(window.location.search.replace('?', ''));
  }
  componentWillMount() {
    const store = this.props.match.params.store;
    const { url } = this.qs;
    function redirectLoginOriginal(response) {
      if (response.status === 'connected') {
        const facebookData = [];
        if (url) {
          facebookData.push(`url=${url}`);
        }
        facebookData.push(`facebookId=${response.authResponse.userID}`);
        facebookData.push(`facebookToken=${response.authResponse.accessToken}`);
        let options = facebookData.join('&');
        options = options.length > 0 ? `?${options}` : '';
        window.location.href = `${webBuyerUrl.protocol}://${store}.${webBuyerUrl.host}/login/${options}`;
      }
    }

    function statusChangeCallback(response) {
      if (response.status === 'connected') {
        redirectLoginOriginal(response);
      } else {
        const fbLoginUrl = `https://www.facebook.com/dialog/oauth?client_id=${facebook.id}&redirect_uri=${window.location}&response_type=token&scope=public_profile,email`;
        window.location = encodeURI(fbLoginUrl);
      }
    }
    /* eslint-disable */
    window.fbAsyncInit=function(){window.FB.init({appId:facebook.id,autoLogAppEvents:!0,xfbml:!0,version:"v2.10"}),window.FB.AppEvents.logPageView(), FB.getLoginStatus((response) => {statusChangeCallback(response)}) },function(e,n,t){var o,i=e.getElementsByTagName(n)[0];e.getElementById(t)||((o=e.createElement(n)).id=t,o.src="//connect.facebook.net/en_US/sdk.js",i.parentNode.insertBefore(o,i))}(document,"script","facebook-jssdk");
    /* eslint-enable */
  }

  render() {
    return (
      <div>{this.state.loading && <Loading />}</div>
    );
  }
}

const enhance = compose(
  // withRouter,
);

export default enhance(FacebookLogin);
