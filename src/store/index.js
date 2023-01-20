/* eslint-disable import/no-import-module-exports */
import {
  createStore, applyMiddleware, compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore, persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import reducer from './reducer';
import saga from './saga';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(persistedReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(sagaMiddleware),
));

if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(persistedReducer);
  });
}

export default store;
export const persistor = persistStore(store);
