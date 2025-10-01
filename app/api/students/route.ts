import { NextRequest, NextResponse } from "next/server";
import prisma, { prisma as namedPrisma } from "../../../lib/prisma";

// Unified Students route handlers
export async function GET() {
  // Prefer stable ordering by regNo, then programme
  const rows = await prisma.student.findMany({ orderBy: [{ regNo: "asc" }, { programme: "asc" }] });
  return NextResponse.json(rows);
}

// Upsert single or multiple students by (regNo, programme)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const payload = Array.isArray(body) ? body : [body];
  const results: any[] = [];
  for (const s of payload) {
    if (!s?.regNo || !s?.programme) continue;
    const upserted = await prisma.student.upsert({
      where: { regNo_programme: { regNo: s.regNo, programme: s.programme } },
      update: {
        surname: s.surname ?? null,
        firstName: s.firstName ?? null,
        middleName: s.middleName ?? null,
        gender: s.gender ?? null,
        school: s.school ?? null,
      },
      create: {
        regNo: s.regNo,
        programme: s.programme,
        surname: s.surname ?? null,
        firstName: s.firstName ?? null,
        middleName: s.middleName ?? null,
        gender: s.gender ?? null,
        school: s.school ?? null,
      },
    });
    results.push(upserted);
  }
  return NextResponse.json(results, { status: 201 });
}

// Bulk replace all students
export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!Array.isArray(body)) return NextResponse.json({ error: "Expected array" }, { status: 400 });
  await prisma.$transaction([
    prisma.student.deleteMany({}),
    prisma.student.createMany({
      data: body
        .map((s: any) => ({
          regNo: String(s.regNo || "").trim(),
          surname: s.surname || null,
          firstName: s.firstName || null,
          middleName: s.middleName || null,
          gender: s.gender || null,
          school: s.school || null,
          programme: s.programme || null,
        }))
        .filter((s: any) => s.regNo && s.programme),
    }),
  ]);
  const rows = await prisma.student.findMany({ orderBy: [{ regNo: "asc" }, { programme: "asc" }] });
  return NextResponse.json(rows);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regNo = searchParams.get("regNo");
  const programme = searchParams.get("programme");
  if (!regNo || !programme) return NextResponse.json({ error: "regNo and programme required" }, { status: 400 });
  await prisma.student.delete({ where: { regNo_programme: { regNo, programme } } });
  return NextResponse.json({ ok: true });
}

// Update a student's profile by (regNo, programme)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const regNo = String(body?.regNo || "").trim();
  const programme = String(body?.programme || "").trim();
  if (!regNo || !programme) {
    return NextResponse.json({ error: "regNo and programme are required" }, { status: 400 });
  }
  const data: any = {
    surname: body?.surname ?? undefined,
    firstName: body?.firstName ?? undefined,
    middleName: body?.middleName ?? undefined,
    gender: body?.gender ?? undefined,
    school: body?.school ?? undefined,
    email: body?.email ?? undefined,
    permanentAddress: body?.permanentAddress ?? undefined,
    residentialAddress: body?.residentialAddress ?? undefined,
    phone: body?.phone ?? undefined,
    homeTown: body?.homeTown ?? undefined,
    state: body?.state ?? undefined,
    lga: body?.lga ?? undefined,
    dateOfBirth: body?.dateOfBirth ?? undefined,
    bloodGroup: body?.bloodGroup ?? undefined,
    genotype: body?.genotype ?? undefined,
    disability: body?.disability ?? undefined,
    nextOfKinName: body?.nextOfKinName ?? undefined,
    nextOfKinAddress: body?.nextOfKinAddress ?? undefined,
    nextOfKinPhone: body?.nextOfKinPhone ?? undefined,
    nextOfKinEmail: body?.nextOfKinEmail ?? undefined,
    nextOfKinRelationship: body?.nextOfKinRelationship ?? undefined,
    avatarDataUrl: body?.avatarDataUrl ?? undefined,
  };
  // Remove undefined so Prisma doesn't overwrite with null
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  const updated = await prisma.student.update({
    where: { regNo_programme: { regNo, programme } },
    data,
  });
  return NextResponse.json(updated);
}


