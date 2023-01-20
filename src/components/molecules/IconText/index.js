import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { palette } from 'styled-theme';

import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

const StyledText = styled(Text)`

`;

const IconText = ({
  icon,
  iconSize = 20,
  children,
  ...props
}) => {
  return (
    <Text
      {...props}
    >
      {children}
      <Icon icon="edit" height={iconSize} />
    </Text>
  );
};

IconText.propTypes = {};

IconText.defaultProps = {};

export default IconText;
