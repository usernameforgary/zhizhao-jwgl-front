import { post, get } from "../api/customApi";
import { JiaoFeiLiShi, XueYuanKeCheng, XueYuanXinXi } from "../customtypes";

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
export const xueYuanXuanZeBanJi = async (xueYuanId: string, xueYuanKeChengId: string, banJiId: string, previousBanJiId: string): Promise<void> => {
    await get("/combine/xueYuanXuanBan", { xueYuanId, xueYuanKeChengId, banJiId, previousBanJiId });
}