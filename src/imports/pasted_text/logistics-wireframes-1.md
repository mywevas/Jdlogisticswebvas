Create low-fidelity, mobile-first wireframes for a logistics web app designed as a trust-enforced system with strict role separation, escrow protection, and controlled communication.

This is NOT a UI exercise.
This is a SYSTEM DESIGN EXECUTION.

Output must reflect production-grade logic, predictable behavior, and real-world reliability.

---

# CORE PRINCIPLE

This system must:

* Enforce trust through structure, not visuals
* Prevent misuse, fraud, and bypass
* Minimize user decisions and ambiguity
* Operate reliably under poor network conditions
* Control communication instead of allowing free interaction

---

# ROLES

* Sender
* Traveler
* Receiver
* Admin (out of scope)

---

# SCREENS (ONLY THESE FIVE)

1. Role-aware routing page
2. Sender → Create Delivery (step-locked)
3. Traveler → Available Jobs marketplace
4. Receiver → Payment / Confirmation
5. Controlled Communication Screen (ONLY after job acceptance)

---

# GLOBAL VISUAL RULES

* Grey boxes only (single neutral tone)
* No colors, branding, illustrations, or decoration
* No maps
* No icons except explicitly required
* No free-text address inputs
* No dashboards
* No visual noise

---

# DESIGN SYSTEM

Spacing (8pt system):
4 / 8 / 16 / 24 / 32 / 48

Rules:

* Primary sections → 32–48 spacing
* Cards → min 16 padding
* Unequal spacing to signal hierarchy

Touch:

* Minimum 48px
* Cards 64–88px
* Full surface tappable

Layout:

* Single column
* Max width 480px
* Horizontal padding 16px

---

# INTERACTION STATES

Every action must include:

* Default
* Pressed (instant)
* Loading (>300ms)
* Success
* Error (recoverable)

No interaction should feel delayed or unclear.

---

# FAILURE DESIGN

Must handle:

* Network loss
* OTP failure
* Payment interruption
* Job already taken
* Session timeout

Rules:

* Preserve progress
* Offer “Retry” or “Continue”
* Never reset flow

---

# TRUST & ESCROW RULES

* Payment held until delivery confirmed
* No early release to traveler
* Jobs lock permanently after acceptance
* No negotiation

UI must show this as short system cues (not explanations).

---

# ANTI-FRAUD RULES

* No direct contact before job acceptance
* No external coordination paths
* No identity exposure beyond role
* OTP required for sensitive actions

---

# PERFORMANCE CONTEXT

* Low bandwidth
* Slow devices
* Unstable connections

Design for perceived speed and minimal friction.

---

# STATE SYSTEM (ENFORCED BY DESIGN)

Delivery:
Draft → Created → AwaitingPayment → Active → Assigned → InTransit → Delivered → Completed / Disputed

Job:
Available → Reserved → Accepted → Completed

Payment:
Initialized → Escrow → Released / Refunded

No invalid transitions.

---

# SCREEN 1 — ROUTING

(Keep structure from previous version, unchanged but include:)

Add system cues under cards:

* “Tracked. Protected. Verified”
* “Only approved travelers”
* “Payment secured until confirmation”

---

# SCREEN 2 — SENDER FLOW

(Keep step-lock structure)

Add:

* Completion echo (collapsed steps show summary)
* Editing resets downstream steps

---

# SCREEN 3 — TRAVELER MARKETPLACE

Add:

* First tap → soft expansion:
  “This job will be locked to you”
* Second tap → confirm

Add state:

* “Reserved” (temporary lock before final accept)

---

# SCREEN 4 — RECEIVER

Unchanged core, but include:

* Delivery code verification
* “Report Issue” as quiet fallback

---

# SCREEN 5 — CONTROLLED COMMUNICATION SYSTEM

⚠️ THIS IS NOT OPEN CHAT

Purpose:
Enable coordination ONLY after job acceptance, without breaking system trust.

---

## ACCESS RULE

Communication becomes available ONLY when:

* Job is accepted
* Delivery is active

---

## PARTICIPANTS

* Sender
* Traveler
* Receiver (only when relevant)

---

## STRUCTURE (NOT FREE CHAT)

Conversation is structured into:

1. System Messages (auto-generated)
2. Controlled Messages (predefined templates)
3. Limited Free Text (optional, restricted)

---

## SYSTEM MESSAGES (AUTO)

Examples:

* “Traveler has accepted this delivery”
* “Pickup scheduled for [time window]”
* “Delivery in transit”
* “Arriving soon”

---

## CONTROLLED MESSAGE OPTIONS

Users can tap to send:

* “I’m on my way”
* “I’ve arrived”
* “Running late”
* “Please confirm location landmark”

---

## LIMITED FREE TEXT (STRICT)

* Enabled only after first system milestone (e.g. InTransit)
* Character-limited
* No phone numbers allowed
* No external links

---

## SAFETY RULES

* Mask phone numbers automatically
* Block numeric patterns resembling phone numbers
* No attachments
* No images
* No voice notes

---

## UI STRUCTURE

* Vertical message list (grey blocks)
* Input area minimal
* Suggested quick actions above input
* No emojis, no media

---

## FAILURE HANDLING

* Messages queue if offline
* Auto-send when connection restores
* Show “Sending…” state

---

## ESCALATION PATH

Include subtle option:

“Report Issue”

This routes to system moderation, not direct confrontation.

---

# AUDIT & TRACEABILITY (IMPLICIT IN UI)

All actions must be traceable:

* Job acceptance
* Payment
* Delivery confirmation
* Communication logs

---

# OUTPUT REQUIREMENTS

Deliver:

* 5 mobile wireframes
* Interaction annotations
* State transitions visible
* Failure states included
* No decorative UI

---

# FINAL VALIDATION

Before output, ensure:

* No user can bypass escrow
* No irreversible action happens accidentally
* No role confusion exists
* No communication can enable fraud
* No step depends on stable internet

If any fail → redesign

---

This is not a chat system.
This is controlled coordination within a trust protocol.

This is not UI.
This is infrastructure behavior expressed visually.
