import { get } from "../api/customApi";
import { NonPageableListResponse, NoPageSearchResult, ShanChangKeMu, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertShanChangKeMU = (obj: SourceData): ShanChangKeMu => {
    const item: ShanChangKeMu = {
        id: obj.id,
        mingCheng: obj.mingCheng,
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