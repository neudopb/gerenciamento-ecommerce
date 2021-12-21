require('dotenv').config();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, tmpFolder);
        },
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, file.key);
            });
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'image-upload-neudo',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                const filename = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, filename);
            });
        },
    }),
}

const tmpFolder = path.resolve(__dirname, '..', 'tmp');

module.exports = {
    dest: tmpFolder,
    storage: storageTypes[process.env.STORAGE_TYPE],
    fileFilter: (req, file, callback) => {
        const allowwedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif",
        ];

        if (allowwedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Bad Request - Tipo de arquivo invalido"));
        }
    }
};