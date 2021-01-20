import {Router} from 'express';
import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import {setTokens} from '../helpers/tokens';
import userValidateSchema from '../validateSchemas/user.validateSchema';
import handleErrorAsyncMiddleware from '../helpers/handleErrorAsyncMiddleware';

const router = Router();

router.post('/register', handleErrorAsyncMiddleware(async (req, res) => {
    if (userValidateSchema.validate(req.body).error)
        return res.sendStatus(400);

    const {username, password} = req.body;

    if (await userService.isExist(username))
        res.sendStatus(422);

    await userService.create(username, password);
    res.sendStatus(201);
}));

router.post('/login', handleErrorAsyncMiddleware(async (req, res) => {
    if (userValidateSchema.validate(req.body).error)
        return res.sendStatus(400);

    const {username, password} = req.body;

    if (!await userService.validate(username, password))
        return res.sendStatus(400);

    const tokens = await authService.createToken(username);
    setTokens({...tokens, res});

    res.sendStatus(200);
}));

export default router;