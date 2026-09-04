import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { skipTask, TaskActionError } from "@/lib/routine/complete-task";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await skipTask(params.id, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof TaskActionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to skip task", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
