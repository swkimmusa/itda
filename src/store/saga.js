import {
  all, fork,
} from 'redux-saga/effects';

// import authSagas from './authentication/sagas';

const sagas = [];

// Loop through all imported sagas and attach them to the root saga we export
export default function* (services = {}) {
  yield all(sagas.map((saga) => fork(saga, services)));
}
