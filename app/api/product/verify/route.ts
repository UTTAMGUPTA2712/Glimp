import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { deviceId, userId } = await req.json();

        return NextResponse.json({
            success: true,
            message: 'Product is registered',
        });
    } catch (error) {
        console.error('Get registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}