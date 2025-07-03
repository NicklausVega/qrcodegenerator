import Image from "next/image";
import ServerQRCodeGen from "@/components/qr/ServerQRCodeGen";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">QR Code Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Server-side QR code generation with custom styling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Basic QR Code */}
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Basic QR Code</h3>
            <ServerQRCodeGen 
              data="https://nextjs.org" 
              width={200}
              height={200}
              className="mb-4"
            />
            <p className="text-sm text-gray-500 text-center">Next.js Website</p>
          </div>

          {/* QR Code with Logo */}
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">QR Code with Logo</h3>
            <ServerQRCodeGen 
              data="https://vercel.com" 
              width={200}
              height={200}
              image="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png"
              className="mb-4"
            />
            <p className="text-sm text-gray-500 text-center">Vercel with Logo</p>
          </div>

          {/* Custom Styled QR Code */}
          <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Custom Colors</h3>
            <ServerQRCodeGen 
              data="https://github.com" 
              width={200}
              height={200}
              dotsColor="#24292e"
              backgroundColor="#f6f8fa"
              className="mb-4"
            />
            <p className="text-sm text-gray-500 text-center">GitHub Colors</p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/customize"
          >
            🎨 Customize QR Codes
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
