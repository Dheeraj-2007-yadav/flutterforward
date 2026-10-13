    const mobile = window.matchMedia("(max-width: 899px)").matches;
    const panelStyle = getComputedStyle(panel);
    const panelWidth = panel.offsetWidth;
    const panelLeft = mobile ? 0 : innerWidth - parseFloat(panelStyle.right || "0") - panelWidth;
    const sheetTop = mobile ? innerHeight - panel.offsetHeight : innerHeight;
    const availableWidth = mobile ? innerWidth - 38 : panelLeft - 70;
    const availableHeight = mobile ? Math.max(78,sheetTop - 92) : innerHeight - 100;
    let desired = rect.width < 72 ? 1.46 : rect.width < 145 ? 1.26 : 1.12;
    const fit = Math.min(availableWidth / Math.max(1,rect.width), availableHeight / Math.max(1,rect.height));
    const scale = Math.max(.48,Math.min(desired,fit));
    const width = rect.width * scale, height = rect.height * scale;
    const areaRight = mobile ? innerWidth : panelLeft;
    const x = Math.max(18,(areaRight - width) / 2);
    const y = mobile
      ? Math.max(58,(sheetTop - height) / 2)
      : Math.max(46,Math.min((innerHeight-height)/2,innerHeight-height-38));
    return { x,y,width,height,scale,dx:x-rect.left,dy:y-rect.top };
  }

  /* The lift and return share one immutable transform recipe. Because the clone's
     fixed base rectangle is the source rectangle captured at selection time, the
     reverse animation never needs a second viewport measurement. This keeps both
     directions in the iframe's own coordinate space, regardless of where the host
     page places or scrolls the iframe. */
  const TD_POP_TIMING = { duration:500, easing:"cubic-bezier(.2,.88,.22,1)", fill:"both" };
  function tdMotionFor(target) {
    const from = "translate3d(0px,0px,0px) scale(1)";
    const to = `translate3d(${target.dx}px,${target.dy}px,0px) scale(${target.scale})`;
    return { from, to, frames:[{transform:from},{transform:to}], timing:{...TD_POP_TIMING} };
  }
  function tdPlayMotion(clone,motion,direction) {
    clone.style.transform = direction === "reverse" ? motion.to : motion.from;
    const animation = clone.animate(motion.frames,{...motion.timing,direction});
    return animation;
  }

  /* The phone is deliberately inert during inspection. Only the selected clone
     moves; opening or closing a panel never translates, scales, or reflows the phone. */
  function tdPhoneRect() {
    const phone = $(".teardown-popup-layout .teardown-phone");
    if (!phone) return null;
    const r = phone.getBoundingClientRect();
    return { left:r.left, top:r.top, width:r.width, height:r.height };
  }

  function tdPositionCaption(caption,target,panel) {
    if (!caption || !target || !panel) return;
    caption.style.visibility = "hidden";
    caption.style.left = "0px"; caption.style.top = "0px";
    const width = caption.offsetWidth || 72, height = caption.offsetHeight || 12;
    const mobile = window.matchMedia("(max-width: 899px)").matches;
    const lowerLimit = mobile ? innerHeight - panel.offsetHeight - 10 : innerHeight - 12;
    const below = target.y + target.height + 16;
    const above = target.y - height - 16;
    const useAbove = below + height > lowerLimit && above >= 12;
    const left = Math.max(12,Math.min(innerWidth - width - 12,target.x + target.width - width));
    caption.dataset.placement = useAbove ? "above" : "below";
    caption.style.left = `${left}px`;
    caption.style.top = `${useAbove ? above : below}px`;
    caption.style.visibility = "visible";
  }

  function tdDrawConnector(layer,target,panel) {
    const path = layer.querySelector(".td-inspector-connector path"); if (!path) return;
    if (window.matchMedia("(max-width: 899px)").matches) { path.setAttribute("d",""); return; }
    const ps = getComputedStyle(panel), px = innerWidth - parseFloat(ps.right || "0") - panel.offsetWidth;
    const x1 = target.x + target.width + 7, y1 = target.y + target.height/2;
    const x2 = px - 7, y2 = Math.max(70,Math.min(innerHeight-70,target.y + Math.min(target.height*.58,90)));
    const bend = Math.max(22,(x2-x1)*.48);
    path.setAttribute("d",`M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`);
  }

  function tdLayerFor(node,source,rect) {
    const layer = document.createElement("div");
    layer.className = "td-inspector-layer";
    layer.innerHTML = `<button class="td-inspector-backdrop" data-teardown-close aria-label="Close component analysis"></button><svg class="td-inspector-connector" aria-hidden="true"><path></path></svg><span class="td-selection-caption" aria-hidden="true">${esc(node.name)}</span>${tdInspectorPanelMarkup(node)}`;
    const clone = tdCleanClone(source,rect);
    layer.insertBefore(clone,layer.querySelector(".td-selection-caption"));
    document.body.appendChild(layer);
    return { layer,clone,caption:layer.querySelector(".td-selection-caption"),panel:layer.querySelector(".td-inspector-panel") };
  }

  function tdOpenInspector(id, tappedSource) {
    const node = teardownState.app && tdIndex(TEARDOWNS[teardownState.app]).map[id]; if (!node) return;
    if (inspector) { tdSwitchInspector(id, tappedSource); return; }
    const source = tappedSource && tappedSource.dataset.node === id ? tappedSource : tdSourceFor(id); if (!source) return;
    const rect = source.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    teardownState.selected = id;
    const built = tdLayerFor(node,source,rect);
    inspector = { ...built, source, sourceRect:rect, id, target:null, phoneBefore:tdPhoneRect(), phoneOpen:null };
    source.classList.add("td-source-hidden");
    document.body.classList.add("td-inspector-open");
    built.layer.addEventListener("click",tdLayerClick);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if (!inspector) return;
      const target = tdTargetFor(rect,built.panel), motion = tdMotionFor(target);
      inspector.target = target; inspector.motion = motion; inspector.phoneOpen = tdPhoneRect();
      tdPositionCaption(built.caption,target,built.panel);
      built.layer.classList.add("is-open");
      inspector.motionAnimation = tdPlayMotion(built.clone,motion,"normal");
      inspector.motionAnimation.finished.then(()=>{
        if (!inspector || inspector.clone !== built.clone) return;
        built.clone.style.transform = motion.to;
        inspector.motionAnimation.cancel(); inspector.motionAnimation = null;
      }).catch(()=>{});
      tdDrawConnector(built.layer,target,built.panel);
      const close = built.panel.querySelector("[data-teardown-close]"); if (close) close.focus({preventScroll:true});
    }));
  }

  function tdSwitchInspector(id, tappedSource) {
    const node = teardownState.app && tdIndex(TEARDOWNS[teardownState.app]).map[id]; if (!node || !inspector || (id===inspector.id && !tappedSource)) return;
    const old = inspector, source = tappedSource && tappedSource.dataset.node === id ? tappedSource : tdSourceFor(id); if (!source || source===old.source) return;
    old.source.classList.remove("td-source-hidden");
    const rect = source.getBoundingClientRect(); if (!rect.width || !rect.height) { old.source.classList.add("td-source-hidden"); return; }
    source.classList.add("td-source-hidden"); teardownState.selected = id;
    const fresh = tdCleanClone(source,rect); fresh.style.opacity = "0";
    old.layer.insertBefore(fresh,old.panel);
    old.clone.classList.add("td-pop-switching");
    old.panel.outerHTML = tdInspectorPanelMarkup(node);
    const panel = old.layer.querySelector(".td-inspector-panel"), caption = old.caption;
    panel.classList.add("td-panel-switching");
    caption.style.opacity = "0"; caption.textContent = node.name;
    inspector = { layer:old.layer,clone:fresh,caption,panel,source,sourceRect:rect,id,target:null,phoneBefore:old.phoneBefore,phoneOpen:tdPhoneRect() };
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if (!inspector || inspector.clone!==fresh) return;
      const target = tdTargetFor(rect,panel), motion = tdMotionFor(target);
      inspector.target = target; inspector.motion = motion;
      tdPositionCaption(caption,target,panel); caption.style.opacity = "";
      fresh.style.opacity = "1";
      inspector.motionAnimation = tdPlayMotion(fresh,motion,"normal");
      inspector.motionAnimation.finished.then(()=>{
        if (!inspector || inspector.clone !== fresh) return;
        fresh.style.transform = motion.to;
        inspector.motionAnimation.cancel(); inspector.motionAnimation = null;
      }).catch(()=>{});
      tdDrawConnector(old.layer,target,panel);
    }));
    window.setTimeout(()=>old.clone.remove(),260);
  }

  function tdCloseInspector(immediate, trigger) {
    if (!inspector) return;
    const closing = inspector; inspector = null; teardownState.selected = null;
    let finished = false;
    const finish = ()=>{
      if (finished) return;
      finished = true;
      closing.source.classList.remove("td-source-hidden");
      closing.layer.remove(); document.body.classList.remove("td-inspector-open","td-sheet-open");
    };
    if (immediate || mqMatches("(prefers-reduced-motion: reduce)")) { finish(); return; }

    /* The return begins from the clone's exact painted transform. Nothing on the
       clone, its layer, or its positioning context is changed before this animation
       is installed. The overlay stays in its open state for the whole flight; only
       the finish handler reveals the source and removes the clone. This prevents a
       one-frame compositor jump before progress 0 inside an embedded viewer. */
    const clone = closing.clone, motion = closing.motion;
    if (!motion || !closing.sourceRect || !clone.isConnected) { finish(); return; }
    const destination = closing.sourceRect;
    const triggerRect = clone.getBoundingClientRect();
    const paintedTransform = getComputedStyle(clone).transform;
    if (closing.motionAnimation) { closing.motionAnimation.cancel(); closing.motionAnimation = null; }

    const duration = motion.timing.duration;
    const returnFrames = [
      { transform:paintedTransform === "none" ? motion.to : paintedTransform },
      { transform:motion.from }
    ];
    const animation = clone.animate(returnFrames,{...motion.timing,direction:"normal"});
    animation.currentTime = 0;

    const run = {
      trigger: trigger || "unknown",
      viewport: { width:innerWidth, height:innerHeight },
      base: { left:destination.left, top:destination.top, width:destination.width, height:destination.height },
      triggerRect: { left:triggerRect.left, top:triggerRect.top, width:triggerRect.width, height:triggerRect.height },
      transform: { from:paintedTransform, to:motion.from },
      phone: { before:closing.phoneBefore, open:closing.phoneOpen, after:null },
      samples: [], frameOne:null, final:null
    };
    tdDismissRuns.push(run);
    const startedAt = performance.now();
    const thresholds = [0,1/6,2/6,3/6,4/6,5/6,1];
    let nextSample = 0;
    const pathStart = { x:triggerRect.left + triggerRect.width/2, y:triggerRect.top + triggerRect.height/2 };
    const pathEnd = { x:destination.left + destination.width/2, y:destination.top + destination.height/2 };
    const pathLength = Math.hypot(pathEnd.x-pathStart.x,pathEnd.y-pathStart.y) || 1;
    const capture = (progress,phase)=>{
      const r = clone.getBoundingClientRect();
      const cx = r.left+r.width/2, cy = r.top+r.height/2;
      const deviation = Math.abs((pathEnd.x-pathStart.x)*(pathStart.y-cy)-(pathStart.x-cx)*(pathEnd.y-pathStart.y))/pathLength;
      const sample = {
        phase, progress, left:r.left, top:r.top, width:r.width, height:r.height,
        deviation, inside:r.left>=-0.5 && r.top>=-0.5 && r.right<=innerWidth+0.5 && r.bottom<=innerHeight+0.5
      };
      run.samples.push(sample);
      return sample;
    };
    capture(0,"trigger"); nextSample = 1;

    /* These visual changes do not touch the clone or its containing layer. They run
       only after the return effect is active, so there is no setup frame to expose. */
    closing.panel.style.pointerEvents = "none";
    closing.panel.animate([{opacity:1},{opacity:0}],{duration:260,easing:"ease",fill:"forwards"});
    if (closing.caption) closing.caption.animate([{opacity:1},{opacity:0}],{duration:150,easing:"ease",fill:"forwards"});
    const connector = closing.layer.querySelector(".td-inspector-connector path");
    if (connector) connector.animate([{opacity:.9},{opacity:0}],{duration:220,easing:"ease",fill:"forwards"});

    const sampleFrame = now=>{
      if (!clone.isConnected || finished) return;
      const progress = Math.max(0,Math.min(1,(now-startedAt)/duration));
      if (!run.frameOne) {
        const first = capture(progress,"frame-one");
        run.frameOne = {
          left:first.left, top:first.top, width:first.width, height:first.height,
          jump:Math.max(
            Math.abs(first.left-triggerRect.left),Math.abs(first.top-triggerRect.top),
            Math.abs(first.width-triggerRect.width),Math.abs(first.height-triggerRect.height)
          )
        };
      }
      while (nextSample < thresholds.length && progress + .018 >= thresholds[nextSample]) {
        capture(thresholds[nextSample],"flight"); nextSample++;
      }
      if (nextSample < thresholds.length) requestAnimationFrame(sampleFrame);
    };
    requestAnimationFrame(sampleFrame);

    animation.finished.then(()=>{
      if (finished || !clone.isConnected) return;
      clone.style.transform = motion.from;
      animation.cancel();
      while (nextSample < thresholds.length) { capture(thresholds[nextSample],"flight"); nextSample++; }
      const finalRect = clone.getBoundingClientRect();
      run.final = {
        left:finalRect.left, top:finalRect.top, width:finalRect.width, height:finalRect.height,
        error:Math.max(
          Math.abs(finalRect.left-destination.left),Math.abs(finalRect.top-destination.top),
          Math.abs(finalRect.width-destination.width),Math.abs(finalRect.height-destination.height)
        )
      };
      run.phone.after = tdPhoneRect();
      tdPublishDismissDebug();
      finish();
    }).catch(finish);
  }

  function tdLayerClick(e) {
    if (e.target.closest("[data-teardown-copy]")) { tdCopy(); return; }
    const select = e.target.closest("[data-teardown-select]");
    if (select) { e.preventDefault(); e.stopPropagation(); tdOpenInspector(select.dataset.teardownSelect); return; }
    const closeTarget = e.target.closest("[data-teardown-close]");
    if (closeTarget) {
      e.preventDefault();
      tdCloseInspector(false,closeTarget.classList.contains("td-inspector-backdrop")?"backdrop":"close-button");
    }
  }

  tdDetailView = function() {
    const item = TEARDOWNS[teardownState.app];
    return `<div class="teardown-detail-head"><button class="teardown-back" data-teardown-index>${TD_ICON.back}All teardowns</button><span class="teardown-bounds">Tap a component to inspect it</span></div><div class="teardown-detail-title"><span class="teardown-detail-kicker">${esc(item.app)} teardown</span><h2>${esc(item.screen)}</h2><p>Select a real interface component. It will lift out of the screen so you can connect the visible UI to its Flutter widget and code.</p></div><div class="teardown-popup-layout"><div class="teardown-phone-stage"><div class="teardown-phone"><span class="teardown-side-button mute" aria-hidden="true"></span><span class="teardown-side-button volume-up" aria-hidden="true"></span><span class="teardown-side-button volume-down" aria-hidden="true"></span><span class="teardown-side-button power" aria-hidden="true"></span><span class="teardown-dynamic-island" aria-hidden="true"></span><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div><p class="teardown-phone-hint">Tap the top bar, content, cards, fields, or bottom navigation</p></div></div>`;
  };

  tdPrepare = function() {
    const root = $("#teardowns-root"); if (!root || !teardownState.app) return;
    const index = tdIndex(TEARDOWNS[teardownState.app]);
    root.querySelectorAll(".td-region[data-node]").forEach(region=>{
      if (!index.map[region.dataset.node]) return;
      region.setAttribute("role","button");
      region.setAttribute("tabindex","0");
      region.setAttribute("aria-label",`Inspect ${region.dataset.widget}`);
    });
  };
  tdRender = function() { const root=$("#teardowns-root"); if(!root)return; root.innerHTML=teardownState.app?tdDetailView():teardownIndexView(); tdPrepare(); };
  tdOpen = function(key) { if(!TEARDOWNS[key])return; tdCloseInspector(true); teardownState={app:key,selected:null,bounds:false}; tdRender(); window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"}); };
  tdBack = function() { tdCloseInspector(true); teardownState={app:null,selected:null,bounds:false}; tdRender(); window.scrollTo({top:0}); };
  tdSelect = function(id) { tdOpenInspector(id); };
  tdClose = function() { tdCloseInspector(false,"close-button"); };
  tdToggleBounds = function() {};
  initTeardowns = function() {
    const root=$("#teardowns-root"); if(!root)return;
    const onKey=e=>{ if(e.key==="Escape"&&inspector){ e.preventDefault(); tdCloseInspector(false,"escape"); } };
    document.addEventListener("keydown",onKey);
    root.addEventListener("click",e=>{
      const open=e.target.closest("[data-teardown-open]"); if(open){tdOpen(open.dataset.teardownOpen);return;}
      if(e.target.closest("[data-teardown-index]")){tdBack();return;}
      if(teardownState.app){const hit=e.target.closest(".td-region[data-node]");if(hit&&root.contains(hit)){e.preventDefault();e.stopPropagation();tdOpenInspector(hit.dataset.node,hit);}}
    });
    root.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".td-region[tabindex]")){e.preventDefault();tdOpenInspector(e.target.dataset.node,e.target);}});
    onViewCleanup(()=>{document.removeEventListener("keydown",onKey);tdCloseInspector(true);});
  };
})();

const QUIZ_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="m12 3 4.5 2.5v5L12 13l-4.5-2.5v-5L12 3Z"/><path d="m7.5 10.5-4 2.3v5L8 21.3l4-2.3v-6M16.5 10.5l4 2.3v5L16 21.3 12 19"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 10.5h4M17.5 10v4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>'
];
views.quizzes = () => pageHead(null, "Quizzes", "One question at a time. Get a clear breakdown when you finish.") +
  `<div class="learning-list">${DATA.quizzes.map((q, i) => {
    const passed = !!S.quizzesPassed[q.id];
    const l = DATA.lessons.find(x => x.id === q.lessonId);
    return `<a class="quiz-row" href="#/quiz/${l.num}">
      <span class="quiz-icon" aria-hidden="true">${QUIZ_ICONS[i % QUIZ_ICONS.length]}</span>
      <span class="t"><b>${esc(q.title.replace(/^Quiz:\s*/, ""))}</b><span>Lesson ${l.num} · ${esc(l.title)} · 4 questions</span></span>
      <span class="status-pill${passed ? " pass" : ""}">${passed ? "Passed" : "Not started"}</span></a>`;
  }).join("")}</div>`;

const QUIZ_TOPICS = {
  "quiz-1": ["runApp()", "Dart entry point", "MaterialApp", "Scaffold"],
  "quiz-2": ["Widget basics", "build()", "Immutability", "Widget trees"],
  "quiz-3": ["Row", "Main axis", "Overflow", "Expanded"],
  "quiz-4": ["StatefulWidget", "setState()", "State object", "UI rebuilds"],
  "quiz-5": ["final vs const", "List indexes", "Null safety", "Constructors"],
  "quiz-6": ["GestureDetector", "Form validation", "Controller cleanup", "InkWell"],
  "quiz-7": ["Navigator.push", "Back navigation", "Named routes", "Returning results"],
  "quiz-8": ["setState()", "Lifting state", "notifyListeners()", "context.read()"],
  "quiz-9": ["Lazy lists", "Builder index", "Dismissible keys", "Pull to refresh"],
  "quiz-10": ["HTTP GET", "Future", "initState() fetching", "FutureBuilder"],
  "quiz-11": ["Hex colors", "ThemeData", "Light and dark mode", "Button colors"],
  "quiz-12": ["AnimatedContainer", "Opacity", "Hero tags", "Motion restraint"],
  "quiz-13": ["Memory vs storage", "shared_preferences", "Restoring state", "sqflite"],
  "quiz-15": ["Release builds", "App signing", "App bundles", "Version numbers"]
};
const quizTopic = (qid, i) => (QUIZ_TOPICS[qid] && QUIZ_TOPICS[qid][i]) || `Question ${i + 1}`;

/* ---------------- quiz result PDF: visual replica of the result screen ----------------
   Renders the result (score ring, stats, weak topics, question review cards) onto
   canvas pages and embeds them as JPEGs in a self-contained PDF. No CDN needed. */
function _pdfImgBuild(imgs) {
  const parts = [], off = {};
  let pos = 0;
  const pushS = (s) => { parts.push(s); pos += s.length; };
  const pushB = (b) => { parts.push(b); pos += b.length; };
  pushS("%PDF-1.4\n");
  const n = imgs.length;
  const pObj = (i) => 3 + i, cObj = (i) => 3 + n + i, imObj = (i) => 3 + 2 * n + i;
  const total = 2 + 3 * n;
  off[1] = pos; pushS("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  off[2] = pos; pushS("2 0 obj\n<< /Type /Pages /Kids [" + imgs.map((_, i) => pObj(i) + " 0 R").join(" ") + "] /Count " + n + " >>\nendobj\n");
  imgs.forEach((im, i) => {
    off[pObj(i)] = pos;
    pushS(pObj(i) + " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents " + cObj(i) + " 0 R /Resources << /XObject << /Im" + i + " " + imObj(i) + " 0 R >> >> >>\nendobj\n");
    const cs = "q\n595.28 0 0 841.89 0 0 cm\n/Im" + i + " Do\nQ\n";
    off[cObj(i)] = pos;
    pushS(cObj(i) + " 0 obj\n<< /Length " + cs.length + " >>\nstream\n" + cs + "endstream\nendobj\n");
    off[imObj(i)] = pos;
    pushS(imObj(i) + " 0 obj\n<< /Type /XObject /Subtype /Image /Width " + im.w + " /Height " + im.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + im.data.length + " >>\nstream\n");
    pushB(im.data);
    pushS("\nendstream\nendobj\n");
  });
  const xr = pos;
  pushS("xref\n0 " + (total + 1) + "\n0000000000 65535 f \n");
  for (let i = 1; i <= total; i++) pushS(String(off[i]).padStart(10, "0") + " 00000 n \n");
  pushS("trailer\n<< /Size " + (total + 1) + " /Root 1 0 R >>\nstartxref\n" + xr + "\n%%EOF");
  const out = new Uint8Array(pos);
  let p = 0;
  for (const part of parts) {
    if (typeof part === "string") { for (let k = 0; k < part.length; k++) out[p++] = part.charCodeAt(k) & 0xFF; }
    else { out.set(part, p); p += part.length; }
  }
  return out;
}
function _pdfWrapC(x, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (!cur || x.measureText(t).width <= maxW) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}
function _pdfRR(x, px, py, w, h, r) {
  x.beginPath();
  if (x.roundRect) x.roundRect(px, py, w, h, r);
  else x.rect(px, py, w, h);
}
async function quizPdfPages(q, attempt) {
  const tick = () => new Promise(r => setTimeout(r, 0));
  const K = 2;
  const PW = 1191, PH = 1684, M = 96, CW = PW - M * 2;
  const TOP = 72, BOTTOM = 96, GAP = 14 * K;
  const CONTENT_H = PH - TOP - BOTTOM;
  const INK = "#171717", SUB = "#555451", FAINT = "#888681";
  const BLUE = "#1E40AF";
  const GREEN = "#34745E", GREENBG = "#E7F0EB";
  const RED = "#A13D3D", REDBG = "#F5E9E7";
  const CARD = "#FFFFFF", CLINE = "#E8E6E2", PAGEBG = "#FFFFFF", SUNKEN = "#F6F5F3";
  const F = (w, s) => w + " " + (s * K) + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
  const FS = (s) => (s * K) + 'px Georgia, "Times New Roman", Times, serif';
  const n = q.questions.length, score = attempt.score, missed = n - score;
  const pct = attempt.pct, pass = pct >= QUIZ_PASS;
  const topicOf = (idx) => (typeof quizTopic === "function") ? quizTopic(q.id, idx) : (q.questions[idx].topic || ("Topic " + (idx + 1)));
  const weak = [...new Set(q.questions.map((qq, i) => attempt.answers[i] === qq.answer ? null : topicOf(i)).filter(Boolean))];
  const mkBlock = (drawFn, card) => {
    const c = document.createElement("canvas");
    c.width = CW; c.height = 3600;
    const x = c.getContext("2d");
    const h = Math.ceil(drawFn(x));
    const out = document.createElement("canvas");
    out.width = CW; out.height = h;
    const ox = out.getContext("2d");
    if (card) {
      ox.fillStyle = CARD;
      _pdfRR(ox, 0, 0, CW, h, 18 * K); ox.fill();
      ox.strokeStyle = CLINE; ox.lineWidth = 2; ox.stroke();
    }
    ox.drawImage(c, 0, 0, CW, h, 0, 0, CW, h);
    return out;
  };
  const headerBlock = mkBlock((x) => {
    let y = 8 * K;
    x.textAlign = "left";
    x.fillStyle = INK; x.font = FS(18);
    x.fillText("FlutterForward", 0, y + 18 * K);
    x.fillStyle = BLUE; x.font = F(700, 10.5); x.textAlign = "right";
    x.fillText("QUIZ RESULT", CW, y + 17 * K);
    x.textAlign = "left";
    y += 38 * K;
    x.strokeStyle = CLINE; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(0, y); x.lineTo(CW, y); x.stroke();
    y += 45 * K;
    x.fillStyle = INK; x.font = FS(34);
    _pdfWrapC(x, q.title, CW).forEach(L => { x.fillText(L, 0, y); y += 41 * K; });
    y += 15 * K;
    x.fillStyle = SUB; x.font = F(400, 14);
    const when = attempt.at ? new Date(attempt.at).toLocaleString() : "";
    const meta = when ? "Completed " + when : "Quiz result";
    _pdfWrapC(x, meta, CW).forEach(L => { x.fillText(L, 0, y); y += 22 * K; });
    return y + 24 * K;
  }, false);
  await tick();
  const heroBlock = mkBlock((x) => {
    let yy = 38 * K;
    const pad = 38 * K;
    x.fillStyle = BLUE; x.font = F(700, 11); x.textAlign = "left";
    x.fillText("YOUR SCORE", pad, yy);
    yy += 54 * K;
    x.fillStyle = INK; x.font = FS(64);
    x.fillText(pct + "%", pad, yy);
    const status = pass ? "Passed" : "Keep going";
    x.font = F(700, 13);
    const pillW = x.measureText(status).width + 34 * K;
    x.fillStyle = pass ? GREENBG : REDBG;
    _pdfRR(x, CW - pad - pillW, yy - 30 * K, pillW, 34 * K, 17 * K); x.fill();
    x.fillStyle = pass ? GREEN : RED; x.textAlign = "center";
    x.fillText(status, CW - pad - pillW / 2, yy - 8 * K);
    x.textAlign = "left";
    yy += 34 * K;
    x.fillStyle = SUB; x.font = F(400, 16);
    const statusLine = pass ? "You have a solid grip on this lesson." : `Review the ${missed} point${missed === 1 ? "" : "s"} below, then try again.`;
    _pdfWrapC(x, statusLine, CW - pad * 2).forEach(L => { x.fillText(L, pad, yy); yy += 24 * K; });
    yy += 28 * K;
    x.strokeStyle = CLINE; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(pad, yy); x.lineTo(CW - pad, yy); x.stroke();
    yy += 30 * K;
    const sw = (CW - pad * 2 - 20 * K * 2) / 3, sh = 82 * K;
    const stats = [[score + "/" + n, "Points"], [String(score), "Correct"], [String(missed), "Missed"]];
    stats.forEach(([v, l], i2) => {
      const bx = pad + i2 * (sw + 20 * K);
      x.fillStyle = CARD;
      _pdfRR(x, bx, yy, sw, sh, 8 * K); x.fill();
      x.strokeStyle = CLINE; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = INK; x.font = FS(28); x.textAlign = "center";
      x.fillText(v, bx + sw / 2, yy + 40 * K);
      x.fillStyle = FAINT; x.font = F(600, 12.5);
      x.fillText(l, bx + sw / 2, yy + 64 * K);
    });
    x.textAlign = "left";
    return yy + sh + 38 * K;
  }, true);
  await tick();
  const weakBlock = mkBlock((x) => {
    const pad = 38 * K;
    let yy = 35 * K;
    x.fillStyle = INK; x.font = FS(23); x.textAlign = "left";
    x.fillText(weak.length ? "Topics to revisit" : "A clean result", pad, yy);
    yy += 30 * K;
    x.fillStyle = SUB; x.font = F(400, 14.5);
    x.fillText(weak.length ? "Focus here before your next attempt." : "Every answer was correct.", pad, yy);
    yy += 36 * K;
    if (weak.length) {
      x.font = F(600, 13.5);
      let tx = pad;
      weak.forEach(t => {
        const tw = x.measureText(t).width + 28 * K;
        if (tx + tw > CW - pad) { tx = pad; yy += 39 * K; }
        x.fillStyle = SUNKEN;
        _pdfRR(x, tx, yy, tw, 31 * K, 15.5 * K); x.fill();
        x.strokeStyle = CLINE; x.lineWidth = 1; x.stroke();
        x.fillStyle = BLUE;
        x.fillText(t, tx + 14 * K, yy + 21 * K);
        tx += tw + 9 * K;
      });
      yy += 39 * K;
    }
    return yy + 32 * K;
  }, true);
  await tick();
  const reviewHeadBlock = mkBlock((x) => {
    x.fillStyle = BLUE; x.font = F(700, 10.5);
    x.fillText("ANSWER REVIEW", 0, 13 * K);
    x.fillStyle = INK; x.font = FS(32);
    x.fillText("Question by question", 0, 53 * K);
    x.fillStyle = SUB; x.font = F(400, 14); x.textAlign = "right";
    x.fillText(`${score} of ${n} correct`, CW, 52 * K);
    x.textAlign = "left";
    x.strokeStyle = CLINE; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(0, 75 * K); x.lineTo(CW, 75 * K); x.stroke();
    return 90 * K;
  }, false);
  await tick();
  const qBlocks = q.questions.map((qq, i) => {
    const mine = attempt.answers[i], ok = mine === qq.answer;
    return mkBlock((x) => {
      let yy = 32 * K;
      const pad = 34 * K, maxW = CW - pad * 2;
      x.font = F(700, 11.5);
      const stTxt = ok ? "CORRECT" : "REVIEW";
      const stw = x.measureText(stTxt).width + 28 * K;
      x.fillStyle = ok ? GREENBG : REDBG;
      _pdfRR(x, CW - pad - stw, yy - 4 * K, stw, 27 * K, 13.5 * K); x.fill();
      x.fillStyle = ok ? GREEN : RED; x.textAlign = "center";
      x.fillText(stTxt, CW - pad - stw / 2, yy + 14 * K);
      x.textAlign = "left";
      x.fillStyle = BLUE; x.font = F(700, 11);
      x.fillText(`QUESTION ${i + 1}`, pad, yy + 14 * K);
      yy += 50 * K;
      x.fillStyle = INK; x.font = FS(21);
      _pdfWrapC(x, qq.q, maxW).forEach(L => { x.fillText(L, pad, yy); yy += 28 * K; });
      yy += 18 * K;
      const qaLine = (label, val, lColor, vColor, vBold) => {
        x.font = F(600, 13.5); x.fillStyle = lColor;
        x.fillText(label, pad, yy);
        const lw = x.measureText(label).width;
        x.font = F(vBold ? 700 : 400, 14.5); x.fillStyle = vColor;
        _pdfWrapC(x, String(val), maxW - lw).forEach((L, k) => {
          if (k === 0) x.fillText(L, pad + lw, yy);
          else { yy += 23 * K; x.fillText(L, pad, yy); }
        });
        yy += 30 * K;
      };
      qaLine("Your answer: ", qq.options[mine] == null ? "\u2014" : qq.options[mine], SUB, INK, true);
      if (!ok) qaLine("Correct answer: ", qq.options[qq.answer], GREEN, GREEN, true);
      x.strokeStyle = CLINE; x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(pad, yy); x.lineTo(CW - pad, yy); x.stroke(); yy += 27 * K;
      x.font = F(700, 13.5); x.fillStyle = SUB;
      x.fillText("Why: ", pad, yy);
      const ww = x.measureText("Why: ").width;
      x.font = F(400, 14.5); x.fillStyle = INK;
      _pdfWrapC(x, qq.explanation, maxW - ww).forEach((L, k) => {
        x.fillText(L, pad + (k ? 0 : ww), yy + (k ? 24 * K : 0));
        if (k) yy += 24 * K;
      });
      yy += 24 * K;
      return yy + 34 * K;
    }, true);
  });
  await tick();
  /* Page one is deliberately an overview only. The answer review always opens on page two. */
  const pages = [[
    { cv: headerBlock },
    { cv: heroBlock },
    { cv: weakBlock }
  ]];
  const reviewBlocks = [
    { cv: reviewHeadBlock, keepWithNext: true },
    ...qBlocks.map(cv => ({ cv, isQ: true }))
  ];
  let cur = [], used = 0;
  reviewBlocks.forEach((b, i) => {
    let needH = b.cv.height + (cur.length ? GAP : 0);
    if (b.keepWithNext && reviewBlocks[i + 1]) needH += GAP + reviewBlocks[i + 1].cv.height;
    if (cur.length && used + needH > CONTENT_H) { pages.push(cur); cur = []; used = 0; }
    if (cur.length) used += GAP;
    cur.push(b); used += b.cv.height;
  });
  if (cur.length) pages.push(cur);
  if (pages.length >= 3) {
    const last = pages[pages.length - 1], prev = pages[pages.length - 2];
    if (last.length === 1 && last[0].isQ) {
      let idx = -1;
      for (let i = prev.length - 1; i >= 0; i--) if (prev[i].isQ) { idx = i; break; }
      const prevQ = prev.filter(b => b.isQ).length;
      if (idx >= 0 && prevQ >= 2) {
        const moved = prev[idx];
        if (moved.cv.height + GAP + last[0].cv.height <= CONTENT_H) {
          prev.splice(idx, 1);
          last.unshift(moved);
        }
      }
    }
  }
  const rendered = pages.map(blks => {
    const pg = document.createElement("canvas");
    pg.width = PW; pg.height = PH;
    const x = pg.getContext("2d");
    x.fillStyle = PAGEBG; x.fillRect(0, 0, PW, PH);
    let y = TOP;
    blks.forEach((b, i) => {
      if (i) y += GAP;
      x.drawImage(b.cv, M, y);
      y += b.cv.height;
    });
    return pg;
  });
  rendered.forEach((pg, idx) => {
    const x = pg.getContext("2d");
    x.fillStyle = FAINT; x.font = F(400, 10.5);
    x.fillText("Generated by FlutterForward", M, PH - 46);
    const label = `Page ${idx + 1} of ${rendered.length}`;
    x.textAlign = "right";
    x.fillText(label, PW - M, PH - 46);
    x.textAlign = "left";
  });
  return rendered;
}
function openPdfSheet(url, filename) {
  if ($("#pdfsheet-veil")) { URL.revokeObjectURL(url); return; }
  const veil = document.createElement("div");
  veil.className = "modal-veil";
  veil.id = "pdfsheet-veil";
  veil.innerHTML = `<div class="modal pdfsheet-dialog" role="dialog" aria-modal="true" aria-labelledby="ps-title">
    <h2 id="ps-title">Your PDF is ready</h2>
    <p style="word-break:break-all">${esc(filename)}</p>
    <a class="btn btn-accent btn-block" id="ps-dl" href="${url}" download="${esc(filename)}">Download PDF</a>
    <a class="btn btn-soft btn-block" id="ps-open" href="${url}" target="_blank" rel="noopener">Open in browser</a>
    <button class="btn btn-soft btn-block" id="ps-close">Close</button>
  </div>`;
  document.body.appendChild(veil);
  const close = () => { closeModalVeil(veil, true); setTimeout(() => URL.revokeObjectURL(url), 5000); };
  veil.querySelector("#ps-close").onclick = close;
  veil.addEventListener("click", e => { if (e.target === veil) close(); });
  const onKey = e => { if (e.key === "Escape") { document.removeEventListener("keydown", onKey); close(); } };
  document.addEventListener("keydown", onKey);
  viewCleanup.push(() => { const v = $("#pdfsheet-veil"); if (v) { v.remove(); URL.revokeObjectURL(url); } });
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add("show")));
}

let _pdfBusy = false;
async function downloadQuizPdf(quizId, attempt) {
  const q = (DATA.quizzes || []).find(x => x.id === quizId);
  if (!q || !attempt || !attempt.answers) return;
  if (_pdfBusy) return;
  _pdfBusy = true;
  try {
    const tick = () => new Promise(r => setTimeout(r, 0));
    const canvases = await quizPdfPages(q, attempt);
    const imgs = [];
    for (const cvv of canvases) {
      await tick();
      const b64 = cvv.toDataURL("image/jpeg", 0.92).split(",")[1];
      const bin = atob(b64);
      const data = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
      imgs.push({ w: cvv.width, h: cvv.height, data });
    }
    const bytes = _pdfImgBuild(imgs);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const stamp = (attempt.at ? new Date(attempt.at) : new Date()).toISOString().slice(0, 10);
    const filename = "flutterforward-" + q.id + "-" + stamp + ".pdf";
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      openPdfSheet(url, filename);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 4000);
    }
  } catch (e) {}
  _pdfBusy = false;
}

const quizState = {};
views.quiz = (num, result) => {
  const q = DATA.quizzes.find(item => item.id === `quiz-${num}`);
  if (!q) return views.quizzes();
  const st = quizState[q.id] || (quizState[q.id] = { answers: {}, done: false, score: 0, current: 0 });
  if (typeof st.current !== "number") st.current = 0;
  if (result) {
    const pct = Math.round((st.score / q.questions.length) * 100);
    const pass = pct >= QUIZ_PASS;
    const missed = q.questions.length - st.score;
    const weak = q.questions.map((qq, i) => st.answers[i] === qq.answer ? null : quizTopic(q.id, i)).filter(Boolean);
    return `<div class="quiz-stage"><a class="back-link" href="#/quizzes">← All quizzes</a>
    <div class="card score-hero">
      <div class="score-ring" style="--p:${pct}"><b>${pct}%</b></div>
      <h2>${pass ? "Quiz passed" : "Keep going"}</h2>
      <p>${pass ? "You have a solid grip on this lesson." : `Review the ${missed} point${missed === 1 ? "" : "s"} below, then try again.`}</p>
      <span class="pass-pill ${pass ? "pass" : "fail"}">${pass ? "✓ Passed" : `Need ${QUIZ_PASS}% to pass`}</span>
      <div class="result-stats">
        <div class="result-stat"><b>${st.score}/${q.questions.length}</b><span>Points</span></div>
        <div class="result-stat"><b>${st.score}</b><span>Correct</span></div>
        <div class="result-stat"><b>${missed}</b><span>Missed</span></div>
      </div>
    </div>
    <div class="weak-card${weak.length ? "" : " clear"}">
      <div class="weak-head"><span class="weak-mark">${weak.length ? "!" : "✓"}</span><div>
        <b>${weak.length ? "Weak topics" : "No weak topics"}</b>
        <p>${weak.length ? "Focus on these before your next attempt." : "Every answer was correct."}</p>
      </div></div>
      ${weak.length ? `<div class="weak-tags">${weak.map(topic => `<span>${esc(topic)}</span>`).join("")}</div>` : ""}
    </div>
    <div class="section-head"><h2>Question review</h2><span style="font-size:13px;color:var(--text-3)">${st.score} of ${q.questions.length} correct</span></div>
    <div class="review-list">${q.questions.map((qq, i) => {
      const mine = st.answers[i], ok = mine === qq.answer;
      return `<article class="review-card ${ok ? "ok" : "bad"}">
        <div class="review-top"><h3>${i + 1}. ${esc(qq.q)}</h3><span class="review-status">${ok ? "Correct" : "Needs review"}</span></div>
        <div class="review-answer"><span>Your answer: <b>${esc(qq.options[mine] == null ? "—" : qq.options[mine])}</b></span>
          ${ok ? "" : `<span class="correct-line">Correct answer: <b>${esc(qq.options[qq.answer])}</b></span>`}
        </div>
        <div class="review-why"><b>Why:</b> ${esc(qq.explanation)}</div>
      </article>`;
    }).join("")}</div>
    <div class="result-actions"><button class="btn btn-soft" id="quiz-retry">Retry quiz</button><button class="btn btn-soft" id="quiz-pdf">Download PDF</button><a class="btn btn-accent" href="#/quizzes">Back to quizzes</a></div></div>`;
  }
  const i = Math.max(0, Math.min(st.current, q.questions.length - 1));
  st.current = i;
  const qq = q.questions[i];
  const answered = Object.keys(st.answers).length;
  const selected = st.answers[i];
  return `<div class="quiz-stage"><a class="back-link" href="#/quizzes">← All quizzes</a>
    ${pageHead(null, q.title, `Pass mark: ${QUIZ_PASS}%`)}
    <div class="quiz-flow-head">
      <div class="quiz-flow-meta"><b>Question ${i + 1} of ${q.questions.length}</b><span>${answered} answered</span></div>
      <div class="quiz-progress" aria-label="Quiz progress"><i style="width:${((i + 1) / q.questions.length) * 100}%"></i></div>
    </div>
    <div class="quiz-q">
      <span class="quiz-topic">${esc(quizTopic(q.id, i))}</span>
      <h3>${esc(qq.q)}</h3>
      ${qq.options.map((op, j) => `<button class="opt${selected === j ? " sel" : ""}" data-q="${q.id}:${i}:${j}" aria-pressed="${selected === j ? "true" : "false"}">${esc(op)}</button>`).join("")}
    </div>
    <div class="quiz-nav">
      ${i > 0 ? `<button class="btn btn-soft" id="quiz-back">Back</button>` : ""}
      <button class="btn btn-accent" id="quiz-next"${selected == null ? " disabled" : ""}>${i === q.questions.length - 1 ? "See results" : "Next question"}</button>
    </div>
  </div>`;
};

const TROPHY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a4 4 0 0 0 4 4M16 6h3v1a4 4 0 0 1-4 4M12 12v5m-3 3h6m-5-3h4"/></svg>';
const RANK_ICONS = Array.from({ length: 7 }, () => TROPHY_ICON);

const fmtDate = (ts) => {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + ", " +
           d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch (e) { return ""; }
};

function showAllRanks() {
  const previous = document.getElementById("ranks-portal");
  if (previous) previous.remove();

  const current = rankIndexFor(doneCount());
  const rows = RANKS.map((r, idx) => {
    const cls = idx < current ? "done" : idx === current ? "cur" : "lock";
    const state = idx < current ? "reached" : idx === current ? "current rank" : "locked";
    const mark = idx < current ? `<span class="rl-mark" aria-hidden="true">\u2713</span>`
      : idx === current ? `<span class="rl-cur">Current</span>`
      : `<span class="rl-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>`;
    return `<div class="rl-row ${cls}" aria-label="${esc(r.name)}, ${state}"${idx === current ? ` aria-current="step"` : ""}>
      <span class="rl-ico" aria-hidden="true">${RANK_ICONS[idx]}</span>
      <div class="rl-t"><b>${esc(r.name)}</b>${idx === 0 ? `<span>Starting rank</span>` : ""}</div>${mark}</div>`;
  }).join("");

  const portal = document.createElement("div");
  portal.id = "ranks-portal";
  portal.className = "modal-veil ranks-portal";
  portal.innerHTML = `<div class="modal ranks-dialog" role="dialog" aria-modal="true" aria-labelledby="ranks-title">
    <div class="ranks-head">
      <div class="ranks-head-copy"><h2 id="ranks-title">All ranks</h2><p>Your path from first widget to Flutter Master.</p></div>
      <button class="ranks-close" type="button" aria-label="Close all ranks">\u00d7</button>
    </div>
    <div class="rl-list">${rows}</div>
    <button class="btn btn-accent btn-block ranks-done" type="button">Close</button>
  </div>`;
  document.body.appendChild(portal);

  const trigger = document.getElementById("ranks-help");
  let closed = false;
  const onKey = (e) => { if (e.key === "Escape") close(); };
  const close = (immediate) => {
    if (closed) return;
    closed = true;
    document.removeEventListener("keydown", onKey);
    if (immediate) {
      portal.remove();
      syncModalScrollLock();
    } else {
      closeModalVeil(portal, true);
      if (trigger && document.contains(trigger)) setTimeout(() => trigger.focus(), MODAL_CLOSE_MS);
    }
  };

  portal.querySelector(".ranks-close").onclick = () => close(false);
  portal.querySelector(".ranks-done").onclick = () => close(false);
  portal.addEventListener("click", (e) => { if (e.target === portal) close(false); });
  document.addEventListener("keydown", onKey);
  onViewCleanup(() => close(true));
  requestAnimationFrame(() => {
    portal.classList.add("show");
    portal.querySelector(".ranks-close").focus();
  });
}

views.progress = () => {
  const i = rankIndexFor(doneCount());
  const cur = RANKS[i];
  const doneL = DATA.lessons.filter(l => S.lessonsDone[l.id]).length;
  const doneQ = DATA.quizzes.filter(q => S.quizzesPassed && S.quizzesPassed[q.id]).length;

  const qhist = DATA.quizzes.map((q, qi) => {
    const hist = (S.quizHistory || {})[q.id] || [];
    const passed = !!S.quizzesPassed[q.id];
    let badge, body = "";
    if (hist.length) {
      const best = hist.reduce((m, a) => a.pct > m.pct ? a : m, hist[0]);
      badge = best.pct >= QUIZ_PASS
        ? `<span class="qh-badge pass">\u2713 Passed</span>`
        : `<span class="qh-badge fail">${best.pct}% &middot; Not passed</span>`;
      const attempts = hist.map((a, ai) => {
        const when = a.at ? fmtDate(a.at) : "Earlier attempt";
        const qs = a.answers ? q.questions.map((qq, qqi) => {
          const mine = a.answers[qqi];
          const ok = mine === qq.answer;
          return `<div class="qa ${ok ? "ok" : "bad"}">
            <div class="qa-q">${qqi + 1}. ${esc(qq.q)}</div>
            <div class="qa-a">${ok ? "\u2713" : "\u2717"} Your answer: <b>${esc(qq.options[mine] == null ? "\u2014" : qq.options[mine])}</b>${ok ? "" : `<span class="qa-correct">Correct: <b>${esc(qq.options[qq.answer])}</b></span>`}</div>
          </div>`;
        }).join("") : `<div class="qa-na">Answer details were not recorded for this attempt.</div>`;
        return `<details class="att"><summary><b>${when}</b><span>${a.score}/${a.total} &middot; ${a.pct}%${a.answers ? ` <button class="qh-pdf" data-q="${q.id}" data-ai="${ai}" title="Download result as PDF">PDF</button>` : ""}</span></summary><div class="qa-list">${qs}</div></details>`;
      }).join("");
      body = `<div class="qh-bestrow"><div class="qh-best"><b>${best.pct}%</b><span>best &middot; ${best.score}/${best.total}</span></div>
        <div class="qh-bar"><i style="width:${best.pct}%"></i></div></div>
        <details class="qh-review"><summary>Review answers (${hist.length} attempt${hist.length > 1 ? "s" : ""})</summary>${attempts}</details>`;
    } else if (passed) {
      badge = `<span class="qh-badge pass">\u2713 Passed</span>`;
      body = `<div class="qh-na">Finished before result tracking &mdash; retake to record full results.</div>`;
    } else {
      badge = `<span class="qh-badge todo">Not attempted</span>`;
    }
    return `<div class="qh-card">
        <div class="qh-top"><b>${esc(q.title)}</b>${badge}</div>
        ${body}
        <a class="qh-link" href="#/quiz/${DATA.lessons.find(l => l.id === q.lessonId).num}">${(hist.length || passed) ? "Retake quiz &rarr;" : "Take quiz &rarr;"}</a>
      </div>`;
  }).join("");

  const rankCard = `<div class="rk-card">
    <div class="rk-side">
      <span class="rk-cur-badge">${RANK_ICONS[i]}</span>
      <div class="rk-info"><h3>${esc(cur.name)}</h3><span class="rk-label">Level ${i + 1} of ${RANKS.length}</span></div>
      <button class="rk-help" id="ranks-help" aria-label="See all ranks" aria-haspopup="dialog">?</button>
    </div>
  </div>`;

  return pageHead(null, "Your progress", "A quiet record of every lesson and quiz completed.") +
  `<div class="progress-layout">
  <aside class="progress-side">
    ${rankCard}
  </aside>
  <div class="progress-main-shell">
    <div class="progress-main">
      <div class="stat-grid stagger" style="margin-bottom:18px">
        <div class="stat"><b>${doneL}/${DATA.lessons.length}</b><span>Lessons</span></div>
        <div class="stat"><b>${doneQ}/${DATA.quizzes.length}</b><span>Quizzes</span></div>
      </div>
      <div class="section-head"><h2>Quiz results</h2></div>
      <div class="qhist">${qhist}</div>
    </div>
  </div>
  </div>`;
};

views.profile = () => {
  if (!authReady && !authUnavailable) {
    return `<div class="access-card access-loading">Checking your account…</div>`;
  }
  if (authUnavailable) {
    return `<div class="access-card"><div class="access-intro"><h2>Authentication unavailable</h2><p>Firebase could not load. Check your internet connection, then refresh this page.</p></div></div>`;
  }
  if (!currentUser) {
    const registering = authMode === "register";
    const enterClass = authSlideDirection ? ` access-enter-${authSlideDirection > 0 ? "right" : "left"}` : "";
    authSlideDirection = 0;
    return `<section class="access-card">
      <div class="access-intro${enterClass}"><h2>${registering ? "Create your account" : "Welcome back"}</h2>
        <p>${registering ? "Set up your FlutterForward account and sync your progress." : "Continue with your saved learning progress."}</p></div>
      <div class="access-tabs" data-mode="${registering ? "register" : "login"}" role="tablist" aria-label="Account access">
        <button class="access-tab${registering ? "" : " active"}" type="button" role="tab" aria-selected="${registering ? "false" : "true"}" data-auth-mode="login">Login</button>
        <button class="access-tab${registering ? " active" : ""}" type="button" role="tab" aria-selected="${registering ? "true" : "false"}" data-auth-mode="register">Register</button>
      </div>
      <div class="access-form-panel${enterClass}">
        <form class="access-form" id="auth-form" novalidate>
          ${registering ? `<div class="access-field"><label for="auth-name">Display name</label><input id="auth-name" name="displayName" type="text" maxlength="32" autocomplete="name" required></div>` : ""}
          <div class="access-field"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" inputmode="email" autocomplete="email" required></div>
          <div class="access-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" autocomplete="${registering ? "new-password" : "current-password"}" required></div>
          ${registering ? `<div class="access-field"><label for="auth-confirm">Confirm password</label><input id="auth-confirm" name="confirmPassword" type="password" minlength="6" autocomplete="new-password" required></div>` : ""}
          <div class="access-error" id="auth-error" role="alert" aria-live="polite"></div>
          <button class="btn btn-accent btn-block access-submit" id="auth-submit" type="submit">${registering ? "Create account" : "Login"}</button>
        </form>
      </div>
    </section>`;
  }
  if (progressLoading) return `<div class="access-card access-loading">Loading your saved progress…</div>`;

  const i = rankIndexFor(doneCount());
  const doneL = DATA.lessons.filter(l => S.lessonsDone[l.id]).length;
  const doneQ = DATA.quizzes.filter(q => S.quizzesPassed && S.quizzesPassed[q.id]).length;
  const activeHistory = DATA.quizzes.map(q => (S.quizHistory || {})[q.id] || []);
  const attempts = activeHistory.reduce((sum, list) => sum + list.length, 0);
  const scores = activeHistory.reduce((all, list) => all.concat(list.map(a => a.pct)), []);
  const best = scores.length ? Math.max.apply(null, scores) + "%" : "—";
  const syncLine = progressSyncError || "Progress syncs to this account across browsers and devices.";
  return `<div class="summary-kicker">Profile</div>
  <div class="summary-shell">
    <section class="summary-summary">
      <div class="summary-rank-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg></div>
      <div class="summary-copy">
        <h2>${esc(userName(currentUser))}</h2>
        <p>${esc(RANKS[i].name)} · Level ${i + 1} of ${RANKS.length}</p>
        <span class="summary-detail">${esc(currentUser.email || "")}</span>
        <span class="summary-detail${progressSyncError ? " access-error" : ""}">${esc(syncLine)}</span>
      </div>
      <div class="summary-actions"><button class="access-exit" type="button" data-auth-logout>Logout</button></div>
    </section>
    <div class="stat-grid summary-stats">
      <div class="stat"><b>${doneL}/${DATA.lessons.length}</b><span>Lessons done</span></div>
      <div class="stat"><b>${doneQ}/${DATA.quizzes.length}</b><span>Quizzes passed</span></div>
      <div class="stat"><b>${attempts}</b><span>Quiz attempts</span></div>
      <div class="stat"><b>${best}</b><span>Best score</span></div>
    </div>
  </div>`;
};

async function handleAuthSubmit(form) {
  if (!auth || !form) return;
  const error = $("#auth-error");
  const submit = $("#auth-submit");
  const email = String(form.elements.email.value || "").trim();
  const password = String(form.elements.password.value || "");
  const name = form.elements.displayName ? String(form.elements.displayName.value || "").trim() : "";
  const confirmPassword = form.elements.confirmPassword ? String(form.elements.confirmPassword.value || "") : "";
  if (!form.checkValidity()) {
    if (error) error.textContent = "Complete the fields above with valid details.";
    form.reportValidity();
    return;
  }
  if (authMode === "register" && !name) {
    if (error) error.textContent = "Enter the name you want shown on your profile.";
    return;
  }
  if (authMode === "register" && password !== confirmPassword) {
    if (error) error.textContent = "Passwords do not match.";
    return;
  }
  if (error) error.textContent = "";
  if (submit) { submit.disabled = true; submit.textContent = authMode === "register" ? "Creating account…" : "Logging in…"; }
  try {
    if (authMode === "register") {
      const credential = await auth.createUserWithEmailAndPassword(email, password);
      await credential.user.updateProfile({ displayName: name.slice(0, 32) });
      currentUser = credential.user;
      updateAuthUI();
      render();
    } else {
      await auth.signInWithEmailAndPassword(email, password);
    }
  } catch (err) {
    if (error) error.textContent = friendlyAuthError(err);
    if (submit) { submit.disabled = false; submit.textContent = authMode === "register" ? "Create account" : "Login"; }
  }
}

views.summary = () => {
  const i = rankIndexFor(doneCount());
  const doneL = DATA.lessons.filter(l => S.lessonsDone[l.id]).length;
  const doneQ = DATA.quizzes.filter(q => S.quizzesPassed && S.quizzesPassed[q.id]).length;
  const activeHistory = DATA.quizzes.map(q => (S.quizHistory || {})[q.id] || []);
  const attempts = activeHistory.reduce((sum, list) => sum + list.length, 0);
  const scores = activeHistory.reduce((all, list) => all.concat(list.map(a => a.pct)), []);
  const best = scores.length ? Math.max.apply(null, scores) + "%" : "—";
  return `<div class="summary-kicker">Learning summary</div>
  <div class="summary-shell">
    <section class="summary-summary">
      <div class="summary-rank-badge" aria-hidden="true">${TROPHY_ICON}</div>
      <div class="summary-copy">
        <h2>${esc(RANKS[i].name)}</h2>
        <p>Level ${i + 1} of ${RANKS.length}</p>
      </div>
    </section>
    <div class="stat-grid summary-stats">
      <div class="stat"><b>${doneL}/${DATA.lessons.length}</b><span>Lessons done</span></div>
      <div class="stat"><b>${doneQ}/${DATA.quizzes.length}</b><span>Quizzes passed</span></div>
      <div class="stat"><b>${attempts}</b><span>Quiz attempts</span></div>
      <div class="stat"><b>${best}</b><span>Best score</span></div>
    </div>
  </div>`;
};

/* ---------------- router ---------------- */
const TABS = [
  { route: "#/home", label: "Home", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>', match: ["home"] },
  { route: "#/lessons", label: "Lessons", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>', match: ["lessons", "lesson"] },
  { route: "#/teardowns", label: "Teardowns", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="11" height="16" rx="2"/><path d="M8 7h3M7 11h5M9.5 19v2M18 8v11M15.5 10.5 18 8l2.5 2.5M15.5 16.5 18 19l2.5-2.5"/></svg>', match: ["teardowns"] },
  { route: "#/quizzes", label: "Quizzes", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>', match: ["quizzes", "quiz"] },
  { route: "#/progress", label: "Progress", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>', match: ["progress"] },
  { route: "#/profile", label: "Profile", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', match: ["profile"], top: false },
  { route: "#/summary", label: "Summary", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>', match: ["summary"], top: false },
];
function setActiveTab(root) {
  const tab = TABS.find(t => t.match.includes(root));
  const active = tab ? tab.match[0] : root;
  $$(".side-link").forEach(a => a.classList.toggle("active", a.dataset.match === active));
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.match === active));
}
function route() {
  runViewCleanup();
  const h = location.hash || "#/home";
  const m = h.match(/^#\/(\w+)(?:\/(\d+))?/);
  const name = (m && m[1]) || "home";
  const arg = m && m[2] ? parseInt(m[2], 10) : null;
  const app = $("#app");
  let html = "", root = name, wide = false;
  if (views[name]) {
    html = arg ? views[name](arg) : views[name]();
    S.last = { route: h };
  } else { html = views.home(); root = "home"; }
  if (name === "teardowns" || name === "progress") wide = true;
  document.body.classList.toggle("progress-page", name === "progress");
  document.body.classList.toggle("home-page", name === "home");
  document.body.classList.toggle("teardowns-page", name === "teardowns");
  save();
  app.innerHTML = `<div class="view"><div class="wrap${wide ? " wide" : ""}">${html}</div></div>`;
  setActiveTab(root);
  updateRankUI();
  updateAuthUI();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$(".pbar > i").forEach(el => { el.style.width = el.dataset.w + "%"; });
    const c = $("[data-count]");
    if (c) {
      const target = +c.dataset.count, t0 = performance.now();
      (function step(t) {
        const p = Math.min(1, (t - t0) / 900);
        c.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  }));
  bindView(name, arg);
  window.scrollTo({ top: 0 });
}
function bindView(name, arg) {
  if (name === "home") initHomeFx();
  if (name === "teardowns") initTeardowns();
  if (name === "progress") {
    const help = $("#ranks-help");
    if (help) help.onclick = showAllRanks;
  }
  if (name === "profile") {
    $$('[data-auth-mode]').forEach(tab => {
      tab.onclick = () => {
        const nextMode = tab.dataset.authMode === "register" ? "register" : "login";
        if (nextMode === authMode || authSwitching) return;
        authSwitching = true;
        const direction = nextMode === "register" ? 1 : -1;
        const card = $(".access-card");
        const tabs = $(".access-tabs");
        const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (tabs) {
          tabs.dataset.mode = nextMode;
          $$('[data-auth-mode]').forEach(item => {
            const selected = item.dataset.authMode === nextMode;
            item.classList.toggle("active", selected);
            item.setAttribute("aria-selected", selected ? "true" : "false");
          });
        }
        if (card && !reducedMotion) card.classList.add(direction > 0 ? "access-leave-left" : "access-leave-right");
        window.setTimeout(() => {
          authMode = nextMode;
          authSlideDirection = reducedMotion ? 0 : direction;
          authSwitching = false;
          render();
        }, reducedMotion ? 0 : 190);
      };
    });
    const form = $("#auth-form");
    if (form) form.onsubmit = e => { e.preventDefault(); handleAuthSubmit(form); };
    $$('[data-auth-logout]').forEach(btn => { btn.onclick = showLogoutConfirm; });
  }
  const cl = $("#complete-lesson");
  if (cl) cl.onclick = () => {
    const markDone = () => {
      const l = DATA.lessons.find(item => item.num === arg);
      if (!S.lessonsDone[l.id]) {
        const before = rankIndexFor(doneCount());
        S.lessonsDone[l.id] = true;
        bumpRank(before);
      }
    };
    if (currentUser) { markDone(); return; }

    const veil = document.createElement("div");
    veil.className = "modal-veil";
    veil.innerHTML = `<div class="modal exit-dialog progress-entry-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-entry-title" aria-describedby="progress-entry-message">
      <h2 id="progress-entry-title">Log in to save progress</h2>
      <p id="progress-entry-message">Your progress is only saved on this device right now. Log in to keep it tied to your account — otherwise it could be lost.</p>
      <div class="exit-actions">
        <button class="btn btn-accent" type="button" data-progress-entry>Log in</button>
        <button class="btn exit-cancel" type="button" data-progress-continue>Continue without login</button>
      </div>
    </div>`;
    document.body.appendChild(veil);
    const dismiss = afterClose => {
      document.removeEventListener("keydown", onKeydown);
      closeModalVeil(veil, true);
      if (afterClose) setTimeout(afterClose, MODAL_CLOSE_MS);
    };
    const onKeydown = e => { if (e.key === "Escape") dismiss(); };
    veil.addEventListener("click", e => { if (e.target === veil) dismiss(); });
    veil.querySelector("[data-progress-entry]").onclick = () => dismiss(() => { location.hash = "#/profile"; });
    veil.querySelector("[data-progress-continue]").onclick = () => dismiss(markDone);
    document.addEventListener("keydown", onKeydown);
    requestAnimationFrame(() => {
      veil.classList.add("show");
      syncModalScrollLock();
      veil.querySelector("[data-progress-entry]").focus();
    });
  };
  $$("[data-q]").forEach(b => b.onclick = () => {
    const [qid, qi, oi] = b.dataset.q.split(":");
    const st = quizState[qid] || (quizState[qid] = { answers: {}, done: false, score: 0, current: 0 });
    if (st.done) return;
    st.answers[+qi] = +oi;
    $$(`[data-q^="${qid}:${qi}:"]`).forEach(x => {
      const picked = x === b;
      x.classList.toggle("sel", picked);
      x.setAttribute("aria-pressed", picked ? "true" : "false");
    });
    const next = $("#quiz-next");
    if (next) next.disabled = false;
  });
  if (name === "progress") {
    $$(".qh-pdf").forEach(b => b.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      downloadQuizPdf(b.dataset.q, ((S.quizHistory || {})[b.dataset.q] || [])[+b.dataset.ai]);
    });
  }
  const qBack = $("#quiz-back");
  if (qBack) qBack.onclick = () => {
    const q = DATA.quizzes.find(item => item.id === `quiz-${arg}`);
    const st = quizState[q.id];
    st.current = Math.max(0, st.current - 1);
    renderQuizStep(arg);
  };
  const qNext = $("#quiz-next");
  if (qNext) qNext.onclick = () => {
    const q = DATA.quizzes.find(item => item.id === `quiz-${arg}`);
    const st = quizState[q.id];
    if (st.answers[st.current] == null) return;
    if (st.current < q.questions.length - 1) {
      st.current++;
      renderQuizStep(arg);
      return;
    }
    let score = 0;
    q.questions.forEach((qq, i) => { if (st.answers[i] === qq.answer) score++; });
    st.score = score; st.done = true;
    const pct = Math.round((score / q.questions.length) * 100);
    S.quizHistory = S.quizHistory || {};
    const hist = S.quizHistory[q.id] || (S.quizHistory[q.id] = []);
    hist.unshift({ score, total: q.questions.length, pct,
      answers: Object.assign({}, st.answers), at: Date.now() });
    if (hist.length > 5) hist.length = 5;
    if (pct >= QUIZ_PASS && !S.quizzesPassed[q.id]) {
      const before = rankIndexFor(doneCount());
      S.quizzesPassed[q.id] = true;
      bumpRank(before);
    } else {
      save();
    }
    renderQuizResult(arg);
  };
  const retry = $("#quiz-retry");
  if (retry) retry.onclick = () => {
    const q = DATA.quizzes.find(item => item.id === `quiz-${arg}`);
    quizState[q.id] = { answers: {}, done: false, score: 0, current: 0 };
    renderQuizStep(arg);
  };
  const pdf = $("#quiz-pdf");
  if (pdf) pdf.onclick = () => {
    const q = DATA.quizzes.find(item => item.id === `quiz-${arg}`);
    const st = quizState[q.id];
    const n = q.questions.length;
    downloadQuizPdf(q.id, { score: st.score, total: n, pct: Math.round((st.score / n) * 100), answers: Object.assign({}, st.answers), at: Date.now() });
  };
}
function renderQuizScreen(arg, result) {
  const app = $("#app");
  app.innerHTML = `<div class="view"><div class="wrap">${views.quiz(arg, result)}</div></div>`;
  bindView("quiz", arg);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderQuizStep(arg) { renderQuizScreen(arg, false); }
function renderQuizResult(arg) { renderQuizScreen(arg, true); }
function render() { route(); }

/* ---------------- theme (light / dark) ---------------- */
function applyTheme() {
  if (S.theme !== "dark" && S.theme !== "light") S.theme = "light"; // migrate old "auto"
  const dark = S.theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const icon = dark ? sunIcon : moonIcon;
  $$(".theme-btn").forEach(b => {
    const ic = b.querySelector(".ti");
    if (ic) ic.innerHTML = icon; else b.innerHTML = icon;
  });
}
function cycleTheme() {
  S.theme = S.theme === "dark" ? "light" : "dark";
  save(); applyTheme();
}

/* ---------------- popup scroll lock ---------------- */
function initPopupScrollLock() {
  const observer = new MutationObserver(syncModalScrollLock);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["hidden"]
  });
  syncModalScrollLock();
}

/* ---------------- shell ---------------- */
function shell() {
  const brandMark = `<img class="brand-logo brand-logo-light" src="data:image/png;base64,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" alt=""><img class="brand-logo brand-logo-dark" src="data:image/png;base64,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" alt="">`;
  document.body.innerHTML = `
  <nav class="topnav">
    <a class="brand" href="#/home">${brandMark}<span>FlutterForward</span></a>
    <div class="nav-links">
      ${TABS.filter(t => t.top !== false).map(t => `<a class="nav-link" data-match="${t.match[0]}" href="${t.route}">${t.label}</a>`).join("")}
    </div>
    <div class="nav-right">${rankChip()}<div class="access-nav">${authNavMarkup()}</div><button class="theme-btn" aria-label="Toggle theme"><span class="ti"></span></button></div>
  </nav>
  <main id="app"></main>
  <div class="side-veil" id="side-veil"></div>
  <aside class="sidebar" id="sidebar" aria-hidden="true" aria-label="Menu">
    <div class="side-head">
      <span class="side-brand">${brandMark}<span>FlutterForward</span></span>
      <button class="side-close" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    </div>
    <nav class="side-links">
      ${TABS.filter(t => t.top !== false).map(t => `<a class="side-link" data-match="${t.match[0]}" href="${t.route}"><span class="ico">${t.icon}</span><span>${t.label}</span></a>`).join("")}
    </nav>
    <div class="side-foot">
      <div class="access-nav">${authNavMarkup()}</div>
      ${rankChip()}
      <button class="theme-btn side-theme" aria-label="Toggle theme"><span class="ti"></span><span>Theme</span></button>
    </div>
  </aside>
  <div class="modal-veil" id="rankup-veil" hidden>
    <div class="modal rankup-dialog">
      <span class="trophy">${TROPHY_ICON}</span>
      <h2>Rank up</h2>
      <div class="newrank" id="rankup-name"></div>
      <p>Your Flutter skills are leveling up. Keep going.</p>
      <button class="btn btn-accent btn-block" id="rankup-ok">Keep learning →</button>
    </div>
  </div>
  <div class="modal-veil" id="logout-veil" hidden>
    <div class="modal exit-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-message">
      <h2 id="logout-title">Log out?</h2>
      <p id="logout-message">Your synced progress stays with your account and will return when you log in again.</p>
      <div class="exit-actions">
        <button class="btn exit-confirm" type="button" id="logout-confirm">Log out</button>
        <button class="btn exit-cancel" type="button" id="logout-cancel">Cancel</button>
      </div>
    </div>
  </div>
`;
  $$(".theme-btn").forEach(b => b.onclick = cycleTheme);
  $("#rankup-ok").onclick = hideRankUp;
  $("#rankup-veil").addEventListener("click", (e) => { if (e.target.id === "rankup-veil") hideRankUp(); });
  $("#logout-cancel").onclick = hideLogoutConfirm;
  $("#logout-confirm").onclick = confirmLogout;
  $("#logout-veil").addEventListener("click", e => { if (e.target.id === "logout-veil") hideLogoutConfirm(); });
  // mobile sidebar open/close
  const sidebar = $("#sidebar"), sveil = $("#side-veil");
  const openSide = () => { sidebar.classList.add("open"); sveil.classList.add("show"); sidebar.setAttribute("aria-hidden", "false"); document.body.classList.add("side-open"); };
  const closeSide = () => { sidebar.classList.remove("open"); sveil.classList.remove("show"); sidebar.setAttribute("aria-hidden", "true"); document.body.classList.remove("side-open"); };
  sveil.onclick = closeSide;
  $(".side-close").onclick = closeSide;
  $$(".side-link").forEach(a => a.addEventListener("click", closeSide));
  sidebar.addEventListener("click", e => {
    const action = e.target.closest(".side-foot .rank-chip, .side-foot .access-entry, .side-foot .summary-link, .side-foot [data-auth-logout]");
    if (!action) return;
    closeSide();
    if (action.matches("[data-auth-logout]")) showLogoutConfirm({ currentTarget: action });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#logout-veil").classList.contains("show")) hideLogoutConfirm();
    else if ($("#rankup-veil").classList.contains("show")) hideRankUp();
    else closeSide();
  });
  // mobile top mini-bar: navigation, brand and theme only (desktop nav is hidden here)
  const mini = document.createElement("div");
  mini.innerHTML = `<div style="display:flex;align-items:center;gap:9px;padding:14px 14px 0;max-width:920px;margin:0 auto">
    <button class="menu-btn" id="menu-btn" aria-label="Open menu"><span></span><span></span><span></span></button>
    <a class="mobile-home" href="#/home" aria-label="FlutterForward home" style="display:flex;align-items:center;text-decoration:none;color:inherit">
    ${brandMark}<span>FlutterForward</span></a>
    <button class="theme-btn" style="width:36px;height:36px;font-size:15px;margin-left:auto" aria-label="Toggle theme"><span class="ti"></span></button></div>`;
  mini.className = "mobile-top";
  document.body.prepend(mini);
  $("#menu-btn").onclick = openSide;
  $$(".mobile-top .theme-btn").forEach(b => b.onclick = cycleTheme);
  const st = document.createElement("style");
  st.textContent = `@media(min-width:1080px){.mobile-top{display:none}}`;
  document.head.appendChild(st);
}

/* ---------------- init ---------------- */
window.__FL_BOOTED = true;
if (window.__FL_TIMER) clearTimeout(window.__FL_TIMER);
shell();
initPopupScrollLock();
applyTheme();
updateRankUI();
updateAuthUI();
window.addEventListener("hashchange", route);
route();
initFirebase();


