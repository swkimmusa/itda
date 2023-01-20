import objectUtils from './utils/objects';

const { flatten } = objectUtils;

const theme = {};

theme.palette = {
  primary: ['#AE21FF'],
  secondary: ['#B2F505'],
  white: [
    '#fff',
    '#f6f9fc',
  ],
  black: ['#000000'],
  grayscale: [
    '#797979',
    '#CCCCCC',
    '#FAFAFB',
    '#E6E5EA',
  ],
  red: ['#47000a'],
  yellow: ['#a16600'],
  green: ['#0d200e'],
  blue: ['#072E4B'],
};

theme.fonts = { primary: 'Pretendard' };
const sizes = {
  padding: {
    default: '12px',
    large: '36px',
  },
  margin: {
    default: '12px',
    large: '24px',
  },
  maxWidth: '1100px',
  mobileBreakpoint: '1024px',
};

theme.sizes = flatten(sizes);

export default theme;
