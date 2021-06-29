import { get, post } from "../api/customApi";
import { NonPageableListResponse, NoPageSearchResult, ShanChangKeMu, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertShanChangKeMU = (obj: SourceData): ShanChangKeMu => {
    const item: ShanChangKeMu = {
        id: obj.id,
        mingCheng: obj.minCheng,
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