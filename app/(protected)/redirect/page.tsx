import { useEffect } from "react";

export default function Page(){
    useEffect(() => {
        const deviceToken = localStorage.getItem("device_token");
        if (deviceToken) {
            // Open App while sending this token to the app
            const params = new URLSearchParams();
            params.append("device_token", deviceToken);
            window.location.href = `glimpai://register_device?${params.toString()}`;
        }
    }, []);
    return <div >Redirecting...</div>;
}