import { useState } from 'react';

interface TrackingScreenProps {
  onBack: () => void;
  simulateError: boolean;
}

const KNOWN_ID = 'DEL-7823';

const MOCK_TRACKING = {
  deliveryId: 'DEL-7823',
  route: 'Lagos → Abuja',
  category: 'Backpack',
  pickupLandmark: 'Ikeja City Mall',
  dropoffLandmark: 'Jabi Lake Mall',
  status: 'In Transit',
  estimatedArrival: 'Tomorrow, 3pm – 6pm',
  timeline: [
    { step: 'Created', time: 'Mar 31, 10:30am', completed: true },
    { step: 'Payment confirmed', time: 'Mar 31, 10:35am', completed: true },
    { step: 'Traveler accepted', time: 'Mar 31, 11:15am', completed: true },
    { step: 'Picked up', time: 'Mar 31, 2:45pm', completed: true },
    { step: 'In transit', time: 'Mar 31, 3:00pm', completed: true },
    { step: 'Delivered', time: 'Pending', completed: false },
  ],
};

type SearchState = 'idle' | 'loading' | 'error' | 'not-found';

export function TrackingScreen({ onBack, simulateError }: TrackingScreenProps) {
  const [trackingId, setTrackingId] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [showResults, setShowResults] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [privacyWarning, setPrivacyWarning] = useState(false);

  const handleTrack = async () => {
    if (trackingId.length < 5 || searchState === 'loading') return;
    setSearchState('loading');
    setShowResults(false);
    setPrivacyWarning(false);
    await new Promise(r => setTimeout(r, 900));

    if (simulateError) {
      setSearchState('error');
      return;
    }

    const normalized = trackingId.trim().toUpperCase();
    const isKnown =
      normalized === KNOWN_ID ||
      normalized === '08012345678' ||
      normalized.startsWith('DEL-');

    // Privacy flag for phone-based lookup
    if (/^0\d{10}$/.test(normalized)) {
      setPrivacyWarning(true);
    }

    if (!isKnown) {
      setSearchState('not-found');
      return;
    }

    setSearchState('idle');
    setLastUpdated(new Date());
    setShowResults(true);
  };

  const formatTimestamp = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setSearchState('idle');
    setTrackingId('');
  };

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

          {/* ── Search State ─────────────────────────────────────── */}
          {!showResults && (
            <>
              <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Tracking</p>
              <h1 className="text-[#111] text-[19px] mb-1" style={{ fontWeight: 400 }}>Track a Delivery</h1>
              <p className="text-[#888] text-sm mb-6">No login required</p>

              {/* Privacy notice */}
              <div className="mb-6 border border-[#e8e8e8] rounded-lg px-4 py-3 bg-[#f8f8f8]">
                <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-1">Privacy Notice</p>
                <p className="text-[#888] text-[12px] leading-snug">
                  Tracking by phone number is available to receiver and sender only. Unauthorized tracking attempts are logged.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#666] text-[12px] uppercase tracking-wider mb-2">
                    Delivery ID or Phone Number
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={e => setTrackingId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTrack()}
                    placeholder="DEL-XXXX or 080 000 0000"
                    className="w-full h-12 px-4 bg-[#fafafa] border-2 border-[#d8d8d8] rounded text-[#111] text-sm focus:border-[#1a1a1a] focus:outline-none transition-colors"
                    disabled={searchState === 'loading'}
                  />
                </div>

                {/* Error states */}
                {searchState === 'error' && (
                  <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
                    <p className="text-[#555] text-[12px] mb-2">
                      Couldn't fetch tracking data. Check your connection and try again.
                    </p>
                    <button
                      onClick={handleTrack}
                      className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {searchState === 'not-found' && (
                  <div className="border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
                    <p className="text-[#555] text-[12px] mb-2">
                      No delivery found for <span className="text-[#333]">{trackingId}</span>.
                      Check the ID and try again, or contact the sender.
                    </p>
                    <button
                      onClick={() => setSearchState('idle')}
                      className="w-full bg-white border border-[#999] text-[#333] py-2.5 rounded text-[12px] active:bg-[#f0f0f0] transition-colors"
                    >
                      Try Different ID
                    </button>
                  </div>
                )}

                <button
                  onClick={handleTrack}
                  disabled={trackingId.length < 5 || searchState === 'loading'}
                  className={`w-full py-4 rounded text-sm transition-colors ${
                    searchState === 'loading'
                      ? 'bg-[#555] text-white cursor-default'
                      : trackingId.length >= 5
                      ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                      : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                  }`}
                >
                  {searchState === 'loading' ? 'Searching...' : 'Track Delivery'}
                </button>

                <div className="border border-[#e8e8e8] rounded px-4 py-3 bg-[#fafafa]">
                  <p className="text-[#aaa] text-[12px] leading-snug">
                    Demo: use <span className="text-[#777]">DEL-7823</span> or any ID starting with <span className="text-[#777]">DEL-</span> to see results.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── Results State ─────────────────────────────────────── */}
          {showResults && (
            <>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-0.5">Tracking</p>
                  <h1 className="text-[#111] text-[19px] mb-0.5" style={{ fontWeight: 400 }}>Delivery Status</h1>
                  {lastUpdated && (
                    <p className="text-[#bbb] text-[11px]">
                      Updated {formatTimestamp()}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleNewSearch}
                  className="text-[#888] text-[12px] underline underline-offset-2 active:text-[#333] flex-shrink-0 ml-3"
                >
                  New Search
                </button>
              </div>

              {/* Privacy warning for phone-based lookup */}
              {privacyWarning && (
                <div className="mb-4 border border-[#d0d0d0] rounded-lg px-4 py-3 bg-[#fafafa]">
                  <p className="text-[#555] text-[12px] leading-snug">
                    This delivery was looked up using a phone number. Access is authorized for receiver and sender only. Unauthorized access is logged and monitored.
                  </p>
                </div>
              )}

              {/* Status card */}
              <div className="border-2 border-[#1a1a1a] rounded-lg p-5 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#888] text-[11px] uppercase tracking-wider mb-0.5">Delivery ID</p>
                    <p className="text-[#111] text-[16px]" style={{ fontWeight: 500 }}>{MOCK_TRACKING.deliveryId}</p>
                  </div>
                  <div className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded text-[11px] uppercase tracking-wider">
                    {MOCK_TRACKING.status}
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#888]">Route</span>
                    <span className="text-[#222]">{MOCK_TRACKING.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Category</span>
                    <span className="text-[#222]">{MOCK_TRACKING.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Pickup</span>
                    <span className="text-[#222]">{MOCK_TRACKING.pickupLandmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Drop-off</span>
                    <span className="text-[#222]">{MOCK_TRACKING.dropoffLandmark}</span>
                  </div>
                  <div className="border-t border-[#e8e8e8] pt-2.5 mt-1 flex justify-between">
                    <span className="text-[#888]">Est. Arrival</span>
                    <span className="text-[#222]">{MOCK_TRACKING.estimatedArrival}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[#aaa] text-[11px] uppercase tracking-wider mb-4">Timeline</p>
                <div className="space-y-0">
                  {MOCK_TRACKING.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${
                            item.completed ? 'bg-[#1a1a1a]' : 'bg-[#d8d8d8]'
                          }`}
                        />
                        {index < MOCK_TRACKING.timeline.length - 1 && (
                          <div
                            className={`w-px flex-1 my-1 ${
                              item.completed ? 'bg-[#999]' : 'bg-[#e8e8e8]'
                            }`}
                            style={{ minHeight: 24 }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-5">
                        <p
                          className={`text-sm ${
                            item.completed ? 'text-[#222]' : 'text-[#ccc]'
                          }`}
                        >
                          {item.step}
                        </p>
                        <p
                          className={`text-[12px] mt-0.5 ${
                            item.completed ? 'text-[#888]' : 'text-[#ccc]'
                          }`}
                        >
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="border border-[#e8e8e8] rounded px-4 py-3 bg-[#fafafa]">
                  <p className="text-[#aaa] text-[12px] leading-snug">
                    Funds held in escrow until delivery is confirmed by the receiver.
                  </p>
                </div>
                <div className="border border-[#f0f0f0] rounded px-4 py-2 bg-[#f8f8f8]">
                  <p className="text-[#ccc] text-[11px]">
                    Data refreshed {formatTimestamp()} · Real-time updates may have 5-10 min delay
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
