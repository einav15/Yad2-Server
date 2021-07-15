const AWS = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-s3');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const bucket = process.env.S3_BUCKET;

const fileStorage = multerS3({
    s3,
    acl: 'public-read',//'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName = `media/${req.query.owner}/${req.query.listingId}/${file.originalname}`
        cb(null, fileName);
    }
});

const uploadMediaToS3 = multer({ storage: fileStorage }).single('file');

// const getMediaFromS3 = async (req, res, next) => {
//     const Key = req.query.key;

//     try {
//         const { Body } = await s3.getObject({
//             Key,
//             Bucket: bucket
//         }).promise();

//         req.imageBuffer = Body;
//         next();
//     } catch (err) {
//         console.log(err);
//     }
// };

// const deleteMediaFromS3 = async (req, res, next) => {
//     const Key = req.body.key;
//     try {
//         await s3.deleteObject({
//             Key,
//             Bucket: bucket
//         }).promise();

//         next();
//     } catch (err) {
//         res.status(404).send({
//             message: "File not found"
//         });
//     }
// };


module.exports = {
    uploadMediaToS3,
    // deleteMediaFromS3,
    // getMediaFromS3
};