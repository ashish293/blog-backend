import aws from 'aws-sdk';
import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv'
config()

const s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
});


const upload = multer({
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb('Only JPEG, JPG, and PNG files are allowed!', false);
    }
  },
  storage: multerS3({
    s3: s3,
    bucket: 'blog-user-profile',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  }),
});
export default upload;