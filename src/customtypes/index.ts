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

/**
 * 班级学员
 */
export type BanJiXueYuan = {
    xueYuanId: string | number
}

// 班级列表展示
export type BanJiView = {
    //名称
    mingCheng: string
    // 课程名称
    keChengMingCheng?: string
    // 课程Id
    keChengId?: number
    // 班级老师id
    banJiLaoShiId: number
    // 班级老师
    banJiLaoShiXingMing: string
    //班级学员组
    banJiXueYuanZu: BanJiXueYuan[]
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
    // 上课教室Id
    shangKeJiaoShiId?: number
    // 上课教室
    shangKeJiaoShi?: string
    // 备注
    beiZhu?: string

    key: React.Key
} & IdValue

export enum ZhangHaoLeiXing {
    YUAN_GONG = "YUAN_GONG",
    XUE_YUAN = "XUE_YUAN"
}

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

// 排课上课时间
export type PaiKeShangKeShiJian = {
    // 哪天(周几)上课，排课方式为【日历排课】时，或者排课方式为【规则排课】且【重复方式】为【每天重复】时，值为daily
    paiKeShangKeTian: PaiKeShangKeTian
    // 上课开始时间
    startTime?: number
    // 上课结束时间
    stopTime?: number
}

// 排课哪天上课
export enum PaiKeShangKeTian {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
    SIX = "SIX",
    SEVEN = "SEVEN",
    DAILY = "DAILY"
}

// 排课规则
export type PaiKeGuiZe = {
    // 排课方式
    paiKeFangShi: PaiKeFangShiFenLei

    // 规则排课【开始日期】
    guiZeKaiShiRiQi?: number

    // 规则排课【结束日期】
    guiZeJieShuRiQi?: number

    // 规则排课【重复方式】
    guiZeChongFuFangShi?: PaiKeChongFuFangShiFenLei

    // 规则排课【结束方式】
    guiZeJiShuFangShi?: PaiKeJieShuFangShiFenLei

    // 规则排课【排课次数】
    guiZePaiKeCiShu?: number

    // 日历排课【上课日期】组
    riLiShangKeRiQi?: number[];

    // 排课上课时间组;【日历排课】，或者【规则排课】且【每天重复】时，只有一组数据
    paiKeShangKeShiJianZu?: PaiKeShangKeShiJian[]
}

// 排课信息
export type PaiKeXinXi = {
    // 班级Id
    banJiId: number
    // 排课规则
    paiKeGuiZe: PaiKeGuiZe
    // 上课老师
    shangKeLaoShiId?: number
    // 上课老师姓名
    shangKeLaoShiXingMing?: string
    // 上课教室
    shangKeJiaoShiId?: number
    // 上课教室名称
    shangKeJiaoShiMingCheng?: string
    // 上课内容
    shangKeNeiRong?: string

    // 前端列表展示
    key?: React.Key
} & IdValue

// 学员状态
export enum XueYuanZhuangTai {
    QIAN_ZAI = "QIAN_ZAI",
    ZAI_DU = "ZAI_DU",
    LI_SHI = "LI_SHI"
}

// 学员信息
export type XueYuanXinXi = {
    // 所属账号
    zhangHaoId: number
    // 所属账号手机
    zhangHaoShouJi: string
    // 姓名
    xingMing: string
    // 学员状态
    xueYuanZhuangTai: XueYuanZhuangTai
    // 头像
    touXiang: string
    // 性别
    xingBie: XingBie
    // 年龄
    nanLing: number
    // 就读学校
    jiuDuXueXiao: string
    // 当前年级
    danqQianNianJi: string
    // 家庭住址
    jiaTingZhuZhi: string
    // 学员来源
    xueYuanLaiYuan: string
    // 备注信息
    beiZhuXinXi: string
    // 跟进人
    genJinRenId: number
    // 跟进人姓名
    genJinRenXingMing: string
} & IdValue

/**
 * 可搜索的Select组件的Option定义
 */
export type SearchableSelectOptionDataType = {
    value: string
    label: string
    showValue: string
}