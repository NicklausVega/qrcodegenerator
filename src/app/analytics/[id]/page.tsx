import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQRCode, getQRCodeAnalytics } from "@/lib/qr-codes";
import AnalyticsContent from "@/components/analytics/AnalyticsContent";

interface AnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Await params before accessing its properties
  const { id } = await params;

  try {
    // Get the QR code data using server-side function
    const qrCode = await getQRCode(id);
    
    // Verify ownership and existence
    if (!qrCode) {
      redirect("/qr-not-found");
    }

    // Get analytics data
    const analytics = await getQRCodeAnalytics(id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <AnalyticsContent qrCode={qrCode} initialAnalytics={analytics} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching QR code:", error);
    redirect("/dashboard");
  }
} 