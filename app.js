const $ = (selector) => document.querySelector(selector);

const app = $("#app");
const pushLayer = $("#pushLayer");
const pushCard = $("#pushCard");
const topbar = $("#tiktokTop");
const tabbar = $("#tabbar");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const state = {
  screen: "feed", // feed | website | dm
  websiteMode: "submit", // submit | edit
  surveyAnswer: "",
  pushVisible: false,
  threadStarted: false,
  threadMessages: [],
  lead: {
    enrolledStatus: "",
    programInterest: "",
    educationLevel: "",
    phone: "",
  },
  submittedLead: null,
  submissionId: "",
  websiteSubmitting: false,
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatNow() {
  return "8:00 PM";
}

function buildPrefilledLead() {
  return {
    enrolledStatus: state.surveyAnswer || "Yes",
    programInterest: "Medical Administrative Assistant",
    educationLevel: "High School Diploma",
    phone: "+1 786 543 210",
  };
}

function render() {
  document.body.dataset.screen = state.screen;
  topbar.style.display = state.screen === "feed" ? "" : "none";
  tabbar.style.display = state.screen === "feed" ? "" : "none";
  pushLayer.setAttribute("aria-hidden", state.pushVisible ? "false" : "true");

  if (state.screen === "feed") app.innerHTML = renderFeed();
  if (state.screen === "website") app.innerHTML = renderWebsite();
  if (state.screen === "dm") app.innerHTML = renderDM();

  if (state.screen === "dm" && !state.threadStarted) startThread();
  if (state.screen === "dm") scrollDMToBottom();
}

function renderFeed() {
  return `
    <section class="feed-screen">
      <div class="feed-bg"></div>
      <div class="feed-mask"></div>
      <div class="feed-progress"><div style="width: 34%"></div></div>

      <aside class="feed-side" aria-hidden="true">
        <div class="side-item">
          <div class="side-icon uma-mini">UMA</div>
          <span>UMA</span>
        </div>
        <div class="side-item">
          <div class="side-icon">♥</div>
          <span>97.1K</span>
        </div>
        <div class="side-item">
          <div class="side-icon">💬</div>
          <span>1,200</span>
        </div>
        <div class="side-item">
          <div class="side-icon">↗</div>
          <span>1,256</span>
        </div>
      </aside>

      <div class="feed-copy">
        <div class="brand">UMD</div>
        <div class="desc">A team dedicated to each student, assisting with academic support.</div>
        <div class="sponsored">Sponsored</div>
      </div>

      <div class="survey-card">
        <div class="survey-meta">
          <span class="survey-tag">Sponsored</span>
          <button class="survey-close" type="button" data-action="noop">×</button>
        </div>
        <div class="survey-brand">UMA Survey</div>
        <div class="survey-question">Are you enrolled in school or pursuing studies as a student?</div>
        <div class="survey-options">
          <button class="${state.surveyAnswer === "Yes" ? "active" : ""}" type="button" data-action="survey-yes">Yes</button>
          <button class="${state.surveyAnswer === "No" ? "active" : ""}" type="button" data-action="survey-no">No</button>
        </div>
        <button class="survey-continue ${state.surveyAnswer ? "ready" : ""}" type="button" data-action="continue-to-website" ${
          state.surveyAnswer ? "" : "disabled"
        }>Continue</button>
      </div>
    </section>
  `;
}

function renderWebsite() {
  const lead = state.lead;
  const isEdit = state.websiteMode === "edit";
  const canSubmit = Boolean(lead.enrolledStatus && lead.programInterest && lead.educationLevel && lead.phone);

  return `
    <section class="website-shell">
      <div class="website-top">
        <button type="button" data-action="close-website">${isEdit ? "Back" : "Close"}</button>
        <div class="website-url">uma.example.com</div>
        <button type="button" data-action="noop">⋯</button>
      </div>

      <div class="website-body">
        <div class="uma-page">
          <div class="uma-header">
            <div class="uma-logo-left">UMA</div>
            <div class="uma-logo-right">MEDICAL<br/>ACADEMY</div>
          </div>

          <div class="uma-brand-lockup">
            <div class="uma-lockup-badge">UMA</div>
            <div class="uma-lockup-title">Ultimate Medical Academy</div>
            <div class="uma-lockup-copy">
              We're excited you want to learn more about Ultimate Medical Academy. Please confirm your information and we'll contact you soon.
            </div>
          </div>

          <div class="uma-section-title">Please select which program you would like to learn more about.</div>
          <div class="uma-question-title">Are you enrolled in school or pursuing studies as a student?</div>

          <div class="uma-radio-list">
            <label class="uma-radio ${lead.enrolledStatus === "Yes" ? "checked" : ""}">
              <span>Yes</span>
              <span class="uma-radio-ui"></span>
              <input type="radio" name="enrolled" value="Yes" ${lead.enrolledStatus === "Yes" ? "checked" : ""} />
            </label>
            <label class="uma-radio ${lead.enrolledStatus === "No" ? "checked" : ""}">
              <span>No</span>
              <span class="uma-radio-ui"></span>
              <input type="radio" name="enrolled" value="No" ${lead.enrolledStatus === "No" ? "checked" : ""} />
            </label>
          </div>

          <div class="uma-field uma-field-select">
            <div class="uma-field-label">Program of Interest (Required)</div>
            <div class="uma-field-control">
              <input id="field-program" value="${escapeAttr(lead.programInterest)}" ${isEdit ? "" : "readonly"} />
              <span class="uma-chevron">›</span>
            </div>
          </div>

          <div class="uma-field uma-field-select">
            <div class="uma-field-label">Highest Level of Education Completed (Required)</div>
            <div class="uma-field-control">
              <input id="field-education" value="${escapeAttr(lead.educationLevel)}" ${isEdit ? "" : "readonly"} />
              <span class="uma-chevron">›</span>
            </div>
          </div>

          <div class="uma-field">
            <div class="uma-field-label">Phone Number</div>
            <div class="uma-field-control">
              <input id="field-phone" value="${escapeAttr(lead.phone)}" ${isEdit ? "" : "readonly"} />
            </div>
          </div>

          <div class="uma-actions">
            <button class="uma-next ${canSubmit ? "ready" : ""}" type="button" data-action="${
              isEdit ? "submit-updated-website" : "submit-website"
            }" ${canSubmit ? "" : "disabled"}>
              ${state.websiteSubmitting ? "Submitting..." : isEdit ? "Confirm updates" : "Next"}
            </button>
          </div>

          <div class="website-hint">
            AI has pre-filled the website form. Review it and submit. After submission, the merchant will send a push message to confirm everything.
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDM() {
  const messages = state.threadMessages
    .map((message) => {
      const me = message.role === "me";
      return `
        <div class="bubble ${me ? "me" : ""}">
          ${message.html}
          <div class="bubble-meta">${message.meta}</div>
        </div>
      `;
    })
    .join("");

  const hasPendingConfirm = !state.threadMessages.some((m) => m.role === "me" && typeof m.html === "string" && m.html.includes("I am ok with this"));
  const suggestions = hasPendingConfirm
    ? `
        <div class="dm-suggestions">
          <button type="button" data-action="confirm-details">I am ok with this</button>
          <button type="button" data-action="modify-details">Modify details</button>
          <button type="button" data-action="noop">Ask a question</button>
        </div>
      `
    : "";

  return `
    <section class="dm-shell">
      <div class="dm-top">
        <button type="button" data-action="back-to-feed">‹</button>
        <div class="dm-brand">
          <div class="dm-brand-badge">UMA</div>
          <div>
            <div class="dm-brand-title">Ultimate Medical Academy <span class="dm-verified">●</span></div>
            <div class="dm-brand-sub">Business chat</div>
          </div>
        </div>
        <div class="dm-top-actions">
          <button type="button" data-action="noop">⚑</button>
          <button type="button" data-action="noop">⋯</button>
        </div>
      </div>

      <div class="dm-body" id="dmBody">
        <div class="dm-hero">
          <div class="dm-time">8:00 PM</div>
          <div class="dm-hero-logo">UMA</div>
          <div class="dm-hero-name">Ultimate Medical Academy</div>
          <div class="dm-hero-meta">Admissions support · online programs</div>
          <div class="dm-hero-meta">Typically replies in 10 minutes</div>
          <div class="dm-hero-note">You open this chat through business Ads. <span>Learn more about business chats and your privacy.</span></div>
          <div class="dm-hero-note">You viewed an ad before opening this chat. <span>View ad</span></div>
        </div>
        ${messages}
      </div>

      ${suggestions}

      <div class="dm-input">
        <div class="dm-input-icon">◉</div>
        <input class="dm-input-field" placeholder="Message..." disabled />
        <div class="dm-input-icon">◔</div>
        <div class="dm-input-icon">▣</div>
        <div class="dm-input-send">◉</div>
      </div>
    </section>
  `;
}

function buildMerchantConfirmCard(lead, options = {}) {
  const badge = options.badge || "Submitted";
  const title = options.title || "Please confirm these submitted details";

  return `
    <div class="confirm-card ${options.userCard ? "user-card" : ""}">
      <div class="confirm-top">
        <div class="confirm-badge">${badge}</div>
        <div class="confirm-id">${escapeHTML(state.submissionId)}</div>
      </div>
      <div class="confirm-title">${title}</div>
      <div class="confirm-list">
        <div><span>Student</span><b>${escapeHTML(lead.enrolledStatus)}</b></div>
        <div><span>Program</span><b>${escapeHTML(lead.programInterest)}</b></div>
        <div><span>Phone</span><b>${escapeHTML(lead.phone)}</b></div>
        <div><span>Education</span><b>${escapeHTML(lead.educationLevel)}</b></div>
      </div>
    </div>
  `;
}

function startThread() {
  state.threadStarted = true;
  state.threadMessages = [
    {
      role: "agent",
      html: "Welcome to Ultimate Medical Academy, we're glad to serve you~",
      meta: formatNow(),
    },
    {
      role: "agent",
      html:
        "Hello, what can I help you with? We received your website submission. Please confirm the information below." +
        buildMerchantConfirmCard(state.submittedLead, { badge: "Submitted" }),
      meta: formatNow(),
    },
  ];
  render();
}

async function submitWebsite() {
  if (state.websiteSubmitting) return;
  state.websiteSubmitting = true;
  render();
  await sleep(700);
  state.submittedLead = clone(readWebsiteForm());
  state.submissionId = `SUB-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
  state.websiteSubmitting = false;
  state.screen = "feed";
  render();
  await sleep(900);
  showPush();
}

async function submitUpdatedWebsite() {
  if (state.websiteSubmitting) return;
  state.websiteSubmitting = true;
  render();
  await sleep(600);
  state.submittedLead = clone(readWebsiteForm());
  state.websiteSubmitting = false;
  state.screen = "dm";
  state.websiteMode = "submit";
  state.threadMessages.push({
    role: "me",
    html: buildMerchantConfirmCard(state.submittedLead, {
      badge: "Updated Submission",
      title: "I updated the details below",
      userCard: true,
      actions: false,
    }),
    meta: formatNow(),
  });
  state.threadMessages.push({
    role: "agent",
    html: "Thanks, we received your updated information.",
    meta: formatNow(),
  });
  render();
}

function showPush() {
  state.pushVisible = true;
  render();
}

function openDMFromPush() {
  state.pushVisible = false;
  state.screen = "dm";
  state.threadStarted = false;
  render();
}

function openWebsiteFromFeed() {
  state.lead = buildPrefilledLead();
  state.screen = "website";
  state.websiteMode = "submit";
  state.websiteSubmitting = false;
  render();
}

function openWebsiteEdit() {
  state.lead = clone(state.submittedLead);
  state.screen = "website";
  state.websiteMode = "edit";
  state.websiteSubmitting = false;
  render();
}

function confirmSubmittedDetails() {
  state.threadMessages.push({
    role: "me",
    html: "I am ok with this",
    meta: formatNow(),
  });
  state.threadMessages.push({
    role: "agent",
    html: "Perfect. We will follow up with you shortly.",
    meta: formatNow(),
  });
  render();
}

function readWebsiteForm() {
  const enrolled = document.querySelector('input[name="enrolled"]:checked')?.value || state.lead.enrolledStatus;
  return {
    enrolledStatus: enrolled,
    programInterest: $("#field-program")?.value?.trim() || "",
    educationLevel: $("#field-education")?.value?.trim() || "",
    phone: $("#field-phone")?.value?.trim() || "",
  };
}

function scrollDMToBottom() {
  const el = $("#dmBody");
  if (el) el.scrollTop = el.scrollHeight;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHTML(value).replaceAll("\n", " ");
}

document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.getAttribute("data-action");

  if (action === "survey-yes") {
    state.surveyAnswer = "Yes";
    render();
  }
  if (action === "survey-no") {
    state.surveyAnswer = "No";
    render();
  }
  if (action === "continue-to-website" && state.surveyAnswer) {
    openWebsiteFromFeed();
  }
  if (action === "close-website") {
    state.screen = state.websiteMode === "edit" ? "dm" : "feed";
    state.websiteMode = "submit";
    render();
  }
  if (action === "submit-website") void submitWebsite();
  if (action === "submit-updated-website") void submitUpdatedWebsite();
  if (action === "modify-details") {
    const sug = document.querySelector(".dm-suggestions");
    if (sug) {
      sug.style.transition = "opacity 150ms ease";
      sug.style.opacity = "0";
    }
    window.setTimeout(() => openWebsiteEdit(), 160);
    return;
  }
  if (action === "confirm-details") {
    const sug = document.querySelector(".dm-suggestions");
    if (sug) {
      sug.style.transition = "opacity 150ms ease";
      sug.style.opacity = "0";
    }
    window.setTimeout(() => {
      confirmSubmittedDetails();
      scrollDMToBottom();
    }, 160);
    return;
  }
  if (action === "back-to-feed") {
    state.screen = "feed";
    render();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.name === "enrolled") {
    state.lead.enrolledStatus = target.value;
    render();
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.id === "field-program") state.lead.programInterest = target.value;
  if (target.id === "field-education") state.lead.educationLevel = target.value;
  if (target.id === "field-phone") state.lead.phone = target.value;
});

pushCard.addEventListener("click", () => openDMFromPush());

render();
