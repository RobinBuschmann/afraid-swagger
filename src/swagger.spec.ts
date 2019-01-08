import * as express from 'express';
import {Application} from 'express';
import {f, query, Field, body} from 'afraid';
import * as request from 'supertest';
import {swagger} from './swagger';

describe('swagger', () => {

    let app: Application;

    before(() => {
        const handler = (_, res) => res.sendStatus(200);
        class UserDTO {
            @Field id: number;
            @Field name: string;
        }

        app = express();
        app.use('/api-docs/', swagger({version: '1.0', title: 'test'}));
        app.get('/users', [
            query(
                f('limit').int().opt(),
                f('offset').int().opt(),
                f('filters').string().array().opt(),
            ),
        ], handler);
        app.post('users', [
            body(UserDTO),
        ], handler)
    });

    it('should return swagger documentation page', async () => {
        await request(app)
            .get('/api-docs/')
            .expect(200)
        ;
    });

});
