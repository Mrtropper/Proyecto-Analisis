import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center bg-neutral-950 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-xl">
        {/* Logo/título opcional */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-neutral-300">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-neutral-400">
          ¿No tienes cuenta?{" "}
          <a className="text-sky-400 hover:underline" href="/register">
            Regístrate
          </a>
        </p>
      </div>
    </main>
  );
}
