import {JSONSchema} from '../../json-schema/json-schema';

export interface OpenAPIContent {
    [contentType: string]: {schema: JSONSchema};
}

export const APPLICATION_JSON_CONTENT_TYPE = 'application/json';

export const toOpenAPIContent = (schema) =>
    ({[APPLICATION_JSON_CONTENT_TYPE]: {schema}});
