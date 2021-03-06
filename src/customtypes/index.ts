import { DataNode } from "antd/lib/tree";
import { UploadChangeParam } from "antd/lib/upload";
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
    daiXiaZaiWenJianShu: number;
    login(token: string): void;
    logout(): void;
    loadProfile(): Promise<void>;
    toggleRegister(flag: boolean): void;
    toggleLogin(flag: boolean): void;
    toggleResetPassword(flag: boolean): void;
    // 获取待下载文件数
    huoQuDaiXiaZaiWenJianShu(): Promise<void>;
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
    dingJiaBiaoZhunZu?: DingJiaBiaoZhun[]
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
    xingMing: string
    // 所属账号Id
    zhangHaoId: string
    // 性别
    xingBie: XingBie
    // 擅长科目组
    shanChangKeMuZu: ShanChangKeMu[]
    // 手机
    shouJi: string
    // 上月点名率
    shangYueDianMingLv: number
    // 上月课时
    shangYueKeShi: number
    // 本月课时
    benYueKeShi: number
    // 已上课时
    yiShangKeShi: number
    // 在职状态
    zaiZhiZhuangTai: boolean
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

/**
 * 班级，班级学员列表展示
 */
export type BanJiXueYuanView = {
    // 学员id
    xueYuanId: string
    // 班级Id
    banJiId: string
    // 学员名称
    xueYuanXingMing: string
    // 学员性别
    xingBie: XingBie
    //手机号
    shouJi: string
    xueYuanKeCheng: XueYuanKeCheng
} & ReactUninqueKey

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
    // 请假扣课时
    qingJiaKouKeShi?: boolean
    // 未到扣课时
    weiDaoKouKeShi?: boolean

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

/** 跟进学员状态
 * 待跟进：没有添加任何跟进记录的潜在学员的跟进状态为“待跟进”
 * 跟进中：添加过任意跟进记录，但没有约试听课的潜在学员的跟进状态为“跟进中”
 * 已约课：添加过任意跟进记录，且预约过试听课的潜在学员的跟进状态为“已约课”
 * 已体验：添加过任意跟进记录，且预约过试听课，老师对其的点名状态为“已到”或“迟到”时，该潜在学员的跟进状态为“已体验”
 * 已失效：该状态由销售手动标记。
 * 以上潜在学员的状态均可手动更改，更改后继续按照该逻辑显示跟进状态。
 * 举例：潜在学员A当前的跟进状态为“已体验”，然后课程顾问张三把潜在学员A的跟进状态改为“跟进中”，那么这时候潜在学员的跟进状态显示为“跟进中”，后续有如有安排试听，则该学员的跟进状态会自动改为“已约课”。
 * 更改跟进状态后，所有的跟进记录不发生任何变化。
 */
export enum GenJinZhuangTai {
    DAI_GEN_JIN = 'DAI_GEN_JIN',
    GEN_JIN_ZHONG = 'GEN_JIN_ZHONG',
    YI_YUE_KE = 'YI_YUE_KE',
    YI_TI_YAN = 'YI_TI_YAN',
    YI_SHI_XIAO = 'YI_SHI_XIAO',
}


// 学员跟进级别。低 | 中 | 高
export enum YiXiangJiBie {
    DI,
    ZHONG,
    GAO
}

// 学员信息
export type XueYuanXinXi = {
    // 所属账号
    zhangHaoId?: string
    // 所属账号手机
    zhangHaoShouJi?: string
    // 姓名
    xingMing?: string
    // 学员状态
    xueYuanZhuangTai?: XueYuanZhuangTai
    // 头像
    touXiang?: string
    // 性别
    xingBie?: XingBie
    // 年龄
    nanLing?: number
    // 就读学校
    jiuDuXueXiao?: string
    // 当前年级
    danqQianNianJi?: string
    // 家庭住址
    jiaTingZhuZhi?: string
    // 学员来源
    xueYuanLaiYuan?: string
    // 备注信息
    beiZhuXinXi?: string
    // 跟进人
    genJinRenId?: string
    // 跟进人姓名
    genJinRenXingMing?: string
    // 购买课时
    gouMaiKeShi?: number
    // 赠送课时
    zengSongKeShi?: number
    // 剩余课时
    shengYuKeShi?: number
    // 消课金额
    xiaoKeJinE?: number
    // 学员标签组
    xueYuanBiaoQianZu?: CommonType[]

} & IdValue & ReactUninqueKey

/**
 * 可搜索的Select组件的Option定义
 */
export type SearchableSelectOptionDataType = {
    value: string
    label: string
    showValue: string
}


/**
 *  学员课程状态
    待确认:
        学员有缴费记录,但会计还未确认缴费,该状态下学员不可加入班级
    待补缴:
        学员已完成报名,但会计只收到缴费金额的一部分,此时状态为“部分缴费”,状态,该状态下学员可以加入班级上课。不论学员报名了多少课程,在“部分缴费”状态下,所有报名的课程均可加入班级。
    待排课:
        会计已确认缴费,但学员没有加入任何班级
    待上课:
        学员加入班级,且有剩余课时的情况下,为待上课状态,该状态下老师可进行点名操作
    待结课:
        学员加入班级,且剩余课时为0,该状态下显示结课按钮
    已结课:
        学员某一课程剩余课时为0,且已点击结课按钮,则该课程的状态为已结课。
 */
export enum XueYuanKeChengZhuangTai {
    DAI_QUE_REN = 'DAI_QUE_REN',
    DAI_BU_JIAO = 'DAI_BU_JIAO',
    DAI_PAI_KE = 'DAI_PAI_KE',
    DAI_SHANG_KE = 'DAI_SHANG_KE',
    DAI_JIE_KE = 'DAI_JIE_KE',
    YI_JIE_KE = 'YI_JIE_KE'
}

// 课程类型
export enum KeChengLeiXing {
    XIN_BAO = 'XIN_BAO',
    KUO_KE = 'KUO_KE',
    XU_BAO = 'XU_BAO'
}


// 优惠类型
export enum YouHuiLeiXing {
    ZHI_JIAN = 'ZHI_JIAN',
    ZHE_KOU = 'ZHE_KOU'
}

// 学员课程
export type XueYuanKeCheng = {
    // 所属学员ID
    xueYuanId: string
    // 学员姓名
    xueYuanXingMing?: string
    //课程ID
    keChengId: string
    // 课程名称
    keChengMingCheng?: string
    //课程信息
    keCheng: KeCheng
    // 班级名称 (简单查询，如mybatis直接join返回【班级姓名】）
    banJiMingCheng?: string
    // 班级老师 (简单查询，如mybatis直接join返回【班级老师】）
    banJiLaoShiXingMing?: string
    // 班级信息 (复杂查询时，或前端form表单提交，用到)
    banJi?: BanJiView;
    //定价标准
    dingJiaBiaoZhun?: DingJiaBiaoZhun
    //课程状态
    keChengZhuangTai: XueYuanKeChengZhuangTai
    //课程类型
    keChengLeiXing: KeChengLeiXing
    //单价
    danJia: number
    //课程数量
    keChengShuLiang: number
    //赠送课时
    zengSongKeShi: number
    //优惠类型
    youHuiLeiXing: YouHuiLeiXing
    //优惠数量
    youHuiShuLiang: number
    // 备注
    beiZhu: string
    // 剩余课时
    shengYuKeShi?: number
    // 学员课程有效期限
    keChengYouXiaoQi?: number

    key: React.Key
} & IdValue

// 缴费记录收款方式
export enum ShouKuanFangShi {
    ZHI_FU_BAO = "ZHI_FU_BAO",
    WEI_XIN = "WEI_XIN",
    XIAN_JIN = "XIAN_JIN"
}

/**
 * 缴费中的流水类型，新缴，补缴
 */
export enum LiuShuiLieXing {
    XIN_JIAO = "XIN_JIAO",
    BU_JIAO = "BU_JIAO"
}

/**
 * 缴费记录状态
 * 未交费：学员已完成报名，但会计未确认收费，此时状态为“未交费”状态，该状态下学员不能加入班级上课。
 * 部分缴费：学员已完成报名，但会计只收到缴费金额的一部分，此时状态为“部分缴费”，状态，该状态下学员可以加入班级上课。不论学员报名了多少课程，在“部分缴费”状态下，所有报名的课程均可加入班级。
 * 全部已缴：学员已完成报名，会计确认收到全部缴费金额，此时学员可加入对应报名的课程班级上课。
 */
export enum JiaoFeiJiLuZhuangTai {
    WEI_JIAO_FEI = "WEI_JIAO_FEI",
    BU_FEN_JIAO_FEI = "BU_FEN_JIAO_FEI",
    QUAN_BU_YI_JIAO = "QUAN_BU_YI_JIAO"
}

// 缴费历史（因为同一个缴费记录可能多次缴费）
export type JiaoFeiLiShi = {
    // 缴费金额
    jiaoFeiJinE: number
    // 收款方式
    shouKuanFangShi: ShouKuanFangShi
    // 缴费日期
    jiaoFeiRiQi?: number
    // 备注
    beiZhu?: string
    // 流水类型
    liuShuiLieXing?: LiuShuiLieXing
}

// 缴费记录列表显示
export type JiaoFeiJiLuTableViewData = {
    // 学员id
    xueYuanId: string
    // 学员姓名
    xueYuanXingMing: string
    // 学员课程组
    xueYuanKeChengZu: XueYuanKeCheng[]
    // 缴费历史组
    jiaoFeiLiShiZu: JiaoFeiLiShi[]
    // 跟进人id
    genJinRenId: string
    // 跟进人姓名
    genJinRenXingMing: string
    // 缴费记录状态
    jiaoFeiJiLuZhuangTai: JiaoFeiJiLuZhuangTai
} & IdValue & ReactUninqueKey

/**
 * 排课记录状态，待点名 | 已点名 | 已点评
 */
export enum PaiKeJiLuZhuangTai {
    DAI_DIAN_MING = "DAI_DIAN_MING",
    YI_DIAN_MING = "YI_DIAN_MING",
    YI_DIAN_PING = "YI_DIAN_PING"
}

// 排课记录里，上课学员的类型
export enum ShangKeXueYuanLeiXing {
    BEN_BAN = "BEN_BAN",
    SHI_TING = "SHI_TING",
    BU_KE = "BU_KE",
    LIN_SHI = "LIN_SHI",
}

// 学员到课状态
export enum XueYuanDaoKeZhuangTai {
    DAO_KE = "DAO_KE",
    CHI_DAO = "CHI_DAO",
    QING_JIA = "QING_JIA",
    WEI_DAO = "WEI_DAO",
}


// 排课记录，上课学员
export type ShanKeXueYuan = {
    // 排课记录Id
    paiKeJiLuId: string
    // 学员id
    xueYuanId: string
    // 学员姓名
    xueYuanXingMing: string
    // 删除
    isDeleted: boolean
    // 上课学员类型
    shangKeXueYuanLeiXing: ShangKeXueYuanLeiXing
    // 学员到课状态
    xueYuanDaoKeZhuangTai: XueYuanDaoKeZhuangTai
    // 补课学员的补课记录Id，上课学员类型为补课学员时需要提供补课记录Id
    buKeJiLuId?: string
    // 试听学员的试听记录Id, 上课学员类型为试听学员时需要提供试听记录Id
    shiTingJiLuId?: string
    // 扣除课时
    kouChuKeShi: number
    // 课消金额
    keXiaoJinE: number
    // 备注
    beiZhu: string
    // 剩余课时
    shengYuKeShi: number
    // 手机号
    shouJi: string
} & ReactUninqueKey

// 排课记录
export type PaiKeJiLu = {
    // 班级排课信息Id
    banJiPaiKeXinXiId?: string
    // 排课规则
    paiKeGuiZe: PaiKeGuiZe
    // 上课日期
    shangKeRiQi: number
    // 上课老师
    shangKeLaoShiId: string
    // 上课老师姓名
    shangKeLaoShiXingMing: string
    // 上课教室Id
    shangKeJiaoShiId: string
    // 上课教室名称
    shangKeJiaoShiMingCheng: string
    // 上课开始时间
    shangKeShiJianStart: number
    // 上课结束时间
    shangKeShiJianEnd: number
    // 授课课时
    shouKeKeShi: number
    // 上课内容
    shangKeNeiRong: string
    // 排课记录状态
    paiKeJiLuZhuangTai: PaiKeJiLuZhuangTai
    // 上课学员
    shangKeXueYuanZu: ShanKeXueYuan[] | []
    // 点名时间
    dianMingShiJian: number
    // 班级所属课程id
    keChengId: string
    // 课程名称
    keChengMingCheng: string
    // 班级Id
    banJiId: string
    // 班级名称
    banJiMingCheng: string
    // 成长记录组（成长记录类型为课后点评[KE_HOU_DIAN_PING]的记录）
    chengZhangJiLuZu: ChengZhangJiLu[]
} & IdValue & ReactUninqueKey

// 点名记录
export type DianMingJiLu = {
    // 排课记录Id
    paiKeJiLuId: string
    // 排课记录状态
    paiKeJiLuZhuangTai: PaiKeJiLuZhuangTai
    // 学员Id
    xueYuanId: string
    // 上课学员类型
    shangKeXueYuanLeiXing: ShangKeXueYuanLeiXing
    // 学员到课状态
    xueYuanDaoKeZhuangTai: XueYuanDaoKeZhuangTai
    // 扣除课时
    kouChuKeShi: number
    // 课消金额 (赠送课时，课消金额为0)
    keXiaoJinE: number
    // 备注
    beiZhu: string

    // 点名时间
    dianMingShiJian: number
    // 班级名称
    banJiMingCheng: string
    // 班级Id
    banJiId: string
    // 上课日期
    shangKeRiQi: number
    // 上课开始时间
    shangKeShiJianStart: number
    // 上课结束时间
    shangKeShiJianEnd: number
    // 上课老师Id
    shangKeLaoShiId: string
    // 上课老师姓名
    shangKeLaoShiXingMing: string
    // 学员姓名
    xueXueYuanXingMing: string
    // 联系电话
    shouJi: string
    // 课程名称
    keChengMingCheng: string
    // 点评内容
    dianPingNeiRong: string
    // 成长记录Id（即点评记录ID）
    chengZhangJiLuId: string
} & IdValue & ReactUninqueKey


// 上传下载文件信息里 - 文件分类 - (上传 || 下载)
export enum WenJianFenLei {
    DOWNLOAD = "DOWNLOAD",
    UPLOAD = "UPLOAD"
}

// 上传下载文件信息里 - 文件状态 - (未下载 | 已下载)
export enum WenJianZhuangTai {
    WEI_XIA_ZAI = "WEI_XIA_ZAI",
    YI_XIA_ZAI = "YI_XIA_ZAI"
}

// 上传下载文件信息
export type DownloadUploadFile = {
    // 创建时间
    createTime: number
    // 文件名称
    mingCheng: string
    // 后缀
    houZhui: string
    // oss上key(文件名)
    ossKey: string
    // 大小
    daXiao: number
    // 上传下载文件分类
    wenJianFenLei: WenJianFenLei
    // 上传下载文件状态
    wenJianZhuangTai: WenJianZhuangTai
    // 操作者Id
    zhangHaoId: string
    // 账号姓名
    zhangHaoXingMing: string
} & IdValue & ReactUninqueKey

/**
 * 成长记录类型
 * KE_HOU_DIAN_PING： 课后点评
 * HUO_LI_KE_TANG：活力课堂
 * XUE_YUAN_FENG_CAI：学员风采
 * ZUO_PIN_ZHAN_SHI：作品展示
 * SHENG_HUO_JI_LU：生活记录
 */
export enum ChengZhangJiLuLeiXing {
    KE_HOU_DIAN_PING = 'KE_HOU_DIAN_PING',
    HUO_LI_KE_TANG = 'HUO_LI_KE_TANG',
    XUE_YUAN_FENG_CAI = 'XUE_YUAN_FENG_CAI',
    ZUO_PIN_ZHAN_SHI = 'ZUO_PIN_ZHAN_SHI',
    SHENG_HUO_JI_LU = 'SHENG_HUO_JI_LU'
}

// 成长记录
export type ChengZhangJiLu = {
    // 学员Id
    xueYuanId: string
    // 内容
    neiRong: string
    // 成长记录文件组
    chengZhangJiLuWenJianZu: ChengZhangJiLuWenJian[]
    // 排课记录Id
    paiKeJiLuId?: string
    // 成长记录类型，成长记录类型 = [KE_HOU_DIAN_PING： 课后点评]
    chengZhangJiLuLeiXing: ChengZhangJiLuLeiXing
    // 家长已读
    jiaZhangYiDu: boolean
} & IdValue & ReactUninqueKey

// 成长记录文件
export type ChengZhangJiLuWenJian = {
    // 名称
    mingCheng?: string
    // 后缀名
    houZhui: string
    // oss上key
    ossKey: string
    // oss的bucket名称
    ossBucketName: string
    // 大小
    daXiao: number
    // 文件访问url
    url?: string
} & IdValue & ReactUninqueKey

// 阿里云OSS签名信息
export type OssSignature = {
    accessid: string
    dir: string
    expire: string
    host: string
    policy: string
    signature: string
}

// 跟进记录
export type GenJinJiLu = {
    // 学员Id
    xueYuanId: string
    // 内容
    neiRong: string
    // 跟进时间
    genJinShiJian: number
    // 跟进人Id
    genJinRenId: string
    // 已完成
    yiWanCheng: boolean
} & IdValue & ReactUninqueKey

// 潜在学员列表View
export type QianZaiXueYuanView = {
    // 姓名
    xingMing: string
    // 手机
    shouJi: string
    // 跟进状态
    genJinZhangTai: GenJinZhuangTai
    // 意向级别
    yiXiangJiBie: YiXiangJiBie
    // 跟进人Id
    genJinRenId: string
    // 跟进人姓名
    genJinRenXingMing: string

    // 最后一次跟进记录
    latestGenJinJiLu: GenJinJiLu
    // 下次跟进记录
    nextGenJinJiLu: GenJinJiLu

    // 年龄
    nanLing: number
    // 标签组
    xueYuanBiaoQianZu: BiaoQian[]
    // 创建时间
    createTime: number

    // 学员状态
    xueYuanZhuangTai: XueYuanZhuangTai
} & IdValue & ReactUninqueKey


// 在读学员列表View
export type ZaiDuXueYuanView = {
    // 姓名
    xingMing: string
    // 手机
    shouJi: string
    // 当前年级
    danqQianNianJi: string
    // 年龄
    nanLing: number

    // 最后一次跟进记录
    latestGenJinJiLu: GenJinJiLu

    // 跟进人Id
    genJinRenId: string
    // 跟进人姓名
    genJinRenXingMing: string
    // 学员状态
    xueYuanZhuangTai: XueYuanZhuangTai
} & IdValue & ReactUninqueKey


// 历史学员列表View
export type LiShiXueYuanView = {
    // 姓名
    xingMing: string
    // 手机
    shouJi: string
    // 年龄
    nanLing: number

    // 创建时间
    createTime: number
    // 结业时间
    jieYeShiJian: number

    // 最后就读课程
    latestKeCheng: XueYuanKeCheng

    // 跟进人Id
    genJinRenId: string
    // 跟进人姓名
    genJinRenXingMing: string

    // 学员状态
    xueYuanZhuangTai: XueYuanZhuangTai
} & IdValue & ReactUninqueKey