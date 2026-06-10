import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDatabaseConnectionError, withDatabaseRetry } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const email = new URL(req.url).searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const existing = await withDatabaseRetry(() =>
      prisma.applicant.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true },
      })
    );

    return NextResponse.json({ exists: Boolean(existing) });
  } catch (error: unknown) {
    console.error("Error checking applicant email:", error);
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
