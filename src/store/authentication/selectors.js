export const initialState = {
  user: null,
  authenticated: false,
  signInError: null,
  signUpError: null,
};

export const selectUser = (state = initialState) => {
  if (!state.user || Object.keys(state.user) === 0) return initialState.user;

  return state.user;
};

export const selectUserRole = (state = initialState) => {
  if (!state.user || Object.keys(state.user) === 0 || !state.user.role) return null;

  return state.user.role;
};

export const selectSignInError = (state = initialState) => {
  if (!state.signInError) return initialState.signInError;

  return state.signInError;
};

export const selectSignUpError = (state = initialState) => {
  if (!state.signUpError) return initialState.signUpError;

  return state.signUpError;
};

export const selectIfUserVerified = (state = initialState) => {
  if (!state.user || Object.keys(state.user) === 0 || !state.user) return null;
  return state.user.verified;
};

export const selectSignUpSuccessful = (state = initialState) => {
  if (!state.signUpSuccessful) return null;
  return state.signUpSuccessful;
};
