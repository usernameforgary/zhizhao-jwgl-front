import { ObjectFlags } from "typescript";
import { get, post } from "../api/customApi";
import { SearchResult, XueYuanXinXi, PageableListResponse, SourceData, GenJinZhuangTai, QianZaiXueYuanView, ZaiDuXueYuanView, LiShiXueYuanView } from "../customtypes";
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

const convertQianZaiXueYuanView = (obj: SourceData): QianZaiXueYuanView => {
    const res: QianZaiXueYuanView = {
        id: obj.id,
        // 姓名
        xingMing: obj.xingMing,
        // 手机
        shouJi: obj.shouJi,
        // 跟进状态
        genJinZhangTai: obj.genJinZhangTai,
        // 意向级别
        yiXiangJiBie: obj.yiXiangJiBie,
        // 跟进人Id
        genJinRenId: obj.genJinRenId,
        // 跟进人姓名
        genJinRenXingMing: obj.genJinRenXingMing,

        // 最后一次跟进记录
        latestGenJinJiLu: obj.latestGenJinJiLu,
        // 下次跟进记录
        nextGenJinJiLu: obj.nextGenJinJiLu,
        // 年龄
        nanLing: obj.nanLing,
        // 标签组
        xueYuanBiaoQianZu: obj.xueYuanBiaoQianZu,
        // 创建时间
        createTime: obj.createTime,
        // 学员状态
        xueYuanZhuangTai: obj.xueYuanZhuangTai,

        key: obj.id
    };
    return res;
}

const convertLiShiXueYuanView = (obj: SourceData): LiShiXueYuanView => {
    const res: LiShiXueYuanView = {
        id: obj.id,
        // 姓名
        xingMing: obj.xingMing,
        // 手机
        shouJi: obj.shouJi,
        // 年龄
        nanLing: obj.nanLing,
        // 创建时间
        createTime: obj.createTime,
        // 结业时间
        jieYeShiJian: obj.jieYeShiJian,
        // 最后就读课程
        latestKeCheng: obj.latestKeCheng,
        // 跟进人Id
        genJinRenId: obj.genJinRenId,
        // 跟进人姓名
        genJinRenXingMing: obj.genJinRenXingMing,
        // 学员状态
        xueYuanZhuangTai: obj.xueYuanZhuangTai,

        key: obj.id
    }
    return res;
}

const convertZaiDuXueYuanView = (obj: SourceData): ZaiDuXueYuanView => {
    const res: ZaiDuXueYuanView = {
        id: obj.id,
        // 姓名
        xingMing: obj.xingMing,
        // 手机
        shouJi: obj.shouJi,
        // 当前年级
        danqQianNianJi: obj.danqQianNianJi,

        // 最后一次跟进记录
        latestGenJinJiLu: obj.latestGenJinJiLu,

        // 年龄
        nanLing: obj.nanLing,
        // 跟进人Id
        genJinRenId: obj.genJinRenId,
        // 跟进人姓名
        genJinRenXingMing: obj.genJinRenXingMing,
        // 学员状态
        xueYuanZhuangTai: obj.xueYuanZhuangTai,
    };
    return res;
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

/**
 * 分页获取获取潜在学员列表
 * @param pageNum 
 * @param pageSize 
 * @param keyword 关键字
 * @param genJinZhuangTai 跟进状态
 * @param genJinRenId 跟进人
 */
export const huoQuQianZaiXueYuanLieBiao = async (
    pageNum: number,
    pageSize: number,
    keyword: string,
    genJinZhuangTai: GenJinZhuangTai | undefined,
    genJinRenId: string
): Promise<SearchResult<QianZaiXueYuanView>> => {
    const params = {
        pageNum,
        pageSize,
        keyword: keyword || "",
        genJinZhuangTai: genJinZhuangTai || "",
        genJinRenId: genJinRenId || ""
    }
    const res: PageableListResponse = await get('/xueyuan/huoQuQianZaiXueYuanLieBiao', { ...params });
    return convertSearchResult<QianZaiXueYuanView>(res, (obj: SourceData) => {
        return convertQianZaiXueYuanView(obj);
    });
}


/**
 * 分页获取获取在读学员列表
 * @param pageNum 
 * @param pageSize 
 * @param keyword 关键字
 * @param banJiId 班级Id
 */
export const huoQuZaiDuXueYuanLieBiao = async (
    pageNum: number,
    pageSize: number,
    keyword: string,
    banJiId: string
): Promise<SearchResult<ZaiDuXueYuanView>> => {
    const params = {
        pageNum,
        pageSize,
        keyword: keyword || "",
        banJiId: banJiId || ""
    }
    const res: PageableListResponse = await get('/xueyuan/huoQuZaiDuXueYuanLieBiao', { ...params });
    return convertSearchResult<ZaiDuXueYuanView>(res, (obj: SourceData) => {
        return convertZaiDuXueYuanView(obj);
    });
}



/**
 * 分页获取获取历史学员列表
 * @param pageNum 
 * @param pageSize 
 * @param keyword 关键字
 * @param keChengId 课程Id
 * @param genJinRenId 跟进人Id
 */
export const huoQuLiShiXueYuanLieBiao = async (
    pageNum: number,
    pageSize: number,
    keyword: string,
    keChengId: string,
    genJinRenId: string
): Promise<SearchResult<LiShiXueYuanView>> => {
    const params = {
        pageNum,
        pageSize,
        keyword: keyword || "",
        keChengId: keChengId || "",
        genJinRenId: genJinRenId || ""
    }
    const res: PageableListResponse = await get('/xueyuan/huoQuLiShiXueYuanLieBiao', { ...params });
    return convertSearchResult<LiShiXueYuanView>(res, (obj: SourceData) => {
        return convertLiShiXueYuanView(obj);
    });
}
