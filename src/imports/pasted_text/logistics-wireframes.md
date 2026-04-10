Create low-fidelity, mobile-first wireframes for a logistics web app designed around trust, role separation, and strict rule enforcement.

This is NOT a design exercise.
This is a SYSTEM EXECUTION.

The output must be deterministic, structured, and production-ready in logic, not visual polish.

---

# CORE PURPOSE

Design a logistics system where:

* Trust is enforced by structure, not visuals
* Users make decisions instantly without confusion
* No step allows ambiguity, bypass, or misuse
* Every interaction is predictable, recoverable, and state-aware

---

# ROLES IN SYSTEM

* Sender
* Traveler
* Receiver
* Admin (out of scope)

---

# SCREENS IN SCOPE (ONLY THESE FOUR)

1. Role-aware entry / routing page
2. Sender → Create Delivery (step-locked flow)
3. Traveler → Available Jobs marketplace
4. Receiver → Payment / Confirmation

---

# GLOBAL VISUAL CONSTRAINTS (STRICT)

* Use ONLY grey boxes (single neutral tone)
* No colors
* No branding
* No illustrations
* No images
* No maps
* No icons except where explicitly allowed
* No decorative elements, lines, or separators
* No dashboards
* No address inputs or free-text locations

---

# DESIGN SYSTEM (MANDATORY — NO DEVIATION)

Spacing System (8pt base):

* xs: 4
* sm: 8
* md: 16
* lg: 24
* xl: 32
* xxl: 48

Rules:

* Primary sections use xl or xxl spacing
* Cards use minimum md internal padding
* Spacing must communicate hierarchy (not uniform)
* Avoid equal spacing across all elements

Typography Representation (as grey blocks):

* Title → largest block
* Section labels → medium
* Helper text → smaller
* Meta/system text → smallest

Touch Targets:

* Minimum height: 48px
* Cards: 64–88px
* Entire card must be tappable

Layout:

* Mobile-first
* Single vertical column
* Centered container (max-width 480px)
* Horizontal padding: 16px

---

# INTERACTION STATE SYSTEM (MANDATORY)

Every interactive element must support:

1. Default
2. Pressed (instant feedback <100ms)
3. Loading (if action >300ms)
4. Success transition
5. Error (recoverable)

Rules:

* No tap should feel unresponsive
* UI must react immediately even on slow networks
* State transitions must never reset user progress

---

# FAILURE & EDGE CASE HANDLING (NON-NEGOTIABLE)

Design for:

* Network failure during OTP
* Network failure during step progression
* Traveler attempts to accept already-taken job
* Payment interruption
* Session timeout

Rules:

* Preserve user state at all times
* Provide simple recovery:
  “Retry”
  “Continue”
* No technical error messages
* Never restart flows

---

# SYSTEM TRUST & ESCROW RULES

* All payments held in escrow until delivery confirmation
* Travelers cannot access funds early
* Jobs lock permanently after acceptance
* Receiver confirmation finalizes delivery

UI RULE:
Represent these as short, neutral system statements.
No explanation. No persuasion.

---

# ANTI-FRAUD DESIGN CONSTRAINTS

* No free-text addresses (landmarks only)
* No direct sender ↔ traveler communication
* No negotiation layer
* No identity exposure beyond role
* OTP required for all sensitive actions

UI must not expose any path to bypass system rules.

---

# PERFORMANCE (AFRICA CONTEXT)

* Design for low bandwidth and unstable networks
* Minimize steps and input
* Use optimistic UI transitions
* Perceived speed is critical

---

# COGNITIVE LOAD RULE

User must NEVER think about:

* What to do next
* What happens after action
* Whether action is safe

Structure must answer everything.

---

# IRREVERSIBILITY RULE

Any irreversible action must:

* Provide pre-confirmation awareness
* WITHOUT modal dialogs
* Use inline expansion or state change

---

# STATE TRANSITION SYSTEM (STRICT)

Routing:

* Logged out → OTP → role resolution
* Sender → sender flow
* Traveler → traveler flow
* Receiver → receiver flow

Sender:

* Step N requires Step N-1 complete
* Editing a step invalidates subsequent steps

Traveler:

* Available → Accepted (irreversible) → Completed

Receiver:

* Unpaid → Paid → Confirmed

No backward transitions where it breaks system integrity.

---

# SCREEN 1 — ROLE-AWARE ROUTING

Header:

* Small grey rectangle (logo) left
* Small grey circle/square (Help) right
* Shallow height

Context Indicator:

* One muted line (state-aware)
* Logged out: “Choose how you want to use the app”
* Sender: “You’re logged in as Sender”
* Traveler: “You’re logged in as Traveler”

Main Title:
“What do you want to do?”

Primary Action Cards (vertical stack):

CARD 1 — PRIMARY
Send a Parcel
Helper:
“For individuals and businesses sending items between cities.”
System cue (small):
“Tracked. Protected. Verified delivery.”

Behavior:

* Logged out → OTP
* Sender → dashboard
* Traveler → role switch prompt

CARD 2 — TRAVELER
Deliver a Parcel
Helper:
“For verified travelers carrying parcels on approved routes.”
Secondary:
“Verification required”
Micro-state:
“Takes ~24 hours”
System cue:
“Only approved routes and verified users.”

Behavior:

* Logged out → OTP → onboarding
* Pending → verification screen
* Approved → dashboard

CARD 3 — RECEIVER
Receiver Payment / Confirmation
Helper:
“If you were asked to pay or confirm receipt.”
System cue:
“Payment secured until delivery is confirmed.”
Micro-state:
“Requires delivery code”

Behavior:

* OTP → payment or confirmation

Secondary Action:
Track a Delivery
Helper:
“Check status using delivery ID or phone number.”
No login

Footer:
How it works / Safety rules / Support

---

# SCREEN 2 — SENDER FLOW (STEP-LOCKED)

Structure:

* One step visible at a time
* Completed steps collapse with summary (completion echo)

Steps (strict order):

1. Select Route
2. Pickup Landmark
3. Pickup Time Window
4. Drop-off Landmark
5. Parcel Declaration

   * Category (Handbag / Backpack / Bulky)
   * Short description
   * Value band
   * Prohibited items checkbox
6. Who Pays

   * Sender / Receiver
   * If receiver:
     “Delivery activates after receiver payment.”
7. Price Summary
8. Confirm & Pay

Rules:

* No skipping
* Editing resets future steps
* Final action locks flow

---

# SCREEN 3 — TRAVELER MARKETPLACE

Layout:

* Vertical list of job cards

Each Card:

* Route
* Parcel category
* Pickup landmark
* Time window
* Drop-off landmark
* Payout

States:

* Available
* Accepted (locked)
* Unavailable (greyed)

Interaction:

* First tap → card expands:
  “This job will be locked to you”
* Second tap → confirm

No chat
No identity exposure
No negotiation

---

# SCREEN 4 — RECEIVER

Entry:

* Phone + OTP

If unpaid:

* Delivery summary
* Primary:
  Pay & Activate Delivery

If paid:

* Delivery status
* Delivery code input
* Primary:
  Confirm Receipt

Secondary:
Report an Issue (quiet)

---

# FINAL SYSTEM GUARANTEES

* No escrow bypass
* No role confusion
* No address entry
* No maps
* No decorative UI

Trust is created through:
Structure > clarity > predictability

---

# OUTPUT REQUIREMENT

Deliver:

* 4 mobile wireframes
* Clear interaction annotations
* State transitions visible
* Failure states represented
* No visual decoration

---

# FINAL CHECK (MANDATORY)

Before output, validate:

* Can user make a costly mistake?
* Can user bypass system rules?
* Can network failure break flow?
* Is any step ambiguous?

If YES → redesign until NO.

---

This is not UI.
This is a controlled system.
