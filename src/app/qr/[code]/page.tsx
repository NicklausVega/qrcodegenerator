import { redirect } from 'next/navigation';

async function getDestinationURL(code: string): Promise<string | null> {
  // Replace this with your actual logic to fetch the destination URL
  const urlMap: Record<string, string> = {
    'abc123': 'https://example.com/page1',
    'def456': 'https://example.com/page2',
  };
  return urlMap[code] || null;
}

export default async function QRRedirectPage({ params }: { params: { code: string } }) {
  const destinationURL = await getDestinationURL(params.code);

  if (!destinationURL) {
    // Optionally, you can redirect to a 404 page or render a custom error component
    redirect('/404');
  }

  redirect(destinationURL);
}
