"use client";
import { useEffect, useState } from "react";
import { CodeRenderer } from "./renderers/code-renderer";
import { Loader2 } from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: string;
}

const renderers = {
  code: CodeRenderer,
};

export default function EditorjsOutput({ data, ...props }: Props) {
  const [Output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOutput() {
      const importedOutput = await import("editorjs-react-renderer");
      setOutput(() => importedOutput.default);
      setLoading(false);
    }

    loadOutput();
  }, []);

  return (
    <div className="editorjs" {...props}>
      {loading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <Output data={{ blocks: JSON.parse(data) }} renderers={renderers} />
      )}
    </div>
  );
}
