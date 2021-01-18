import {Request, Response} from 'express';

export function setTokens({res, accessToken, refreshToken}: { res: Response, accessToken: string, refreshToken: string }) {
    res.cookie('Authorization', `Bearer ${refreshToken}`, {
        httpOnly: true,
        sameSite: 'strict'
    });
    res.set('Authorization', `Bearer ${accessToken}`);
}

export function getTokens(req: Request) {
    return {
        accessToken: getAccessToken(req),
        refreshToken: getRefreshToken(req),
    };
}

export function getAccessTokenFromResponse(res: Response) {
    const authHeader = res.getHeader('Authorization') as string;
    return authHeader?.split(' ')[1]
}

export function getRefreshToken(req: Request) {
    return req.cookies.Authorization?.split(' ')[1];
}

export function getAccessToken(req: Request) {
    return req.headers.authorization?.split(' ')[1]
}