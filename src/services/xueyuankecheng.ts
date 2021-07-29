import { get } from "../api/customApi"
import { BanJiXueYuan, NonPageableListResponse, NoPageSearchResult, SourceData, XueYuanKeCheng } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

export const ConvertXueYuanKeCheng = (obj: SourceData): XueYuanKeCheng => {
    const item: XueYuanKeCheng = {
        id: obj.id,
        // 所属学员ID
        xueYuanId: obj.xueYuanId,
        // 学员姓名
        xueYuanXingMing: obj.xueYuanXingMing,
        //课程ID
        keChengId: obj.keChengId,
        // 课程名称
        keChengMingCheng: obj.keChengMingCheng,
        //课程信息
        keCheng: obj.keCheng,
        // 班级名称 (简单查询，如mybatis直接join返回【班级姓名】）
        banJiMingCheng: obj.banJiMingCheng,
        // 班级老师 (简单查询，如mybatis直接join返回【班级老师】）
        banJiLaoShiXingMing: obj.banJiLaoShiXingMing,
        // 班级信息 (复杂查询时，或前端form表单提交，用到)
        banJi: obj.banJi,
        //定价标准
        dingJiaBiaoZhun: obj.dingJiaBiaoZhun,
        //课程状态
        keChengZhuangTai: obj.keChengZhuangTai,
        //课程类型
        keChengLeiXing: obj.keChengLeiXing,
        //单价
        danJia: obj.danJia,
        //课程数量
        keChengShuLiang: obj.keChengShuLiang,
        //赠送课时
        zengSongKeShi: obj.zengSongKeShi,
        //优惠类型
        youHuiLeiXing: obj.youHuiLeiXing,
        //优惠数量
        youHuiShuLiang: obj.youHuiShuLiang,
        // 备注
        beiZhu: obj.beiZhu,
        // 剩余课时
        shengYuKeShi: obj.shengYuKeShi,
        // 学员课程有效期限
        keChengYouXiaoQi: obj.keChengYouXiaoQi,

        key: obj.id
    }
    return item;
}
/**
 * 根据学员Id获取学员课程
 * @param xueYuanId 学员Id
 * @param isLiShi 是否是历史课程（课程状态为已结课)
 */
export const huoQuXueYuanKeChengByXueYuanId = async (xueYuanId: string, isLiShi: boolean | undefined): Promise<NoPageSearchResult<XueYuanKeCheng>> => {
    const res: NonPageableListResponse = await get("/xueyuankecheng/getXueYuanKeChengByXueYuanId", { xueYuanId, isLiShi });
    return convertSearchResultNonPageable<XueYuanKeCheng>(res, (obj: SourceData) => {
        return ConvertXueYuanKeCheng(obj);
    });
}
