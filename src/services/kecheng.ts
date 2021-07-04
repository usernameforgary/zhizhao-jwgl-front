import { post, get } from "../api/customApi"
import { KeCheng, NonPageableListResponse, NoPageSearchResult, PageableListResponse, SearchResult, SourceData } from "../customtypes";
import { convertSearchResult, convertSearchResultNonPageable } from "../utils/converter";

const convertKeCheng = (obj: SourceData): KeCheng => {
    const item: KeCheng = {
        id: obj.id,
        mingCheng: obj.mingCheng,
        danJia: obj.danJia,
        dingJiaBiaoZhunZu: obj.dingJiaBiaoZhunZu,
        qingJiaKouKeShi: obj.qingJiaKouKeShi,
        weiDaoKouKeShi: obj.weiDaoKouKeShi,
        beiZhu: obj.beiZhu,
        zaiDuXueYuanShu: obj.zaiDuXueYuanShu,
        qiYongZhuangTai: obj.qiYongZhuangTai,

        key: obj.id
    };
    return item;
}

// 新建课程
export const xinJianKeCheng = async (keCheng: KeCheng): Promise<void> => {
    await post('/kecheng/xinJianKeCheng', keCheng);
}

// 分页获取课程列表
export const huoQuKeChengLieBiao = async (page: number, pageSize: number): Promise<SearchResult<KeCheng>> => {
    const params: SourceData = { pageNum: page, pageSize };
    const res: PageableListResponse = await get('/kecheng/huoQuKeChengLieBiao', params);
    return convertSearchResult<KeCheng>(res, (obj: SourceData) => {
        return convertKeCheng(obj);
    });
}

// 获取所有课程列表
export const huoQuKeChengAll = async (): Promise<NoPageSearchResult<KeCheng>> => {
    const res: NonPageableListResponse = await get('/kecheng/huoQuKeChengAll');
    return convertSearchResultNonPageable<KeCheng>(res, (obj: SourceData) => {
        return convertKeCheng(obj);
    });
}