import {OpenAPIParameter, toOpenAPIParameters} from './parameter';
import {OpenAPIResponses} from './response';
import {OpenAPIRequestBody, toOpenAPIRequestBody} from './request-body';
import {ExpressRoute} from '../../express/types';
import {capitalize} from '../../common/string';
import {getOpenAPIComponentRef, OpenAPIComponents} from '../components/components';
import {getExpressRouteParamRegex} from '../../express/routes';
import {toRefJSONSchema} from '../../json-schema/json-schema';
import {toOpenAPIContent} from './content';

export interface OpenAPIMethod {
    operationId: string;
    description?: string;
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses?: OpenAPIResponses;
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
                operatorId: getOpenAPIOperatorId(route.path, layer.method),
            };
            const meta = layer.handle.meta;
            if (meta) {
                if (meta.field === 'body') {
                    const jsonSchema = toOpenAPIContent(toRefJSONSchema(getOpenAPIComponentRef(route.path, layer.method)));
                    method.requestBody = {
                        ...(method.requestBody || {}),
                        ...toOpenAPIRequestBody(meta, jsonSchema),
                    };
                } else if(meta.field.startsWith('response')) {
                    // Todo
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