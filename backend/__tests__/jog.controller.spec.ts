import request from 'supertest';
import app from '../app';
import {NextFunction, Request, Response} from 'express';

jest.mock('../services/jog.service');
jest.mock('../helpers/authValidateMiddleware', () =>
    (req: Request, res: Response, next: NextFunction) => next());

describe('Jog controller', function () {

    describe('Add new jog', function () {

        test('400 to empty jog', async () => {
            const response = await request(app).post('/jog').send({});
            expect(response.status).toBe(400);
        });

        test('', async () =>{
           const response = await request(app).post('/jog')
        });
    });

});