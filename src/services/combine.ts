import { post, get } from "../api/customApi";
import { ChengZhangJiLu, JiaoFeiLiShi, PaiKeJiLu, PaiKeJiLuZhuangTai, XueYuanKeCheng, XueYuanXinXi } from "../customtypes";

// 学员报名
export const xueYuanBaoMing = async (
    xueYuanXinXi: XueYuanXinXi,
    xueYuanKeChengList: XueYuanKeCheng[],
    jiaoFeiLiShi: JiaoFeiLiShi,
    genJinRenId?: string,
    keChengYouXiaoQi?: number | null): Promise<void> => {
    await post('/combine/xueYuanBaoMing', { xueYuanXinXi, xueYuanKeChengList, jiaoFeiLiShi, genJinRenId, keChengYouXiaoQi });
}


/**
 * 学员（学员课程）指定班级
 * @param xueYuanId 学员Id
 * @param xueYuanKeChengId 学员课程id
 * @param banJiId 班级Id
 */
export const xueYuanXuanZeBanJi = async (xueYuanId: string, xueYuanKeChengId: string, banJiId: string): Promise<void> => {
    await get("/combine/xueYuanXuanBan", { xueYuanId, xueYuanKeChengId, banJiId });
}

/**
 * 缴费记录确认
 * @param id 缴费记录id
 * @param jiaoFeiJiLuZhuangTai 缴费记录状态
 */
export const jiaoFeiJiLuQueRen = async (id: string, jiaoFeiJiLuZhuangTai: string): Promise<void> => {
    await get('/combine/jiaoFeiJiLuQueRen', { id, jiaoFeiJiLuZhuangTai });
}

/**
 * 排课记录点名
 * @param paiKeJiLu 排课记录点名信息
 */
export const paiKeJiLuDianMing = async (paiKeJiLu: PaiKeJiLu): Promise<void> => {
    await post('/combine/paiKeJiLuDianMing', { ...paiKeJiLu });
}


/**
    * 导出班级排课记录列表
    * @param shangKeRiQiBegin 上课日期 开始
    * @param shangKeRiQiEnd 上课日期 结束
    * @param banJiId 班级Id
    * @param shangKeLaoShiId 上课老师Id
    * @param paiKeJiLuZhuangTai 排课记录状态（待点名 | 已点名）
    * @return
    */
export const daoChuBanJiPaiKeJiLu = async (
    zhangHaoId: string,
    shangKeRiQiBegin: number | undefined | "",
    shangKeRiQiEnd: number | undefined | "",
    banJiId: string | undefined,
    shangKeLaoShiId: string | undefined,
    paiKeJiLuZhuangTaiZu: PaiKeJiLuZhuangTai[] | []
): Promise<void> => {
    if (!shangKeLaoShiId) { shangKeLaoShiId = "" };
    if (!shangKeRiQiBegin) { shangKeRiQiBegin = "" };
    if (!shangKeRiQiEnd) { shangKeRiQiEnd = "" };
    if (!banJiId) { banJiId = "" };
    await get('/combine/daoChuBanJiPaiKeJiLu', { zhangHaoId, shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId, paiKeJiLuZhuangTaiZu });
}


/**
    * 导出学员点名记录列表
    * @param xueYuanId 学员Id
    * @param shangKeRiQiBegin 上课日期 开始
    * @param shangKeRiQiEnd 上课日期 结束
    * @param banJiId 班级Id
    * @param shangKeLaoShiId 上课老师Id
    * @param paiKeJiLuZhuangTai 排课记录状态（待点名 | 已点名）
    * @return
    */
export const daoChuXueYuanDianMingJiLu = async (
    zhangHaoId: string,
    xueYuanId: string | undefined | "",
    shangKeRiQiBegin: number | undefined | "",
    shangKeRiQiEnd: number | undefined | "",
    banJiId: string | undefined,
    shangKeLaoShiId: string | undefined
): Promise<void> => {
    if (!xueYuanId) { xueYuanId = "" };
    if (!shangKeLaoShiId) { shangKeLaoShiId = "" };
    if (!shangKeRiQiBegin) { shangKeRiQiBegin = "" };
    if (!shangKeRiQiEnd) { shangKeRiQiEnd = "" };
    if (!banJiId) { banJiId = "" };
    await get('/combine/daoChuXueYuanDianMingJiLu', { zhangHaoId, xueYuanId, shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId });
}

/**
 * 保存课后点评记录
 * @param chengZhangJiLu 成长记录，类型为【课后点评】的成长记录
 */
export const baoCunKeHouDianPingXinXi = async (chengZhangJiLuZu: ChengZhangJiLu[]): Promise<void> => {
    await post('/combine/baoCunKeHouDianPingXinXi', { chengZhangJiLuZu });
}