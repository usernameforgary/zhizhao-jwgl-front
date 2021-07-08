import { DataNode } from "antd/lib/tree";
import React from "react";

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
    xiTongCaiDanZu?: XiTongCaiDan[]
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

// export type NonPageableListResponse = {
//     data: any[];
// };

export type NonPageableListResponse = [{ [key: string]: any }];

export type PageableListResponse = {
    data: any[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
};

export type NoPageSearchResult<T extends IdValue> = {
    list: T[];
}

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
    beiZhu?: string
    //角色
    jueSeZu: string[] | []
    //在职状态
    zaiZhiZhuangTai: boolean
} & IdValue & ReactUninqueKey

//系统菜单
export type XiTongCaiDan = {
    // 直接父级菜单Id
    fuId?: string
    // 当前菜单所有父级菜单, [fuId1][fuId2]
    fuIds?: string
    // 菜单名称
    mingCheng: string
    // 菜单路由
    url: string
    // 菜单排序
    paiXu: number
    // 隐藏
    yinCang: boolean
    // 菜单图标
    tuBiao?: string
    // 是不是叶子节点
    isYeZi: boolean
} & IdValue

// antd里面的Menue
export interface Menu extends IRouter {

}

// 角色
export type JueSe = {
    mingCheng: string,
    jianJie?: string,
    xiTongCaiDanZu: number[] | [],
    xiTongApiZu?: number[] | []
} & IdValue


// 扩展antd的Tree的DataNode，可排序
export interface OrderableDataNode extends DataNode {
    paiXu: number | 0,
    // 增加此字段，为了主页左侧菜单可复用此OrderableDataNode
    url?: string,
    children?: OrderableDataNode[]
}

// 通用类型
export type CommonData = {
    mingCheng: string
} & IdValue

// 标签
export type BiaoQian = {
} & CommonData

//擅长科目
export type ShanChangKeMu = {
} & CommonData

// 性别
export enum XingBie {
    NAN = "NAN", NV = "NV"
}

// 课程
export type KeCheng = {
    //名称
    mingCheng: string
    //单价
    danJia: number
    //定价标准
    dingJiaBiaoZhunZu?: [{ [key: string]: string | number }]
    //请假扣课时
    qingJiaKouKeShi: boolean
    //未到扣课时
    weiDaoKouKeShi: boolean
    //备注
    beiZhu?: string,
    // 在读学员数
    zaiDuXueYuanShu?: number
    // 启用状态
    qiYongZhuangTai?: boolean
} & IdValue & ReactUninqueKey

// 课程定价标准
export type DingJiaBiaoZhun = {
    key: number
    mingCheng: string
    keShi: number
    zongJia: number
    keChengDanJia: number
}

// 上课教室
export type ShangKeJiaoShi = {
} & CommonType

// 班级分类
export type BanJiFenLei = {
} & CommonType

// 通用信息，如上课教室，班级分类等
export type CommonType = {
    mingCheng: string
    isDeleted?: boolean
} & IdValue & ReactUninqueKey

// 老师
export type LaoShi = {
    xingMing: string,
    zhangHaoId: number
} & IdValue & ReactUninqueKey

// 班级状态
export enum BanJiZhuangTai {
    KAI_KE = "KAI_KE", JIE_KE = "JIE_KE"
}

// 班级
export type BanJi = {
    mingChen: string
    //所属课程
    keChengId: number
    //班级状态
    banJiZhuangTai: BanJiZhuangTai
    //班级老师
    banJiLaoShiId: number
    //容量
    rongLiang: number
    //班级学员
    //班级分类
    banJiFenLeiId: number
    //上课教室
    shangKeJiaoShiId: number
    //授课课时
    shouKeKeShi: number
    //备注
    beiZhu?: string
} & IdValue

// 班级列表展示
export type BanJiView = {
    //名称
    mingCheng: string
    // 课程名称
    keChengMingCheng?: string
    // 课程Id
    keChengId?: number
    // 班级老师
    banJiLaoShiXingMing: string
    // 班级人数
    renShu: number | 0
    // 容量
    rongLiang: number | 0
    // 已排课次
    paiKeCiShu?: number | 0
    // 已上课次
    yiShangKeCiShu?: number | 0
    // 已授课时
    yiShouKeShi?: number | 0
    // 班级分类
    banJiFenLeiMingCheng: string
    // 默认授课课时
    moRenShouKeKeShi?: number
    // 上课教室
    shangKeJiaoShi?: string
    // 备注
    beiZhu?: string

    key: React.Key
} & IdValue

// 排课方式
export enum PaiKeFangShiFenLei {
    GUI_ZE_PAI_KE = "GUI_ZE_PAI_KE",
    RI_LI_PAI_KE = "RI_LI_PAI_KE"
}

// 排课重复方式
export enum PaiKeChongFuFangShiFenLei {
    MEI_TIAN = "MEI_TIAN",
    MEI_ZHOU = "MEI_ZHOU"
}

// 排课结束方式
export enum PaiKeJieShuFangShiFenLei {
    RI_QI_JIE_SHU = "RI_QI_JIE_SHU",
    CI_SHU_JIE_SHU = "CI_SHU_JIE_SHU"
}