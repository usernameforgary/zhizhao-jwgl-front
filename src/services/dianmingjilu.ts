import { get } from "../api/customApi";
import { DianMingJiLu, PageableListResponse, SearchResult, SourceData } from "../customtypes";
import { convertSearchResult } from "../utils/converter";


const convertDianMingJiLu = (obj: SourceData): DianMingJiLu => {
    const item: DianMingJiLu = {
        id: obj.id,
        // 排课记录Id
        paiKeJiLuId: obj.paiKeJiLuId,
        // 学员Id
        xueYuanId: obj.xueYuanId,
        // 上课学员类型
        shangKeXueYuanLeiXing: obj.shangKeXueYuanLeiXing,
        // 学员到课状态
        xueYuanDaoKeZhuangTai: obj.xueYuanDaoKeZhuangTai,
        // 扣除课时
        kouChuKeShi: obj.kouChuKeShi,
        // 课消金额 (赠送课时，课消金额为0)
        keXiaoJinE: obj.keXiaoJinE,
        // 备注
        beiZhu: obj.beiZhu,

        // 点名时间
        dianMingShiJian: obj.dianMingShiJian,
        // 班级名称
        banJiMingCheng: obj.banJiMingCheng,
        // 班级Id
        banJiId: obj.banJiId,
        // 上课日期
        shangKeRiQi: obj.shangKeRiQi,
        // 上课开始时间
        shangKeShiJianStart: obj.shangKeShiJianStart,
        // 上课结束时间
        shangKeShiJianEnd: obj.shangKeShiJianEnd,
        // 上课老师Id
        shangKeLaoShiId: obj.shangKeLaoShiId,
        // 上课老师姓名
        shangKeLaoShiXingMing: obj.shangKeLaoShiXingMing,
        // 学员姓名
        xueXueYuanXingMing: obj.xueXueYuanXingMing,
        // 联系电话
        shouJi: obj.shouJi,
        // 课程名称
        keChengMingCheng: obj.keChengMingCheng,
        // 点评内容
        dianPingNeiRong: obj.dianPingNeiRong,

        key: obj.id
    }


    return item;
}

/**
    * 获取点名记录列表
    * @param pageNum
    * @param pageSize
    * @param xueYuanId 学员Id
    * @param shangKeRiQiBegin 上课日期 开始
    * @param shangKeRiQiEnd 上课日期 结束
    * @param banJiId 班级Id
    * @param shangKeLaoShiId 上课老师Id
    * @param paiKeJiLuZhuangTai 排课记录状态（待点名 | 已点名）
    * @return
    */
export const huoQuDianMingJiLuLieBiao = async (
    pageNum: number,
    pageSize: number,
    xueYuanId: string | undefined | "",
    shangKeRiQiBegin: number | undefined | "",
    shangKeRiQiEnd: number | undefined | "",
    banJiId: string | undefined,
    shangKeLaoShiId: string | undefined
): Promise<SearchResult<DianMingJiLu>> => {
    if (!xueYuanId) { xueYuanId = "" };
    if (!shangKeLaoShiId) { shangKeLaoShiId = "" };
    if (!shangKeRiQiBegin) { shangKeRiQiBegin = "" };
    if (!shangKeRiQiEnd) { shangKeRiQiEnd = "" };
    if (!banJiId) { banJiId = "" };
    const res: PageableListResponse = await get('/dianmingjilu/huoQuDianMingJiLuLieBiao', { pageNum, pageSize, xueYuanId, shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId });
    return convertSearchResult<DianMingJiLu>(res, (obj: SourceData) => {
        return convertDianMingJiLu(obj);
    });
}
