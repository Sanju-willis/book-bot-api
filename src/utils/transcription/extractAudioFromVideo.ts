import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { Readable, PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath!);

export const extractAudioFromVideo = (videoBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = new PassThrough();

    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);

    ffmpeg(Readable.from(videoBuffer))
      .format("mp3")
      .on("error", reject)
      .pipe(stream, { end: true });
  });
};
