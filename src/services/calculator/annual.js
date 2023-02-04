import { stringify } from 'qs';
import {
  clone,
  get,
  find,
  toNumber,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';
import {
  roundTo, roundCurrency,
} from '../formatCurrency';

import taxBracket from '../taxBracket.json';

console.log(taxBracket);

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
    if (salary && salary > 0) return roundCurrency(salary / 12, { decimalsDigits: 2 }, 'up', 4);
    return 0;
  }

  if (conversionType === 'monthly') {
    if (salary && salary > 0) return roundCurrency(salary, { decimalsDigits: 2 }, 'up', 4);
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
  return roundTo(averageMonthlySalary / 209, 0, 'down'); // 통상임금은 추가수당계산의 중간값임으로 반올림하지 않는다
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

  const overtimeWorkWage = roundCurrency(overtimeWorkHours * ordinaryHourlySalary * 1.5, {}, 'up', 4);
  const nightTimeWorkWage = roundCurrency(nightTimeWorkHours * ordinaryHourlySalary * 0.5, {}, 'up', 4);
  const holidayWorkWage = roundCurrency(holidayWorkHours * ordinaryHourlySalary * 1.5, {}, 'up', 4);
  const holidayOvertimeWorkWage = roundCurrency(holidayOvertimeWorkHours * ordinaryHourlySalary * 2, {}, 'up', 4);

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
  return roundCurrency(averageMonthlySalary + totalAddedWage, {}, 'up', 4);
};

// const

const getTaxableIncome = (inputValues) => {
  const {
    monthlyTotalSalary,
    nonTaxableIncome,
  } = inputValues;

  const taxableIncome = Math.max(monthlyTotalSalary - nonTaxableIncome, 0);
  return taxableIncome;
};
const getEarnedIncomeTax = (inputValues) => {
  const {
    numOfFamily,
    numOfFamilyUnderAge,
    pensionMonthlySalary,
    taxableIncome,
  } = inputValues;
  // const taxableIncome =
  const lowerBracketRows = taxBracket.filter((row) => Number(row['이상']) <= 10000000 && !!row['5']);
  const upperBracketRows = taxBracket.filter((row) => Number(row['이상']) >= 10000000 && !row['5']);
  const bracket = find(lowerBracketRows, (row) => {
    const floor = Number(row['이상']);
    const roof = Number(row['미만']);
    const isOver = floor <= taxableIncome;
    const isLower = roof === 0
      ? true // top bracket within lower brackets
      : roof > taxableIncome;

    if (isOver && isLower) {
      console.log('taxableIncome: ', taxableIncome);
      console.log('floor: ', floor);
      console.log('roof: ', roof);
      console.log('isOver: ', isOver);
      console.log('isLower: ', isLower);
    }
    return isOver && isLower;
  });
  console.log('bracket, ', bracket);
  const totalNumOfFamily = Math.min(numOfFamily + numOfFamilyUnderAge, 11);
  const lowerBracketTax = Number(bracket[String(totalNumOfFamily)]);
  const upperBracketTax = upperBracketRows.reduce((ac, row) => { // upper bracket is cummulative
    const floor = Number(row['이상']);
    const roof = Number(row['미만']);
    const isOver = floor <= taxableIncome;
    const isLower = roof === 0
      ? true // top bracket within lower brackets
      : roof > taxableIncome;

    if (!isOver) return 0;
    if (isOver && !isLower) return Number(row['1']);

    const isTop = roof === 0;
    const position = taxableIncome - floor;
    console.log('isTop: ', isTop);
    console.log('position: ', position);
    if (isTop) {
      const topRate = Number(row['1']);
      console.log('topRate: ', topRate);
      return position * topRate;
    }

    const maximumBracketTax = Number(row['1']);
    const range = roof - floor;
    const givenTax = maximumBracketTax * (position / range);
    console.log('maximumBracketTax: ', maximumBracketTax);
    console.log('range: ', range);
    console.log('givenTax: ', givenTax);
    return givenTax;
  }, 0);
  console.log('lowerBracketTax: ', lowerBracketTax);
  console.log('upperBracketTax: ', upperBracketTax);

  const earnedIncomeTax = lowerBracketTax + upperBracketTax;
  return roundCurrency(earnedIncomeTax);
};

const getResidentTax = (inputValues) => {
  const { earnedIncomeTax } = inputValues;

  return roundTo(earnedIncomeTax / 10, -1, 'down');
};
const getInsuranceGroup = (inputValues) => {
  const {
    pensionMonthlySalary,
    monthlyTotalSalary,
    nonTaxableIncome,
    taxableIncome,
    earnedIncomeTax,
    residentTax,
  } = inputValues;
  const nationalPension = Math.min(
    roundTo(
      Math.max(pensionMonthlySalary - nonTaxableIncome, 0)
        * nationalPensionRate
        * 0.5,
      -1,
      'down',
    ),
    maxNationalPensionRate,
  );
  const healthInsurance = roundTo(
    roundTo(taxableIncome * healthInsuranceRate * 0.5, 2, 'up'),
    -1,
    'down',
  );

  const longTermHealthInsurance = roundTo(
    roundTo(healthInsurance * longTermHealthInsuranceRate, 2, 'up'),
    -1,
    'down',
  );

  const employmentInsurance = roundTo(
    roundTo(taxableIncome * employmentInsuranceRate * 0.5, 2, 'up'),
    -1,
    'down',
  );
  console.log(taxableIncome * employmentInsuranceRate * 0.5);
  console.log(roundTo(taxableIncome, 2, 'up'));
  return {
    nationalPension,
    healthInsurance,
    longTermHealthInsurance,
    employmentInsurance,
    totalInsurance: nationalPension
      + healthInsurance
      + longTermHealthInsurance
      + employmentInsurance
      + earnedIncomeTax
      + residentTax,
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
    taxableIncome: getTaxableIncome(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    earnedIncomeTax: getEarnedIncomeTax(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    residentTax: getResidentTax(mergedInputValues),
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
