import File from '../models/file';
import {GridFSBucket, MongoClient} from 'mongodb';
import {Types} from 'mongoose';
import stream from 'stream';
import {Response} from 'express';

export async function getAll() {
    return File.find({});
}

export async function findById(_id: string) {
    return File.findById(_id);
}

export async function create(file: Express.Multer.File) {
    const fileId = await createFile(file);
    const newFileModel = new File({_id: fileId, name: file.originalname, contentType: file.mimetype});
    return await newFileModel.save();

    async function createFile(file: Express.Multer.File) {
        const fileId = Types.ObjectId();
        await connectBucket(bucket => createFileByBucket(file, fileId, bucket));
        return fileId;
    }

    function createFileByBucket(file: Express.Multer.File, fileId: Types.ObjectId, bucket: GridFSBucket): Promise<void> {
        const {buffer, originalname, mimetype} = file;
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(buffer));
        const uploadStream = bucket.openUploadStreamWithId(fileId, originalname, {contentType: mimetype});
        bufferStream.pipe(uploadStream);
        return new Promise(resolve => bufferStream.on('finish', resolve))
    }
}

export async function isFileExist(fileId: string) {
    const _id = Types.ObjectId(fileId);
    return await connectBucket(bucket => bucket.find({_id}).toArray()
        .then(([fileInfo]) => !!fileInfo));
}

export async function findFile(fileId: string, response: Response) {
    const _id = Types.ObjectId(fileId);
    return await connectBucket(bucket => bucket.find({_id})
        .toArray()
        .then(([fileInfo]) => {
            if (fileInfo) return downloadFile(bucket, fileInfo);
        }));

    function downloadFile(bucket: GridFSBucket, fileInfo: any) {
        const downloadStream = bucket.openDownloadStreamByName(fileInfo.filename);
        downloadStream.pipe(response);
    }
}

async function connectBucket(cb: (bucket: GridFSBucket) => Promise<unknown>) {
    return await MongoClient.connect(process.env.MONGO_URI as string, {useUnifiedTopology: true})
        .then(client => {
            const db = client.db(process.env.MONGODB_DB_NAME);
            const bucket = new GridFSBucket(db, {bucketName: process.env.BUCKET_NAME});
            return cb(bucket);
        });
}