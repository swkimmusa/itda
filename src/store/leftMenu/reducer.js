const prefix = 'LEFT_MENU'; // Better be unique!!!

const getInitialState = () => ({ open: false });

const getNewState = (prevState, action) => {
  let state = prevState;
  if (state === undefined) { state = getInitialState(); }
  if (!action) { return state; }
  switch (action.type.replace(`${prefix}_#_`, '')) {
  case 'SET_OPEN':
    return { open: action.open };
  default:
    return state;
  }
};

export default getNewState;
export { prefix };
