import { get } from "../api/customApi"
import { JiaoFeiJiLuTableViewData, PageableListResponse, SearchResult, SourceData } from "../customtypes";
import { convertSearchResult } from "../utils/converter";

const convertJiaoFeiJiLu = (obj: SourceData): JiaoFeiJiLuTableViewData => {
    const item: JiaoFeiJiLuTableViewData = {
        id: obj.id,
        // 学员id
        xueYuanId: obj.xueYuanId,
        // 学员姓名
        xueYuanXingMing: obj.xueYuanXingMing,
        // 学员课程组
        xueYuanKeChengZu: obj.xueYuanKeChengZu,
        // 缴费历史组
        jiaoFeiLiShiZu: obj.jiaoFeiLiShiZu,
        // 跟进人id
        genJinRenId: obj.genJinRenId,
        // 跟进人姓名
        genJinRenXingMing: obj.genJinRenXingMing,
        // 缴费记录状态
        jiaoFeiJiLuZhuangTai: obj.jiaoFeiJiLuZhuangTai,

        key: obj.id
    };
    return item;
}

// 分页获取课程列表
export const huoQuJiaoFeiJiLuLieBiao = async (page: number, pageSize: number): Promise<SearchResult<JiaoFeiJiLuTableViewData>> => {
    const params: SourceData = { pageNum: page, pageSize };
    const res: PageableListResponse = await get('/jiaofeijilu/huoQuJiaoFeiJiLuLieBiao', params);
    return convertSearchResult<JiaoFeiJiLuTableViewData>(res, (obj: SourceData) => {
        return convertJiaoFeiJiLu(obj);
    });
}