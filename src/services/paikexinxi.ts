import { get } from "../api/customApi";
import { NonPageableListResponse, NoPageSearchResult, PaiKeXinXi, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

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

/**
 * 获取班级排课信息 
 * @param banJiId 班级Id
 * @returns 
 */
export const huoQuBanJiPaiKeXinXiLieBiao = async (banJiId: string): Promise<NoPageSearchResult<PaiKeXinXi>> => {
    const res: NonPageableListResponse = await get('/paike/huoquBanJiPaiKeXinXi', { banJiId });
    return convertSearchResultNonPageable<PaiKeXinXi>(res, (obj: SourceData) => {
        return convertPaiKeXinXi(obj);
    });
}

