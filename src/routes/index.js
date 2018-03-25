require('dotenv').config();
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage
});

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/upload', upload.single('file'), (req, res, next) => {
    const file = req.file;
    const s3AccessKey = process.env.S3_ACCESS_KEY;
    const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    aws.config.region = 'ap-northeast-2'; //Seoul
    aws.config.update({
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccessKey
    });

    const s3_params = {
      Bucket: 'sonaky47',
      Key: file.originalname,
      ACL: 'public-read',
      ContentType: file.mimetype
    };

    const s3obj = new aws.S3({ params: s3_params });
    s3obj
        .upload({ Body: file.buffer })
        .on('httpUploadProgress', function (evt) { console.log(evt); })
        .send(function (err, data) {
            var url = data.Location;
        });

    res.json({
        status: 'success'
    });
});

module.exports = router;
