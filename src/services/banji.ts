import { get, post } from "../api/customApi";
import { BanJi, BanJiView, BanJiXueYuanView, NonPageableListResponse, NoPageSearchResult, PageableListResponse, PaiKeXinXi, SearchResult, SourceData } from "../customtypes";
import { convertSearchResult, convertSearchResultNonPageable } from "../utils/converter";

const convertBanJiView = (obj: SourceData): BanJiView => {
    const item: BanJiView = {
        id: obj.id,
        //名称
        mingCheng: obj.mingCheng,
        // 课程名称
        keChengMingCheng: obj.keChengMingCheng,
        // 班级老师Id
        banJiLaoShiId: obj.banJiLaoShiId,
        // 班级老师
        banJiLaoShiXingMing: obj.banJiLaoShiXingMing,
        // 班级学员组
        banJiXueYuanZu: obj.banJiXueYuanZu,
        // 容量
        rongLiang: obj.rongLiang,
        // 已排课次
        paiKeCiShu: obj.paiKeCiShu,
        // 已上课次
        yiShangKeCiShu: obj.yiShangKeCiShu,
        // 已授课时
        yiShouKeShi: obj.yiShouKeShi,
        // 班级分类
        banJiFenLeiMingCheng: obj.banJiFenLeiMingCheng,

        key: obj.id
    }
    return item;
}

/**
 * 创建班级
 * @param item 班级
 * @returns 
 */
export const chuangJianBanJi = async (item: BanJi): Promise<number> => {
    const { id } = await post('/banji/chuangJianBanJi', item);
    return id;
}

/**
 * 分页获取班级列表
 * @param pageNum 
 * @param pageSize 
 * @returns 
 */
export const huoQuBanJiLieBiao = async (pageNum: number, pageSize: number): Promise<SearchResult<BanJiView>> => {
    const res: PageableListResponse = await get('/banji/huoQuBanJiLeiBiao', { pageNum, pageSize });
    return convertSearchResult<BanJiView>(res, (obj: SourceData) => {
        return convertBanJiView(obj);
    });
}

/**
 * 获取班级详情
 * @param id 班级Id
 */
export const huoQuBanJiXiangQing = async (id: string): Promise<BanJiView> => {
    const res: BanJiView = await get('/banji/huoQuBanJiXiangQing', { id });
    return res;
}

/**
 * 创建班级排课信息
 * @param paiKeXinXi 排课信息
 */
export const chuangJianBanJiPaiKeXinXi = async (paiKeXinXi: PaiKeXinXi): Promise<void> => {
    await post('/combine/chuangJianBanJiPaiKeXinXi', paiKeXinXi);
}

/**
 * 根据课程Id，获取所有选择了该课程的班级
 * @param keChengId 课程Id
 * @returns 
 */
export const huoQuBanJiLieBiaoByKeChengId = async (keChengId: string): Promise<NoPageSearchResult<BanJiView>> => {
    const res: NonPageableListResponse = await get("/banji/huoQuBanJiLieBiaoByKeChengId", { keChengId });
    return convertSearchResultNonPageable<BanJiView>(res, (obj: SourceData) => {
        return convertBanJiView(obj);
    });
}


/**
* 根据班级id，获取班级学员
* @param banJiId 班级Id
* @return
*/
export const huoQuBanJiXueYuanByBanJiId = async (banJiId: string): Promise<BanJiXueYuanView[]> => {
    const res: BanJiXueYuanView[] = await get("/banji/houQuBanJiXueYuanByBanJiId", { banJiId });
    return res;
}

/**
 * 根据学员Id，获取班级列表
 * @param xueYuanId 学员Id
 * @returns 
 */
export const huoQuBanJiLieBiaoByXueYuanId = async (xueYuanId: string): Promise<NoPageSearchResult<BanJiView>> => {
    const res: NonPageableListResponse = await get("/banji/huoQuBanJiLieBiaoByXueYuanId", { xueYuanId });
    return convertSearchResultNonPageable<BanJiView>(res, (obj: SourceData) => {
        return convertBanJiView(obj);
    });
}