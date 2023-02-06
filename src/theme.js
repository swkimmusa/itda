import objectUtils from './utils/objects';

const { flatten } = objectUtils;

const theme = {};

theme.palette = {
  primary: [
    '#AE21FF',
    '#D895FF',
  ],
  secondary: ['#B2F505'],
  white: [
    '#fff',
    '#f6f9fc',
  ],
  black: [
    '#000000',
    '#2B2B2B',
  ],
  grayscale: [
    '#797979',
    '#CCCCCC',
    '#F7F7F7', // FAFAFB
    '#E6E5EA',
  ],
  red: ['#47000a'],
  yellow: ['#a16600'],
  green: ['#BBFD12'],
  blue: [
    '#072E4B',
    '#F6F5FD',
    '#F4F4F7',
  ],
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
