import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";
import { fromProgramTypeDb, toProgramTypeDb } from "@/lib/programs";

function formatProgram(p: {
  id: string;
  name: string;
  programType: string;
  description: string | null;
  schoolId: string | null;
  school: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const programTypeName = fromProgramTypeDb(p.programType);
  return {
    id: p.id,
    name: p.name,
    programType: programTypeName,
    programTypeName,
    level: programTypeName,
    description: p.description,
    schoolId: p.schoolId,
    schoolName: p.school?.name ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

const programInclude = {
  school: { select: { id: true, name: true } },
} as const;

export async function GET(req: NextRequest) {
  try {
    const schoolId = new URL(req.url).searchParams.get("schoolId");

    const rows = await withDatabaseRetry(() =>
      prisma.program.findMany({
        where: schoolId ? { schoolId } : undefined,
        orderBy: { name: "asc" },
        include: programInclude,
      })
    );
    return NextResponse.json(rows.map(formatProgram));
  } catch (error: unknown) {
    console.error("Error fetching programs:", error);
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
    const programType = String(body?.programType || body?.level || "NCE");
    const description = body?.description ? String(body.description).trim() : null;
    const schoolId = body?.schoolId ? String(body.schoolId) : null;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!schoolId) {
      return NextResponse.json({ error: "school is required" }, { status: 400 });
    }

    const created = await prisma.program.create({
      data: {
        name,
        programType: toProgramTypeDb(programType),
        description,
        schoolId,
      },
      include: programInclude,
    });

    return NextResponse.json(formatProgram(created), { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating program:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body?.id || "");
    const name = String(body?.name || "").trim();
    const programType = String(body?.programType || body?.level || "NCE");
    const description = body?.description ? String(body.description).trim() : null;
    const schoolId = body?.schoolId ? String(body.schoolId) : null;

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
    if (!schoolId) return NextResponse.json({ error: "school is required" }, { status: 400 });

    const exists = await prisma.program.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Program not found" }, { status: 404 });

    const updated = await prisma.program.update({
      where: { id },
      data: {
        name,
        programType: toProgramTypeDb(programType),
        description,
        schoolId,
      },
      include: programInclude,
    });

    return NextResponse.json(formatProgram(updated));
  } catch (error: unknown) {
    console.error("Error updating program:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const exists = await prisma.program.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Program not found" }, { status: 404 });

    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Error deleting program:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
