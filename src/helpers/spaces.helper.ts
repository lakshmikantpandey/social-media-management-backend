import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from 'express';
import config from '../config';
import { S3Client } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import path from 'path';

const s3 = new S3Client({
	region: config.doConfig.region,
	endpoint: 'https://sgp1.digitaloceanspaces.com',
	credentials: {
		accessKeyId: config.doConfig.key,
		secretAccessKey: config.doConfig.secret
	}
});

const storage = multerS3({
	s3: s3,
	bucket: config.doConfig.bucket,
	acl: 'public-read',
	contentType: multerS3.AUTO_CONTENT_TYPE,
	key: function(req: Request, file: Express.Multer.File, cb) {
		cb(null, `${nanoid(15)}-${file.originalname}`);
	},
	metadata: function (req: Request, file: Express.Multer.File, cb) {
		cb(null, Object.assign({}, req.body));
	},
});

export const uploadImages = multer({
	storage: storage,
	fileFilter: function(req: Request, file: Express.Multer.File, cb) {
		const ext = path.extname(file.originalname);
		const exts = ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov', '.avi', '.m4v'];
		if(exts.indexOf(ext) === -1) {
            return cb(new Error(`Only (${exts.toString()}) images are allowed`));
        }
		cb(null, true);
	},
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});