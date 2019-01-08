///<reference path="../../../afraid-extension.d.ts"/>

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
                schemas = {...schemas, ...getAllOpenAPIComponents(meta, route.path, layer.method)};
            }
        });
        return schemas;
    }, {});
    return {schemas};
};

const metaMemMap = new WeakMap();

const getAllOpenAPIComponents = (meta: FieldMeta, path?: string, method?: string) => {
    metaMemMap.set(meta, true);
    return {
        [toOpenAPIComponentName(meta, path, method)]: toJSONSchema(meta),
        ...(meta.fields || []).reduce((acc, _meta) => {
            if (_meta.classRef && !metaMemMap.get(meta)) {
                return {...acc, ...getAllOpenAPIComponents(_meta)};
            }
            return acc;
        }, {}),
    };
};

export const toOpenAPIComponentName = (meta: FieldMeta, path?: string, method?: string) => {
    if (meta.classRef && meta.classRef.name) {
        return meta.classRef.name;
    }

    if (!path || !method) {
        throw new Error(`Parameters missing: path and method are required`);
    }

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
        .join('') + suffix + (meta.nthOneOfMany ? meta.nthOneOfMany : '')
        ;
};

export const getOpenAPIComponentRef = (meta: FieldMeta, path?: string, method?: string) =>
    `#/components/schemas/${toOpenAPIComponentName(meta, path, method)}`;

