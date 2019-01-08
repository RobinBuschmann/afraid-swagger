import {ExpressRoute} from './types';
import {Application} from 'express';

export const getExpressRoutes = (app: Application) => getExpressRoutesFromHandle(app._router);

const getExpressRoutesFromHandle = (handle: ExpressRoute, parentPath = '') =>
    handle.stack.reduce((routes, {route, name, handle, regexp}) => {
        if (route) {
            routes.push({
                ...route,
                path: parentPath + route.path,
            });
        } else if (name === 'router' && handle) {
            const path = parentPath + (regexp ? getExpressPathFromRegExp(regexp) : '');
            routes.push(...getExpressRoutesFromHandle(handle, path));
        }
        return routes;
    }, [] as ExpressRoute[]);

export const getExpressPathFromRegExp = (regex: RegExp) => {
    // Adapted from https://github.com/expressjs/express/issues/3308#issuecomment-300957572
    const regexStr = regex.toString();
    const match = regexStr
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
        ? match[1].replace(/\\(.)/g, '$1')
        : regexStr;
};

export const getExpressRouteParamRegex = () => /:((.*?)(\/|$))/g;