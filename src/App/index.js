import {
  Route,
  Routes,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from '@clerk/clerk-react';
import { koKR } from '@clerk/localizations';
import {
  palette, size,
} from 'styled-theme';
import styled, { css } from 'styled-components';

import _ from 'lodash';
import { ifProp } from 'styled-tools';
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

import LeaveFormView from '../pages/Leave/FormView';
import LeaveResultView from '../pages/Leave/ResultView';
import PayrollView from '../pages/Payroll';

const routes = [
  {
    label: '계산 내역',
    href: '/history',
    element: <History />,
    rootRoute: true,
  },
  {
    label: 'SignIn',
    href: '/sign-in',
    element: <SignIn />,
  },
  {
    label: 'SignUp',
    href: '/sign-up',
    element: <SignUp />,
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
  {
    label: 'LeaveForm',
    href: '/leave/calc/:id',
    element: <LeaveFormView />,
  },
  {
    label: 'LeaveResult',
    href: '/leave/result/:id',
    element: <LeaveResultView />,
  },
  {
    label: '급여관리',
    href: '/payroll',
    element: <PayrollView />,
    rootRoute: true,
  },
];

const Wrapper = styled(Flex)`
  box-shadow: rgba(50, 50, 93, 0.1) 0px 2px 4px;
  height: 100%;
  overflow: auto;
  background-color: ${palette('white', 0)};
`;

const PageWrapper = styled.div`
  padding-left: calc(250px + 25px);
  max-width: 100vw;
  padding-right: ${size('padding.default')};
  flex-grow: 1;
  background-color: ${palette('white', 0)};
  ${ifProp('$isGray', css`
    background-color: ${palette('blue', 2)};
  `)}

  @media (max-width: ${size('mobileBreakpoint')}){
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 50px;
  }


`;

const Layout = (props) => {
  const { pathname } = useLocation();
  const isGray = _.some(
    [
      '',
      'payroll',
    ],
    (check) => pathname.split('/')[1] === check,
  );
  return (
    <Wrapper>
      <LeftMenu
        links={[
          {
            label: '홈',
            href: '/',
          },
          ...routes.filter((v) => v.rootRoute),
        ]}
      />
      <PageWrapper $isGray={isGray}>
        <Header />

        <Outlet helo="hi" />

      </PageWrapper>
    </Wrapper>
  );
};
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
console.log(koKR);
const App = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
      localization={koKR}
    >
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
    </ClerkProvider>

  );
};

export default App;
