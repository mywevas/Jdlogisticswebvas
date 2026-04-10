import { useState } from 'react';
import { EntryScreen } from './components/EntryScreen';
import { SenderFlow } from './components/SenderFlow';
import { TravelerMarketplace } from './components/TravelerMarketplace';
import { ReceiverScreen } from './components/ReceiverScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { CommunicationScreen } from './components/CommunicationScreen';

export type UserRole = 'none' | 'sender' | 'traveler-pending' | 'traveler-approved';
export type Screen =
  | 'entry'
  | 'sender-flow'
  | 'traveler-marketplace'
  | 'receiver-flow'
  | 'tracking'
  | 'communication';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('entry');
  const [userRole, setUserRole] = useState<UserRole>('none');
  const [receiverScenario, setReceiverScenario] = useState<'payment' | 'confirmation'>('payment');
  const [simulateError, setSimulateError] = useState(false);

  // Communication-specific demo controls
  const [commDeliveryStatus, setCommDeliveryStatus] = useState<'assigned' | 'in-transit'>('assigned');
  const [commViewerRole, setCommViewerRole] = useState<'sender' | 'traveler'>('traveler');

  const ROLES: { value: UserRole; label: string }[] = [
    { value: 'none', label: 'Logged Out' },
    { value: 'sender', label: 'Sender' },
    { value: 'traveler-pending', label: 'Traveler (Pending)' },
    { value: 'traveler-approved', label: 'Traveler (Approved)' },
  ];

  const SCREENS: { value: Screen; label: string }[] = [
    { value: 'entry', label: 'Entry' },
    { value: 'sender-flow', label: 'Sender Flow' },
    { value: 'traveler-marketplace', label: 'Traveler Jobs' },
    { value: 'receiver-flow', label: 'Receiver' },
    { value: 'tracking', label: 'Tracking' },
    { value: 'communication', label: 'Communication' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* ── Demo Controls ─────────────────────────────────────────── */}
      <div className="bg-[#e0e0e0] border-b border-[#aaa] px-4 py-3">
        <div className="max-w-3xl mx-auto space-y-2">
          <p className="text-[9px] text-[#888] tracking-widest uppercase">Wireframe Demo Controls</p>

          {/* Row 1: Role + Screen */}
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Role</p>
              <div className="flex flex-wrap gap-1">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setUserRole(r.value)}
                    className={`px-2 py-1 text-[10px] rounded border ${
                      userRole === r.value
                        ? 'bg-[#222] text-white border-[#222]'
                        : 'bg-white text-[#444] border-[#bbb]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Screen</p>
              <div className="flex flex-wrap gap-1">
                {SCREENS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setCurrentScreen(s.value)}
                    className={`px-2 py-1 text-[10px] rounded border ${
                      currentScreen === s.value
                        ? 'bg-[#444] text-white border-[#444]'
                        : 'bg-white text-[#444] border-[#bbb]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Receiver / Communication context + Network */}
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Receiver State</p>
              <div className="flex gap-1">
                {[
                  { value: 'payment' as const, label: 'Unpaid' },
                  { value: 'confirmation' as const, label: 'Paid (Confirm)' },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setReceiverScenario(s.value)}
                    className={`px-2 py-1 text-[10px] rounded border ${
                      receiverScenario === s.value
                        ? 'bg-[#222] text-white border-[#222]'
                        : 'bg-white text-[#444] border-[#bbb]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Comm · Delivery Status</p>
              <div className="flex gap-1">
                {[
                  { value: 'assigned' as const, label: 'Assigned' },
                  { value: 'in-transit' as const, label: 'In Transit' },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setCommDeliveryStatus(s.value)}
                    className={`px-2 py-1 text-[10px] rounded border ${
                      commDeliveryStatus === s.value
                        ? 'bg-[#222] text-white border-[#222]'
                        : 'bg-white text-[#444] border-[#bbb]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Comm · Viewer</p>
              <div className="flex gap-1">
                {[
                  { value: 'sender' as const, label: 'Sender' },
                  { value: 'traveler' as const, label: 'Traveler' },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setCommViewerRole(s.value)}
                    className={`px-2 py-1 text-[10px] rounded border ${
                      commViewerRole === s.value
                        ? 'bg-[#222] text-white border-[#222]'
                        : 'bg-white text-[#444] border-[#bbb]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-[#999] uppercase tracking-wider mb-1">Network</p>
              <button
                onClick={() => setSimulateError(!simulateError)}
                className={`px-2 py-1 text-[10px] rounded border ${
                  simulateError
                    ? 'bg-[#222] text-white border-[#222]'
                    : 'bg-white text-[#444] border-[#bbb]'
                }`}
              >
                {simulateError ? '⚠ Error Mode ON' : 'Simulate Network Error'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Screen Router ─────────────────────────────────────────── */}
      {currentScreen === 'entry' && (
        <EntryScreen userRole={userRole} onNavigate={setCurrentScreen} />
      )}
      {currentScreen === 'sender-flow' && (
        <SenderFlow
          key="sender"
          onBack={() => setCurrentScreen('entry')}
          simulateError={simulateError}
        />
      )}
      {currentScreen === 'traveler-marketplace' && (
        <TravelerMarketplace
          key="traveler"
          onBack={() => setCurrentScreen('entry')}
          onOpenComm={() => setCurrentScreen('communication')}
          simulateError={simulateError}
        />
      )}
      {currentScreen === 'receiver-flow' && (
        <ReceiverScreen
          key={receiverScenario}
          onBack={() => setCurrentScreen('entry')}
          scenario={receiverScenario}
          simulateError={simulateError}
        />
      )}
      {currentScreen === 'tracking' && (
        <TrackingScreen
          key="tracking"
          onBack={() => setCurrentScreen('entry')}
          simulateError={simulateError}
        />
      )}
      {currentScreen === 'communication' && (
        <CommunicationScreen
          key={`${commDeliveryStatus}-${commViewerRole}`}
          onBack={() => setCurrentScreen('entry')}
          deliveryStatus={commDeliveryStatus}
          viewerRole={commViewerRole}
          simulateError={simulateError}
        />
      )}
    </div>
  );
}
