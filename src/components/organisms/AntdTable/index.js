import {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  palette,
  ifProp,
} from 'styled-tools';
import { Table } from 'antd';

import Flex from '../../atoms/Flex';

const StyledTable = styled(Table)`

  thead {
    tr:first-child >*:first-child{
      border-start-start-radius: 8px;
      border-end-start-radius: 8px;
    }
    tr:first-child >*:last-child{
      border-start-end-radius: 8px;
      border-end-end-radius: 8px;
    }
    tr {
      th {
        background-color: ${ifProp(
    { isExpanded: false },
    palette(
      'primary',
      0,
    ),
    palette(
      'white',
      0,
    ),
  )};
  color: ${ifProp(
    { isExpanded: false },
    palette(
      'white',
      0,
    ),
    palette(
      'black',
      0,
    ),
  )};
      }
    }
  }

  table {
    margin-bottom: 0px;
  }
`;

const StyledText = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const AntDTable = (props) => {
  const {
    cellRenderers,
    modelName,
    disableRowLink,
    data,
    itemsPerPage,
    showTitle,
    title,
    scroll,
    rowKey,
    pagination,
    count,
    onPageChange,
    currentPage,
    sortKey,
    sortOrder,
    onSort,
    expandable,
    isExpanded,
    loading,
    tableLayout = 'auto',
    rowSelection,
    pageSize,
    onItemsPerPageChange,
    bordered = 'true',
    size = 'large',
  } = props;
  const [
    isMobile,
    setIsMobile,
  ] = useState(window.innerWidth <= 1024);

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener(
      'resize',
      handleResize,
    );
  });

  const handleChange = (page, filter, sort) => {
    if (Number(pageSize) !== Number(page.pageSize)) {
      onItemsPerPageChange(({ itemsPerPage: page.pageSize }));
    }
    if (currentPage !== page.current) {
      onPageChange(({ currentPage: page.current }));
    }
    const sortDirection = sort.order === 'ascend' ? 'asc' : sort.order === 'descend' ? 'desc' : null;
    if (sortKey != null && (sortKey !== sort.field || sortDirection !== sortOrder)) {
      onSort({
        sortKey: sort.field,
        sortOrder: sortDirection,
      });
    }
  };
  return (
    <Flex direction="column">
      { showTitle ? <StyledText> {title} </StyledText> : null}
      <StyledTable
        columns={cellRenderers}
        dataSource={data}
        rowKey={rowKey}
        bordered={bordered}
        size={size}
        expandable={expandable}
        pagination={itemsPerPage > 0 ? {
          ...pagination,
          ...{ pageSize: itemsPerPage },
          total: count,
          current: Number(currentPage),
          simple: isMobile,
          hideOnSinglePage: false,
        } : false}
        scroll={true || scroll}
        onChange={handleChange}
        isExpanded={isExpanded}
        loading={loading}
        tableLayout={tableLayout}
        rowSelection={rowSelection}
      />
    </Flex>
  );
};

AntDTable.defaultProps = {
  disableRowLink: true,
  itemsPerPage: 0,
  showTitle: false,
  scroll: false,
  pagination: false,
  expandable: false,
  isExpanded: false,
  rowSelection: false,
  onItemsPerPageChange: (v) => console.log(
    '[AntDTable] onItemsPerPage(): ',
    v,
  ),
};

AntDTable.propTypes = {
  modelName: PropTypes.string.isRequired,
  cellRenderers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  disableRowLink: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  scroll: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  rowKey: PropTypes.string,
  expandable: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  isExpanded: PropTypes.bool,
  pagination: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  count: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onItemsPerPageChange: PropTypes.func,
  onSort: PropTypes.func,
  loading: PropTypes.bool,
};

export default AntDTable;
