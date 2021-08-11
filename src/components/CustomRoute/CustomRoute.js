import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const CustomRoute = ({ component: Component, where, allowed, redirect, ...rest }) => {
  // console.log(rest, where);
  return (
    <Route {...rest}>
      {allowed ? <Component {...rest} /> : <Redirect to={redirect} />}
    </Route>
  );
};

export default CustomRoute;
