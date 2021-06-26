import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import { config as configLib, setting } from './config';
import customeService from './services/overrides'
import dayjs from 'dayjs';
import { getStore } from './store/useStore';
import { IMainStore } from './customtypes';
import DengLu from './pages/denglu/DengLu';
import PrivateRouter from "./components/privateRotuer";

import './store';
import Index from './pages/index/Index';
import Page404 from './pages/page404/Page404';

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
            if (window.location.pathname === "/") {
                return;
            }
            getStore<IMainStore>().logout();
            window.location.href = "/";
        },
        authenticationFail: (err) => {
            alert("没有权限");
        },
        apiFail: (err) => {
            console.log('---api error--')
        }
    },
    service: {}
}));

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={DengLu} />
                {/* <Route path="/index" component={protectedRoute(Index)}></Route> */}
                <PrivateRouter component={Index} path="/sys" />
                <Route path="*" component={Page404} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
