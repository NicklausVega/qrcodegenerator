"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import type { QRCode, QRScan } from "@/lib/qr-types";
import { QRCodeService } from "@/lib/qr-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Globe, 
  Smartphone,
  Clock,
  Activity
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface QRCodeAnalyticsDialogProps {
  qrCode: QRCode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRCodeAnalyticsDialog: React.FC<QRCodeAnalyticsDialogProps> = ({
  qrCode,
  open,
  onOpenChange,
}) => {
  const [scans, setScans] = useState<QRScan[]>([]);
  const [loading, setLoading] = useState(false);

  const qrCodeService = useMemo(() => new QRCodeService(), []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const scanData = await qrCodeService.getQRCodeAnalytics(qrCode.id);
      setScans(scanData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [qrCode.id, qrCodeService]);

  useEffect(() => {
    if (open && qrCode) {
      fetchAnalytics();
    }
  }, [open, qrCode, fetchAnalytics]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
                     <DialogTitle className="flex items-center gap-2">
             <BarChart3 className="w-5 h-5" />
             Analytics for &quot;{qrCode.name}&quot;
           </DialogTitle>
          <DialogDescription>
            Detailed scan analytics and performance metrics for your QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">Code</p>
                <p className="font-mono text-sm">{qrCode.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Status</p>
                <Badge variant={qrCode.is_active ? "default" : "secondary"}>
                  {qrCode.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Created</p>
                <p className="text-sm">{format(new Date(qrCode.created_at), 'MMM dd, yyyy')}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm font-medium text-zinc-500">Redirect URL</p>
                <p className="text-sm break-all text-blue-600">{qrCode.redirect_url}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{qrCode.scan_count}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayScans}</div>
                <p className="text-xs text-muted-foreground">Scans today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thisWeekScans}</div>
                <p className="text-xs text-muted-foreground">Past 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueCountries}</div>
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

            <TabsContent value="scans" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Scan Activity</CardTitle>
                  <CardDescription>
                    Latest {recentScans.length} scans for this QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-zinc-500">Loading analytics...</div>
                    </div>
                  ) : recentScans.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="mx-auto h-8 w-8 text-zinc-400" />
                      <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                        No scans yet
                      </h3>
                                             <p className="mt-1 text-sm text-zinc-500">
                         This QR code hasn&apos;t been scanned yet.
                       </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {recentScans.map((scan) => (
                          <div
                            key={scan.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-zinc-400" />
                                <span className="text-sm font-medium">
                                  {scan.country || 'Unknown'} 
                                  {scan.city && `, ${scan.city}`}
                                </span>
                              </div>
                              {scan.user_agent && (
                                <p className="text-xs text-zinc-500 mt-1 truncate">
                                  {scan.user_agent}
                                </p>
                              )}
                              {scan.referrer && (
                                <p className="text-xs text-blue-600 mt-1 truncate">
                                  From: {scan.referrer}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-zinc-500">
                                {formatDistanceToNow(new Date(scan.scanned_at), { addSuffix: true })}
                              </p>
                              <p className="text-xs text-zinc-400">
                                {format(new Date(scan.scanned_at), 'MMM dd, HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scan Trends</CardTitle>
                  <CardDescription>
                    Daily scan counts over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(scansByDate).length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="mx-auto h-8 w-8 text-zinc-400" />
                      <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                        No trend data
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        Not enough data to show trends yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(scansByDate)
                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                        .slice(-7) // Show last 7 days
                        .map(([date, count]) => (
                          <div key={date} className="flex items-center justify-between p-2 rounded">
                            <span className="text-sm font-medium">{date}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ 
                                    width: `${Math.max(10, (count / Math.max(...Object.values(scansByDate))) * 100)}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[2rem] text-right">
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

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Device Information</CardTitle>
                  <CardDescription>
                    Devices and browsers used to scan this QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Unique Devices</h4>
                      <p className="text-2xl font-bold">{uniqueUserAgents}</p>
                      <p className="text-sm text-zinc-500">Different user agents</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Geographic Reach</h4>
                      <p className="text-2xl font-bold">{uniqueCountries}</p>
                      <p className="text-sm text-zinc-500">Countries reached</p>
                    </div>
                  </div>
                  
                  {scans.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Recent User Agents</h4>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {Array.from(new Set(scans.map(s => s.user_agent).filter(Boolean))).slice(0, 5).map((ua, idx) => (
                            <div key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 p-2 bg-zinc-50 dark:bg-zinc-800 rounded">
                              {ua}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeAnalyticsDialog; 