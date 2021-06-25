import { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';
import DengLu from '../pages/denglu/DengLu';
import Page404 from '../pages/page404/Page404';
import YuanGongLieBiao from '../pages/yuangong/YuanGongLieBiao';

type RoutComponent = {
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
    zhuye,
    yuangongliebiao
}

//TODO 因为webpack动路由，不能指定全路径。暂时未找到解决方案
export const routes: RoutComponent[] = [
    { name: routeName.denglu, path: "/", component: DengLu, withoutLayout: false, exact: true },
    { name: routeName.page404, path: "/404", component: Page404, withoutLayout: true },

    { name: routeName.yuangongliebiao, path: "/yuangong/yuangongliebiao", component: YuanGongLieBiao, withoutLayout: false },
];

// 根据route名称获取预定义的route
export const getDefinedRouteByRouteName = (routeName: routeName): RoutComponent | undefined => {
    return routes.find(r => r.name === routeName);
}

// 根据route名称获取预定义route对应的组件(页面)
export const getComponentByRouteName = (routeName: routeName): ComponentType | undefined => {
    let component;
    if (routes.find(c => c.name === routeName)) {
        component = routes.find(c => c.name === routeName)?.component;
    }
    return component;
}
