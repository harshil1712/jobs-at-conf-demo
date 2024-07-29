import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("filename") as string;
  try {
    const obj = await getRequestContext().env.IMAGES.get(fileName);
    if (obj === null) {
      return new Response("Object  Not Found", { status: 404 });
    }
    const blob = await obj.arrayBuffer();
    const input = {
      image: [...new Uint8Array(blob)],
      prompt: `"Extract  the text from the image. Return the job role and the company name. Summarize the job description. Specify the application email or link. Return only the email or link. Do not hide or protect the email address or the link.  Don't format it. Return the actual email or link. If you don't find any information return null. Do not make any assumptions. Use the text from the image to generate the data. 
      The format should be the following JSON:
        {
        jobRole:
        hiringCompany:
        jobDescription:
        jobApply:
    }
        "`,
      max_tokens: 2048,
    };
    const res = await getRequestContext().env.AI.run(
      "@cf/llava-hf/llava-1.5-7b-hf",
      input
    );
    if (res.description) {
      const { jobRole, jobApply, jobDescription, hiringCompany } = JSON.parse(
        JSON.parse(JSON.stringify(res.description))
      );

      const dbRes = await getRequestContext()
        .env.DB.prepare(
          "UPDATE jobs SET job_role=?, job_description=?, hiring_company=?, job_apply=? WHERE file_key=?"
        )
        .bind(jobRole, jobDescription, hiringCompany, jobApply, fileName)
        .run();
      if (dbRes.success) {
        return Response.json({ status: "success" });
      } else {
        return new Response(JSON.stringify(dbRes.error));
      }
    } else {
      throw new Error("AI Error");
    }
  } catch (err) {
    console.error("err", err);
    return Response.json({ status: "error" });
  }
}
