import {ExpressRoute} from './types';

export const getExpressRoutes = app => app._router.stack.reduce((routes, middleware) => {
    if (middleware.route) {
        routes.push(middleware.route);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                routes.push(handler.route);
            }
        });
    }
    return routes;
}, [] as ExpressRoute[]);

export const getExpressRouteParamRegex = () => /:((.*?)(\/|$))/g;