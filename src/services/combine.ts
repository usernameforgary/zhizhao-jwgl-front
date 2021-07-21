import { post } from "../api/customApi";
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