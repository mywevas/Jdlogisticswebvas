import { useState } from 'react';

interface SenderFlowProps {
  onBack: () => void;
  simulateError: boolean;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface StepData {
  route?: string;
  pickupLandmark?: string;
  pickupWindow?: string;
  dropoffLandmark?: string;
  category?: 'handbag' | 'backpack' | 'bulky';
  description?: string;
  valueBand?: 'low' | 'medium' | 'high';
  prohibitedConfirmed?: boolean;
  whoPays?: 'sender' | 'receiver';
}

const ROUTES = ['Lagos → Abuja', 'Abuja → Port Harcourt', 'Lagos → Ibadan', 'Kano → Abuja'];

const LANDMARKS: Record<string, string[]> = {
  'Lagos → Abuja': ['Ikeja City Mall', 'Murtala Muhammed Airport', 'VI Garden', 'Lekki Phase 1'],
  'Abuja → Port Harcourt': ['Jabi Lake Mall', 'Nnamdi Azikiwe Airport', 'Wuse Market'],
  'Lagos → Ibadan': ['VI Garden', 'Ikeja City Mall', 'Toll Gate Plaza'],
  'Kano → Abuja': ['Kano Central Market', 'Bayero University Gate'],
};

const DROPOFFS: Record<string, string[]> = {
  'Lagos → Abuja': ['Jabi Lake Mall', 'Nnamdi Azikiwe Airport', 'Wuse Market'],
  'Abuja → Port Harcourt': ['Port Harcourt Mall', 'Mile 3 Market', 'GRA Phase 2'],
  'Lagos → Ibadan': ['Cocoa Mall', 'Dugbe Market', 'UI Gate'],
  'Kano → Abuja': ['Jabi Lake Mall', 'Area 11 Market'],
};

const WINDOWS = ['Today, 2pm – 5pm', 'Today, 5pm – 8pm', 'Tomorrow, 9am – 12pm', 'Tomorrow, 2pm – 5pm', 'Tomorrow, 6am – 9am'];

export function SenderFlow({ onBack, simulateError }: SenderFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [data, setData] = useState<StepData>({});
  const [pendingEdit, setPendingEdit] = useState<Step | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(false);
  const [showAbandonWarning, setShowAbandonWarning] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateData = (newData: Partial<StepData>) => {
    setData(prev => ({ ...prev, ...newData }));
    setLastActivity(Date.now());
    setSessionWarning(false);
  };

  const canProceed = (step: Step): boolean => {
    switch (step) {
      case 1: return !!data.route;
      case 2: return !!data.pickupLandmark;
      case 3: return !!data.pickupWindow;
      case 4: return !!data.dropoffLandmark;
      case 5: return !!data.category && !!data.valueBand && data.prohibitedConfirmed === true;
      case 6: return !!data.whoPays;
      case 7: return true;
      case 8: return true;
      default: return false;
    }
  };

  const handleContinue = async () => {
    if (!canProceed(currentStep) || isLoading) return;
    setIsLoading(true);
    setNetworkError(false);
    await new Promise(r => setTimeout(r, 550));
    if (simulateError) {
      setIsLoading(false);
      setNetworkError(true);
      return;
    }
    setIsLoading(false);
    setCurrentStep(s => Math.min(s + 1, 8) as Step);
  };

  const handleRetry = () => {
    setNetworkError(false);
    handleContinue();
  };

  const handleConfirmPay = async () => {
    if (payLoading) return;
    setPayLoading(true);
    setPayError(false);
    await new Promise(r => setTimeout(r, 1000));
    if (simulateError) {
      setPayLoading(false);
      setPayError(true);
      return;
    }
    setPayLoading(false);
    setSuccessState(true);
  };

  // Step editing — clears forward data
  const initEdit = (step: Step) => {
    if (step >= currentStep || successState || isLoading) return;
    setPendingEdit(step);
  };

  const confirmEdit = (step: Step) => {
    const cleared: StepData = { ...data };
    if (step <= 1) delete cleared.route;
    if (step <= 2) delete cleared.pickupLandmark;
    if (step <= 3) delete cleared.pickupWindow;
    if (step <= 4) delete cleared.dropoffLandmark;
    if (step <= 5) { delete cleared.category; delete cleared.description; delete cleared.valueBand; delete cleared.prohibitedConfirmed; }
    if (step <= 6) delete cleared.whoPays;
    setData(cleared);
    setCurrentStep(step);
    setPendingEdit(null);
    setNetworkError(false);
    setLastActivity(Date.now());
  };

  const getInvalidatedSteps = (editStep: Step): string => {
    const steps = [];
    if (editStep <= 1) steps.push('Route', 'Pickup', 'Window', 'Drop-off', 'Parcel', 'Payment');
    else if (editStep <= 2) steps.push('Pickup', 'Window', 'Drop-off', 'Parcel', 'Payment');
    else if (editStep <= 3) steps.push('Window', 'Drop-off', 'Parcel', 'Payment');
    else if (editStep <= 4) steps.push('Drop-off', 'Parcel', 'Payment');
    else if (editStep <= 5) steps.push('Parcel', 'Payment');
    else if (editStep <= 6) steps.push('Payment');
    return steps.join(', ');
  };

  const handleBackWithWarning = () => {
    if (currentStep > 1 && !successState) {
      setShowAbandonWarning(true);
    } else {
      onBack();
    }
  };

  const calculatePrice = () => {
    let base = 1200;
    if (data.category === 'backpack') base = Math.round(base * 1.5);
    if (data.category === 'bulky') base = Math.round(base * 2.5);
    const fees = Math.round(base * 0.08);
    return { base, fees, total: base + fees };
  };

  const price = calculatePrice();
  const pickupOptions = data.route ? (LANDMARKS[data.route] || []) : [];
  const dropoffOptions = data.route ? (DROPOFFS[data.route] || []) : [];

  if (successState) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[480px] mx-auto">
          <header className="flex items-center justify-between px-4 py-4 border-b border-[#d8d8d8]">
            <div className="w-20 h-6 bg-[#c8c8c8] rounded-sm" />
            <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
          </header>
          <main className="px-4 py-12">
            <div className="border-2 border-[#1a1a1a] rounded-lg p-8">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full mb-6" />
              <p className="text-[#111] text-[17px] mb-2" style={{ fontWeight: 500 }}>
                Delivery Created
              </p>
              <p className="text-[#666] text-sm leading-snug mb-6">
                {data.whoPays === 'sender'
                  ? 'Payment confirmed. Your delivery is now active and will be matched to a traveler.'
                  : 'Delivery created. Receiver will be notified to complete payment before matching begins.'}
              </p>
              <div className="space-y-2 text-sm border border-[#e8e8e8] rounded p-4 bg-[#fafafa] mb-6">
                <div className="flex justify-between">
                  <span className="text-[#888]">Delivery ID</span>
                  <span className="text-[#111]">DEL-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Route</span>
                  <span className="text-[#111]">{data.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Parcel</span>
                  <span className="text-[#111] capitalize">{data.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Total</span>
                  <span className="text-[#111]">₦{price.total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[#aaa] text-[11px]">
                Funds held in escrow. Released to traveler only after confirmed delivery.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-[#666] text-sm underline underline-offset-2"
              >
                Return to home
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Collapsed step summary ────────────────────────────────────────────────
  const StepSummary = ({
    stepNum,
    label,
    summary,
  }: {
    stepNum: Step;
    label: string;
    summary: string;
  }) => (
    <div
      className={`border-2 border-[#d8d8d8] rounded-lg overflow-hidden cursor-pointer ${
        pendingEdit === stepNum ? 'border-[#999]' : ''
      }`}
      onClick={() => initEdit(stepNum)}
    >
      <div className="px-5 py-4 bg-[#f8f8f8] active:bg-[#f0f0f0]">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[#888] text-xs uppercase tracking-wider">{label}</p>
          <p className="text-[#bbb] text-[11px]">Edit</p>
        </div>
        <p className="text-[#444] text-sm">{summary}</p>

        {/* Inline edit warning */}
        {pendingEdit === stepNum && (
          <div
            className="mt-3 border border-[#d0d0d0] rounded bg-white p-3"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[#555] text-[12px] leading-snug mb-2">
              Editing this step will clear: <span className="text-[#333]" style={{ fontWeight: 500 }}>{getInvalidatedSteps(stepNum)}</span>
            </p>
            <p className="text-[#aaa] text-[11px] mb-3">
              You will need to re-enter these steps. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => confirmEdit(stepNum)}
                className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded text-[12px] active:bg-[#333] transition-colors"
              >
                Clear & Edit
              </button>
              <button
                onClick={() => setPendingEdit(null)}
                className="flex-1 bg-white border border-[#d0d0d0] text-[#444] py-2.5 rounded text-[12px] active:bg-[#f5f5f5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Active step wrapper ──────────────────────────────────────────────────
  const ActiveStep = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="border-2 border-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="px-5 pt-5 pb-6 bg-white">
        <p className="text-[#888] text-xs uppercase tracking-wider mb-3">{label}</p>
        {children}
      </div>
    </div>
  );

  const OptionBtn = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3.5 border-2 rounded text-left transition-colors active:bg-[#f0f0f0] ${
        selected ? 'border-[#1a1a1a] bg-[#f4f4f4]' : 'border-[#d8d8d8] bg-white'
      }`}
      style={{ minHeight: 48 }}
    >
      <p className="text-[#222] text-sm">{children}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#d8d8d8]">
          <button
            onClick={handleBackWithWarning}
            className="text-[#555] text-sm underline underline-offset-2 active:text-[#222]"
          >
            ← Back
          </button>
          <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
        </header>

        {/* Session timeout warning */}
        {sessionWarning && (
          <div className="bg-[#f4f4f4] border-b border-[#d8d8d8] px-4 py-3">
            <p className="text-[#555] text-[12px] leading-snug">
              Session inactive. Your progress is saved. Continue within 5 minutes to avoid timeout.
            </p>
          </div>
        )}

        {/* Abandon flow warning */}
        {showAbandonWarning && (
          <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg border-2 border-[#1a1a1a] p-6 max-w-sm w-full">
              <p className="text-[#111] text-[15px] mb-2" style={{ fontWeight: 500 }}>
                Leave this flow?
              </p>
              <p className="text-[#666] text-sm leading-snug mb-5">
                Your progress will be lost. All {currentStep - 1} completed steps will not be saved.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAbandonWarning(false);
                    onBack();
                  }}
                  className="flex-1 bg-[#1a1a1a] text-white py-3 rounded text-[13px] active:bg-[#333] transition-colors"
                >
                  Leave
                </button>
                <button
                  onClick={() => setShowAbandonWarning(false)}
                  className="flex-1 bg-white border border-[#d0d0d0] text-[#444] py-3 rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                >
                  Stay
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="px-4 py-6 pb-32">
          {/* Progress */}
          <div className="mb-8">
            <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Create Delivery</p>
            <div className="flex items-center gap-2">
              <p className="text-[#111] text-sm">Step {currentStep} of 8</p>
              <div className="flex-1 h-0.5 bg-[#ebebeb] rounded-full">
                <div
                  className="h-0.5 bg-[#1a1a1a] rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">

            {/* ── STEP 1: Route ──────────────────────────────────── */}
            {currentStep > 1 && data.route ? (
              <StepSummary stepNum={1} label="1 · Route" summary={data.route} />
            ) : currentStep === 1 ? (
              <ActiveStep label="1 · Select Route">
                <div className="space-y-2">
                  {ROUTES.map(r => (
                    <OptionBtn key={r} selected={data.route === r} onClick={() => updateData({ route: r })}>
                      {r}
                    </OptionBtn>
                  ))}
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 2: Pickup Landmark ────────────────────────── */}
            {currentStep > 2 && data.pickupLandmark ? (
              <StepSummary stepNum={2} label="2 · Pickup Landmark" summary={data.pickupLandmark} />
            ) : currentStep === 2 ? (
              <ActiveStep label="2 · Select Pickup Landmark">
                <div className="space-y-2">
                  {pickupOptions.map(l => (
                    <OptionBtn key={l} selected={data.pickupLandmark === l} onClick={() => updateData({ pickupLandmark: l })}>
                      {l}
                    </OptionBtn>
                  ))}
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 3: Pickup Time Window ─────────────────────── */}
            {currentStep > 3 && data.pickupWindow ? (
              <StepSummary stepNum={3} label="3 · Pickup Window" summary={data.pickupWindow} />
            ) : currentStep === 3 ? (
              <ActiveStep label="3 · Select Pickup Time Window">
                <div className="space-y-2">
                  {WINDOWS.map(w => (
                    <OptionBtn key={w} selected={data.pickupWindow === w} onClick={() => updateData({ pickupWindow: w })}>
                      {w}
                    </OptionBtn>
                  ))}
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 4: Drop-off Landmark ──────────────────────── */}
            {currentStep > 4 && data.dropoffLandmark ? (
              <StepSummary stepNum={4} label="4 · Drop-off Landmark" summary={data.dropoffLandmark} />
            ) : currentStep === 4 ? (
              <ActiveStep label="4 · Select Drop-off Landmark">
                <div className="space-y-2">
                  {dropoffOptions.map(l => (
                    <OptionBtn key={l} selected={data.dropoffLandmark === l} onClick={() => updateData({ dropoffLandmark: l })}>
                      {l}
                    </OptionBtn>
                  ))}
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 5: Parcel Declaration ─────────────────────── */}
            {currentStep > 5 && data.category ? (
              <StepSummary
                stepNum={5}
                label="5 · Parcel Declaration"
                summary={`${data.category.charAt(0).toUpperCase()}${data.category.slice(1)} · ${
                  data.valueBand === 'low' ? '₦0–50k' : data.valueBand === 'medium' ? '₦50k–200k' : '₦200k+'
                }`}
              />
            ) : currentStep === 5 ? (
              <ActiveStep label="5 · Parcel Declaration">
                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <p className="text-[#666] text-[12px] uppercase tracking-wider mb-2">Category</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['handbag', 'backpack', 'bulky'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => updateData({ category: cat })}
                          className={`p-3 border-2 rounded text-center transition-colors active:bg-[#f0f0f0] ${
                            data.category === cat ? 'border-[#1a1a1a] bg-[#f4f4f4]' : 'border-[#d8d8d8] bg-white'
                          }`}
                          style={{ minHeight: 72 }}
                        >
                          <div className="w-full h-8 bg-[#d0d0d0] rounded mb-2" />
                          <p className="text-[#222] text-[12px] capitalize">{cat}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <p className="text-[#666] text-[12px] uppercase tracking-wider mb-2">Short Description <span className="text-[#bbb] normal-case">(optional)</span></p>
                    <textarea
                      value={data.description || ''}
                      onChange={e => updateData({ description: e.target.value })}
                      placeholder="e.g. Blue handbag with documents"
                      rows={2}
                      className="w-full px-3 py-3 bg-[#fafafa] border-2 border-[#d8d8d8] rounded text-[#222] text-sm resize-none focus:border-[#1a1a1a] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Value Band */}
                  <div>
                    <p className="text-[#666] text-[12px] uppercase tracking-wider mb-2">Declared Value</p>
                    <div className="space-y-2">
                      {[
                        { value: 'low' as const, label: '₦0 – ₦50,000' },
                        { value: 'medium' as const, label: '₦50,000 – ₦200,000' },
                        { value: 'high' as const, label: '₦200,000+' },
                      ].map(v => (
                        <OptionBtn key={v.value} selected={data.valueBand === v.value} onClick={() => updateData({ valueBand: v.value })}>
                          {v.label}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>

                  {/* Prohibited Items */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.prohibitedConfirmed || false}
                      onChange={e => updateData({ prohibitedConfirmed: e.target.checked })}
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1a1a1a]"
                    />
                    <span className="text-[#333] text-sm leading-snug">
                      I confirm this parcel does not contain prohibited items
                    </span>
                  </label>
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 6: Who Pays ───────────────────────────────── */}
            {currentStep > 6 && data.whoPays ? (
              <StepSummary
                stepNum={6}
                label="6 · Who Pays"
                summary={data.whoPays === 'sender' ? 'Sender Pays' : 'Receiver Pays'}
              />
            ) : currentStep === 6 ? (
              <ActiveStep label="6 · Who Pays">
                <div className="space-y-2">
                  <OptionBtn selected={data.whoPays === 'sender'} onClick={() => updateData({ whoPays: 'sender' })}>
                    <span className="block" style={{ fontWeight: 500 }}>Sender Pays</span>
                    <span className="block text-[#888] text-[12px] mt-0.5">Pay now to activate delivery immediately</span>
                  </OptionBtn>
                  <OptionBtn selected={data.whoPays === 'receiver'} onClick={() => updateData({ whoPays: 'receiver' })}>
                    <span className="block" style={{ fontWeight: 500 }}>Receiver Pays</span>
                    <span className="block text-[#888] text-[12px] mt-0.5">Delivery activates after receiver payment</span>
                  </OptionBtn>
                  {data.whoPays === 'receiver' && (
                    <div className="bg-[#f8f8f8] border border-[#e0e0e0] rounded px-4 py-3">
                      <p className="text-[#666] text-[12px] leading-snug">
                        Receiver will receive a payment request. Delivery is inactive until payment is confirmed.
                      </p>
                    </div>
                  )}
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 7: Price Summary ──────────────────────────── */}
            {currentStep > 7 ? (
              <StepSummary stepNum={7} label="7 · Price Summary" summary={`₦${price.total.toLocaleString()} total`} />
            ) : currentStep === 7 ? (
              <ActiveStep label="7 · Price Summary">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Base delivery fee</span>
                    <span className="text-[#222]">₦{price.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Service fee (8%)</span>
                    <span className="text-[#222]">₦{price.fees.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-[#e8e8e8] pt-3 flex justify-between">
                    <span className="text-[#111] text-sm" style={{ fontWeight: 500 }}>Total</span>
                    <span className="text-[#111] text-sm" style={{ fontWeight: 500 }}>₦{price.total.toLocaleString()}</span>
                  </div>
                  <p className="text-[#aaa] text-[11px] pt-1">
                    Funds held in escrow. Released to traveler only after confirmed delivery.
                  </p>
                </div>
              </ActiveStep>
            ) : null}

            {/* ── STEP 8: Confirm & Pay ──────────────────────────── */}
            {currentStep === 8 && (
              <div className="border-2 border-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="px-5 pt-5 pb-6 bg-white">
                  <p className="text-[#888] text-xs uppercase tracking-wider mb-4">8 · Confirm &amp; Pay</p>

                  {/* Read-only summary */}
                  <div className="space-y-2 text-sm border border-[#e8e8e8] rounded p-4 bg-[#fafafa] mb-5">
                    {[
                      { label: 'Route', value: data.route },
                      { label: 'Pickup', value: data.pickupLandmark },
                      { label: 'Window', value: data.pickupWindow },
                      { label: 'Drop-off', value: data.dropoffLandmark },
                      { label: 'Parcel', value: `${data.category} · ${data.valueBand === 'low' ? '₦0–50k' : data.valueBand === 'medium' ? '₦50k–200k' : '₦200k+'}` },
                      { label: 'Payer', value: data.whoPays === 'sender' ? 'Sender' : 'Receiver' },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-[#888]">{row.label}</span>
                        <span className="text-[#222] capitalize">{row.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#e8e8e8] pt-2 mt-1 flex justify-between">
                      <span className="text-[#111]" style={{ fontWeight: 500 }}>Total</span>
                      <span className="text-[#111]" style={{ fontWeight: 500 }}>₦{price.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Irreversibility notice — inline, not modal */}
                  <div className="bg-[#f4f4f4] border border-[#ddd] rounded px-4 py-3 mb-4">
                    <p className="text-[#444] text-[12px] leading-snug">
                      Confirming locks all delivery details and cannot be undone. Payment will be held in escrow until delivery is confirmed.
                    </p>
                  </div>

                  {/* Pay CTA */}
                  {payLoading ? (
                    <div className="w-full bg-[#555] text-white py-4 rounded text-sm text-center">
                      Processing...
                    </div>
                  ) : (
                    <button
                      onClick={handleConfirmPay}
                      className="w-full bg-[#1a1a1a] text-white py-4 rounded text-sm active:bg-[#333] transition-colors"
                    >
                      {data.whoPays === 'sender' ? 'Pay & Create Delivery' : 'Create Delivery'}
                    </button>
                  )}

                  {/* Payment error state */}
                  {payError && !payLoading && (
                    <div className="mt-3 border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
                      <p className="text-[#555] text-[12px] mb-2">
                        Payment could not be processed. Your delivery details are saved.
                      </p>
                      <button
                        onClick={handleConfirmPay}
                        className="w-full bg-white border border-[#1a1a1a] text-[#1a1a1a] py-2.5 rounded text-[12px] active:bg-[#f5f5f5] transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── Sticky Continue Bar ─────────────────────────────────── */}
        {currentStep < 8 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e8e8]">
            <div className="max-w-[480px] mx-auto px-4 py-4">
              {networkError && !isLoading && (
                <div className="mb-3 border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
                  <p className="text-[#555] text-[12px] mb-2">
                    Connection issue. Your progress is saved.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              <button
                onClick={handleContinue}
                disabled={!canProceed(currentStep) || isLoading}
                className={`w-full py-4 rounded text-sm transition-colors ${
                  isLoading
                    ? 'bg-[#555] text-white cursor-default'
                    : canProceed(currentStep)
                    ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                    : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Saving...' : `Continue`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}