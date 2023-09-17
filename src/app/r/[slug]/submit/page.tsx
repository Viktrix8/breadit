import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

type Props = {
  params: {
    slug: string;
  };
};

export default function page({ params: { slug } }: Props) {
  return (
    <div>
      <h3 className="font-semibold text-lg">Create a post</h3>
      <TextEditor subredditName={slug} />
    </div>
  );
}
