import { get, post } from "../api/customApi";
import { BanJi, BanJiView, NonPageableListResponse, NoPageSearchResult, PageableListResponse, PaiKeXinXi, SearchResult, SourceData } from "../customtypes";
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
        // 班级人数
        renShu: obj.renShu,
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
    const res: SourceData = await get('/banji/huoQuBanJiXiangQing', { id });
    const item: BanJiView = {
        id: res.id,
        //名称
        mingCheng: res.mingCheng,
        // 课程名称
        keChengMingCheng: res.keChengMingCheng,
        // 课程Id
        keChengId: res.keChengId,
        // 容量
        rongLiang: res.rongLiang,
        // 班级老师Id
        banJiLaoShiId: res.banJiLaoShiId,
        // 班级老师
        banJiLaoShiXingMing: res.banJiLaoShiXingMing,
        // 默认授课课时
        moRenShouKeKeShi: res.moRenShouKeKeShi,
        // 班级人数
        renShu: res.renShu,
        // 上课教室Id
        shangKeJiaoShiId: res.shangKeJiaoShiId,
        // 上课教室
        shangKeJiaoShi: res.shangKeJiaoShi,
        // 班级分类
        banJiFenLeiMingCheng: res.banJiFenLeiMingCheng,
        // 备注
        beiZhu: res.beiZhu,

        key: res.id
    }
    return item;
}

/**
 * 创建班级排课信息
 * @param paiKeXinXi 排课信息
 */
export const chuangJianBanJiPaiKeXinXi = async (paiKeXinXi: PaiKeXinXi): Promise<void> => {
    const res: SourceData = await post('/combine/chuangJianBanJiPaiKeXinXi', paiKeXinXi);
}

/**
 * 获取班级排课信息 
 * @param banJiId 班级Id
 * @returns 
 */
export const huoQuBanJiPaiKeXinXiLieBiao = async (banJiId: number): Promise<NoPageSearchResult<PaiKeXinXi>> => {
    const res: NonPageableListResponse = await get('/banjipaikexinxi/huoquBanJiPaiKeXinXi', { banJiId });
    return convertSearchResultNonPageable<PaiKeXinXi>(res, (obj: SourceData) => {
        return convertPaiKeXinXi(obj);
    });
}

const convertPaiKeXinXi = (obj: SourceData): PaiKeXinXi => {
    const item: PaiKeXinXi = {
        id: obj.id,
        banJiId: obj.banJiId,
        paiKeGuiZe: obj.paiKeGuiZe,
        shangKeLaoShiId: obj.shangKeLaoShiId,
        shangKeLaoShiXingMing: obj.shangKeLaoShiXingMing,
        shangKeJiaoShiId: obj.shangKeJiaoShiId,
        shangKeJiaoShiMingCheng: obj.shangKeJiaoShiMingCheng,
        shangKeNeiRong: obj.shangKeNeiRong
    }
    return item;
}