import { prefix } from './reducer';
import store from '..';

const getType = (str) => {
  return `${prefix}_#_${str}`;
};

export default {
  open: () => {
    store.dispatch({
      type: getType('SET_OPEN'),
      open: true,
    });
  },
  close: () => {
    store.dispatch({
      type: getType('SET_OPEN'),
      open: false,
    });
  },
};
