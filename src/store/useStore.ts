import { IStore } from "../customtypes";

function getStore<T extends IStore>(): T {
    const win: { [key: string]: any } = window;
    return win['__STORE__'];
}

export {
    getStore
}