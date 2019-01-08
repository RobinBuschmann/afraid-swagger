import {expect} from 'chai';
import {body, f, Field, query, oneOf} from 'afraid';
import * as express from 'express';
import {responseBody} from '../meta/middlewares';
import {OpenAPIDocument, toOpenAPIDocument} from './document';
import {getExpressRoutes} from '../express/routes';
import {APPLICATION_JSON_CONTENT_TYPE} from './paths/content';

describe('openapi.document', () => {

    describe('toOpenAPIDocument', () => {

        let document: OpenAPIDocument;

        before(() => {
            const handler = (_, res) => res.sendStatus(200);
            const app = express();

            class CreateUserDTO {
                @Field name: string;
                @Field(() => CreateUserDTO) friend: CreateUserDTO;
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
                    f('limit').int(),
                    f('offset').int().opt(),
                    f('filters').string().array().opt(),
                ),
                responseBody(f('name').string(), f('id').int()),
            ], handler);

            app.get('/friends', [
                oneOf(
                    query(
                        f('limit').int(),
                        f('offset').int(),
                    ),
                    query(
                        f('filters').string().array(),
                    ),
                ),
            ], handler);

            app.get('/users/:id', [responseBody(UserDTO)], handler);
            app.get('/jira-issue/:id', [responseBody(UserDTO)], handler);
            app.post('/users', [body(CreateUserDTO), responseBody(UserDTO)], handler);
            app.post('/users/:id/products', [body(CreateUserProductDTO), responseBody(UserProductDTO)], handler);

            app.post('/users/:id/tags', [
                oneOf(
                    body(f('name').string()),
                    body(f('names').string().array()),
                ),
            ], handler);

            const routes = getExpressRoutes(app);
            document = toOpenAPIDocument({version: '1', title: 'test'}, routes);
        });

        describe('info', () => {

            it('should have proper info values', () => {
                expect(document).to.have.property('info').which.eqls({
                    version: '1',
                    title: 'test',
                });
            });

        });

        describe('paths', () => {

            it('should set root properly', () => {
                expect(document).to.have.property('paths');
            });

            it('should set paths properly', () => {
                expect(document.paths).to.have.property('/users');
                expect(document.paths).to.have.property('/users/{id}');
                expect(document.paths).to.have.property('/users/{id}/products');
                expect(document.paths).to.have.property('/jira-issue/{id}');
            });

            it('should set http methods properly', () => {
                expect(document.paths['/users']).to.have.property('get');
                expect(document.paths['/users']).to.have.property('post');
                expect(document.paths['/users/{id}']).to.have.property('get');
                expect(document.paths['/users/{id}/products']).to.have.property('post');
                expect(document.paths['/jira-issue/{id}']).to.have.property('get');
            });

            describe('parameters', () => {

                it('should set parameters properly', () => {
                    expect(document.paths['/users'].get).to.have.property('parameters')
                        .which.eqls([
                        {in: 'query', name: 'limit', schema: {type: 'integer', format: 'int32'}, required: true},
                        {in: 'query', name: 'offset', schema: {type: 'integer', format: 'int32'}, required: false},
                        {
                            in: 'query',
                            name: 'filters',
                            schema: {type: 'array', items: {type: 'string'}},
                            required: false,
                        },
                    ]);
                });

                it('should set all parameters optional due to oneOf', () => {
                    expect(document.paths['/friends'].get).to.have.property('parameters')
                        .which.eqls([
                        {in: 'query', name: 'limit', schema: {type: 'integer', format: 'int32'}, required: false},
                        {in: 'query', name: 'offset', schema: {type: 'integer', format: 'int32'}, required: false},
                        {
                            in: 'query',
                            name: 'filters',
                            schema: {type: 'array', items: {type: 'string'}},
                            required: false,
                        },
                    ]);
                });

            });

            describe('requestBody', () => {

                it('should set requestBody including content, schema, $ref', () => {
                    expect(document.paths['/users'].post).to.have.property('requestBody')
                        .which.has.property('content')
                        .which.has.property(APPLICATION_JSON_CONTENT_TYPE)
                        .which.has.property('schema')
                        .which.has.property('$ref')
                    ;
                });

                it('should set requestBody including content, schema, oneOf, $ref', () => {
                    expect(document.paths['/users/{id}/tags'].post).to.have.property('requestBody')
                        .which.has.property('content')
                        .which.has.property(APPLICATION_JSON_CONTENT_TYPE)
                        .which.has.property('schema')
                        .which.has.property('oneOf')
                        .which.is.an('array')
                        .and.which.deep.include({$ref: '#/components/schemas/CreateUsersTags1'})
                        .and.which.deep.include({$ref: '#/components/schemas/CreateUsersTags2'})
                    ;
                });

            });

            it('should set responses properly', () => {
                expect(document.paths['/users'].get).to.have.property('responses');
                expect(document.paths['/users'].post).to.have.property('responses');
                expect(document.paths['/users/{id}'].get).to.have.property('responses');
            });

            it('should set tags properly', () => {
                expect(document.paths['/users'].get).to.have.property('tags').that.eqls(['users']);
                expect(document.paths['/users'].post).to.have.property('tags').that.eqls(['users']);
                expect(document.paths['/users/{id}'].get).to.have.property('tags').that.eqls(['users']);
                expect(document.paths['/users/{id}/products'].post).to.have.property('tags')
                    .that.eqls(['users', 'products']);

                expect(document.paths['/jira-issue/{id}'].get).to.have.property('tags')
                    .that.eqls(['jira-issue']);
            });

        });

        describe('components', () => {

            it('should return document with proper components', () => {
                expect(document).to.have.property('components');
                expect(document.components).to.have.property('schemas');
                expect(document.components.schemas).to.have.property('UserDTO');
                expect(document.components.schemas.UserDTO).to.have.property('type', 'object');
                expect(document.components.schemas).to.have.property('CreateUserDTO');
                expect(document.components.schemas).to.have.property('UsersResp');
            });

        });


    });
});
