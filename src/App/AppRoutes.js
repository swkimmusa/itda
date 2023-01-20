import styled from 'styled-components';
import {
  // Routes,
  // Navigate,
  Route,
} from 'react-router-dom';

import LeftMenu from '../containers/LeftMenu';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
`;

const AppRoutes = () => {
  const routes = [{}];
  return (
    <Wrapper>
      <LeftMenu links={routes} />

      {routes.map((route) => {
        const isInternal = route.href[0] === '/';
        if (!isInternal) return null;
        return (
          <Route key={route.href} path={route.href} element={route.element} />
        );
      })}
    </Wrapper>
  );
};

export default AppRoutes;
