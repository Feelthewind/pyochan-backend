exports.generatePollyAudio = (text, voiceId, polly) => {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    LanguageCode: 'ko-KR'
  };

  return polly
    .synthesizeSpeech(params)
    .promise()
    .then((audio) => {
      if (audio.AudioStream instanceof Buffer) return audio;
      throw 'AudioStream is not a Buffer.';
    });
};
