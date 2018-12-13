import {getExpressRoutes} from './routes';
import {expect} from 'chai';
import * as express from 'express';
import {ExpressRoute} from './types';
import {Router} from 'express';

describe('express.routes', () => {

    describe('getExpressRoutes', () => {

        let routes: ExpressRoute[];

        before(() => {

            const handler = (_, res) => res.sendStatus(200);
            const app = express();

            app.get('/top-layer', handler);
            app.use(Router().get('/router-nested', handler));
            app.use('/api', Router().get('/router-nested', handler));
            app.use('/api', Router().use(Router().get('/router-nested-2n-level')));
            app.use('/api', Router().use('/v1', Router().get('/router-nested-2n-level')));

            routes = getExpressRoutes(app);
        });

        it('should return proper number of routes', () => {
            expect(routes).to.have.lengthOf(5);
        });

        it('should return routes defined on top layer', () => {
            expect(routes.find(({path}) => '/top-layer' === path)).to.be.ok;
        });

        it('should return routes defined on nested router', () => {
            expect(routes.find(({path}) => '/router-nested' === path)).to.be.ok;
        });

        it('should return routes defined on nested router with top path', () => {
            expect(routes.find(({path}) => '/api/router-nested' === path)).to.be.ok;
        });

        it('should return routes defined on router nested on 2nd level with top path', () => {
            expect(routes.find(({path}) => '/api/router-nested-2n-level' === path)).to.be.ok;
        });

        it('should return routes defined on router nested on 2nd level with top path and nested path', () => {
            expect(routes.find(({path}) => '/api/v1/router-nested-2n-level' === path)).to.be.ok;
        });

    });

});