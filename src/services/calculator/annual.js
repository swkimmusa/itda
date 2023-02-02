import { stringify } from 'qs';
import {
  clone, get,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';
import { roundCurrency } from '../formatCurrency';

export const nationalPensionRate = 0.09;
export const healthInsuranceRate = 0.0709;
export const longTermHealthInsuranceRate = 0.1281;
export const employmentInsuranceRate = 0.018;

export const maxNationalPensionRate = 248500;

const defaultInputValues = {
  conversionType: 'annual',

  salary: 0,
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

  nationalPension: 0,
  healthInsurance: 0,
  healthInsuranceRate: 0,
  employmentInsurance: 0,
};

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getAverageMonthlySalary = (inputValues) => {
  const {
    conversionType,
    salary,
  } = inputValues;

  if (conversionType === 'annual') {
    if (salary && salary > 0) return roundCurrency(salary / 12);
    return 0;
  }

  if (conversionType === 'monthly') {
    if (salary && salary > 0) return roundCurrency(salary);
    return 0;
  }

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

const getOrdinaryMonthlySalary = (inputValues) => {
  const { averageMonthlySalary } = inputValues;
  return averageMonthlySalary || 0; // 통상임금은 추가수당계산의 중간값임으로 반올림하지 않는다
};

const getOrdinaryHourlySalary = (inputValues) => {
  const { averageMonthlySalary } = inputValues;
  return averageMonthlySalary / 209; // 통상임금은 추가수당계산의 중간값임으로 반올림하지 않는다
};

const getAddedWageGroup = (inputValues) => {
  const {
    conversionType,
    ordinaryHourlySalary,

    overtimeWorkHours,
    nightTimeWorkHours,
    holidayWorkHours,
    holidayOvertimeWorkHours,

  } = inputValues;

  if (conversionType === 'annual') {
    return {
      overtimeWorkWage: 0,
      nightTimeWorkWage: 0,
      holidayWorkWage: 0,
      holidayOvertimeWorkWage: 0,

      totalAddedWage: 0,
    };
  }

  const overtimeWorkWage = roundCurrency(overtimeWorkHours * ordinaryHourlySalary * 1.5);
  const nightTimeWorkWage = roundCurrency(nightTimeWorkHours * ordinaryHourlySalary * 0.5);
  const holidayWorkWage = roundCurrency(holidayWorkHours * ordinaryHourlySalary * 1.5);
  const holidayOvertimeWorkWage = roundCurrency(holidayOvertimeWorkHours * ordinaryHourlySalary * 2);

  const addedWage = {
    overtimeWorkWage,
    nightTimeWorkWage,
    holidayWorkWage,
    holidayOvertimeWorkWage,

    totalAddedWage: overtimeWorkWage + nightTimeWorkWage + holidayWorkWage + holidayOvertimeWorkWage,
  };

  return addedWage;
};

const getMonthlyTotalSalary = (inputValues) => {
  const {
    totalAddedWage,
    averageMonthlySalary,
  } = inputValues;
  return roundCurrency(averageMonthlySalary + totalAddedWage);
};

const getInsuranceGroup = (inputValues) => {
  const {
    pensionMonthlySalary,
    monthlyTotalSalary,
    nonTaxableIncome,
    // nationalPension,
    // healthInsurance,
    // healthInsuranceRate,
    // employmentInsurance,
  } = inputValues;
  console.log(
    (pensionMonthlySalary - nonTaxableIncome)
    * nationalPensionRate
    * 0.5,
  );
  const nationalPension = roundCurrency(
    Math.min(
      Math.max(
        Math.min(pensionMonthlySalary - nonTaxableIncome, 0)
          * nationalPensionRate
          * 0.5,
        maxNationalPensionRate,
      ),
      0,
    ),
  ); // TODO round down
  const taxableIncome = Math.max(monthlyTotalSalary - nonTaxableIncome, 0);
  const healthInsurance = roundCurrency((taxableIncome) * healthInsuranceRate * 0.5, {}, 'down'); // TODO round down
  const longTermHealthInsurance = roundCurrency(healthInsurance * longTermHealthInsuranceRate, {}, 'down'); // TODO round down
  const employmentInsurance = roundCurrency((taxableIncome) * employmentInsuranceRate * 0.5, {}, 'down'); // TODO round down

  return {
    nationalPension,
    healthInsurance,
    longTermHealthInsurance,
    employmentInsurance,
    totalInsurance: nationalPension + healthInsurance + longTermHealthInsurance + employmentInsurance,
  };
};

const getMonthlyNetSalary = (inputValues) => {
  const {
    monthlyTotalSalary,
    totalInsurance,
  } = inputValues;
  return roundCurrency(Math.max(monthlyTotalSalary - totalInsurance, 0));
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    averageMonthlySalary: getAverageMonthlySalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    pensionMonthlySalary: getPensionMonthlySalary(mergedInputValues),
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

  mergedInputValues = {
    ...mergedInputValues,
    monthlyTotalSalary: getMonthlyTotalSalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    ...getInsuranceGroup(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    monthlyNetSalary: getMonthlyNetSalary(mergedInputValues),
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
