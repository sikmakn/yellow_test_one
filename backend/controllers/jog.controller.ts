import {Router} from 'express';

const router = Router();

const username = 'user1';

router.post('/', async (req, res) => {
    const {date, distance, time} = req.body;
    res.json({date, distance, time, id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"});
});

router.get('/', async(req, res)=>{
    console.log(req.query);
    const {from, to} = req.query;
    res.json([{date: Date.now(), distance: 100, id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"}])
});

router.get('/statistic', async(req,res)=>{
   console.log(req.query);
   const {from, to} = req.query;
   res.json({speed:3.2, distance: 5000, time: 700});
});

router.get('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    console.log(jogId);
    res.json({date: Date.now(), distance: 100, id: jogId});
});

router.put('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    console.log(jogId);
    res.json({date: Date.now(), distance: 100, id: jogId});
});

router.delete('/:jogId', async (req, res) => {
    const {jogId} = req.params;
    console.log(jogId);
    res.sendStatus(200);
});

export default router;