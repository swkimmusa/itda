import { useState } from 'react';
import {
  useParams, useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import {
  size, palette, font,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import { format } from 'number-currency-format';
import get from 'lodash/get';
import moment from 'moment';
import _ from 'lodash';
import { CSVLink } from 'react-csv';
import {
  formatNumber, formatCurrency,
} from '../../services/formatCurrency';
import Flex from '../../components/atoms/Flex';
import Heading from '../../components/atoms/Heading';
import Button from '../../components/atoms/Button';
import ButtonRadio from '../../components/molecules/ButtonRadio';
import Text from '../../components/atoms/P';
import Label from '../../components/atoms/Label';
import Link from '../../components/atoms/Link';
import Input from '../../components/molecules/Input';
import IconText from '../../components/molecules/IconText';
import PageAction from '../../components/organisms/PageAction';
import InfoCard from '../../components/molecules/InfoCard';
import calc, {
  hourlyCalc, leaveCalc,
} from '../../services/calculator';
import calcActions from '../../store/calculation/actions';
import Card from '../../components/atoms/Card';
import AntDTable from '../../components/organisms/AntdTable';

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 15px;
  padding-bottom: 200px;
`;

const SectionWrapper = styled(Flex)`
  flex-direction: column;
  margin-bottom: 40px;
`;

const HeaderContainer = styled(Flex)`
  flex-direction: row;
  margin-top: 40px;
  flex-wrap: wrap;
  font-size: 26px;
  line-height: 32px;
  color: ${palette('black', 0)};
`;

const StyledInfoCard = styled(InfoCard)`
  margin-top: 10px;
`;

const HeaderValue = styled.span`
  font-weight: 700;
  color: ${palette('black', 0)};
  position: relative;
  white-space: nowrap;
  ::after {

    content: '';
    position: absolute;
    bottom: 0%;
    left: 0;
    height: 8px;
    width: 100%;
    background: ${palette('primary', 1)};
    z-index: -1;
  }
`;

const StyledIconText = styled(IconText)`
  position: relative;
  white-space: nowrap;
  ::after {

    content: '';
    position: absolute;
    bottom: 0%;
    left: 0;
    height: 8px;
    width: 100%;
    background: ${palette('grayscale', 1)};
    z-index: -1;
  }
`;

const Cell = styled.div`
  width: max-content;
`;

const conversionLabels = {
  hourly: '시급',
  monthly: '월급',
};

const cellRenderers = [
  {
    title: '이름',
    dataIndex: 'name',
    render: (
      data,
      row,
      rowIndex,
    ) => {
      return (
        <Cell>
          {data}
        </Cell>
      );
    },
  },
  {
    title: '급여형태',
    dataIndex: 'type',
    render: (
      data,
      row,
      rowIndex,
    ) => {
      return (
        <Cell>
          {conversionLabels[data]}
        </Cell>
      );
    },
  },
  {
    title: '예상급여',
    dataIndex: 'type',
    render: (
      data,
      row,
      rowIndex,
    ) => {
      const calcResult = calc(data, row);
      return (
        <Cell>
          {formatCurrency(_.get(calcResult, [
            'result',
            'netWage',
          ]))}
        </Cell>
      );
    },
  },
  {},
];
const TableContainer = styled(Flex)`
  margin-top: 20px;
`;

const PayrollView = (props) => {
  const { calculationList } = props;
  const navigate = useNavigate();

  const calculationIdList = _.map(calculationList, (v, k) => k);

  const hourlyCalculationList = calculationIdList.filter((id) => calculationList[id].type === 'hourly').map((id) => ({
    ...calculationList[id],
    id,
  }));
  const annualCalculationList = calculationIdList.filter((id) => calculationList[id].type === 'annual').map((id) => ({
    ...calculationList[id],
    id,
  }));

  const payrollCalculationList = [
    ...hourlyCalculationList,
    ...annualCalculationList,
  ];

  console.log({
    calculationList,
    hourlyCalculationList,
    annualCalculationList,
  });
  const keys = payrollCalculationList.map((v) => v.id);

  const filteredCalcList = keys.map((key) => {
    const calcResult = calc(calculationList[key].type, calculationList[key]);
    console.log({
      key,
      calculationList,
      calcResult,
    });
    return [
      {
        label: 'id',
        value: key,
      },
      ...calc(calculationList[key].type, calculationList[key]).resultDisplay,
    ];
  });
  console.log('#### ', filteredCalcList);
  const exportHeader = _.map(
    filteredCalcList,
    (calc) => {
      return calc.map((line) => line.label);
    },
  );
  const exportData = _.map(
    filteredCalcList,
    (calc) => {
      return calc.map((line) => line.value);
    },
  );
  const csvData = [
    exportHeader[0],
    ...exportData,
  ].filter((v) => !!v);
  return (
    <Wrapper>
      <SectionWrapper>
        <Heading level={3} palette="black">급여 관리</Heading>
        <Card white>
          <Flex style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          >
            <Heading level={4} palette="black" tone={1}>이번달 급여 현황</Heading>
            <CSVLink
              data={csvData}
              filename={`급여현황-${moment().format('YYYY-MMMM-Do')}.csv`}
              style={{
                margin: 0,
                textDecoration: 'none',
              }}
            >
              <Button
                label="리포트"
              />
            </CSVLink>
          </Flex>
          <TableContainer>
            <AntDTable
              modelName="model"
              cellRenderers={cellRenderers}
              data={payrollCalculationList}
              itemsPerPage={20}
              // onPageChange={onPageChange}
              currentPage={1}
              count={50}
              rowKey="id"
            />
          </TableContainer>
        </Card>

      </SectionWrapper>
    </Wrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: null,
  calculationList: state.calculation.list,
});

export default connect(mapStateToProps)(PayrollView);
