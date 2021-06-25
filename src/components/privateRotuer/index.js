import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getStore } from "../../store/useStore";

//TODO need use typescript, this works
const PrivateRouter = ({ component: Component, ...rest }) => {
    const userStore = getStore();
    return (
      <Route {...rest} render={routeProps => (
        userStore.user.isLogined ? <Component {...routeProps} /> : <Redirect to="/" />
      )} />
    );
}
export default PrivateRouter;