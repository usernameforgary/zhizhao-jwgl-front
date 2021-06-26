import { post, get } from "../api/customApi";
import { PageableListResponse, SearchResult, SourceData, YuanGong } from "../customtypes";
import { convertSearchResult } from "../utils/converter";

const convertYuanGong = (obj: SourceData): YuanGong => {
    const item: YuanGong = {
        id: obj.id,
        xingMing: obj.xingMing,
        shouJi: obj.shouJi,
        isLaoShi: obj.isLaoShi,
        beiZhu: obj.beiZhu || undefined,
        jueSeZu: obj.jueSeZu,
        zaiZhiZhuangTai: obj.zaiZhiZhuangTai,

        key: obj.id
    };
    return item;
}

export const login = async (shouJi: string, miMa: string): Promise<string> => {
    const { token } = await post('/public/dengLu', { shouJi, miMa });
    return token;
}

export const houQuYuanGongLieBiao = async (page: number, pageSize: number): Promise<SearchResult<YuanGong>> => {
    const params: SourceData = { pageNum: page, pageSize };
    const res: PageableListResponse = await get('/zhanghao/yuanGongLieBiao', params);
    return convertSearchResult<YuanGong>(res, (obj: SourceData) => {
        return convertYuanGong(obj);
    });
};