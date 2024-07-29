import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function PUT(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("filename") as string;

  const formData = await request.formData();
  const file = formData.get("file");
  try {
    await getRequestContext().env.IMAGES.put(fileName, file);
    const dbRes = await getRequestContext()
      .env.DB.prepare("INSERT INTO jobs(file_key) VALUES (?)")
      .bind(fileName)
      .run();
    if (dbRes.success) return Response.json({ status: "ok" });
    if (dbRes.error) throw new Error("Adding to DB failed");
  } catch (err) {
    console.log(err);
    return Response.json({ status: "error" });
  }
}
