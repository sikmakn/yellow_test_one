import {Router} from 'express';
import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import {setTokens} from '../helpers/tokens';

const router = Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    if (await userService.isExist(username))
        res.sendStatus(422);

    await userService.create(username, password);
    res.sendStatus(201);
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!await userService.validate(username, password))
        return res.sendStatus(400);

    const tokens = await authService.createToken(username);
    setTokens({...tokens, res});

    res.sendStatus(200);
});

export default router;