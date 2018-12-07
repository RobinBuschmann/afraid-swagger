import {serve, setup} from 'swagger-ui-express';
import {toOpenAPIDocument} from './openapi/document';
import {getExpressRoutes} from './express/routes';
import {OpenAPIInfo} from './openapi/info/info';
import {Router} from 'express';

export const swagger = (info: OpenAPIInfo) => {
    const createAndServe = (app) => {
        const routes = getExpressRoutes(app);
        const document = toOpenAPIDocument(info, routes);
        return [...(serve as any), setup(document)];
    };
    let isSetup = false;
    const router = Router()
        .use((req, res, next) => {
            if (!isSetup) {
                const app = req.app;
                router.use(createAndServe(app));
                isSetup = true;
            }
            next();
        });
    return router;
};
