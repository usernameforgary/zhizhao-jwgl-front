import {
    IdValue,
    NonPageableListResponse,
    NoPageSearchResult,
    OrderableDataNode,
    PaiKeFangShiFenLei, PaiKeChongFuFangShiFenLei, PaiKeJieShuFangShiFenLei,
    SearchResult, SourceData, XingBie, XiTongCaiDan, PaiKeShangKeTian, XueYuanZhuangTai, XueYuanKeCheng, DingJiaBiaoZhun, KeChengLeiXing
} from "../customtypes";
import { xueYuanKeChengFormValueType } from "../pages/xueyuan/xuyuanbaoming/BaoMingGouMaiStep";

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

export function convertPaiKeShangKeTian2Text(paiKeShangKeTian: PaiKeShangKeTian): string {
    switch (paiKeShangKeTian) {
        case PaiKeShangKeTian.ONE:
            return "每周一";
        case PaiKeShangKeTian.TWO:
            return "每周二";;
        case PaiKeShangKeTian.THREE:
            return "每周三";
        case PaiKeShangKeTian.FOUR:
            return "每周四";
        case PaiKeShangKeTian.FIVE:
            return "每周五"
        case PaiKeShangKeTian.SIX:
            return "每周六";
        case PaiKeShangKeTian.SEVEN:
            return "每周日";
        default:
            return "每天";
    }
}

export function convertXueYuanZhuangTai2Text(xueYuanZhuangTai: XueYuanZhuangTai): string {
    switch (xueYuanZhuangTai) {
        case XueYuanZhuangTai.LI_SHI:
            return "历史";
        case XueYuanZhuangTai.QIAN_ZAI:
            return "潜在";
        case XueYuanZhuangTai.ZAI_DU:
            return "在读";
        default:
            return "";
    }
}

/**
 * 转换课程类型
 * @param keChengLeiXing 课程类型
 * @returns 
 */
export function convertKeChengLeiXing2Text(keChengLeiXing: KeChengLeiXing): string {
    switch (keChengLeiXing) {
        case KeChengLeiXing.XIN_BAO:
            return "新报";
        case KeChengLeiXing.KUO_KE:
            return "扩科";
        case KeChengLeiXing.XU_BAO:
            return "续报";
        default:
            return "";
    }
}

/**
 * 
 * @param xuYuanKeChengFormData 学员课程form表单数据
 * @param xueYuanKeChengList 当前学员课程列表
 * @param index 需要更新的位置
 */
export function getNewListWithXueYuanKeChengFormData(xueYuanKeChengFormData: xueYuanKeChengFormValueType, xueYuanKeChengList: XueYuanKeCheng[], index: number): XueYuanKeCheng[] {
    if (!xueYuanKeChengList || xueYuanKeChengList.length < index) {
        console.error("can not convert")
        return [];
    }
    const targetXueYuanKeCheng: XueYuanKeCheng = { ...xueYuanKeChengList[index] }

    const selectedDingJianBiaoZhuMingCheng: string | undefined = xueYuanKeChengFormData.dingJiaBiaoZhunMingCheng
    const dingJiaBiaoZhunSelected: DingJiaBiaoZhun | undefined = targetXueYuanKeCheng.keCheng.dingJiaBiaoZhunZu?.find(v => v.mingCheng === selectedDingJianBiaoZhuMingCheng);

    //定价标准
    if (dingJiaBiaoZhunSelected) {
        targetXueYuanKeCheng.dingJiaBiaoZhun = dingJiaBiaoZhunSelected;
    } else {
        targetXueYuanKeCheng.dingJiaBiaoZhun = undefined;
    }

    //课程类型
    targetXueYuanKeCheng.keChengLeiXing = xueYuanKeChengFormData.keChengLeiXing;
    //单价
    targetXueYuanKeCheng.danJia = xueYuanKeChengFormData.danJia;
    //课程数量
    targetXueYuanKeCheng.keChengShuLiang = xueYuanKeChengFormData.keChengShuLiang;
    //赠送课时
    targetXueYuanKeCheng.zengSongKeShi = xueYuanKeChengFormData.zengSongKeShi;
    //优惠类型
    targetXueYuanKeCheng.youHuiLeiXing = xueYuanKeChengFormData.youHuiLeiXing;
    //优惠数量
    targetXueYuanKeCheng.youHuiShuLiang = xueYuanKeChengFormData.youHuiShuLiang;
    //备注
    targetXueYuanKeCheng.beiZhu = xueYuanKeChengFormData.beiZhu || "";

    const newList = [...xueYuanKeChengList] || [];
    if (newList && newList.length > index) {
        newList[index] = targetXueYuanKeCheng;
    }

    return newList;
}
