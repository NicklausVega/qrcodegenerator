import { NextRequest, NextResponse } from "next/server";
import { createQRCode, getUserQRCodes } from "@/lib/qr-codes";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const qrCodes = await getUserQRCodes();
    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, redirect_url, styling, image_url } = body;

    if (!name || !redirect_url) {
      return NextResponse.json(
        { error: "Name and redirect URL are required" },
        { status: 400 }
      );
    }

    const qrCode = await createQRCode({
      name,
      description,
      redirect_url,
      styling: styling || {
        width: 300,
        height: 300,
        margin: 10,
        dotsType: "rounded",
        dotsColor: "#000000",
        dotsGradientEnabled: false,
        dotsGradientType: "linear",
        dotsGradientRotation: 0,
        dotsGradientStartColor: "#000000",
        dotsGradientEndColor: "#666666",
        backgroundColor: "#ffffff",
        backgroundTransparent: false,
        backgroundGradientEnabled: false,
        backgroundGradientType: "linear",
        backgroundGradientRotation: 0,
        backgroundGradientStartColor: "#ffffff",
        backgroundGradientEndColor: "#f0f0f0",
        errorCorrectionLevel: "Q",
        hideBackgroundDots: true,
        imageSize: 0.4,
        imageMargin: 20,
      },
      image_url: image_url || undefined,
    });

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json(
      { error: "Failed to create QR code" },
      { status: 500 }
    );
  }
} 