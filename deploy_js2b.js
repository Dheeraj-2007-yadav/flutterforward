

/* Interactive widget-tree canvas behavior. These assignments replace the earlier hotspot-only renderer. */
(function enhanceTeardownTrees(){
  const waRoot = TEARDOWNS.whatsapp.root;
  if (waRoot.children.length === 2 && waRoot.children[0].id === "wa-theme") {
    waRoot.children[0].children = [waRoot.children[1]];
    waRoot.children = [waRoot.children[0]];
  }
  Object.values(TEARDOWNS).forEach(item => { item.count = Object.keys(tdIndex(item).map).length; });
})();

const TD_TREE_NODE_W = 124, TD_TREE_NODE_H = 47, TD_TREE_X_GAP = 22, TD_TREE_Y_GAP = 88;
function tdKind(name) {
  if (/TextField|Button|TabBar|Tab$/.test(name)) return "input";
  if (/Text|Icon|Image|Avatar/.test(name)) return "content";
  if (/Row|Column|Expanded|Padding|Container|SizedBox|Align|Center|ListView|Stack|ClipRRect/.test(name)) return "layout";
  return "structure";
}
function tdVisibleLayout(root) {
  const collapsed = teardownState.collapsed || new Set(), entries = [], links = [];
  let leaf = 0, maxDepth = 0;
  function visit(node, depth, parent) {
    maxDepth = Math.max(maxDepth, depth);
    const visibleChildren = collapsed.has(node.id) ? [] : node.children;
    let x;
    if (!visibleChildren.length) x = 24 + leaf++ * (TD_TREE_NODE_W + TD_TREE_X_GAP);
    else {
      const childEntries = visibleChildren.map(child => visit(child, depth + 1, node));
      x = childEntries.reduce((sum,entry)=>sum + entry.x,0) / childEntries.length;
    }
    const entry = { node, x, y: 24 + depth * TD_TREE_Y_GAP, depth, parent: parent ? parent.id : null };
    entries.push(entry);
    if (parent) links.push({ parent: parent.id, child: node.id });
    return entry;
  }
  visit(root,0,null);
  const minX = Math.min.apply(null, entries.map(entry=>entry.x));
  if (minX < 24) entries.forEach(entry=>entry.x += 24-minX);
  const map = Object.fromEntries(entries.map(entry=>[entry.node.id,entry]));
  const width = Math.max(360,...entries.map(entry=>entry.x + TD_TREE_NODE_W + 24));
  const height = 24 + (maxDepth + 1) * TD_TREE_Y_GAP + 18;
  return { entries, links, map, width, height };
}
function tdIsBelow(id, ancestor) {
  if (!teardownState.app || id === ancestor) return false;
  const parents = tdIndex(TEARDOWNS[teardownState.app]).parents;
  let current = id;
  while (parents[current]) { current = parents[current]; if (current === ancestor) return true; }
  return false;
}
function tdTreeMarkup() {
  const item = TEARDOWNS[teardownState.app], layout = tdVisibleLayout(item.root);
  teardownState.layout = layout;
  const animatedFrom = teardownState.animateFrom;
  const links = layout.links.map(link => {
    const a=layout.map[link.parent], b=layout.map[link.child];
    const x1=a.x+TD_TREE_NODE_W/2, y1=a.y+TD_TREE_NODE_H, x2=b.x+TD_TREE_NODE_W/2, y2=b.y;
    const mid=(y1+y2)/2, entering=animatedFrom&&(link.parent===animatedFrom||tdIsBelow(link.child,animatedFrom));
    return `<path class="teardown-tree-link${entering?' is-entering':''}" data-tree-child="${link.child}" d="M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}"/>`;
  }).join("");
  const nodes = layout.entries.map(entry => {
    const node=entry.node, hasChildren=node.children.length>0, isCollapsed=teardownState.collapsed.has(node.id);
    const entering=animatedFrom&&tdIsBelow(node.id,animatedFrom);
    return `<div class="td-tree-node kind-${tdKind(node.name)}${node.id===teardownState.selected?' is-selected':''}${entering?' is-entering':''}" data-tree-node="${node.id}" style="left:${entry.x}px;top:${entry.y}px;--enter-delay:${Math.min(220,entry.depth*36)}ms"><button class="td-tree-select" data-teardown-select="${node.id}" aria-label="Inspect ${esc(node.name)}"><span class="td-tree-type"></span><span class="td-tree-label">${esc(node.name)}</span></button>${hasChildren?`<button class="td-tree-collapse" data-tree-collapse="${node.id}" aria-expanded="${!isCollapsed}" aria-label="${isCollapsed?'Expand':'Collapse'} ${esc(node.name)}">${isCollapsed?'+':'−'}</button>`:''}</div>`;
  }).join("");
  teardownState.animateFrom = null;
  return `<section class="teardown-tree-shell" aria-label="Complete Flutter widget tree"><div class="teardown-tree-head"><div class="teardown-tree-copy"><b>Complete widget tree</b><span>${item.count} hand-authored widgets · drag to pan · wheel or buttons to zoom</span></div><div class="teardown-tree-tools"><button class="teardown-tree-tool" data-tree-zoom="out" aria-label="Zoom out">−</button><span class="teardown-tree-scale" data-tree-scale>100%</span><button class="teardown-tree-tool" data-tree-zoom="in" aria-label="Zoom in">+</button><button class="teardown-tree-tool fit" data-tree-fit>Fit</button></div></div><div class="teardown-tree-viewport" data-tree-viewport><div class="teardown-tree-world" data-tree-world style="width:${layout.width}px;height:${layout.height}px"><svg class="teardown-tree-links" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${links}</svg>${nodes}</div></div><div class="teardown-tree-legend"><span><i class="structure"></i>Structure</span><span><i class="layout"></i>Layout</span><span><i class="content"></i>Content</span><span><i class="input"></i>Input / control</span></div></section>`;
}

tdPanel = function() {
  const node = tdSelectedNode();
  if (!node) return `<aside class="teardown-panel is-empty"><div><span class="teardown-empty-icon">${TD_ICON.grid}</span><h3>Select any widget</h3><p>Choose a node in the complete tree or tap a region on the phone. Both views stay in sync.</p></div></aside>`;
  const item=TEARDOWNS[teardownState.app], path=tdPath(teardownState.app,node.id);
  const crumbs=path.map((part,i)=>`${i?'<span>›</span>':''}<button data-teardown-select="${part.id}"${part.id===node.id?' aria-current="page"':''}>${esc(part.name)}</button>`).join("");
  return `<aside class="teardown-panel" aria-live="polite"><div class="teardown-card-top"><span class="teardown-card-kicker">${esc(item.app)} · selected widget</span><button class="teardown-card-close" data-teardown-close aria-label="Close widget card">×</button></div><nav class="teardown-breadcrumb" aria-label="Widget breadcrumb">${crumbs}</nav><div class="teardown-widget-title"><span class="teardown-widget-mark">${esc(node.name.slice(0,3))}</span><span><h3>${esc(node.name)}</h3><p>Depth ${path.length-1} · ${node.children.length} direct child widget${node.children.length===1?'':'s'}</p></span></div><div class="teardown-facts"><div class="teardown-fact"><b>What it does</b><p>${esc(node.what)}</p></div><div class="teardown-fact"><b>Why it's here</b><p>${esc(node.why)}</p></div></div><div class="teardown-code"><div class="teardown-code-head"><span>Real Dart</span><button class="teardown-copy" data-teardown-copy>Copy code</button></div><pre><code>${esc(node.code)}</code></pre></div></aside>`;
};

tdDetailView = function() {
  const item=TEARDOWNS[teardownState.app];
  return `<div class="teardown-detail-head"><button class="teardown-back" data-teardown-index>${TD_ICON.back}All teardowns</button><button class="teardown-bounds" data-teardown-bounds aria-pressed="${teardownState.bounds}"><span>Show all bounds</span><span class="toggle-track" aria-hidden="true"><span class="toggle-thumb"></span></span></button></div><div class="teardown-detail-title"><span class="teardown-detail-kicker">${esc(item.app)} teardown</span><h2>${esc(item.screen)}</h2><p>Explore the full structural tree. Select any widget to see its role and Dart code; the matching phone region highlights automatically.</p></div><div class="teardown-tree-layout"><div class="teardown-phone-stage${teardownState.bounds?' show-bounds':''}"><div class="teardown-phone"><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div><p class="teardown-phone-hint">Tap a region to find it in the tree</p></div>${tdTreeMarkup()}${tdPanel()}</div>`;
};

function tdApplyView() {
  const world=$("[data-tree-world]"), scaleLabel=$("[data-tree-scale]"); if(!world||!teardownState.view)return;
  world.style.transform=`translate3d(${teardownState.view.x}px,${teardownState.view.y}px,0) scale(${teardownState.view.scale})`;
  if(scaleLabel) scaleLabel.textContent=`${Math.round(teardownState.view.scale*100)}%`;
}
function tdFitTree() {
  const viewport=$("[data-tree-viewport]"); if(!viewport||!teardownState.layout)return;
  const pad=22, vw=viewport.clientWidth, vh=viewport.clientHeight, layout=teardownState.layout;
  const scale=Math.min(.92,(vw-pad*2)/layout.width,(vh-pad*2)/layout.height);
  teardownState.view={scale:Math.max(.07,scale),x:(vw-layout.width*scale)/2,y:(vh-layout.height*scale)/2};
  tdApplyView();
}
function tdZoom(factor,clientX,clientY) {
  const viewport=$("[data-tree-viewport]"); if(!viewport||!teardownState.view)return;
  const rect=viewport.getBoundingClientRect(), px=(clientX==null?rect.left+rect.width/2:clientX)-rect.left, py=(clientY==null?rect.top+rect.height/2:clientY)-rect.top;
  const old=teardownState.view, next=Math.max(.07,Math.min(1.8,old.scale*factor));
  const wx=(px-old.x)/old.scale, wy=(py-old.y)/old.scale;
  teardownState.view={scale:next,x:px-wx*next,y:py-wy*next}; tdApplyView();
}
function tdSyncSelection() {
  const root=$("#teardowns-root"); if(!root)return;
  root.querySelectorAll(".td-tree-node.is-selected,.td-region.td-active").forEach(el=>el.classList.remove("is-selected","td-active"));
  const tree=root.querySelector(`[data-tree-node="${teardownState.selected||''}"]`); if(tree)tree.classList.add("is-selected");
  if(teardownState.selected){
    const path=tdPath(teardownState.app,teardownState.selected).slice().reverse();
    const region=path.map(node=>root.querySelector(`.td-region[data-node="${node.id}"]`)).find(Boolean);
    if(region)region.classList.add("td-active");
  }
  const oldPanel=root.querySelector(".teardown-panel"); if(oldPanel)oldPanel.outerHTML=tdPanel();
  document.body.classList.toggle("td-sheet-open",!!teardownState.selected&&window.matchMedia("(max-width: 760px)").matches);
}
function tdBindCanvas() {
  const viewport=$("[data-tree-viewport]"); if(!viewport)return;
  let drag=null, suppress=false;
  viewport.addEventListener("pointerdown",e=>{
    if(e.button!==0||e.target.closest("button"))return;
    if(!teardownState.view)tdFitTree();
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:teardownState.view.x,y:teardownState.view.y,moved:false};
    viewport.setPointerCapture(e.pointerId); viewport.classList.add("is-panning");
  });
  viewport.addEventListener("pointermove",e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
    if(Math.hypot(dx,dy)>5)drag.moved=true;
    teardownState.view.x=drag.x+dx;teardownState.view.y=drag.y+dy;tdApplyView();
  });
  const end=e=>{if(!drag||drag.id!==e.pointerId)return;suppress=drag.moved;drag=null;viewport.classList.remove("is-panning");window.setTimeout(()=>suppress=false,0);};
  viewport.addEventListener("pointerup",end);viewport.addEventListener("pointercancel",end);
  viewport.addEventListener("click",e=>{if(suppress){e.preventDefault();e.stopPropagation();}},true);
  viewport.addEventListener("wheel",e=>{e.preventDefault();tdZoom(e.deltaY<0?1.12:.89,e.clientX,e.clientY);},{passive:false});
}

tdPrepare = function() {
  const root=$("#teardowns-root"); if(!root||!teardownState.app)return;
  root.querySelectorAll(".td-region[data-node]").forEach(region=>{
    region.setAttribute("role","button");region.setAttribute("tabindex","0");region.setAttribute("aria-label",`Find ${region.dataset.widget} in widget tree`);
  });
  const stage=root.querySelector(".teardown-phone-stage");if(stage)stage.classList.toggle("show-bounds",teardownState.bounds);
  tdBindCanvas();tdApplyView();tdSyncSelection();
};
tdRender = function(keepView) {
  const root=$("#teardowns-root");if(!root)return;
  const previous=keepView?teardownState.view:null;
  root.innerHTML=teardownState.app?tdDetailView():teardownIndexView();
  teardownState.view=previous;tdPrepare();
  if(teardownState.app&&!previous)requestAnimationFrame(tdFitTree);
};
tdOpen = function(key) {
  if(!TEARDOWNS[key])return;
  teardownState={app:key,selected:null,bounds:false,collapsed:new Set(),view:null,layout:null,animateFrom:null};
  tdRender(false);window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"});
};
tdBack = function(){teardownState={app:null,selected:null,bounds:false,collapsed:new Set(),view:null};document.body.classList.remove("td-sheet-open");tdRender(false);window.scrollTo({top:0});};
tdSelect = function(id){if(!teardownState.app||!tdIndex(TEARDOWNS[teardownState.app]).map[id])return;teardownState.selected=id;tdSyncSelection();};
tdClose = function(){teardownState.selected=null;document.body.classList.remove("td-sheet-open");tdSyncSelection();};
tdToggleBounds = function(){teardownState.bounds=!teardownState.bounds;const stage=$(".teardown-phone-stage"),btn=$("[data-teardown-bounds]");if(stage)stage.classList.toggle("show-bounds",teardownState.bounds);if(btn)btn.setAttribute("aria-pressed",String(teardownState.bounds));};
function tdToggleBranch(id){
  const node=tdIndex(TEARDOWNS[teardownState.app]).map[id];if(!node||!node.children.length)return;
  if(teardownState.collapsed.has(id)){teardownState.collapsed.delete(id);teardownState.animateFrom=id;tdRender(true);return;}
  const root=$("#teardowns-root");
  if(root){root.querySelectorAll("[data-tree-node]").forEach(el=>{if(tdIsBelow(el.dataset.treeNode,id))el.classList.add("is-collapsing");});}
  window.setTimeout(()=>{teardownState.collapsed.add(id);tdRender(true);},mqMatches("(prefers-reduced-motion: reduce)")?0:180);
}
initTeardowns = function(){
  const root=$("#teardowns-root");if(!root)return;
  root.addEventListener("click",e=>{
    const open=e.target.closest("[data-teardown-open]");if(open){tdOpen(open.dataset.teardownOpen);return;}
    if(e.target.closest("[data-teardown-index]")){tdBack();return;}
    if(e.target.closest("[data-teardown-close]")){tdClose();return;}
    if(e.target.closest("[data-teardown-bounds]")){tdToggleBounds();return;}
    if(e.target.closest("[data-teardown-copy]")){tdCopy();return;}
    const collapse=e.target.closest("[data-tree-collapse]");if(collapse){e.preventDefault();e.stopPropagation();tdToggleBranch(collapse.dataset.treeCollapse);return;}
    if(e.target.closest("[data-tree-fit]")){tdFitTree();return;}
    const zoom=e.target.closest("[data-tree-zoom]");if(zoom){tdZoom(zoom.dataset.treeZoom==="in"?1.2:.83);return;}
    const select=e.target.closest("[data-teardown-select]");if(select){e.preventDefault();e.stopPropagation();tdSelect(select.dataset.teardownSelect);return;}
    if(teardownState.app){const hit=e.target.closest(".td-region[data-node]");if(hit&&root.contains(hit)){e.preventDefault();tdSelect(hit.dataset.node);}}
  });
  root.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".td-region[tabindex]")){e.preventDefault();tdSelect(e.target.dataset.node);}});
  onViewCleanup(()=>document.body.classList.remove("td-sheet-open"));
};

/* Pop-up widget inspector. The mind-map renderer above remains unused; detail views now
   lift the tapped component from the phone with a FLIP transform. */
(function installPopupTeardowns(){
  let inspector = null;
  const tdDismissRuns = [];
  function tdPublishDismissDebug() {
    let output = document.getElementById("td-dismiss-debug-output");
    if (!output) {
      output = document.createElement("output");
      output.id = "td-dismiss-debug-output";
      output.setAttribute("role","status");
      output.setAttribute("aria-label","Dismiss animation verification");
      output.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:pre;pointer-events:none";
      document.body.appendChild(output);
    }
    output.textContent = JSON.stringify(tdDismissRuns);
  }
  window.__tdInspectorDismissDebug = {
    clear(){ tdDismissRuns.length = 0; tdPublishDismissDebug(); },
    runs: tdDismissRuns
  };
  tdPublishDismissDebug();

  const TD_CONTEXT_LABELS = {
    "wa-day-align":"Center — day label", "wa-incoming":"Align — incoming question", "wa-outgoing":"Align — right bubble", "wa-reply":"Align — incoming reply",
    "wa-incoming-bubble":"Container — incoming question", "wa-outgoing-bubble":"Container — right bubble", "wa-reply-bubble":"Container — incoming reply",
    "wa-incoming-text":"Text — incoming question", "wa-outgoing-text":"Text — sent message", "wa-reply-text":"Text — incoming reply",
    "wa-video":"IconButton — video call", "wa-call":"IconButton — voice call", "wa-menu":"PopupMenuButton — more actions",
    "ig-posts-stat":"Column — posts", "ig-followers-stat":"Column — followers", "ig-following-stat":"Column — following",
    "ig-edit":"Expanded — edit profile", "ig-share":"Expanded — share profile", "ig-edit-button":"OutlinedButton — edit profile", "ig-share-button":"OutlinedButton — share profile",
    "ig-grid-tab":"Tab — posts grid", "ig-reels-tab":"Tab — Reels", "ig-tagged-tab":"Tab — tagged posts",
    "ig-home-item":"Icon — Home", "ig-search-item":"Icon — Search", "ig-create-item":"Icon — Create", "ig-reels-item":"Icon — Reels", "ig-profile-item":"CircleAvatar — Profile",
    "sw-food-nav":"Icon — Food", "sw-search-nav":"Icon — Search", "sw-cart-nav":"Icon — Cart", "sw-account-nav":"Icon — Account",
    "sw-category-image":"CircleAvatar — category image", "sw-category-label":"Text — category name", "sw-card-name":"Text — restaurant name", "sw-card-meta":"Text — rating and delivery time"
  };
  function tdContextLabel(node) { return TD_CONTEXT_LABELS[node.id] || node.name; }
  function tdInspectorPanelMarkup(node) {
    const item = TEARDOWNS[teardownState.app], fullPath = tdPath(teardownState.app,node.id);
    const path = fullPath.length <= 3 ? fullPath : fullPath.slice(-2);
    const crumbs = `${fullPath.length>3?'<span aria-hidden="true">…</span><span>›</span>':''}${path.map((part,i)=>`${i?'<span>›</span>':''}<button data-teardown-select="${part.id}"${part.id===node.id?' aria-current="page"':''}>${esc(tdContextLabel(part))}</button>`).join("")}`;
    const children = node.children.map((child,i)=>`<button class="teardown-child-chip" data-teardown-select="${child.id}" style="animation-delay:${i*38}ms">${esc(tdContextLabel(child))}</button>`).join("");
    const childSection = node.children.length ? `<div class="teardown-children"><b>Child widgets</b><div class="teardown-child-chips">${children}</div></div>` : "";
    const childSummary = node.children.length ? `${node.children.length} child widget${node.children.length===1?'':'s'}` : "Leaf widget";
    return `<aside class="td-inspector-panel" role="dialog" aria-modal="true" aria-label="Component details"><div class="teardown-card-top"><span class="teardown-card-kicker">Component details</span><button class="teardown-card-close" data-teardown-close aria-label="Close component details">×</button></div><nav class="teardown-breadcrumb" aria-label="Widget breadcrumb">${crumbs}</nav><div class="teardown-widget-title"><span class="teardown-widget-mark">${esc(node.name.slice(0,3))}</span><span><h3>${esc(node.name)}</h3><p>${esc(item.app)} · ${childSummary}</p></span></div><div class="teardown-facts"><div class="teardown-fact"><b>What it does</b><p>${esc(node.what)}</p></div><div class="teardown-fact"><b>Why it's here</b><p>${esc(node.why)}</p></div></div>${childSection}<div class="teardown-code"><div class="teardown-code-head"><span>Dart code</span><button class="teardown-copy" data-teardown-copy>Copy code</button></div><pre><code>${esc(node.code)}</code></pre></div></aside>`;
  }

  function tdSourceFor(id) {
    const root = $("#teardowns-root"); if (!root || !teardownState.app) return null;
    const index = tdIndex(TEARDOWNS[teardownState.app]);
    let current = index.map[id];
    while (current) {
      const exact = root.querySelector(`.td-region[data-node="${current.id}"]`);
      if (exact) return exact;
      current = index.parents[current.id] ? index.map[index.parents[current.id]] : null;
    }
    return root.querySelector(".teardown-screen .td-region[data-node]");
  }

  function tdCleanClone(source, rect) {
    const clone = source.cloneNode(true);
    clone.classList.remove("td-active","td-source-hidden");
    clone.classList.add("td-pop-clone");
    clone.removeAttribute("role"); clone.removeAttribute("tabindex"); clone.removeAttribute("aria-label");
    clone.querySelectorAll(".td-hotspot").forEach(el=>el.remove());
    clone.querySelectorAll("[tabindex]").forEach(el=>el.setAttribute("tabindex","-1"));
    clone.querySelectorAll("button").forEach(el=>el.setAttribute("tabindex","-1"));
    const cs = getComputedStyle(source);
    clone.style.left = `${rect.left}px`; clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`; clone.style.height = `${rect.height}px`;
    clone.style.color = cs.color; clone.style.backgroundColor = cs.backgroundColor;
    clone.style.borderRadius = cs.borderRadius; clone.style.overflow = cs.overflow;
    clone.style.fontFamily = cs.fontFamily; clone.style.fontSize = cs.fontSize;
    clone.style.fontWeight = cs.fontWeight; clone.style.fontStyle = cs.fontStyle;
    clone.style.lineHeight = cs.lineHeight; clone.style.letterSpacing = cs.letterSpacing;
    clone.style.textAlign = cs.textAlign; clone.style.whiteSpace = cs.whiteSpace;
    clone.style.wordBreak = cs.wordBreak; clone.style.overflowWrap = cs.overflowWrap;
    clone.style.padding = cs.padding; clone.style.border = cs.border;
    clone.style.transform = "translate3d(0,0,0) scale(1)";
    return clone;
  }

  function tdTargetFor(rect,panel) {
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
  const brandMark = `<img class="brand-logo brand-logo-light" src="assets/brand-mark-light.png" alt=""><img class="brand-logo brand-logo-dark" src="assets/brand-mark-dark.png" alt="">`;
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


