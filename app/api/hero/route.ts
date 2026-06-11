import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.hero.findMany({ orderBy: { slideOrder: "asc" } });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database connection error (GET /api/hero):", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.imageDataUrl) {
      return NextResponse.json({ error: "imageDataUrl required" }, { status: 400 });
    }
    if (!String(body?.heading || "").trim()) {
      return NextResponse.json({ error: "heading required" }, { status: 400 });
    }

    const created = await prisma.hero.create({
      data: {
        heading: String(body.heading).trim(),
        imageDataUrl: String(body.imageDataUrl),
        ctaText: body.ctaText ? String(body.ctaText).trim() : null,
        ctaLink: body.ctaLink ? String(body.ctaLink).trim() : null,
        slideOrder: Number(body.slideOrder) > 0 ? Number(body.slideOrder) : 1,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Database connection error (POST /api/hero):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body?.id || "").trim();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!body?.imageDataUrl) {
      return NextResponse.json({ error: "imageDataUrl required" }, { status: 400 });
    }
    if (!String(body?.heading || "").trim()) {
      return NextResponse.json({ error: "heading required" }, { status: 400 });
    }

    const updated = await prisma.hero.update({
      where: { id },
      data: {
        heading: String(body.heading).trim(),
        imageDataUrl: String(body.imageDataUrl),
        ctaText: body.ctaText ? String(body.ctaText).trim() : null,
        ctaLink: body.ctaLink ? String(body.ctaLink).trim() : null,
        slideOrder: Number(body.slideOrder) > 0 ? Number(body.slideOrder) : 1,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Database connection error (PUT /api/hero):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await prisma.hero.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Database connection error (DELETE /api/hero):", error);
    return NextResponse.json({ error: "Database unavailable. Please try again later." }, { status: 503 });
  }
}
