import SignUpForm from "@/components/features/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Standardisez vos offres. Dominez votre marché.
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
