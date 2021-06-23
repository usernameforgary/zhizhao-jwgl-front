import React, { ComponentType, ReactNode } from 'react';
import Denglu from '../pages/denglu/Denglu';
import YuanGongLieBiao from '../pages/yuangong/YuanGongLieBiao';

//TODO 暂时未找到更好方案
const components: { [name: string]: ComponentType } = {
    "denglu": Denglu,
    "yuangong": YuanGongLieBiao
}

export const getComponentByName = (name: string) => {
    return components[name];
}

interface IRouter {
    title: string
    path: string
    key: string
    icon?: string
    component?: string
    children?: IRouter[]
}

const router: IRouter[] = [
    {
        path: '/login',
        title: "登录",
        key: "denglu",
        component: "denglu"
    },

]

export default router;