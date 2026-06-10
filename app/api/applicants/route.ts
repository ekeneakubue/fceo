import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";
import { fromProgramTypeDb, toProgramTypeDb } from "@/lib/programs";

const applicantInclude = {
  school: { select: { id: true, name: true } },
  program: { select: { id: true, name: true, programType: true } },
} as const;

function formatApplicant(a: {
  id: string;
  applicationNo: string;
  avatarDataUrl: string | null;
  surname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string | null;
  dateOfBirth: string | null;
  maritalStatus: string | null;
  address: string | null;
  countryOfOrigin: string | null;
  stateOfOrigin: string | null;
  localGovernmentOfOrigin: string | null;
  homeTown: string | null;
  schoolId: string | null;
  programId: string | null;
  programType: string | null;
  status: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  school: { id: string; name: string } | null;
  program: { id: string; name: string; programType: string } | null;
}) {
  return {
    id: a.id,
    applicationNo: a.applicationNo,
    avatarDataUrl: a.avatarDataUrl,
    surname: a.surname,
    firstName: a.firstName,
    lastName: a.lastName,
    fullName: `${a.surname} ${a.firstName} ${a.lastName}`.trim(),
    email: a.email,
    phone: a.phone,
    gender: a.gender,
    dateOfBirth: a.dateOfBirth,
    maritalStatus: a.maritalStatus,
    address: a.address,
    countryOfOrigin: a.countryOfOrigin,
    stateOfOrigin: a.stateOfOrigin,
    localGovernmentOfOrigin: a.localGovernmentOfOrigin,
    homeTown: a.homeTown,
    schoolId: a.schoolId,
    schoolName: a.school?.name ?? null,
    programId: a.programId,
    programName: a.program?.name ?? null,
    programType: a.programType ? fromProgramTypeDb(a.programType) : null,
    status: a.status,
    submittedAt: a.submittedAt,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

async function generateApplicationNo(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FCEO/APP/${year}/`;
  const count = await prisma.applicant.count({
    where: { applicationNo: { startsWith: prefix } },
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

export async function GET() {
  try {
    const rows = await withDatabaseRetry(() =>
      prisma.applicant.findMany({
        orderBy: { submittedAt: "desc" },
        include: applicantInclude,
      })
    );
    return NextResponse.json(rows.map(formatApplicant));
  } catch (error: unknown) {
    console.error("Error fetching applicants:", error);
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
    const surname = String(body?.surname || "").trim();
    const firstName = String(body?.firstName || "").trim();
    const lastName = String(body?.lastName || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const schoolId = body?.schoolId ? String(body.schoolId) : null;
    const programId = body?.programId || body?.programme ? String(body.programId || body.programme) : null;
    const programTypeRaw = body?.programType ? String(body.programType) : null;

    if (!surname || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "surname, firstName, lastName, email, and phone are required" },
        { status: 400 }
      );
    }
    if (!schoolId) {
      return NextResponse.json({ error: "school is required" }, { status: 400 });
    }
    if (!programId) {
      return NextResponse.json({ error: "program is required" }, { status: 400 });
    }
    if (!programTypeRaw) {
      return NextResponse.json({ error: "programType is required" }, { status: 400 });
    }

    const existingApplicant = await prisma.applicant.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (existingApplicant) {
      return NextResponse.json(
        { error: "An application with this email already exists." },
        { status: 409 }
      );
    }

    const applicationNo = await generateApplicationNo();
    const programType = toProgramTypeDb(programTypeRaw);

    const created = await prisma.applicant.create({
      data: {
        applicationNo,
        avatarDataUrl: body?.avatarDataUrl ? String(body.avatarDataUrl) : null,
        surname,
        firstName,
        lastName,
        email,
        phone,
        gender: body?.gender ? String(body.gender) : null,
        dateOfBirth: body?.dateOfBirth ? String(body.dateOfBirth) : null,
        maritalStatus: body?.maritalStatus ? String(body.maritalStatus) : null,
        address: body?.address ? String(body.address) : null,
        countryOfOrigin: body?.countryOfOrigin ? String(body.countryOfOrigin) : null,
        stateOfOrigin: body?.stateOfOrigin ? String(body.stateOfOrigin) : null,
        localGovernmentOfOrigin: body?.localGovernmentOfOrigin
          ? String(body.localGovernmentOfOrigin)
          : null,
        homeTown: body?.homeTown ? String(body.homeTown) : null,
        schoolId,
        programId,
        programType,
      },
      include: applicantInclude,
    });

    return NextResponse.json(formatApplicant(created), { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating applicant:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id ? String(body.id) : "";
    const status = body?.status ? String(body.status) : "";

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const exists = await prisma.applicant.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.applicant.update({
      where: { id },
      data: { status: status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" },
      include: applicantInclude,
    });

    return NextResponse.json(formatApplicant(updated));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const exists = await prisma.applicant.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    await prisma.applicant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
