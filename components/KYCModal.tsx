'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, Clock, X, Upload, CreditCard, Lock } from 'lucide-react';

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KycData {
  legalName: string;
  idType: 'pan' | 'aadhaar' | 'passport';
  idNumber: string;
  bankAccount?: string;
  ifscCode?: string;
  upiId?: string;
  documentFrontName?: string;
  submittedAt?: string;
}

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycStatus: KycStatus;
  kycDetails?: KycData | null;
  onSubmitKyc: (data: KycData) => Promise<void> | void;
}

export function KYCModal({ isOpen, onClose, kycStatus, kycDetails, onSubmitKyc }: KYCModalProps) {
  const [legalName, setLegalName] = useState(kycDetails?.legalName || '');
  const [idType, setIdType] = useState<'pan' | 'aadhaar' | 'passport'>(kycDetails?.idType || 'pan');
  const [idNumber, setIdNumber] = useState(kycDetails?.idNumber || '');
  const [bankAccount, setBankAccount] = useState(kycDetails?.bankAccount || '');
  const [ifscCode, setIfscCode] = useState(kycDetails?.ifscCode || '');
  const [upiId, setUpiId] = useState(kycDetails?.upiId || '');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim()) {
      setErrorMsg('Please enter your full legal name matching your government ID.');
      return;
    }
    if (!idNumber.trim()) {
      setErrorMsg('Please enter your ID document number.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      await onSubmitKyc({
        legalName: legalName.trim(),
        idType,
        idNumber: idNumber.trim(),
        bankAccount: bankAccount.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
        documentFrontName: docFile ? docFile.name : 'id_doc_front.png',
        submittedAt: new Date().toISOString(),
      });
      setSubmitting(false);
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit KYC data.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-[var(--border2)] bg-[#111114] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--amber)]/30 bg-[var(--amber)]/10 text-[var(--amber)]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-white">KYC Verification</h2>
            <p className="text-xs text-[var(--muted)]">Required for all campaign participation &amp; escrow payouts</p>
          </div>
        </div>

        {/* Status Alert Banner */}
        {kycStatus === 'verified' && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={18} className="shrink-0" />
            <div>
              <div className="font-bold text-sm">KYC Verified</div>
              <div>Your account is fully verified! You can participate in all brand campaigns and receive payouts.</div>
            </div>
          </div>
        )}

        {kycStatus === 'pending' && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--amber)]/30 bg-[var(--amber)]/10 p-4 text-[var(--amber)] text-xs font-semibold">
            <Clock size={18} className="shrink-0" />
            <div>
              <div className="font-bold text-sm">Verification Under Review</div>
              <div>Your submitted documents are currently being processed by our compliance team.</div>
            </div>
          </div>
        )}

        {kycStatus === 'unverified' && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-300 text-xs font-semibold">
            <AlertTriangle size={18} className="shrink-0 text-amber-400" />
            <div>
              <div className="font-bold text-sm">KYC Mandatory</div>
              <div>Without completed KYC verification, campaign applications and escrow releases remain locked.</div>
            </div>
          </div>
        )}

        {kycStatus === 'rejected' && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-xs font-semibold">
            <AlertTriangle size={18} className="shrink-0" />
            <div>
              <div className="font-bold text-sm">Verification Rejected</div>
              <div>Please re-check your document details and resubmit legible government ID files.</div>
            </div>
          </div>
        )}

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Legal Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              Full Legal Name (as on ID) *
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="e.g. Aarav Mehta"
              className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--amber)]"
            />
          </div>

          {/* ID Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                ID Type *
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as any)}
                className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--amber)]"
              >
                <option value="pan">PAN Card</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                ID Number *
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder={idType === 'pan' ? 'ABCDE1234F' : '1234 5678 9012'}
                className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--amber)]"
              />
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              Upload Document Copy (Front Photo)
            </label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border2)] bg-[var(--card)] p-5 text-center transition hover:border-[var(--amber)]">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={22} className="text-[var(--amber)] mb-1.5" />
              <span className="text-xs font-semibold text-white">
                {docFile ? docFile.name : 'Click or drop government ID photo/PDF here'}
              </span>
              <span className="text-[10px] text-[var(--muted2)] mt-0.5">JPG, PNG or PDF up to 5MB</span>
            </div>
          </div>

          {/* Bank / Payout Details */}
          <div className="pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-[var(--amber)]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Escrow Payout Account</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="918239019231"
                  className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-3.5 py-2 text-xs text-white outline-none focus:border-[var(--amber)]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="HDFC0001234"
                  className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-3.5 py-2 text-xs text-white outline-none focus:border-[var(--amber)]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] text-[var(--muted)] mb-1">UPI ID (Optional for fast transfers)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-3.5 py-2 text-xs text-white outline-none focus:border-[var(--amber)]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted2)]">
              <Lock size={13} /> Encrypted 256-bit compliance data
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--amber)] px-7 py-3 text-xs font-bold text-black hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : kycStatus === 'verified' ? 'Update KYC Info' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
