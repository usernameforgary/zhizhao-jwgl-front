export type GlobalConfig = {
    moment: any;
    getToken: () => string;
    setting: Setting;
    errorHandlers?: ErrorHandlers;
    service: ServiceOverries;
};
export interface IRouter {
    title: string
    path: string
    key: string
    icon?: string
    component?: string
    children?: IRouter[]
}

export type ServiceOverries = {
    invoke?: (method: RequestMethod, url: string, params?: RequestParams, hearders?: RequsetHeader) => Promise<SourceData>;
    convertResponse?: (res: SourceData) => APIResponseBody;
    buildTokenHeader?: (token: string, otherHeaders?: RequsetHeader) => RequsetHeader;
    checkNoPermission?: (body: APIResponseBody) => boolean;
    checkNoAuthrization?: (body: APIResponseBody) => boolean;
    checkSuccess?: (body: APIResponseBody) => boolean;
}

export type RequsetHeader = {
    [key: string]: any;
};

export type RequestParams = {
    [key: string]: any;
};

export type RequestMethod = 'GET' | 'POST';

export type Setting = {
    cdn: string;
    apiGateway: string;
    publicOSS?: string;
    privateOSS?: string;
};

export type ErrorHandlers = {
    authorizationFail: (err: Error | string) => void | boolean;
    authenticationFail: (err: Error | string) => void | boolean;
    apiFail: (err: APIError) => void | boolean;
}

export type SourceData = {
    [name: string]: any;
} & any;

export type APIResponseBody = {
    code: string;
    message?: string;
    data?: any;
};

export class APIError extends Error {
    public code: string;
    constructor(code: string, msg: string) {
        super(msg);
        this.code = code
    }
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

export type PageableListResponse = {
    data: any[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
};

export type SearchResult<T extends IdValue> = {
    list: T[];
    total: number;
    totalPage?: number;
    page: number;
    pageSize: number;
}

export type ReactUninqueKey = {
    key?: string
}

//员工信息
export type YuanGong = {
    //姓名
    xingMing: string
    //手机
    shouJi: string
    //是否授课
    isLaoShi: boolean
    beiZhu?: string,
    //角色
    jueSeZu: string,
    //在职状态
    zaiZhiZhuangTai: boolean
} & IdValue & ReactUninqueKey
