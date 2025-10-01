import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST /api/sync
// Accepts payloads for demo entities and upserts them into DB.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { users, students, news, gallery } = body || {};

    // DemoUser sync
    if (Array.isArray(users)) {
      for (const u of users) {
        await prisma.demoUser.upsert({
          where: { email: u.email || undefined },
          update: {
            fullName: u.fullName,
            regNo: u.regNo,
            roleKey: u.roleKey,
            roleLabel: u.roleLabel,
            avatarDataUrl: u.avatarDataUrl,
            password: u.password,
          },
          create: {
            fullName: u.fullName,
            email: u.email,
            regNo: u.regNo,
            roleKey: u.roleKey,
            roleLabel: u.roleLabel,
            avatarDataUrl: u.avatarDataUrl,
            password: u.password,
          },
        });
      }
    }

    // Students sync with (regNo, programme) uniqueness
    if (Array.isArray(students)) {
      for (const s of students) {
        if (!s.regNo || !s.programme) continue;
        await prisma.student.upsert({
          where: { regNo_programme: { regNo: s.regNo, programme: s.programme } },
          update: {
            surname: s.surname,
            firstName: s.firstName,
            middleName: s.middleName,
            gender: s.gender,
            school: s.school,
          },
          create: {
            regNo: s.regNo,
            programme: s.programme,
            surname: s.surname,
            firstName: s.firstName,
            middleName: s.middleName,
            gender: s.gender,
            school: s.school,
          },
        });
      }
    }

    // News sync (naive create for demo)
    if (Array.isArray(news)) {
      for (const n of news) {
        await prisma.newsPost.create({
          data: {
            title: n.title,
            date: n.date,
            body: n.body,
            imageDataUrl: n.imageDataUrl,
          },
        });
      }
    }

    // Gallery sync (naive create for demo)
    if (Array.isArray(gallery)) {
      for (const g of gallery) {
        if (!g.imageDataUrl) continue;
        await prisma.galleryItem.create({
          data: {
            title: g.title,
            date: g.date,
            imageDataUrl: g.imageDataUrl,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "sync error" }, { status: 500 });
  }
}


