import LoginForm from "../../components/auth/LoginForm";
import Link from "next/link";
import RegisteredBannerOnce from "../../components/RegisterBanner";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center bg-neutral-950 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-neutral-300">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        {/* Banner que se muestra una sola vez y limpia el query */}
        <RegisteredBannerOnce />

        <LoginForm />

        <p className="mt-6 text-center text-sm text-neutral-400">
          ¿No tienes cuenta?{" "}
          <Link className="text-sky-400 hover:underline" href="/auth/register">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
