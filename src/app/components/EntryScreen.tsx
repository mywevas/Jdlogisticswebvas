import { useState } from 'react';
import { UserRole, Screen } from '../App';

interface EntryScreenProps {
  userRole: UserRole;
  onNavigate: (screen: Screen) => void;
}

export function EntryScreen({ userRole, onNavigate }: EntryScreenProps) {
  const [showRoleSwitchWarning, setShowRoleSwitchWarning] = useState(false);
  const [showPendingPanel, setShowPendingPanel] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const getContextText = () => {
    if (userRole === 'sender') return "You're logged in as Sender";
    if (userRole === 'traveler-pending' || userRole === 'traveler-approved')
      return "You're logged in as Traveler";
    return 'Choose how you want to use the app';
  };

  const handleSendParcel = () => {
    setShowPendingPanel(false);
    if (userRole === 'traveler-pending' || userRole === 'traveler-approved') {
      setShowRoleSwitchWarning(true);
    } else {
      setNavigating(true);
      // Simulate brief transition - in production this would be immediate
      setTimeout(() => onNavigate('sender-flow'), 150);
    }
  };

  const handleDeliverParcel = () => {
    setShowRoleSwitchWarning(false);
    if (userRole === 'traveler-pending') {
      setShowPendingPanel(true);
    } else if (userRole === 'traveler-approved') {
      setNavigating(true);
      setTimeout(() => onNavigate('traveler-marketplace'), 150);
    } else {
      setNavigating(true);
      setTimeout(() => onNavigate('traveler-marketplace'), 150);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[480px] mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#d8d8d8]">
          <div className="w-20 h-6 bg-[#c8c8c8] rounded-sm" />
          <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
        </header>

        <main className="px-4">

          {/* Context Indicator */}
          <p className="text-[#888] text-xs mt-6 mb-3 tracking-wide uppercase">
            {getContextText()}
          </p>

          {/* Main Title */}
          <h1 className="text-[#111] text-[19px] mb-8" style={{ fontWeight: 400 }}>
            What do you want to do?
          </h1>

          {/* ── CARD 1 — SEND A PARCEL (Primary) ─────────────────── */}
          <div className="mb-3">
            <button
              onClick={handleSendParcel}
              className="w-full bg-[#f4f4f4] border-2 border-[#1a1a1a] rounded-lg text-left active:bg-[#eaeaea] transition-colors"
              style={{ minHeight: 80 }}
            >
              <div className="px-5 py-5">
                <p className="text-[#111] text-[15px] mb-1" style={{ fontWeight: 500 }}>
                  Send a Parcel
                </p>
                <p className="text-[#555] text-[13px] leading-snug mb-2">
                  For individuals and businesses sending items between cities.
                </p>
                <p className="text-[#888] text-[11px]">
                  Tracked. Protected. Verified delivery.
                </p>
              </div>
            </button>

            {/* Inline role-switch warning — no modal */}
            {showRoleSwitchWarning && (
              <div className="border border-[#d0d0d0] rounded-lg bg-[#fafafa] px-5 py-4 mt-2">
                <p className="text-[#333] text-sm mb-1" style={{ fontWeight: 500 }}>
                  You are logged in as Traveler
                </p>
                <p className="text-[#666] text-[12px] leading-snug mb-4">
                  Sending a parcel requires a Sender account. Switching roles will end your current Traveler session.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('sender-flow')}
                    className="flex-1 bg-[#1a1a1a] text-white py-3 rounded text-[13px] active:bg-[#333] transition-colors"
                  >
                    Switch &amp; Continue
                  </button>
                  <button
                    onClick={() => setShowRoleSwitchWarning(false)}
                    className="flex-1 bg-white border border-[#d0d0d0] text-[#444] py-3 rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── CARD 2 — DELIVER A PARCEL (Traveler) ─────────────── */}
          <div className="mb-3">
            <button
              onClick={handleDeliverParcel}
              className="w-full bg-white border-2 border-[#c0c0c0] rounded-lg text-left active:bg-[#f7f7f7] transition-colors"
              style={{ minHeight: 80 }}
            >
              <div className="px-5 py-5">
                <p className="text-[#111] text-[15px] mb-1" style={{ fontWeight: 500 }}>
                  Deliver a Parcel
                </p>
                <p className="text-[#555] text-[13px] leading-snug mb-2">
                  For verified travelers carrying parcels on approved routes.
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[#888] text-[11px]">Verification required</p>
                  <span className="text-[#bbb] text-[11px]">·</span>
                  <p className="text-[#aaa] text-[11px]">Takes ~24 hours</p>
                </div>
                <p className="text-[#888] text-[11px] mt-1.5">
                  Only approved routes and verified users.
                </p>
              </div>
            </button>

            {/* Inline pending-traveler panel */}
            {showPendingPanel && (
              <div className="border border-[#d0d0d0] rounded-lg bg-[#fafafa] px-5 py-4 mt-2">
                <p className="text-[#333] text-sm mb-1" style={{ fontWeight: 500 }}>
                  Verification in progress
                </p>
                <p className="text-[#666] text-[12px] leading-snug mb-4">
                  Your account is being reviewed. Approved travelers are notified within 24 hours. No action needed now.
                </p>
                <button
                  onClick={() => setShowPendingPanel(false)}
                  className="w-full bg-white border border-[#d0d0d0] text-[#444] py-3 rounded text-[13px] active:bg-[#f5f5f5] transition-colors"
                >
                  Got it
                </button>
              </div>
            )}
          </div>

          {/* ── CARD 3 — RECEIVER ─────────────────────────────────── */}
          <div className="mb-10">
            <button
              onClick={() => onNavigate('receiver-flow')}
              className="w-full bg-white border-2 border-[#c0c0c0] rounded-lg text-left active:bg-[#f7f7f7] transition-colors"
              style={{ minHeight: 80 }}
            >
              <div className="px-5 py-5">
                <p className="text-[#111] text-[15px] mb-1" style={{ fontWeight: 500 }}>
                  Receiver Payment / Confirmation
                </p>
                <p className="text-[#555] text-[13px] leading-snug mb-2">
                  If you were asked to pay or confirm receipt.
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[#888] text-[11px]">Payment secured until delivery is confirmed.</p>
                </div>
                <p className="text-[#aaa] text-[11px] mt-1">Requires delivery code</p>
              </div>
            </button>
          </div>

          {/* ── Secondary: Track a Delivery ───────────────────────── */}
          <div className="border-t border-[#ebebeb] pt-8 mb-10">
            <button
              onClick={() => {
                setNavigating(true);
                setTimeout(() => onNavigate('tracking'), 150);
              }}
              disabled={navigating}
              className={`w-full border border-[#d0d0d0] rounded-lg px-5 py-4 text-left transition-colors ${
                navigating ? 'bg-[#f7f7f7]' : 'bg-white active:bg-[#f7f7f7]'
              }`}
              style={{ minHeight: 56 }}
            >
              <p className="text-[#333] text-[14px]" style={{ fontWeight: 500 }}>Track a Delivery</p>
              <p className="text-[#888] text-[#12px] mt-0.5">
                Check status using delivery ID or phone number. No login required.
              </p>
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebebeb] px-4 py-5">
          <div className="flex justify-center gap-6 text-[11px] text-[#999]">
            <button
              className="underline underline-offset-2 active:text-[#666]"
              onClick={() => alert('Production: Links to How It Works documentation')}
            >
              How it works
            </button>
            <button
              className="underline underline-offset-2 active:text-[#666]"
              onClick={() => alert('Production: Links to Safety Rules documentation')}
            >
              Safety rules
            </button>
            <button
              className="underline underline-offset-2 active:text-[#666]"
              onClick={() => alert('Production: Links to Support contact')}
            >
              Support
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
