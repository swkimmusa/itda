import { stringify } from 'qs';
import _, {
  clone, get, each, max,
} from 'lodash';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  format, unformat,
} from 'number-currency-format';
import {
  formatCurrency, roundCurrency,
} from '../formatCurrency';

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
    weeklyHolidayRangeList: [],
  },
  monthlyHours: {
    baseDate: null,
    list: [],
    weeklyHolidayRangeList: [],
  },
};
const keyToLabel = {};

const calculatedValues = { hoursWorked: 0 };

const mergeInputValues = (inputValues) => {
  const merged = {
    ...clone(defaultInputValues),
    ...clone(inputValues),
  };
  console.log({
    defaultInputValues,
    inputValues,
    merged,
  });
  return merged;
};

const getTotalHoursWorked = (hours) => {
  const hoursList = hours.filter((v) => v != null);
  const minutesList = hoursList.map((range) => {
    const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
    return difference;
  });
  return minutesList.reduce((ac, cu) => ac + cu, 0) / 60;
};

// const isSameMonth = (baseDate, date) => moment(baseDate).startOf('month').diff(moment(date).startOf('month'), 'minutes') === 0;
const isSameMonthByWeek = (dayOne, dayTwo) => {
  const dayOneWeekRange = [
    moment(dayOne).startOf('month').weeks(),
    moment(dayOne).endOf('month').weeks(),
  ];
  return dayOneWeekRange[0] <= moment(dayTwo).weeks() && moment(dayTwo).weeks() <= dayOneWeekRange[1];
};
const isSameMonth = (dayOne, dayTwo) => {
  return moment(dayOne).format('YYYY-MM') === moment(dayTwo).format('YYYY-MM');
};

const getHoursWorked = (inputValues) => {
  const {
    hoursWorked,
    hoursPerDay,
    conversionType,
    daysPerWeek,
    daysWorked,
    weeklyHours,
    monthlyHours,
    baseDate,
  } = inputValues;
  console.log({
    weeklyHours,
    monthlyHours,
  });
  const weeklyHoursList = _.get(weeklyHours, 'list', []).filter((v) => v != null);
  if (conversionType === 'weekly') {
    return getTotalHoursWorked(weeklyHoursList);
  }
  const monthlyHoursList = _.get(monthlyHours, 'list', []).filter((v) => v != null).filter((v) => isSameMonth(baseDate, v[0]));
  if (conversionType === 'monthly') {
    return getTotalHoursWorked(monthlyHoursList);
  }

  if (hoursWorked) return hoursWorked;

  return hoursPerDay * daysWorked;
};

const getWeeklyHoursWorked = (inputValues) => {
  const {
    conversionType,
    monthlyHours,
  } = inputValues;
  const { baseDate } = monthlyHours;

  if (conversionType === 'weekly') return [getHoursWorked(inputValues)];

  const numOfWeeks = moment(monthlyHours.baseDate).endOf('month').weeks() - moment(monthlyHours.baseDate).startOf('month').weeks() + 1;
  const startWeekIndex = moment(monthlyHours.baseDate).startOf('month').weeks();
  const thisMonth = _.get(monthlyHours, 'list', []).filter((range) => isSameMonthByWeek(range[0], monthlyHours.baseDate));
  const byWeeks = _.groupBy(thisMonth, (range) => `${moment(range[0]).year()}-${moment(range[0]).weeks()}`);
  const hoursWorkedByWeek = _.map(
    _.times(numOfWeeks),
    (weekOfMonth) => {
      const rangeList = byWeeks[`${moment(baseDate).year()}-${startWeekIndex + weekOfMonth}`] || [];
      console.log({
        byWeeks,
        key: `${moment(baseDate).year()}-${startWeekIndex + weekOfMonth}`,
        rangeList,
      });
      return getTotalHoursWorked(rangeList) || 0;
    },
  );
  console.log({
    thisMonth,
    byWeeks,
    hoursWorkedByWeek,
  });
  return hoursWorkedByWeek;
};
const getMonthlyHoursWorked = (inputValues) => {
  const {
    conversionType,
    monthlyHours,
  } = inputValues;
  const { baseDate } = monthlyHours;

  if (conversionType === 'weekly') return [getHoursWorked(inputValues)];
  const thisMonth = _.get(monthlyHours, 'list', []).filter((range) => isSameMonth(range[0], baseDate));
  return [getTotalHoursWorked(thisMonth)];
};

const getWeeklyOverTime = (weeklyHours, hoursWorked) => {
  const weeklyHoursList = _.get(weeklyHours, 'list', []).filter((v) => v != null);

  const dailyOvertimeMinutesList = weeklyHoursList.map((range) => {
    const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
    return Math.max(0, difference - 480);
  });
  const dailyOvertimeMinutes = dailyOvertimeMinutesList.reduce((ac, cu) => ac + cu, 0);
  const minutesOver40Hours = Math.max(0, (hoursWorked * 60) - 2400);
  return max([
    // contractWeeklyHoursOvertime,
    dailyOvertimeMinutes / 60,
    minutesOver40Hours / 60,
  ]);
};

const getOvertimeWorkHours = (inputValues) => {
  const {
    conversionType,
    overtimeWorkHours,
    contractWeeklyHours,
    weeklyHours,
    hoursWorked,
  } = inputValues;
  if (overtimeWorkHours) return overtimeWorkHours;

  if (contractWeeklyHours) {
    if (conversionType === 'weekly') {
      return Math.max(0, hoursWorked - contractWeeklyHours);
    }
  }
  if (conversionType === 'weekly') {
    return getWeeklyOverTime(weeklyHours, hoursWorked);
  }
  return 0;
};


const getWeeklyOvertimeWorkHours = (inputValues) => {
  const {
    overtimeWorkHours,
    conversionType,
    monthlyHours,
    contractWeeklyHours,
    weeklyHoursWorked,
  } = inputValues;
  if (conversionType === 'weekly') return [getOvertimeWorkHours(inputValues)];
  const { baseDate } = monthlyHours;

  return weeklyHoursWorked.map((hours) => {
    if (overtimeWorkHours) return overtimeWorkHours / weeklyHoursWorked.length;
    if (contractWeeklyHours) {
      return Math.max(0, hours - contractWeeklyHours);
    }
    return getWeeklyOverTime();
  });
};

const getWeeklyHolidayHours = (inputValues) => {
  const {
    hoursWorked,
    conversionType,
    weeklyOvertimeWorkHours,
    weeklyHoursWorked,
    baseWorkHours,
    monthlyHours,
    contractWeeklyHours,
  } = inputValues;

  const { baseDate, weeklyHolidayRangeList } = monthlyHours;
  console.log({
    weeklyHoursWorked
  })
  if (conversionType === 'monthly') {
    const weeklyHolidayHours = weeklyHoursWorked
      // .filter((hours, i) => {
      //   const monthlyHoursList = _.get(monthlyHours, 'list', []).filter((v) => v != null).filter((v) => isSameMonth(baseDate, v[0]));
      // })
      .map((hours, i) => {
        const weekIndex = dayjs(baseDate).startOf('month').weeks() + i;
        const firstDayOfWeek = dayjs(baseDate).weeks(weekIndex).startOf('week').hour(9);
        const firstDayOfWeekISO = firstDayOfWeek.toISOString()
        console.log({
          weeklyHolidayRangeList,
          firstDayOfWeekISO,
          index: _.indexOf(weeklyHolidayRangeList, firstDayOfWeekISO),
          hours,
        })
        if (_.indexOf(weeklyHolidayRangeList, firstDayOfWeekISO) >= 0) {
          return hours
        }
        return 0;
      })
      .map((hours, i) => {
        const base = hours - weeklyOvertimeWorkHours[i];
        if (hoursWorked < 15) return 0;
        if (contractWeeklyHours < 15) return 0;
        if (base) return (base / 5);
        return 0;
      });
      console.log({
        weeklyHolidayHours
      })
      return _.sum(weeklyHolidayHours);
  }

  if (hoursWorked < 15) return 0;
  if (contractWeeklyHours < 15) return 0;
  if (baseWorkHours) return (baseWorkHours / 5);

  return 0;
};

const getBaseWorkHours = (inputValues) => {
  const {
    conversionType,
    hoursWorked,
    overtimeWorkHours,
    contractWeeklyHours,
    weeklyHoursWorked,
    monthlyHoursWorked,
    weeklyOvertimeWorkHours,
  } = inputValues;
  // const multiplier
  // if (contractWeeklyHours) return Math.min(contractWeeklyHours)
  console.log({
    hoursWorked,
    overtimeWorkHours,
    monthlyHoursWorked,
  });

  if (conversionType === 'monthly') {
    return _.sum(monthlyHoursWorked) - _.sum(weeklyOvertimeWorkHours);
  }

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
    weeklyOvertimeWorkHours,
    hourlyWage,
    smallBusiness,
    conversionType,
  } = inputValues;

  const multiplier = smallBusiness ? 1 : 1.5;
  const totalWorkHours = conversionType === 'weekly' ? overtimeWorkHours : _.sum(weeklyOvertimeWorkHours);
  return roundCurrency(multiplier * totalWorkHours * hourlyWage);
};

const calculate = (inputValues) => {
  let mergedInputValues = mergeInputValues(inputValues);

  mergedInputValues = {
    ...mergedInputValues,
    hoursWorked: getHoursWorked(mergedInputValues),
    weeklyHoursWorked: getWeeklyHoursWorked(mergedInputValues),
    monthlyHoursWorked: getMonthlyHoursWorked(mergedInputValues),
  };
  mergedInputValues = {
    ...mergedInputValues,
    overtimeWorkHours: getOvertimeWorkHours(mergedInputValues),
    weeklyOvertimeWorkHours: getWeeklyOvertimeWorkHours(mergedInputValues),
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
  console.log({
    totalWage: mergedInputValues.totalWage
  })
  mergedInputValues = {
    ...mergedInputValues,
    employmentInsurance: roundCurrency(mergedInputValues.totalWage * 0.009),
  };

  mergedInputValues = {
    ...mergedInputValues,
    netWage: roundCurrency(mergedInputValues.totalWage - mergedInputValues.employmentInsurance),
  };

  const result = mergedInputValues;
  const resultDisplay = [
    {
      label: '이름',
      value: result.name,
    },
    {
      label: '상시근로자수',
      value: result.smallBusiness ? '상시 5인 미만' : '상시 5인 근로',
    },
    {
      label: '환산기준',
      value: result.conversionType === 'weekly' ? '일/주급' : '월급',
    },
    {
      label: '시급',
      value: formatCurrency(result.hourlyWage),
    },
    {
      label: '근로계약서상 1주 근로시간',
      value: result.contractWeeklyHours ? `${result.contractWeeklyHours}시간` : `미입력(${0}시간)`,
    },
    {
      label: '공제액 합계',
      value: formatCurrency(result.employmentInsurance),
    },
    {
      label: '실수령액',
      value: formatCurrency(result.netWage),
    },
    {
      label: '기본급',
      value: formatCurrency(result.baseWage),
    },
    {
      label: '주휴수당',
      value: formatCurrency(result.weeklyHolidayWage),
    },
    {
      label: '연장근로수당',
      value: formatCurrency(result.overtimeWage),
    },
    {
      label: '월 급여',
      value: formatCurrency(result.totalWage),
    },
    {
      label: '고용보험(0.9%)',
      value: formatCurrency(result.employmentInsurance),
    },
    {
      label: '실수령액',
      value: formatCurrency(result.netWage),
    },
    {
      label: '총 근무시간',
      value: `${Math.floor(result.hoursWorked)}시간 ${(Math.ceil(result.hoursWorked * 60)) % 60}분`,
    },
    {
      label: '소정근로시간',
      value: `${result.hoursWorked - result.overtimeWorkHours || 0}시간`,
    },
    {
      label: '주휴시간',
      value: `${result.weeklyHolidayHours}시간`,
    },
    {
      label: '연장근로시간',
      value: `${result.overtimeWorkHours}시간`,
    },
  ];
  console.log({
    mergedInputValues,
    inputValues,
    result,
    resultDisplay,
  });
  return {
    inputValues,
    result,
    resultDisplay,
  };
};
const inputFrame = () => {
  return _.clone(defaultInputValues);
};
export default calculate;
export { inputFrame };
