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
  smallBusiness: false,
  conversionType: 'daily', // daily weekly monthly
  hourlyWage: null,
  hoursPerDay: null,
  daysPerWeek: null,
  hoursWorked: null,
  daysWorked: null,

  contractWeeklyHours: null,

  overtimeWorkHours: null,

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

const getBaseWage = (inputValues) => {
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
    overtimeWorkHours,
    contractWeeklyHours,
    daysPerWeek,
    hoursPerDay,
    weeklyHours,
    hoursWorked,
  } = inputValues;
  if (overtimeWorkHours) return overtimeWorkHours;
  console.log(daysWorked);
  console.log(contractWeeklyHours);
  console.log(hoursPerDay);
  console.log(weeklyHours.list.length);
  console.log(hoursWorked - contractWeeklyHours);
  if (
    ((!!hoursPerDay && !!daysWorked) || weeklyHours.list.length > 0)
    && !!contractWeeklyHours
  ) return Math.max(hoursWorked - contractWeeklyHours, 0);

  return 0;
};

const getOvertimeWage = (inputValues) => {
  const {
    overtimeWorkHours,
    hourlyWage,
  } = inputValues;

  // const multiplier
  return roundCurrency(1.5 * overtimeWorkHours * hourlyWage);
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    hoursWorked: getHoursWorked(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    baseWage: getBaseWage(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    overtimeWorkHours: getOvertimeHours(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    overtimeWage: getOvertimeWage(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    totalWage: roundCurrency(mergedInputValues.overtimeWage + mergedInputValues.baseWage),
  };

  mergedInputValues = {
    ...mergedInputValues,
    employmentInsurance: roundCurrency(mergedInputValues.totalWage * 0.009),
  };

  mergedInputValues = {
    ...mergedInputValues,
    netWage: roundCurrency(mergedInputValues.totalWage - mergedInputValues.employmentInsurance),
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
