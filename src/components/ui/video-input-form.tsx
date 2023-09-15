import { Separator } from "@radix-ui/react-separator";
import { FileVideo } from "@phosphor-icons/react";
import { Label } from "./label";
import { Button } from "./button";
import { Upload } from "lucide-react";
import { Textarea } from "./textarea";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  async function convertVideoToAudio(video: File) {
    console.log("convert started!");

    const ffmpeg = await getFFmpeg();
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) => {
      console.log("Convert progress:" + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Convert Finished");

    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    const audioFile = await convertVideoToAudio(videoFile);

    console.log(audioFile, prompt);

    return;
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUploadVideo} action="" className="space-y-6">
      <label
        className=" relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-gray-900 "
        htmlFor="video"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0 aspect-video max-h-full"
          />
        ) : (
          <>
            <FileVideo className="h-8 w-8" />
            Selecione um video
          </>
        )}
      </label>
      <input
        type="file"
        name="video"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por virgula (,)"
        />
      </div>
      <Button type="submit" className="w-full">
        Carregar Vídeo <Upload className="ml-2 w-4" />
      </Button>
    </form>
  );
}
