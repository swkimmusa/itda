import { stringify } from 'qs';
import {
  clone, get,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';

const roundCurrency = (v) => unformat(format(v, { decimalsDigits: 0 }));
const defaultInputValues = {
  smallBusiness: false,
  over15Weekly: false,
  conversionType: 'daily', // daily weekly monthly
  hourlyWage: null,
  hoursPerDay: null,
  daysPerWeek: null,
  hoursWorked: null,
  daysWorked: null,

  contractWeeklyHours: null,

  overtimeHoursWorked: null,

  weeklyHours: {
    baseDate: null,
    list: [],
  },
};

const calculatedValues = { hoursWorked: 0 };

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getHoursWorked = (inputValues) => {
  const {
    hoursWorked,
    hoursPerDay,
    conversionType,
    daysPerWeek,
    daysWorked,
    weeklyHours,
  } = inputValues;

  if (conversionType === 'weekly') {
    const minutesList = weeklyHours.list.map((range) => {
      const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
      return difference;
    });
    return minutesList.reduce((ac, cu) => ac + cu, 0) / 60;
  }

  if (hoursWorked) return hoursWorked;

  return hoursPerDay * daysWorked;
};

const getBasePay = (inputValues) => {
  const {
    hourlyWage,
    hoursWorked,
    hoursPerDay,
  } = inputValues;

  if (hoursWorked) return hourlyWage * hoursWorked;

  return roundCurrency(hourlyWage * hoursPerDay);
};

const getOvertimeHours = (inputValues) => {
  const {
    daysWorked,
    overtimeHoursWorked,
    contractWeeklyHours,
    daysPerWeek,
    hoursPerDay,
  } = inputValues;
  if (overtimeHoursWorked) return overtimeHoursWorked;

  if (
    !!daysWorked
    && !!hoursPerDay
    && !!contractWeeklyHours
  ) return Math.max((daysWorked * hoursPerDay) - contractWeeklyHours, 0);

  return null;
};

const getOvertimePay = (inputValues) => {
  const {
    overtimeHoursWorked,
    hourlyWage,
  } = inputValues;
  return roundCurrency(1.5 * overtimeHoursWorked * hourlyWage);
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    hoursWorked: getHoursWorked(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    basePay: getBasePay(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    overtimeHoursWorked: getOvertimeHours(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    overtimePay: getOvertimePay(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    totalPay: roundCurrency(mergedInputValues.overtimePay + mergedInputValues.basePay),
  };

  mergedInputValues = {
    ...mergedInputValues,
    healthInsurance: roundCurrency(mergedInputValues.totalPay * 0.009),
  };

  mergedInputValues = {
    ...mergedInputValues,
    netPay: roundCurrency(mergedInputValues.totalPay - mergedInputValues.healthInsurance),
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
