import { verifyWebhook } from "@clerk/nextjs/webhooks";
import User from "@/models/user.model.js";
import { connect } from "@/db/index.js";
import { NextResponse } from "next/server";

connect();

// dont thorw error 
// because on error the webhook will keep retrying and may cause more issues
// error should only be thrown when inavlid webhook signature is received

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const email =
        evt.data.email_addresses[0].email_address || "example@gmail.com";
      const clerk_id = evt.data.id;
      // we can write existing user logic here but since we are using clerk we
      // do not need that

      const newUser = await User.create({
        clerkId: clerk_id,
        email: email,
      });

      console.log(newUser);
    } else if (evt.type === "user.updated") {
      console.log("update user called");
      const clerk_id = evt.data.id;
      const newEmail =
        evt.data.email_addresses[0].email_address || "example@gmail.com";

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: clerk_id },
        { email: newEmail },
        {
          new: true, // return updated document
          runValidators: true, // apply schema validation
        }
      );
      console.log(updatedUser);
      if (!updatedUser) {
        return NextResponse.json(
          { status: 500 },
          { message: "user not found" }
        );
      }

      console.log(updatedUser);
    } else if (evt.type === "user.deleted") {
      const clerk_id = evt.data.id;

      const deletedUser = await User.findOneAndDelete({ clerkId: clerk_id });

      if (!deletedUser) {
        return NextResponse.json(
          { status: 500 },
          { messsage: "user not found" }
        );
      }

      console.log(deletedUser);
    } else {
      return NextResponse.json(
        { status: 400 },
        { message: "unhandled event type" }
      );
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
