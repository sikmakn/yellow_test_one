import * as fileRepository from '../db/repositories/file.repository';
import {Response} from 'express';

export async function create(file: Express.Multer.File) {
    return fileRepository.create(file);
}

export function getAll() {
    return fileRepository.getAll();
}

export async function isFileExist(fileId: string) {
    return fileRepository.isFileExist(fileId);
}

export async function findFile(fileId: string, res: Response) {
    const {contentType} = await fileRepository.findById(fileId);
    res.set('Content-Type', contentType)
    return fileRepository.findFile(fileId, res);
}