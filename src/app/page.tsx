import Image from "next/image";
import Link from "next/link";
import ServerQRCodeGen from "@/components/qr/ServerQRCodeGen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  QrCode, 
  BarChart3, 
  Palette, 
  Download, 
  Users, 
  Zap, 
  Shield, 
  Github,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  TrendingUp,
  Lock,
  Globe,
  Cpu,
  Layers
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 px-4 py-2 text-sm font-medium shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Open Source • Free Forever • Trusted by 10k+ developers
              </Badge>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Generate{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    QR Codes
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full opacity-30"></div>
                </span>
                <br />
                That Actually{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Convert
                </span>
              </h1>
              
              <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Create stunning, trackable QR codes with enterprise-grade analytics. 
                <span className="font-medium text-slate-700 dark:text-slate-200"> Beautiful designs meet powerful insights</span> 
                in the most advanced open-source QR platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/25 border-0 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-blue-500/30">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/customize">
                <Button variant="outline" size="lg" className="px-10 py-6 text-lg font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Palette className="mr-2 h-5 w-5" />
                  Try Live Demo
                </Button>
              </Link>
              
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="lg" className="px-10 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Github className="mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">View on</span> GitHub
                </Button>
              </a>
            </div>

            {/* Enhanced Hero QR Code Examples */}
            <div className="pt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="group border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-semibold">Minimalist</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Clean & Professional</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-8">
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl">
                      <ServerQRCodeGen 
                        data="https://your-qr-app.com/demo1" 
                        width={160}
                        height={160}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-semibold">Branded</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Logo Integration</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-8">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                      <ServerQRCodeGen 
                        data="https://your-qr-app.com/demo2" 
                        width={160}
                        height={160}
                        image="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-semibold">Gradient</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Modern & Colorful</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-8">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                      <ServerQRCodeGen 
                        data="https://your-qr-app.com/demo3" 
                        width={160}
                        height={160}
                        dotsColor="#8b5cf6"
                        backgroundColor="#faf5ff"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">10M+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">QR Codes Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">50K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">99.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">24/7</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Global Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 px-4 py-2">
              <TrendingUp className="w-3.5 h-3.5 mr-2" />
              Enterprise Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Built for the{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                future of QR
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Enterprise-grade features that scale from startup to Fortune 500. 
              Everything you need to create, track, and optimize QR code campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">Advanced Customization</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create pixel-perfect QR codes with custom gradients, shapes, patterns, and brand integration. 
                  Real-time preview with AI-powered design suggestions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">Real-time Analytics (WIP)</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track every scan with detailed metrics: location, device, browser, referrer. 
                  AI-powered insights and conversion optimization recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">AI-Powered Generation (Soon)</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Leverage machine learning for optimal QR code design and placement. 
                  Auto-optimization for maximum scannability across all devices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Download className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">Multi-format Export</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Export in PNG, SVG, PDF, EPS with custom resolutions up to 8K. 
                  Batch processing and API integration for workflow automation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">Team Collaboration (Soon)</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Collaborative workspaces with role-based permissions, brand guidelines, 
                  and approval workflows. Enterprise SSO and audit logs included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-rose-50/50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold mb-3">Enterprise Security</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  SOC 2 Type II compliant with end-to-end encryption, GDPR compliance, 
                  and enterprise-grade security. Your data stays secure, always.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Open Source Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 backdrop-blur-sm">
                <Github className="w-4 h-4 mr-2" />
                100% Open Source • MIT License
              </Badge>
              
              <h2 className="text-4xl sm:text-5xl font-black mb-8 leading-tight">
                Built by the{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  community
                </span>
                ,<br />
                for the community
              </h2>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Join over 50,000 developers who trust our open-source QR platform. 
                <span className="text-white font-semibold"> Fork, customize, contribute</span> — 
                or use our hosted version with zero setup required.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">MIT License</div>
                    <div className="text-slate-400 text-sm">Use commercially without limits</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Self-hostable</div>
                    <div className="text-slate-400 text-sm">Full control over your data</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Active Community</div>
                    <div className="text-slate-400 text-sm">24/7 support & contributions</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layers className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Modern Stack</div>
                    <div className="text-slate-400 text-sm">Next.js, TypeScript, Tailwind</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://github.com/NicklausVega/qrcodegenerator" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300">
                    <Github className="mr-2 h-5 w-5" />
                    View Source Code
                  </Button>
                </a>
                <Link href="/docs">
                  <Button size="lg" variant="ghost" className="px-8 py-4 text-white hover:bg-white/10 rounded-xl font-semibold transition-all duration-300">
                    Documentation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Ready to start?</h3>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>
                
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Join thousands of developers building the future of QR technology. 
                  Start with our free tier or deploy your own instance.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <QrCode className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Unlimited QR code generation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Real-time analytics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Palette className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Advanced customization tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Lock className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Enterprise-grade security</span>
                  </div>
                </div>
                
                <Link href="/auth/sign-up">
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105">
                    Start Building Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Transform your business with{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              intelligent QR codes
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 businesses already using our platform to create, track, and optimize 
            QR code campaigns that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                View Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-950 text-white py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                QR Generator
              </h3>
              <p className="text-slate-400 mb-8 max-w-md text-lg leading-relaxed">
                The world's most advanced open-source QR code platform. 
                Trusted by developers and enterprises worldwide.
              </p>
              <div className="flex space-x-6">
                <a href="https://github.com" className="text-slate-400 hover:text-white transition-colors duration-300">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/customize" className="hover:text-white transition-colors duration-300">QR Designer</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors duration-300">Analytics</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors duration-300">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors duration-300">API Access</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors duration-300">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Resources</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/support" className="hover:text-white transition-colors duration-300">Support</Link></li>
                <li><a href="https://github.com/NicklausVega/qrcodegenerator" className="hover:text-white transition-colors duration-300">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-400">
            <p>&copy; 2025 QR Generator. Open source under MIT License.</p>
            <p className="text-sm mt-4 sm:mt-0">Built with ❤️ by Nicklaus Vega</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 