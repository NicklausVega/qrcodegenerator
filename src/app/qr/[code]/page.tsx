import { redirect } from 'next/navigation';
import { getQRCodeByCode, recordQRScan } from '@/lib/qr-codes';
import { headers } from 'next/headers';

async function getDestinationURL(code: string): Promise<string | null> {
  try {
    const qrCode = await getQRCodeByCode(code);
    
    if (!qrCode || !qrCode.is_active) {
      return null;
    }

    // Record the scan with metadata
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    const referer = headersList.get('referer') || undefined;
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || undefined;

    // Record scan asynchronously (don't wait for it)
    recordQRScan(code, {
      ip_address: ip,
      user_agent: userAgent,
      referrer: referer,
    }).catch(console.error);

    return qrCode.redirect_url;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return null;
  }
}

export default async function QRRedirectPage({ 
  params 
}: { 
  params: Promise<{ code: string }> 
}) {
  const { code } = await params;
  const destinationURL = await getDestinationURL(code);

  if (!destinationURL) {
    // Redirect to a custom 404 page for invalid QR codes
    redirect('/qr-not-found');
  }

  redirect(destinationURL);
}
