const putObject = (bucket, key, body, ContentType, s3) => s3
  .putObject({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType
  })
  .promise();

exports.writeAudioStreamToS3 = (audioStream, filename, s3) => {
  const aws_publicBucket = 'pyochan.com.polly';
  return putObject(aws_publicBucket, filename, audioStream, 'audio/mp3', s3).then((res) => {
    if (!res.ETag) throw res;
    else {
      return {
        msg: 'File successfully generated.',
        ETag: res.ETag,
        url: `https://ap-northeast-1.amazonaws.com/${aws_publicBucket}/${filename}`
      };
    }
  });
};
