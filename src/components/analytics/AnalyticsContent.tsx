"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { QRCode, QRScan } from "@/lib/qr-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Globe, 
  Smartphone,
  Clock,
  Activity,
  ArrowLeft
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface AnalyticsContentProps {
  qrCode: QRCode;
  initialAnalytics: QRScan[];
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
  qrCode,
  initialAnalytics,
}) => {
  const scans = initialAnalytics;
  const router = useRouter();

  // Calculate analytics
  const todayScans = scans.filter(scan => {
    const scanDate = new Date(scan.scanned_at);
    const today = new Date();
    return scanDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekScans = scans.filter(scan => {
    const scanDate = new Date(scan.scanned_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return scanDate >= weekAgo;
  }).length;

  const uniqueCountries = new Set(scans.map(scan => scan.country).filter(Boolean)).size;
  const uniqueUserAgents = new Set(scans.map(scan => scan.user_agent).filter(Boolean)).size;

  // Group scans by date for chart data
  const scansByDate = scans.reduce((acc, scan) => {
    const date = format(new Date(scan.scanned_at), 'MMM dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentScans = scans.slice(0, 10);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Analytics for &quot;{qrCode.name}&quot;
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">
            Detailed scan analytics and performance metrics for your QR code
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* QR Code Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">QR Code Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">Code</p>
              <p className="font-mono text-lg font-semibold">{qrCode.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Status</p>
              <Badge variant={qrCode.is_active ? "default" : "secondary"} className="mt-1">
                {qrCode.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Created</p>
              <p className="text-lg font-semibold">{format(new Date(qrCode.created_at), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Description</p>
              <p className="text-lg">{qrCode.description || 'No description'}</p>
            </div>
            <div className="md:col-span-4">
              <p className="text-sm font-medium text-zinc-500">Redirect URL</p>
              <p className="text-lg break-all text-blue-600 font-medium">{qrCode.redirect_url}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{qrCode.scan_count}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayScans}</div>
              <p className="text-xs text-muted-foreground">Scans today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{thisWeekScans}</div>
              <p className="text-xs text-muted-foreground">Past 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uniqueCountries}</div>
              <p className="text-xs text-muted-foreground">Unique countries</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="scans" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scans">Recent Scans</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="scans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Scan Activity</CardTitle>
                <CardDescription>
                  Latest {recentScans.length} scans for this QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-zinc-400" />
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
                      No scans yet
                    </h3>
                    <p className="mt-2 text-zinc-500">
                      This QR code hasn&apos;t been scanned yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-zinc-800 shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-zinc-400" />
                            <span className="text-base font-medium">
                              {scan.country || 'Unknown'} 
                              {scan.city && `, ${scan.city}`}
                            </span>
                          </div>
                          {scan.user_agent && (
                            <p className="text-sm text-zinc-500 mt-2 truncate">
                              {scan.user_agent}
                            </p>
                          )}
                          {scan.referrer && (
                            <p className="text-sm text-blue-600 mt-1 truncate">
                              From: {scan.referrer}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-base text-zinc-500">
                            {formatDistanceToNow(new Date(scan.scanned_at), { addSuffix: true })}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {format(new Date(scan.scanned_at), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Scan Trends</CardTitle>
                <CardDescription>
                  Daily scan counts over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(scansByDate).length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="mx-auto h-12 w-12 text-zinc-400" />
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
                      No trend data
                    </h3>
                    <p className="mt-2 text-zinc-500">
                      Not enough data to show trends yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(scansByDate)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .slice(-7) // Show last 7 days
                      .map(([date, count]) => (
                        <div key={date} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                          <span className="text-base font-medium">{date}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-32 bg-zinc-200 dark:bg-zinc-600 rounded-full h-3">
                              <div 
                                className="bg-blue-600 h-3 rounded-full transition-all" 
                                style={{ 
                                  width: `${Math.max(10, (count / Math.max(...Object.values(scansByDate))) * 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-base text-zinc-600 dark:text-zinc-400 min-w-[3rem] text-right font-semibold">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Device Information</CardTitle>
                <CardDescription>
                  Devices and browsers used to scan this QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Unique Devices</h4>
                    <p className="text-4xl font-bold text-blue-600">{uniqueUserAgents}</p>
                    <p className="text-sm text-zinc-500 mt-1">Different user agents</p>
                  </div>
                  <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Geographic Reach</h4>
                    <p className="text-4xl font-bold text-green-600">{uniqueCountries}</p>
                    <p className="text-sm text-zinc-500 mt-1">Countries reached</p>
                  </div>
                </div>
                
                {scans.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium mb-4">Recent User Agents</h4>
                    <div className="space-y-3">
                      {Array.from(new Set(scans.map(s => s.user_agent).filter(Boolean))).slice(0, 8).map((ua, idx) => (
                        <div key={idx} className="text-sm text-zinc-600 dark:text-zinc-300 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                          {ua}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsContent; 