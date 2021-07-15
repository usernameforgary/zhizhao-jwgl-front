import { get, post } from "../api/customApi";
import { XueYuanXinXi } from "../customtypes";

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