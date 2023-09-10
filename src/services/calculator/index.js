import hourlyCalc from './hourly';
import annualCalc from './annual';
import leaveCalc from './leave';
import severanceCalc from './severance';

const calc = (type, inputValues) => {
  switch (type) {
  case 'hourly':
    return hourlyCalc(inputValues);
  case 'annual':
    return annualCalc(inputValues);
  case 'leave':
    return leaveCalc(inputValues);
  case 'severance':
    return severanceCalc(inputValues);
  default:
    return hourlyCalc(inputValues);
  }
};
export default calc;
export {
  hourlyCalc,
  annualCalc,
  leaveCalc,
  severanceCalc,
};
