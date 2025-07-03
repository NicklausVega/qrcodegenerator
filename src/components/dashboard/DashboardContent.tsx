"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QRCode, CreateQRCodeData, UpdateQRCodeData } from "@/lib/qr-types";
import { QRCodeService } from "@/lib/qr-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Plus, 
  QrCode, 
  BarChart3, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  Search,
  Calendar,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import QRCodeFormDialog from "./QRCodeFormDialog";

interface DashboardContentProps {
  initialQRCodes: QRCode[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  initialQRCodes
}) => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>(initialQRCodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Set origin only on client side
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const qrCodeService = new QRCodeService();

  // Filter QR codes based on search query
  const filteredQRCodes = qrCodes.filter(qr => 
    qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0);
  const activeQRCodes = qrCodes.filter(qr => qr.is_active).length;
  const topQRCode = qrCodes.reduce((top, current) => 
    current.scan_count > (top?.scan_count || 0) ? current : top, 
    qrCodes[0]
  );

  const handleCreateQRCode = async (qrCodeData: CreateQRCodeData) => {
    try {
      setLoading(true);
      const newQRCode = await qrCodeService.createQRCode(qrCodeData);
      setQRCodes(prev => [newQRCode, ...prev]);
      setIsCreateDialogOpen(false);
      toast.success("QR Code created successfully!");
    } catch (error) {
      toast.error("Failed to create QR code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQRCode = async (id: string, updates: UpdateQRCodeData) => {
    try {
      setLoading(true);
      const updatedQRCode = await qrCodeService.updateQRCode(id, updates);
      setQRCodes(prev => prev.map(qr => qr.id === id ? updatedQRCode : qr));
      setEditingQRCode(null);
      toast.success("QR Code updated successfully!");
    } catch (error) {
      toast.error("Failed to update QR code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQRCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;
    
    try {
      setLoading(true);
      await qrCodeService.deleteQRCode(id);
      setQRCodes(prev => prev.filter(qr => qr.id !== id));
      toast.success("QR Code deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete QR code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (qrCode: QRCode) => {
    try {
      setLoading(true);
      const updatedQRCode = await qrCodeService.updateQRCode(qrCode.id, {
        is_active: !qrCode.is_active
      });
      setQRCodes(prev => prev.map(qr => qr.id === qrCode.id ? updatedQRCode : qr));
      toast.success(`QR Code ${qrCode.is_active ? 'deactivated' : 'activated'}!`);
    } catch (error) {
      toast.error("Failed to update QR code status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyQRUrl = (code: string) => {
    if (!origin) {
      toast.error("Unable to copy URL");
      return;
    }
    const url = `${origin}/qr/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("QR URL copied to clipboard!");
  };

  const copyRedirectUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Redirect URL copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                Analytics Dashboard
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              QR Code{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Monitor performance, manage campaigns, and optimize your QR code strategy with 
              <span className="font-medium text-slate-700 dark:text-slate-200"> real-time insights and analytics</span>.
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl shadow-emerald-500/25 border-0 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create QR Code
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total QR Codes</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{qrCodes.length}</div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                {activeQRCodes} active codes
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Scans</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{totalScans.toLocaleString()}</div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                All time engagement
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">Top Performer</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{topQRCode?.scan_count || 0}</div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium truncate">
                {topQRCode?.name || 'No data yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">This Month</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {qrCodes.filter(qr => {
                  const created = new Date(qr.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                New codes created
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <Tabs defaultValue="codes" className="space-y-8">
        <TabsList className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1">
          <TabsTrigger value="codes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg font-semibold">QR Codes</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg font-semibold">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="codes" className="space-y-8">
          {/* Enhanced Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Enhanced QR Codes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode) => (
              <Card key={qrCode.id} className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden group">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{qrCode.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {qrCode.description || 'No description'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/analytics/${qrCode.id}`)}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingQRCode(qrCode)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyQRUrl(qrCode.code)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy QR URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyRedirectUrl(qrCode.redirect_url)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Copy Redirect URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(qrCode)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {qrCode.is_active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteQRCode(qrCode.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={qrCode.is_active ? "default" : "secondary"}>
                        {qrCode.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-zinc-500">
                        {qrCode.scan_count} scans
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">QR Code:</p>
                      <p className="text-blue-600 font-mono text-xs break-all">
                        {origin ? `${origin}/qr/${qrCode.code}` : `[Loading...]/qr/${qrCode.code}`}
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">Redirects to:</p>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs break-all">
                        {qrCode.redirect_url}
                      </p>
                    </div>
                    
                    <div className="text-xs text-zinc-500">
                      Created {formatDistanceToNow(new Date(qrCode.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQRCodes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No QR codes found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                {searchQuery ? 'Try adjusting your search terms or create a new QR code.' : 'Get started by creating your first QR code and begin tracking its performance.'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First QR Code
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100/50 dark:border-blue-800/50">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Overview</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Track performance and insights across all your QR codes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Detailed performance metrics, conversion tracking, and intelligent insights will be available here. 
                  Track user behavior, optimize campaigns, and maximize your QR code effectiveness.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <QRCodeFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateQRCode}
        loading={loading}
      />

      <QRCodeFormDialog
        open={!!editingQRCode}
        onOpenChange={(open: boolean) => !open && setEditingQRCode(null)}
        onSubmit={(data: CreateQRCodeData) => handleUpdateQRCode(editingQRCode!.id, data)}
        initialData={editingQRCode}
        loading={loading}
        mode="edit"
      />


    </div>
  );
};

export default DashboardContent; 