import slice from 'lodash/slice';

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
        [action.id]: action.payload,
      },
    };
  default:
    return state;
  }
};

export default getNewState;
export { prefix };
