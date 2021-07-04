import { ComponentType } from 'react';
import BanJiLieBiao from '../pages/banji/BanJiLieBiao';
import DashBord from '../pages/dashbord/DashBord';
import DengLu from '../pages/denglu/DengLu';
import Index from '../pages/index/Index';
import KeChengLieBiao from '../pages/kecheng/KeChengLieBiao';
import XinJianKeCheng from '../pages/kecheng/xinzengkecheng/XinJianKeCheng';
import Page404 from '../pages/page404/Page404';
import XueYuanBaoMing from '../pages/xueyuan/XueYuanBaoMing';
import XueYuanLieBiao from '../pages/xueyuan/XueYuanLieBiao';
import XinJianYuanGong from '../pages/yuangong/xinjianyuangong/XinJianYuanGong';
import YuanGongLieBiao from '../pages/yuangong/YuanGongLieBiao';

type RouteComponent = {
    name: routeName,
    key?: string,
    path: string,
    component?: ComponentType,
    withoutLayout: boolean,
    exact?: boolean
}

export enum routeName {
    denglu,
    page404,
    zhuYe,
    dashboard,
    yuangongliebiao,
    xinjianyuangong,
    xueyuanliebiao,
    kechengliebiao,
    xinjiankecheng,
    xueyuanbaoming,
    banjiliebiao,
}

//TODO 因为webpack动态路由，不能指定全路径。暂时未找到解决方案
export const routes: RouteComponent[] = [
    { name: routeName.denglu, path: "/", component: DengLu, withoutLayout: false, exact: true },
    { name: routeName.page404, path: "/404", component: Page404, withoutLayout: true },
    { name: routeName.zhuYe, path: "/sys", component: Index, withoutLayout: false }
];

export const subRoutes: RouteComponent[] = [
    { name: routeName.yuangongliebiao, path: "/sys/yuangongliebiao", component: YuanGongLieBiao, withoutLayout: false },
    { name: routeName.xinjianyuangong, path: "/sys/xinjianyuangong", component: XinJianYuanGong, withoutLayout: false },
    { name: routeName.xueyuanliebiao, path: "/sys/xueyuanliebiao", component: XueYuanLieBiao, withoutLayout: false },
    { name: routeName.kechengliebiao, path: "/sys/kechengliebiao", component: KeChengLieBiao, withoutLayout: false },
    { name: routeName.xinjiankecheng, path: "/sys/xinjiankecheng", component: XinJianKeCheng, withoutLayout: false },
    { name: routeName.xueyuanbaoming, path: "/sys/xueyuanbaoming", component: XueYuanBaoMing, withoutLayout: false },
    { name: routeName.banjiliebiao, path: "/sys/banjiliebiao", component: BanJiLieBiao, withoutLayout: false },
    { name: routeName.dashboard, path: "/sys", component: DashBord, withoutLayout: false },
]

// 根据route名称获取预定义的route
export const getDefinedRouteByRouteName = (routeName: routeName): RouteComponent | undefined => {
    const allRoutes = [...routes, ...subRoutes];
    return allRoutes.find(r => r.name === routeName);
}

// 根据route名称获取预定义route对应的组件(页面)
export const getComponentByRouteName = (routeName: routeName): ComponentType | undefined => {
    let component;
    if (routes.find(c => c.name === routeName)) {
        component = routes.find(c => c.name === routeName)?.component;
    }
    return component;
}

// 根据route名称获取预定义route对应的组件(页面)
export const getComponentByRoutePath = (path: string): ComponentType | undefined => {
    let component;
    component = subRoutes.find(c => c.path === path)?.component;
    return component;
}
