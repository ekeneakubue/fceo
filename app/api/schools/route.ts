import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";

export async function GET() {
  try {
    const rows = await withDatabaseRetry(() =>
      prisma.school.findMany({ orderBy: { createdAt: "desc" } })
    );
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error fetching schools:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const isConnectionError = isDatabaseConnectionError(error);
    return NextResponse.json(
      {
        error: isConnectionError
          ? "Database is waking up or unreachable. Wait a moment and try again."
          : message,
      },
      { status: isConnectionError ? 503 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const description = body?.description ? String(body.description).trim() : null;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const created = await prisma.school.create({
      data: { name, description },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating school:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body?.id || "");
    const name = String(body?.name || "").trim();
    const description = body?.description ? String(body.description).trim() : null;

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const exists = await prisma.school.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "School not found" }, { status: 404 });

    const updated = await prisma.school.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Error updating school:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const exists = await prisma.school.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "School not found" }, { status: 404 });

    await prisma.school.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Error deleting school:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
