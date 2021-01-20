import {NextFunction, Request, Response, RequestHandler} from 'express';

export default function handleErrorAsyncMiddleware(func: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}