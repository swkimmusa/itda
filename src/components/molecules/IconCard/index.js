import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

const IconCard = ({
  icon,
  src,
  label,
  ...props
}) => {
  return (
    <Card
      white
      {...props}
    >
      <Image height={80} width={80} src={src} />
      <Text>{label}</Text>
    </Card>
  );
};

IconCard.propTypes = {
  title: PropTypes.string,
  hourly: PropTypes.number,
  type: PropTypes.string,
  beforeTax: PropTypes.number,
  afterTax: PropTypes.number,
  date: PropTypes.string, // ISO string
};

IconCard.defaultProps = {
  title: 'title',
  hourly: 10000,
  type: 'monthly',
  beforeTax: 321000,
  afterTax: 321000,
  date: moment().toISOString(),
};

export default IconCard;
