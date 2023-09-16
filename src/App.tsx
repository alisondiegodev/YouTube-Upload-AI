import { Button } from "./components/ui/button";
import { Github, Wand2 } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import VideoInputForm from "./components/ui/video-input-form";
import PromptSelect from "./components/ui/prompt-select";
import { useState } from "react";
import { useCompletion } from "ai/react";

export function App() {
  const [temperature, setTemperature] = useState<number>(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-type": "application/json",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-muted-foreground">
            Desenvolvido por @alisondiegodev em evento da Rocketseat
          </span>
          <Separator className="h-6" orientation="vertical" />
          <Button>
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>
      <main className="flex-1 bg-slate-900 p-6 flex gap-6 ">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Inclua o prompt para a IA"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Resultado gerado pela IA"
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se você pode utilizar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> para
            adicionar o conteúdo da transcrição no video selecionado.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />
          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5"> GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs italic text-muted-foreground ">
                Você poderá customizar esta opção em breve
              </span>
            </div>

            <Separator />
            <div className="space-y-4">
              <Label>Temperatura</Label>

              <Slider
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                className="cursor-pointer"
                min={0}
                max={1}
                step={0.1}
              />

              <span className="block text-xs italic text-muted-foreground leading-relaxed ">
                Temperaturas maiores trazem resultados mais criativos, porém com
                possíveis erros.
              </span>
            </div>

            <SelectSeparator />

            <Button disabled={isLoading} className="w-full" type="submit">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
