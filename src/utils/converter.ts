import { IdValue, NoPageSearchResult, OrderableDataNode, SearchResult, SourceData, XiTongCaiDan } from "../customtypes";

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

// 将菜单列表转换成antd里的TreeNode（扩展的TreeNode，用于排序）列表
export function convertCaiDanList2TreeData(data: NoPageSearchResult<XiTongCaiDan>): OrderableDataNode[] {
    //TODO 目前仅支持2级菜单的处理
    const parentNodes: OrderableDataNode[] = [];
    // 取得所有父节点
    data.list.map(val => {
        if (!val.isYeZi && !val.yinCang) {
            const parentNode: OrderableDataNode = { key: val.id ?? 0, title: val.mingCheng, paiXu: val.paiXu, isLeaf: false, children: [] }
            parentNodes.push(parentNode);
        }
    });

    //父节点排序
    parentNodes.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
    //插入子节点
    data.list.map(val => {
        if (val.isYeZi && !val.yinCang) {
            const childNode: OrderableDataNode = { key: val.id ?? 0, title: val.mingCheng, isLeaf: true, paiXu: val.paiXu };
            parentNodes.map((p, idx) => {
                if (p.key === val.fuId) {
                    parentNodes[idx].children?.push(childNode);
                }
            })
        }
    })
    //子节点排序
    parentNodes.map(p => {
        if (p.children) {
            p.children.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
        }
    })

    return parentNodes;
}