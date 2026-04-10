import { useState, useEffect } from 'react';

interface TravelerMarketplaceProps {
  onBack: () => void;
  onOpenComm: () => void;
  simulateError: boolean;
}

// State machine: Available → Reserved → Accepted → Completed
// Unavailable is a terminal locked-out state (taken by another traveler)
interface Job {
  id: string;
  route: string;
  category: string;
  pickupLandmark: string;
  pickupWindow: string;
  dropoffLandmark: string;
  payout: number;
  status: 'available' | 'reserved' | 'accepted' | 'unavailable';
}

const MOCK_JOBS: Job[] = [
  {
    id: 'JOB-001',
    route: 'Lagos → Abuja',
    category: 'Handbag',
    pickupLandmark: 'Ikeja City Mall',
    pickupWindow: 'Today, 2pm – 5pm',
    dropoffLandmark: 'Jabi Lake Mall',
    payout: 3500,
    status: 'available',
  },
  {
    id: 'JOB-002',
    route: 'Lagos → Abuja',
    category: 'Backpack',
    pickupLandmark: 'Murtala Muhammed Airport',
    pickupWindow: 'Tomorrow, 9am – 12pm',
    dropoffLandmark: 'Nnamdi Azikiwe Airport',
    payout: 5200,
    status: 'available',
  },
  {
    id: 'JOB-003',
    route: 'Abuja → Port Harcourt',
    category: 'Bulky',
    pickupLandmark: 'Jabi Lake Mall',
    pickupWindow: 'Tomorrow, 2pm – 5pm',
    dropoffLandmark: 'Port Harcourt Mall',
    payout: 8900,
    status: 'available',
  },
  {
    id: 'JOB-004',
    route: 'Lagos → Ibadan',
    category: 'Handbag',
    pickupLandmark: 'VI Garden',
    pickupWindow: 'Today, 5pm – 8pm',
    dropoffLandmark: 'Cocoa Mall',
    payout: 2800,
    status: 'unavailable',
  },
  {
    id: 'JOB-005',
    route: 'Lagos → Abuja',
    category: 'Backpack',
    pickupLandmark: 'Lekki Phase 1',
    pickupWindow: 'Tomorrow, 6am – 9am',
    dropoffLandmark: 'Wuse Market',
    payout: 4700,
    status: 'available',
  },
];

const RESERVATION_SECONDS = 30;

export function TravelerMarketplace({ onBack, onOpenComm, simulateError }: TravelerMarketplaceProps) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);
  const [errorJobId, setErrorJobId] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'network' | 'race-condition' | null>(null);
  const [acceptedJobId, setAcceptedJobId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [multiSessionWarning, setMultiSessionWarning] = useState(false);

  // ── Countdown: tick every second, revert reservation on expiry ────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      // Reservation expired — revert reserved job back to available
      setJobs(prev =>
        prev.map(j => j.status === 'reserved' ? { ...j, status: 'available' as const } : j)
      );
      setExpandedJobId(null);
      setErrorJobId(null);
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── First tap: reserve job + start countdown ──────────────────────────────
  const handleCardTap = (job: Job) => {
    if (acceptingJobId) return;
    if (job.status !== 'available') return;

    // Multi-session detection: check if another reservation exists
    const hasActiveReservation = jobs.some(j => j.status === 'reserved');
    if (hasActiveReservation && expandedJobId && expandedJobId !== job.id) {
      setMultiSessionWarning(true);
      setTimeout(() => setMultiSessionWarning(false), 3000);
      return;
    }

    // Cancel any existing reservation first
    if (expandedJobId && expandedJobId !== job.id) {
      setJobs(prev =>
        prev.map(j => j.status === 'reserved' ? { ...j, status: 'available' as const } : j)
      );
    }

    // Reserve this job (Available → Reserved)
    setJobs(prev =>
      prev.map(j => j.id === job.id ? { ...j, status: 'reserved' as const } : j)
    );
    setExpandedJobId(job.id);
    setErrorJobId(null);
    setErrorType(null);
    setCountdown(RESERVATION_SECONDS);
    setLastRefresh(new Date());
  };

  // ── Cancel reservation: revert Reserved → Available ───────────────────────
  const handleCancelReservation = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs(prev =>
      prev.map(j => j.id === jobId ? { ...j, status: 'available' as const } : j)
    );
    setExpandedJobId(null);
    setErrorJobId(null);
    setCountdown(null);
  };

  // ── Second tap: confirm accept (Reserved → Accepted) ─────────────────────
  const handleConfirmAccept = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcceptingJobId(jobId);
    setErrorJobId(null);
    setErrorType(null);
    await new Promise(r => setTimeout(r, 800));

    if (simulateError) {
      setAcceptingJobId(null);
      setErrorJobId(jobId);
      // Randomly determine error type for demo
      setErrorType(Math.random() > 0.5 ? 'race-condition' : 'network');
      return;
    }

    // Reserved → Accepted (permanent)
    setJobs(prev =>
      prev.map(j => j.id === jobId ? { ...j, status: 'accepted' as const } : j)
    );
    setAcceptedJobId(jobId);
    setExpandedJobId(null);
    setAcceptingJobId(null);
    setErrorJobId(null);
    setErrorType(null);
    setCountdown(null);
  };

  // ── Dismiss error (race condition: job was taken) ────────────────────────
  const handleDismissError = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorJobId(null);
    setErrorType(null);
    setExpandedJobId(null);
    setCountdown(null);
    // Mark as unavailable only if race condition — another traveler got it
    if (errorType === 'race-condition') {
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, status: 'unavailable' as const } : j)
      );
    } else {
      // Network error: revert to available
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, status: 'available' as const } : j)
      );
    }
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    if (diff < 60) return 'Updated just now';
    if (diff < 120) return 'Updated 1 min ago';
    if (diff < 3600) return `Updated ${Math.floor(diff / 60)} mins ago`;
    return lastRefresh.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const acceptedJob = jobs.find(j => j.id === acceptedJobId);
  const availableCount = jobs.filter(j => j.status === 'available' || j.status === 'reserved').length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[480px] mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#d8d8d8]">
          <button
            onClick={onBack}
            className="text-[#555] text-sm underline underline-offset-2 active:text-[#222]"
          >
            ← Back
          </button>
          <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
        </header>

        <main className="px-4 py-6">
          {/* Title + Refresh indicator */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Traveler</p>
              <h1 className="text-[#111] text-[19px] mb-1" style={{ fontWeight: 400 }}>Available Jobs</h1>
              <p className="text-[#888] text-sm">
                Accept jobs matching your verified routes
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-[#bbb] text-[10px] uppercase tracking-wider mb-0.5">Jobs</p>
              <p className="text-[#999] text-[11px]">{formatLastRefresh()}</p>
            </div>
          </div>

          {/* Multi-session warning */}
          {multiSessionWarning && (
            <div className="mb-4 border border-[#d0d0d0] rounded-lg px-4 py-3 bg-[#fafafa]">
              <p className="text-[#555] text-[12px] leading-snug">
                You already have an active reservation. Complete or cancel it before reserving another job.
              </p>
            </div>
          )}

          {/* ── Accepted job confirmation ─────────────────────────── */}
          {acceptedJob && (
            <div className="border-2 border-[#1a1a1a] rounded-lg px-5 py-4 mb-8">
              <p className="text-[#111] text-sm mb-1" style={{ fontWeight: 500 }}>Job Accepted</p>
              <p className="text-[#555] text-[13px] leading-snug mb-2">
                {acceptedJob.route} · {acceptedJob.category} · ₦{acceptedJob.payout.toLocaleString()} payout
              </p>
              <p className="text-[#888] text-[11px] mb-4">
                Locked to you. Pickup details confirmed. Communication now available.
              </p>
              <button
                onClick={onOpenComm}
                className="w-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] py-3 rounded text-[13px] active:bg-[#f4f4f4] transition-colors"
              >
                Open Delivery Coordination →
              </button>
            </div>
          )}

          {/* System rule */}
          <div className="bg-[#f8f8f8] border border-[#e8e8e8] rounded px-4 py-3 mb-6">
            <p className="text-[#888] text-[12px] leading-snug">
              Jobs lock permanently after acceptance. Only approved travelers. No direct sender contact. No negotiation.
            </p>
          </div>

          {/* ── Jobs List ─────────────────────────────────────────── */}
          <div className="space-y-3">
            {jobs.map(job => {
              const isExpanded = expandedJobId === job.id;
              const isAccepting = acceptingJobId === job.id;
              const hasError = errorJobId === job.id;
              const isReserved = job.status === 'reserved';

              return (
                <div
                  key={job.id}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    job.status === 'accepted'
                      ? 'border-[#1a1a1a] bg-[#f8f8f8]'
                      : job.status === 'unavailable'
                      ? 'border-[#e8e8e8] bg-[#f8f8f8] opacity-50'
                      : isReserved
                      ? 'border-[#555] bg-white'
                      : 'border-[#d0d0d0] bg-white'
                  }`}
                  onClick={() => {
                    if (job.status === 'available') handleCardTap(job);
                  }}
                  style={{
                    cursor: job.status === 'available' ? 'pointer' : 'default',
                    minHeight: 72,
                  }}
                >
                  {/* ── Card summary (always visible) ──────────────── */}
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[#111] text-[15px]" style={{ fontWeight: 500 }}>
                          {job.route}
                        </p>
                        <p className="text-[#888] text-[12px] mt-0.5">{job.category}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-[#111] text-[15px]" style={{ fontWeight: 500 }}>
                          ₦{job.payout.toLocaleString()}
                        </p>
                        <p className="text-[#aaa] text-[11px]">Payout</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                      <div>
                        <p className="text-[#aaa] uppercase tracking-wider text-[10px] mb-0.5">Pickup</p>
                        <p className="text-[#333]">{job.pickupLandmark}</p>
                        <p className="text-[#888]">{job.pickupWindow}</p>
                      </div>
                      <div>
                        <p className="text-[#aaa] uppercase tracking-wider text-[10px] mb-0.5">Drop-off</p>
                        <p className="text-[#333]">{job.dropoffLandmark}</p>
                      </div>
                    </div>

                    {/* State labels */}
                    {job.status === 'accepted' && (
                      <div className="mt-3 border border-[#d0d0d0] rounded px-3 py-2 bg-[#f0f0f0]">
                        <p className="text-[#444] text-[12px]">Locked to you · Awaiting pickup</p>
                      </div>
                    )}
                    {job.status === 'unavailable' && (
                      <p className="mt-3 text-[#bbb] text-[12px]">No longer available</p>
                    )}
                    {job.status === 'available' && !isExpanded && (
                      <p className="mt-3 text-[#bbb] text-[12px]">Tap to review and accept</p>
                    )}
                    {isReserved && countdown !== null && (
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[#555] text-[12px]" style={{ fontWeight: 500 }}>
                          Reserved for you
                        </p>
                        <p className="text-[#888] text-[12px]">
                          Expires in {countdown}s
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Expanded reservation panel (Reserved state) ── */}
                  {isReserved && isExpanded && (
                    <div
                      className="border-t border-[#e8e8e8] px-5 py-4 bg-[#fafafa]"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* Reservation context */}
                      <div className="bg-white border border-[#d8d8d8] rounded px-4 py-3 mb-4">
                        <p className="text-[#333] text-[13px] leading-snug" style={{ fontWeight: 500 }}>
                          This job will be locked to you permanently.
                        </p>
                        <p className="text-[#888] text-[12px] mt-1 leading-snug">
                          No cancellation after acceptance. No direct sender contact. No negotiation.
                        </p>
                      </div>

                      {/* Countdown warning */}
                      <div className="bg-[#f4f4f4] border border-[#e0e0e0] rounded px-4 py-2.5 mb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[#555] text-[12px]">Reservation active</p>
                          <p className="text-[#333] text-[12px]" style={{ fontWeight: 500 }}>
                            {countdown}s remaining
                          </p>
                        </div>
                        <div className="mt-1.5 h-0.5 bg-[#e0e0e0] rounded-full">
                          <div
                            className="h-0.5 bg-[#555] rounded-full transition-all duration-1000"
                            style={{ width: `${((countdown || 0) / RESERVATION_SECONDS) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Error states: race condition vs network */}
                      {hasError && errorType === 'race-condition' && (
                        <div className="border border-[#d0d0d0] rounded px-4 py-3 mb-3 bg-white">
                          <p className="text-[#555] text-[13px] mb-1" style={{ fontWeight: 500 }}>
                            Job no longer available
                          </p>
                          <p className="text-[#888] text-[12px] leading-snug mb-3">
                            Another traveler accepted this job while you were reserving it. This job is now locked to them.
                          </p>
                          <button
                            onClick={e => handleDismissError(job.id, e)}
                            className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
                          >
                            Check Other Jobs
                          </button>
                          <p className="text-[#aaa] text-[11px] text-center mt-2">
                            No action taken. Your account was not affected.
                          </p>
                        </div>
                      )}
                      {hasError && errorType === 'network' && (
                        <div className="border border-[#d0d0d0] rounded px-4 py-3 mb-3 bg-white">
                          <p className="text-[#555] text-[13px] mb-1" style={{ fontWeight: 500 }}>
                            Connection issue
                          </p>
                          <p className="text-[#888] text-[12px] leading-snug mb-3">
                            Couldn't confirm acceptance. Your reservation is still active. Try again or cancel.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={e => handleConfirmAccept(job.id, e)}
                              className="flex-1 bg-[#1a1a1a] text-white py-2.5 rounded text-[12px] active:bg-[#333] transition-colors"
                            >
                              Retry
                            </button>
                            <button
                              onClick={e => handleDismissError(job.id, e)}
                              className="flex-1 bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Confirm / Cancel buttons */}
                      {!hasError && (
                        <div className="flex gap-2">
                          <button
                            onClick={e => handleConfirmAccept(job.id, e)}
                            disabled={!!isAccepting}
                            className={`flex-1 py-3.5 rounded text-[13px] transition-colors ${
                              isAccepting
                                ? 'bg-[#555] text-white cursor-default'
                                : 'bg-[#1a1a1a] text-white active:bg-[#333]'
                            }`}
                          >
                            {isAccepting ? 'Locking job...' : 'Confirm — Accept Job'}
                          </button>
                          <button
                            onClick={e => handleCancelReservation(job.id, e)}
                            disabled={!!isAccepting}
                            className="px-4 py-3.5 bg-white border border-[#d0d0d0] text-[#555] rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {availableCount === 0 && !acceptedJobId && (
            <div className="text-center py-16">
              <div className="w-10 h-10 bg-[#e8e8e8] rounded-full mx-auto mb-4" />
              <p className="text-[#888] text-sm mb-1">No jobs available on your approved routes.</p>
              <p className="text-[#bbb] text-[12px] leading-snug px-8">
                Jobs are posted when senders create deliveries. Refresh every few hours during peak travel times.
              </p>
              <p className="text-[#ccc] text-[11px] mt-3">
                {formatLastRefresh()}
              </p>
            </div>
          )}

          <div className="mt-8 pb-6">
            <p className="text-[#ccc] text-[11px] text-center">
              Jobs refresh in real-time. Availability not guaranteed.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
