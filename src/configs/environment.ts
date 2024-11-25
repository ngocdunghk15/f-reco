import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  rekognition: {
  },
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  }
});
