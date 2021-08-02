import { get } from "../api/customApi";
import { SearchResult, PageableListResponse, SourceData, PaiKeJiLu, PaiKeJiLuZhuangTai } from "../customtypes";
import { convertSearchResult } from "../utils/converter";

const convertPaiKeJiLu = (obj: SourceData): PaiKeJiLu => {
    const item: PaiKeJiLu = {
        id: obj.id,
        // 班级排课信息Id
        banJiPaiKeXinXiId: obj.banJiPaiKeXinXiId,
        // 排课规则
        paiKeGuiZe: obj.paiKeGuiZe,
        // 上课日期
        shangKeRiQi: obj.shangKeRiQi,
        // 上课老师
        shangKeLaoShiId: obj.shangKeLaoShiId,
        // 上课老师姓名
        shangKeLaoShiXingMing: obj.shangKeLaoShiXingMing,
        // 上课教室Id
        shangKeJiaoShiId: obj.shangKeJiaoShiId,
        // 上课教室名称
        shangKeJiaoShiMingCheng: obj.shangKeJiaoShiMingCheng,
        // 上课开始时间
        shangKeShiJianStart: obj.shangKeShiJianStart,
        // 上课结束时间
        shangKeShiJianEnd: obj.shangKeShiJianEnd,
        // 授课课时
        shouKeKeShi: obj.shouKeKeShi,
        // 上课内容
        shangKeNeiRong: obj.shangKeNeiRong,
        // 排课记录状态
        paiKeJiLuZhuangTai: obj.paiKeJiLuZhuangTai,
        // 上课学员
        shangKeXueYuanZu: obj.shangKeXueYuanZu,
        // 点名时间
        dianMingShiJian: obj.dianMingShiJian,

        key: obj.id
    }
    return item;
}

/**
    * 获取排课记录列表
    * @param pageNum
    * @param pageSize
    * @param shangKeRiQiBegin 上课日期 开始
    * @param shangKeRiQiEnd 上课日期 结束
    * @param banJiId 班级Id
    * @param shangKeLaoShiId 上课老师Id
    * @param paiKeJiLuZhuangTai 排课记录状态（待点名 | 已点名）
    * @return
    */
export const huoQuXueYuanLieBiao = async (
    pageNum: number,
    pageSize: number,
    shangKeRiQiBegin: number | undefined,
    shangKeRiQiEnd: number | undefined,
    banJiId: string | undefined,
    shangKeLaoShiId: string | undefined,
    paiKeJiLuZhuangTai: PaiKeJiLuZhuangTai | undefined
): Promise<SearchResult<PaiKeJiLu>> => {
    const res: PageableListResponse = await get('/paikejilu/huoQuPaiKeJiLu', { pageNum, pageSize, shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId, paiKeJiLuZhuangTai });
    return convertSearchResult<PaiKeJiLu>(res, (obj: SourceData) => {
        return convertPaiKeJiLu(obj);
    });
}