import { stringify } from 'qs';
import _, {
  clone, get,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';
import { roundCurrency } from '../formatCurrency';

const defaultInputValues = {
  monthlySalary: 0,
  joinDate: moment('2020-12-01').toISOString(),
  leaveDate: moment('2045-12-01').toISOString(),
};

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getAbsoluteMonths = (date) => {
  const months = moment(date).month();
  const years = moment(date).year();
  return months + (years * 12);
};

const getOrdinaryMonthlySalary = (inputValues) => {
  const {
    joinDate,
    leaveDate,
    monthlySalary,
  } = inputValues;

  const workDaysTotal = moment(leaveDate).diff(joinDate, 'days') + 1;

  const ordinaryMonthlySalaryList = [];

  if (workDaysTotal < 365) return ordinaryMonthlySalaryList; // 1년 미만 재직은 퇴직금 발생하지 않음

  const startDate = moment(leaveDate).startOf('day').subtract('3', 'months').add(1, 'days');

  // startingMonth
  const startMonthWorkDays = startDate.daysInMonth() - (startDate.date() - 1);
  const startMonthOrdinaryDailySalary = (monthlySalary / startDate.daysInMonth());
  ordinaryMonthlySalaryList.push({
    date: startDate.toISOString(),
    ordinarySalary: startMonthOrdinaryDailySalary * startMonthWorkDays,
  });

  const numOfCalMonths = getAbsoluteMonths(leaveDate) - getAbsoluteMonths(startDate.toISOString());
  _.times(numOfCalMonths - 1, (i) => { // -1
    const monthsAfterStartDate = i + 1;
    const currentMonth = moment(startDate).startOf('month').month() + monthsAfterStartDate; // 0 = jan
    const currentStartDate = moment(startDate).month(currentMonth).startOf('month');
    ordinaryMonthlySalaryList.push({
      date: currentStartDate.toISOString(),
      ordinarySalary: monthlySalary,
    });
  });

  // lastMonth
  const lastDate = moment(leaveDate).startOf('day');
  const lastMonthWorkDays = lastDate.date();
  const lastMonthOrdinaryDailySalary = (monthlySalary / lastDate.daysInMonth());
  ordinaryMonthlySalaryList.push({
    date: moment(leaveDate).startOf('month').toISOString(),
    ordinarySalary: lastMonthOrdinaryDailySalary * lastMonthWorkDays,
  });

  const workDays = moment(leaveDate).diff(startDate, 'days') + 1;

  return {
    ordinaryMonthlySalaryList,
    workDays,
    workDaysTotal,
  };
};

const getAverageDailyTotalSalary = (inputValues) => {
  const {
    workDaysTotal,
    workDays,
    joinDate,
    leaveDate,
    monthlySalary,
    ordinaryMonthlySalaryList,
  } = inputValues;

  // mergedInputValues = {
  //   ...mergedInputValues,
  //   ordinaryMonthlySalaryList: getOrdinaryMonthlySalary(mergedInputValues),
  // };
  const baseSalarySum = ordinaryMonthlySalaryList.reduce((ac, cu) => ac + cu.ordinarySalary, 0);

  const annualBonusSeverance = inputValues.annualBonus / 4;
  const annualTotalAddedWageSeverance = inputValues.annualTotalAddedWage / 4;
  const totalSalary = baseSalarySum + annualBonusSeverance + annualTotalAddedWageSeverance;

  const averageDailyTotalSalary = totalSalary / workDays;

  const totalSeverance = ((averageDailyTotalSalary * 30) / 365) * workDaysTotal;
  return {
    totalSalary,
    averageDailyTotalSalary,
    totalSeverance,
    annualBonusSeverance: inputValues.annualBonus / 4,
    annualTotalAddedWageSeverance: inputValues.annualTotalAddedWage / 4,
  };
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    ...getOrdinaryMonthlySalary(mergedInputValues),
  };

  // mergedInputValues = {
  //   ...mergedInputValues,
  //   adjustedT: getOrdinaryMonthlySalary(mergedInputValues),
  // };

  mergedInputValues = {
    ...mergedInputValues,
    ...getAverageDailyTotalSalary(mergedInputValues),
  };

  mergedInputValues = {
    ...mergedInputValues,
    annualBonusSeverance: mergedInputValues.annualBonus / 4,
    annualTotalAddedWageSeverance: mergedInputValues.annualTotalAddedWage / 4,
  };

  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
