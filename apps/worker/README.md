# Jobs At Conf Queue Worker

The queue worker code for Jobs At Conf demo. This is a consumer queue worker that gets triggered when an image gets uploaded to R2.

## Getting started

### Create a Queue

If you don't have a queue, create a new one with the following command:

```sh
npx wrangler queues create <MY-QUEUE-NAME>
```

Replace `<MY-QUEUE-NAME>` with the name of your queue.

### Update bindings

In your `wrangler.toml` file, update the name of your queue under `[[queues.consumer]]`.

### Add event notification to your bucket

To use this queue for event notification, use the below command:

```sh
$ npx wrangler r2 bucket notification create <BUCKET_NAME> --event-type <EVENT_TYPE> --queue <QUEUE_NAME>
```

Replace the values as follows:

- `<BUCKET_NAME>`: Name of the R2 bucket used to store the images
- `<EVENT_TYPE>`: `object-create`
- `<QUEUE_NAME>`: Name of the newly created queue in the previous steps

## Production

Before deploying, update the URL of the application in [`src/index.ts`](./src/index.ts).

Execute the following comand to deploy the worker.

```sh
$ cd ./apps/worker
$ npx wrangler deploy
```
