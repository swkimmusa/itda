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
import { COffcanvas } from '@coreui/react';

import { useState } from 'react';
import Card from '../../atoms/Card';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';

import DayCard from './DayCard';

import { rowCardStyles } from './styles';

// import BaseInput, { styles as inputStyles } from '../Input/BaseInput';

import BaseInput, { styles as inputStyles } from '../../molecules/Input/BaseInput';
import Input from '../../molecules/Input';
import Button from '../../atoms/Button';

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
  flex-grow: 1;
  text-align: end;
`;
const TimeMinuteTextContainer = styled(Flex)`
  flex: 0;
  align-items: center;
  margin-left: 8px;
  margin-right: 8px;
`;
const TimeMinuteText = styled(Text)`
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
  cursor: pointer;
  border: 2px solid ${palette('grayscale', 4)};;
  ${ifProp(
    'disabled',
    css`
      opacity: 0.5;
      color: ${palette('grayscale', 4)};
      pointer-events: none;
    `,
  )};
  ${ifProp(
    'selected',
    css`
      border: 2px solid ${palette('green', 0)};
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
  const [
    selectedDays,
    setSelectedDays,
  ] = useState([]);
  const [
    hourV,
    setHourV,
  ] = useState(0);
  const [
    minuteV,
    setMinuteV,
  ] = useState(0);
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
  const minutesWorked = ((Number(hourV) || 0) * 60) + (Number(minuteV) || 0);

  console.log(value, selectedDays);
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
        <HeaderText style={{ marginLeft: 8 }}>의 근무 시간을 입력해 주세요.</HeaderText>
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
            const isSelected = selectedDays.indexOf(day) > -1;
            const range = _.find(value.list, (v) => v[0] === day);
            const minutes = range && moment(range[1]).diff(moment(range[0]), 'minutes');
            return (
              <StyledDayCard
                onClick={() => {
                  if (!isSelected) {
                    return setSelectedDays(_.uniq([
                      ...selectedDays,
                      day,
                    ]));
                  }
                  return setSelectedDays([
                    ...selectedDays,
                    day,
                  ].filter((v) => v !== day));
                }}
                key={day}
                date={day}
                selected={isSelected}
                disabled={!(
                  moment(formattedBaseDate).year() === moment(day).year()
                    && moment(formattedBaseDate).month() === moment(day).month()
                )}
                minutesWorked={minutes}
              />
            );
          })}
        </RowContainer>
      ))}

      <COffcanvas
        visible={selectedDays.length > 0}
        placement="bottom"
        backdrop={false}
        onHide={() => {}}
        style={{
          height: 'auto',
          backgroundColor: 'transparent',
          border: 'none',
          width: '100vh',
        }}
      >
        <Card white>
          <Text style={{
            fontSize: 18,
            fontWeight: 'medium',
            color: 'black',
            marginBottom: 20,
          }}
          >근무 시간을 입력해주세요
          </Text>
          <Flex direction="row">
            <StyledInput
              value={hourV}
              type="number"
              onChange={(e) => setHourV(e.target.value)}
              required
            />
            <TimeMinuteTextContainer>
              <TimeMinuteText>
                시간
              </TimeMinuteText>
            </TimeMinuteTextContainer>
            <StyledInput
              value={minuteV}
              type="number"
              onChange={(e) => setMinuteV(e.target.value)}
              required
            />
            <TimeMinuteTextContainer>
              <TimeMinuteText>
                분
              </TimeMinuteText>
            </TimeMinuteTextContainer>
          </Flex>
          <Button
            style={{ marginTop: 15 }}
            label="시간 입력하기"
            onClick={() => {
              // const newList = list.slice();
              const newList = _.uniqBy(
                [
                  ...selectedDays.map((day) => {
                    const newValue = [
                      moment(day).toISOString(),
                      moment(day).add(minutesWorked, 'minutes').toISOString(),
                    ];
                    return newValue;
                  }),
                  ...list,
                ],
                (v) => _.get(v, [0]),
              );
              onChange({
                ...value,
                list: newList,
              });
              setSelectedDays([]);
              setHourV(0);
              setMinuteV(0);
            }}
          />
        </Card>
      </COffcanvas>
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
