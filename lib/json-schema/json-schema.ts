import {FieldMeta, FieldType} from 'afraid';

export type JSONSchema = RefJSONSchema |
    ObjectJSONSchema |
    ArrayJSONSchema |
    IntegerJSONSchema |
    FloatJSONSchema |
    StringJSONSchema;

export interface BaseJSONSchema {
    description?: string;
}

interface RefJSONSchema {
    $ref: string;
}

export interface StringJSONSchema extends BaseJSONSchema {
    type: 'string';
}

export interface IntegerJSONSchema extends BaseJSONSchema {
    type: 'integer';
    format: 'int32';
}

export interface FloatJSONSchema extends BaseJSONSchema {
    type: ' number';
    format: 'float';
}

export type PropertiesJSONSchema = {
    [propertyKey: string]: JSONSchema
}

export interface ObjectJSONSchema extends BaseJSONSchema {
    type: 'object';
    properties: PropertiesJSONSchema;
    required: string[];
}

export interface ArrayJSONSchema extends BaseJSONSchema {
    type: 'array';
    items: JSONSchema;
}

const toJSONSchemaTypeFormat = (meta: FieldMeta) => {
    const metaType = meta.type;
    let jsonSchemaTypeFormat;
    switch (metaType) {
        case FieldType.date:
            jsonSchemaTypeFormat = {type: 'string', format: 'date-time'};
            break;
        case FieldType.float:
            jsonSchemaTypeFormat = {type: 'number', format: 'float'};
            break;
        case FieldType.int:
            jsonSchemaTypeFormat = {type: 'integer', format: 'int32'};
            break;
        case FieldType.boolean:
            jsonSchemaTypeFormat = {type: 'boolean'};
            break;
        case FieldType.string:
            jsonSchemaTypeFormat = {type: 'string'};
            break;
        case FieldType.object:
            jsonSchemaTypeFormat = {
                type: 'object',
                properties: meta.fields ? toJSONSchemaProperties(meta.fields) : {},
                required: meta.fields ? toJSONSchemaRequiredList(meta.fields) : {},
            };
            break;
        default:
            throw new Error(`Unknown meta type "${metaType}"`);
    }

    return meta.isArray
        ? {type: 'array', items: jsonSchemaTypeFormat}
        : jsonSchemaTypeFormat;
};

const toJSONSchemaProperties = (meta: FieldMeta[]) =>
    meta.reduce((properties, meta) => {
        properties[meta.field] = toJSONSchema(meta);
        return properties;
    }, {});

const toJSONSchemaRequiredList = (meta: FieldMeta[]) =>
    meta
        .filter(({isOptional}) => !isOptional)
        .map(({field}) => field);

export const toJSONSchema = (meta: FieldMeta) => {
    return {
        ...toJSONSchemaTypeFormat(meta),
    }
};

export const toRefJSONSchema = $ref => ({$ref});
