import {OpenAPIParameter, toOpenAPIParameters} from './parameter';
import {OpenAPIResponses, toOpenAPIResponses} from './response';
import {OpenAPIRequestBody, toOpenAPIRequestBody} from './request-body';
import {ExpressRoute} from '../../express/types';
import {capitalize} from '../../common/string';
import {getExpressRouteParamRegex} from '../../express/routes';

export interface OpenAPIMethod {
    operationId: string;
    description?: string;
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses?: OpenAPIResponses;
    tags?: string[];
}

export interface OpenAPIPath {
    [method: string]: OpenAPIMethod;
}

export interface OpenAPIPaths {
    [path: string]: OpenAPIPath;
}

export const toOpenAPIPaths = (routes: ExpressRoute[]): OpenAPIPaths =>
    routes.reduce((paths, route) => {
        const path = paths[getOpenAPIPath(route.path)] = paths[getOpenAPIPath(route.path)] || {};
        route.stack.forEach(layer => {
            const method = path[layer.method] = path[layer.method] || {
                operatorId: getOpenAPIOperatorId(layer.method, route.path),
                tags: getTags(route.path),
            };
            const meta = layer.handle.meta;
            if (meta) {
                if(meta.field === 'body') {
                    method.requestBody = toOpenAPIRequestBody(route, layer, meta, method.requestBody);
                } else if (meta.field.startsWith('response')) {
                    method.responses = toOpenAPIResponses(route, layer, meta, method.responses);
                } else {
                    method.parameters = [
                        ...(method.parameters || []),
                        ...toOpenAPIParameters(meta),
                    ];
                }
            }
        });
        return paths;
    }, {});

const getOpenAPIPath = path =>
    path.replace(getExpressRouteParamRegex(), '{$2}$3');

const getOpenAPIOperatorId = (method: string, path: string) =>
    (method.toLowerCase() + path)
        .split(/[\/\-]/g)
        .map(capitalize)
        .join('')
        .split(':')
        .map(capitalize)
        .join('By');

const getTags = path => path.toLowerCase()
    .replace(getExpressRouteParamRegex(), '')
    .split(/[\/\-]/g)
    .filter(v => !!v);