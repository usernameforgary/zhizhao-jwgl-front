import React, { ComponentType } from 'react';

import { Redirect } from 'react-router-dom';
import { getStore } from '../store/useStore';
import { IMainStore } from '../customtypes';

//TODO find out why this doesn't work
const protectedRoute = (RouteComponent: ComponentType | undefined) => {
    if (RouteComponent) {
        console.log('------- proteced-------------')
        const userStore = getStore<IMainStore>();
        if (userStore.user?.isLogined) {
            return () => <RouteComponent />;
        }
        return () => <Redirect to="/" />;
    }
    return () => null;
};

export default protectedRoute;
