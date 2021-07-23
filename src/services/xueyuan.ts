import { get, post } from "../api/customApi";
import { SearchResult, XueYuanXinXi, PageableListResponse, SourceData } from "../customtypes";
import { convertSearchResult } from "../utils/converter";


const convertXueYuanXinXi = (obj: SourceData): XueYuanXinXi => {
    const item: XueYuanXinXi = {
        id: obj.id,
        // 所属账号
        zhangHaoId: obj.zhangHaoId,
        // 所属账号手机
        zhangHaoShouJi: obj.zhangHaoShouJi,
        // 姓名
        xingMing: obj.xingMing,
        // 学员状态
        xueYuanZhuangTai: obj.xueYuanZhuangTai,
        // 头像
        touXiang: obj.touXiang,
        // 性别
        xingBie: obj.xingBie,
        // 年龄
        nanLing: obj.nanLing,
        // 就读学校
        jiuDuXueXiao: obj.jiuDuXueXiao,
        // 当前年级
        danqQianNianJi: obj.danqQianNianJi,
        // 家庭住址
        jiaTingZhuZhi: obj.jiaTingZhuZhi,
        // 学员来源
        xueYuanLaiYuan: obj.xueYuanLaiYuan,
        // 备注信息
        beiZhuXinXi: obj.beiZhuXinXi,
        // 跟进人
        genJinRenId: obj.genJinRenId,
        // 跟进人姓名
        genJinRenXingMing: obj.genJinRenXingMing,
        // 购买课时
        gouMaiKeShi: obj.gouMaiKeShi,
        // 赠送课时
        zengSongKeShi: obj.zengSongKeShi,
        // 剩余课时
        shengYuKeShi: obj.shengYuKeShi,
        // 消课金额
        xiaoKeJinE: obj.xiaoKeJinE,

        key: obj.id
    }
    return item;
}
/**
 * 获取学员信息
 * @param xueYuanId 学员Id
 */
export const huoQuXueYaunXinXi = async (xueYuanId: string): Promise<XueYuanXinXi> => {
    const res: XueYuanXinXi = await get('/xueyuan/huoQuXueYuanXinXi', { xueYuanId });
    return res;
}

/**
 * 获取所有学员
 * @returns 
 */
export const huoQuXueYuanAll = async (): Promise<XueYuanXinXi[]> => {
    const res: XueYuanXinXi[] = await get('/xueyuan/huoQuXueYuanAll');
    return res;
}

/**
 * 根据姓名和所属账号手机号获取学员
 * @param xingMing 学员
 * @param shouJi 账号手机号
 * @return
 */
export const huoQuXueYuanByXingMingAndShouJi = async (xingMing: string, shouJi: string): Promise<XueYuanXinXi> => {
    const res: XueYuanXinXi = await get('/xueyuan/huoQuXueYuanByXingMingAndZhangHaoShouJi', { xingMing, shouJi });
    return res;
}

/**
 * 创建学员
 * @param xueYuanXinXi 学员信息
 * @returns 
 */
export const chuangJianXueYuan = async (xueYuanXinXi: XueYuanXinXi): Promise<string> => {
    const { id } = await post('/combine/chuangJianXueYuan', { ...xueYuanXinXi });
    return id;
}

/**
 * 分页获取学员列表
 * @param pageNum 当前页
 * @param pageSize 每页多少条数据
 * @returns 
 */
export const huoQuXueYuanLieBiao = async (pageNum: number, pageSize: number): Promise<SearchResult<XueYuanXinXi>> => {
    const res: PageableListResponse = await get('/xueyuan/huoQuXueYuanLieBiaoV2', { pageNum, pageSize });
    return convertSearchResult<XueYuanXinXi>(res, (obj: SourceData) => {
        return convertXueYuanXinXi(obj);
    });
}