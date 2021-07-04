import { } from "../customtypes";
import { get } from "../api/customApi";
import { LaoShi, NonPageableListResponse, NoPageSearchResult, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertLaoShi = (obj: SourceData): LaoShi => {
    const item: LaoShi = {
        id: obj.laoShiId,
        xingMing: obj.xingMing,
        zhangHaoId: obj.zhangHaoId
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