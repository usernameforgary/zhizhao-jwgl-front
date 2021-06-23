import { APIResponseBody, GlobalConfig, SourceData } from "../customtypes";

const convertResponse = (res: SourceData): APIResponseBody => {
    const body: APIResponseBody = {
        code: res['code'],
        data: res['payload'],
        message: res['msg'],
    };
    return body;
};

const checkNoPermission = (body: APIResponseBody): boolean => {
    if (Number(body.code) === 403) {
        return true;
    }
    return false;
}

const checkSuccess = (body: APIResponseBody): boolean => {
    if (Number(body.code) === 1) {
        return true;
    }
    return false;
}

export default (globalConfig: GlobalConfig): GlobalConfig => {
    globalConfig.service = {
        convertResponse,
        checkNoPermission,
        checkSuccess,
    };
    return globalConfig;
}