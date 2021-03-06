// @flow
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import 'moment/locale/pl';

import { Profile as ProfileModel, Schedule as ScheduleModel } from '../Models';
import { ScrollToTop, AnonymousBar, AuthenticatedBar, BottomMenu, AnimatedRoute } from '../Components';
import { Home, Info, Loading, Login, Profile, Schedule, Speakers, Logistics, Talk } from '../Views';
import Results from "../Views/Results/Results";

export default class App extends Component {

    state = {
        title: '',
        isLoading: true,
        isLoggedIn: false,
        profile: {}
    };

    /**
     * Listen to database/firebase events and set
     * the app state in react to those events.
     */
    componentWillMount() {
        const { auth } = this.props;

        auth.on('userNotLogged', () => this.setState({
            isLoading: false,
            isLoggedIn: false
        }));

        auth.on('userLoggedIn', (user, dbSnapshot) => this.setState({
            isLoading: false,
            isLoggedIn: true,
            profile: new ProfileModel(user),
            schedule: new ScheduleModel(dbSnapshot.schedule),
            logistics: dbSnapshot.logistics,
            speakers: dbSnapshot.speakers,
            votes: dbSnapshot.votes
        }));
    }

    /**
     * Base on the app's data state, chooses the
     * best rendering strategy.
     */
    render() {
        const { isLoggedIn, isLoading } = this.state;

        if (isLoading) return this.renderLoader();
        if (!isLoggedIn) return this.renderLoginForm();

        return this.renderApp();
    }

    /**
     * Simple loading sign.
     */
    renderLoader() {
        return <div>
            <AnonymousBar title={this.state.title} />
            <Loading />
        </div>;
    }

    /**
     * Login form.
     */
    renderLoginForm() {
        const { actions } = this.props.auth;

        return <div>
            <AnonymousBar title="Logowanie" />
            <Login handleLogin={actions.login} />
        </div>;
    }

    /**
     * Renders a full version of app's gui. It assumes
     * that all the needed data are loaded and present
     */
    renderApp() {
        const { profile, title, logistics, schedule, speakers, votes } = this.state;
        const { actions } = this.props.auth;
        const titleStyle = {textOverflow: 'ellipsis', overflow: 'hidden'};

        const routesDefinitions = [{
                path: '/atm-event-app/home', exact: true,
            appTitle: () => <div style={titleStyle}>Event App</div>,
                main: () => <Home schedule={schedule}/>
            },
            {
                path: '/atm-event-app/schedule',
                appTitle: () => <div style={titleStyle}>Rozkład jazdy</div>,
                main: () => <Schedule schedule={schedule} votes={votes}/>
            },
            {
                path: '/atm-event-app/talk/:id',
                appTitle: (props) => <div style={titleStyle}>{schedule.findById(props.match.params.id).title}</div>,
                main: () => <Talk profile={profile} schedule={schedule} votes={votes} handleVote={actions.vote} />
            },
            {
                path: '/atm-event-app/info',
                appTitle: () => <div style={titleStyle}>Mapa wydarzenia</div>,
                main: () => <Info/>
            },
            {
                path: '/atm-event-app/logistics',
                appTitle: () => <div style={titleStyle}>Dojazd</div>,
                main: () => <Logistics text={logistics}/>
            },
            {
                path: '/atm-event-app/speakers',
                appTitle: () => <div style={titleStyle}>Prelegenci</div>,
                main: () => <Speakers speakers={speakers}/>
            },
            {
                path: '/atm-event-app/profile',
                appTitle: () => <div style={titleStyle}>{profile.displayName}</div>,
                main: () => <Profile profile={profile} handleLogout={actions.logout}/>
            },
            {
                path: '/atm-event-app/results',
                appTitle: () => <div style={titleStyle}>Wyniki głosowania</div>,
                main: () => <Results votes={votes}/>
            },
        ];

        const mainRoutesComponents = routesDefinitions.map((route, index) => (
            <AnimatedRoute key={index} path={route.path} exact={route.exact} view={route.main()} />
        ));

        // dynamically determine app bar title, with fallback to default title
        const titleComponent = <Switch>
            {routesDefinitions.map((route, index) => (
                <Route key={index} path={route.path} exact={route.exact} component={route.appTitle} />
            ))}
            <Route component={() => <div style={titleStyle}>{title}</div>} />
        </Switch>;

        return (
            <BrowserRouter history={createHistory({forceRefresh: true})}>
                <div>
                    <AuthenticatedBar title={titleComponent} profile={profile} />
                    <Route exact path="/atm-event-app" render={() => <Redirect to="/atm-event-app/home" />} />
                    {mainRoutesComponents}
                    <BottomMenu/>
                    <ScrollToTop/>
                </div>
            </BrowserRouter>
        )
    }
}
