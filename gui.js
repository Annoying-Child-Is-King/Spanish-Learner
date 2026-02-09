https://raw.githubusercontent.com/Annoying-Child-Is-King/Spanish-Learner/refs/heads/main/gui.js

(function () {
  // Prevent double-loading
  if (window.__spanish_tool_opened) {
    const ov = document.getElementById("spanish-tool-overlay");
    if (ov) ov.style.display = "flex";
    return;
  }
  window.__spanish_tool_opened = true;

  // Small helper to create elements with inline styles
  function mk(tag, css) {
    const e = document.createElement(tag);
    Object.assign(e.style, css || {});
    return e;
  }

  // ---------------------------
  // Overlay and main container
  // ---------------------------
  const overlay = mk("div", {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.65)",
    zIndex: 2147483647,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
  });
  overlay.id = "spanish-tool-overlay";

  const box = mk("div", {
    width: "720px",
    maxWidth: "96%",
    background: "#070707",
    color: "#eaeaea",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
    border: "1px solid #222",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative"
  });

  // ---------------------------
  // Header
  // ---------------------------
  const header = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  });
  const title = mk("div");
  title.innerHTML =
    '<div style="font-weight:700;font-size:15px">Spanish Helper v2.3</div>' +
    '<div style="font-size:12px;color:#aaa">Hide: Ctrl+Shift+E • Auto-hide: Ctrl+Shift+\\ • Close: Esc • Translate: Ctrl/Cmd+Enter</div>';
  const closeBtn = mk("button", {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "16px"
  });
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => overlay.remove();
  header.appendChild(title);
  header.appendChild(closeBtn);
  box.appendChild(header);

  // ---------------------------
  // Toolbar
  // ---------------------------
  const toolbar = mk("div", {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "4px"
  });
  function makeBtn(label) {
    const b = mk("button", {
      background: "#0f0f0f",
      color: "#ddd",
      border: "1px solid #222",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      height: "30px"
    });
    b.textContent = label;
    b.onmouseenter = () => (b.style.background = "#181818");
    b.onmouseleave = () => (b.style.background = "#0f0f0f");
    return b;
  }
  const translateModeBtn = makeBtn("Translate");
  translateModeBtn.style.boxShadow = "inset 0 -2px 0 #e11d48";
  const dirToggleBtn = makeBtn("EN → ES");
  const moreBtn = makeBtn("More ▼");
  toolbar.appendChild(translateModeBtn);
  toolbar.appendChild(dirToggleBtn);
  toolbar.appendChild(moreBtn);
  box.appendChild(toolbar);

  // ---------------------------
  // Direction state and labels
  // ---------------------------
  let currentDir = "en-es"; // "en-es" or "es-en"
  let inLabel, outLabel, input, output;

  function updateIOLabels() {
    if (!inLabel || !outLabel) return;
    if (currentDir === "en-es") {
      inLabel.textContent = "Input (English)";
      outLabel.textContent = "Output (Spanish)";
      dirToggleBtn.textContent = "EN → ES";
    } else {
      inLabel.textContent = "Input (Spanish)";
      outLabel.textContent = "Output (English)";
      dirToggleBtn.textContent = "ES → EN";
    }
  }

  // ---------------------------
  // Main content (left/right)
  // ---------------------------
  const content = mk("div", {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "6px"
  });

  // Left (input)
  const left = mk("div", {
    minHeight: "220px",
    background: "#070707",
    border: "1px solid #111",
    padding: "10px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  });
  inLabel = mk("div", { color: "#bbb", fontSize: "12px" });
  input = mk("textarea", {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px",
    background: "#050505",
    color: "#eee",
    border: "1px solid #222",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "13px",
    resize: "vertical",
    minHeight: "120px"
  });
  input.rows = 5;
  left.appendChild(inLabel);
  left.appendChild(input);

  // Right (output)
  const right = mk("div", {
    minHeight: "220px",
    background: "#070707",
    border: "1px solid #111",
    padding: "10px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  });
  outLabel = mk("div", { color: "#bbb", fontSize: "12px" });
  output = mk("textarea", {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px",
    background: "#050505",
    color: "#7efc6a",
    border: "1px solid #222",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "13px",
    resize: "vertical",
    minHeight: "120px"
  });
  output.readOnly = true;
  right.appendChild(outLabel);
  right.appendChild(output);

  content.appendChild(left);
  content.appendChild(right);
  box.appendChild(content);

  // ---------------------------
  // Dropdown (More)
  // ---------------------------
  const dropdown = mk("div", {
    position: "absolute",
    background: "#050505",
    border: "1px solid #222",
    borderRadius: "6px",
    padding: "6px",
    marginTop: "4px",
    minWidth: "180px",
    display: "none",
    flexDirection: "column",
    gap: "4px",
    fontSize: "12px"
  });
  function ddItem(label) {
    const d = mk("div", {
      padding: "4px 6px",
      cursor: "pointer",
      borderRadius: "4px"
    });
    d.textContent = label;
    d.onmouseenter = () => (d.style.background = "#181818");
    d.onmouseleave = () => (d.style.background = "transparent");
    return d;
  }
  const aboutItem = ddItem("About");
  const settingsItem = ddItem("Settings");
  const helpItem = ddItem("Help");
  dropdown.appendChild(aboutItem);
  dropdown.appendChild(settingsItem);
  dropdown.appendChild(helpItem);
  box.appendChild(dropdown);

  let dropdownOpen = false;
  moreBtn.onclick = function (e) {
    e.stopPropagation();
    dropdownOpen = !dropdownOpen;
    dropdown.style.display = dropdownOpen ? "flex" : "none";
    if (dropdownOpen) {
      const rect = moreBtn.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      dropdown.style.left = rect.left - boxRect.left + "px";
      dropdown.style.top = rect.bottom - boxRect.top + 4 + "px";
    }
  };
  document.addEventListener("click", function (e) {
    if (!dropdownOpen) return;
    if (!dropdown.contains(e.target) && e.target !== moreBtn) {
      dropdown.style.display = "none";
      dropdownOpen = false;
    }
  });

  // ---------------------------
  // Vocabulary panel
  // ---------------------------
  const vocabPanel = mk("div", {
    marginTop: "4px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #222",
    background: "#050505",
    fontSize: "11px",
    color: "#ccc",
    display: "none"
  });
  const vocabHeader = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
    cursor: "pointer"
  });
  const vocabTitle = mk("div", { fontWeight: "600" });
  vocabTitle.textContent = "Vocabulary";
  const vocabToggle = mk("div", { fontSize: "11px", color: "#aaa" });
  vocabToggle.textContent = "▼";
  vocabHeader.appendChild(vocabTitle);
  vocabHeader.appendChild(vocabToggle);
  const vocabBody = mk("div", { display: "block", lineHeight: "1.4" });
  vocabBody.innerHTML =
    '<div><b>Word:</b> <span id="vocab-word">—</span></div>' +
    '<div><b>Part of speech:</b> <span id="vocab-pos">—</span></div>' +
    '<div><b>Gender:</b> <span id="vocab-gender">—</span></div>' +
    '<div><b>Plural:</b> <span id="vocab-plural">—</span></div>' +
    '<div><b>Category:</b> <span id="vocab-cat">—</span></div>' +
    '<div style="margin-top:6px;"><b>Definition:</b></div>' +
    '<div id="vocab-def" style="white-space:pre-wrap; line-height:1.45; margin-left:6px; max-height:60px; overflow-y:auto; border-left:2px solid #333; padding-left:6px;">—</div>';
  vocabPanel.appendChild(vocabHeader);
  vocabPanel.appendChild(vocabBody);
  right.appendChild(vocabPanel);

  let vocabCollapsed = false;
  vocabHeader.onclick = function () {
    vocabCollapsed = !vocabCollapsed;
    vocabBody.style.display = vocabCollapsed ? "none" : "block";
    vocabToggle.textContent = vocabCollapsed ? "▲" : "▼";
  };

  const vocabWordEl = vocabPanel.querySelector("#vocab-word");
  const vocabPosEl = vocabPanel.querySelector("#vocab-pos");
  const vocabGenderEl = vocabPanel.querySelector("#vocab-gender");
  const vocabPluralEl = vocabPanel.querySelector("#vocab-plural");
  const vocabCatEl = vocabPanel.querySelector("#vocab-cat");
  const vocabDefEl = vocabPanel.querySelector("#vocab-def");

  // ---------------------------
  // Grammar panel
  // ---------------------------
  const grammarPanel = mk("div", {
    marginTop: "4px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #222",
    background: "#050505",
    fontSize: "11px",
    color: "#ccc",
    display: "none"
  });
  const grammarHeader = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
    cursor: "pointer"
  });
  const grammarTitle = mk("div", { fontWeight: "600" });
  grammarTitle.textContent = "Grammar Analysis";
  const grammarToggle = mk("div", { fontSize: "11px", color: "#aaa" });
  grammarToggle.textContent = "▼";
  grammarHeader.appendChild(grammarTitle);
  grammarHeader.appendChild(grammarToggle);

  const grammarBody = mk("div", { display: "block", lineHeight: "1.4" });
  grammarBody.innerHTML =
    '<div><b>Subjects:</b> <span id="gram-subjects">—</span></div>' +
    '<div><b>Verbs:</b> <span id="gram-verbs">—</span></div>' +
    '<div><b>Nouns:</b> <span id="gram-nouns">—</span></div>' +
    '<div><b>Adjectives:</b> <span id="gram-adjs">—</span></div>' +
    '<div><b>Adverbs:</b> <span id="gram-advs">—</span></div>' +
    '<div><b>Articles:</b> <span id="gram-arts">—</span></div>' +
    '<div><b>Prepositions:</b> <span id="gram-preps">—</span></div>' +
    '<div><b>Conjunctions:</b> <span id="gram-conjs">—</span></div>';
  grammarPanel.appendChild(grammarHeader);
  grammarPanel.appendChild(grammarBody);
  right.appendChild(grammarPanel);

  let grammarCollapsed = false;
  grammarHeader.onclick = function () {
    grammarCollapsed = !grammarCollapsed;
    grammarBody.style.display = grammarCollapsed ? "none" : "block";
    grammarToggle.textContent = grammarCollapsed ? "▲" : "▼";
  };

  const gramSubjectsEl = grammarPanel.querySelector("#gram-subjects");
  const gramVerbsEl = grammarPanel.querySelector("#gram-verbs");
  const gramNounsEl = grammarPanel.querySelector("#gram-nouns");
  const gramAdjsEl = grammarPanel.querySelector("#gram-adjs");
  const gramAdvsEl = grammarPanel.querySelector("#gram-advs");
  const gramArtsEl = grammarPanel.querySelector("#gram-arts");
  const gramPrepsEl = grammarPanel.querySelector("#gram-preps");
  const gramConjsEl = grammarPanel.querySelector("#gram-conjs");

  // ---------------------------
  // Actions row + status
  // ---------------------------
  const actions = mk("div", {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
    flexWrap: "wrap"
  });
  const speakBtn = makeBtn("Speak");
  const copyBtn = makeBtn("Copy");
  const clearBtn = makeBtn("Clear");
  actions.appendChild(speakBtn);
  actions.appendChild(copyBtn);
  actions.appendChild(clearBtn);

  const status = mk("div", {
    fontSize: "11px",
    color: "#888",
    marginTop: "2px",
    minHeight: "14px"
  });
   let statusTimer = null;
   function setStatus(msg, color, timeoutMs = 1200) {
    status.textContent = msg || "";
    status.style.color = color || "#888";

    if (statusTimer) clearTimeout(statusTimer);

    if (timeoutMs && msg) {
      statusTimer = setTimeout(() => {
        if (status.textContent === msg) status.textContent = "";
      }, timeoutMs);
    }
  }

  box.appendChild(actions);
  box.appendChild(status);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
  input.focus();

  // ---------------------------
  // Settings panel
  // ---------------------------
  const settingsPanel = mk("div", {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    background: "#050505",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    minWidth: "260px",
    display: "none",
    flexDirection: "column",
    gap: "8px",
    zIndex: 2147483648
  });
  const spTitle = mk("div", { fontWeight: "700", fontSize: "13px" });
  spTitle.textContent = "Settings";

  // Auto-hide
  const autoHideRow = mk("label", {
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });
  const autoHideChk = document.createElement("input");
  autoHideChk.type = "checkbox";
  const autoHideLbl = document.createElement("span");
  autoHideLbl.textContent = "Auto-hide after switching tabs";
  autoHideRow.appendChild(autoHideChk);
  autoHideRow.appendChild(autoHideLbl);

  // Auto-copy
  const autoCopyRow = mk("label", {
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });
  const autoCopyChk = document.createElement("input");
  autoCopyChk.type = "checkbox";
  const autoCopyLbl = document.createElement("span");
  autoCopyLbl.textContent = "Auto-copy translation to clipboard";
  autoCopyRow.appendChild(autoCopyChk);
  autoCopyRow.appendChild(autoCopyLbl);

  // Live translation
  const liveRow = mk("label", {
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });
  const liveChk = document.createElement("input");
  liveChk.type = "checkbox";
  const liveLbl = document.createElement("span");
  liveLbl.textContent = "Live translation (while typing)";
  liveRow.appendChild(liveChk);
  liveRow.appendChild(liveLbl);

  // Vocabulary mode
  const vocabRow = mk("label", {
    fontSize: "12px",
    display: "flex",
    gap: "6px",
    flexDirection: "column",
    alignItems: "flex-start"
  });
  const vocabTop = mk("div", {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });
  const vocabChk = document.createElement("input");
  vocabChk.type = "checkbox";
  const vocabLbl = document.createElement("span");
  vocabLbl.textContent = "Enable Vocabulary Mode";
  vocabTop.appendChild(vocabChk);
  vocabTop.appendChild(vocabLbl);
  const vocabNote = mk("div", {
    fontSize: "10px",
    color: "#777",
    marginLeft: "22px"
  });
  vocabNote.textContent =
    "Heuristic only. Good for learning, not perfect dictionary accuracy.";
  vocabRow.appendChild(vocabTop);
  vocabRow.appendChild(vocabNote);

  // Grammar mode
  const grammarRow = mk("label", {
    fontSize: "12px",
    display: "flex",
    gap: "6px",
    flexDirection: "column",
    alignItems: "flex-start"
  });
  const grammarTop = mk("div", {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });
  const grammarChk = document.createElement("input");
  grammarChk.type = "checkbox";
  const grammarLbl = document.createElement("span");
  grammarLbl.textContent = "Enable Grammar Mode";
  grammarTop.appendChild(grammarChk);
  grammarTop.appendChild(grammarLbl);
  const grammarNote = mk("div", {
    fontSize: "10px",
    color: "#777",
    marginLeft: "22px"
  });
  grammarNote.textContent =
    "Approximate structure view. Helpful for practice, not a strict grammar checker.";
  grammarRow.appendChild(grammarTop);
  grammarRow.appendChild(grammarNote);

  // Voice speed
  const rateRow = mk("div", {
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  });
  const rateLbl = document.createElement("span");
  rateLbl.textContent = "Voice speed (1 = normal):";
  const rateInput = document.createElement("input");
  rateInput.type = "range";
  rateInput.min = "0.5";
  rateInput.max = "1.5";
  rateInput.step = "0.1";
  rateInput.value = "1.0";
  const rateValue = document.createElement("span");
  rateValue.style.fontSize = "11px";
  rateValue.style.color = "#aaa";
  rateRow.appendChild(rateLbl);
  rateRow.appendChild(rateInput);
  rateRow.appendChild(rateValue);

  const settingsButtons = mk("div", {
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px",
    marginTop: "4px"
  });
  const settingsClose = makeBtn("Close");
  settingsButtons.appendChild(settingsClose);

  settingsPanel.appendChild(spTitle);
  settingsPanel.appendChild(autoHideRow);
  settingsPanel.appendChild(autoCopyRow);
  settingsPanel.appendChild(liveRow);
  settingsPanel.appendChild(vocabRow);
  settingsPanel.appendChild(grammarRow);
  settingsPanel.appendChild(rateRow);
  settingsPanel.appendChild(settingsButtons);
  box.appendChild(settingsPanel);

  // ---------------------------
  // Settings storage and defaults
  // ---------------------------
  const SETTINGS_KEY = "__spanish_tool_settings";
  let settings = {
    autoHide: false,
    autoCopy: false,
    rate: 1.0,
    live: true,
    vocab: false,
    grammar: false
  };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.autoHide === "boolean") settings.autoHide = parsed.autoHide;
      if (typeof parsed.autoCopy === "boolean") settings.autoCopy = parsed.autoCopy;
      if (typeof parsed.live === "boolean") settings.live = parsed.live;
      if (typeof parsed.rate === "number") settings.rate = parsed.rate;
      if (typeof parsed.vocab === "boolean") settings.vocab = parsed.vocab;
      if (typeof parsed.grammar === "boolean") settings.grammar = parsed.grammar;
    }
  } catch (e) {}

  autoHideChk.checked = settings.autoHide;
  autoCopyChk.checked = settings.autoCopy;
  liveChk.checked = settings.live;
  vocabChk.checked = settings.vocab;
  grammarChk.checked = settings.grammar;
  rateInput.value = String(settings.rate);

  function updateRateDisplay() {
    const v = parseFloat(rateInput.value) || 1.0;
    rateValue.textContent = "Current: " + v.toFixed(1) + "x";
  }
  updateRateDisplay();
  rateInput.addEventListener("input", function () {
    settings.rate = parseFloat(rateInput.value) || 1.0;
    updateRateDisplay();
  });

  function applyPanelsVisibility() {
    vocabPanel.style.display = settings.vocab ? "block" : "none";
    grammarPanel.style.display = settings.grammar ? "block" : "none";
  }
  applyPanelsVisibility();

  function saveSettings() {
    settings.autoHide = autoHideChk.checked;
    settings.autoCopy = autoCopyChk.checked;
    settings.live = liveChk.checked;
    settings.vocab = vocabChk.checked;
    settings.grammar = grammarChk.checked;
    settings.rate = parseFloat(rateInput.value) || 1.0;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
    applyPanelsVisibility();
  }

  settingsItem.onclick = function () {
    dropdown.style.display = "none";
    dropdownOpen = false;
    settingsPanel.style.display = "flex";
  };
  settingsClose.onclick = function () {
    saveSettings();
    settingsPanel.style.display = "none";
  };

  autoHideChk.addEventListener("change", () => {
    saveSettings();
    setStatus(
      "Auto-hide: " + (autoHideChk.checked ? "ON (after inactivity)" : "OFF"),
      "#60a5fa"
    );
  });
  autoCopyChk.addEventListener("change", () => {
    saveSettings();
    setStatus("Auto-copy: " + (autoCopyChk.checked ? "ON" : "OFF"), "#60a5fa");
  });
  liveChk.addEventListener("change", () => {
    saveSettings();
    setStatus("Live translation: " + (liveChk.checked ? "ON" : "OFF"), "#60a5fa");
  });
  vocabChk.addEventListener("change", () => {
    saveSettings();
    setStatus("Vocabulary mode: " + (vocabChk.checked ? "ON" : "OFF"), "#60a5fa");
  });
  grammarChk.addEventListener("change", () => {
    saveSettings();
    setStatus("Grammar mode: " + (grammarChk.checked ? "ON" : "OFF"), "#60a5fa");
  });

  // ---------------------------
  // About panel
  // ---------------------------
  const aboutPanel = mk("div", {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    background: "#050505",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    minWidth: "260px",
    display: "none",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2147483648,
    fontSize: "12px"
  });
  const aboutHeader = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  });
  const aboutTitle = mk("div", { fontWeight: "700", fontSize: "13px" });
  aboutTitle.textContent = "About Spanish Helper";
  const aboutClose = mk("button", {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "14px"
  });
  aboutClose.textContent = "✕";
  aboutHeader.appendChild(aboutTitle);
  aboutHeader.appendChild(aboutClose);
  const aboutBody = mk("div", { lineHeight: "1.4" });
  aboutBody.innerHTML =
    "<b>Made by Jaelito :D</b><br>" +
    "Version 2.3<br><br>" +
    "I'm the same guy who made all kinds of random but actually useful stuff like autoclickers, custom GUIs, tab cloakers, random tools, etc.<br><br>" +
    "Spanish Helper started as another one of those \"why not\" projects. I wanted something lightweight, fast, and fun to use while learning or practicing Spanish.<br><br>" +
    "This tool isn’t meant to replace Google Translate, DeepL, or any professional translator. It’s just a clean, simple learning tool you can open anytime, even if it’s not perfect.<br><br>" +
    "If you enjoy using it or it helps you learn, that means a lot to me :).<br><br>" + 
    "Thanks for supporting my random lil project ❤️.<br><br>" + 

    "More tools coming soon... stay tuned :)!";
  aboutPanel.appendChild(aboutHeader);
  aboutPanel.appendChild(aboutBody);
  box.appendChild(aboutPanel);
  aboutItem.onclick = function () {
    dropdown.style.display = "none";
    dropdownOpen = false;
    aboutPanel.style.display = "flex";
  };
  aboutClose.onclick = function () {
    aboutPanel.style.display = "none";
  };

  // ---------------------------
  // Credits panel
  // ---------------------------
  const creditsBtn = makeBtn("C");
  Object.assign(creditsBtn.style, {
    position: "absolute",
    bottom: "6px",
    right: "38px",
    borderRadius: "50%",
    width: "26px",
    padding: "0",
    textAlign: "center"
  });
  box.appendChild(creditsBtn);

  const creditsPanel = mk("div", {
    position: "absolute",
    top: "0",
    right: "100%",
    marginRight: "8px",
    width: "260px",
    background: "#050505",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "12px",
    display: "none",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2147483649,
    overflowY: "auto"
  });
  const creditsHeader = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  });
  const creditsTitle = mk("div", { fontWeight: "700", fontSize: "13px" });
  creditsTitle.textContent = "Credits";
  const creditsClose = mk("button", {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "14px"
  });
  creditsClose.textContent = "✕";
  creditsHeader.appendChild(creditsTitle);
  creditsHeader.appendChild(creditsClose);
  const creditsBody = mk("div", { lineHeight: "1.4" });
  creditsBody.innerHTML =
    "<b>Creator:</b> Jaelito<br>" +
    "• Built the tool, UI, and features.<br><br>" +
    "<b>Special thanks:</b><br>" +
    "• Mateo — helped with Spanish translation ideas and testing.<br><br>" +
    "Thanks to everyone who tried this, broke it, and suggested improvements.";
  creditsPanel.appendChild(creditsHeader);
  creditsPanel.appendChild(creditsBody);
  box.appendChild(creditsPanel);

  creditsBtn.onclick = function (e) {
    e.stopPropagation();
    creditsPanel.style.display =
      creditsPanel.style.display === "flex" ? "none" : "flex";
  };
  creditsClose.onclick = function () {
    creditsPanel.style.display = "none";
  };

  // ---------------------------
  // Help panel + full guide
  // ---------------------------
  const helpBtn = makeBtn("?");
  Object.assign(helpBtn.style, {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    borderRadius: "50%",
    width: "26px",
    padding: "0",
    textAlign: "center"
  });
  box.appendChild(helpBtn);

  const helpPanel = mk("div", {
    position: "absolute",
    top: "0",
    left: "100%",
    marginLeft: "8px",
    width: "320px",
    background: "#050505",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "12px",
    display: "none",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2147483649,
    overflowY: "auto"
  });
  const helpHeader = mk("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  });
  const helpTitle = mk("div", { fontWeight: "700", fontSize: "13px" });
  helpTitle.textContent = "Quick Help";
  const helpClose = mk("button", {
    background: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "14px"
  });
  helpClose.textContent = "✕";
  helpHeader.appendChild(helpTitle);
  helpHeader.appendChild(helpClose);
  helpPanel.appendChild(helpHeader);

  const helpText = mk("div", { lineHeight: "1.4" });
  helpText.innerHTML =
    "<b>Basics:</b><br>" +
    "• Type in the left box. The translation appears on the right.<br>" +
    "• Ctrl/Cmd+Enter translates instantly.<br>" +
    "• EN → ES / ES → EN switches translation direction and clears current text and analysis.<br><br>" +
    "<b>Modes:</b><br>" +
    "• Vocabulary Mode: Click a word in the output to see a guessed part of speech, gender, plural form, category, and a short definition. This helps you understand how the word behaves in a sentence.<br>" +
    "• Grammar Mode: Shows a rough breakdown of subjects, verbs, nouns, adjectives, adverbs, articles, prepositions, and conjunctions. It’s useful for seeing sentence structure, but not always perfect.<br>" +
    "• You can enable both modes in Settings to see vocabulary and grammar info together.<br><br>" +
    "<b>Features:</b><br>" +
    "• Live Translation: Updates automatically as you type (can be turned off in Settings).<br>" +
    "• Auto-copy: Copies translations to the clipboard when enabled.<br>" +
    "• Auto-hide: When enabled, the tool hides itself after switching tabs. You can only bring it back with Ctrl+Shift+E.<br>" +
    "• Speak: Reads the translation aloud using your chosen speed.<br>" +
    "• Clear: Resets both text boxes and clears vocabulary/grammar analysis.<br><br>" +
    "<b>Shortcuts:</b><br>" +
    "• Ctrl+Shift+E — Hide/unhide the tool<br>" +
    "• Ctrl+Shift+\\ — Toggle Auto-hide mode<br>" +
    "• Esc — Clear all text and analysis<br>" +
    "• Ctrl/Cmd+Enter — Translate<br>" +
    "• Ctrl+Shift+V — Toggle Vocabulary Mode<br>" +
    "• Ctrl+Shift+G — Toggle Grammar Mode<br>" +
    "• Ctrl+Shift+A — Toggle Auto-copy<br>" +
    "• Ctrl+Shift+L — Toggle Live translation<br><br>" +
    "<b>Notes & Policy:</b><br>" +
    "• This tool is a learning aid, not a professional translation service.<br>" +
    "• Vocabulary and grammar detection are rule-based and may be wrong or incomplete.<br>" +
    "• It is not designed to replace Google Translate, DeepL, or professional translators.<br>" +
      "• For important translations, always double-check with more reliable tools or native speakers.<br><br>" +
"<b>More tips:</b> " +
'<a href="#" id="full-guide-link" style="color:#60a5fa;text-decoration:none;">Full guide & tips</a>.' +
"<br><br>" +
'<b>Bug reports:</b> ' +
'<a href="https://forms.gle/T5mhoF8KLmeNpjYs5" target="_blank" style="color:#60a5fa;text-decoration:none;">Submit a bug report here</a>.';
helpPanel.appendChild(helpText);
  box.appendChild(helpPanel);

  function syncHelpHeight() {
    const rect = box.getBoundingClientRect();
    helpPanel.style.maxHeight = rect.height + "px";
  }
  syncHelpHeight();

  helpBtn.onclick = function (e) {
    e.stopPropagation();
    syncHelpHeight();
    helpPanel.style.display = helpPanel.style.display === "flex" ? "none" : "flex";
  };
  helpClose.onclick = function () {
    helpPanel.style.display = "none";
  };
  helpItem.onclick = function () {
    dropdown.style.display = "none";
    dropdownOpen = false;
    syncHelpHeight();
    helpPanel.style.display = "flex";
  };

  // ---------------------------
  // Full guide (new tab)
  // ---------------------------
  const fullGuideLink = helpPanel.querySelector("#full-guide-link");
  if (fullGuideLink) {
    fullGuideLink.addEventListener("click", function (e) {
      e.preventDefault();
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Spanish Helper — Full Guide & Tips</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>
        body{background:#050505;color:#e5e5e5;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial;margin:0;padding:20px}
        .wrap{max-width:900px;margin:0 auto}
        h1,h2{color:#f97316;margin:0 0 8px 0}
        p,li{line-height:1.6;font-size:15px}
        .section{border:1px solid #1f2933;border-radius:8px;padding:14px;margin-bottom:12px;background:#020617}
        code{background:#111827;padding:2px 6px;border-radius:6px;font-size:13px}
        ul{padding-left:18px}
        .muted{color:#9ca3af;font-size:13px}
      </style></head><body><div class="wrap">
        <h1>Spanish Helper — Full Guide & Tips</h1>
        <p class="muted">Version 2.3 — Made by Jaelito</p>

        <div class="section"><h2>Quick Start</h2>
          <ul>
            <li>Type in the <b>left</b> box. Press <code>Ctrl/Cmd + Enter</code> to translate.</li>
            <li>Use the <b>EN → ES</b> button to switch direction. When you switch, the current text and analysis are cleared so you don’t mix languages.</li>
            <li>Turn Live translation on or off in Settings depending on whether you want instant or manual translation.</li>
          </ul>
        </div>

        <div class="section"><h2>Vocabulary Mode (Detailed)</h2>
          <p>Vocabulary Mode helps you understand how individual words behave in context. When enabled, you can click any word in the output to see:</p>
          <ul>
            <li><b>Word:</b> The exact word you clicked.</li>
            <li><b>Part of speech (guess):</b> A guess like noun, verb, or adjective based on endings and patterns.</li>
            <li><b>Gender (guess):</b> For Spanish words, it tries to guess masculine/feminine using common endings (like <code>-o</code> or <code>-a</code>).</li>
            <li><b>Plural form (guess):</b> A suggested plural based on typical Spanish rules (<code>-s</code>, <code>-es</code>, <code>-ces</code>, etc.).</li>
            <li><b>Category:</b> A simple label (noun, verb, adjective, or unknown) to show how the word functions.</li>
            <li><b>Definition:</b> A short definition from a public dictionary API when available, plus a basic mapping like <code>word = translation</code>.</li>
          </ul>
          <p>This is approximate and rule-based. It’s meant to give you a quick feel for the word, not a perfect dictionary entry.</p>
        </div>

<div class="section">
  <h2>Grammar Mode (Detailed)</h2>

  <p>Grammar Mode tries to highlight the structure of the sentence so you can see how the pieces fit together. It looks for:</p>

  <ul>
    <li><b>Subjects:</b> Subject pronouns (like <code>yo</code>, <code>tú</code>, <code>él</code>) and sometimes implied subjects based on verb endings.</li>

    <li><b>Verbs:</b> Words that look like verbs based on endings (<code>-ar</code>, <code>-er</code>, <code>-ir</code>), conjugated forms, irregular forms, gerunds, participles, and other common verb patterns.</li>

    <li><b>Nouns:</b> Words that are likely nouns, excluding pronouns, articles, prepositions, and conjunctions. Includes common noun endings like <code>-ción</code>, <code>-dad</code>, <code>-umbre</code>, etc.</li>

    <li><b>Adjectives:</b> Words that look like adjectives based on common endings (<code>-o</code>, <code>-a</code>, <code>-os</code>, <code>-as</code>) and known descriptive words.</li>

    <li><b>Adverbs:</b> Common adverbs and words ending in <code>-mente</code> (like <code>rápidamente</code>, <code>fácilmente</code>).</li>

    <li><b>Articles:</b> Definite and indefinite articles like <code>el</code>, <code>la</code>, <code>los</code>, <code>las</code>, <code>un</code>, <code>una</code>, etc.</li>

    <li><b>Prepositions:</b> Common Spanish prepositions like <code>a</code>, <code>de</code>, <code>en</code>, <code>por</code>, <code>para</code>, <code>con</code>, etc.</li>

    <li><b>Conjunctions:</b> Words that connect clauses, like <code>y</code>, <code>o</code>, <code>pero</code>, <code>aunque</code>, etc.</li>
  </ul>

  <p>It’s still heuristic and can misclassify words, especially in complex sentences. Use it as a guide, not a strict grammar judge.</p>

  
  <h3>Meaning of Grammar Labels</h3>

  <ul>
    <li><b>implied</b> — The verb ending suggests the subject even if it isn’t written.  
      Example: <code>como</code> implies <code>yo</code>.</li>

    <li><b>infinitive</b> — The base form of a verb (<code>hablar</code>, <code>comer</code>, <code>vivir</code>).  
      Often used after <code>voy a</code>, <code>quiero</code>, <code>puedo</code>, <code>tengo que</code>, etc.</li>

    <li><b>gerund</b> — The “-ing” form in Spanish (<code>hablando</code>, <code>comiendo</code>, <code>viviendo</code>).  
      Used for ongoing actions like <code>estoy hablando</code>.</li>

    <li><b>participle</b> — Used in perfect tenses (<code>he hecho</code>, <code>hemos terminado</code>).  
      Often ends in <code>-ado</code>, <code>-ido</code>, <code>-to</code>, <code>-so</code>, <code>-cho</code>.</li>

    <li><b>preterite</b> — Completed past action (<code>comí</code>, <code>habló</code>, <code>fueron</code>).  
      Used for events with a clear beginning and end.</li>

    <li><b>imperfect</b> — Ongoing or repeated past action (<code>hablaba</code>, <code>comía</code>).  
      Used for descriptions, habits, or background actions.</li>

    <li><b>future</b> — Will happen (<code>hablaré</code>, <code>comerás</code>).  
      Often interchangeable with <code>ir a + infinitive</code>.</li>

    <li><b>conditional</b> — Would happen (<code>hablaría</code>, <code>comerías</code>).  
      Used for polite requests, hypotheticals, and “would” statements.</li>
  </ul>

</div>

        <div class="section"><h2>Shortcuts</h2>
          <ul>
            <li><code>Ctrl + Shift + E</code> — Hide/unhide the tool</li>
            <li><code>Ctrl + Shift + \\</code> — Toggle Auto-hide mode</li>
            <li><code>Esc</code> — Clear all text and analysis</li>
            <li><code>Ctrl/Cmd + Enter</code> — Translate</li>
            <li><code>Ctrl + Shift + V</code> — Toggle Vocabulary Mode</li>
            <li><code>Ctrl + Shift + G</code> — Toggle Grammar Mode</li>
            <li><code>Ctrl + Shift + A</code> — Toggle Auto-copy</li>
            <li><code>Ctrl + Shift + L</code> — Toggle Live translation</li>
          </ul>
        </div>

        <div class="section"><h2>Tips & Best Practices</h2>
          <ul>
            <li>Use shorter sentences when testing Vocabulary Mode to get clearer guesses.</li>
            <li>Turn off Live translation if you’re writing long paragraphs and only want to translate when you’re done.</li>
            <li>Use the Speak button with a slower speed (below 1.0x) to practice pronunciation more comfortably.</li>
            <li>If a definition is long, scroll inside the Definition box — the layout stays stable.</li>
            <li>For ambiguous words, try different forms (singular/plural, masculine/feminine) to see how the mapping changes.</li>
          </ul>
        </div>

        <div class="section"><h2>Policy & Limitations</h2>
          <p class="muted">
            Spanish Helper is a lightweight learning tool. It is not designed for professional use, legal documents, medical content, or anything where accuracy is critical.
          </p>
          <ul>
            <li><b>Not a replacement:</b> It is not meant to replace Google Translate, DeepL, or professional translators.</li>
            <li><b>Heuristic only:</b> Vocabulary and grammar analysis are based on simple rules and guesses.</li>
            <li><b>Good for practice:</b> Best for casual learning, experimenting with sentences, and understanding structure.</li>
            <li><b>Double-check important text:</b> For serious translations, always double-check with more robust tools or native speakers.</li>
          </ul>
        </div>

      </div></body></html>`);
      w.document.close();
    });
  }

  // ---------------------------
  // Heuristics lists & functions
  // ---------------------------
  const subjectPronouns = [
    "yo",
    "tú",
    "tu",
    "él",
    "ella",
    "usted",
    "nosotros",
    "nosotras",
    "vosotros",
    "vosotras",
    "ellos",
    "ellas",
    "ustedes"
  ];
  const articlesDef = ["el", "la", "los", "las"];
  const articlesIndef = ["un", "una", "unos", "unas"];
  const prepositions = [
    "a",
    "ante",
    "bajo",
    "cabe",
    "con",
    "contra",
    "de",
    "desde",
    "en",
    "entre",
    "hacia",
    "hasta",
    "para",
    "por",
    "según",
    "sin",
    "sobre",
    "tras"
  ];
  const conjunctions = [
    "y",
    "e",
    "ni",
    "o",
    "u",
    "pero",
    "aunque",
    "sino",
    "que",
    "porque",
    "mientras",
    "cuando"
  ];
  const commonAdverbs = [
    "rápidamente",
    "lentamente",
    "bien",
    "mal",
    "muy",
    "poco",
    "mucho",
    "siempre",
    "nunca",
    "ayer",
    "hoy",
    "mañana",
    "aquí",
    "allí",
    "allá"
  ];

  function isLikelyVerb(w) {
    const lw = (w || "").toLowerCase();
    if (lw.length <= 2) return false;
    if (/(ar|er|ir)$/.test(lw)) return true;
    if (/(ando|iendo|yendo)$/.test(lw)) return true;
    if (/(ado|ido|to|so|cho)$/.test(lw)) return true;
    if (/(arse|erse|irse)$/.test(lw)) return true;
    if (/(o|as|a|amos|áis|an|es|e|emos|éis|en|imos|ís)$/.test(lw)) return true;
    if (/(aré|eré|iré|aría|ería|iría)$/.test(lw)) return true;
    if (/(aba|ía|abas|ías|aban|ían)$/.test(lw)) return true;
    const irregular = [
      "tengo",
      "tienes",
      "tiene",
      "tenemos",
      "tienen",
      "vengo",
      "vienes",
      "viene",
      "venimos",
      "vienen",
      "puedo",
      "puedes",
      "puede",
      "podemos",
      "pueden",
      "pongo",
      "pones",
      "pone",
      "ponen",
      "digo",
      "dices",
      "dice",
      "dicen",
      "hago",
      "haces",
      "hace",
      "hacen",
      "voy",
      "vas",
      "va",
      "vamos",
      "van",
      "soy",
      "eres",
      "es",
      "somos",
      "son",
      "estoy",
      "estás",
      "está",
      "estamos",
      "están"
    ];
    if (irregular.includes(lw)) return true;
    return false;
  }

  function isLikelyAdj(w) {
    const lw = (w || "").toLowerCase();
    if (isLikelyVerb(w)) return false;
    if (/(o|a|os|as)$/.test(lw)) return true;
    if (lw.endsWith("e")) return true;
    if (lw.endsWith("ista")) return true;
    if (/(ol|ola|oles|olas|és|esa|eses|esas)$/.test(lw)) return true;
    if (/(ado|ido|to|so|cho)$/.test(lw)) return true;
    if (/(ante|ente|iente)$/.test(lw)) return true;
    return false;
  }

  function isLikelyNoun(w) {
    const lw = (w || "").toLowerCase();
    if (articlesDef.includes(lw) || articlesIndef.includes(lw)) return false;
    if (subjectPronouns.includes(lw)) return false;
    if (prepositions.includes(lw) || conjunctions.includes(lw)) return false;
    if (commonAdverbs.includes(lw)) return false;
    if (lw.length <= 2) return false;
    if (
      w &&
      w[0] === w[0].toUpperCase() &&
      w.slice(1).toLowerCase() === w.slice(1)
    ) {
      return true;
    }
    if (/(ción|sión|tud|dad|umbre|aje|ez)$/.test(lw)) return true;
    return true;
  }

  function extractMainWord(text) {
    const tokens = (text || "")
      .split(/\s+/)
      .map((w) => w.replace(/[.,!?;:]/g, "").toLowerCase())
      .filter(Boolean);
    const ignore = new Set([
      ...subjectPronouns,
      ...articlesDef,
      ...articlesIndef,
      ...prepositions,
      ...conjunctions,
      ...commonAdverbs,
      "ha",
      "he",
      "has",
      "han",
      "hemos",
      "está",
      "están",
      "estoy",
      "estás",
      "estamos"
    ]);
    for (let w of tokens) {
      if (!ignore.has(w)) return w;
    }
    return tokens[0] || "";
  }

  // ---------------------------
  // Vocabulary analysis
  // ---------------------------
  function updateVocabInfo(text, isSingleWord = false) {
    const trimmed = (text || "").trim();
    if (!trimmed) {
      vocabWordEl.textContent = "—";
      vocabPosEl.textContent = "—";
      vocabGenderEl.textContent = "—";
      vocabPluralEl.textContent = "—";
      vocabCatEl.textContent = "—";
      vocabDefEl.textContent = "—";
      return;
    }
    const mainLower = isSingleWord ? text.toLowerCase() : extractMainWord(trimmed);
    if (!mainLower) {
      vocabWordEl.textContent = "—";
      vocabPosEl.textContent = "—";
      vocabGenderEl.textContent = "—";
      vocabPluralEl.textContent = "—";
      vocabCatEl.textContent = "—";
      vocabDefEl.textContent = "—";
      return;
    }
    const main = mainLower;
    vocabWordEl.textContent = main;
    let pos = "unknown";
    let gender = "unknown";
    let plural = "—";
    if (isLikelyVerb(main)) {
      pos = "verb (guess)";
      gender = "n/a";
      plural = "n/a";
    } else if (isLikelyAdj(main)) {
      pos = "adjective (guess)";
      if (main.endsWith("a") || main.endsWith("as")) gender = "feminine (guess)";
      else if (main.endsWith("o") || main.endsWith("os"))
        gender = "masculine (guess)";
      else gender = "unknown";
      plural = main.endsWith("s") ? main : main + "s";
    } else if (isLikelyNoun(main)) {
      pos = "noun (guess)";
      if (main.endsWith("a")) gender = "feminine (guess)";
      else if (main.endsWith("o")) gender = "masculine (guess)";
      else gender = "unknown";
      if (main.endsWith("z")) plural = main.slice(0, -1) + "ces";
      else if (/[aeiouáéíóú]$/.test(main)) plural = main + "s";
      else plural = main + "es";
    }
    vocabPosEl.textContent = pos;
    vocabGenderEl.textContent = gender;
    vocabPluralEl.textContent = plural;
    if (pos.startsWith("verb")) vocabCatEl.textContent = "verb";
    else if (pos.startsWith("adjective")) vocabCatEl.textContent = "adjective";
    else if (pos.startsWith("noun")) vocabCatEl.textContent = "noun";
    else vocabCatEl.textContent = "unknown";
  }

// ---------------------------
// Grammar analysis (strict, rewritten)
// ---------------------------

// Basic helpers
function normalizeWord(w) {
  return w
    .toLowerCase()
    .replace(/[“”"«»()¿?¡!.,;:]/g, "")
    .trim();
}

function addUniqueOrdered(list, value) {
  if (!value) return;
  if (!list.includes(value)) list.push(value);
}

// Lexical categories
const PRONOUNS = [
  "yo","tú","vos","él","ella","ello","usted","nosotros","nosotras",
  "vosotros","vosotras","ellos","ellas","ustedes",
  "me","te","se","nos","os","lo","la","los","las","le","les","mí","ti","sí","su","sus"
];

const SUBJECT_PRONOUNS = [
  "yo","tú","vos","él","ella","usted",
  "nosotros","nosotras","vosotros","vosotras",
  "ellos","ellas","ustedes"
];

const ARTICLES = ["el","la","los","las","un","una","unos","unas","lo"];

const PREPOSITIONS = [
  "a","ante","bajo","cabe","con","contra","de","desde","en","entre",
  "hacia","hasta","para","por","según","sin","sobre","tras","durante","mediante"
];

const CONJUNCTIONS = [
  "y","e","ni","o","u","pero","aunque","sino","que","si","mientras","porque","cuando","ya"
];

const COMMON_ADVERBS = [
  "muy","poco","mucho","bastante","demasiado","bien","mal","casi",
  "siempre","nunca","jamás","ayer","hoy","mañana","anoche","tarde",
  "temprano","después","luego","antes","aquí","allí","allá","cerca",
  "lejos","arriba","abajo","dentro","fuera","rápidamente","lentamente","claramente"
];

const COMMON_ADJECTIVES = [
  "grande","pequeño","pequeña","pequeños","pequeñas",
  "alto","alta","bajo","baja",
  "nuevo","nueva","viejo","vieja",
  "rojo","roja","azul","verde",
  "local","interesante","importante","difícil","fácil",
  "rápido","rápida","lento","lenta","feliz",
  "antiguo","antigua","complicada","complicado",
  "divertido","divertida","tranquilo","tranquila","largo","larga","fuerte","grandes"
];

function isPronoun(w) {
  return PRONOUNS.includes(w);
}

function isSubjectPronoun(w) {
  return SUBJECT_PRONOUNS.includes(w);
}

function isArticle(w) {
  return ARTICLES.includes(w);
}

function isPreposition(w) {
  return PREPOSITIONS.includes(w);
}

function isConjunction(w) {
  return CONJUNCTIONS.includes(w);
}

function isAdverb(w) {
  if (COMMON_ADVERBS.includes(w)) return true;
  if (w.endsWith("mente") && w.length > 6) return true;
  return false;
}

function isAdjective(w) {
  if (COMMON_ADJECTIVES.includes(w)) return true;
  return /(al|ar|ante|ente|ivo|iva|ivos|ivas|oso|osa|osos|osas)$/.test(w);
}

// Verb detection + tense
function isInfinitive(w) {
  return w.length > 3 && (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir"));
}

function isGerund(w) {
  return w.endsWith("ando") || w.endsWith("iendo") || w.endsWith("yendo");
}

function isParticiple(w) {
  return w.endsWith("ado") || w.endsWith("ido") || w.endsWith("to") || w.endsWith("so") || w.endsWith("cho");
}

const IRREGULAR_VERBS = new Set([
  "soy","eres","es","somos","sois","son",
  "estoy","estás","está","estamos","estáis","están",
  "fui","fuiste","fue","fuimos","fuisteis","fueron",
  "iba","ibas","íbamos","ibais","iban",
  "voy","vas","va","vamos","vais","van",
  "tengo","tienes","tiene","tenemos","tenéis","tienen",
  "tuve","tuviste","tuvo","tuvimos","tuvisteis","tuvieron",
  "puedo","puedes","puede","podemos","podéis","pueden",
  "hago","haces","hace","hacemos","hacéis","hacen",
  "digo","dices","dice","decimos","decís","dicen",
  "quiero","quieres","quiere","queremos","queréis","quieren",
  "debo","debes","debe","debemos","debéis","deben",
  "dijo","dije","dijiste","dijeron","haré","haría","había","habrá","habrían"
]);

function isVerbLike(w) {
  if (IRREGULAR_VERBS.has(w)) return true;
  if (isInfinitive(w) || isGerund(w) || isParticiple(w)) return true;

  // Finite verb endings (require length > 4)
  if (/(é|aste|ó|amos|asteis|aron)$/.test(w) && w.length > 4) return true;
  if (/(í|iste|ió|imos|isteis|ieron)$/.test(w) && w.length > 4) return true;
  if (/(aba|abas|ábamos|abais|aban)$/.test(w) && w.length > 4) return true;
  if (/(ía|ías|íamos|íais|ían)$/.test(w) && w.length > 4) return true;

  // Present tense endings (cautious)
  if (w.length > 4) {
    // Block plural nouns/adjectives ending in -as / -es that are not infinitives
    if (/(as|es)$/.test(w) && !/(ar|er|ir)$/.test(w)) return false;

    // Block common noun endings that end in -o
    if (/(ro|rro|ero|oro|uro|ino|ano|ono)$/.test(w)) return false;

    if (w.endsWith("o")) return true;        // yo
    if (/(as|es)$/.test(w)) return true;     // tú
  }

  return false;
}

function detectSimpleTense(w) {
  if (isInfinitive(w)) return "infinitive";
  if (isGerund(w)) return "gerund";
  if (isParticiple(w)) return "participle";

  if (
    w.endsWith("ré") || w.endsWith("rás") || w.endsWith("rá") ||
    w.endsWith("remos") || w.endsWith("réis") || w.endsWith("rán")
  ) {
    return "future";
  }

  if (
    w.endsWith("ría") || w.endsWith("rías") || w.endsWith("ríamos") ||
    w.endsWith("ríais") || w.endsWith("rían")
  ) {
    return "conditional";
  }

  if (/(o|as|a|amos|áis|an|es|e|emos|éis|en|imos|ís)$/.test(w)) {
    return "present (likely)";
  }

  if (/(é|aste|ó|amos|asteis|aron|í|iste|ió|imos|isteis|ieron)$/.test(w)) {
    return "preterite (likely)";
  }

  if (/(aba|abas|ábamos|abais|aban|ía|ías|íamos|íais|ían)$/.test(w)) {
    return "imperfect (likely)";
  }

  return "verb (unknown tense)";
}

// Nouns (strict)
function isNoun(w) {
  const strongNounEndings = [
    "ción","sión","dad","tad","tud","umbre","aje",
    "ez","eza","miento","amiento","imiento",
    "ista","or","ora","ero","era"
  ];

  if (strongNounEndings.some(e => w.endsWith(e))) return true;

  const safeSimpleEndings = ["a","o","as","os","es"];

  if (isVerbLike(w)) return false;

  if (
    isPronoun(w) ||
    isArticle(w) ||
    isPreposition(w) ||
    isConjunction(w) ||
    isAdverb(w) ||
    isAdjective(w)
  ) {
    return false;
  }

  if (safeSimpleEndings.some(e => w.endsWith(e))) return true;

  return false;
}

// Implied subject from verb ending
function inferSubjectFromVerb(w) {
  if (!isVerbLike(w)) return null;

  if (/(o)$/.test(w)) return "yo (implied)";
  if (/(as|es)$/.test(w)) return "tú (implied)";
  if (/(a|e|ó|ió)$/.test(w)) return "él/ella/usted (implied)";
  if (/(amos|emos|imos)$/.test(w)) return "nosotros (implied)";
  if (/(áis|éis|ís)$/.test(w)) return "vosotros (implied)";
  if (/(an|en|aron|ieron)$/.test(w)) return "ellos/ellas/ustedes (implied)";

  return null;
}

// Main analysis
function updateGrammarInfo(text) {
  const rawWords = text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g) || [];
  const words = rawWords.map(w => normalizeWord(w)).filter(Boolean);

  const subjects = [];
  const verbs = []; // { form, tense }
  const nouns = [];
  const adjectives = [];
  const adverbs = [];
  const articles = [];
  const prepositions = [];
  const conjunctions = [];

  for (let i = 0; i < words.length; i++) {
    const wNorm = words[i];
    const wOrig = rawWords[i];
    if (!wNorm) continue;

    // Subject pronouns
    if (isSubjectPronoun(wNorm)) {
      addUniqueOrdered(subjects, wOrig);
      continue;
    }

    // Articles
    if (isArticle(wNorm)) {
      addUniqueOrdered(articles, wOrig);
      continue;
    }

    // Prepositions
    if (isPreposition(wNorm)) {
      addUniqueOrdered(prepositions, wOrig);
      continue;
    }

    // Conjunctions
    if (isConjunction(wNorm)) {
      addUniqueOrdered(conjunctions, wOrig);
      continue;
    }

    // Adverbs
    if (isAdverb(wNorm)) {
      addUniqueOrdered(adverbs, wOrig);
      continue;
    }

    // Verbs
    if (isVerbLike(wNorm)) {
      const tense = detectSimpleTense(wNorm);
      verbs.push({ form: wOrig, tense });

      const implied = inferSubjectFromVerb(wNorm);
      if (implied) {
        const impliedBase = implied.split(" ")[0].toLowerCase();
        const hasExplicit = subjects.some(s =>
          s.toLowerCase().startsWith(impliedBase)
        );
        if (!hasExplicit) {
          addUniqueOrdered(subjects, implied);
        }
      }

      continue;
    }

    // Nouns
    if (isNoun(wNorm)) {
      addUniqueOrdered(nouns, wOrig);
      continue;
    }

    // Adjectives
    if (isAdjective(wNorm)) {
      addUniqueOrdered(adjectives, wOrig);
      continue;
    }

    // Strict mode: no fallback classification
  }

  function fmt(list) {
    return list.length ? list.join(", ") : "none detected";
  }

  const verbsFormatted = verbs.length
    ? verbs.map(v => v.form + " (" + v.tense + ")").join(", ")
    : "none detected";

  const html =
    "<b>Subjects:</b> " + fmt(subjects) + "<br>" +
    "<b>Verbs:</b> " + verbsFormatted + "<br>" +
    "<b>Nouns:</b> " + fmt(nouns) + "<br>" +
    "<b>Adjectives:</b> " + fmt(adjectives) + "<br>" +
    "<b>Adverbs:</b> " + fmt(adverbs) + "<br>" +
    "<b>Articles:</b> " + fmt(articles) + "<br>" +
    "<b>Prepositions:</b> " + fmt(prepositions) + "<br>" +
    "<b>Conjunctions:</b> " + fmt(conjunctions);

  const target = document.getElementById("grammar-body");
  if (!target) {
    console.warn("Grammar panel element with id 'grammar-body' not found.");
    return;
  }
  target.innerHTML = html;
}

  // ---------------------------
  // Click word in output -> vocab + definition
  // ---------------------------
  output.addEventListener("click", function () {
    const text = output.value || "";
    const pos = output.selectionStart || 0;
    if (!text.trim()) return;
    let start = pos;
    let end = pos;
    while (start > 0 && !/\s/.test(text[start - 1])) start--;
    while (end < text.length && !/\s/.test(text[end])) end++;
    let word = text.slice(start, end).trim();
    word = word.replace(/[.,!?;:¿¡"()]/g, "");
    if (!word) return;
    updateVocabInfo(word, true);
    fetchDefinitionForWord(word);
  });

  // ---------------------------
  // Definition fetcher
  // ---------------------------
  async function fetchDefinitionForWord(word) {
    vocabDefEl.textContent = "Loading...";
    vocabDefEl.style.maxHeight = "80px";
    const from = currentDir === "en-es" ? "es" : "en";
    const to = currentDir === "en-es" ? "en" : "es";
    try {
      const urlMap =
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        encodeURIComponent(from) +
        "&tl=" +
        encodeURIComponent(to) +
        "&dt=t&q=" +
        encodeURIComponent(word);
      const resMap = await fetch(urlMap);
      const dataMap = await resMap.json();
      let mapped = "";
      try {
        mapped = Array.isArray(dataMap[0])
          ? dataMap[0].map((x) => x[0]).join("")
          : "";
      } catch (_) {
        mapped = "";
      }
      if (!mapped) mapped = word;

      async function tryDictLookup(term) {
        try {
          const dictUrl =
            "https://api.dictionaryapi.dev/api/v2/entries/" +
            to +
            "/" +
            encodeURIComponent(term);
          const resDict = await fetch(dictUrl);
          const dataDict = await resDict.json();
          if (Array.isArray(dataDict) && dataDict[0]?.meanings?.length) {
            const meanings = dataDict[0].meanings;
            const defs = meanings
              .flatMap((m) =>
                (m.definitions || []).map(
                  (d) => "• " + ((d.definition || "").trim())
                )
              )
              .filter(Boolean)
              .slice(0, 5)
              .join("\n");
            return defs || "";
          }
        } catch (_) {}
        return "";
      }

      let defsText = await tryDictLookup(mapped);
      if (!defsText && mapped !== word) {
        defsText = await tryDictLookup(word);
      }

      const headerLine = word + " = " + mapped;
      vocabDefEl.textContent = defsText
        ? headerLine + "\n\n" + defsText
        : headerLine + "\n\n(no detailed definition found)";
    } catch (e) {
      vocabDefEl.textContent = "Error loading definition";
    }
  }

  // ---------------------------
  // Live translation (debounced)
  // ---------------------------
  let liveTimer = null;
  input.addEventListener("input", function () {
    if (!settings.live) return;
    if (liveTimer) clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      doTranslate();
    }, 400);
  });

  // ---------------------------
  // Speak / Copy / Clear
  // ---------------------------
  function speak(rateOverride) {
    const text = (output.value || "").trim();
    if (!text) {
      setStatus("Nothing to speak.", "#f97373");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentDir === "en-es" ? "es-ES" : "en-US";
    utter.rate = rateOverride || settings.rate || 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setStatus("Speaking...", "#60a5fa");
  }
  speakBtn.onclick = function () {
    speak(settings.rate || 1.0);
  };

  copyBtn.onclick = function () {
    const text = output.value || "";
    if (!text) {
      setStatus("Nothing to copy.", "#f97373");
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setStatus("Copied.", "#4ade80");
        })
        .catch(() => {
          setStatus("Copy failed.", "#f97373");
        });
    } else {
      setStatus("Clipboard not available.", "#f97373");
    }
  };

  clearBtn.onclick = function () {
    input.value = "";
    output.value = "";
    setStatus("Cleared.", "#888");
    input.focus();
    updateVocabInfo("");
    updateGrammarInfo("");
  };

  // ---------------------------
  // Translation function
  // ---------------------------
  async function doTranslate() {
    const text = (input.value || "").trim();
    if (!text) {
      setStatus("Nothing to translate.", "#f97373");
      return;
    }
    setStatus("Translating...", "#888");
    const from = currentDir === "en-es" ? "en" : "es";
    const to = currentDir === "en-es" ? "es" : "en";
    try {
      const url =
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        encodeURIComponent(from) +
        "&tl=" +
        encodeURIComponent(to) +
        "&dt=t&q=" +
        encodeURIComponent(text);
let data;
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  data = await res.json();
} catch (err) {
  outputBox.textContent = "Translation unavailable. Check your connection or try again.";
  return;
}
      const translated = Array.isArray(data[0])
        ? data[0].map((x) => x[0]).join("")
        : "";
      output.value = translated;
      if (settings.autoCopy && navigator.clipboard) {
        navigator.clipboard.writeText(translated).catch(() => {});
        setStatus("Translated + copied.", "#4ade80");
      } else {
        setStatus("Translated.", "#4ade80");
      }
      if (settings.vocab) updateVocabInfo(translated, false);
      if (settings.grammar) updateGrammarInfo(translated);
    } catch (e) {
      setStatus("Error translating.", "#f97373");
    }
  }

  // Translate button click
  translateModeBtn.onclick = function () {
    doTranslate();
  };

  // ---------------------------
  // Direction toggle (clear on switch)
  // ---------------------------
  dirToggleBtn.onclick = function () {
    currentDir = currentDir === "en-es" ? "es-en" : "en-es";
    updateIOLabels();
    setStatus(
      currentDir === "en-es"
        ? "Direction: English → Spanish"
        : "Direction: Spanish → English",
      "#60a5fa"
    );
    input.value = "";
    output.value = "";
    updateVocabInfo("");
    updateGrammarInfo("");
  };

    // ---------------------------
  // Auto-hide on tab switch
  // ---------------------------
  let hidden = false;

  function applyHiddenState() {
    overlay.style.display = hidden ? "none" : "flex";
  }

  document.addEventListener("visibilitychange", () => {
    if (settings.autoHide && document.visibilityState === "hidden") {
      hidden = true;
      applyHiddenState();
    }
  });

  // ---------------------------
  // Hotkeys and toggles
  // ---------------------------
  document.addEventListener("keydown", function (e) {
    if (!document.body.contains(overlay)) return;

// Esc (closes GUI completely)
if (e.key === "Escape") {
  e.preventDefault();
  box.remove();
  overlay.remove();
  return;
}

    // Ctrl+Shift+E — hide/unhide GUI
    if ((e.key === "e" || e.key === "E") && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      hidden = !hidden;
      applyHiddenState();
      return;
    }

       // Ctrl+Shift+\ — toggle auto-hide mode
    if ((e.key === "\\" || e.key === "|") && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      settings.autoHide = !settings.autoHide;
      autoHideChk.checked = settings.autoHide;
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}

      setStatus("Auto-hide: " + (settings.autoHide ? "ON" : "OFF"), "#60a5fa", 1200);
      return;
    }

    // Ctrl/Cmd+Enter — translate
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      doTranslate();
      return;
    }

    // Ctrl+Shift+V — vocab
    if (
      e.shiftKey &&
      (e.ctrlKey || e.metaKey) &&
      (e.key === "v" || e.key === "V")
    ) {
      e.preventDefault();
      settings.vocab = !settings.vocab;
      vocabChk.checked = settings.vocab;
      applyPanelsVisibility();
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (_) {}
      setStatus(
        "Vocabulary mode: " + (settings.vocab ? "ON" : "OFF"),
        "#60a5fa"
      );
      return;
    }

    // Ctrl+Shift+G — grammar
    if (
      e.shiftKey &&
      (e.ctrlKey || e.metaKey) &&
      (e.key === "g" || e.key === "G")
    ) {
      e.preventDefault();
      settings.grammar = !settings.grammar;
      grammarChk.checked = settings.grammar;
      applyPanelsVisibility();
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (_) {}
      setStatus(
        "Grammar mode: " + (settings.grammar ? "ON" : "OFF"),
        "#60a5fa"
      );
      return;
    }

    // Ctrl+Shift+A — auto-copy
    if (
      e.shiftKey &&
      (e.ctrlKey || e.metaKey) &&
      (e.key === "a" || e.key === "A")
    ) {
      e.preventDefault();
      settings.autoCopy = !settings.autoCopy;
      autoCopyChk.checked = settings.autoCopy;
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (_) {}
      setStatus(
        "Auto-copy: " + (settings.autoCopy ? "ON" : "OFF"),
        "#60a5fa"
      );
      return;
    }

    // Ctrl+Shift+L — live
    if (
      e.shiftKey &&
      (e.ctrlKey || e.metaKey) &&
      (e.key === "l" || e.key === "L")
    ) {
      e.preventDefault();
      settings.live = !settings.live;
      liveChk.checked = settings.live;
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (_) {}
      setStatus(
        "Live translation: " + (settings.live ? "ON" : "OFF"),
        "#60a5fa"
      );
      return;
    }
  });

  // ---------------------------
  // Final note
  // ---------------------------
  const note = mk("div", {
    fontSize: "10px",
    color: "#666",
    marginTop: "2px"
  });
  note.textContent =
    "When switching languages or using Speak for the first time, there may be a slight delay.";
  box.appendChild(note);

  // Initialize labels
  updateIOLabels();
})();
