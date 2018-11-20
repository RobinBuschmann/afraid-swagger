import {JSONSchema, toJSONSchema} from '../../json-schema/json-schema';
import {ExpressRoute} from '../../express/types';
import {capitalize} from '../../common/string';
import {getExpressRouteParamRegex} from '../../express/routes';

export interface OpenAPIComponent {
    [componentName: string]: JSONSchema;
}

export interface OpenAPIComponents {
    schemas: OpenAPIComponent;
}

export const toOpenAPIComponents = (routes: ExpressRoute[]) => {
    const schemas = routes.reduce((schemas, route) => {
        route.stack.forEach(layer => {
            const meta = layer.handle.meta;
            if (meta && meta.field === 'body') {
                schemas[toOpenAPIComponentName(route.path, layer.method)] =
                    toJSONSchema(meta);
            }
        });
        return schemas;
    }, {});
    return {schemas};
};

export const toOpenAPIComponentName = (path: string, method: string) => {
    const methodMap = {
        post: 'create',
        put: 'update',
        patch: 'partial-update',
        delete: 'delete',
    };
    const preparedMethod = methodMap[method] === undefined ? '' : methodMap[method];

    return (preparedMethod.toLowerCase() + path)
        .replace(getExpressRouteParamRegex(), '')
        .split(/[\/\-]/g)
        .map(capitalize)
        .join('');
};

export const getOpenAPIComponentRef = (path: string, method: string) =>
    `#/components/schemas/${toOpenAPIComponentName(path, method)}`;

