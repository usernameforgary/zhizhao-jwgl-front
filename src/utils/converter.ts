import { IdValue, NoPageSearchResult, SearchResult, SourceData } from "../customtypes";

// 转换带分页的请求结果
export function convertSearchResult<T extends IdValue>(data: SourceData, mapper: (itemSrc: SourceData) => T): SearchResult<T> {
    const { current, pages, records, size, total } = data;
    return {
        list: records.map((obj: any) => {
            return mapper(obj);
        }),
        total: total,
        totalPage: pages,
        page: current,
        pageSize: size,
    }
}

// 转换不带分页的请求结果
export function convertSearchResultNonPageable<T extends IdValue>(data: SourceData, mapper: (itemSrc: SourceData) => T): NoPageSearchResult<T> {
    return {
        list: data.map((obj: any) => {
            return mapper(obj);
        })
    }
}