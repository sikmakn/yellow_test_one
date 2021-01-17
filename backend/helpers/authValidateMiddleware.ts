import {NextFunction, Request, Response} from 'express';
import {updateTokens} from '../services/auth.service';
import {getTokens, setTokens} from './tokens';

export default async function authValidateMiddleware(req: Request, res: Response, next: NextFunction) {
    const {accessToken, refreshToken} = getTokens(req);
    if (!refreshToken && !accessToken)
        return res.sendStatus(401).json({error: 'unauthorized'});

    const tokens = await updateTokens(refreshToken, accessToken);
    if (!tokens)
        return res.sendStatus(401).json({error: 'unauthorized'});

    setTokens({res, ...tokens});
    next();
}