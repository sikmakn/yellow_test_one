import {Router} from 'express';
import * as jogService from '../services/jog.service';
import getUsernameFromResponse from '../helpers/getUsernameFromResponce';

const router = Router();

router.post('/', async (req, res) => {
    const username = getUsernameFromResponse(res)!;
    const {date, distance, time} = req.body;
    const jog = await jogService.create({username, date, distance, time});
    res.json(jog);
});

router.get('/', async (req, res) => {
    const username = getUsernameFromResponse(res)!;
    const {from, to} = req.query;
    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    if (from) fromDate = new Date(from as string);
    if (to) toDate = new Date(to as string);
    const jogs = await jogService.getMany(username, fromDate, toDate);
    res.json(jogs);
});

router.get('/statistic', async (req, res) => {
    const {from, to} = req.query;
    let fromDate = new Date(from as string);
    let toDate = new Date(to as string);
    const jogsStatistic = await jogService.getStatistic(fromDate, toDate);
    res.json(jogsStatistic);
});

router.get('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    const jog = await jogService.findById(jogId);
    if (!jog)
        return res.sendStatus(404);
    res.json(jog);
});

router.post('/:jogId', async (req, res) => {
    const {jogId} = req.params;

    if (!await jogService.findById(jogId))
        return res.sendStatus(404);

    const {date, distance, time} = req.body;
    const updatedJog = await jogService.update(jogId, {date, distance, time});
    res.json(updatedJog);
});

router.delete('/:jogId', async (req, res) => {
    const username = getUsernameFromResponse(res);
    const {jogId} = req.params;
    const jog = await jogService.findById(jogId);
    if (!jog)
        return res.sendStatus(404);
    if (jog.username !== username)
        return res.sendStatus(403);

    await jogService.removeById(jogId);
    res.sendStatus(200);
});

export default router;