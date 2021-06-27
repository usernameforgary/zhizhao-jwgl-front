import axios from "axios";
import JSONbig from 'json-bigint';
import { getGlobalConfig } from "../config";
import { APIError, APIResponseBody, RequestMethod, RequestParams, RequsetHeader, SourceData } from "../customtypes";


axios.defaults.transformResponse = [function (data) {
    return data;
}];

const JWT_TOKEN_HEADER_KEY = 'Authorization';

const buildTokenHeader = (token: string, otherHeaders?: RequsetHeader) => {
    const header = {
        ...(otherHeaders ? otherHeaders : {})
    };
    header[JWT_TOKEN_HEADER_KEY] = 'Bearer ' + token;
    return header;
}

//TODO res类型先这么写，后面再确定是不是需要改
const convertResponse = (res: { [key: string]: any }) => {
    const globalConfig = getGlobalConfig();
    const convertor = globalConfig.service.convertResponse;
    if (convertor) {
        return convertor(res);
    }

    const body = {
        code: res['code'],
        data: res['data'],
        message: res['message']
    };

    return body;
}

const checkNoPermission = (body: APIResponseBody) => {
    const globalConfig = getGlobalConfig();
    const customCheckNoPermission = globalConfig.service.checkNoPermission;
    if (customCheckNoPermission) {
        return customCheckNoPermission(body);
    }
    if (Number(body.code) === 403) {
        return true;
    }
    return false;
};

const checkNoAuthorization = (body: APIResponseBody) => {
    const globalConfig = getGlobalConfig();
    const customCheckNoAuthorization = globalConfig.service.checkNoAuthrization;
    if (customCheckNoAuthorization) {
        return customCheckNoAuthorization(body);
    }
    if (Number(body.code) === 401) {
        return true;
    }
    return false;
};

const checkSuccess = (body: APIResponseBody) => {
    const globalConfig = getGlobalConfig();
    const customCheckSuccess = globalConfig.service.checkSuccess;
    if (customCheckSuccess) {
        return customCheckSuccess(body);
    }

    if (Number(body.code) === 0) {
        return true;
    }
    return false;
}

const invoke = async (method: RequestMethod, url: string, params?: RequestParams, headers?: RequsetHeader): Promise<SourceData> => {
    const globalConfig = getGlobalConfig();
    const customInvoke = globalConfig.service.invoke;
    if (customInvoke) {
        invoke(method, url, params, headers);
    }

    return new Promise((resolve, reject) => {
        const { setting, getToken, errorHandlers } = globalConfig;
        let fullUrl = setting.apiGateway;
        if (!fullUrl.endsWith('/')) {
            fullUrl = fullUrl + '/';
        }
        if (url.startsWith('/')) {
            url = url.substr(1);
        }

        fullUrl = fullUrl + url;

        const opt: { data: any } & any = {};
        if (params) {
            if (method === 'POST') {
                opt.data = params;
            } else {
                let qs = '';
                for (const key in params) {
                    qs += `${key}=${params[key]}&`;
                }
                if (qs !== '') {
                    qs = qs.substr(0, qs.length - 1);
                }
                if (qs) {
                    if (fullUrl.indexOf('?') > 0) {
                        fullUrl = fullUrl + qs;
                    }
                    else {
                        fullUrl = fullUrl + '?' + qs;
                    }
                }
            }
        }

        const token = getToken();
        if (token) {
            headers = buildTokenHeader(token, headers);
        }

        const doAuthorizationFail = (msg: string | Error) => {
            if (errorHandlers && errorHandlers.authorizationFail) {
                const result = errorHandlers.authorizationFail(msg);
                if (result === true) {
                    return true;
                }
            }
            return false;
        };
        const doAuthenticationFail = (msg: string | Error) => {
            if (errorHandlers && errorHandlers.authenticationFail) {
                const result = errorHandlers.authenticationFail(msg);
                if (result === true) {
                    return true;
                }
            }
            return false;
        };
        const doApiFail = (err: APIError) => {
            if (errorHandlers && errorHandlers.apiFail) {
                const result = errorHandlers.apiFail(err);
                if (result === true) {
                    return true;
                }
            }
            return false;
        };

        axios({
            method,
            url: fullUrl,
            responseType: 'json',
            headers,
            ...opt
        })
            .then((res) => {
                if (res.data && res.data['code'] !== undefined && res.data['code'] !== null) {
                    const body = convertResponse(res.data);
                    if (!checkSuccess(body)) {
                        const err = new APIError(body.code, body.message || 'unknow');
                        if (checkNoPermission(body)) {
                            if (doAuthenticationFail(body.message || 'no permission')) {
                                return;
                            }
                        } else if (checkNoAuthorization(body)) {
                            if (doAuthorizationFail(body.message || '认证失败')) {
                                return;
                            }
                        } else {
                            if (doApiFail(err)) {
                                return;
                            }
                        }
                        reject(err);
                    } else {
                        resolve(body.data);
                    }
                } else {
                    const err = new APIError('-1', 'Network Error');
                    if (doApiFail(err)) {
                        return;
                    }
                    reject(err);
                }
            })
            .catch((err) => {
                const { response } = err;
                if (response) {
                    if (response.status === 401) {
                        const apiErr = new APIError("401", "用户未认证");
                        if (doAuthorizationFail(apiErr)) {
                            return;
                        }
                        reject(apiErr);
                    } else if (response.status === 403) {
                        const apiErr = new APIError("403", "用户未授权");
                        if (doAuthenticationFail(apiErr)) {
                            return;
                        }
                        reject(apiErr);
                    } else {
                        const data = response.data || err.data;
                        let apiErr;
                        if (data) {
                            const body = convertResponse(data);
                            apiErr = new APIError(body.code, body.message || response.statusText);
                        } else {
                            apiErr = new APIError(response.status, response.statusText);
                        }
                        if (doApiFail(apiErr)) {
                            return;
                        }
                        reject(apiErr);
                    }
                } else {
                    //somthing went wrong
                    const aipErr = new APIError('-1', '网络请求异常');
                    if (doApiFail(aipErr)) {
                        return;
                    }
                    reject(aipErr);
                }
            })
    });
}

const post = async (url: string, params?: RequestParams, headers?: RequsetHeader) => {
    return invoke('POST', url, params, headers);
};

const get = async (url: string, params?: RequestParams, headers?: RequsetHeader) => {
    return invoke('GET', url, params, headers);
};

export {
    get,
    post,
    invoke
}