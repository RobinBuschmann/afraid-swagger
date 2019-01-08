import {OpenAPIServer} from './servers/server';
import {OpenAPIPaths, toOpenAPIPaths} from './paths/path';
import {OpenAPIComponents, toOpenAPIComponents} from './components/components';
import {OpenAPIInfo} from './info/info';
import {ExpressRoute} from '../express/types';

export interface OpenAPIDocument {
    openapi: "3.0.0",
    info: OpenAPIInfo;
    servers: OpenAPIServer[];
    paths: OpenAPIPaths;
    components: OpenAPIComponents;
}

export const toOpenAPIDocument = (info: OpenAPIInfo,
                                  routes: ExpressRoute[]): OpenAPIDocument => {
    const components = toOpenAPIComponents(routes);
    const paths = toOpenAPIPaths(routes);
    return {
        openapi: '3.0.0',
        info,
        servers: [] as OpenAPIServer[],
        paths,
        components
    };
};