import {
  FETCH_CAMPAIGNS_REQUEST,
  FETCH_CAMPAIGNS_SUCCESS,
  FETCH_CAMPAIGNS_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = [];

function beautifyCampaigns(campaigns) {
  const result = campaigns.filter(value => Object.keys(value).length !== 0);
  return result.map(
    ({ name, image, rule_id, products, subtitle }) =>
    ({ name, image, id: rule_id, image2: image, products, subtitle }));
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGNS_FAILURE:
    case FETCH_CAMPAIGNS_REQUEST: {
      return INITIAL_STATE;
    }

    case FETCH_CAMPAIGNS_SUCCESS: {
      return beautifyCampaigns(action.payload);
    }

    default:
      return state;
  }
};
