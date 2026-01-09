import SignInForm from "@/components/features/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Bon retour
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Gérez votre business sans perdre de temps.
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
