import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import AppliedRoute from "./components/AppliedRoute";
import NewNote from "./containers/NewNote";
import NewTable from "./containers/NewTable";
import Notes from "./containers/Notes";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnAuthenticatedRoute from "./components/UnAuthenticatedRoute";
import Error from "./components/Error";

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/myNotes" exact component={Home} props={childProps} />
    <UnAuthenticatedRoute
      path="/myNotes/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnAuthenticatedRoute
      path="/myNotes/signup"
      exact
      component={SignUp}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/myNotes/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/myNotes/tables/new"
      exact
      component={NewTable}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/myNotes/notes/:id"
      exact
      component={Notes}
      props={childProps}
    />
    <AppliedRoute path="/err" exact component={Error} props={childProps} />
    {/* Catch unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);
