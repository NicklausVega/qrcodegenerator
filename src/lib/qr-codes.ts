import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { QRCode, QRScan, CreateQRCodeData, UpdateQRCodeData } from './qr-types';

// Re-export types for convenience
export type { QRCode, QRScan, CreateQRCodeData, UpdateQRCodeData, QRCodeStyling } from './qr-types';

// Server-side operations
export async function getUserQRCodes(): Promise<QRCode[]> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/auth/login');
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getQRCodeByCode(code: string): Promise<QRCode | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function createQRCode(qrCodeData: CreateQRCodeData): Promise<QRCode> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Generate unique code
  const { data: codeData, error: codeError } = await supabase
    .rpc('generate_unique_code');

  if (codeError) {
    throw new Error(codeError.message);
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      user_id: user.id,
      code: codeData,
      ...qrCodeData,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateQRCode(id: string, updates: UpdateQRCodeData): Promise<QRCode> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteQRCode(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('qr_codes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getQRCode(id: string): Promise<QRCode | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(error.message);
  }

  return data;
}

export async function getQRCodeAnalytics(qrCodeId: string): Promise<QRScan[]> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Verify the QR code belongs to the user
  const { data: qrCode, error: qrError } = await supabase
    .from('qr_codes')
    .select('id')
    .eq('id', qrCodeId)
    .eq('user_id', user.id)
    .single();

  if (qrError || !qrCode) {
    throw new Error('QR Code not found or access denied');
  }

  const { data, error } = await supabase
    .from('qr_scans')
    .select('*')
    .eq('qr_code_id', qrCodeId)
    .order('scanned_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function recordQRScan(code: string, scanData: {
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
}): Promise<void> {
  const supabase = await createClient();
  
  // Get QR code info
  const { data: qrCode, error: qrError } = await supabase
    .from('qr_codes')
    .select('id')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (qrError || !qrCode) {
    throw new Error('QR Code not found or inactive');
  }

  // Record the scan
  const { error: scanError } = await supabase
    .from('qr_scans')
    .insert({
      qr_code_id: qrCode.id,
      ...scanData,
    });

  if (scanError) {
    throw new Error(scanError.message);
  }

  // Increment scan count
  const { error: updateError } = await supabase
    .from('qr_codes')
    .update({ 
      scan_count: await supabase
        .from('qr_codes')
        .select('scan_count')
        .eq('id', qrCode.id)
        .single()
        .then(({ data }) => (data?.scan_count || 0) + 1)
    })
    .eq('id', qrCode.id);

  if (updateError) {
    throw new Error(updateError.message);
  }
} 