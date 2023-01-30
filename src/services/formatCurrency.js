import {
  format, unformat,
} from 'number-currency-format';

export const roundTo = (number, precision, type = 'round') => {
  const power = 10 ** precision;

  if (type === 'round') return Math.round(number * power) / power;
  if (type === 'down') return Math.floor(number * power) / power;
  if (type === 'up') return Math.ceil(number * power) / power;

  return Math.round(number * power) / power;
};

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

export const roundCurrency = (v, others = {}, roundType = 'up') => {
  const rounded = roundTo(v, 2, roundType);
  return unformat(format(rounded, {
    decimalsDigits: 0,
    ...others,
  }));
};
