import { Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import NotFound from '../Pages/NotFound';
import Policies from '../Pages/Policies';

const RouterApp = () => {
  // public methods
  const routers = [
    { path: '/', element: <Home /> },
    { path: '/pages/policies', element: <Policies title={'Policies'} /> },
    {
      path: '/pages/terms-conditions',
      element: <Policies title={'Terms Conditions'} />,
    },
    { path: '*', element: <NotFound /> },
  ];

  return (
    <Routes>
      {routers.map((router, index) => {
        return (
          <Route path={router.path} element={router.element} key={index} />
        );
      })}
    </Routes>
  );
};

export default RouterApp;
