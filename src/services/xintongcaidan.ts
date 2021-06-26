import { get } from "../api/customApi"
import { NonPageableListResponse, NoPageSearchResult, SourceData, XiTongCaiDan } from "../customtypes";
import { convertSearchResultNonPageable } from "../utils/converter";

const convertYuanGong = (obj: SourceData): XiTongCaiDan => {
    const item: XiTongCaiDan = {
        id: obj.id,
        // 直接父级菜单Id
        fuId: obj.fuId,
        // 当前菜单所有父级菜单, [fuId1][fuId2]
        fuIds: obj.fuIds,
        // 菜单名称
        mingCheng: obj.mingCheng,
        // 菜单路由
        url: obj.url,
        // 菜单排序
        paiXu: obj.paiXu,
        // 隐藏
        yinCang: obj.yinCang,
        // 菜单图标
        tuBiao: obj.tuBiao,
        // 是不是叶子节点
        isYeZi: obj.isYeZi
    };
    return item;
}

// 获取系统菜单列表
export const huoQuXiTongCaiDanLieBiao = async (): Promise<NoPageSearchResult<XiTongCaiDan>> => {
    const res: NonPageableListResponse = await get('/xiTongCaiDan/huoQuXiTongCaiDan');
    return convertSearchResultNonPageable<XiTongCaiDan>(res, (obj: SourceData) => {
        return convertYuanGong(obj);
    });
}