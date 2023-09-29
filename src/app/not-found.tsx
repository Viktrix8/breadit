type Props = {};

export default function NotFound({ }: Props) {
  return (
    <div className="text-center pt-40">
      <h1 className="italic font-medium text-4xl">404</h1>
      <h1 className="text-black font-bold tracking-wide">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-muted-foreground text-sm">
        Please go back and try other page.
      </p>
    </div>
  );
}
