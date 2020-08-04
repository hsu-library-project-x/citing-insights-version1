import React from "react";
import { Redirect, Route } from "react-router-dom";

export const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <Component {...props} {...rest} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} /> 
);