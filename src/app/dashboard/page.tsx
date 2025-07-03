import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserQRCodes } from "@/lib/qr-codes";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
    const supabase = await createClient();
  
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      redirect("/auth/login");
    }

    const qrCodes = await getUserQRCodes();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative">
          <DashboardContent initialQRCodes={qrCodes} />
        </div>
      </div>
    );
}