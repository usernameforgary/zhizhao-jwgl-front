import { post, get } from "../api/customApi";
import { JiaoFeiLiShi, PaiKeJiLu, XueYuanKeCheng, XueYuanXinXi } from "../customtypes";

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