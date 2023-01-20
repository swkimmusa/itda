import ReactRouterPropTypes from 'react-router-prop-types';

const propTypes = {
  reactRouter: {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    route: ReactRouterPropTypes.route.isRequired,
  },
};

export default propTypes;
