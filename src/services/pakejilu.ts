import { get, post } from "../api/customApi";
import { SearchResult, PageableListResponse, SourceData, PaiKeJiLu, PaiKeJiLuZhuangTai, NonPageableListResponse, NoPageSearchResult } from "../customtypes";
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
        // 班级所属课程Id
        keChengId: obj.keChengId,
        // 班级id
        banJiId: obj.banJiId,
        // 班级名称
        banJiMingCheng: obj.banJiMingCheng,
        // 课程名称
        keChengMingCheng: obj.keChengMingCheng,
        // 成长记录组
        chengZhangJiLuZu: obj.chengZhangJiLuZu,

        key: obj.id
    }
    // 点名情况列表显示学员时，react需要key
    item.shangKeXueYuanZu.forEach(v => {
        v.key = v.xueYuanId
    })
    // 成长记录组，react循环显示需要key 
    if (item.chengZhangJiLuZu) {
        item.chengZhangJiLuZu.forEach(v => {
            v.key = v.id
        })
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
export const huoQuPaiKeJiLuLieBiao = async (
    pageNum: number,
    pageSize: number,
    shangKeRiQiBegin: number | undefined | "",
    shangKeRiQiEnd: number | undefined | "",
    banJiId: string | undefined,
    shangKeLaoShiId: string | undefined,
    paiKeJiLuZhuangTaiZu: PaiKeJiLuZhuangTai[] | []
): Promise<SearchResult<PaiKeJiLu>> => {
    if (!shangKeLaoShiId) { shangKeLaoShiId = "" };
    if (!shangKeRiQiBegin) { shangKeRiQiBegin = "" };
    if (!shangKeRiQiEnd) { shangKeRiQiEnd = "" };
    if (!banJiId) { banJiId = "" };
    const res: PageableListResponse = await get('/paikejilu/huoQuPaiKeJiLu', { pageNum, pageSize, shangKeRiQiBegin, shangKeRiQiEnd, banJiId, shangKeLaoShiId, paiKeJiLuZhuangTaiZu });
    return convertSearchResult<PaiKeJiLu>(res, (obj: SourceData) => {
        return convertPaiKeJiLu(obj);
    });
}

/**
 * 根据排课记录Id，查询排课记录，课后点评
 * @param id 排课记录Id
 * @returns 
 */
export const huoQuPaiKeJiLuKeHouDianPingById = async (id: string): Promise<PaiKeJiLu> => {
    const res = await get('/paikejilu/huoQuPaiKeJiLuKeHouDianPingById', { id });
    return convertPaiKeJiLu(res);
}