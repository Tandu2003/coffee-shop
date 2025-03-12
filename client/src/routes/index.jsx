import { Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import NotFound from '../Pages/NotFound';
import Policies from '../Pages/Policies';
import Login from '../Pages/Login';
import ContactUs from '../Pages/ContactUs';
import AboutUs from '../Pages/AboutUs';
import BlogCoffee from '../Pages/Blogs/BlogCoffee';
import CoffeeClub from '../Pages/CoffeeClub';

const RouterApp = () => {
  // public methods
  const routers = [
    { path: '/', element: <Home /> },
    { path: '/products/coffee-club-subscription', element: <CoffeeClub /> },

    { path: '/pages/policies', element: <Policies title={'Policies'} /> },
    {
      path: '/pages/terms-conditions',
      element: <Policies title={'Terms Conditions'} />,
    },
    { path: '/pages/about-us', element: <AboutUs /> },
    { path: '/pages/contact-us', element: <ContactUs /> },
    { path: '/blogs/coffee-101', element: <BlogCoffee /> },

    {
      path: '/login',
      element: <Login />,
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
