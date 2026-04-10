import { useState, useRef, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  type: 'system' | 'user';
  role?: 'sender' | 'traveler';
  content: string;
  timestamp: string;
  sendState: 'sent' | 'sending' | 'queued';
}

interface CommunicationScreenProps {
  onBack: () => void;
  deliveryStatus: 'assigned' | 'in-transit';
  viewerRole: 'sender' | 'traveler';
  simulateError: boolean;
}

// ── Mock thread (Assigned state) ────────────────────────────────────────
const MOCK_ASSIGNED: Message[] = [
  {
    id: 'sys-1',
    type: 'system',
    content: 'Traveler accepted this delivery',
    timestamp: '10:15am',
    sendState: 'sent',
  },
  {
    id: 'sys-2',
    type: 'system',
    content: 'Pickup scheduled for Today, 2pm – 5pm · Ikeja City Mall',
    timestamp: '10:15am',
    sendState: 'sent',
  },
  {
    id: 'u-1',
    type: 'user',
    role: 'traveler',
    content: "I'm on my way",
    timestamp: '1:42pm',
    sendState: 'sent',
  },
];

// ── Mock thread (In Transit state) ────────────���─────────────────────────
const MOCK_IN_TRANSIT: Message[] = [
  {
    id: 'sys-1',
    type: 'system',
    content: 'Traveler accepted this delivery',
    timestamp: '10:15am',
    sendState: 'sent',
  },
  {
    id: 'sys-2',
    type: 'system',
    content: 'Pickup scheduled for Today, 2pm – 5pm · Ikeja City Mall',
    timestamp: '10:15am',
    sendState: 'sent',
  },
  {
    id: 'u-1',
    type: 'user',
    role: 'traveler',
    content: "I'm on my way",
    timestamp: '1:42pm',
    sendState: 'sent',
  },
  {
    id: 'sys-3',
    type: 'system',
    content: 'Delivery in transit',
    timestamp: '2:00pm',
    sendState: 'sent',
  },
  {
    id: 'u-2',
    type: 'user',
    role: 'sender',
    content: 'Please confirm location landmark',
    timestamp: '2:04pm',
    sendState: 'sent',
  },
  {
    id: 'u-3',
    type: 'user',
    role: 'traveler',
    content: 'Jabi gate, side entrance near the pharmacy',
    timestamp: '2:07pm',
    sendState: 'sent',
  },
  {
    id: 'sys-4',
    type: 'system',
    content: 'Arriving soon',
    timestamp: '2:28pm',
    sendState: 'sent',
  },
];

// ── Quick action templates ───────────────────────────────────────────────
const QUICK_ACTIONS = [
  "I'm on my way",
  "I've arrived",
  'Running late',
  'Please confirm location landmark',
];

// ── Report issue categories ──────────────────────────────────────────────
const REPORT_CATEGORIES = [
  'Unresponsive traveler',
  'Inappropriate message',
  'Suspicious behavior',
  'Delivery not progressing',
];

// ── Safety filters ───────────────────────────────────────────────────────
// Block patterns that resemble phone numbers
const PHONE_REGEX =
  /(\+?234|0)[789]\d{8,9}|\b0\d{10}\b|\b\d{4}[\s.-]\d{3}[\s.-]\d{4}\b|\b\d{11}\b/;

const containsPhone = (text: string) => PHONE_REGEX.test(text.replace(/\s{2,}/g, ' '));

// Block external URL patterns
const URL_REGEX = /https?:\/\/|www\.|\.com|\.ng|bit\.ly/i;
const containsUrl = (text: string) => URL_REGEX.test(text);

const MAX_CHARS = 100;

// ── Helpers ──────────────────────────────────────────────────────────────
function nowTimestamp() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

// ── Component ────────────────────────────────────────────────────────────
export function CommunicationScreen({
  onBack,
  deliveryStatus,
  viewerRole,
  simulateError,
}: CommunicationScreenProps) {
  const [messages, setMessages] = useState<Message[]>(
    deliveryStatus === 'in-transit' ? MOCK_IN_TRANSIT : MOCK_ASSIGNED
  );
  const [inputText, setInputText] = useState('');

  // Report issue panel
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [reportCategory, setReportCategory] = useState<string | null>(null);
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Derived state ──────────────────────────────────────────────────────
  const isOnline = !simulateError;
  // Free text only unlocks after InTransit milestone
  const freeTextUnlocked = deliveryStatus === 'in-transit';
  const phoneBlocked = containsPhone(inputText);
  const urlBlocked = containsUrl(inputText);
  const overLimit = inputText.length > MAX_CHARS;
  const canSend =
    inputText.trim().length > 0 && !phoneBlocked && !urlBlocked && !overLimit;

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = async (content: string) => {
    const id = `msg-${Date.now()}-${Math.random()}`;
    const newMsg: Message = {
      id,
      type: 'user',
      role: viewerRole,
      content,
      timestamp: nowTimestamp(),
      sendState: isOnline ? 'sending' : 'queued',
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    if (isOnline) {
      await new Promise(r => setTimeout(r, 550));
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, sendState: 'sent' } : m))
      );
    }
    // Offline: message stays 'queued', banner is visible
  };

  const handleQuickAction = (text: string) => {
    sendMessage(text);
  };

  const handleTextSend = () => {
    if (!canSend) return;
    sendMessage(inputText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  // ── Report issue ──────────────────────────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportCategory || reportState === 'loading') return;
    setReportState('loading');
    await new Promise(r => setTimeout(r, 800));
    if (simulateError) {
      setReportState('error');
      return;
    }
    setReportState('done');
    setShowReportPanel(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-[480px] mx-auto w-full flex flex-col min-h-screen">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex-shrink-0 border-b border-[#d8d8d8]">
          {/* Nav row */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={onBack}
              className="text-[#555] text-sm underline underline-offset-2 active:text-[#222]"
            >
              ← Back
            </button>
            <div className="w-9 h-9 bg-[#c8c8c8] rounded-full" />
          </div>

          {/* Delivery context strip */}
          <div className="px-4 pb-3">
            <div className="bg-[#f4f4f4] border border-[#e8e8e8] rounded-lg px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[#111] text-[13px]" style={{ fontWeight: 500 }}>
                    DEL-7823 · Lagos → Abuja
                  </p>
                  <p className="text-[#888] text-[11px] mt-0.5">
                    Ikeja City Mall → Jabi Lake Mall · Backpack
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 px-2 py-1 rounded text-[10px] uppercase tracking-wider border ${
                    deliveryStatus === 'in-transit'
                      ? 'border-[#555] text-[#333] bg-[#ebebeb]'
                      : 'border-[#d0d0d0] text-[#666] bg-[#f8f8f8]'
                  }`}
                >
                  {deliveryStatus === 'in-transit' ? 'In Transit' : 'Assigned'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e8e8e8]">
                <p className="text-[#aaa] text-[11px]">
                  Viewing as:{' '}
                  <span className="text-[#555]">
                    {viewerRole === 'sender' ? 'Sender' : 'Traveler'}
                  </span>
                </p>
                <p className="text-[#aaa] text-[11px]">
                  {deliveryStatus === 'in-transit'
                    ? 'Free text active'
                    : 'Free text locked'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Offline banner ─────────────────────────────────────── */}
        {!isOnline && (
          <div className="flex-shrink-0 bg-[#f0f0f0] border-b border-[#d8d8d8] px-4 py-2.5">
            <p className="text-[#555] text-[12px]">
              You're offline. New messages are queued and will send when connection restores.
            </p>
          </div>
        )}

        {/* ── Audit notice ───────────────────────────────────────── */}
        <div className="flex-shrink-0 border-b border-[#f0f0f0] px-4 py-2">
          <p className="text-[#ccc] text-[10px] uppercase tracking-wider">
            All messages logged · Phone numbers blocked · No attachments
          </p>
        </div>

        {/* ── Message list ───────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-5"
          style={{ paddingBottom: '260px' }}
        >
          <div className="space-y-3">
            {messages.map(msg => {
              if (msg.type === 'system') {
                return (
                  <SystemMessage key={msg.id} content={msg.content} timestamp={msg.timestamp} />
                );
              }
              return (
                <UserMessage
                  key={msg.id}
                  role={msg.role!}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  sendState={msg.sendState}
                  isOwn={msg.role === viewerRole}
                />
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* ── Fixed bottom: Quick actions + input + report ───────── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#d8d8d8]">
          <div className="max-w-[480px] mx-auto">

            {/* Quick action chips */}
            <div className="px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
              <p className="text-[#bbb] text-[10px] uppercase tracking-wider mb-2">
                Quick messages
              </p>
              <div
                className="flex gap-2 overflow-x-auto"
                style={{ scrollbarWidth: 'none' }}
              >
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="flex-shrink-0 bg-[#f4f4f4] border border-[#d8d8d8] rounded px-3 py-2 text-[12px] text-[#444] active:bg-[#e8e8e8] transition-colors whitespace-nowrap"
                    style={{ minHeight: 36 }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Free text input OR locked notice */}
            <div className="px-4 pt-3 pb-2">
              {freeTextUnlocked ? (
                <div>
                  {/* Safety warnings — inline, no modal */}
                  {phoneBlocked && (
                    <div className="mb-2 px-3 py-2 bg-[#f8f8f8] border border-[#d8d8d8] rounded">
                      <p className="text-[#888] text-[11px]">
                        Phone numbers are not permitted in messages.
                      </p>
                    </div>
                  )}
                  {urlBlocked && !phoneBlocked && (
                    <div className="mb-2 px-3 py-2 bg-[#f8f8f8] border border-[#d8d8d8] rounded">
                      <p className="text-[#888] text-[11px]">
                        External links are not permitted in messages.
                      </p>
                    </div>
                  )}
                  {overLimit && !phoneBlocked && !urlBlocked && (
                    <div className="mb-2 px-3 py-2 bg-[#f8f8f8] border border-[#d8d8d8] rounded">
                      <p className="text-[#888] text-[11px]">
                        Maximum {MAX_CHARS} characters per message.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <textarea
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        rows={2}
                        className="w-full px-3 py-2.5 bg-[#fafafa] border-2 border-[#d8d8d8] rounded text-[#222] text-sm resize-none focus:border-[#1a1a1a] focus:outline-none transition-colors"
                        style={{ fontSize: 14 }}
                      />
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[#ddd] text-[10px]">No phone numbers · No links</span>
                        <span
                          className={`text-[10px] ${
                            overLimit ? 'text-[#999]' : 'text-[#ccc]'
                          }`}
                        >
                          {inputText.length} / {MAX_CHARS}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleTextSend}
                      disabled={!canSend}
                      className={`px-4 py-3 rounded text-[13px] mb-5 transition-colors ${
                        canSend
                          ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                          : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                      }`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f8f8f8] border border-[#e8e8e8] rounded px-4 py-3">
                  <p className="text-[#aaa] text-[12px]">
                    Free text unlocks after pickup is confirmed.
                  </p>
                </div>
              )}
            </div>

            {/* Report Issue — quiet link + inline expansion */}
            <div className="px-4 pb-4">
              {reportState === 'done' ? (
                <p className="text-[#aaa] text-[11px] text-center">
                  Issue reported. Routed to system moderation.
                </p>
              ) : (
                <>
                  <button
                    onClick={() => setShowReportPanel(p => !p)}
                    className="w-full text-[#bbb] text-[11px] underline underline-offset-2 text-center"
                  >
                    Report Issue
                  </button>

                  {showReportPanel && (
                    <div className="mt-2 border border-[#d0d0d0] rounded p-3 bg-[#fafafa]">
                      <p
                        className="text-[#333] text-[13px] mb-2"
                        style={{ fontWeight: 500 }}
                      >
                        Report Issue
                      </p>
                      <p className="text-[#888] text-[12px] mb-3 leading-snug">
                        This routes to system moderation, not to the other party.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        {REPORT_CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setReportCategory(cat)}
                            className={`w-full px-3 py-2.5 border-2 rounded text-left text-[12px] transition-colors ${
                              reportCategory === cat
                                ? 'border-[#1a1a1a] bg-[#f0f0f0] text-[#111]'
                                : 'border-[#d8d8d8] bg-white text-[#555]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      {reportState === 'error' && (
                        <p className="text-[#888] text-[12px] mb-2 text-center">
                          Couldn't submit. Try again.
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleReportSubmit}
                          disabled={!reportCategory || reportState === 'loading'}
                          className={`flex-1 py-2.5 rounded text-[12px] transition-colors ${
                            reportState === 'loading'
                              ? 'bg-[#555] text-white cursor-default'
                              : reportCategory
                              ? 'bg-[#1a1a1a] text-white active:bg-[#333]'
                              : 'bg-[#e8e8e8] text-[#bbb] cursor-not-allowed'
                          }`}
                        >
                          {reportState === 'loading' ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                          onClick={() => {
                            setShowReportPanel(false);
                            setReportCategory(null);
                            setReportState('idle');
                          }}
                          className="flex-1 bg-white border border-[#d0d0d0] text-[#555] py-2.5 rounded text-[12px] active:bg-[#f5f5f5] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function SystemMessage({ content, timestamp }: { content: string; timestamp: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-[#ebebeb]" />
      <div className="text-center px-2 flex-shrink-0 max-w-[260px]">
        <p className="text-[#aaa] text-[11px] leading-snug">{content}</p>
        <p className="text-[#ccc] text-[10px] mt-0.5">{timestamp}</p>
      </div>
      <div className="flex-1 h-px bg-[#ebebeb]" />
    </div>
  );
}

function UserMessage({
  role,
  content,
  timestamp,
  sendState,
  isOwn,
}: {
  role: 'sender' | 'traveler';
  content: string;
  timestamp: string;
  sendState: 'sent' | 'sending' | 'queued';
  isOwn: boolean;
}) {
  const roleLabel = role === 'sender' ? 'Sender' : 'Traveler';

  return (
    <div className="space-y-0.5">
      <div className="bg-[#f4f4f4] border border-[#e8e8e8] rounded-lg px-4 py-3">
        {/* Role badge row */}
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[#888] text-[10px] uppercase tracking-wider">
            {roleLabel}
            {isOwn && (
              <span className="text-[#bbb] normal-case tracking-normal ml-1">
                (You)
              </span>
            )}
          </p>
          <div className="text-right">
            {sendState === 'sending' && (
              <p className="text-[#bbb] text-[10px]">Sending…</p>
            )}
            {sendState === 'queued' && (
              <p className="text-[#bbb] text-[10px]">Queued</p>
            )}
          </div>
        </div>

        {/* Message content */}
        <p className="text-[#222] text-sm leading-snug">{content}</p>

        {/* Timestamp */}
        <p className="text-[#ccc] text-[10px] mt-1.5">{timestamp}</p>
      </div>
    </div>
  );
}