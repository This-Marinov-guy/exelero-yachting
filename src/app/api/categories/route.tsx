import { Categories } from "@/app/apiData/Categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(Categories);
}
