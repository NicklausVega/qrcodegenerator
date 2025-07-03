import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, QrCode } from "lucide-react";

export default function QRNotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
            QR Code Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-600 dark:text-zinc-300">
              The QR code you&apos;re looking for doesn&apos;t exist or has been deactivated.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This could happen if the QR code was deleted or the link is incorrect.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                My QR Codes
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              If you believe this is an error, please contact the QR code owner.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 