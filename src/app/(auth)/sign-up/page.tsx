import SignUp from "@/components/sign-up";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="items-center py-64">
      <div className="bg-white text-center w-fit mx-auto p-6 rounded">
        <h2 className="font-bold text-xl tracking-wide">Welcome!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto text-center text-sm mb-3">
          By continuing, you are setting up a Reddit account and agree to our
          User Agreement and Privacy Policy.
        </p>
        <SignUp />
      </div>
    </div>
  );
}
