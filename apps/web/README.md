# Jobs At Conf Web

The web-app code for jobs-at-conf demo.

> This project is bootstraped using the [nextjs-r2-demo template](https://github.com/harshil1712/nextjs-r2-demo).

The web app contains the following routes:

- [/](./app/page.tsx): Fetches the list of jobs from the database and renders it on the page
- [/upload](./app/upload/page.tsx): Allows you to upload the image of the job poster
- [/jobs/{slug}](./app/jobs/[slug]/page.tsx): Fetches the poster from the R2 bucket and the corresponding data from D1. Renders this on the page
- [/api/upload](./app/api/upload/route.ts): Handles the uploading of the image to R2. It uses the [Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/) to upload the image.
- [/api/ai](./app/api/ai/route.ts): Uses [Worker AI](https://developers.cloudflare.com/workers-ai/) to extract the information from the image. It also stores the extraced information into the D1 database.
- [/api/download](./app/api/download/route.ts): Uses the Workers API to fetch the image from the R2 bucket.

## Getting Started

### Install dependencies

Install the dependencies from the root of the repo using the following command:

```sh
$ npm install
```

### Create an R2 bucket

Execute the following command to create a new R2 bucket.

```sh
$ npx wrangler r2 bucket create <NAME>
```

Replace `<NAME>` with the name of your bucket.

In the [`wrangler.toml`](./wrangler.toml) file, update the value of `bucket_name` with `<NAME>`.

### Create a D1 database

Next, create a D1 database using the following command:

```sh
$ npx wrangler d1 create <NAME>
```

Replace `<NAME>` with the name of your database.

In the [`wrangler.toml`](./wrangler.toml) file, update the values of `database_name` and `database_id` with the name and ID displayed in the terminal.

### Create a table

Create a table in your newly created database. Execute the following command to create a table based on the schema available [here](./schemas/schema.sql).

```sh
$ cd ./apps/web
$ npx wrangler d1 execute <DATABASE_NAME> --file=./schemas/schema.sql
```

Replace `<DATABASE_NAME>` with the name of your database.

### Run development server

Execute the following command from the root directory, to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In development, the Queues are not triggered. Hence, you have to manually call the `/api/ai` endpoint. In production, when the image upload is complete, this is handled by the queue.

## Production

### Configure CORS

You will need to configure the CORS policies to be able to access the objects in your R2 bucket. Use the CORS policy available in the `cors.json` file.

> **Note:** You have to update `AllowedOrigins` with the production domain.

You add this CORS policy to your bucket via the Dashboard. You can find the steps to do that in [the documentation](https://developers.cloudflare.com/r2/buckets/cors/#add-cors-policies-from-the-dashboard).

### Create a table for production db

You need to create a table for your production(remote) database. To do so, execute the following command:

```sh
$ cd ./apps/web
$ npx wrangler d1 execute <DATABASE_NAME> --file=./schemas/schema.sql --remote
```
