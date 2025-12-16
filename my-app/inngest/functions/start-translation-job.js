import { inngest } from "@/lib/inngest.js";

export const startTranslation = inngest.createFunction(
  { id: "start-translation" },
  { event: "translation/start" },
  async ({ event, step }) => {
    console.log("function run");
    // get the data from db

    // run the services

    // upload the video to cloudinary

    // update the video url into the job
    return { message: `Hello ${event.data.email}!` };
  }
);
