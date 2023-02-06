import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import { ifProp } from 'styled-tools';

import { ReactComponent as LoaderIcon } from './icons-o/loader.svg';
import { ReactComponent as LogoIcon } from './icons-o/logo.svg';
import { ReactComponent as CaretIcon } from './icons-o/caret.svg';
import { ReactComponent as XIcon } from './icons-o/x.svg';
import { ReactComponent as CalcIcon } from './icons-o/calc.svg';
import { ReactComponent as CalendarIcon } from './icons-o/calendar.svg';
import { ReactComponent as YearlyIcon } from './icons-o/yearly.svg';
import { ReactComponent as HourlyIcon } from './icons-o/hourly.svg';
import { ReactComponent as EditIcon } from './icons-o/edit.svg';
import { ReactComponent as DeleteIcon } from './icons-o/delete.svg';
import { ReactComponent as LMIcon } from './icons-o/left-menu-icon.svg';

const ReactIcons = {
  loader: LoaderIcon,
  logo: LogoIcon,
  caret: CaretIcon,
  x: XIcon,
  calc: CalcIcon,
  calendar: CalendarIcon,
  yearly: YearlyIcon,
  hourly: HourlyIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  leftMenuIcon: LMIcon,
};

const fillStyle = css`
  .filled {
    fill: none;
    stroke: none;
  }
  ${ifProp(
    'filled',
    css`
      .filled {
        fill: currentcolor;
        stroke: currentcolor;
      }
      .unfilled {
        fill: none;
        stroke: none;
      }
    `,
  )};
`;

const fillHover = css`
  ${ifProp(
    'filled',
    ifProp(
      'unfillOnHover',
      null,
      css`
        .filled {
          fill: ${({ hoverPalette }) => palette(hoverPalette, 0)};
          stroke: ${({ hoverPalette }) => palette(hoverPalette, 0)};
        }
      `,
    ),
  )};
`;

const fillOnHover = css`
  ${ifProp(
    'fillOnHover',
    css`
      .filled {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
      }
      .unfilled {
        fill: none;
        stroke: none;
      }
    `,
  )};
`;

const unfillOnHover = css`
  ${ifProp(
    'unfillOnHover',
    css`
      .filled {
        fill: none;
        stroke: none;
      }
      .unfilled {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
      }
    `,
  )};
`;

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  color: ${ifProp(
    'palette',
    // ifProp({ palette: 'white' }, palette({ gray: 0 }, 0), palette({ gray: 0 }, 3)),
    'currentcolor',
    'white',
  )};
  height: ${({ height }) => `${height}px`};
  width: ${({ height }) => `${height}px`};

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* fill: currentcolor; */
    /* stroke: currentcolor; */
    fill: ${(props) => (props.fill ? props.fill : '')};
    stroke: ${(props) => (props.stroke ? props.stroke : '')};
    ${fillStyle};
  }

  ${ifProp(
    'hoverPalette',
    css`
      &:hover > svg {
        fill: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        stroke: ${({ hoverPalette }) => palette(hoverPalette, hoverPalette === 'gray' ? 0 : 3)};
        ${unfillOnHover};
        ${fillOnHover};
        ${fillHover};
      }
    `,
  )};
`;

const Icon = ({
  icon,
  ...props
}) => {
  const ReactIcon = ReactIcons[icon];
  return (
    <Wrapper {...props}>
      {ReactIcon ? (
        <ReactIcon />
      ) : null}
    </Wrapper>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  height: PropTypes.number,
  hoverPalette: PropTypes.string,
  palette: PropTypes.string,
};

Icon.defaultProps = {
  height: 1.5,
  hoverPalette: 'gray',
  palette: 'gray',
};

export default Icon;
