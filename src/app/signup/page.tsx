import SignUp from "@/components/signupProcess";

export default function Page() {
  return (
    <div className="montserrat flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md p-6">
        <SignUp />
      </main>
    </div>
  );
}
