import PropTypes from 'prop-types';
import styled from 'styled-components';

import startCase from 'lodash/startCase';
import {
  palette, size,
} from 'styled-theme';
import { ifProp } from 'styled-tools';

import Button from '../../atoms/Button';
import Flex from '../../atoms/Flex';

const Wrapper = styled(Flex)`
  position: fixed;
  bottom: 20px;
  left: 15px;
  right: 15px;
  flex-direction: column;
  background-color: transparent;
  @media (min-width: ${size('mobileBreakpoint')}){
    left: calc(250px + 15px);
  }
`;

const PageAction = ({
  actions,
  children,
  ...others
}) => (
  <Wrapper>
    {actions.map(({
      action,
      label,
      ...otherActionProps
    }) => (
      <Button
        key={label}
        label={label}
        onClick={action}
        {...otherActionProps}
      />
    ))}
    {children}
  </Wrapper>
);

PageAction.defaultProps = {
  actions: [{
    action: () => console.log('action'),
    label: 'pageactionbutton',
  }],
};

PageAction.propTypes = {};

export default PageAction;
