import {TransformerHandler} from 'express-transformer';
import {ExpressRoute} from './express-types';
import {getSwaggerParameterFromLayer, SwaggerParameter} from './parameter';

export interface SwaggerPath {
    path: string;
    method: string;
    content: {
        'x-swagger-router-controller': string;
        operationId: string;
        tags?: string[];
        description?: string;
        parameters: SwaggerParameter[];
    }
}

export const description = (description: string): TransformerHandler<{}> =>
    Object.assign((req, res, next) => next(), {swagger: {description}});

export const getSwaggerPathFromExpressRoute = (route: ExpressRoute): SwaggerPath => {
    const path = getSwaggerPathFromExpressPath(route.path);
    const method = getMethodFromExpressRoute(route);
    return {
        path,
        method,
        content: {
            'x-swagger-router-controller': getControllerName(route.path),
            tags: [getControllerName(route.path)],
            description: getDescription(route),
            operationId: getSwaggerOperatorId(method, route.path),
            parameters: route.stack
                .filter(layer => layer.handle._context)
                .map(getSwaggerParameterFromLayer),
        },
    }
};

const getDescription = (route: ExpressRoute) => {
    return route.stack.reduce((description, layer) => {
        if (layer.handle.swagger) {
            return layer.handle.swagger.description;
        }
        return description;
    }, '');
};

const getExpressRouteParamRegex = () => /:((.*?)(\/|$))/g;

const getSwaggerPathFromExpressPath = path => path.replace(getExpressRouteParamRegex(), '{$2}$3');

const getMethodFromExpressRoute = (route: ExpressRoute): string =>
    Object.keys(route.methods).filter(key => route.methods[key]).shift() as string;

const capitalize = word => word.charAt(0).toUpperCase() + word.substr(1, word.length);

const getControllerName = path => path
    .replace(getExpressRouteParamRegex(), '')
    .split(/[\/\-]/g)
    .map(capitalize)
    .join('');

const getSwaggerOperatorId = (method: string, path: string) =>
    method.toLowerCase() + path
        .split(/[\/\-]/g)
        .map(capitalize)
        .join('')
        .split(':')
        .map(capitalize)
        .join('By');