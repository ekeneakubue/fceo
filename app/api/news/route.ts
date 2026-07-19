import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";

// Unified News route handlers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const row = await withDatabaseRetry(() =>
        prisma.newsPost.findUnique({ where: { id } })
      );
      if (!row) {
        return NextResponse.json({ error: "News post not found" }, { status: 404 });
      }
      return NextResponse.json(row);
    }

    const rows = await withDatabaseRetry(() =>
      prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } })
    );
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error fetching news:", error);
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
  const body = await req.json();
  const created = await prisma.newsPost.create({
    data: {
      title: String(body?.title || "").trim() || "Untitled",
      date: body?.date || null,
      body: body?.body || null,
      imageDataUrl: body?.imageDataUrl || null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!Array.isArray(body)) return NextResponse.json({ error: "Expected array" }, { status: 400 });
  await prisma.$transaction([
    prisma.newsPost.deleteMany({}),
    prisma.newsPost.createMany({
      data: body.map((n: any) => ({
        title: String(n.title || "").trim() || "Untitled",
        date: n.date || null,
        body: n.body || null,
        imageDataUrl: n.imageDataUrl || null,
      })),
    }),
  ]);
  const rows = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


