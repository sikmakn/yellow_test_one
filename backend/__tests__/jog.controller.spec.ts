import request from 'supertest';
import app from '../app';
import {NextFunction, Request, Response} from 'express';
import {create, getMany} from '../services/jog.service';

jest.mock('../services/jog.service', () => ({
    create: jest.fn(),
    getMany: jest.fn(),
}));

jest.mock('../helpers/authValidateMiddleware', () =>
    (req: Request, res: Response, next: NextFunction) => next());

describe('Jog controller', function () {

    describe('Add new jog', function () {

        test('send 200 to success', async () => {
            const response = await request(app)
                .post('/jog')
                .send({date: '2021-01-20', distance: 10, time: 10});
            expect(response.status).toBe(200);
        });

        test('send object from db to success create', async () => {
            const jogObject = {date: '2021-01-20', distance: 10, time: 10};
            const jogResult = {id: 'id', ...jogObject};
            // @ts-ignore
            create.mockImplementation(() => jogResult)
            const response = await request(app)
                .post('/jog')
                .send(jogObject);
            expect(response.body).toEqual(jogResult);
        });

        test('400 to empty jog', async () => {
            const response = await request(app)
                .post('/jog')
                .send({});
            expect(response.status).toBe(400);
        });

        test('400 to less than 1 distance', async () => {
            const response = await request(app)
                .post('/jog')
                .send({date: '2021-01-20', time: 10, distance: 0});
            expect(response.status).toBe(400);

            const response2 = await request(app)
                .post('/jog')
                .send({date: '2021-01-20', time: 10, distance: -10});
            expect(response2.status).toBe(400);
        });

        test('400 to less than 1 time', async () => {
            const response = await request(app)
                .post('/jog')
                .send({date: '2021-01-20', time: 0, distance: 10});
            expect(response.status).toBe(400);

            const response2 = await request(app)
                .post('/jog')
                .send({date: '2021-01-20', time: -10, distance: 10});
            expect(response2.status).toBe(400);
        });

        test('400 to wrong date', async () => {
            const response = await request(app)
                .post('/jog')
                .send({date: '2021-01-20tttt', time: 10, distance: 10});
            expect(response.status).toBe(400);
        });

    });

    describe('Get exist user jogs', function () {

        test('send from db to success find', async () => {
            const jogsResult = [{date: '2021-01-20', time: 10, distance: 10, _id: 'id', username: 'username'}];
            // @ts-ignore
            getMany.mockImplementation(() => jogsResult);
            const response = await request(app)
                .get('/jog')
                .query({from: '2020-01-01', to: '2021-01-01'});
            expect(response.body).toEqual(jogsResult);
        });

        test('works without dates ', async () => {
            const responseWithoutTo = await request(app)
                .get('/jog')
                .query({});
            expect(responseWithoutTo.status).toBe(200);
        });

        test('works without one of date ', async () => {
            const responseWithoutTo = await request(app)
                .get('/jog')
                .query({from: '2020-11-11'});
            expect(responseWithoutTo.status).toBe(200);


            const responseWithoutFrom = await request(app)
                .get('/jog')
                .query({to: '2020-11-11'});
            expect(responseWithoutFrom.status).toBe(200);
        });

        test('400 to wrong "from" date', async () => {
            const response = await request(app)
                .get('/jog')
                .query({from: '2020-01-20tttt', to: '2021-01-20'});
            expect(response.status).toBe(400);
        });

        test('400 to wrong "to" date', async () => {
            const response2 = await request(app)
                .get('/jog')
                .query({from: '2020-01-20', to: '2021-01-20ttt'});
            expect(response2.status).toBe(400);
        });

    });

});