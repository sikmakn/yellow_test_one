import {Router} from 'express';
import multer from 'multer';
import * as fileService from '../services/file.service';

const upload = multer({storage: multer.memoryStorage()});

const router = Router();

router.post('/', upload.single('file'),
    async (req, res) => {
        const fileId = await fileService.create(req.file);
        res.json(fileId);
    });

router.get('/', async (req, res) => {
    const filesInfos = await fileService.getAll();
    res.json(filesInfos);
});

router.get('/:fileId', async (req, res) => {
    const {fileId} = req.params;
    if (!await fileService.isFileExist(fileId))
        return res.sendStatus(400);
    await fileService.findFile(fileId, res);
});

export default router;