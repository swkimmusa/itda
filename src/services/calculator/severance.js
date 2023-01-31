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

  const workDays = moment(leaveDate).diff(joinDate, 'days') + 1;

  const ordinaryDailySalaryList = [];

  if (workDays < 365) return ordinaryDailySalaryList; // 1년 미만 재직은 퇴직금 발생하지 않음

  const startDate = moment(leaveDate).startOf('day').subtract('3', 'months').add(1, 'days');

  // startingMonth
  const startMonthWorkDays = startDate.daysInMonth() - (startDate.date() - 1);
  const startMonthOrdinaryDailySalary = (monthlySalary / startDate.daysInMonth());
  ordinaryDailySalaryList.push({
    date: startDate.toISOString(),
    ordinarySalary: startMonthOrdinaryDailySalary * startMonthWorkDays,
  });

  const numOfCalMonths = getAbsoluteMonths(leaveDate) - getAbsoluteMonths(startDate.toISOString());
  _.times(numOfCalMonths - 1, (i) => { // -1
    const monthsAfterStartDate = i + 1;
    const currentMonth = moment(startDate).startOf('month').month() + monthsAfterStartDate; // 0 = jan
    const currentStartDate = moment(startDate).month(currentMonth).startOf('month');
    ordinaryDailySalaryList.push({
      date: currentStartDate.toISOString(),
      ordinarySalary: monthlySalary,
    });
  });

  // lastMonth
  const lastDate = moment(leaveDate).startOf('day');
  const lastMonthWorkDays = lastDate.date();
  const lastMonthOrdinaryDailySalary = (monthlySalary / lastDate.daysInMonth());
  ordinaryDailySalaryList.push({
    date: moment(leaveDate).startOf('month').toISOString(),
    ordinarySalary: lastMonthOrdinaryDailySalary * lastMonthWorkDays,
  });

  return ordinaryDailySalaryList;
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    ordinaryMonthlySalaryList: getOrdinaryMonthlySalary(mergedInputValues),
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
