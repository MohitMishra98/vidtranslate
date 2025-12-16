import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest.js";
import { startTranslation } from "@/inngest/functions/start-translation-job";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    startTranslation
  ],
});