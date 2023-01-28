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
  annualSalary: 0,
  monthlySalary: 0,
  averageMonthlySalary: 0,

  // ordinaryMonthlySalary: 0,
  // ordinaryHourlySalary: 0,

  nonTaxableIncome: 0,
  numOfFamily: 0,
  numOfFamilyUnderAge: 0,

  overtimeWorkHours: 0,
  nightTimeWorkHours: 0,
  holidayWorkHours: 0,
  holidayOvertimeWorkHours: 0,

  // overtimeWorkWage: 0,
  // nightTimeWorkWage: 0,
  // holidayWorkWage: 0,
  // holidayOvertimeWorkWage: 0,
};

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getAverageMonthlySalary = (inputValues) => {
  const {
    annualSalary,
    monthlySalary,
    nonTaxableIncome,
    numOfFamily,
    numOfFamilyUnderAge,
  } = inputValues;

  if (annualSalary && annualSalary > 0) return roundCurrency(annualSalary / 12);
  if (monthlySalary && monthlySalary > 0) return roundCurrency(monthlySalary);

  return 0;
};

const getOrdinaryMonthlySalary = (inputValues) => {
  const { averageMonthlySalary } = inputValues;
  return averageMonthlySalary || 0;
};

const getOrdinaryHourlySalary = (inputValues) => {
  const { averageMonthlySalary } = inputValues;
  return roundCurrency(averageMonthlySalary / 209);
};

const getAddedWageGroup = (inputValues) => {
  const {
    ordinaryHourlySalary,

    overtimeWorkHours,
    nightTimeWorkHours,
    holidayWorkHours,
    holidayOvertimeWorkHours,

  } = inputValues;

  const addedWage = {
    overtimeWorkWage: roundCurrency(overtimeWorkHours * ordinaryHourlySalary * 1.5),
    nightTimeWorkWage: roundCurrency(nightTimeWorkHours * ordinaryHourlySalary * 0.5),
    holidayWorkWage: roundCurrency(holidayWorkHours * ordinaryHourlySalary * 1.5),
    holidayOvertimeWorkWage: roundCurrency(holidayOvertimeWorkHours * ordinaryHourlySalary * 2),
  };

  return addedWage;
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    averageMonthlySalary: getAverageMonthlySalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    ordinaryMonthlySalary: getOrdinaryMonthlySalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    ordinaryHourlySalary: getOrdinaryHourlySalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    ...getAddedWageGroup(mergedInputValues),
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
