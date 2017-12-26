import { CALL_API } from 'redux-api-middleware';

export default function ({ getState }) {
  return function (next) {
    return function (action) {
      const interceptedAction = action;
      const callApi = action[CALL_API];
      if (callApi && callApi.authenticationRequired) {
        const state = getState();
        if (state.user.token !== null) {
          callApi.headers = Object.assign({}, callApi.headers, {
            Authorization: `Bearer ${state.user.token}`,
          });
        }
        delete interceptedAction[CALL_API].authenticationRequired;
      }
      const nextAction = next(interceptedAction);
      return nextAction;
    };
  };
}
