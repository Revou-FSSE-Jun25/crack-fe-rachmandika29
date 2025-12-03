import MenuComposer from "@/components/MenuComposer";

export default function Page() {
  return (
    <div className="montserrat flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Explore Our Menu</h1>
          <p className="text-sm text-zinc-500">Search, filter, and order your favorites.</p>
        </div>
        <MenuComposer />
      </main>
    </div>
  );
}
