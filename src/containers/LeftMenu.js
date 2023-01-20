// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import LeftMenu from '../components/molecules/LeftMenu';
// import { signOut as signOutAction } from '../store/authentication/actions';
import LeftMenuContainerComp from '../components/molecules/LeftMenuContainer';
import leftMenuAction from '../store/leftMenu/actions';
// import leftMenuAction from '../store/left-menu/actions';

const LeftMenuContainer = (props) => {
  const leftMenuOpen = useSelector((state) => state.leftMenu.open);

  return (
    <LeftMenuContainerComp onClose={leftMenuAction.close} open={leftMenuOpen}>
      <LeftMenu {...props} />
    </LeftMenuContainerComp>
  );
};

LeftMenuContainer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

LeftMenuContainer.defaultProps = {
  onClose: () => {},
  open: true,
};

// https://github.com/ReactTraining/react-router/issues/4671
// https://reacttraining.com/react-router/core/guides/dealing-with-update-blocking
//
// By default, react-router components (e.g. Route, Switch) will be blocked from updating
// if a library is controlling `shouldComponentUpdate` (e.g. react-redux)
//
// To get around this, there are 2 things we've done:
// - Create our `connect` component, then wrap it with `withRouter`
// - Add `location` to `onlyUpdateForKeys` to make sure our component re-renders when
// `location` changes
//
// withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftMenuContainer));
// const mapStateToProps = (state) => {
//   const leftMenuState = state.leftMenu;
//   return { open: leftMenuState.open };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onClickSignOut: () => dispatch(signOutAction()),
//     onClose: () => leftMenuAction.close(),
//   };
// };

export default LeftMenuContainer;
