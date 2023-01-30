import { stringify } from 'qs';
import {
  clone, get,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';
import { roundCurrency } from '../formatCurrency';

const defaultInputValues = {

  smallBusiness: true,
  contractWeeklyHours: null,

  joinDate: moment('2020-12-01').toISOString(),
  payDate: moment('2045-12-01').toISOString(),

};

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getJoinDateBasedLeaves = (inputValues) => {
  const {
    smallBusiness,
    contractWeeklyHours,
    joinDate,
    payDate,
  } = inputValues;
  const isOver15HoursWeekly = contractWeeklyHours > 15;

  return 0;
};

const getPensionMonthlySalary = (inputValues) => {
  const {
    conversionType,
    averageMonthlySalary,
  } = inputValues;

  if (conversionType === 'annual') return averageMonthlySalary;
  if (conversionType === 'monthly') return averageMonthlySalary;

  return 0;
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    joinDateBasedLeaves: getJoinDateBasedLeaves(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    // monthlyNetSalary: getMonthlyNetSalary(mergedInputValues),
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
