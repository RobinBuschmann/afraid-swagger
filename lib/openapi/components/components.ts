///<reference path="../../afraid-extension.d.ts"/>

import {JSONSchema, toJSONSchema} from '../../json-schema/json-schema';
import {ExpressRoute} from '../../express/types';
import {capitalize} from '../../common/string';
import {getExpressRouteParamRegex} from '../../express/routes';
import {FieldMeta} from 'afraid/lib/meta/field-meta';

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
            if (meta && (meta.field === 'body' || meta.field === 'responseBody')) {
                schemas[toOpenAPIComponentName(route.path, layer.method, meta)] =
                    toJSONSchema(meta);
            }
        });
        return schemas;
    }, {});
    return {schemas};
};

export const toOpenAPIComponentName = (path: string, method: string, meta: FieldMeta) => {
    const methodMap = {
        post: 'create',
        put: 'update',
        patch: 'partial-update',
        delete: 'delete',
    };
    const preparedMethod = methodMap[method] === undefined ? '' : methodMap[method];
    const suffix = meta.field.startsWith('response')
        ? `${meta.httpCode || ''}Resp`
        : '';

    return (preparedMethod.toLowerCase() + path)
        .replace(getExpressRouteParamRegex(), '')
        .split(/[\/\-]/g)
        .map(capitalize)
        .join('') + suffix;
};

export const getOpenAPIComponentRef = (path: string, method: string, meta: FieldMeta) =>
    `#/components/schemas/${toOpenAPIComponentName(path, method, meta)}`;

