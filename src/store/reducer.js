import { combineReducers } from 'redux';

import leftMenu from './leftMenu/reducer';
import calculation from './calculation/reducer';

const reducers = combineReducers({
  leftMenu,
  calculation,
});

export default reducers;
