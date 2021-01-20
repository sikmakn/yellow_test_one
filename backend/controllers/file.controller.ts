import {Router} from 'express';
import multer from 'multer';
import * as fileService from '../services/file.service';
import objectIdSchema from '../validateSchemas/objectId.validateSchema';
import handleErrorAsyncMiddleware from '../helpers/handleErrorAsyncMiddleware';

const upload = multer({storage: multer.memoryStorage()});

const router = Router();

router.post('/', upload.single('file'),
    handleErrorAsyncMiddleware(async (req, res) => {
        const fileId = await fileService.create(req.file);
        res.json(fileId);
    }));

router.get('/', handleErrorAsyncMiddleware(async (req, res) => {
    const filesInfos = await fileService.getAll();
    res.json(filesInfos);
}));

router.get('/:fileId', handleErrorAsyncMiddleware(async (req, res) => {
    const {fileId} = req.params;
    if (objectIdSchema.validate(fileId).error)
        return res.sendStatus(400);
    if (!await fileService.isFileExist(fileId))
        return res.sendStatus(404);

    await fileService.findFile(fileId, res);
}));

export default router;