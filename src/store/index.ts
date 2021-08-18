
import { action, makeObservable, observable } from 'mobx';
import { IMainStore, User } from '../customtypes';
import { huoQuZhangHaoXinXi } from '../services/account';
import { huoQuDaiXiaZaiWenJianShuByZhangHaoId } from '../services/downloaduploadfile';

const defaultUser: User = {
    id: undefined,
    name: undefined,
    head: undefined,
    auth: undefined,
    role: undefined,
    isLogined: false,
    xiTongCaiDanZu: []
};

class Store implements IMainStore {

    @observable
    user: User = { ...defaultUser };

    @observable
    hiddenRegister: boolean = true;

    @observable
    hiddenLogin: boolean = true;

    @observable
    hiddenResetPassword: boolean = true;

    @observable
    daiXiaZaiWenJianShu: number = 0;

    constructor() {
        const token = localStorage.getItem('token');
        if (token) {
            this.login(token);
        }
        makeObservable(this);
    }

    @action
    login(token: string) {
        localStorage.setItem('token', token);
        this.user = {
            ...this.user,
            auth: token,
            isLogined: true,
        };
    }

    logout(): void {
        this.dispose();
    }

    @action
    async loadProfile(): Promise<void> {
        try {
            const res: User = await huoQuZhangHaoXinXi();
            this.user = {
                ...this.user,
                id: res.id,
                name: res.name,
                xiTongCaiDanZu: res.xiTongCaiDanZu
                // head: info.pic ? info.pic.key : undefined,
                // role: info.role,
            };
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            this.user = { ...defaultUser };
        }
    }

    @action
    updateUser(user: User) {
        const newUser = {
            ...this.user,
            ...user,
        };
        this.user = newUser;
    }

    @action
    toggleLogin(flag: boolean): void {
        this.hiddenLogin = !flag;
        if (flag) {
            this.hiddenRegister = true;
            this.hiddenResetPassword = true;
        }
    }

    @action
    toggleRegister(flag: boolean): void {
        this.hiddenRegister = !flag;
        if (flag) {
            this.hiddenLogin = true;
            this.hiddenResetPassword = true;
        }
    }

    @action
    toggleResetPassword(flag: boolean): void {
        this.hiddenResetPassword = !flag;
        if (flag) {
            this.hiddenLogin = true;
            this.hiddenRegister = true;
        }
    }

    dispose(): void {
        localStorage.removeItem('token');
        this.user = { ...defaultUser };
    }

    // 获取当前登录用户，待下载文件数
    @action
    async huoQuDaiXiaZaiWenJianShu() {
        if (this.user.id) {
            try {
                const result: number = await huoQuDaiXiaZaiWenJianShuByZhangHaoId(this.user.id);
                this.daiXiaZaiWenJianShu = result;
            } catch (e) { }
        }
    }
}

const win: { [key: string]: any } = window;
const store = win['__STORE__'] || new Store();
win['__STORE__'] = store;

export default store;