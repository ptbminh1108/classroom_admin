
import { useRouter } from "next/router";

import Cookie from "js-cookie";
import { useEffect } from 'react';


export function checkaccessToken() {
    const router = useRouter();
    const access_token = Cookie.get("accesstoken");

    if (access_token === undefined) {

        const access_token = Cookie.get("accesstoken")
        console.log("access token ", access_token)
        if (access_token === undefined) {

            useEffect(() => {
                router.push('/login');
            }, []);
        }
        return false;
    }
    return true;
}
export function RemoveAccessToken() {
    const router = useRouter();
    Cookie.remove("accesstoken");
    Cookie.remove("user")

    console.log("remove access token ")
    useEffect(() => {
        router.push('/login');
    }, []);

}

