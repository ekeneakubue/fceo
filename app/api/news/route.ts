import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Unified News route handlers
export async function GET() {
  const rows = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
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


