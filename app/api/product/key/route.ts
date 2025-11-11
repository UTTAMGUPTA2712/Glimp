import { verifyToken } from "@/lib/jwt";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const productKey = process.env.PRODUCT_KEY!;

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body = await req.json();
        console.log("Request body:", body);

        const deviceId = body.device_id ?? body.deviceId;
        let userId = body.user_id ?? body.userId;
        const token = body.token;
        console.log("Device id", deviceId);



        // deviceId is always required; userId may come from token
        if (!deviceId) {
            return NextResponse.json(
                { error: "Missing deviceId/device_id" },
                { status: 400 }
            );
        }




        if (!token) {
            return NextResponse.json(
                { error: "Missing token" },
                { status: 400 }
            );
        }

        // If token provided, verify it and prefer its claims
        if (token) {
            let decoded: any;
            try {
                // verifyToken might be async — await it to be safe
                decoded = (await verifyToken(token)) as any;
                console.log("Decoded token:", decoded);
            } catch (err) {
                console.error("Token verification failed:", err);
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }

            // ensure device matches token when token includes device_id
            if (decoded.device_id && decoded.device_id !== deviceId) {
                console.log("Device ID in token does not match provided device ID:", { tokenDeviceId: decoded.device_id, providedDeviceId: deviceId });
                return NextResponse.json(
                    { error: "Invalid authenticated device" },
                    { status: 403 }
                );
            }

            // prefer user id from token when available
            if (decoded.user_id) userId = decoded.user_id;
        }

        // At this point we should have deviceId and userId (userId may come from token)
        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId" },
                { status: 400 }
            );
        }

        // fetch user from Supabase to validate device and subscription
        const { data: user, error } = await supabase
            .from("users")
            .select("id, device_id, current_period_end, status")
            .eq("id", userId)
            .single();

        if (error || !user) {
            console.error("Supabase error or user not found:", error);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // check if device_id matches
        if (user.device_id !== deviceId) {
            console.log("Device ID mismatch:", { expected: user.device_id, received: deviceId });
            return NextResponse.json(
                { error: "Device is not registered" },
                { status: 403 }
            );
        }

    

        return NextResponse.json({
            success: true,
            productKey: productKey,
        });
    } catch (error) {
        
        console.error("Verify product error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}