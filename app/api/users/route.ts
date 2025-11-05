import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      regNo: true,
      roleKey: true,
      roleLabel: true,
      avatarDataUrl: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, regNo, roleKey, roleLabel, avatarDataUrl, password } = body || {};

    if (!fullName || !email || !roleKey || !password) {
      return NextResponse.json(
        { error: "fullName, email, roleKey, and password are required" },
        { status: 400 }
      );
    }

    // Enforce unique email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const computedRoleLabel = roleLabel || String(roleKey)
      .toLowerCase()
      .split("_")
      .map((s: string) => s[0].toUpperCase() + s.slice(1))
      .join(" ");

    const created = await prisma.user.create({
      data: {
        fullName,
        email,
        regNo: regNo || null,
        roleKey,
        roleLabel: computedRoleLabel,
        avatarDataUrl: avatarDataUrl || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        regNo: true,
        roleKey: true,
        roleLabel: true,
        avatarDataUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, fullName, email, regNo, roleKey, roleLabel, avatarDataUrl, password } = body || {};

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (typeof fullName === "string") updateData.fullName = fullName;
    if (typeof email === "string") updateData.email = email;
    if (typeof regNo !== "undefined") updateData.regNo = regNo;
    if (typeof roleKey === "string") updateData.roleKey = roleKey;
    if (typeof roleLabel === "string") updateData.roleLabel = roleLabel;
    if (typeof avatarDataUrl !== "undefined") updateData.avatarDataUrl = avatarDataUrl;
    if (typeof password === "string" && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        regNo: true,
        roleKey: true,
        roleLabel: true,
        avatarDataUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}


