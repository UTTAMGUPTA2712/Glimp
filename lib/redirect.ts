import { log } from "console";

/**
 * Handles device registration redirection with optional custom redirect URL
 * @param deviceToken - The device token to be included in the redirect URL
 * @param redirectUrl - Optional custom redirect URL
 */
export async function handleDeviceRedirect(deviceToken: string, redirectUrl?: string) {
    const params = new URLSearchParams();
    params.append("device_token", deviceToken);
    console.log("hit here");

    if (redirectUrl) {
        const url = new URL(redirectUrl);
        url.searchParams.append("device_token", deviceToken);
        const response = await fetch(url.toString());
        const data = await response.json();
        console.log("Redirect response data:", data);
    } else {
        const response = await fetch(`glimpai://register_device?${params.toString()}`)

        const data = await response.json();
        console.log("Redirect response data:", data);
    }
}
