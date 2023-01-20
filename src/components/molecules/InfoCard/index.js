import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

const Key = styled(Text)`
  flex: 1;
  font-size: 14px;
  align-self: flex-start;
  color: ${palette('grayscale', 0)};
`;

const Value = styled(Text)`
  font-size: 14px;
  align-self: flex-end;
  color: ${palette('black', 0)};
`;
const KeyValue = ({
  label,
  value,
  valueStyle,
}) => {
  return (
    <Flex style={{
      flexDirection: 'row',
      flex: 1,
      padding: 10,
    }}
    >
      <Key>{label}</Key>
      <Value style={valueStyle}>{value}</Value>
    </Flex>
  );
};

const InfoCard = ({
  info,
  src,
  label,
  valueStyle,
  ...props
}) => {
  return (
    <Card
      {...props}
    >
      {info.map((data) => {
        return (
          <KeyValue key={data.label} valueStyle={valueStyle} {...data} />
        );
      })}
    </Card>
  );
};

InfoCard.propTypes = {};

InfoCard.defaultProps = {
  info: [{
    key: 'sample',
    value: 'value',
  }],
};

export default InfoCard;
