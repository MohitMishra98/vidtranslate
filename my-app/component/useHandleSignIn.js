"use client"

import {useUser, useClerk} from "@clerk/nextjs"
import {useRouter} from "next/navigation"

export default function useHandleSignIn(){
    const {isSignedIn} = useUser()
    const {openSignIn} = useClerk()
    const router = useRouter()

    function handleClick(){
        if(isSignedIn){
            router.push("/videos")
        } else {
            openSignIn()
        }
    }

    return handleClick
}