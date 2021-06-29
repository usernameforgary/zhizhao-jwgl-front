import { get, post } from "../api/customApi"
import { JueSe, NonPageableListResponse, NoPageSearchResult, SourceData } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertJueSe = (obj: SourceData): JueSe => {
    const item: JueSe = {
        id: obj.id,
        mingCheng: obj.mingCheng,
        jianJie: obj.jianJie,
        xiTongCaiDanZu: obj.xiTongCaiDanZu,
        xiTongApiZu: obj.xiTongApiZu
    }

    return item;
}

// 获取角色列表
export const huoQuJueSeLieBiao = async (): Promise<NoPageSearchResult<JueSe>> => {
    const res: NonPageableListResponse = await get("/jueSe/huoQuJueseLieBiao");
    return convertSearchResultNonPageable<JueSe>(res, (obj: SourceData) => {
        return convertJueSe(obj);
    });
}

// 创建角色
export const chuangJianJueSe = async (mingCheng: string, jianJie: string, xiTongCaiDanZu: number[]): Promise<string> => {
    const { id } = await post("/jueSe/chuangJianJueSe", { mingCheng, jianJie, xiTongCaiDanZu });
    return id;
}