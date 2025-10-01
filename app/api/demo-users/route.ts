import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  // Ensure a default SUPER_ADMIN exists for demo login
  const existingCount = await prisma.demoUser.count();
  if (existingCount === 0) {
    await prisma.demoUser.create({
      data: {
        fullName: "Demo Super Admin",
        email: "super@fceo.local",
        regNo: "FCEO/ADMIN/0001",
        roleKey: "SUPER_ADMIN" as any,
        roleLabel: "Super Admin",
        password: "admin123",
      },
    });
  }
  const users = await prisma.demoUser.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.demoUser.create({ data: body });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = await prisma.demoUser.update({ where: { id: body.id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.demoUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


