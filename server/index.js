require('dotenv').config()
const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const cors=require('cors');
const app = express();

var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:region
});

const filename = 'waste.jpeg'
const fileContent = fs.readFileSync(filename)

const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: `${filename}.jpg`,
  Body: fileContent
}

 s3.upload(params, function (err, data) {
                console.log(data)
                if (err) {
                    throw err
                }
                console.log(`File uploaded successfully. 
                              ${data.Location}`);
            });















app.post("/uploadfile", upload.single('file'), async(req, res) => {
    console.log(req);

    if (req.file == null) {
        return res.status(400).json({ 'message': 'Please choose the file' })
     }

        var file = req.file
        console.log(file);
        // res.send(200);
        // res.sendStatus(201);

        const uploadImage=(file)=>{
            const fileStream 
                 =fs.createReadStream(file.path);

            const params = {
                Bucket: bucketName,
                Key: file.originalname,
                Body: fileStream,
            };

            s3.upload(params, function (err, data) {
                console.log(data)
                if (err) {
                    throw err
                }
                console.log(`File uploaded successfully. 
                              ${data.Location}`);
            });
        }
        uploadImage(file);
        return res.send(201)
})

// app.listen(3002);
app.listen(5000, () => {
    console.log("Server running on port 5000")
})
