import { ConfigProvider } from 'antd';
import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/lib/locale/zh_CN';
import store from './store'

ReactDOM.render(
    <React.StrictMode>
        <ConfigProvider locale={zhCN}>
            <Provider {...store}>
                <App />
            </Provider>
        </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
