///<reference path="../../afraid-extension.d.ts"/>

import {OpenAPIContent, toOpenAPIContent} from './content';
import {JSONSchema, toJSONSchema, toRefJSONSchema} from '../../json-schema/json-schema';
import {deepMerge} from '../../common/object';
import {ExpressLayer, ExpressRoute} from '../../express/types';
import {FieldMeta} from 'afraid';
import {getOpenAPIComponentRef} from '../components/components';

export interface OpenAPIResponse {
    headers?: OpenAPIResponseHeaders;
    content?: OpenAPIContent;
    description?: string;
}

export interface OpenAPIResponseHeaders {
    [header: string]: JSONSchema;
}

export interface OpenAPIResponses {
    [statusCode: string]: OpenAPIResponse;

    default: OpenAPIResponse;
}

const toOpenAPIResponseHeaders = (meta: FieldMeta) =>
    (meta.fields || []).reduce((headers, field) => {
        headers[field.field] = toJSONSchema(field);
        return headers;
    }, {});

export const toOpenAPIResponses = (route: ExpressRoute,
                                   layer: ExpressLayer,
                                   meta: FieldMeta,
                                   currentResponses: Partial<OpenAPIResponses> | undefined = {}) => {
    const content = meta.field === 'responseBody'
        ? toOpenAPIContent(toRefJSONSchema(getOpenAPIComponentRef(meta, route.path, layer.method), !!meta.nthOneOfMany))
        : {};
    const headers = meta.field === 'responseHeaders'
        ? toOpenAPIResponseHeaders(meta)
        : {};
    return deepMerge(currentResponses, {
        [meta.httpCode || 'default']: {
            content,
            headers,
        },
    });
};
