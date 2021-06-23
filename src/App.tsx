import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppLayout from './layout/applayout/AppLayout';
import 'antd/dist/antd.css';
import './App.css';
import { getComponentByName } from './router';
import protectedRoute from './components/protectedRoute';
import { config as configLib, setting } from './config';
import customeService from './services/overrides'
import dayjs from 'dayjs';
import { getStore } from './store/useStore';
import { IMainStore } from './customtypes';

import './store';

configLib(customeService({
    moment: dayjs,
    getToken: (): string => {
        const store = getStore<IMainStore>();
        return store.user.auth ?? '';
    },
    setting: {
        ...setting
    },
    errorHandlers: {
        authorizationFail: (err) => {
            console.log('---unauthorized--')
            if (window.location.pathname === '/login') {
                return;
            }
            getStore<IMainStore>().logout();
            window.location.href = '/login';
        },
        authenticationFail: (err) => {
            alert("没有权限");
        },
        apiFail: (err) => {
            console.log('---api error--')
            console.error(err);
        }
    },
    service: {}
}));

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={getComponentByName("denglu")}></Route>
                <Route path="/zhuye">
                    <AppLayout>
                        <Route component={protectedRoute(getComponentByName("zhuye"))}></Route>
                    </AppLayout>
                </Route>
                <Route path="/home">
                    <AppLayout>
                        <Route component={protectedRoute(getComponentByName("yuangong"))}></Route>
                    </AppLayout>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
