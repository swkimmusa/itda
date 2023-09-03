import { stringify } from 'qs';
import _, {
  clone, get, each, max,
} from 'lodash';
import moment from 'moment';
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
  },
  monthlyHours: {
    baseDate: null,
    list: [],
  },
};
const keyToLabel = {};

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
    monthlyHours,
  } = inputValues;

  if (conversionType === 'weekly') {
    const minutesList = weeklyHours.list.map((range) => {
      const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
      return difference;
    });
    return minutesList.reduce((ac, cu) => ac + cu, 0) / 60;
  }
  if (conversionType === 'monthly') {
    const minutesList = monthlyHours.list.map((range) => {
      const difference = get(range, 'length') === 2 ? moment(range[1]).diff(moment(range[0]), 'minutes') : 0;
      return difference;
    });
    return minutesList.reduce((ac, cu) => ac + cu, 0) / 60;
  }

  if (hoursWorked) return hoursWorked;

  return hoursPerDay * daysWorked;
};

const getWeeklyOverTime = (weeklyHours, hoursWorked) => {
  const numOfWorkDays = _.uniq(weeklyHours.list.map((range) => moment(range[0]).startOf('day').toISOString()));

  const dailyOvertimeMinutesList = weeklyHours.list.map((range) => {
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
  if (conversionType === 'weekly') {
    return getWeeklyOverTime(weeklyHours, hoursWorked);
  }
  if (conversionType === 'monthly') {

  }
  return 0;
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
      value: `${result.contractWeeklyHours || 0}시간`,
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
