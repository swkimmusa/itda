const merge = require('lodash/merge');

const config = {
  all: {
    env: process.env.REACT_APP_STAGE || 'development',
    isBrowser: typeof window !== 'undefined',
    isServer: typeof window === 'undefined',
  },
  test: {},
  development: { apiUrl: 'http://localhost:3000/api' },
  staging: {},
  production: {},
};

module.exports = merge(config.all, config[config.all.env]);
