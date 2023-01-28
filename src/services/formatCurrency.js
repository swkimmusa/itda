import {
  format, unformat,
} from 'number-currency-format';

export const formatNumber = (v, opts = {}) => {
  return format(v, {
    spacing: false,
    decimalsDigits: 0,
    showDecimals: 'NEVER',
    ...opts,
  });
};
export const formatCurrency = (v, opts = {}) => {
  return format(v, {
    currency: '원',
    currencyPosition: 'RIGHT',
    spacing: false,
    decimalsDigits: 0,
    showDecimals: 'NEVER',
    ...opts,
  });
};

export const roundCurrency = (v) => unformat(format(v, { decimalsDigits: 0 }));
