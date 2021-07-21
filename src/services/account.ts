import { post, get } from "../api/customApi";
import { PageableListResponse, SearchResult, SourceData, User, XiTongCaiDan, YuanGong, ZhangHaoLeiXing } from "../customtypes";
import { convertSearchResult } from "../utils/converter";
import { convertXiTongCaiDan } from "./xintongcaidan";

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

// 登录
export const login = async (shouJi: string, miMa: string): Promise<string> => {
    const { token } = await post('/public/dengLu', { shouJi, miMa, zhangHaoLeiXing: ZhangHaoLeiXing.YUAN_GONG });
    return token;
}

// 获取账户详情
export const huoQuZhangHaoXinXi = async (): Promise<User> => {
    const res = await get('/zhanghao/zhangHaoXinXi');
    const xiTongCaiDanResponse: any[] = res.xitongCaiDanZu;
    const xiTongCaiDanZu: XiTongCaiDan[] = [];
    if (xiTongCaiDanResponse) {
        xiTongCaiDanResponse.forEach(v => {
            xiTongCaiDanZu.push(convertXiTongCaiDan(v));
        })
    }

    return {
        isLogined: true,
        id: res.id,
        role: res.role,
        name: res.xingMing,
        xiTongCaiDanZu: xiTongCaiDanZu
    }
}

// 获取员工列表
export const houQuYuanGongLieBiao = async (page: number, pageSize: number): Promise<SearchResult<YuanGong>> => {
    const params: SourceData = { pageNum: page, pageSize };
    const res: PageableListResponse = await get('/zhanghao/yuanGongLieBiao', params);
    return convertSearchResult<YuanGong>(res, (obj: SourceData) => {
        return convertYuanGong(obj);
    });
};

// 添加员工
export const chuangJianYuanGong = async (xingMing: string, shouJi: string, jueSeZu: number[], xingBie: string, isLaoShi: boolean, beiZhu?: string, shanChangKeMu?: string[]): Promise<void> => {
    await post("/combine/tianjiaYuanGong", { xingMing, shouJi, jueSeZu, xingBie, isLaoShi, beiZhu, shanChangKeMuZu: shanChangKeMu });
}

// 获取系统里所有员工（基本信息）
export const huoQuYuanGongLieBiaoAll = async (zhangHaoLeiXing: ZhangHaoLeiXing): Promise<YuanGong[]> => {
    const res: YuanGong[] = await get('/zhanghao/getZhangHaoLeiBiaoByZhangHaoLeiXing', { zhangHaoLeiXing });
    return res;
}
