"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function useHandleSignUp() {
  const { isSignedIn } = useUser();
  const { openSignUp } = useClerk();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      // already logged in → redirect somewhere else
      router.push("/videos"); // your predefined URL
    } else {
      // not logged in → open signup
      openSignUp();
    }
  };

  return handleClick;
}
