import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  palette, size,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import _ from 'lodash';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

import DayCard from './DayCard';

import { rowCardStyles } from './styles';

// import BaseInput, { styles as inputStyles } from '../Input/BaseInput';

import BaseInput, { styles as inputStyles } from '../../molecules/Input/BaseInput';

const Container = styled(Flex)`
  flex-direction: column;
`;
const HeaderContainer = styled(Flex)`
  flex-wrap: wrap;
  align-items: center;
  `;

const HeaderText = styled(Text)`
  font-size: 18px;
  color: ${palette('black', 0)};
  font-weight: 500;
`;

const DayOfWeekLabel = styled(Text)`
  align-self: center;
  white-space: nowrap;
  color: ${palette('black', 0)};
`;

const StyledInput = styled(BaseInput)`
  flex-basis: 100px;
  margin-left: 16px;
  flex-grow: 1;
  text-align: end;
`;
const TimeMinutTextContainer = styled(Flex)`
  align-items: center;
  margin-left: 8px;
`;
const TimeMinueText = styled(Text)`
  white-space: nowrap;
`;
const ListContainer = styled(Flex)`
  flex-direction: column;
`;

const RowContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  margin: 2px -2px;
  flex-wrap: wrap;
`;

const HeaderCard = styled(Card)`
  padding: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${palette('white', 0)};
  border: 1px solid ${palette('grayscale', 3)};

  ${rowCardStyles};
`;

const StyledDayCard = styled(DayCard)`
  ${ifProp(
    'disabled',
    css`
      opacity: 0.8;
      color: ${palette('grayscale', 1)};
      pointer-events: none;
    `,
  )};
`;

const dayOfWeekLabelList = _.times(7).map((v) => moment().day(0 + v).format('dd'));

const getHoursFromMinutes = (v) => ((v - (v % 60)) / 60);

const MonthlyHoursSelect = ({
  onChange,
  value,
  ...props
}) => {
  const {
    list,
    baseDate,
  } = value;
  const formattedBaseDate = dayjs(baseDate)
    .startOf('month')
    .hour(9)
    .toISOString();
  const pickBaseDateMonth = (str) => {
    onChange({
      list,
      baseDate: dayjs(formattedBaseDate)
        .year(moment(str).year())
        .month(moment(str).month())
        .toISOString(),
    });
  };
  const daysInBaseMonth = moment(formattedBaseDate).daysInMonth();
  const startPad = moment(formattedBaseDate).startOf('month').day();
  const endPad = 7 - (moment(formattedBaseDate).endOf('month').day() + 1);
  const days = [
    ..._.times(
      startPad,
      (i) => moment(formattedBaseDate)
        .subtract(startPad - i, 'days')
        .toISOString(),
    ),
    ..._.times(
      daysInBaseMonth,
      (i) => moment(formattedBaseDate)
        .add(i, 'days')
        .toISOString(),
    ),
    ..._.times(
      endPad,
      (i) => moment(formattedBaseDate)
        .endOf('month')
        .add((i + 1), 'days')
        .toISOString(),
    ),
  ];
  const calendarDays = daysInBaseMonth + startPad;

  const numOfCalWeeks = Math.ceil(calendarDays / 7);
  const rows = _.times(numOfCalWeeks, (i) => {
    const startIndex = i * 7;
    return days.slice(startIndex, startIndex + 7);
  });
  console.log(days);
  console.log(rows);
  // const rows =
  return (
    <Container
      white
      {...props}
    >
      <HeaderContainer>
        <DatePicker
          style={{ fontSize: 18 }}
          onChange={(date, str) => pickBaseDateMonth(str)}
          size="large"
          picker="month"
          value={dayjs(formattedBaseDate)}
        />
        <HeaderText style={{ marginLeft: 8 }}>의 근무을 입력해 주세요.</HeaderText>
      </HeaderContainer>
      <RowContainer>
        {dayOfWeekLabelList.map((v, i) => {
          return (
            <HeaderCard key={v}>
              {v}
            </HeaderCard>
          );
        })}
      </RowContainer>
      {rows.map((daysInWeek, ri) => (
        <RowContainer key={ri}>
          {daysInWeek.map((day, i) => {
            return (
              <StyledDayCard
                key={day}
                date={day}
                selected={false}
                disabled={!(
                  moment(formattedBaseDate).year() === moment(day).year()
                    && moment(formattedBaseDate).month() === moment(day).month()
                )}
              />
            );
          })}
        </RowContainer>
      ))}
      <ListContainer>
        {dayOfWeekLabelList.map((v, i) => {
          const valueIndex = i;
          const rowLabel = dayOfWeekLabelList[valueIndex];
          const currentDay = moment(formattedBaseDate);
          const currentValue = list[valueIndex] || [
            formattedBaseDate,
            formattedBaseDate,
          ];
          const diffMinutes = moment(currentValue[1]).diff(moment(moment(currentValue[0])), 'minutes');
          return (
            <RowContainer
              key={rowLabel}
            >
              <DayOfWeekLabel>{rowLabel}</DayOfWeekLabel>
              <StyledInput
                value={getHoursFromMinutes(diffMinutes)}
                type="number"
                onChange={(hour) => {
                  const newList = list.slice();
                  const inputValue = Number(hour.target.value);
                  const limitedInputValue = inputValue > 23 ? 23 : (inputValue < 0 ? 0 : inputValue);
                  const prevHours = getHoursFromMinutes(diffMinutes);
                  const newMinutes = diffMinutes - (prevHours * 60) + (limitedInputValue * 60);
                  const newValue = [
                    moment(formattedBaseDate).day(valueIndex).toISOString(),
                    moment(formattedBaseDate).day(valueIndex).add(newMinutes, 'minutes').toISOString(),
                  ];
                  newList[valueIndex] = newValue;
                  console.log({
                    baseDate: formattedBaseDate,
                    list: newList,
                  });
                  console.log(onChange);
                  console.log(props);
                  onChange({
                    baseDate: formattedBaseDate,
                    list: newList,
                  });
                }}
              />
              <TimeMinutTextContainer>
                <TimeMinueText>
                  시간
                </TimeMinueText>
              </TimeMinutTextContainer>

              <StyledInput
                value={diffMinutes % 60}
                type="number"
                max={60}
                onChange={(minute) => {
                  const newList = list.slice();
                  const inputValue = Number(minute.target.value);
                  const limitedInputValue = inputValue > 59 ? 59 : (inputValue < 0 ? 0 : inputValue);
                  const prevMinutes = diffMinutes % 60;
                  const newMinutes = diffMinutes - prevMinutes + limitedInputValue;
                  const newValue = [
                    moment(formattedBaseDate).day(valueIndex).toISOString(),
                    moment(formattedBaseDate).day(valueIndex).add(newMinutes, 'minutes').toISOString(),
                  ];
                  newList[valueIndex] = newValue;
                  onChange({
                    baseDate: formattedBaseDate,
                    list: newList,
                  });
                }}
              />
              <TimeMinutTextContainer>
                <TimeMinueText>
                  분
                </TimeMinueText>
              </TimeMinutTextContainer>

            </RowContainer>
          );
        })}
      </ListContainer>

    </Container>
  );
};

MonthlyHoursSelect.propTypes = {
  startDayIndex: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    baseDate: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.number),
  }),
};

MonthlyHoursSelect.defaultProps = {
  startDayIndex: 0, // sunday
  onChange: (v) => console.log('[MonthlyHoursSelect] onChange() ', v),
  value: {},
};

export default MonthlyHoursSelect;
