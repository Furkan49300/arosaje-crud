// aws-config.js
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIA5FTZEVN3AFJK7XD6',
    secretAccessKey: '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',
    region: 'eu-north-1'
});

const s3 = new AWS.S3();

export default s3;
