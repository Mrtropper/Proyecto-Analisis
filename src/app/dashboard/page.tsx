"use client";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black p-8">

      <div className="rounded-2xl border border-neutral-300 bg-white shadow-xl p-8 max-w-sm w-full flex flex-col items-center">

        <p className="mb-4 text-center text-sm text-neutral-600">
          Si lees esto no se como llegaste aquí yippy
        </p>

        <Image
          src="/img/Glados.gif"
          alt="Emoji animado"
          width={200}
          height={200}
          className="object-contain mb-6"
        />

        {/* BOTÓN */}
        <Link
          href="/"
          className="mt-4 w-full text-center bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold py-2 rounded-xl"
        >
          Volver al inicio
        </Link>

      </div>

    </main>
  );
}

