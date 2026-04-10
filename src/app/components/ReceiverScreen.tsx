import { useState, useEffect, useRef } from 'react';

interface ReceiverScreenProps {
  onBack: () => void;
  scenario: 'payment' | 'confirmation';
  simulateError: boolean;
}

type Flow = 'phone-entry' | 'otp-verify' | 'payment-required' | 'confirmation-only';
type AsyncState = 'idle' | 'loading' | 'error';

const MOCK_DELIVERY = {
  id: 'DEL-7823',
  route: 'Lagos → Abuja',
  category: 'Backpack',
  pickupLandmark: 'Ikeja City Mall',
  dropoffLandmark: 'Jabi Lake Mall',
  amount: 5200,
  senderPhone: '080****5432',
};

export function ReceiverScreen({ onBack, scenario, simulateError }: ReceiverScreenProps) {
  const [flow, setFlow] = useState<Flow>('phone-entry');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSendState, setOtpSendState] = useState<AsyncState>('idle');
  const [otpVerifyState, setOtpVerifyState] = useState<AsyncState>('idle');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpManualEntry, setOtpManualEntry] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Payment
  const [paymentState, setPaymentState] = useState<AsyncState>('idle');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Confirmation
  const [deliveryCode, setDeliveryCode] = useState(['', '', '', '']);
  const [codeAttempts, setCodeAttempts] = useState(0);
  const [codeLocked, setCodeLocked] = useState(false);
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [confirmState, setConfirmState] = useState<AsyncState>('idle');
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  // Issue panel
  const [showIssuePanel, setShowIssuePanel] = useState(false);
  const [issueCategory, setIssueCategory] = useState<string | null>(null);
  const [issueSubmitState, setIssueSubmitState] = useState<AsyncState>('idle');
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueTrackingId, setIssueTrackingId] = useState<string | null>(null);

  // OTP manual entry handler
  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpManualEntry];
    next[index] = value;
    setOtpManualEntry(next);
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
    // Auto-verify when complete
    if (next.every(d => d !== '')) {
      handleOtpVerify(next.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpManualEntry[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpVerify = async (code: string) => {
    if (otpAttempts >= 3) {
      setOtpVerifyState('error');
      return;
    }
    setOtpVerifyState('loading');
    await new Promise(r => setTimeout(r, 800));
    if (simulateError || code !== '123456') {
      setOtpVerifyState('error');
      setOtpAttempts(prev => prev + 1);
      setOtpManualEntry(['', '', '', '', '', '']);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
      return;
    }
    setOtpVerifyState('idle');
    setFlow(scenario === 'payment' ? 'payment-required' : 'confirmation-only');
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10 || otpSendState === 'loading' || otpAttempts >= 3) return;
    setOtpSendState('loading');
    setOtpManualEntry(['', '', '', '', '', '']);
    await new Promise(r => setTimeout(r, 900));
    if (simulateError) {
      setOtpSendState('error');
      return;
    }
    setOtpSendState('idle');
    setOtpAttempts(prev => prev + 1);
    setFlow('otp-verify');
  };

  const handleRetryOtp = () => {
    setOtpSendState('idle');
    setOtpVerifyState('idle');
    setOtpManualEntry(['', '', '', '', '', '']);
    setFlow('phone-entry');
  };

  const handlePayment = async () => {
    if (paymentState === 'loading') return;
    setPaymentState('loading');
    setShowIssuePanel(false);
    await new Promise(r => setTimeout(r, 1000));
    if (simulateError) {
      setPaymentState('error');
      return;
    }
    setPaymentState('idle');
    setPaymentSuccess(true);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...deliveryCode];
    next[index] = value;
    setDeliveryCode(next);
    if (value && index < 3) {
      codeRefs[index + 1].current?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !deliveryCode[index] && index > 0) {
      codeRefs[index - 1].current?.focus();
    }
  };

  const codeComplete = deliveryCode.every(d => d !== '');

  const handleConfirmReceipt = async () => {
    if (!codeComplete || confirmState === 'loading' || codeLocked) return;
    const enteredCode = deliveryCode.join('');

    setConfirmState('loading');
    setShowIssuePanel(false);
    await new Promise(r => setTimeout(r, 1000));

    // Simulate wrong code (production: validate against backend)
    if (simulateError || enteredCode !== '1234') {
      setConfirmState('error');
      setCodeAttempts(prev => prev + 1);
      // Lock after 3 attempts
      if (codeAttempts >= 2) {
        setCodeLocked(true);
      } else {
        setDeliveryCode(['', '', '', '']);
        setTimeout(() => codeRefs[0].current?.focus(), 100);
      }
      return;
    }

    setConfirmState('idle');
    setConfirmSuccess(true);
  };

  const handleIssueSubmit = async () => {
    if (!issueCategory || issueSubmitState === 'loading') return;
    setIssueSubmitState('loading');
    await new Promise(r => setTimeout(r, 800));
    if (simulateError) {
      setIssueSubmitState('error');
      return;
    }
    setIssueSubmitState('idle');
    setIssueSubmitted(true);
    setIssueTrackingId(`ISS-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowIssuePanel(false);
  };

  // ── Shared layout wrapper ────────────────────────────────────────────────
  const Wrap = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-white">
      <div className="max-w-[480px] mx-auto">
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#d8d8d8]">
          <button onClick={onBack} className="text-[#555] text-sm underline underline-offset-2 active:text-[#222]">
            ← Back
          </button>
          <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
        </header>
        <main className="px-4 py-6">{children}</main>
      </div>
    </div>
  );

  // ── FLOW 1: Phone Entry ──────────────────────────────────────────────────
  if (flow === 'phone-entry') {
    return (
      <Wrap>
        <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Receiver</p>
        <h1 className="text-[#111] text-[19px] mb-2" style={{ fontWeight: 400 }}>Access Delivery</h1>
        <p className="text-[#888] text-sm mb-8">Enter your phone number to access your delivery</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[#666] text-[12px] uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="080 000 0000"
              className="w-full h-12 px-4 bg-[#fafafa] border-2 border-[#d8d8d8] rounded text-[#111] text-sm focus:border-[#1a1a1a] focus:outline-none transition-colors"
              disabled={otpSendState === 'loading'}
            />
          </div>

          {/* Error state — OTP failed to send */}
          {otpSendState === 'error' && (
            <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
              <p className="text-[#555] text-[12px] mb-2">
                Couldn't send OTP. Check your number and try again.
              </p>
              <button
                onClick={() => setOtpSendState('idle')}
                className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          <button
            onClick={handleSendOtp}
            disabled={phoneNumber.length < 10 || otpSendState === 'loading' || otpAttempts >= 3}
            className={`w-full py-4 rounded text-sm transition-colors ${
              otpSendState === 'loading'
                ? 'bg-[#555] text-white cursor-default'
                : otpAttempts >= 3
                ? 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                : phoneNumber.length >= 10
                ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
            }`}
          >
            {otpSendState === 'loading' ? 'Sending...' : otpAttempts >= 3 ? 'Max attempts reached' : 'Send OTP'}
          </button>

          {otpAttempts > 0 && otpAttempts < 3 && (
            <p className="text-[#aaa] text-[11px] text-center mt-2">
              {3 - otpAttempts} {3 - otpAttempts === 1 ? 'attempt' : 'attempts'} remaining
            </p>
          )}

          <div className="border border-[#e8e8e8] rounded px-4 py-3 bg-[#fafafa]">
            <p className="text-[#aaa] text-[12px] leading-snug">
              Payment secured until delivery is confirmed by you.
            </p>
          </div>
        </div>
      </Wrap>
    );
  }

  // ── FLOW 1b: OTP Verification ────────────────────────────────────────────
  if (flow === 'otp-verify') {
    return (
      <Wrap>
        <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Receiver</p>
        <h1 className="text-[#111] text-[19px] mb-2" style={{ fontWeight: 400 }}>Verify OTP</h1>
        <p className="text-[#888] text-sm mb-8">
          6-digit code sent to {phoneNumber.replace(/(\d{3})(\d+)(\d{4})/, '$1****$3')}
        </p>

        <div className="space-y-4">
          {/* OTP manual entry boxes */}
          <div>
            <label className="block text-[#666] text-[12px] uppercase tracking-wider mb-3">
              Enter 6-Digit OTP
            </label>
            <div className="flex gap-2 justify-center mb-2">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpManualEntry[i]}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  disabled={otpAttempts >= 3 || otpVerifyState === 'loading'}
                  className={`w-11 h-14 text-center bg-[#fafafa] border-2 rounded text-[#111] text-lg focus:outline-none transition-colors ${
                    otpManualEntry[i]
                      ? 'border-[#1a1a1a]'
                      : otpVerifyState === 'loading'
                      ? 'border-[#555]'
                      : 'border-[#d8d8d8]'
                  } focus:border-[#1a1a1a]`}
                />
              ))}
            </div>
            <p className="text-[#bbb] text-[11px] text-center">
              Demo: use <span className="text-[#888]">123456</span> to proceed
            </p>
          </div>

          {otpVerifyState === 'loading' && (
            <p className="text-[#888] text-[12px] text-center">Verifying...</p>
          )}

          {otpVerifyState === 'error' && otpAttempts < 3 && (
            <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
              <p className="text-[#555] text-[12px] mb-2">
                Incorrect code. {3 - otpAttempts} {3 - otpAttempts === 1 ? 'attempt' : 'attempts'} remaining.
              </p>
            </div>
          )}

          {otpAttempts >= 3 && (
            <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
              <p className="text-[#555] text-[12px] mb-2">
                Maximum attempts reached. Request a new OTP to continue.
              </p>
              <button
                onClick={handleRetryOtp}
                className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
              >
                Request New OTP
              </button>
            </div>
          )}

          {otpAttempts < 3 && (
            <>
              <button
                onClick={handleSendOtp}
                disabled={otpSendState === 'loading'}
                className="w-full text-[#999] text-[12px] underline underline-offset-2 active:text-[#666]"
              >
                {otpSendState === 'loading' ? 'Sending...' : 'Resend OTP'}
              </button>
              <button
                onClick={handleRetryOtp}
                className="w-full text-[#bbb] text-[12px] underline underline-offset-2"
              >
                Change phone number
              </button>
            </>
          )}
        </div>
      </Wrap>
    );
  }

  // ── FLOW 2: Payment Required ─────────────────────────────────────────────
  if (flow === 'payment-required') {
    if (paymentSuccess) {
      return (
        <Wrap>
          <div className="border-2 border-[#1a1a1a] rounded-lg p-6 mb-6">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-full mb-5" />
            <p className="text-[#111] text-[17px] mb-2" style={{ fontWeight: 500 }}>Payment Confirmed</p>
            <p className="text-[#666] text-sm leading-snug mb-4">
              Delivery is now active. A verified traveler will be matched shortly.
            </p>
            <div className="space-y-2 text-sm border border-[#e8e8e8] rounded p-4 bg-[#fafafa]">
              <div className="flex justify-between">
                <span className="text-[#888]">Delivery ID</span>
                <span className="text-[#111]">{MOCK_DELIVERY.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Amount paid</span>
                <span className="text-[#111]">₦{MOCK_DELIVERY.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Status</span>
                <span className="text-[#111]">Active</span>
              </div>
            </div>
          </div>
          <p className="text-[#aaa] text-[12px] leading-snug px-1">
            Funds held in escrow. Released to traveler only after you confirm receipt.
          </p>
        </Wrap>
      );
    }

    return (
      <Wrap>
        <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Receiver</p>
        <h1 className="text-[#111] text-[19px] mb-2" style={{ fontWeight: 400 }}>Payment Required</h1>
        <p className="text-[#888] text-sm mb-8">Complete payment to activate your delivery</p>

        {/* Delivery Summary — read-only */}
        <div className="border-2 border-[#d8d8d8] rounded-lg p-5 mb-6">
          <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-3">Delivery Summary</p>
          <div className="space-y-2.5 text-sm">
            {[
              { label: 'Delivery ID', value: MOCK_DELIVERY.id },
              { label: 'Route', value: MOCK_DELIVERY.route },
              { label: 'Category', value: MOCK_DELIVERY.category },
              { label: 'Pickup', value: MOCK_DELIVERY.pickupLandmark },
              { label: 'Drop-off', value: MOCK_DELIVERY.dropoffLandmark },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-[#888]">{row.label}</span>
                <span className="text-[#222]">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e8e8] pt-2.5 mt-1 flex justify-between">
              <span className="text-[#111]" style={{ fontWeight: 500 }}>Amount Due</span>
              <span className="text-[#111]" style={{ fontWeight: 500 }}>
                ₦{MOCK_DELIVERY.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Escrow notice */}
        <div className="bg-[#f8f8f8] border border-[#e8e8e8] rounded px-4 py-3 mb-4">
          <p className="text-[#888] text-[12px] leading-snug">
            Payment is held in escrow. Funds are only released to the traveler after you confirm receipt of this delivery.
          </p>
        </div>

        {/* Pay CTA */}
        {paymentState === 'loading' ? (
          <div className="w-full bg-[#555] text-white py-4 rounded text-sm text-center mb-4">
            Processing payment...
          </div>
        ) : (
          <button
            onClick={handlePayment}
            className="w-full bg-[#1a1a1a] text-white py-4 rounded text-sm active:bg-[#333] transition-colors mb-4"
          >
            Pay & Activate Delivery
          </button>
        )}

        {/* Payment error */}
        {paymentState === 'error' && (
          <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa] mb-4">
            <p className="text-[#555] text-[12px] mb-2">
              Payment couldn't be processed. Your delivery details are unchanged.
            </p>
            <button
              onClick={handlePayment}
              className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Report Issue — inline expansion, no modal */}
        {!issueSubmitted ? (
          <>
            <button
              onClick={() => setShowIssuePanel(p => !p)}
              className="w-full text-[#aaa] text-[12px] underline underline-offset-2"
            >
              Report an Issue
            </button>

            {showIssuePanel && (
              <div className="mt-3 border border-[#d0d0d0] rounded p-4 bg-[#fafafa]">
                <p className="text-[#444] text-[13px] mb-3" style={{ fontWeight: 500 }}>Report Issue</p>
                <div className="space-y-2 mb-4">
                  {['Wrong item or route', 'Did not order this', 'Suspicious request'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setIssueCategory(cat)}
                      className={`w-full px-4 py-3 border-2 rounded text-left text-[13px] transition-colors ${
                        issueCategory === cat
                          ? 'border-[#1a1a1a] bg-[#f0f0f0] text-[#111]'
                          : 'border-[#d8d8d8] bg-white text-[#444]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleIssueSubmit}
                    disabled={!issueCategory || issueSubmitState === 'loading'}
                    className={`flex-1 py-3 rounded text-[13px] transition-colors ${
                      issueSubmitState === 'loading'
                        ? 'bg-[#555] text-white cursor-default'
                        : issueCategory
                        ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                        : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                    }`}
                  >
                    {issueSubmitState === 'loading' ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => { setShowIssuePanel(false); setIssueCategory(null); }}
                    className="flex-1 bg-white border border-[#d0d0d0] text-[#555] py-3 rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {issueSubmitState === 'error' && (
                  <p className="text-[#888] text-[12px] mt-2 text-center">
                    Couldn't submit. Try again.
                  </p>
                )}
              </div>
            )}
          </>
        ) : issueTrackingId ? (
          <div className="border border-[#e8e8e8] rounded px-4 py-3 bg-[#fafafa]">
            <p className="text-[#888] text-[12px] leading-snug mb-1">
              Issue reported. Our team will review within 24 hours.
            </p>
            <p className="text-[#aaa] text-[11px]">
              Tracking ID: <span className="text-[#666]">{issueTrackingId}</span>
            </p>
          </div>
        ) : null}
      </Wrap>
    );
  }

  // ── FLOW 3: Confirmation Only (Already Paid) ─────────────────────────────
  if (flow === 'confirmation-only') {
    if (confirmSuccess) {
      return (
        <Wrap>
          <div className="border-2 border-[#1a1a1a] rounded-lg p-6 mb-6">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-full mb-5" />
            <p className="text-[#111] text-[17px] mb-2" style={{ fontWeight: 500 }}>Delivery Confirmed</p>
            <p className="text-[#666] text-sm leading-snug mb-4">
              Receipt confirmed. Funds have been released to the traveler.
            </p>
            <div className="space-y-2 text-sm border border-[#e8e8e8] rounded p-4 bg-[#fafafa]">
              <div className="flex justify-between">
                <span className="text-[#888]">Delivery ID</span>
                <span className="text-[#111]">{MOCK_DELIVERY.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Status</span>
                <span className="text-[#111]">Completed</span>
              </div>
            </div>
          </div>
          <p className="text-[#aaa] text-[12px] px-1">
            This delivery is now closed. Escrow released.
          </p>
        </Wrap>
      );
    }

    return (
      <Wrap>
        <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Receiver</p>
        <h1 className="text-[#111] text-[19px] mb-2" style={{ fontWeight: 400 }}>Confirm Delivery</h1>
        <p className="text-[#888] text-sm mb-8">
          Enter the 4-digit delivery code to release funds to the traveler
        </p>

        {/* Delivery status — read-only */}
        <div className="border-2 border-[#d8d8d8] rounded-lg p-5 mb-6">
          <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-3">Delivery Status</p>
          <div className="space-y-2.5 text-sm">
            {[
              { label: 'Delivery ID', value: MOCK_DELIVERY.id },
              { label: 'Route', value: MOCK_DELIVERY.route },
              { label: 'Status', value: 'In Transit' },
              { label: 'From', value: MOCK_DELIVERY.senderPhone },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-[#888]">{row.label}</span>
                <span className="text-[#222]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4-digit delivery code input */}
        <div className="mb-6">
          <label className="block text-[#666] text-[12px] uppercase tracking-wider mb-3">
            4-Digit Delivery Code
          </label>
          <div className="flex gap-3 justify-center mb-2">
            {[0, 1, 2, 3].map(i => (
              <input
                key={i}
                ref={codeRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={deliveryCode[i]}
                onChange={e => handleCodeInput(i, e.target.value)}
                onKeyDown={e => handleCodeKeyDown(i, e)}
                className={`w-14 h-16 text-center bg-[#fafafa] border-2 rounded text-[#111] text-xl focus:outline-none transition-colors ${
                  deliveryCode[i] ? 'border-[#1a1a1a]' : 'border-[#d8d8d8]'
                } focus:border-[#1a1a1a]`}
              />
            ))}
          </div>
          <p className="text-[#bbb] text-[11px] text-center">
            Provided by the traveler at drop-off
          </p>
        </div>

        {/* Irreversibility notice */}
        <div className="bg-[#f8f8f8] border border-[#e8e8e8] rounded px-4 py-3 mb-4">
          <p className="text-[#888] text-[12px] leading-snug">
            Confirming receipt permanently releases funds from escrow. Only confirm if you have received the parcel.
          </p>
        </div>

        {/* Attempt counter */}
        {codeAttempts > 0 && codeAttempts < 3 && !codeLocked && (
          <div className="mb-3 bg-[#f8f8f8] border border-[#e8e8e8] rounded px-4 py-2">
            <p className="text-[#888] text-[12px]">
              {3 - codeAttempts} {3 - codeAttempts === 1 ? 'attempt' : 'attempts'} remaining
            </p>
          </div>
        )}

        {/* Confirm CTA */}
        {confirmState === 'loading' ? (
          <div className="w-full bg-[#555] text-white py-4 rounded text-sm text-center mb-4">
            Confirming...
          </div>
        ) : (
          <button
            onClick={handleConfirmReceipt}
            disabled={!codeComplete || codeLocked}
            className={`w-full py-4 rounded text-sm mb-4 transition-colors ${
              codeLocked
                ? 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                : codeComplete
                ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
            }`}
          >
            {codeLocked ? 'Code locked — Contact support' : 'Confirm Receipt'}
          </button>
        )}

        {/* Confirm error */}
        {confirmState === 'error' && !codeLocked && (
          <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa] mb-4">
            <p className="text-[#555] text-[13px] mb-1" style={{ fontWeight: 500 }}>
              Incorrect delivery code
            </p>
            <p className="text-[#888] text-[12px] mb-2 leading-snug">
              {codeAttempts >= 2
                ? 'Final attempt used. Code is now locked. Contact support to resolve.'
                : `Check the code with your traveler and try again. ${3 - codeAttempts} ${3 - codeAttempts === 1 ? 'attempt' : 'attempts'} remaining.`}
            </p>
          </div>
        )}

        {codeLocked && (
          <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa] mb-4">
            <p className="text-[#555] text-[13px] mb-1" style={{ fontWeight: 500 }}>
              Code entry locked
            </p>
            <p className="text-[#888] text-[12px] leading-snug">
              Maximum attempts exceeded. For security, this delivery code is now locked. Contact support with delivery ID {MOCK_DELIVERY.id}.
            </p>
          </div>
        )}

        {/* Report Issue — inline expansion, no modal */}
        {!issueSubmitted ? (
          <>
            <button
              onClick={() => setShowIssuePanel(p => !p)}
              className="w-full text-[#aaa] text-[12px] underline underline-offset-2"
            >
              Report an Issue
            </button>

            {showIssuePanel && (
              <div className="mt-3 border border-[#d0d0d0] rounded p-4 bg-[#fafafa]">
                <p className="text-[#444] text-[13px] mb-3" style={{ fontWeight: 500 }}>Report Issue</p>
                <div className="space-y-2 mb-4">
                  {['Wrong item received', 'Item damaged', 'Did not receive parcel'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setIssueCategory(cat)}
                      className={`w-full px-4 py-3 border-2 rounded text-left text-[13px] transition-colors ${
                        issueCategory === cat
                          ? 'border-[#1a1a1a] bg-[#f0f0f0] text-[#111]'
                          : 'border-[#d8d8d8] bg-white text-[#444]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleIssueSubmit}
                    disabled={!issueCategory || issueSubmitState === 'loading'}
                    className={`flex-1 py-3 rounded text-[13px] transition-colors ${
                      issueSubmitState === 'loading'
                        ? 'bg-[#555] text-white cursor-default'
                        : issueCategory
                        ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                        : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                    }`}
                  >
                    {issueSubmitState === 'loading' ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => { setShowIssuePanel(false); setIssueCategory(null); }}
                    className="flex-1 bg-white border border-[#d0d0d0] text-[#555] py-3 rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {issueSubmitState === 'error' && (
                  <p className="text-[#888] text-[12px] mt-2 text-center">Couldn't submit. Try again.</p>
                )}
              </div>
            )}
          </>
        ) : issueTrackingId ? (
          <div className="border border-[#e8e8e8] rounded px-4 py-3 bg-[#fafafa]">
            <p className="text-[#888] text-[12px] leading-snug mb-1">
              Issue reported. Our team will review within 24 hours.
            </p>
            <p className="text-[#aaa] text-[11px]">
              Tracking ID: <span className="text-[#666]">{issueTrackingId}</span>
            </p>
          </div>
        ) : null}
      </Wrap>
    );
  }

  return null;
}
