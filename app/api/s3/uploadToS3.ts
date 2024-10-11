import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (text: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `text-${Date.now()}.txt`,
    Body: text,
    ContentType: 'text/plain',
  };

  const data = await s3.upload(params).promise();
 
  return data.Location; // URL del archivo subido
};
