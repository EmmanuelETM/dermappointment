import { NextResponse } from "next/server";
import { deleteExpiredLocks } from "@/actions/appointmentLock/deleteExpiredLocks";
import { env } from "@/env";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deleteExpiredLocks();
    return NextResponse.json({
      success: true,
      message: "Expired locks deleted",
      result,
    });
  } catch (err) {
    console.error("Error deleting expired appointment locks:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
