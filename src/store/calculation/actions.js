import { prefix } from './reducer';
import store from '..';

const getType = (str) => {
  return `${prefix}_#_${str}`;
};

export default {
  setCalc: (values, id) => {
    store.dispatch({
      type: getType('SET_CALC'),
      payload: values,
      id,
    });
  },
};
