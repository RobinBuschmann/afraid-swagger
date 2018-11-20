import {serve, setup} from 'swagger-ui-express';
import {toOpenAPIDocument} from './openapi/document';
import {getExpressRoutes} from './express/routes';

export const swagger = (app, info) => {
    const routes = getExpressRoutes(app);
    const document = toOpenAPIDocument(app, info, routes);
    return [serve, setup(document)];
};
