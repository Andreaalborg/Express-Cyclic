require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');

const app = express();
app.use(express.json());

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN
});

const s3 = new AWS.S3();

const bucketName = process.env.CYCLIC_BUCKET_NAME; // Endret til å bruke miljøvariabel
const fileName = 'saved_text.json';

app.post('/', async (req, res) => {
  const content = req.body.Content;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: JSON.stringify({ Content: content }),
  };

  try {
    await s3.putObject(params).promise();
    res.status(200).send('Text saved successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', async (req, res) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(params).promise();
    res.status(200).send(JSON.parse(data.Body.toString()));
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
