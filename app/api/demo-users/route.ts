import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  // Ensure a default SUPER_ADMIN exists for demo login
  const existingCount = await prisma.demoUser.count();
  if (existingCount === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.demoUser.create({
      data: {
        fullName: "Demo Super Admin",
        email: "super@fceo.local",
        regNo: "FCEO/ADMIN/0001",
        roleKey: "SUPER_ADMIN" as any,
        roleLabel: "Super Admin",
        password: hashedPassword,
      },
    });
  }
  const users = await prisma.demoUser.findMany({ 
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
      // Exclude password from response
    }
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, roleKey, roleLabel, avatarDataUrl, password, regNo } = body;

    // Validate required fields
    if (!fullName || !email || !roleKey || !password) {
      return NextResponse.json(
        { error: "fullName, email, roleKey, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.demoUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const created = await prisma.demoUser.create({
      data: {
        fullName,
        email,
        regNo: regNo || null,
        roleKey,
        roleLabel: roleLabel || roleKey
          .toLowerCase()
          .split("_")
          .map((s: string) => s[0].toUpperCase() + s.slice(1))
          .join(" "),
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
        // Exclude password from response
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error"
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, fullName, email, roleKey, roleLabel, avatarDataUrl, password, regNo } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.demoUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (regNo !== undefined) updateData.regNo = regNo;
    if (roleKey) updateData.roleKey = roleKey;
    if (roleLabel) updateData.roleLabel = roleLabel;
    if (avatarDataUrl !== undefined) updateData.avatarDataUrl = avatarDataUrl;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    // Update the user
    const updated = await prisma.demoUser.update({
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
        // Exclude password from response
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.demoUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user
    await prisma.demoUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


