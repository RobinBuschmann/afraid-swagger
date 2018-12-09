import {expect} from 'chai';
import {body, f, Field, query} from 'afraid';
import * as express from 'express';
import {responseBody} from '../meta/middlewares';
import {OpenAPIDocument, toOpenAPIDocument} from './document';
import {getExpressRoutes} from '../express/routes';

describe('openapi.document', () => {

    describe('toOpenAPIDocument', () => {

        let document: OpenAPIDocument;

        before(() => {
            const handler = (_, res) => res.sendStatus(200);
            const app = express();

            class CreateUserDTO {
                @Field name: string;
            }
            class CreateUserProductDTO {
                @Field name: string;
            }

            class UserDTO {
                @Field id: number;
                @Field name: string;
            }
            class UserProductDTO {
                @Field id: number;
                @Field name: string;
            }

            app.get('/users', [
                query(
                    f('limit').int().opt(),
                    f('offset').int().opt(),
                    f('filters').string().array().opt(),
                ),
                responseBody(f('name').string(), f('id').int())
            ], handler);

            app.get('/users/:id', [responseBody(UserDTO)], handler);
            app.post('/users', [
                body(CreateUserDTO),
                responseBody(UserDTO),
            ], handler);
            app.post('/users/:id/products', [
                body(CreateUserProductDTO),
                responseBody(UserProductDTO),
            ], handler);
            const routes = getExpressRoutes(app);
            document = toOpenAPIDocument({version: '1', title: 'test'}, routes);
        });

        it('should return document with proper info', () => {
            expect(document).to.have.property('info').which.eqls({
                version: '1',
                title: 'test',
            });
        });

        it('should return document with proper paths', () => {
            expect(document).to.have.property('paths');

            expect(document.paths).to.have.property('/users');

            expect(document.paths['/users']).to.have.property('get');
            expect(document.paths['/users'].get).to.have.property('parameters').which.has.lengthOf(3);
            expect(document.paths['/users'].get).to.have.property('responses');
            expect(document.paths['/users'].get).to.have.property('tags').that.eqls(['users']);

            expect(document.paths['/users']).to.have.property('post');
            expect(document.paths['/users'].post).to.have.property('requestBody');
            expect(document.paths['/users'].post).to.have.property('responses');
            expect(document.paths['/users'].post).to.have.property('tags').that.eqls(['users']);

            expect(document.paths).to.have.property('/users/{id}');
            expect(document.paths['/users/{id}']).to.have.property('get');
            expect(document.paths['/users/{id}'].get).to.have.property('responses');
            expect(document.paths['/users/{id}'].get).to.have.property('tags').that.eqls(['users']);

            expect(document.paths['/users/{id}/products'].post).to.have.property('tags')
                .that.eqls(['users', 'products']);
        });

        it('should return document with proper components', () => {
            expect(document).to.have.property('components');
            expect(document.components).to.have.property('schemas');
            expect(document.components.schemas).to.have.property('UserDTO');
            expect(document.components.schemas).to.have.property('CreateUserDTO');
            expect(document.components.schemas).to.have.property('UsersResp');
        });

    });
});
