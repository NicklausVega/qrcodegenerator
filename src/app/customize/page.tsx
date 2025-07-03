import QRCodeCustomizer from "@/components/qr/QRCodeCustomizer";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles, Zap } from "lucide-react";

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-8">
            <div className="flex justify-center">
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 dark:from-purple-950 dark:to-pink-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 px-4 py-2 text-sm font-medium shadow-sm">
                <Palette className="w-3.5 h-3.5 mr-2" />
                Design Studio • Real-time Preview • Professional Export
              </Badge>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                QR Code{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    Design Studio
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full opacity-30"></div>
                </span>
              </h1>
              
              <p className="mx-auto max-w-3xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Create stunning, pixel-perfect QR codes with our advanced design studio. 
                <span className="font-medium text-slate-700 dark:text-slate-200"> Real-time preview, unlimited customization,</span> 
                and professional export options at your fingertips.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Instant Preview</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
                <Palette className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Custom Gradients</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo Integration</span>
              </div>
            </div>
          </div>

          {/* Enhanced container for the customizer */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
              <QRCodeCustomizer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 