import { stringify } from 'qs';
import {
  clone, get, each, max,
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

  weeklyHolidays: 0,

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

const getOvertimeHours = (inputValues) => {
  const {
    conversionType,
    daysWorked,
    overtimeWorkHours,
    contractWeeklyHours,
    hoursPerDay,
    weeklyHours,
    hoursWorked,
  } = inputValues;
  if (overtimeWorkHours) return overtimeWorkHours;

  if (contractWeeklyHours) return Math.max(0, hoursWorked - contractWeeklyHours);
  // const contractWeeklyHoursOvertime = Math.max(0, hoursWorked - contractWeeklyHours);

  // let currentWorkHour = 0;
  let weeklyHoursOvertime = 0;
  if (conversionType === 'weekly') {
    const dailyOvertimeMinutesList = weeklyHours.list.map((range) => {
      const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
      return Math.max(0, difference - 480);
    });
    const dailyOvertimeMinutes = dailyOvertimeMinutesList.reduce((ac, cu) => ac + cu, 0);
    const minutesOver40Hours = Math.max(0, (hoursWorked * 60) - 2400);
    weeklyHoursOvertime = max([
      // contractWeeklyHoursOvertime,
      dailyOvertimeMinutes / 60,
      minutesOver40Hours / 60,
    ]);
  }
  return weeklyHoursOvertime || 0;
};

const getWeeklyHolidayHours = (inputValues) => {
  const {
    hoursWorked,
    baseWorkHours,
    contractWeeklyHours,
  } = inputValues;

  if (hoursWorked < 15) return 0;
  if (contractWeeklyHours < 15) return 0;
  if (baseWorkHours) return (baseWorkHours / 5);

  return 0;
};

const getBaseWorkHours = (inputValues) => {
  const {
    hoursWorked,
    overtimeWorkHours,
    contractWeeklyHours,
  } = inputValues;
  // const multiplier
  // if (contractWeeklyHours) return Math.min(contractWeeklyHours)
  return hoursWorked - overtimeWorkHours;
};

const getBaseWage = (inputValues) => {
  const {
    baseWorkHours,
    hourlyWage,
    hoursWorked,
    hoursPerDay,
  } = inputValues;

  return roundCurrency(hourlyWage * baseWorkHours);
};
const getWeeklyHolidayWage = (inputValues) => {
  const {
    weeklyHolidayHours,
    hourlyWage,
  } = inputValues;
  return roundCurrency(weeklyHolidayHours * hourlyWage);
};
const getOvertimeWage = (inputValues) => {
  const {
    overtimeWorkHours,
    hourlyWage,
    smallBusiness,
  } = inputValues;

  const multiplier = smallBusiness ? 1 : 1.5;
  return roundCurrency(multiplier * overtimeWorkHours * hourlyWage);
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    hoursWorked: getHoursWorked(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    overtimeWorkHours: getOvertimeHours(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    baseWorkHours: getBaseWorkHours(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    weeklyHolidayHours: getWeeklyHolidayHours(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    baseWage: getBaseWage(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    weeklyHolidayWage: getWeeklyHolidayWage(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    overtimeWage: getOvertimeWage(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    totalWage: roundCurrency(mergedInputValues.overtimeWage + mergedInputValues.baseWage + mergedInputValues.weeklyHolidayWage),
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
