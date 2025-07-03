export interface QRCodeStyling {
  width: number;
  height: number;
  margin: number;
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  dotsColor: string;
  dotsGradientEnabled: boolean;
  dotsGradientType: 'linear' | 'radial';
  dotsGradientRotation: number;
  dotsGradientStartColor: string;
  dotsGradientEndColor: string;
  backgroundColor: string;
  backgroundTransparent: boolean;
  backgroundGradientEnabled: boolean;
  backgroundGradientType: 'linear' | 'radial';
  backgroundGradientRotation: number;
  backgroundGradientStartColor: string;
  backgroundGradientEndColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  hideBackgroundDots: boolean;
  imageSize: number;
  imageMargin: number;
}

export interface QRCode {
  id: string;
  user_id: string;
  code: string;
  name: string;
  description?: string;
  redirect_url: string;
  styling: QRCodeStyling;
  image_url?: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface QRScan {
  id: string;
  qr_code_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  scanned_at: string;
}

export interface CreateQRCodeData {
  name: string;
  description?: string;
  redirect_url: string;
  styling: QRCodeStyling;
  image_url?: string;
}

export interface UpdateQRCodeData {
  name?: string;
  description?: string;
  redirect_url?: string;
  styling?: QRCodeStyling;
  image_url?: string;
  is_active?: boolean;
} 