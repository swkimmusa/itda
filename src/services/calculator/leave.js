import { stringify } from 'qs';
import _, {
  clone, get,
} from 'lodash';
import moment from 'moment';
import {
  format, unformat,
} from 'number-currency-format';
import {
  roundCurrency, roundTo,
} from '../formatCurrency';

const defaultInputValues = {

  smallBusiness: true,
  contractWeeklyHours: null,

  joinDate: moment('2020-12-01').toISOString(),
  payDate: moment('2045-12-01').toISOString(),

  basis: 'joinDate', // | 'accountingDate'

  joinDateBasedLeaves: [], // [{ date: ISOString, leaves: Number }]
  accountingDateBasedLeaves: [],
};

const mergeInputValues = (inputValues) => {
  return {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
};

const getJoinDateBasedLeaves = (inputValues) => {
  const {
    joinDate,
    payDate,
  } = inputValues;

  const leaves = [];

  // first 11 months
  _.times(11).map((i) => {
    const monthsAfterJoin = i + 1;
    const date = moment(joinDate).add(monthsAfterJoin, 'months');

    if (date.isAfter(moment(payDate))) return;

    const leaveObj = {
      date: date.toISOString(),
      leave: 1,
    };
    leaves.push(leaveObj);
  });

  // first full year
  const oneYearAfterJoin = moment(joinDate).add(1, 'year').startOf('day');
  if (!oneYearAfterJoin.isAfter(moment(payDate))) {
    leaves.push({
      date: oneYearAfterJoin.toISOString(),
      leave: 15,
    });
  }

  // every year after 1 year
  const numOfYearsPast1 = Math.max(moment(payDate).diff(oneYearAfterJoin, 'years'), 0);

  _.times(numOfYearsPast1, (i) => {
    const yearsAfterFirst = i + 1;
    const date = moment(oneYearAfterJoin).add(yearsAfterFirst, 'years');

    if (date.isAfter(moment(payDate))) return;

    const leaveObj = {
      date: date.toISOString(),
      leave: 15 + roundTo(yearsAfterFirst / 2, 0, 'down'),
    };
    leaves.push(leaveObj);
  });
  return leaves;
};

const getAccountingDateBasedLeaves = (inputValues) => {
  const {
    joinDate,
    payDate,
  } = inputValues;
  const nextYearStartDate = moment(joinDate).add(1, 'year').startOf('year');

  const leaves = [];

  // last calendar year
  const prevYearWorkDays = nextYearStartDate.diff(moment(joinDate), 'days'); // do not + 1 since diffed from jan 1st
  const prevYearLeaves = (15 * prevYearWorkDays) / 365;

  // first jan
  if (!nextYearStartDate.isAfter(moment(payDate))) {
    const prevYearLeavesRounded = roundTo(prevYearLeaves, 2, 'up');
    leaves.push({
      date: nextYearStartDate.toISOString(),
      leave: prevYearLeavesRounded,
    });
  }

  // first 11 months
  _.times(11).map((i) => {
    const monthsAfterJoin = i + 1;
    const date = moment(joinDate).add(monthsAfterJoin, 'months');

    if (date.isAfter(moment(payDate))) return;

    const leaveObj = {
      date: date.toISOString(),
      leave: 1,
    };
    leaves.push(leaveObj);
  });

  // second jan
  const secondJanFirst = nextYearStartDate.add(1, 'year').startOf('year');
  if (!secondJanFirst.isAfter(moment(payDate))) {
    leaves.push({
      date: secondJanFirst.toISOString(),
      leave: 15,
    });
  }

  // after 3 years
  const numOfYearsPast3 = Math.max(moment(payDate).diff(secondJanFirst, 'years'), 0);

  _.times(numOfYearsPast3, (i) => {
    const yearsAfterSecondJanFirst = i + 1;
    const date = moment(secondJanFirst).add(yearsAfterSecondJanFirst, 'years');

    if (date.isAfter(moment(payDate))) return;

    const leaveObj = {
      date: date.toISOString(),
      leave: 15 + roundTo(yearsAfterSecondJanFirst / 2, 0, 'down'),
    };
    leaves.push(leaveObj);
  });
  return leaves;
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    joinDateBasedLeaves: getJoinDateBasedLeaves(mergedInputValues),
    accountingDateBasedLeaves: getAccountingDateBasedLeaves(mergedInputValues),
  };
  console.log(mergedInputValues);
  return {
    inputValues,
    result: mergedInputValues,
  };
};

export default calculate;
