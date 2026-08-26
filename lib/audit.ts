import { supabase } from '@/utils/supabase';

export interface AuditLogItem {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor?: {
    email?: string;
    full_name?: string;
    role?: string;
  };
}

/**
 * Log a super admin action to Supabase audit_logs table.
 * Does not expose passwords, tokens, or sensitive information.
 */
export async function logAuditAction(
  actorUserId: string | null,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Sanitize metadata to remove any accidental keys/secrets
    const sanitizedMetadata = { ...metadata };
    delete sanitizedMetadata.password;
    delete sanitizedMetadata.token;
    delete sanitizedMetadata.secret;
    delete sanitizedMetadata.service_role;

    const { error } = await supabase.from('audit_logs').insert({
      actor_user_id: actorUserId,
      action,
      target_type: targetType || null,
      target_id: targetId || null,
      metadata: sanitizedMetadata,
    });

    if (error) {
      console.warn('Audit log write skipped or failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to record audit log:', err);
    return false;
  }
}
