import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Unified Gallery route handlers with safe fallbacks when DB is unavailable
export async function GET() {
  try {
    const rows = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Database connection error (GET /api/gallery):", error);
    // Return empty list so UI can render without crashing
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (error: any) {
    console.error("Database connection error (POST /api/gallery):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  try {
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
  } catch (error: any) {
    console.error("Database connection error (PUT /api/gallery):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Database connection error (DELETE /api/gallery):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}

