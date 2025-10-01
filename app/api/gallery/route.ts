import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Unified Gallery route handlers
export async function GET() {
  const rows = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.imageDataUrl) return NextResponse.json({ error: "imageDataUrl required" }, { status: 400 });
  const created = await prisma.galleryItem.create({
    data: {
      title: body.title || null,
      date: body.date || null,
      imageDataUrl: String(body.imageDataUrl),
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!Array.isArray(body)) return NextResponse.json({ error: "Expected array" }, { status: 400 });
  await prisma.$transaction([
    prisma.galleryItem.deleteMany({}),
    prisma.galleryItem.createMany({
      data: body
        .map((g: any) => ({
          title: g.title || null,
          date: g.date || null,
          imageDataUrl: String(g.imageDataUrl || ""),
        }))
        .filter((g: any) => g.imageDataUrl),
    }),
  ]);
  const rows = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


