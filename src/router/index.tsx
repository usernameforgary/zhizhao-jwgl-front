import { ComponentType } from 'react';
import DengLu from '../pages/denglu/DengLu';
import YuanGongLieBiao from '../pages/yuangong/YuanGongLieBiao';
import ZhuYe from '../pages/zhuye/ZhuYe';

//TODO 暂时未找到更好方案
const components: { [name: string]: ComponentType } = {
    "denglu": DengLu,
    "yuangong": YuanGongLieBiao,
    "zhuye": ZhuYe
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