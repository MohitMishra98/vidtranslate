import { currentUser, auth } from "@clerk/nextjs/server";
import User from "@/models/user.model.js";
import { NextResponse } from "next/server";

async function getAuthUser() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return {
      error: NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return {
      error: NextResponse.json(
        { error: "User not found in clerk" },
        { status: 404 }
      ),
    };
  }

  const existingUser = await User.findOne({
    clerkId: clerkUser.id,
  });

  if (!existingUser) {
    return {
      error: NextResponse.json(
        { error: "User not found in db" },
        { status: 404 }
      ),
    };
  }

  return {
    user: existingUser,
    clerkUser: clerkUser,
  };
}

export { getAuthUser };