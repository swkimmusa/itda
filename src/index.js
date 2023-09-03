import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import dayjs from 'dayjs';

import '@coreui/coreui/dist/css/coreui.min.css';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import GlobalStyled from './globalStyles';

import './index.scss';

import App from './App';
import { apiUrl } from './config';

import apiService from './services/api';

import theme from './theme';
import store, { persistor } from './store';

global.api = apiService.create({ defaultUrl: apiUrl });
moment.locale('ko');
dayjs.locale('ko');

console.log('basename is : ', process.env.REACT_APP_BASE_URL);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading="loading" persistor={persistor}>
        <Router basename={process.env.REACT_APP_BASE_URL || ''}>
          <ThemeProvider theme={theme}>
            <GlobalStyled />
            <App />
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
