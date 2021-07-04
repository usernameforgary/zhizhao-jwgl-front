import { get, post } from "../api/customApi";
import { BanJiFenLei, NonPageableListResponse, NoPageSearchResult, ShanChangKeMu, ShangKeJiaoShi, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertShanChangKeMU = (obj: SourceData): ShanChangKeMu => {
    const item: ShanChangKeMu = {
        id: obj.id,
        mingCheng: obj.minCheng,
    }
    return item;
}

const convertShangKeJiaoShi = (obj: SourceData): ShangKeJiaoShi => {
    const item: ShangKeJiaoShi = {
        id: obj.id,
        mingCheng: obj.mingCheng,

        key: obj.id
    }
    return item;
}

const convertBanJiFenLei = (obj: SourceData): BanJiFenLei => {
    const item: BanJiFenLei = {
        id: obj.id,
        mingCheng: obj.mingCheng,

        key: obj.id
    }
    return item;
}

// 获取擅长科目列表
export const huoQuShanChangKeMu = async (): Promise<NoPageSearchResult<ShanChangKeMu>> => {
    const res: NonPageableListResponse = await get("/common/huoQuShanChangKeMuLieBiao");
    return convertSearchResultNonPageable<ShanChangKeMu>(res, (obj: SourceData) => {
        return convertShanChangKeMU(obj);
    });
}

// 创建擅长科目
export const chuangJianShanChangKeMu = async (mingCheng: string): Promise<string> => {
    const result = await post('/common/chuangJianShanChangKeMu', { minCheng: mingCheng });
    const { id } = result;
    return id;
}

// 获取所有上课教室列表
export const huoQuShangKeJiaoShiAll = async (): Promise<NoPageSearchResult<ShangKeJiaoShi>> => {
    const res: NonPageableListResponse = await get('/common/huoQuShangKeJiaoShiAll');
    return convertSearchResultNonPageable<ShangKeJiaoShi>(res, (obj: SourceData) => {
        return convertShangKeJiaoShi(obj);
    });
}

// 获取所有班级分类
export const huoQuBanJiFenLeiAll = async (): Promise<NoPageSearchResult<BanJiFenLei>> => {
    const res: NonPageableListResponse = await get('/common/huoQuBanJiFenLeiAll');
    return convertSearchResultNonPageable<BanJiFenLei>(res, (obj: SourceData) => {
        return convertBanJiFenLei(obj);
    });
}