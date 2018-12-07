import {OpenAPIContent, toOpenAPIContent} from './content';
import {FieldMeta} from 'afraid';
import {deepMerge} from '../../common/object';
import {toRefJSONSchema} from '../../json-schema/json-schema';
import {getOpenAPIComponentRef} from '../components/components';
import {ExpressLayer, ExpressRoute} from '../../express/types';

export interface OpenAPIRequestBody {
    description?: string;
    required: boolean;
    content: OpenAPIContent;
}

export const toOpenAPIRequestBody = (route: ExpressRoute,
                      layer: ExpressLayer,
                      meta: FieldMeta,
                      currentRequestBody: Partial<OpenAPIRequestBody> | undefined = {}) => {
    const content = toOpenAPIContent(toRefJSONSchema(getOpenAPIComponentRef(route.path, layer.method, meta)));
    return deepMerge(currentRequestBody, {
        required: !meta.isOptional,
        content,
    });
};
