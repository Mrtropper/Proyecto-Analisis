import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // prueba conexión
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
    // prueba existencia de la tabla/columnas mapeadas
    const sample = await prisma.user.findFirst({
      select: { id: true, email: true },
    });
    return Response.json({ ok: true, ping, sample });
  } catch (e: any) {
    console.error("PING_DB_ERROR:", e);
    return Response.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}
