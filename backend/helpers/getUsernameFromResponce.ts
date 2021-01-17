import {Response} from 'express';
import {getAccessTokenFromResponse} from './tokens';
import * as authService from '../services/auth.service';

export default function getUsernameFromResponse(res: Response) {
    const accessToken = getAccessTokenFromResponse(res);
    let username: string | undefined;
    if (accessToken)
        ({username} = authService.decode(accessToken!)!.payload);
    return username;
}