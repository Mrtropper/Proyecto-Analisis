export default function Home() {
  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mt-2">Ir al login:</p>
      <a
        href="/auth/login"
        className="mt-3 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-black"
      >
        /auth/login
      </a>
    </main>
  );
}
