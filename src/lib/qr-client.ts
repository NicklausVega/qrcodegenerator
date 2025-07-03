import { createClient } from '@/lib/supabase/client';
import type { QRCode, CreateQRCodeData, UpdateQRCodeData, QRScan } from './qr-types';

export class QRCodeService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async getUserQRCodes(): Promise<QRCode[]> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async createQRCode(qrCodeData: CreateQRCodeData): Promise<QRCode> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Generate unique code
    const { data: codeData, error: codeError } = await this.supabase
      .rpc('generate_unique_code');

    if (codeError) {
      throw new Error(codeError.message);
    }

    const { data, error } = await this.supabase
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

  async updateQRCode(id: string, updates: UpdateQRCodeData): Promise<QRCode> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
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

  async deleteQRCode(id: string): Promise<void> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await this.supabase
      .from('qr_codes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getQRCode(id: string): Promise<QRCode | null> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
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

  async getQRCodeAnalytics(qrCodeId: string): Promise<QRScan[]> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Verify the QR code belongs to the user
    const { data: qrCode, error: qrError } = await this.supabase
      .from('qr_codes')
      .select('id')
      .eq('id', qrCodeId)
      .eq('user_id', user.id)
      .single();

    if (qrError || !qrCode) {
      throw new Error('QR Code not found or access denied');
    }

    const { data, error } = await this.supabase
      .from('qr_scans')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .order('scanned_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
} 