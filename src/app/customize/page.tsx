import QRCodeCustomizer from "@/components/qr/QRCodeCustomizer";

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            QR Code Customizer
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Create beautiful, customized QR codes with live preview and multiple download formats.
            Adjust colors, styles, add logos, and more.
          </p>
        </div>
        <QRCodeCustomizer />
      </div>
    </div>
  );
} 