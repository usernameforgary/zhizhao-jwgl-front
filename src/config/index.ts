import { GlobalConfig, Setting } from "../customtypes";

let globalConfig: GlobalConfig = {
    getToken: () => "",
    setting: {
        cdn: '',
        apiGateway: '',
        publicOSS: '',
        privateOSS: ''
    },
    moment: {},
    errorHandlers: {
        authorizationFail: (err) => {
            window.alert(err.toString());
        },
        authenticationFail: (err) => {
            window.alert(err.toString());
        },
        apiFail: (err) => {
            window.alert(err.message);
        }
    },
    service: {}
};

const win: { [key: string]: any } = window;

const getGlobalConfig = (): GlobalConfig => {
    if (win['__GLOBAL_CONFIG__']) {
        return win['__GLOBAL_CONFIG__'];
    }
    return globalConfig;
}

const config = (option: GlobalConfig) => {
    globalConfig = {
        ...option
    };
    win['__GLOBAL_CONFIG__'] = globalConfig;
}

//TODO need implement
const setting: Setting = win['__SETTING__'] ? {
    cdn: win['__SETTING__'].cdn,
    publicOSS: win['__SETTING__'].publicOSS,
    privateOSS: win['__SETTING__'].privateOSS,
    apiGateway: win['__SETTING__'].apiGateway
} : {
    cdn: "",
    publicOSS: "",
    privateOSS: "",
    apiGateway: "http://localhost:8586"
    //apiGateway: "http://139.224.133.133:8586"
}

export {
    getGlobalConfig,
    config,
    setting
}