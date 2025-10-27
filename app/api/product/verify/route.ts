import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { device_id, token } = await req.json();

        if (!device_id || !token) {
            return NextResponse.json(
                { error: 'Missing device_id or token' },
                { status: 400 }
            );
        }
        const decodedToken = verifyToken(token) as any;

        if (decodedToken.device_id === device_id) {
            return NextResponse.json({
                success: true,
                message: 'Product is registered',
            });
        }else{
            return NextResponse.json(
                { error: 'Device ID does not match token' },
                { status: 403 }
            );
        }
    } catch (error) {
        console.error('Verify product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}