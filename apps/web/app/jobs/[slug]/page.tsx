import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

async function fetchJob(fileName: string) {
  const res = (await getRequestContext()
    .env.DB.prepare("SELECT * FROM jobs WHERE file_key=?")
    .bind(fileName)
    .run()) as any;
  if (res.success) {
    return res.results[0];
  }
  return res;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const job = await fetchJob(slug);
  return (
    <main className="p-6 md:p-8 lg:p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-200">
        {job?.job_role}
      </h1>
      <h2 className="text-lg  mb-4 dark:text-gray-200">
        {job?.hiring_company}
      </h2>
      <div className="flex justify-center items-center">
        <img
          src={`/api/download?filename=${job.file_key}`}
          className="w-2/3 rounded-md"
          alt={`Hiring poster by ${job?.hiring_company}`}
        />
      </div>
      <p className="mt-4 dark:text-gray-200 text-justify">
        {job.job_description}
      </p>
      <p className="mt-4 dark:text-gray-200 text-justify">{job?.job_apply}</p>
    </main>
  );
}
