export declare type GlobalConfig = {
    moment: any;
    getToken: () => string;
    setting: Setting;
    errorHandlers?: ErrorHandlers;
    service: ServiceOverries;
};

export declare type ServiceOverries = {
    invoke?: (method: RequestMethod, url: string, params?: RequestParams, hearders?: RequsetHeader) => Promise<SourceData>;
    convertResponse?: (res: SourceData) => APIResponseBody;
    buildTokenHeader?: (token: string, otherHeaders?: RequsetHeader) => RequsetHeader;
    checkNoPermission?: (body: APIResponseBody) => boolean;
    checkSuccess?: (body: APIResponseBody) => boolean;
}

export declare type RequsetHeader = {
    [key: string]: any;
};

export declare type RequestParams = {
    [key: string]: any;
};

export declare type RequestMethod = 'GET' | 'POST';

export declare type Setting = {
    cdn: string;
    apiGateway: string;
    publicOSS?: string;
    privateOSS?: string;
};

export declare type ErrorHandlers = {
    authFail: (err: Error | string) => void | boolean;
    apiFail: (err: APIError) => void | boolean;
}

export declare type SourceData = {
    [name: string]: any;
} & any;

export declare type APIResponseBody = {
    code: string;
    message?: string;
    data?: any;
};

export declare class APIError extends Error {
    code: string;
    constructor(code: string, msg: string);
}

export type IdValue = {
    id: string | undefined
}

export type Account = {
    isLogined: boolean;
    name?: string;
    head?: string;
    auth?: string;
} & IdValue;


export type User = {
    role: string | undefined;
} & Account;

export interface IStore {
    readonly user: User;
    updateUser(user: User): void;
    dispose(): void
}

export interface IMainStore extends IStore {
    readonly hiddenRegister: boolean;
    readonly hiddenLogin: boolean;
    readonly hiddenResetPassword: boolean;
    login(token: string): void;
    logout(): void;
    loadProfile(): Promise<void>;
    toggleRegister(flag: boolean): void;
    toggleLogin(flag: boolean): void;
    toggleResetPassword(flag: boolean): void;
};


export type XueYuan = {
    xingMing: string
    touXiang: string
} & IdValue
