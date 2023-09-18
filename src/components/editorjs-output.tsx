import { CodeRenderer } from "./renderers/code-renderer";
import dynamic from "next/dynamic";

const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });

type Props = {
  data: string;
};

const renderers = {
  code: CodeRenderer,
};

export default function EditorjsOutput({ data }: Props) {
  return (
    <div className="editorjs">
      <Output data={{ blocks: JSON.parse(data) }} renderers={renderers} />
    </div>
  );
}
