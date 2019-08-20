import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={SignUp} props={childProps} />
    {/* Catch unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);