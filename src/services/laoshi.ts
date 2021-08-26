import { PageableListResponse, SearchResult } from "../customtypes";
import { get } from "../api/customApi";
import { LaoShi, NonPageableListResponse, NoPageSearchResult, SourceData } from "../customtypes";
import { convertSearchResult, convertSearchResultNonPageable } from "../utils/converter";

const convertLaoShi = (obj: SourceData): LaoShi => {
    const item: LaoShi = {
        id: obj.id,
        xingMing: obj.xingMing,
        // 所属账号Id
        zhangHaoId: obj.zhangHaoId,
        // 性别
        xingBie: obj.xingBie,
        // 擅长科目组
        shanChangKeMuZu: obj.shanChangKeMuZu,
        // 手机
        shouJi: obj.shouJi,
        // 上月点名率
        shangYueDianMingLv: obj.shangYueDianMingLv,
        // 上月课时
        shangYueKeShi: obj.shangYueKeShi,
        // 本月课时
        benYueKeShi: obj.benYueKeShi,
        // 已上课时
        yiShangKeShi: obj.yiShangKeShi,
        // 在职状态
        zaiZhiZhuangTai: obj.zaiZhiZhuangTai,

        key: obj.id
    }

    return item;
}

// 获取所有老师
export const huoQuLaoShiAll = async (): Promise<NoPageSearchResult<LaoShi>> => {
    const res: NonPageableListResponse = await get('/laoshi/huoQuLaoShiAll');
    return convertSearchResultNonPageable<LaoShi>(res, (obj: SourceData) => {
        return convertLaoShi(obj);
    });
}

/**
 * 分页获取老师列表
 * @param pageNum 
 * @param pageSize 
 * @param keyword 关键字
 * @param zaiZhiZhuangTai 在职状态
 */
export const huoQuLaoShiLieBiao = async (
    pageNum: number,
    pageSize: number,
    keyword: string,
    zaiZhiZhuangTai?: number
): Promise<SearchResult<LaoShi>> => {
    const params = {
        pageNum,
        pageSize,
        keyword: keyword || "",
        zaiZhiZhuangTai: zaiZhiZhuangTai === undefined ? "" : zaiZhiZhuangTai
    }
    const res: PageableListResponse = await get('/laoshi/huoQuLaoShiLieBiao', { ...params });
    return convertSearchResult<LaoShi>(res, (obj: SourceData) => {
        return convertLaoShi(obj);
    });
}