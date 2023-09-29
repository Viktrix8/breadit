import Form from "./form";

type Props = {};

export default function page({ }: Props) {
  return (
    <div className="w-full bg-white rounded p-4 mt-4 shadow">
      <h2 className="font-bold text-2xl tracking-tight">Create Community</h2>
      <p className="max-w-prose text-muted-foreground">
        Think of something that clearly defines your community&apos;s purpose.
      </p>
      <Form />
    </div>
  );
}
