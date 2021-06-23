import React, { ComponentType } from 'react';

import { Redirect, Route } from 'react-router-dom';
import { getStore } from '../store/useStore';
import { IMainStore } from '../customtypes';

const protectedRoute = (RouteComponent: ComponentType) => {
    const userStore = getStore<IMainStore>();
    if (userStore.user?.isLogined) {
        return () => <RouteComponent />;
    }
    return () => <Redirect to="/login" />;
};

export default protectedRoute;
