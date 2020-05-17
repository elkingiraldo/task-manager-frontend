import React, { Component } from 'react';
import ListTasksComponent from './ListTasksComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginComponent from './LoginComponent';
import LogoutComponent from './LogoutComponent';
import MenuComponent from './MenuComponent';
import AuthenticationService from '../service/AuthenticationService';
import AuthenticatedRoute from './AuthenticatedRoute';

class InstructorApp extends Component {


    render() {
        return (
            <>
                <Router>
                    <>
                        <MenuComponent />
                        <Switch>
                            <Route path="/" exact component={LoginComponent} />
                            <Route path="/login" exact component={LoginComponent} />
                            <AuthenticatedRoute path="/logout" exact component={LogoutComponent} />
                            <AuthenticatedRoute path="/v1.0/tasks" exact component={ListTasksComponent} />
                        </Switch>
                    </>
                </Router>
            </>
        )
    }
}

export default InstructorApp