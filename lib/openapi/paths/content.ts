import {JSONSchema} from '../../json-schema/json-schema';

export interface OpenAPIContent {
    [contentType: string]: {schema: JSONSchema};
}

const APPLICATION_JSON_CONTENT_TYPE = 'application/json';

export const toOpenAPIContent = (schema) =>
    ({[APPLICATION_JSON_CONTENT_TYPE]: {schema}});
