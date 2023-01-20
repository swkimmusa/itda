import {
  useLocation, useNavigate,
} from 'react-router-dom';
import get from 'lodash/get';
import qs from 'qs';
import {
  useEffect, useCallback,
} from 'react';

const parseQueryFromUrl = (search) => qs.parse(search, { ignoreQueryPrefix: true });

export default (options = {}) => {
  const { initialQueryParams = {} } = options;
  const location = useLocation();
  const navigate = useNavigate();

  const { search } = location;

  const initialQueryParamsString = qs.stringify(
    initialQueryParams,
    { skipNulls: true },
  );
  const queryParams = parseQueryFromUrl(search);
  const queryString = qs.stringify(
    queryParams,
    { skipNulls: true },
  );

  const setQueryParams = useCallback((mapper, opt) => {
    const shouldReplace = get(opt, 'replace', true);
    const newQueryParams = mapper(qs.parse(queryString));
    const queryStr = qs.stringify(
      newQueryParams,
      { skipNulls: true },
    );
    if (shouldReplace) {
      navigate(`?${queryStr}`, { replace: true });
    } else {
      navigate(`?${queryStr}`);
    }
  }, [
    queryString,
    navigate,
  ]);

  useEffect(() => {
    if (!initialQueryParamsString) return;
    if (queryString) return;
    navigate(`?${initialQueryParamsString}`);
  }, [/* only runs once on initial render */]);

  return {
    queryParams,
    setQueryParams,
  };
};
