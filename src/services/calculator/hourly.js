import { stringify } from 'qs';
import { clone } from 'lodash';

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
    daysPerWeek,
    daysWorked,
  } = inputValues;

  if (hoursWorked) return hoursWorked;

  return hoursPerDay * daysWorked;
};

const getBasePay = (inputValues) => {
  const {
    hourlyWage,
    hoursWorked,
    hoursPerDay,
  } = inputValues;
  console.log('hourlyWage: ', hourlyWage);
  console.log('hoursWorked: ', hoursWorked);
  console.log('hoursPerDay: ', hoursPerDay);
  if (hoursWorked) return hourlyWage * hoursWorked;
  console.log('hoursPerDay: ', hoursPerDay);
  return hourlyWage * hoursPerDay;
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
  ) return (daysWorked * hoursPerDay) - contractWeeklyHours;

  return null;
};

const getOvertimePay = (inputValues) => {
  const {
    overtimeHoursWorked,
    hourlyWage,
  } = inputValues;
  return 1.5 * overtimeHoursWorked * hourlyWage;
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
    totalPay: mergedInputValues.overtimePay + mergedInputValues.basePay,
  };

  mergedInputValues = {
    ...mergedInputValues,
    healthInsurance: mergedInputValues.totalPay * 0.009,
  };

  mergedInputValues = {
    ...mergedInputValues,
    netPay: mergedInputValues.totalPay - mergedInputValues.healthInsurance,
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
