import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        console.log("sdfsdf");
        const { deviceId, userId } = await req.json();
        console.log('deviceId, userId: ', deviceId, userId);

        if (!deviceId || !userId) {
            return NextResponse.json(
                { error: 'Missing deviceId or userId' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (data?.device_id !== deviceId) {
            return NextResponse.json(
                { error: 'Device not authorized' },
                { status: 403 }
            );
        }

        if (new Date(data?.current_period_end) < new Date()) {
            return NextResponse.json(
                { error: 'Subscription expired' },
                { status: 403 }
            );
        }

        console.log(`Verifying product for deviceId: ${deviceId}, userId: ${userId}`);

        return NextResponse.json({
            success: true,
            message: 'Product is registered',
        });
    } catch (error) {
        console.error('Verify product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}