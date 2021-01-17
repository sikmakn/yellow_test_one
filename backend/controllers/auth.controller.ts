import {Router} from 'express';

const router = Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    console.log({username, password});
    res.sendStatus(200);
});

router.post('/login', async(req,res)=>{
    const {username, password} = req.body;
    console.log({username, password});
    res.sendStatus(200);
});

export default router;