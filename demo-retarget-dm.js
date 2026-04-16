const app = document.querySelector("#app");

const state = {
  screen: "feed",
  hasRecentSearch: false,
  leadEntry: "feed",
  leadId: "LEAD-RNV-2048",
  submissionId: "SUB-RNV-9A31",
  budget: "$30k",
  revisedBudget: "$45k",
  dmMessages: [],
  dmAutoWonScheduled: false,
  dmInitialized: false,
  pushShown: false,
  pushDismissed: false,
};

function render() {
  if (state.screen === "feed") app.innerHTML = renderFeed();
  if (state.screen === "search") app.innerHTML = renderSearch();
  if (state.screen === "lead") app.innerHTML = renderLeadDetail();
  if (state.screen === "dm") app.innerHTML = renderDM();

  if (state.screen === "feed" && !state.pushShown) {
    state.pushShown = true;
    window.setTimeout(() => {
      const push = document.querySelector(".rt-push");
      if (push) push.classList.add("rt-push-show");
    }, 100);
  }
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
        <button class="rt-card rt-lead rt-lead-clickable rt-lead-card" type="button" data-action="open-lead" data-from="search">
          <div class="rt-lead-topline">
            <div class="rt-lead-kicker">LEAD CARD</div>
            <div class="rt-lead-pill">Not completed</div>
          </div>
          <div class="rt-lead-title">Modern apartment renovation inquiry</div>

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
        </button>
      </div>
    </section>
  `;
}

function renderFeed() {
  const push = !state.pushDismissed
    ? `
      <div class="rt-push" data-action="open-lead" data-from="feed">
        <div class="rt-push-avatar">RF</div>
        <div class="rt-push-body">
          <div class="rt-push-app">TikTok</div>
          <div class="rt-push-text">RenoFlow: Your renovation quote is ready</div>
        </div>
        <div class="rt-push-time">now</div>
      </div>
    `
    : "";

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

      ${push}

      <div class="rt-feed-rail">
        <div class="rt-rail-item">
          <button class="rt-rail-icon rt-rail-click rt-rail-retarget" type="button" data-action="open-lead" data-from="feed">RF</button>
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

function renderLeadDetail() {
  const backAction = state.leadEntry === "search" ? "back-to-search" : "back-feed";
  const contextLabel = state.leadEntry === "search" ? "From Search" : "From Feed retargeting";
  const isIncomplete = !state.hasRecentSearch;
  const budget = isIncomplete ? "Missing" : state.budget;
  const statusLabel = isIncomplete ? "Not completed" : "Prepared";

  return `
    <section class="rt-shell rt-lead-detail">
      <div class="rt-statusbar rt-statusbar-light">
        <span>9:41</span>
        <span>5G 100%</span>
      </div>

      <div class="rt-lead-topbar">
        <button class="rt-back" type="button" data-action="${backAction}">‹</button>
        <div class="rt-search-title">Lead details</div>
        <div class="rt-nav-spacer"></div>
      </div>

      <div class="rt-lead-detail-body">
        <div class="rt-note">${contextLabel}</div>

        <div class="rt-card rt-lead-detail-card rt-lead-card">
          <div class="rt-lead-topline">
            <div class="rt-lead-kicker">LEAD CARD</div>
            <div class="rt-lead-pill">${statusLabel}</div>
          </div>
          <div class="rt-lead-title">Modern apartment renovation inquiry</div>

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
              <b>${budget}</b>
            </div>
            <div class="rt-field">
              <span>Timeline</span>
              <b>Start in 2 months</b>
            </div>
          </div>

          <div class="rt-lead-tip">
            We can confirm the missing fields in DM. Agent may submit the 3P quote form first to speed up matching, then confirm details with you here.
          </div>

          <div class="rt-lead-actions">
            <button class="rt-btn rt-btn-secondary" type="button" data-action="${backAction}">Back</button>
            <button class="rt-btn rt-btn-primary" type="button" data-action="open-dm">Message</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDM() {
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

  const showConfirmChips = state.dmInitialized && !state.dmMessages.some((m) => m.tag === "confirmed") && !state.dmMessages.some((m) => m.tag === "budget-updated");
  const chips = showConfirmChips
    ? `
      <div class="rt-dm-suggestions">
        <button class="rt-suggestion-chip" type="button" data-action="looks-good">Looks good to me</button>
        <button class="rt-suggestion-chip" type="button" data-action="adjust-budget">${state.revisedBudget} works better</button>
        <button class="rt-suggestion-chip" type="button" data-action="need-cheaper">Can you lower the quote?</button>
      </div>
    `
    : "";

  return `
    <section class="rt-shell rt-dm-screen">
      <div class="rt-dm-top">
        <button class="rt-dm-back" type="button" data-action="back-feed" aria-label="Back">‹</button>
        <div class="rt-dm-brand">
          <div class="rt-dm-avatar">RF</div>
          <div class="rt-dm-brand-text">
            <div class="rt-dm-brand-line1">
              <b>RenoFlow</b>
              <span class="rt-dm-verified" aria-hidden="true">●</span>
            </div>
            <div class="rt-dm-brand-line2">Business chat</div>
          </div>
        </div>
        <div class="rt-dm-actions-top">
          <button class="rt-dm-icon" type="button" data-action="noop" aria-label="Flag">⚑</button>
          <button class="rt-dm-icon" type="button" data-action="noop" aria-label="More">⋯</button>
        </div>
      </div>

      <div class="rt-dm-body">
        <div class="rt-dm-hero">
          <div class="rt-dm-hero-logo">RF</div>
          <div class="rt-dm-hero-name">RenoFlow</div>
          <div class="rt-dm-hero-meta">56 videos · 240K followers</div>
          <div class="rt-dm-hero-meta">Typically replies in 10 minutes</div>
          <div class="rt-dm-divider">8:00 PM</div>
          <div class="rt-dm-note">
            You open this chat through business Ads. <a href="#" data-action="noop">Learn more about business chats and your privacy.</a>
          </div>
          <div class="rt-dm-note">
            You viewed an ad before opening this chat. <a href="#" data-action="noop">View ad</a>
          </div>
        </div>
        ${bubbles}
      </div>

      ${chips}

      <div class="rt-inputbar">
        <button class="rt-inputcam" type="button" data-action="noop" aria-label="Camera">◉</button>
        <div class="rt-inputfield">Message...</div>
        <button class="rt-inputicon" type="button" data-action="noop" aria-label="Emoji">☺</button>
        <button class="rt-inputicon" type="button" data-action="noop" aria-label="Photo">▣</button>
      </div>
    </section>
  `;
}

function initDM() {
  if (state.dmInitialized) return;
  state.dmInitialized = true;

  window.setTimeout(() => {
    if (state.screen !== "dm") return;
    state.dmMessages.push({
      role: "agent",
      html:
        "We already submitted the 3P form to speed up matching. Please confirm the details below." +
        buildConfirmCard(state.budget, "Auto submitted", state.submissionId),
      meta: "8:01 PM",
    });
    render();
    scrollDMToBottom();
  }, 650);
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
  window.setTimeout(() => {
    body.scrollTop = body.scrollHeight;
  }, 30);
}

function dismissPush() {
  state.pushDismissed = true;
  const push = document.querySelector(".rt-push");
  if (push) {
    push.style.transition = "opacity 200ms ease, transform 200ms ease";
    push.style.opacity = "0";
    push.style.transform = "translateY(-20px)";
    window.setTimeout(() => { if (push.parentNode) push.remove(); }, 200);
  }
}

document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.getAttribute("data-action");

  if (action === "noop") return;

  if (action === "open-search") {
    state.hasRecentSearch = true;
    state.screen = "search";
    dismissPush();
  }
  if (action === "back-from-search") state.screen = "feed";
  if (action === "back-to-search") state.screen = "search";

  if (action === "open-lead") {
    const from = actionEl.getAttribute("data-from");
    state.leadEntry = from === "search" ? "search" : "feed";
    state.screen = "lead";
    dismissPush();
  }

  if (action === "open-dm") {
    state.screen = "dm";
    initDM();
    window.setTimeout(scrollDMToBottom, 0);
  }
  if (action === "back-feed") state.screen = "feed";

  if (action === "looks-good" || action === "adjust-budget" || action === "need-cheaper") {
    const suggestionsEl = document.querySelector(".rt-dm-suggestions");
    if (suggestionsEl) {
      suggestionsEl.style.transition = "opacity 150ms ease";
      suggestionsEl.style.opacity = "0";
    }

    window.setTimeout(() => {
      if (action === "looks-good") {
        state.dmMessages.push({ role: "me", html: "Looks good to me.", meta: "8:02 PM", tag: "confirmed" });
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
          html: `${state.revisedBudget} works better.`,
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

      if (action === "need-cheaper") {
        state.dmMessages.push({
          role: "me",
          html: "Can you lower the quote?",
          meta: "8:02 PM",
          tag: "budget-updated",
        });
        state.dmMessages.push({
          role: "agent",
          html: `
            Understood. I lowered the target budget to ${state.revisedBudget} and updated the 3P submission for a lower quote range.
            ${buildConfirmCard(state.revisedBudget, "Updated submission", state.leadId)}
          `,
          meta: "8:03 PM",
          tag: "budget-updated",
        });
        scheduleAutoWon();
      }

      render();
      scrollDMToBottom();
    }, 160);
    return;
  }

  render();
});

render();
