import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";

export const runtime = "edge";

async function fetchAllAudio() {
  const res = await getRequestContext()
    .env.DB.prepare("SELECT * FROM jobs ORDER BY id DESC")
    .all();
  if (res.success) {
    return res.results;
  }
  return res;
}

export default async function ListAudio() {
  const results = (await fetchAllAudio()) as any[];
  if (results?.length === 0) {
    return null;
  }
  return (
    <main className="p-6 md:p-8 lg:p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-200">
        Jobs At Conf
      </h1>
      <p className="dark:text-gray-700 mb-4">
        *the job role, description, company name, and the application link
        (email) are generated via AI. Please check the image for the correct
        details.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((job) => (
          // @ts-ignore:

          <div
            key={job.id}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
          >
            <Link href={`/jobs/${job.file_key}`}>
              <h3 className="text-lg font-medium dark:text-gray-200">
                {job?.job_role}
              </h3>
              <h4 className="font-medium mb-2 dark:text-gray-500">
                {job?.hiring_company}
              </h4>
              <div className="flex justify-center items-center">
                <img
                  src={`/api/download?filename=${job.file_key}`}
                  className="h-32 rounded-md"
                />
              </div>
              {/* <p className="text-justify dark:text-white">
              {job?.job_description}
            </p> */}
              <p className="text-justify my-2 dark:text-white">
                {job?.job_apply}
              </p>

              <p className="mt-4 dark:text-gray-500"> More details</p>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
