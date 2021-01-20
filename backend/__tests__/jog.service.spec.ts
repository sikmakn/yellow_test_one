import * as jogService from '../services/jog.service';
import {findStatistic} from '../db/repositories/jog.repository';

jest.mock('../db/repositories/jog.repository', () => ({
    findStatistic: jest.fn(),
}));

describe('Jog service', function () {

    describe('getStatistic', function () {

        beforeEach(() => {
            const statisticArr = [{avgSpeed: 10, avgTime: 10, totalDistance: 10, _id: 3}];
            // @ts-ignore
            findStatistic.mockImplementation(() => statisticArr);
        });

        test('findStatistic called', async () => {
            await jogService.getStatistic(new Date('2020-01-01'), new Date('2021-01-01'));
            expect(findStatistic).toHaveBeenCalled();
        });

        test('findStatistic called once to year', async () => {
            await jogService.getStatistic(new Date('2020-01-01'), new Date('2020-11-31'));
            expect(findStatistic).toHaveBeenCalledTimes(1);
            jest.clearAllMocks();
            await jogService.getStatistic(new Date('2020-01-01'), new Date('2021-11-31'));
            expect(findStatistic).toHaveBeenCalledTimes(2);
            jest.clearAllMocks();
            await jogService.getStatistic(new Date('2019-01-01'), new Date('2021-11-31'));
            expect(findStatistic).toHaveBeenCalledTimes(3);
        });

        test('weeks counting from 1', async () => {
            const result = await jogService.getStatistic(new Date('2020-01-01'), new Date('2020-11-31'));
            expect(result[0].week).toBe(1);
        });

        test('weeks are counted correctly by year', async () => {
            const result = await jogService.getStatistic(new Date('2019-01-01'), new Date('2021-11-31'));
            expect(result.length).toBe(3);
            expect(result[0].week).toBe(1);
            expect(result[1].week).toBe(1 + 54);
            expect(result[2].week).toBe(1 + 54 * 2);
        });


        afterEach(() => {
            jest.clearAllMocks();
        });

    });

});