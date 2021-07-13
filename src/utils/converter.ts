import {
    IdValue,
    NonPageableListResponse,
    NoPageSearchResult,
    OrderableDataNode,
    PaiKeFangShiFenLei, PaiKeChongFuFangShiFenLei, PaiKeJieShuFangShiFenLei,
    SearchResult, SourceData, XingBie, XiTongCaiDan, PaiKeShangKeTian
} from "../customtypes";

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

export function convertPaiKeFangShi2Text(paiKeFangShi: PaiKeFangShiFenLei): string {
    switch (paiKeFangShi) {
        case PaiKeFangShiFenLei.GUI_ZE_PAI_KE:
            return "规则排课";
        case PaiKeFangShiFenLei.RI_LI_PAI_KE:
            return "日历排课";
        default:
            return "";
    }
}


export function convertPaiKeFangShi2Enum(paiKeFangShi: string): PaiKeFangShiFenLei {
    switch (paiKeFangShi) {
        case PaiKeFangShiFenLei.GUI_ZE_PAI_KE.toString():
            return PaiKeFangShiFenLei.GUI_ZE_PAI_KE;
        case PaiKeFangShiFenLei.RI_LI_PAI_KE.toString():
            return PaiKeFangShiFenLei.RI_LI_PAI_KE
        default:
            return PaiKeFangShiFenLei.GUI_ZE_PAI_KE;
    }
}

export function convertPaiKeChongFuFangShi2Text(chongFuFangShi: PaiKeChongFuFangShiFenLei): string {
    switch (chongFuFangShi) {
        case PaiKeChongFuFangShiFenLei.MEI_TIAN:
            return "每天重复";
        case PaiKeChongFuFangShiFenLei.MEI_ZHOU:
            return "每周重复";
        default:
            return "";
    }
}

export function convertPaiKeChongFuFangShi2Enum(paiKeChongFuFangShi: string): PaiKeChongFuFangShiFenLei {
    switch (paiKeChongFuFangShi) {
        case PaiKeChongFuFangShiFenLei.MEI_TIAN.toString():
            return PaiKeChongFuFangShiFenLei.MEI_TIAN;
        case PaiKeChongFuFangShiFenLei.MEI_ZHOU.toString():
            return PaiKeChongFuFangShiFenLei.MEI_ZHOU;
        default:
            return PaiKeChongFuFangShiFenLei.MEI_ZHOU;
    }
}

export function convertPaiKeJieShuFangShi2Text(jieShuFangShi: PaiKeJieShuFangShiFenLei): string {
    switch (jieShuFangShi) {
        case PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU:
            return "按日期结束";
        case PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU:
            return "按次数结束";
        default:
            return "";
    }
}
export function convertPaiKeJieShuShi2Enum(paiKeJieShuFangFenLei: string): PaiKeJieShuFangShiFenLei {
    switch (paiKeJieShuFangFenLei) {
        case PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU.toString():
            return PaiKeJieShuFangShiFenLei.CI_SHU_JIE_SHU;
        case PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU.toString():
            return PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU;
        default:
            return PaiKeJieShuFangShiFenLei.RI_QI_JIE_SHU;
    }
}

export function convertPaiKeShangKeTian2Enum(paiKeShangKeTian: string): PaiKeShangKeTian {
    switch (paiKeShangKeTian) {
        case PaiKeShangKeTian.ONE.toString():
            return PaiKeShangKeTian.ONE;
        case PaiKeShangKeTian.TWO.toString():
            return PaiKeShangKeTian.TWO;
        case PaiKeShangKeTian.THREE.toString():
            return PaiKeShangKeTian.THREE;
        case PaiKeShangKeTian.FOUR.toString():
            return PaiKeShangKeTian.FOUR;
        case PaiKeShangKeTian.FIVE.toString():
            return PaiKeShangKeTian.FIVE;
        case PaiKeShangKeTian.SIX.toString():
            return PaiKeShangKeTian.SIX;
        case PaiKeShangKeTian.SEVEN.toString():
            return PaiKeShangKeTian.SEVEN;
        default:
            return PaiKeShangKeTian.DAILY;
    }
}
