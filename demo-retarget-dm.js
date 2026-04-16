const app = document.querySelector("#app");

const state = {
  screen: "feed", // feed | search | dm
  hasRecentSearch: false,
  leadId: "LEAD-RNV-2048",
  submissionId: "SUB-RNV-9A31",
  budget: "$30k",
  revisedBudget: "$45k",
  dmMessages: [],
  dmAutoWonScheduled: false,
};

function render() {
  if (state.screen === "feed") app.innerHTML = renderFeed();
  if (state.screen === "search") app.innerHTML = renderSearch();
  if (state.screen === "dm") app.innerHTML = renderDM();
}

function renderSearch() {
  return `
    <section class="rt-shell rt-search-screen">
      <div class="rt-statusbar rt-statusbar-light">
        <span>9:41</span>
        <span>5G 100%</span>
      </div>

      <div class="rt-search-header">
        <div class="rt-search-nav">
          <button class="rt-back" type="button" data-action="back-from-search">‹</button>
          <div class="rt-search-title">Search</div>
          <div class="rt-nav-spacer"></div>
        </div>
        <div class="rt-searchbar">
          <div class="rt-search-icon">⌕</div>
          <div class="rt-search-text">home renovation quote</div>
        </div>
      </div>

      <div class="rt-search-content">
        <div class="rt-card rt-lead">
          <div class="rt-lead-head">
            <div>
              <div class="rt-lead-kicker">Lead Card</div>
              <div class="rt-lead-title">Modern apartment renovation inquiry</div>
            </div>
            <div class="rt-lead-status">Not completed</div>
          </div>

          <div class="rt-lead-grid">
            <div class="rt-field">
              <span>Project</span>
              <b>Living room + kitchen refresh</b>
            </div>
            <div class="rt-field">
              <span>Location</span>
              <b>Singapore</b>
            </div>
            <div class="rt-field">
              <span>Budget</span>
              <b>Missing</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFeed() {
  return `
    <section class="rt-shell rt-feed-screen">
      <div class="rt-feed-bg"></div>
      <div class="rt-feed-mask"></div>

      <header class="rt-tt-top">
        <div class="rt-statusbar">
          <span>8:00</span>
          <span>5G 100%</span>
        </div>
        <div class="rt-tt-nav">
          <div class="rt-tt-live">LIVE</div>
          <div class="rt-tt-tabs">
            <button class="rt-tt-tab" type="button" data-action="noop">Following</button>
            <button class="rt-tt-tab rt-tt-tab-active" type="button" data-action="noop">For You</button>
          </div>
          <button class="rt-tt-search" type="button" data-action="open-search" aria-label="Search">⌕</button>
        </div>
      </header>

      <div class="rt-feed-copy">
        <b>@RenoFlow</b>
        <p>Still comparing renovation quotes? Message us to finish your request and get matched with contractors.</p>
      </div>

      <div class="rt-feed-rail">
        <div class="rt-rail-item">
          <div class="rt-rail-icon">RF</div>
          <span>Reno</span>
        </div>
        <div class="rt-rail-item">
          <div class="rt-rail-icon">♥</div>
          <span>21.3K</span>
        </div>
        <div class="rt-rail-item">
          <div class="rt-rail-icon">💬</div>
          <span>801</span>
        </div>
        <div class="rt-rail-item">
          <div class="rt-rail-icon">↗</div>
          <span>523</span>
        </div>
      </div>

      <div class="rt-feed-card">
        <div class="rt-feed-kicker">Sponsored</div>
        <h3>Get a renovation quote in chat</h3>
        <p>${state.hasRecentSearch ? "Based on your recent search, we prepared your request." : "We can prepare your request in seconds."}</p>
        <div class="rt-feed-tags">
          <span>Auto-filled city</span>
          <span>Budget to confirm</span>
          <span>3P form auto-submit</span>
        </div>
        <button class="rt-btn rt-btn-primary" type="button" data-action="open-dm">Message</button>
      </div>

      <nav class="rt-tt-tabbar" aria-hidden="true">
        <button class="rt-tab" type="button">⌂<small>Home</small></button>
        <button class="rt-tab" type="button">◎<small>Friends</small></button>
        <button class="rt-tab rt-plus" type="button">＋</button>
        <button class="rt-tab" type="button">✉<small>Inbox</small></button>
        <button class="rt-tab" type="button">◉<small>Profile</small></button>
      </nav>
    </section>
  `;
}

function renderDM() {
  ensureDMInitialized();

  const bubbles = state.dmMessages
    .map((m) => {
      const me = m.role === "me";
      return `
        <div class="rt-bubble ${me ? "me" : ""}">
          ${m.html}
          <div class="rt-bubble-meta">${m.meta}</div>
        </div>
      `;
    })
    .join("");

  const showConfirmChips = !state.dmMessages.some((m) => m.tag === "confirmed") && !state.dmMessages.some((m) => m.tag === "budget-updated");
  const chips = showConfirmChips
    ? `
      <div class="rt-dm-actions">
        <button class="rt-chip" type="button" data-action="looks-good">Looks good</button>
        <button class="rt-chip primary" type="button" data-action="adjust-budget">Budget should be ${state.revisedBudget}</button>
      </div>
    `
    : "";

  return `
    <section class="rt-shell rt-dm-screen">
      <div class="rt-dm-top">
        <div class="rt-dm-back" data-action="back-feed">‹</div>
        <div class="rt-dm-brand">
          <div class="rt-dm-badge">RF</div>
          <div>
            <b>RenoFlow Official</b>
            <span>Business chat</span>
          </div>
        </div>
        <div class="rt-dm-menu">⋯</div>
      </div>

      <div class="rt-dm-body">
        <div class="rt-dm-center">
          <div class="rt-dm-center-time">8:00 PM</div>
          <div class="rt-dm-center-logo">RF</div>
          <h2>RenoFlow Official</h2>
          <p>Business chat opened from an ad. We'll confirm your renovation request details here.</p>
        </div>
        ${bubbles}
        ${chips}
      </div>

      <div class="rt-inputbar">
        <div class="rt-inputplus">＋</div>
        <div class="rt-inputfield">Message...</div>
        <div class="rt-inputicon">◔</div>
        <div class="rt-inputsend">◉</div>
      </div>
    </section>
  `;
}

function ensureDMInitialized() {
  if (state.dmMessages.length > 0) return;

  const intro = `
    Hi! I noticed you were looking for renovation quotes recently. I prepared your request and submitted the 3P quote form for faster matching.
  `;

  const confirm = `
    Please confirm these details. If anything is off, reply here and I'll update the submission.
    ${buildConfirmCard(state.budget, "Auto submitted", state.submissionId)}
  `;

  state.dmMessages = [
    { role: "agent", html: intro, meta: "8:01 PM" },
    { role: "agent", html: confirm, meta: "8:01 PM" },
  ];
}

function buildConfirmCard(budget, badge, id) {
  return `
    <div class="rt-confirm-card">
      <div class="rt-confirm-top">
        <div class="rt-confirm-badge">${badge}</div>
        <div class="rt-confirm-id">${id}</div>
      </div>
      <div class="rt-confirm-title">Renovation request</div>
      <div class="rt-confirm-list">
        <div><span>Project</span><b>Living room + kitchen refresh</b></div>
        <div><span>City</span><b>Singapore</b></div>
        <div><span>Budget</span><b>${budget}</b></div>
        <div><span>Timeline</span><b>Start in 2 months</b></div>
      </div>
    </div>
  `;
}

function scheduleAutoWon() {
  if (state.dmAutoWonScheduled) return;
  state.dmAutoWonScheduled = true;

  window.setTimeout(() => {
    state.dmMessages.push({
      role: "agent",
      html: `
        Great news. The advertiser accepted the updated request and a contractor will follow up shortly.
        <div class="rt-final-card">
          <div class="rt-final-kicker">Closed Won</div>
          <div class="rt-final-title">Quote progressed after DM confirmation</div>
          <div class="rt-final-copy">Matched to a contractor and booked an onsite measurement.</div>
          <div class="rt-final-grid">
            <div>
              <span>Final budget</span>
              <b>${state.dmMessages.some((m) => m.tag === "budget-updated") ? state.revisedBudget : state.budget}</b>
            </div>
            <div>
              <span>Outcome</span>
              <b>Measurement booked</b>
            </div>
          </div>
        </div>
      `,
      meta: "8:05 PM",
      tag: "won",
    });
    render();
    scrollDMToBottom();
  }, 1400);
}

function scrollDMToBottom() {
  const body = document.querySelector(".rt-dm-body");
  if (!body) return;
  body.scrollTop = body.scrollHeight;
}

document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.getAttribute("data-action");

  if (action === "noop") return;
  if (action === "open-search") {
    state.hasRecentSearch = true;
    state.screen = "search";
  }
  if (action === "back-from-search") state.screen = "feed";
  if (action === "open-dm") {
    state.screen = "dm";
    // DM is rendered; initialize and keep bottom pinned.
    window.setTimeout(scrollDMToBottom, 0);
  }
  if (action === "back-feed") state.screen = "feed";

  if (action === "looks-good") {
    state.dmMessages.push({ role: "me", html: "Looks good.", meta: "8:02 PM", tag: "confirmed" });
    state.dmMessages.push({
      role: "agent",
      html: "Perfect. We will proceed with this submission and connect you with a contractor.",
      meta: "8:02 PM",
      tag: "confirmed",
    });
    scheduleAutoWon();
  }

  if (action === "adjust-budget") {
    state.dmMessages.push({
      role: "me",
      html: `Budget should be ${state.revisedBudget}.`,
      meta: "8:02 PM",
      tag: "budget-updated",
    });
    state.dmMessages.push({
      role: "agent",
      html: `
        Got it. I updated the 3P form and re-submitted the request to the advertiser.
        ${buildConfirmCard(state.revisedBudget, "Updated submission", state.leadId)}
      `,
      meta: "8:03 PM",
      tag: "budget-updated",
    });
    scheduleAutoWon();
  }

  render();
});

render();
