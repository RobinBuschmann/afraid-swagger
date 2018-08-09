import {ExpressRoute} from './express-types';
import {getSwaggerPathFromExpressRoute} from './path';

export const createSwaggerDocument = ({swagger, title, description, version, produces, app}) =>
    ({
        swagger,
        info: {
            title,
            description,
            version,
        },
        produces,
        paths: getPaths(app),
    });

const getPaths = app => getAllRoutes(app)
    .map(getSwaggerPathFromExpressRoute)
    .reduce((acc, curr) => {
        const content = {[curr.method]: curr.content};
        const prevContent = acc[curr.path] ? acc[curr.path] : {};
        acc[curr.path] = {
            ...prevContent,
            ...content,
        };
        return acc;
    }, {});

const getAllRoutes = app => app._router.stack.reduce((routes, middleware) => {
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