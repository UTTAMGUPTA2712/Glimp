
import { NextRequest, NextResponse } from "next/server";

const appVersion = process.env.APP_VERSION || "1.0.0";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Version route body: ', body);
        
        if(!body || !body.version) {
            return NextResponse.json(
                { error: 'Missing version in request body' },
                { status: 400 }
            );
        }
        console.log('Version route body: ', body);
        if(body.version === appVersion) {
            return NextResponse.json({
                success: true,
                message: 'App version is up to date',
            });
        } else {
            return NextResponse.json(
                { error: 'App version is outdated' },
                { status: 426 } // 426 Upgrade Required
            );
        }

    } catch (error) {
        console.error('Version route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({
        version: appVersion,
    });
}