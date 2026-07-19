import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";

export async function GET() {
  try {
    const rows = await withDatabaseRetry(() =>
      prisma.leadership.findMany({ orderBy: { sortOrder: "asc" } })
    );
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Error fetching leadership:", error);
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
    const imageDataUrl = String(body?.imageDataUrl || "").trim();
    const fullName = String(body?.fullName || "").trim();
    const profile = body?.profile ? String(body.profile).trim() : null;
    const officeTitle = String(body?.officeTitle || body?.name || "").trim();
    const sortOrder = Number(body?.sortOrder) > 0 ? Number(body.sortOrder) : 1;

    if (!imageDataUrl) {
      return NextResponse.json({ error: "photo is required" }, { status: 400 });
    }
    if (!fullName) {
      return NextResponse.json({ error: "full name is required" }, { status: 400 });
    }
    if (!officeTitle) {
      return NextResponse.json({ error: "office / title is required" }, { status: 400 });
    }

    const created = await prisma.leadership.create({
      data: { imageDataUrl, fullName, profile, officeTitle, sortOrder },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating leadership:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body?.id || "").trim();
    const imageDataUrl = String(body?.imageDataUrl || "").trim();
    const fullName = String(body?.fullName || "").trim();
    const profile = body?.profile ? String(body.profile).trim() : null;
    const officeTitle = String(body?.officeTitle || body?.name || "").trim();
    const sortOrder = Number(body?.sortOrder) > 0 ? Number(body.sortOrder) : 1;

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!imageDataUrl) {
      return NextResponse.json({ error: "photo is required" }, { status: 400 });
    }
    if (!fullName) {
      return NextResponse.json({ error: "full name is required" }, { status: 400 });
    }
    if (!officeTitle) {
      return NextResponse.json({ error: "office / title is required" }, { status: 400 });
    }

    const exists = await prisma.leadership.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Leadership not found" }, { status: 404 });

    const updated = await prisma.leadership.update({
      where: { id },
      data: { imageDataUrl, fullName, profile, officeTitle, sortOrder },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Error updating leadership:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const exists = await prisma.leadership.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Leadership not found" }, { status: 404 });

    await prisma.leadership.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Error deleting leadership:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
