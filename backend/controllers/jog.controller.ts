import {Router} from 'express';
import * as jogService from '../services/jog.service';
import getUsernameFromResponse from '../helpers/getUsernameFromResponce';
import objectIdSchema from '../validateSchemas/objectId.validateSchema';
import jogSchema from '../validateSchemas/jog.validateSchema';
import dateRangeRequiredSchema from '../validateSchemas/dateRangeRequired.validateSchema';
import dateRangeSchema from '../validateSchemas/dateRange.validateSchema';

const router = Router();

router.post('/', async (req, res) => {
    const username = getUsernameFromResponse(res)!;
    if (jogSchema.validate(req.body).error)
        return res.sendStatus(400);

    const {date, distance, time} = req.body;
    const jog = await jogService.create({username, date, distance, time});
    res.json(jog);
});

router.get('/', async (req, res) => {
    const username = getUsernameFromResponse(res)!;

    if (dateRangeSchema.validate(req.query).error)
        return res.sendStatus(400);

    const {from, to} = req.query;
    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    if (from) fromDate = new Date(from as string);
    if (to) toDate = new Date(to as string);
    const jogs = await jogService.getMany(username, fromDate, toDate);
    res.json(jogs);
});

router.get('/statistic', async (req, res) => {
    if (dateRangeRequiredSchema.validate(req.query).error)
        return res.sendStatus(400);
    const {from, to} = req.query;
    let fromDate = new Date(from as string);
    let toDate = new Date(to as string);
    const jogsStatistic = await jogService.getStatistic(fromDate, toDate);
    res.json(jogsStatistic);
});

router.get('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    if (objectIdSchema.validate(jogId).error)
        return res.sendStatus(400);

    const jog = await jogService.findById(jogId);
    if (!jog)
        return res.sendStatus(404);
    res.json(jog);
});

router.post('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    if (objectIdSchema.validate(jogId).error)
        return res.sendStatus(400);

    if (jogSchema.validate(req.body).error)
        return res.sendStatus(400);

    if (!await jogService.findById(jogId))
        return res.sendStatus(404);

    const {date, distance, time} = req.body;
    const updatedJog = await jogService.update(jogId, {date, distance, time});
    res.json(updatedJog);
});

router.delete('/:jogId', async (req, res) => {
    const username = getUsernameFromResponse(res);
    const {jogId} = req.params;
    if (objectIdSchema.validate(jogId).error)
        return res.sendStatus(400);

    const jog = await jogService.findById(jogId);
    if (!jog)
        return res.sendStatus(404);
    if (jog.username !== username)
        return res.sendStatus(403);

    await jogService.removeById(jogId);
    res.sendStatus(200);
});

export default router;