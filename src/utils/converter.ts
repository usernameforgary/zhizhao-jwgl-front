import { IdValue, NonPageableListResponse, NoPageSearchResult, OrderableDataNode, SearchResult, SourceData, XingBie, XiTongCaiDan } from "../customtypes";

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

// 转换带分页的请求结果（后端JPA返回）


// 转换不带分页的请求结果
export function convertSearchResultNonPageable<T extends IdValue>(data: NonPageableListResponse, mapper: (itemSrc: SourceData) => T): NoPageSearchResult<T> {
    return {
        list: data.map((obj: any) => {
            return mapper(obj);
        })
    }
}

// 将菜单列表转换成antd里的TreeNode（扩展的TreeNode，包含排序字段）列表，也可用于主页左侧Menue组件的渲染
export function convertCaiDanList2TreeData(list: XiTongCaiDan[]): OrderableDataNode[] {
    //TODO 目前仅支持2级菜单的处理
    const parentNodes: OrderableDataNode[] = [];
    // 取得所有父节点
    list.forEach(val => {
        if (!val.isYeZi && !val.yinCang) {
            const parentNode: OrderableDataNode = { key: val.id ?? 0, title: val.mingCheng, paiXu: val.paiXu, isLeaf: false, url: val.url, children: [] }
            parentNodes.push(parentNode);
        }
    })

    //父节点排序
    parentNodes.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
    //插入子节点
    list.forEach(val => {
        if (val.isYeZi && !val.yinCang) {
            const childNode: OrderableDataNode = { key: val.id ?? 0, title: val.mingCheng, isLeaf: true, paiXu: val.paiXu, url: val.url };
            parentNodes.forEach((p, idx) => {
                if (p.key === val.fuId) {
                    parentNodes[idx].children?.push(childNode);
                }
            })
        }
    })

    //子节点排序
    parentNodes.forEach(p => {
        if (p.children) {
            p.children.sort((a, b) => (a.paiXu > b.paiXu) ? 1 : ((b.paiXu > a.paiXu) ? -1 : 0));
        }
    })

    return parentNodes;
}

export function convertXingBie2Text(xingBie: XingBie): string {
    switch (xingBie) {
        case XingBie.NAN:
            return "男";
        case XingBie.NV:
            return "女";
        default:
            return "其他"
    }
}