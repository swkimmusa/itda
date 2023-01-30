import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';

import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import History from '../pages/History';
import LeftMenu from '../containers/LeftMenu';
import Header from '../containers/Header';
import Flex from '../components/atoms/Flex';

import HourlyFormView from '../pages/Hourly/FormView';
import HourlyResultView from '../pages/Hourly/ResultView';

import AnnualFormView from '../pages/Annual/FormView';
import AnnualResultView from '../pages/Annual/ResultView';

import SeveranceFormView from '../pages/Severance/FormView';
import SeveranceResultView from '../pages/Severance/ResultView';

const routes = [
  {
    label: 'Recent History',
    href: '/history',
    element: <History />,
  },
  {
    label: 'HourlyForm',
    href: '/hourly/calc/:id',
    element: <HourlyFormView />,
  },
  {
    label: 'HourlyResult',
    href: '/hourly/result/:id',
    element: <HourlyResultView />,
  },
  {
    label: 'AnnualForm',
    href: '/annual/calc/:id',
    element: <AnnualFormView />,
  },
  {
    label: 'AnnualResult',
    href: '/annual/result/:id',
    element: <AnnualResultView />,
  },
  {
    label: 'SeveranceForm',
    href: '/severance/calc/:id',
    element: <SeveranceFormView />,
  },
  {
    label: 'SeveranceResult',
    href: '/severance/result/:id',
    element: <SeveranceResultView />,
  },
];

const Wrapper = styled(Flex)`
  box-shadow: rgba(50, 50, 93, 0.1) 0px 2px 4px;
  height: 100%;
  overflow: auto;
`;

const PageWrapper = styled.div`
  padding-left: calc(250px + 25px);
  max-width: 100vw;
  padding-right: ${size('padding.default')};
  flex-grow: 1;

  @media (max-width: ${size('mobileBreakpoint')}){
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 50px;
  }
`;

const Layout = () => {
  return (
    <Wrapper>
      <LeftMenu links={routes} />
      <PageWrapper>
        <Header />

        <Outlet />

      </PageWrapper>
    </Wrapper>
  );
};

const App = () => {
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {routes.map((route) => {
            const isInternal = route.href[0] === '/';
            if (!isInternal) return null;
            return (
              <Route key={route.href} path={route.href} element={route.element} />
            );
          })}
          {/* 404 */}
          <Route path="*" component={NotFound} />
        </Route>
      </Routes>
    </Wrapper>
  );
};

export default App;
