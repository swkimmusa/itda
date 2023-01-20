import moment from 'moment';
import slice from 'lodash/slice';
import omit from 'lodash/omit';

const prefix = 'CALCULATIONS'; // Better be unique!!!

const getInitialState = () => ({ list: {} });

const getNewState = (prevState, action) => {
  let state = prevState;
  if (state === undefined) { state = getInitialState(); }
  if (!action) { return state; }
  switch (action.type.replace(`${prefix}_#_`, '')) {
  case 'SET_CALC':
    return {
      list: {
        ...state.list,
        [action.id]: {
          createdAt: moment().toISOString(),
          ...action.payload,
          updatedAt: moment().toISOString(),
        },
      },
    };
  case 'DELETE_CALC':
    console.log(omit(state.list, action.payload));
    return { list: omit(state.list, action.payload) };
  default:
    return state;
  }
};

export default getNewState;
export { prefix };
