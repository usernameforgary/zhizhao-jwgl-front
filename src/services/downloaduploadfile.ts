import { get } from "../api/customApi";
import { DownloadUploadFile, PageableListResponse, SearchResult, SourceData } from "../customtypes";
import { convertSearchResult } from "../utils/converter";

const convertDownloadUploadFile = (obj: SourceData): DownloadUploadFile => {
    const res: DownloadUploadFile = {
        id: obj.id,
        // 创建时间
        createTime: obj.createTime,
        // 文件名称
        mingCheng: obj.mingCheng,
        // 后缀
        houZhui: obj.houZhui,
        // oss上key(文件名)
        ossKey: obj.ossKey,
        // 大小
        daXiao: obj.daXiao,
        // 上传下载文件分类
        wenJianFenLei: obj.wenJianFenLei,
        // 上传下载文件状态
        wenJianZhuangTai: obj.wenJianZhuangTai,
        // 操作者Id
        zhangHaoId: obj.zhangHaoId,
        // 账号姓名
        zhangHaoXingMing: obj.zhangHaoXingMing,

        key: obj.id
    }
    return res;
}

/**
 * 获取账号待下载文件数
 * @returns 
 */
export const huoQuDaiXiaZaiWenJianShuByZhangHaoId = async (zhangHaoId: string): Promise<number> => {
    const { count } = await get("/downloaduploadfile/huoQuDaiXiaZaiWenJianShuByZhangHaoId", { zhangHaoId });
    return count;
}

/**
 * 根据账号Id，分页获取类型为【下载】的文件列表
 * @param zhangHaoId 账号Id
 * @returns 
 */
export const huoQuXiaZaiWenJianByZhangHaoId = async (pageNum: number, pageSize: number, zhangHaoId: string): Promise<SearchResult<DownloadUploadFile>> => {
    const res: PageableListResponse = await get("/downloaduploadfile/huoQuXiaZaiWenJianByZhangHaoId", { pageNum, pageSize, zhangHaoId });
    return convertSearchResult<DownloadUploadFile>(res, (obj: SourceData) => {
        return convertDownloadUploadFile(obj);
    });
}

/**
 * 根据文件记录Id下载文件
 * @param id 文件记录Id
 */
export const xiaZaiWenJianById = async (id: string): Promise<string> => {
    const { url } = await get("/downloaduploadfile/xiaZaiWenJianById", { id });
    return url;
}