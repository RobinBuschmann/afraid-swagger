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
    const metaType = meta.type;
    const descriptionsWrapper = meta.description ? {description:meta.description} : {};
    let schema;
    switch (metaType) {
        case FieldType.date:
            schema = {type: 'string', format: 'date-time'};
            break;
        case FieldType.float:
            schema = {type: 'number', format: 'float'};
            break;
        case FieldType.int:
            schema = {type: 'integer', format: 'int32'};
            break;
        case FieldType.boolean:
            schema = {type: 'boolean'};
            break;
        case FieldType.object:
            schema = {
                type: 'object',
                properties: meta.fields ? toJSONSchemaProperties(meta.fields) : {},
                required: meta.fields ? toJSONSchemaRequiredList(meta.fields) : {},
            };
            break;
        case FieldType.string:
        default:
            schema = {type: 'string'};
    }
    schema = {...schema, ...descriptionsWrapper};

    return meta.isArray
        ? {type: 'array', items: schema}
        : schema;
};

export const toRefJSONSchema = $ref => ({$ref});
