"use client";
import Image from "next/image";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Fondo persistente */}
      {/* Capa 1: relleno blur cover */}
      <Image
        src="/image-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMScgaGVpZ2h0PScxJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPTEgaGVpZ2h0PTEgZmlsbD0nI2VlZWUnLz48L3N2Zz4="
        className="object-cover blur-[8px] opacity-40 scale-110"
        quality={100}
      />

      {/* Capa 2: imagen centrada (contain) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/bg-image-2.png"
          alt="Fondo musical"
          width={2560}
          height={1440}
          priority
          quality={100}
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>

      {/* Contenido de la página */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
