export async function handleDeviceRedirect(deviceToken: string, redirectUrl?: string) {
    console.log("Handling device redirect", { deviceToken, redirectUrl });

    if (!redirectUrl) {
        console.warn("No redirect URL provided, skipping window open.");
        return;
    }

    // Construct the target URL with deviceToken as query param
    const url = new URL(redirectUrl, window.location.origin);
    url.searchParams.append('deviceToken', deviceToken);
    const targetUrl = url.toString();

    // Open in a new popup window
    window.open(targetUrl, '_blank', 'width=800,height=600,menubar=no,scrollbars=yes,resizable=yes');
}