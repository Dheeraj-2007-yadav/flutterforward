"use strict";const $=(e,t)=>(t||document).querySelector(e),$$=(e,t)=>Array.from((t||document).querySelectorAll(e)),esc=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),escAttr=e=>esc(e).replace(/"/g,"&quot;").replace(/'/g,"&#39;");let uiStore=null;function readUiState(){if(uiStore)return uiStore;try{const t=localStorage.getItem("ff_ui");if(t){const e=JSON.parse(t);if(e&&"object"==typeof e)return uiStore=e}}catch(e){}return null}function writeUiState(e){uiStore={theme:e.theme,seenRanks:e.seenRanks,lang:e.lang||"en",bookPages:e.bookPages||(uiStore&&uiStore.bookPages)||{}};
try{localStorage.setItem("ff_ui",JSON.stringify(uiStore))}catch(e){}}
function readBookPage(num){try{var u=readUiState()||{};var bp=u.bookPages||{};var p=bp[num];return(typeof p==="number"&&p>=0)?p:0;}catch(e){return 0;}}
function saveBookPage(num,page){try{if(!(num>0))return;var u=readUiState()||{};var bp=u.bookPages||{};if(bp[num]===page)return;bp[num]=page;writeUiState({theme:u.theme,seenRanks:u.seenRanks,lang:u.lang,bookPages:bp});}catch(e){}}
function getLang(){var l="en";try{var t=localStorage.getItem("ff_ui");if(t){var u=JSON.parse(t);if(u&&u.lang)l=u.lang}}catch(e){}try{if(typeof S!=="undefined"&&S.lang)l=S.lang}catch(e){}return(l==="hi"||l==="hinglish"||l==="hindi")?"hi":"en";}
function setLang(l){l=(l==="hi"||l==="hinglish"||l==="hindi")?"hi":"en";try{S.lang=l}catch(e){}try{var u=readUiState()||{};writeUiState({theme:u.theme,seenRanks:u.seenRanks,lang:l})}catch(e){}}const store={read:()=>readUiState(),write(e){writeUiState(e),saveProgressToFirestore()}};let firestoreSaveTimer=null,lastCloudJson="",cloudReadyUid=null,cloudFailed=!1,cloudDirty=!1,cloudRetryAt=0,homeWasLoading=!1,authStuck=!1;function activeUid(){try{return currentUser?currentUser.uid:null}catch(e){return null}}function authIsBroken(){try{return!!authUnavailable}catch(e){return!0}}function firestoreUsable(){return!(!window.firebase||authIsBroken()||"function"!=typeof firebase.firestore)}function progressPayload(e){return{lessonsDone:e&&e.lessonsDone||{},quizzesPassed:e&&e.quizzesPassed||{},quizHistory:e&&e.quizHistory||{},last:e&&e.last||null,lastLesson:e&&e.lastLesson||null}}function writeProgressToFirestore(e,t){if(e&&firestoreUsable())try{let n=null;try{n=firebase.firestore.FieldValue.serverTimestamp()}catch(e){n=Date.now()}firebase.firestore().collection("userProgress").doc(e).set(Object.assign(progressPayload(t),{updatedAt:n}),{merge:!0}).catch(e=>console.warn("[progress] cloud save failed:",e))}catch(e){console.warn("[progress] cloud save error:",e)}}function saveProgressToFirestore(){const e=activeUid();if(!e)return;if(cloudReadyUid!==e){cloudDirty=!0;return}clearTimeout(firestoreSaveTimer),firestoreSaveTimer=setTimeout(()=>{const t=JSON.stringify(progressPayload(S));t!==lastCloudJson&&(lastCloudJson=t,writeProgressToFirestore(e,S))},1500)}function cloudStatusText(){if(cloudFailed)return"Cloud backup: failed — retrying…";if(!currentUser||cloudReadyUid!==currentUser.uid)return"Cloud backup: syncing…";if(cloudDirty)return"Cloud backup: pending…";return"Cloud backup: synced ✓"}function flushProgressToFirestore(e){clearTimeout(firestoreSaveTimer),firestoreSaveTimer=null,e&&cloudReadyUid===e&&(lastCloudJson=JSON.stringify(progressPayload(S)),writeProgressToFirestore(e,S))}function loadProgressFromFirestore(e){if(!e)return Promise.resolve(null);if(!firestoreUsable())return Promise.reject(new Error("firestore unavailable"));try{const d=new Promise((a,b)=>setTimeout(()=>b(new Error("cloud load timeout")),12000));d.catch(()=>{});return Promise.race([firebase.firestore().collection("userProgress").doc(e).get().then(e=>{if(e&&e.exists){const t=e.data()||{};return{lessonsDone:t.lessonsDone||{},quizzesPassed:t.quizzesPassed||{},quizHistory:t.quizHistory||{},last:t.last||null,lastLesson:t.lastLesson||null}}return null}).catch(e=>{console.warn("[progress] cloud load failed, using local copy:",e);throw e}),d])}catch(e){return Promise.reject(e)}}function applyProgressState(e,t){S.lessonsDone=e&&e.lessonsDone||{},S.quizzesPassed=e&&e.quizzesPassed||{},S.quizHistory=e&&e.quizHistory||{},S.last=e&&e.last||null,S.lastLesson=e&&e.lastLesson||null;try{updateRankUI()}catch(e){}try{route()}catch(e){}t&&flushProgressToFirestore(t)}function switchProgressUser(e,t){if(e===t)return;flushProgressToFirestore(e);lastCloudJson="";if(!t){cloudReadyUid=null,cloudFailed=!1,cloudDirty=!1,applyProgressState(defaultState(),null);return}loadProgressFromFirestore(t).then(s=>{cloudReadyUid=t,cloudFailed=!1,cloudDirty=!1,applyProgressState(s||defaultState(),t)}).catch(()=>{cloudFailed=!0,cloudReadyUid=null,applyProgressState(defaultState(),t)})}function defaultState(){return{lessonsDone:{},quizzesPassed:{},quizHistory:{},last:null,lastLesson:null,theme:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",seenRanks:[0],lang:"en"}}let S=Object.assign(defaultState(),store.read()||{});function save(){store.write(S)}!function(){if(S.quizHistory||(S.quizHistory={}),S.quizScores){let e=!1;for(const t of Object.keys(S.quizScores))if(!S.quizHistory[t]){const n=S.quizScores[t];S.quizHistory[t]=[{score:n.score,total:n.total,pct:Math.round(n.score/n.total*100),answers:null,at:0}],e=!0}delete S.quizScores,e&&save()}}();const FIREBASE_CONFIG={apiKey:"AIzaSyCp2thp67ICMbOUDZoBzh0PTbKqp9DNjto",authDomain:"flutterforward-2f275.firebaseapp.com",projectId:"flutterforward-2f275",storageBucket:"flutterforward-2f275.firebasestorage.app",messagingSenderId:"1037995308206",appId:"1:1037995308206:web:276ba49391aafdbd82293f"};let auth=null,currentUser=null,authReady=!1,authUnavailable=!1,authMode="login",authSlideDirection=0,authSwitching=!1,authReset=!1,authResetSent=null,authResetEmail="";function userName(e){return e?(e.displayName||(e.email?e.email.split("@")[0]:"Flutter Learner")).trim():"Flutter Learner"}function friendlyAuthError(e){const t=e&&e.code?e.code:"";return{"auth/wrong-password":"That password is incorrect. Please try again.","auth/user-not-found":"No account was found for that email.","auth/email-already-in-use":"An account already exists for that email. Try logging in.","auth/weak-password":"Use a stronger password with at least 6 characters.","auth/network-request-failed":"Network issue. Check your connection and try again.","auth/invalid-email":"Enter a valid email address.","auth/too-many-requests":"Too many attempts. Wait a little, then try again.","auth/operation-not-allowed":"Email and password sign-in is not enabled yet.","auth/unauthorized-domain":"This site domain needs to be added in Firebase Authentication settings.","auth/invalid-credential":"The email or password doesn't match an account.","auth/invalid-login-credentials":"The email or password doesn't match an account."}[t]||(t?`Something went wrong (${t}) — try again.`:"Something went wrong — try again.")}function authNavMarkup(){return(authReady||authUnavailable)&&currentUser?`<a class="profile-link" data-match="profile" href="#/profile" aria-label="Open profile">\n    <span class="profile-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span class="profile-name">${esc(userName(currentUser))}</span></a>\n    <button class="auth-logout" type="button" data-auth-logout>Logout</button>`:'<a class="auth-login" href="#/profile"><span class="auth-login-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span>Login</span></a>'}function updateAuthUI(){$$(".auth-nav").forEach(e=>{e.innerHTML=authNavMarkup()}),$$(".nav-right").forEach(e=>{const r=e.querySelector(".rank-chip");if(!currentUser&&r)r.remove();else if(currentUser&&!r){const d=document.createElement("div");d.innerHTML=rankChip();const c=d.firstChild;if(c){const s=e.querySelector(".nav-search");if(s&&s.nextSibling)e.insertBefore(c,s.nextSibling);else e.appendChild(c);}}}),$$(".side-foot").forEach(e=>{const r=e.querySelector(".rank-chip");if(!currentUser&&r)r.remove();else if(currentUser&&!r){const d=document.createElement("div");d.innerHTML=rankChip();const c=d.firstChild;if(c)e.appendChild(c);}}),$$("[data-auth-logout]").forEach(e=>{e.closest("#sidebar")||(e.onclick=showLogoutConfirm)}),(location.hash||"#/home").startsWith("#/profile")&&setActiveTab("profile")}function syncModalScrollLock(){const e=!!document.querySelector(".modal-veil:not([hidden])");document.body.classList.toggle("popup-open",e)}const MODAL_CLOSE_MS=180;function closeModalVeil(e,t){e&&!e.classList.contains("closing")&&(e.classList.add("closing"),syncModalScrollLock(),setTimeout(()=>{e.classList.remove("show","closing"),t?e.remove():e.hidden=!0,syncModalScrollLock()},180))}function showToast(msg){const old=document.querySelector(".ff-toast");old&&old.remove();const t=document.createElement("div");t.className="ff-toast";t.setAttribute("role","status");t.textContent=msg;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add("show"));setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.remove(),300);},2400);}let logoutReturnFocus=null;function showLogoutConfirm(e){if(!auth||!currentUser)return;logoutReturnFocus=e&&e.currentTarget||document.activeElement;const t=$("#logout-veil");t&&(t.hidden=!1,requestAnimationFrame(()=>{t.classList.add("show");const e=$("#logout-cancel");e&&e.focus()}))}function showProgressLoginPrompt(o){const _t=o&&o.title||"Log in to save progress",_m=o&&o.message||"Log in to save your progress. Progress is saved to your account on the server — without login, it can't be saved.";const n=document.createElement("div");n.className="modal-veil",n.innerHTML='<div class="modal logout-dialog progress-login-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-login-title" aria-describedby="progress-login-message">\n      <h2 id="progress-login-title">'+_t+'</h2>\n      <p id="progress-login-message">'+_m+'</p>\n      <button class="modal-close" type="button" data-progress-close aria-label="Close">\u00d7</button>\n      <div class="logout-actions">\n        <button class="btn btn-soft" type="button" data-progress-close>Not now</button>\n        <button class="btn btn-accent" type="button" data-progress-login>Log in</button>\n      </div>\n    </div>',document.body.appendChild(n);const s=e=>{document.removeEventListener("keydown",a),closeModalVeil(n,!0),e?setTimeout(e,180):(o&&typeof o.onClose==="function"&&o.onClose())},a=e=>{"Escape"===e.key&&s()};n._ffDismiss=function(){s(function(){})};/* route-change dismiss handle: the veil's own close closure with a no-op callback — removes the Escape listener and fades the veil via closeModalVeil, but skips the gate's onClose hash-reset (the route already changed, and on auth-resolve re-renders the user must stay on the page they just unlocked) */n.addEventListener("click",e=>{e.target===n&&s()}),n.querySelector("[data-progress-login]").onclick=()=>s(()=>{location.hash="#/profile"}),n.querySelectorAll("[data-progress-close]").forEach(b=>{b.onclick=()=>s()}),document.addEventListener("keydown",a),requestAnimationFrame(()=>{n.classList.add("show"),syncModalScrollLock(),n.querySelector("[data-progress-login]").focus()})}
// Freemium: the first FREE_LESSONS lessons + quizzes are free for guests; the rest need login.
const FREE_LESSONS=3;
function showGatePrompt(kind,num){const f=FREE_LESSONS;const listHash=kind==="quiz"?"#/quizzes":"#/lessons";const itemHash=(kind==="quiz"?"#/quiz/":"#/lesson/")+num;const onClose=()=>{if((location.hash||"")===itemHash)location.hash=listHash;};showProgressLoginPrompt(kind==="quiz"?{title:"Log in to unlock this quiz",message:"The first "+f+" quizzes are free. Log in to unlock all 40 quizzes, save your results, and track your rank.",onClose}:{title:"Log in to unlock this lesson",message:"The first "+f+" lessons are free. Log in to unlock all 40 lessons, save your progress, and track your rank.",onClose});}
function hideLogoutConfirm(){const e=$("#logout-veil");if(!e||!e.classList.contains("show"))return;closeModalVeil(e,!1);const t=logoutReturnFocus;logoutReturnFocus=null,t&&document.contains(t)&&setTimeout(()=>t.focus(),180)}async function confirmLogout(){if(!auth)return;const e=$("#logout-confirm");e&&(e.disabled=!0,e.textContent="Logging out…");try{await auth.signOut(),hideLogoutConfirm()}catch(e){}finally{e&&(e.disabled=!1,e.textContent="Log out")}}function initFirebaseAuth(){if(!window.firebase)return authUnavailable=!0,authReady=!0,updateAuthUI(),void(((location.hash||"").startsWith("#/profile")||["","#","#/","#/home"].indexOf(location.hash||"")>=0)&&render());try{firebase.apps.length||firebase.initializeApp(FIREBASE_CONFIG),auth=firebase.auth(),auth.onAuthStateChanged(e=>{const t=currentUser?currentUser.uid:null,n=e?e.uid:null;currentUser=e||null,authReady=!0,switchProgressUser(t,n),updateAuthUI(),((location.hash||"#/home").startsWith("#/profile")||(location.hash||"#/home")==="#/home")&&render()},()=>{authUnavailable=!0,authReady=!0,updateAuthUI(),((location.hash||"").startsWith("#/profile")||["","#","#/","#/home"].indexOf(location.hash||"")>=0)&&render()})}catch(e){authUnavailable=!0,authReady=!0,updateAuthUI(),((location.hash||"").startsWith("#/profile")||["","#","#/","#/home"].indexOf(location.hash||"")>=0)&&render()}}const RANKS=DATA.ranks,QUIZ_PASS=DATA.quiz.passPercent;function doneCount(){const e=S.lessonsDone||{},t=S.quizzesPassed||{};let n=0;for(const l of LESSON_META){const a=e[l.id],o=t[l.quizId];a&&o&&n++}return n}function rankIndexFor(e){let t=0;return RANKS.forEach((n,s)=>{e>=n.need&&(t=s)}),t}function bumpRank(e){save();const t=rankIndexFor(doneCount());updateRankUI(),t>e&&setTimeout(()=>showRankUp(t),450),render()}function updateRankUI(){const e=rankIndexFor(doneCount());$$(".rank-chip").forEach(t=>{t.innerHTML=`<span class="rank-dot">${TROPHY_ICON}</span><span>${esc(RANKS[e].name)}</span>`})}function confetti(){const e=document.createElement("canvas");e.id="confetti",document.body.appendChild(e);const t=e.getContext("2d");e.width=innerWidth,e.height=innerHeight;const n=["#02569B","#13B9FD","#34d399","#fcd34d","#f0abfc","#ffffff"],s=Array.from({length:140},()=>({x:innerWidth/2+220*(Math.random()-.5),y:.38*innerHeight,vx:13*(Math.random()-.5),vy:-11*Math.random()-4,s:8*Math.random()+4,r:Math.random()*Math.PI,vr:.3*(Math.random()-.5),col:n[Math.random()*n.length|0],life:1}));let a=0;!function n(){t.clearRect(0,0,e.width,e.height),s.forEach(e=>{e.x+=e.vx,e.y+=e.vy,e.vy+=.32,e.r+=e.vr,e.life-=.008,t.save(),t.translate(e.x,e.y),t.rotate(e.r),t.globalAlpha=Math.max(e.life,0),t.fillStyle=e.col,t.fillRect(-e.s/2,-e.s/2,e.s,.62*e.s),t.restore()}),++a<240?requestAnimationFrame(n):e.remove()}()}function showRankUp(e){const t=RANKS[e],n=$("#rankup-veil");$("#rankup-name").textContent=t.name,n.hidden=!1,requestAnimationFrame(()=>n.classList.add("show")),confetti()}function hideRankUp(){closeModalVeil($("#rankup-veil"),!1)}function highlightDart(e){let t=esc(e);return t=t.replace(/(\/\/[^\n]*)/g,"$1"),t=t.replace(/('.*?'|".*?")/g,"$1"),t=t.replace(/\b(import|void|class|extends|final|const|var|return|if|else|for|while|do|new|this|super|required|late|get|set|async|await|switch|case|break|continue|true|false|null|int|double|bool|String|dynamic|override)\b/g,'<span class="tok-k">$1</span>'),t=t.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="tok-n">$1</span>'),t=t.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g,'<span class="tok-a">$1</span>'),t=t.replace(/([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g,'<span class="tok-f">$1</span>'),t=t.replace(/(@\w+)/g,'<span class="tok-a">$1</span>'),t=t.replace(/\u0001([\s\S]*?)\u0002/g,'<span class="tok-c">$1</span>'),t=t.replace(/\u0003([\s\S]*?)\u0004/g,'<span class="tok-s">$1</span>'),t}function inlineFmt(e){let t=esc(e);return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/`([^`]+?)`/g,'<code class="inline">$1</code>'),t}function mdToHtml(e){const t=/```(\w*)\n([\s\S]*?)\n```/g;let n,s="",a=0;for(;n=t.exec(e);)s+=mdText(e.slice(a,n.index)),s+=codeBlock(n[2],n[1]||"dart"),a=n.index+n[0].length;return s+=mdText(e.slice(a)),s}function mdText(e){const t=e.split("\n");let n="",s=[],a=null;const o=()=>{s.length&&(n+=`<p>${inlineFmt(s.join(" "))}</p>`,s=[])},i=()=>{a&&(n+=("ul"===a?"<ul>":"<ol>")+r+("ul"===a?"</ul>":"</ol>"),a=null,r="")};let r="";for(const e of t){const t=e.trim();if(!t){o(),i();continue}if(t.startsWith("## ")){o(),i(),n+=`<h2>${inlineFmt(t.slice(3))}</h2>`;continue}if(t.startsWith("# ")){o(),i(),n+=`<h1>${inlineFmt(t.slice(2))}</h1>`;continue}const l=t.match(/^[-*] (.+)/),c=t.match(/^\d+\. (.+)/);if(l||c){o();const e=l?"ul":"ol",t=(l||c)[1];a!==e&&(i(),a=e),r+=`<li>${inlineFmt(t)}</li>`;continue}i(),s.push(t)}return o(),i(),n}function codeBlock(e,t){const n="cb"+Math.random().toString(36).slice(2,8),s="dart"===t?highlightDart(e):esc(e);return`<div class="codeblock">\n    <div class="code-head"><span class="dots"><i></i><i></i><i></i></span>\n    <span class="lang">${esc(t||"code")}</span>\n    <button class="copy-btn" data-copy="${n}">Copy</button></div>\n    <pre id="${n}"><code>${s}</code></pre></div>`}function rankChip(){if(!currentUser)return'';return'<a class="rank-chip" href="#/progress" aria-label="View your rank and progress"></a>'}function pageHead(e,t,n){return`<div class="page-head">${e?`<div class="crumb">${e}</div>`:""}\n    <h1>${t}</h1>${n?`<p>${n}</p>`:""}</div>`}document.addEventListener("click",e=>{const t=e.target.closest("[data-copy]");if(!t)return;const n=document.getElementById(t.dataset.copy),s=n?n.innerText:"",a=()=>{t.textContent="Copied ✓",t.classList.add("ok"),setTimeout(()=>{t.textContent="Copy",t.classList.remove("ok")},1600)};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(a).catch(a);else{const t=document.createElement("textarea");t.value=s,document.body.appendChild(t),t.select();try{document.execCommand("copy")}catch(e){}t.remove(),a()}});const views={},FEATURES=[{title:"Guided lessons",href:"#/lessons",text:"Focused modules move from setup to state, with a PDF for revision whenever you need it.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H4z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v18a3 3 0 0 1 3-3h3z"/></svg>'},{title:"Live playground",href:"#/playground",text:"Open DartPad, change the code, and see what happens. No local setup required.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 5-4 14"/></svg>'},{title:"Quick checks",href:"#/quizzes",text:"Short quizzes explain every answer, so weak points become clear before you move on.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5 11 14l4-5"/><circle cx="12" cy="12" r="9"/></svg>'},{title:"Visible progress",href:"#/progress",text:"Completed lessons, quiz results, and ranks stay together in one simple progress view.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>'},{title:"Resources",href:"#/resources",text:"Cheat sheets, notes, and guides. Free downloads and premium content.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>'}];
// Premium round (Workstream B): one self-contained inline-SVG brand mark per
// app, keyed by the DISPLAY name tdAppGroups() produces ("Swiggy-style" is
// already normalised to "Swiggy" there). Each SVG draws its own squircle tile
// (56x56 viewBox, rx 12 ~ 22%) in the app's brand colours, so the tile needs
// no background from CSS or the old glyph/accent fields. The SVGs are
// inserted RAW into the card template (never through esc()) — esc() would
// escape the markup. The teardowns list renders these, and so does the home
// strip (TD_STRIP, line ~68): this map lives at TOP LEVEL, before views.home,
// so both views.home (which renders during boot, before `const TEARDOWNS`
// initialises) and teardownIndexView can reference it — declared inside
// views.home it would be function-scoped and invisible to the teardowns list
// (a ReferenceError that empties the list). The detail view and phone mocks in Flutter blue
// (#02569B): a key reads "sign in" at a glance, a lock would read "blocked",
// and a hand-drawn Flutter logo risks an off-brand mark.
var TD_APP_ICONS = {
  "WhatsApp": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#25D366"/><path d="M28 13c-8 0-14.5 6.5-14.5 14.5 0 2.7.7 5.2 2 7.4L13.5 42l7.3-1.9c2.2 1.2 4.6 1.9 7.2 1.9 8 0 14.5-6.5 14.5-14.5S36 13 28 13z" fill="#fff"/><path d="M21 24 Q23.5 32.5 32 35" stroke="#25D366" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20.5" cy="22.5" r="3.2" fill="#25D366"/><circle cx="33" cy="35.5" r="3.2" fill="#25D366"/></svg>',
  "Instagram": '<svg viewBox="0 0 56 56" aria-hidden="true"><defs><linearGradient id="tdIgGrad" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".5" stop-color="#d62976"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><rect width="56" height="56" rx="12" fill="url(#tdIgGrad)"/><rect x="15" y="15" width="26" height="26" rx="8" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="28" cy="28" r="6.2" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="36.6" cy="19.4" r="1.9" fill="#fff"/></svg>',
  "Swiggy": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#fc8019"/><path d="M28 12c-6.9 0-12.5 5.6-12.5 12.5 0 9.3 12.5 19.5 12.5 19.5s12.5-10.2 12.5-19.5C40.5 17.6 34.9 12 28 12z" fill="#fff"/><circle cx="28" cy="24.5" r="5" fill="#fc8019"/></svg>',
  "Settings": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#5b5bd6"/><g fill="#fff"><rect x="26.1" y="11" width="3.8" height="8" rx="1.4"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(45 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(90 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(135 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(180 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(225 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(270 28 28)"/><rect x="26.1" y="11" width="3.8" height="8" rx="1.4" transform="rotate(315 28 28)"/></g><circle cx="28" cy="28" r="9.5" fill="#fff"/><circle cx="28" cy="28" r="4" fill="#5b5bd6"/></svg>',
  "Login": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#fff"/><circle cx="23" cy="23" r="7.5" fill="none" stroke="#02569B" stroke-width="4"/><path d="M28.5 28.5 L42 42" stroke="#02569B" stroke-width="4" stroke-linecap="round"/><path d="M37.3 37.3 L34.5 40.1 M40 40 L37.2 42.8" stroke="#02569B" stroke-width="3.6" stroke-linecap="round"/></svg>',
  "YouTube": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#ff0000"/><path d="M23.5 20 L39 28 L23.5 36 Z" fill="#fff" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  "Spotify": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#1DB954"/><g fill="none" stroke="#191414" stroke-width="3" stroke-linecap="round"><path d="M16.5 23.5 Q28 18.5 39.5 23.5"/><path d="M18 30 Q28 25.5 38 30"/><path d="M19.5 36.5 Q28 32.5 36.5 36.5"/></g></svg>',
  "Amazon": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#fff"/><text x="28" y="33" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#232F3E">a</text><path d="M14.5 37.5 C 20 43.5, 32 43.5, 40.5 36.5" fill="none" stroke="#ff9900" stroke-width="2.6" stroke-linecap="round"/><polygon points="40.5,36.5 35.6,35.6 38.2,41" fill="#ff9900"/></svg>',
  "Gmail": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#fff"/><polygon points="13,17 28,30 13,39" fill="#4285F4"/><polygon points="43,17 28,30 43,39" fill="#34A853"/><polygon points="13,39 43,39 28,30" fill="#FBBC04"/><path d="M15.5 19.5 L28 29.5 L40.5 19.5" fill="none" stroke="#EA4335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  "Netflix": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#000"/><polygon points="18,14 24,14 24,42 18,42" fill="#E50914"/><polygon points="32,14 38,14 38,42 32,42" fill="#E50914"/><polygon points="30,14 38,14 26,42 18,42" fill="#B1060F"/></svg>',
  "Calculator": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#1a73e8"/><rect x="15" y="12" width="26" height="8" rx="2" fill="#fff"/><g fill="#fff" opacity=".88"><rect x="15" y="24" width="7" height="6" rx="1.5"/><rect x="24.5" y="24" width="7" height="6" rx="1.5"/><rect x="34" y="24" width="7" height="6" rx="1.5"/><rect x="15" y="33" width="7" height="6" rx="1.5"/><rect x="24.5" y="33" width="7" height="6" rx="1.5"/><rect x="34" y="33" width="7" height="6" rx="1.5"/><rect x="15" y="42" width="7" height="6" rx="1.5"/><rect x="24.5" y="42" width="7" height="6" rx="1.5"/></g><rect x="34" y="42" width="7" height="6" rx="1.5" fill="#FBBC04"/></svg>',
  "Notes": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#FBBC04"/><rect x="14" y="11" width="23" height="34" rx="2" fill="#fff"/><g stroke="#FBBC04" stroke-width="2" stroke-linecap="round"><path d="M18 18 H33"/><path d="M18 24 H33"/><path d="M18 30 H29"/></g><path d="M35.5 43.5 L46.5 30" stroke="#1a73e8" stroke-width="4.5" stroke-linecap="round"/><polygon points="33.2,41.8 38.2,45.2 34.6,47.8" fill="#202124"/></svg>',
  "Tasks": '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="12" fill="#1a73e8"/><circle cx="28" cy="28" r="14" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M21 28.5 L26 33.5 L36 23" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
views.home=()=>{
const wasLoading=homeWasLoading;homeWasLoading=!1;
if(!authReady&&!authUnavailable&&!authStuck||currentUser&&cloudReadyUid!==currentUser.uid&&!cloudFailed){homeWasLoading=!0;return `<div class="min-home bento-home">
<section class="bento-head">
<h1>Welcome to <span class="bento-brand">FlutterForward.</span></h1>
<p class="bento-tagline">Thoughtfully complete. Beautifully uncomplicated.</p>
</section>
<div class="bento-card">
<div class="bento-label">YOUR PROGRESS</div>
<div class="bento-row"><span>Loading your progress…</span></div>
</div>
</div>`}
if(currentUser&&cloudFailed)return `<div class="min-home bento-home"> <section class="bento-head"> <h1>Welcome to <span class="bento-brand">FlutterForward.</span></h1> <p class="bento-tagline">Thoughtfully complete. Beautifully uncomplicated.</p> </section> <div class="bento-card"> <div class="bento-label">YOUR PROGRESS</div> <div class="bento-row"><span>Couldn't load your progress — check your connection. Retrying automatically…</span></div> </div> </div>`; const freshHome=!document.body.classList.contains("home-page")||wasLoading;
const nx=LESSON_META.find(l=>!S.lessonsDone[l.id]);
const nxTitle=nx?esc(nx.title):"All lessons complete";
const nxHref=nx?`lesson/${nx.num}`:"lessons";
const nxBtn=nx?(currentUser?"Resume Learning":"Start Learning"):"Browse lessons";
const doneN=LESSON_META.filter(e=>S.lessonsDone[e.id]).length;
const passN=DATA.quizzes.filter(q=>S.quizzesPassed[q.id]).length;
const pct=Math.round(doneN/40*100);
const rankName=RANKS[rankIndexFor(doneCount())].name;
const CIRC=175.93,off=CIRC*(1-doneN/40);
const doneC=doneCount(),rankIdx=rankIndexFor(doneC),nextRank=RANKS[rankIdx+1]||null,nextNeed=nextRank?nextRank.need:40,toNext=nextRank?Math.max(0,nextNeed-doneC):0;
const bestArr=Object.values(S.quizHistory||{}).reduce((a,t)=>a.concat(t.map(e=>e.pct)),[]),best=bestArr.length?Math.max.apply(null,bestArr):null;
const firstUnpassed=DATA.quizzes.find(q=>!S.quizzesPassed[q.id]),dq=firstUnpassed||DATA.quizzes[0],allQuizzesPassed=!firstUnpassed;
const dqLesson=dq?LESSON_META.find(l=>l.quizId===dq.id):null,dqNum=dqLesson?dqLesson.num:1,dqTitle=dqLesson?dqLesson.title:"";
const nxQuiz=nx?DATA.quizzes.find(q=>q.id===nx.quizId):null,nxQCount=nxQuiz?(nxQuiz.questions_en||[]).length:10;
const tdApps=13,tdScreens=29; // STATIC: views.home runs during boot before `const TEARDOWNS` initializes (boot line 1189 calls route()/initFirebaseAuth(); the guest auth path renders home synchronously), so it must never touch TEARDOWNS/tdAppGroups — a TDZ throw here aborts the whole script. Counts verified from TEARDOWNS data: 13 apps, 29 screens.
const TD_STRIP=[["W","#008069","WhatsApp"],["IG","#d83282","Instagram"],["S","#fc8019","Swiggy"],["a","#ff9900","Amazon"],["M","#ea4335","Gmail"]]; // first 5 teardown apps in TEARDOWNS order, same glyphs/accents
const _now=new Date(),_hr=_now.getHours(),_greet=_hr<12?"Good morning":_hr<17?"Good afternoon":"Good evening",_first=currentUser?userName(currentUser).split(" ")[0]:"",_dateLine=_now.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const _dayIdx=(_now.getDay()+6)%7,_weekStart=new Date(_now.getFullYear(),_now.getMonth(),_now.getDate()-_dayIdx);_weekStart.setHours(0,0,0,0);
const weekDone=[!1,!1,!1,!1,!1,!1,!1];Object.values(S.quizHistory||{}).forEach(a=>(a||[]).forEach(e=>{if(e&&e.at){const d=Math.floor((new Date(e.at)-_weekStart)/864e5);if(d>=0&&d<7)weekDone[d]=!0;}}));
const weekCount=weekDone.filter(Boolean).length;
return `<div class="min-home ff-home">
<section class="ff-page-head">
<div><div class="caps">${_dateLine}</div><h1>${currentUser?_greet+", "+esc(_first):"Welcome to <span class=\"ff-brand\">FlutterForward.</span>"}</h1><p class="lede">${currentUser?`You&rsquo;re ${doneC} concept${doneC===1?"":"s"} in — ${nextRank?`${toNext} more to ${esc(nextRank.name)}`:"you&rsquo;ve reached the top rank"}.`:"Thoughtfully complete. Beautifully uncomplicated."}</p></div>
</section>
<div class="ff-hero-grid${currentUser?"":" ff-hero-solo"}">
<div class="ff-hero-card">
<div>
<div class="ff-hero-top"><span class="ff-hero-tag">${nx?`● ONGOING · LESSON ${nx.num} OF 40`:`● ALL 40 LESSONS DONE`}</span></div>
<h2 class="ff-hero-title">${nxTitle}</h2>
</div>
<div>
<div class="ff-hero-prog"><span>Overall progress</span><b>${pct}%</b></div>
<div class="ff-bar ff-bar-dark"><i style="width:${pct}%"></i></div>
<div class="ff-hero-actions"><a class="min-btn" href="#/${nxHref}">${nxBtn} →</a></div>
</div>
</div>
${currentUser?`<div class="ff-rank-card">
<div class="ff-ring"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="bento-ring-track" cx="32" cy="32" r="28"/><circle class="bento-ring-arc${freshHome?" ring-anim":""}" cx="32" cy="32" r="28" stroke-dasharray="${CIRC}" style="--ring-off:${off}"/></svg><span class="ff-ring-pct">${pct}%</span></div>
<div class="ff-rank-copy"><div class="caps">Your rank</div><h3>${esc(rankName)}</h3><p class="ff-muted">Level ${rankIdx+1} · ${doneC} of 40 concepts</p>
<div class="ff-next-rank"><div class="ff-next-rank-top"><span>${nextRank?`Next: ${esc(nextRank.name)}`:"Top rank reached"}</span><b>${nextRank?`${doneC} / ${nextNeed}`:`${doneC} / 40`}</b></div></div>
<a class="ff-btn-outline" href="#/progress">View ranks</a></div>
</div>`:""}
</div>
<div class="ff-stats">
<div class="ff-stat"><div class="ff-stat-top"><span class="caps">Lessons</span><span class="ff-stat-ico">📘</span></div><div class="ff-stat-num">${doneN}<span class="ff-faint"> / 40</span></div><div class="ff-bar"><i style="width:${Math.round(doneN/40*100)}%"></i></div><div class="ff-stat-sub">${doneN>=40?"All 40 done":`${40-doneN} to go`}</div></div>
<div class="ff-stat"><div class="ff-stat-top"><span class="caps">Quizzes</span><span class="ff-stat-ico">✏️</span></div><div class="ff-stat-num">${passN}<span class="ff-faint"> / 40</span></div><div class="ff-bar"><i style="width:${Math.round(passN/40*100)}%"></i></div><div class="ff-stat-sub">${best===null?"No attempts yet":`Best score ${best}%`}</div></div>
<div class="ff-stat"><div class="ff-stat-top"><span class="caps">Teardowns</span><span class="ff-stat-ico">🔍</span></div><div class="ff-stat-num">${tdApps}<span class="ff-faint"> apps</span></div><div class="ff-stat-sub">${tdScreens} screens to explore</div></div>
<div class="ff-stat"><div class="ff-stat-top"><span class="caps">Concepts</span><span class="ff-stat-ico">⬢</span></div><div class="ff-stat-num">${doneC}<span class="ff-faint"> / 40</span></div><div class="ff-bar"><i style="width:${Math.round(doneC/40*100)}%"></i></div><div class="ff-stat-sub">${currentUser?(nextRank?`Next rank: ${esc(nextRank.name)} in ${toNext}`:"Top rank — Flutter Master"):"Log in to save progress"}</div></div>
</div>
<div class="ff-explore-head"><h3>Keep exploring</h3><span class="ff-muted">Something for every mood</span></div>
<div class="ff-grid3">
<div class="ff-card">
<div class="caps">Visual Labs</div><h3 class="ff-card-title">Learn UI by taking real apps apart</h3>
<p class="ff-muted">${tdApps} apps · ${tdScreens} screens · every widget tappable, with real Dart code.</p>
<div class="ff-app-strip">${TD_STRIP.map(([g,a,n])=>`<span class="ff-app-ico" title="${n}">${TD_APP_ICONS[n]||g}</span>`).join("")}<span class="ff-app-ico ff-app-more">+${Math.max(0,tdApps-TD_STRIP.length)}</span></div>
<a class="min-btn ff-card-btn" href="#/teardowns">Explore teardowns →</a>
</div>
<div class="ff-card-dark">
<div class="caps">Daily Quiz</div><h3 class="ff-card-title" style="color:#fff">${allQuizzesPassed?"All quizzes passed. Stay sharp.":"10 questions. One concept."}</h3>
<p class="ff-dark-muted">${allQuizzesPassed?"Revisit any quiz to keep your rank sharp.":`Warm up with Quiz ${dqNum} — ${esc(dqTitle)}.`}</p>
<a class="ff-btn-white" href="${allQuizzesPassed?"#/quizzes":"#/quiz/"+dqNum}">${allQuizzesPassed?"Review quizzes →":"Start →"}</a>
</div>
<div class="ff-card">
<div class="caps">This week</div><h3 class="ff-card-title">${weekCount>0?`${weekCount}-day week, alive`:"Your week starts here"}</h3>
<p class="ff-muted">${currentUser?(weekCount>0?`${weekCount} of 7 days active — one more today keeps it going.`:"No activity yet this week — take a quiz to start it."):"Log in to track your week."}</p>
<div class="ff-week-dots">${["M","T","W","T","F","S","S"].map((d,i)=>`<div class="ff-day"><div class="ff-day-dot${weekDone[i]?" done":""}${i===_dayIdx?" today":""}">${weekDone[i]?"✓":"•"}</div><div class="ff-day-lbl">${d}</div></div>`).join("")}</div>
<div class="ff-bar"><i style="width:${Math.round(weekCount/7*100)}%"></i></div>
<p class="ff-stat-sub">${weekCount} of 7 days</p>
</div>
</div>
</div>`;};
/* Perf: lesson meta ships with app.js so lists render instantly; full lesson HTML across 40 files loads on demand when a lesson opens, keeping it off the startup path. If a lesson title/description changes in its data file, update LESSON_META too. */
const FF_V='1794316711',
LESSON_META=[
{"id":"lesson-01-setup","num":1,"quizId":"quiz-01-setup","title":"Setup & Your First App","description":"Install Flutter, create your first project, and run it on your own phone — main(), runApp(), MaterialApp, Scaffold, and hot reload."},
{"id":"lesson-02-dart-basics","num":2,"quizId":"quiz-02-dart-basics","title":"Dart Basics","description":"The Dart you need for Flutter: variables, functions, conditions, loops, lists, maps, and strings."},
{"id":"lesson-03-dart-oop","num":3,"quizId":"quiz-03-dart-oop","title":"Dart OOP + Null Safety","description":"Model real things as Dart objects with classes, constructors, and inheritance — and write null-safe code that avoids crashes."},
{"id":"lesson-04-widgets","num":4,"quizId":"quiz-04-widgets","title":"Everything Is a Widget","description":"The core mental model: every screen is a tree of widgets. Build StatelessWidgets and compose small widgets into big screens."},
{"id":"lesson-05-layout","num":5,"quizId":"quiz-05-layout","title":"Layout: Row, Column & Container","description":"Arrange UI with Row, Column, and Container — axes, alignment, padding, overflow fixes, Expanded, and Flexible."},
{"id":"lesson-06-stack-scroll-responsive","num":6,"quizId":"quiz-06-stack-scroll-responsive","title":"Stack, Scroll & Responsive UI","description":"Layer widgets with Stack, scroll with SingleChildScrollView and Slivers, and make layouts fit phones and tablets."},
{"id":"lesson-07-app-structure","num":7,"quizId":"quiz-07-app-structure","title":"App Structure: Bars, Tabs & Drawers","description":"Build a complete app shell: AppBar, Drawer, bottom navigation, tabs, and floating action buttons."},
{"id":"lesson-08-navigation","num":8,"quizId":"quiz-08-navigation","title":"Navigation & Routes","description":"Move between screens with Navigator, pass data along, use named routes and go_router, and understand deep links."},
{"id":"lesson-09-theming","num":9,"quizId":"quiz-09-theming","title":"Theming Your App","description":"One theme, changed in one place: ThemeData, colors, fonts, light and dark modes, assets, and icons."},
{"id":"lesson-10-figma","num":10,"quizId":"quiz-10-figma","title":"Design to Code: Figma Basics","description":"Read a Figma file, pull out spacing, color, and type, and turn a design into Flutter widgets without guessing."},
{"id":"lesson-11-lists-grids","num":11,"quizId":"quiz-11-lists-grids","title":"Lists & Grids","description":"Show any amount of data with ListView, ListView.builder, GridView, separators, and pull to refresh."},
{"id":"lesson-12-forms","num":12,"quizId":"quiz-12-forms","title":"Forms & User Input","description":"Build login and signup screens that validate input, manage focus and keyboards, and show clear errors."},
{"id":"lesson-13-state","num":13,"quizId":"quiz-13-state","title":"State & Interactivity","description":"Make UI respond to taps with StatefulWidget and setState — and avoid the classic setState mistakes."},
{"id":"lesson-14-state-at-scale","num":14,"quizId":"quiz-14-state-at-scale","title":"Managing State at Scale","description":"Share state across widgets by lifting it up, see where prop drilling breaks, and pick state with a decision diagram."},
{"id":"lesson-15-provider","num":15,"quizId":"quiz-15-provider","title":"Provider Essentials","description":"Shared state the simple way: ChangeNotifier, Provider, Consumer, and MultiProvider, with the notifyListeners flow."},
{"id":"lesson-16-riverpod","num":16,"quizId":"quiz-16-riverpod","title":"Riverpod","description":"Provider’s modern successor: safer, more testable providers that don’t depend on context, including async providers."},
{"id":"lesson-17-bloc","num":17,"quizId":"quiz-17-bloc","title":"BLoC / Cubit","description":"Separate business logic from UI with events and states — Cubit first, then full Bloc, for big apps and teams."},
{"id":"lesson-18-getx","num":18,"quizId":"quiz-18-getx","title":"GetX","description":"State, navigation, and dependency injection in one package — plus an honest look at when GetX helps and when it doesn’t."},
{"id":"lesson-19-async","num":19,"quizId":"quiz-19-async","title":"Async in Dart","description":"Wait for slow work without freezing the app: Futures, async/await, error handling, and the async flow."},
{"id":"lesson-20-json","num":20,"quizId":"quiz-20-json","title":"Working with JSON Data","description":"Turn raw JSON text into typed Dart models with fromJson/toJson, and show it safely with FutureBuilder."},
{"id":"lesson-21-apis","num":21,"quizId":"quiz-21-apis","title":"Fetching from APIs","description":"Get real data from the internet with http: GET and POST, loading and error states, Dio interceptors, and safe API keys."},
{"id":"lesson-22-streams","num":22,"quizId":"quiz-22-streams","title":"Streams & Real-time Data","description":"Listen to data that keeps changing: Streams, StreamBuilder, broadcast streams, and real-time UI."},
{"id":"lesson-23-local-save","num":23,"quizId":"quiz-23-local-save","title":"Saving Data Locally","description":"Make small data survive restarts with SharedPreferences — settings screens, save/read flow, and fallbacks."},
{"id":"lesson-24-local-database","num":24,"quizId":"quiz-24-local-database","title":"Local Database","description":"When key-value storage isn’t enough: sqflite tables and CRUD, Hive as an alternative, and offline-first thinking."},
{"id":"lesson-25-firebase","num":25,"quizId":"quiz-25-firebase","title":"Firebase Integration","description":"Real login and a real cloud database without your own server: Firebase setup, Auth, Firestore CRUD, and security rules."},
{"id":"lesson-26-storage-push","num":26,"quizId":"quiz-26-storage-push","title":"Firebase Storage & Push Notifications","description":"Store photos in the cloud with Storage rules, and reach users with FCM push notifications and tokens."},
{"id":"lesson-27-backend-choices","num":27,"quizId":"quiz-27-backend-choices","title":"Backend Choices: Supabase & REST","description":"Pick the right backend for your app: Firebase vs Supabase vs your own REST server, with a decision diagram."},
{"id":"lesson-28-animations","num":28,"quizId":"quiz-28-animations","title":"Animations","description":"Make UI feel alive without overdoing it: implicit animations, AnimatedContainer, and Hero transitions."},
{"id":"lesson-29-explicit-animations","num":29,"quizId":"quiz-29-explicit-animations","title":"Explicit Animations","description":"Full control over motion: AnimationController, Tweens, Curves, staggered animations — and why dispose matters."},
{"id":"lesson-30-custom-ui","num":30,"quizId":"quiz-30-custom-ui","title":"Custom UI: Painters & Clippers","description":"Draw or cut the last 5% of UI yourself with CustomPainter and ClipPath — and know when not to."},
{"id":"lesson-31-performance","num":31,"quizId":"quiz-31-performance","title":"Performance","description":"Measure first, then fix: DevTools profiling, rebuild causes, const, list performance, isolates, and a 60fps checklist."},
{"id":"lesson-32-testing","num":32,"quizId":"quiz-32-testing","title":"Testing","description":"Write promises the computer checks forever: unit tests, widget tests, integration tests, and testable code."},
{"id":"lesson-33-device-features","num":33,"quizId":"quiz-33-device-features","title":"Device Features","description":"Bridge Flutter UI to phone hardware: camera, location and permissions, platform channels, and picking packages on pub.dev."},
{"id":"lesson-34-production-essentials","num":34,"quizId":"quiz-34-production-essentials","title":"Production Essentials","description":"Shipping is more than a build: security basics, analytics, accessibility, multiple languages, icon, and splash."},
{"id":"lesson-35-beyond-mobile","num":35,"quizId":"quiz-35-beyond-mobile","title":"Beyond Mobile: Web & Desktop","description":"One codebase, more screens: web and desktop builds, responsive to adaptive, and platform differences."},
{"id":"lesson-36-architecture","num":36,"quizId":"quiz-36-architecture","title":"App Architecture","description":"Structure apps that survive growth: Clean Architecture layers, MVVM, Repository pattern, GetIt, and folder structure."},
{"id":"lesson-37-ship-it","num":37,"quizId":"quiz-37-ship-it","title":"Ship It","description":"From your laptop to the stores: debug like a pro, release builds, APK vs AAB, store listings, and versioning."},
{"id":"lesson-38-release-engineering","num":38,"quizId":"quiz-38-release-engineering","title":"Release Engineering","description":"Automate the boring parts: flavors, signing, Fastlane, CI/CD with GitHub Actions or Codemagic, and a release checklist."},
{"id":"lesson-39-monetization","num":39,"quizId":"quiz-39-monetization","title":"Monetization","description":"Earn without annoying users: ads, in-app purchases, subscriptions, pricing, and store policy traps."},
{"id":"lesson-40-job-ready","num":40,"quizId":"quiz-40-job-ready","title":"Job-Ready: Portfolio & Interviews","description":"Turn what you built into proof that gets you hired: portfolio polish, GitHub, resume, and interview prep."}
],
_lessonPending={},_lessonFailed={},
lessonFull=n=>(DATA.lessons||[]).find(l=>l.num===n&&(l.markdown||l.html_en)),
ensureLesson=n=>{if(lessonFull(n))return;if(_lessonPending[n])return;_lessonPending[n]=1;const s=document.createElement('script');s.src='data-lesson-'+n+'.js?v='+FF_V;s.onload=()=>{delete _lessonPending[n];if((location.hash||'')==='#/lesson/'+n)route();};s.onerror=()=>{delete _lessonPending[n];_lessonFailed[n]=1;if((location.hash||'')==='#/lesson/'+n)route();};document.head.appendChild(s);},
LOCK_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
lessonRow=e=>{const n=!!S.lessonsDone[e.id],c=e.num===(LESSON_META.find(l=>!S.lessonsDone[l.id])||{}).num,l=!currentUser&&e.num>FREE_LESSONS,q=DATA.quizzes.find(x=>x.id===e.quizId),qp=!!(q&&S.quizzesPassed[q.id]);return`<a class="lesson-row p-stop${n?" done":""}${c?" current":""}${l?" locked":""}" href="#/lesson/${e.num}"${c?' aria-current="true"':''}>
<span class="lesson-num p-node">${n?"✓":l?LOCK_ICON:e.num}</span>
<span class="p-body"><span class="t"><span class="p-title">${esc(e.title)}</span><span class="row-desc-full" hidden aria-hidden="true">${esc(e.description)}</span></span><span class="p-tags"><span class="status-pill${n?" pass":l?" locked":c?" current":""}">${l?LOCK_ICON:""}${n?"Done":l?"Locked":c?"Current":"Not started"}</span>${c?'<span class="yah">You are here</span>':""}${qp?'<span class="p-meta">✓ Quiz passed</span>':""}</span></span></a>`};
const PHASES=[{name:"Dart Fundamentals & Setup",from:1,to:3},{name:"Core UI Development",from:4,to:12},{name:"State Management",from:13,to:18},{name:"Data & Networking",from:19,to:24},{name:"Backend & Cloud Services",from:25,to:27},{name:"Advanced UI & Production Essentials",from:28,to:35},{name:"Launch & Career Readiness",from:36,to:40}];
function phaseNameFor(n){const p=PHASES.find(p=>n>=p.from&&n<=p.to);return p?p.name:"";}
function hideEmptyPhaseSections(rc){$$(".phase-section").forEach(sec=>{const vis=Array.from(sec.querySelectorAll(rc)).some(r=>r.style.display!=="none");sec.style.display=vis?"":"none";});}
function showAllPhaseSections(){$$(".phase-section").forEach(sec=>{sec.style.display="";});}
function phaseLessonSections(){return PHASES.map((p,pi)=>{const rows=LESSON_META.filter(e=>e.num>=p.from&&e.num<=p.to);if(!rows.length)return"";const dn=rows.filter(e=>!!S.lessonsDone[e.id]).length;return `<section class="phase-section" data-phase-idx="${pi}" data-phase-kind="lessons"><div class="p-phase"><span class="node">P${pi+1}</span><span class="p-phase-text"><span class="ph-t">${esc(p.name)}</span><span class="ph-s">PHASE ${pi+1} · LESSONS ${p.from}–${p.to} · <b>${dn}/${rows.length} done</b></span></span></div>${rows.map(lessonRow).join("")}</section>`;}).join("");}
function quizRowHtml(e,t){const n=!!S.quizzesPassed[e.id],s=LESSON_META.find(t=>t.id===e.lessonId),l=!currentUser&&(t+1)>FREE_LESSONS,c=!n&&!l&&t===DATA.quizzes.findIndex(q=>!S.quizzesPassed[q.id]);const qs=quizQuestions(e),h=(S.quizHistory||{})[e.id]||[],best=h.length?h.reduce((a,b)=>b.pct>a.pct?b:a,h[0]):null,meta=best?(typeof best.score==="number"?`Best ${best.pct}% · ${best.score}/${best.total||qs.length} · ${h.length} attempt${h.length===1?"":"s"}`:`Best ${best.pct}% · ${h.length} attempt${h.length===1?"":"s"}`):"",desc=s?s.description:"";return `<a class="quiz-row p-stop${n?" done":""}${c?" current":""}${l?" locked":""}" href="#/quiz/${t+1}"${c?' aria-current="true"':''}>
<span class="quiz-node p-node">${n?"✓":l?LOCK_ICON:t+1}</span>
<span class="p-body"><span class="t"><span class="p-title">Quiz ${t+1} — ${esc(e.title.replace(/^Quiz:\s*/,""))}</span><span class="row-desc-full" hidden aria-hidden="true">${esc(desc)}</span></span><span class="p-tags"><span class="status-pill${n?" pass":l?" locked":c?" current":""}">${l?LOCK_ICON:""}${n?"Passed":l?"Locked":c?"Current":"Not started"}</span>${c?'<span class="yah">You are here</span>':""}${meta?`<span class="p-meta">${meta}</span>`:""}</span></span></a>`;}
function phaseQuizSections(){return PHASES.map((p,pi)=>{const rows=DATA.quizzes.map((e,t)=>({e,t})).filter(o=>{const s=LESSON_META.find(x=>x.id===o.e.lessonId);return s&&s.num>=p.from&&s.num<=p.to;});if(!rows.length)return"";const dn=rows.filter(o=>!!S.quizzesPassed[o.e.id]).length;return `<section class="phase-section" data-phase-idx="${pi}" data-phase-kind="quizzes"><div class="p-phase"><span class="node">P${pi+1}</span><span class="p-phase-text"><span class="ph-t">${esc(p.name)}</span><span class="ph-s">PHASE ${pi+1} · LESSONS ${p.from}–${p.to} · <b>${dn}/${rows.length} passed</b></span></span></div>${rows.map(o=>quizRowHtml(o.e,o.t)).join("")}</section>`;}).join("");}
function pathHeadHtml(kind){const q=kind==="quizzes";let done=0,cur=0;if(q){done=DATA.quizzes.filter(e=>!!S.quizzesPassed[e.id]).length;const u=DATA.quizzes.find(e=>!S.quizzesPassed[e.id]);cur=u?DATA.quizzes.indexOf(u)+1:0;}else{done=LESSON_META.filter(e=>!!S.lessonsDone[e.id]).length;const f=LESSON_META.find(e=>!S.lessonsDone[e.id]);cur=f?f.num:0;}const pct=Math.round(done/40*100);let ms=null;for(let pi=0;pi<PHASES.length;pi++){const p=PHASES[pi];const rows=q?DATA.quizzes.filter(e=>{const m=LESSON_META.find(x=>x.id===e.lessonId);return m&&m.num>=p.from&&m.num<=p.to;}):LESSON_META.filter(e=>e.num>=p.from&&e.num<=p.to);const dn=q?rows.filter(e=>!!S.quizzesPassed[e.id]).length:rows.filter(e=>!!S.lessonsDone[e.id]).length;if(dn<rows.length){ms={pi:pi,p:p};break;}}const msTxt=ms?("Next milestone: Phase "+(ms.pi+1)+" · "+esc(ms.p.name)):"Course complete — all 40 done";const curTxt=cur?(q?("Current quiz: "+cur):("Current lesson: "+cur)):(q?"All 40 quizzes passed":"All 40 lessons done");return `<div class="path-head"><div><div class="caps">Your journey so far</div><div class="path-pct">${done}<small> / 40 ${q?"quizzes passed":"lessons done"}</small></div></div><div class="path-head-meta">${msTxt}<br>${curTxt}</div></div><div class="path-bar"><i style="width:${pct}%"></i></div>`;}
/* 2026-11-10 (desc removal): lesson/quiz descriptions are NO LONGER rendered
   in the two lists — rows are node + title + status/meta tags only (user:
   "remove these type of lines"). The description text is NOT deleted from
   the data (LESSON_META / data-lesson-*.js still carry it for the lesson
   cover page). The hidden .row-desc-full span inside .t is KEPT so navbar
   search (navSearchFilterRows matches .t textContent, which includes hidden
   nodes) still finds description words. trimListDescs (whole-word clamp
   trim) is deleted with the visible desc: it had no other callers, and the
   spine re-run it did at the end of run() now lives at its call sites as a
   direct layoutPathSpine(). The ResizeObserver inside layoutPathSpine
   covers the resize/webfont re-measure the old scroll/resize listeners did. */
let __pathRO=null,__pathROEl=null;
function layoutPathSpine(){try{const path=document.querySelector(".learning-list .path");if(!path)return;if(typeof ResizeObserver==="function"){if(!__pathRO)__pathRO=new ResizeObserver(()=>{try{layoutPathSpine();}catch(e){}});if(__pathROEl!==path){if(__pathROEl)__pathRO.unobserve(__pathROEl);__pathRO.observe(path);__pathROEl=path;}}const fill=path.querySelector(".path-spine-fill");if(!fill)return;const stops=Array.from(path.querySelectorAll(".p-stop")).filter(r=>r.style.display!=="none"&&r.offsetParent!==null);let target=null;const cur=stops.find(r=>r.classList.contains("current"));if(cur)target=cur;else for(let i=stops.length-1;i>=0;i--){if(stops[i].classList.contains("done")){target=stops[i];break;}}if(!target){fill.style.height="0px";return;}const node=target.querySelector(".p-node");if(!node){fill.style.height="0px";return;}let centre=null;{let top=0,el=node,ok=false;while(el){if(el===path){ok=true;break;}top+=el.offsetTop;el=el.offsetParent;}if(ok)centre=top+node.offsetHeight/2;}if(centre===null){const pr=path.getBoundingClientRect(),nr=node.getBoundingClientRect();centre=nr.top-pr.top+nr.height/2;}fill.style.height=Math.max(0,centre)+"px";}catch(e){}}
function phaseDefaultIdx(kind){if(kind==="quizzes"){const u=DATA.quizzes.find(e=>!S.quizzesPassed[e.id]);if(!u)return 0;const m=LESSON_META.find(x=>x.id===u.lessonId);if(!m)return 0;const i=PHASES.findIndex(p=>m.num>=p.from&&m.num<=p.to);return i>=0?i:0;}const f=LESSON_META.find(e=>!S.lessonsDone[e.id]);if(!f)return 0;const i=PHASES.findIndex(p=>f.num>=p.from&&f.num<=p.to);return i>=0?i:0;}
function phaseOpenState(kind,pi,d){const t=S.phaseToggled||(S.phaseToggled={});const k=kind+":"+pi;return k in t?!!t[k]:pi===d;}
function setPhaseExpanded(sec,open){const b=sec.querySelector("[data-phase-toggle]"),body=sec.querySelector(".phase-body");if(b)b.setAttribute("aria-expanded",open?"true":"false");if(body)body.style.display=open?"":"none";}
function restorePhaseDefaults(){const secs=document.querySelectorAll(".phase-section");if(!secs.length)return;const kind=secs[0].dataset.phaseKind||(document.querySelector(".lesson-row")?"lessons":"quizzes");const d=phaseDefaultIdx(kind);if(S.phaseToggled){Object.keys(S.phaseToggled).forEach(k=>{if(k.indexOf(kind+":")===0)delete S.phaseToggled[k];});}secs.forEach(sec=>{setPhaseExpanded(sec,parseInt(sec.dataset.phaseIdx,10)===d);});}
function expandVisiblePhaseSections(){document.querySelectorAll(".phase-section").forEach(sec=>{if(sec.style.display==="none")return;const vis=Array.from(sec.querySelectorAll(".lesson-row,.quiz-row")).some(r=>r.style.display!=="none");if(vis)setPhaseExpanded(sec,true);});}
function afterPhaseSearch(rowSel,q){if(rowSel.indexOf("lesson-row")<0&&rowSel.indexOf("quiz-row")<0)return;hideEmptyPhaseSections(rowSel);const qq=(q||"").trim();if(qq){window.__phaseSearchActive=true;expandVisiblePhaseSections();}else{showAllPhaseSections();if(window.__phaseSearchActive){window.__phaseSearchActive=false;restorePhaseDefaults();}}layoutPathSpine();}
if(!window.__ffPhaseToggle){window.__ffPhaseToggle=1;document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-phase-toggle]");if(!b)return;const sec=b.closest(".phase-section");if(!sec)return;const open=b.getAttribute("aria-expanded")!=="true";setPhaseExpanded(sec,open);layoutPathSpine();const t=S.phaseToggled||(S.phaseToggled={});if(sec.dataset.phaseKind)t[sec.dataset.phaseKind+":"+sec.dataset.phaseIdx]=open;});}if(!window.__ffPhaseExpandAll){window.__ffPhaseExpandAll=1;document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-phase-expand-all]");if(!b)return;const secs=$$(".phase-section");if(!secs.length)return;const allOpen=secs.every(s=>{const t=s.querySelector("[data-phase-toggle]");return t&&t.getAttribute("aria-expanded")==="true";});if(allOpen){if(typeof restorePhaseDefaults==="function")restorePhaseDefaults();}else{secs.forEach(s=>{setPhaseExpanded(s,true);const t=S.phaseToggled||(S.phaseToggled={});if(s.dataset.phaseKind)t[s.dataset.phaseKind+":"+s.dataset.phaseIdx]=true;});}b.textContent=allOpen?"Expand all":"Collapse all";layoutPathSpine();});}
views.lessons=()=>`<div class="page-head lessons-head"><div class="lessons-head-copy"><h1>Lessons</h1></div></div>`+`<div class="learning-list lessons-list">${pathHeadHtml("lessons")}<div class="path"><div class="path-spine"></div><div class="path-spine-fill"></div>${phaseLessonSections()}</div></div><p id="lesson-search-empty" class="lessons-empty" style="display:none">No lessons match your search.</p>`,views.lesson=e=>{if(!currentUser&&e>FREE_LESSONS){setTimeout(()=>{if((location.hash||"")==="#/lesson/"+e&&!currentUser)showGatePrompt("lesson",e)},60);return views.lessons();}S.lastLesson=e;const m=LESSON_META.find(l=>l.num===e);if(!m)return views.lessons();const t=lessonFull(e);if(!t){ensureLesson(e);if(_lessonFailed[e])return`<a class="back-link" href="#/lessons">← All lessons</a>\n  <div class="article">\n    <div class="lesson-kicker">${phaseNameFor(m.num)} · Lesson ${m.num}</div>\n    <h1 style="font-size:clamp(26px,5vw,36px);letter-spacing:-.03em;line-height:1.15;margin-bottom:6px">${esc(m.title)}</h1>\n    <p style="color:var(--text-2);margin-bottom:6px">This lesson couldn't be loaded. Check your connection and try again.</p>\n    <div class="lesson-actions">\n      <button class="btn btn-accent" id="lesson-retry">Try again</button>\n    </div>\n  </div>`;return`<a class="back-link" href="#/lessons">← All lessons</a>\n  <div class="article">\n    <p style="color:var(--text-3)">Loading lesson…</p>\n  </div>`;}const n=!!S.lessonsDone[t.id],s=DATA.quizzes.find(e=>e.id===(t.quizId||m.quizId)),a=s?!!S.quizzesPassed[s.id]:!1,qc=s?(s.questions_en?s.questions_en.length:(s.questions?s.questions.length:10)):10,lang=getLang(),body=(t.html_en||t.html_hi)?((lang==="hi"&&t.html_hi)?t.html_hi:(t.html_en||t.html_hi)):mdToHtml(t.markdown.replace(/^# .+\n/,"")),i=LESSON_META.find(l=>l.num===e-1),r=LESSON_META.find(l=>l.num===e+1);if(!(t.html_en||t.html_hi))return`<a class="back-link" href="#/lessons">← All lessons</a>
  <div class="article">
    <div class="lesson-kicker">${phaseNameFor(t.num)} · Lesson ${t.num}</div>
    <h1 style="font-size:clamp(26px,5vw,36px);letter-spacing:-.03em;line-height:1.15;margin-bottom:6px">${esc(t.title)}</h1>
    <p style="color:var(--text-2);margin-bottom:6px">${esc(t.description)}</p>
    ${(t.html_en||t.html_hi)?'<div class="lesson-lang" data-lang="${lang}" role="group" aria-label="Lesson language"><button type="button" class="lesson-lang-btn'+(lang==="en"?" on":"")+'" onclick="if(window.setLang){setLang(\'en\');route()}">English</button><button type="button" class="lesson-lang-btn'+(lang==="hi"?" on":"")+'" onclick="if(window.setLang){setLang(\'hi\');route()}">Hinglish</button></div>':""}
    <div class="lesson-body">
    ${body}
    </div>
    <div class="lesson-actions">
      ${t.pdf?'<a class="btn btn-soft" href="'+escAttr(t.pdf)+'" download>Download PDF</a>':''}
      ${n?'<button class="btn btn-accent" disabled>Completed</button>':'<button class="btn btn-accent" id="complete-lesson">Mark complete</button>'}
    </div>
    <div style="margin-top:18px">
      <a class="lesson-row${a?" done":""}" href="#/quiz/${e}">
        <span class="quiz-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8M9 2v3m6-3v3"/><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/></svg></span>
        <span class="t"><b>${esc(s?s.title:("Quiz: "+t.title))}</b><span>${qc} questions · pass at ${QUIZ_PASS}%</span></span>
        <span class="chev">›</span></a>
    </div>
  </div>
  <div class="pager">
    ${i?`<a href="#/lesson/${i.num}"><span class="pager-label">← Previous</span><strong class="pager-title">${esc(i.title)}</strong></a>`:"<a></a>"}
    ${r?`<a class="next"href="#/lesson/${r.num}"><span class="pager-label">Next →</span><strong class="pager-title">${esc(r.title)}</strong></a>`:"<a></a>"}
  </div>
  <script>void 0<\/script>`;window.__bookActive=1;return`<div class="book-top">
  <a class="back-link" href="#/lessons" aria-label="All lessons">← All lessons</a>
  <div class="book-title-row"><h1>${esc(t.title)}</h1>
    <div class="lesson-lang" id="bookLangToggle" data-lang="${lang}" role="group" aria-label="Lesson language"><button type="button" class="lesson-lang-btn${lang==="en"?" on":""}" data-lang="en" onclick="if(window.bookLang){bookLang('en')}">English</button><button type="button" class="lesson-lang-btn${lang==="hi"?" on":""}" data-lang="hi" onclick="if(window.bookLang){bookLang('hi')}">Hinglish</button></div>
  </div>
</div>
<div class="book-area" id="bookArea">
  <div class="book-frame" id="bookFrame">
    <div class="book-sheet-wrap" id="bookSheetWrap">
      <div class="book-sheet" id="bookSheet"><div class="book-sheet-inner" id="bookSheetInner"></div></div>
    </div>
  </div>
</div>
<div class="book-footer"><button class="book-foot-btn" id="bookFootPrev" type="button" aria-label="Previous page">‹</button><div class="book-foot-center"><div class="book-dots" id="bookDots"></div><span class="book-page-label" id="bookPageLabel"></span></div><button class="book-foot-btn" id="bookFootNext" type="button" aria-label="Next page">›</button></div>`},views.playground=()=>pageHead(null,"Playground","Write and run real Flutter code. No setup needed.")+'<div class="playground-shell">\n    <div class="playground-bar"><span class="playground-dot"></span><b>main.dart</b><a class="btn" href="https://dartpad.dev" target="_blank" rel="noopener">Run</a></div>\n    <div class="dartpad-shell"><iframe title="DartPad playground" src="https://dartpad.dev/embed-flutter.html" allow="clipboard-write"></iframe></div>\n   </div>\n   <div class="dartpad-fallback">Tip: edit the example, then run it to preview your changes.</div>';const QUIZ_ICONS=['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 3.5 3 7.5 0 11-3-3.5-3-7.5 0-11Z"/><circle cx="12" cy="7.5" r="1.5"/><path d="M9 11.5 6.5 15M15 11.5l2.5 3.5M10 15h4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-5 6 5 6M16 6l5 6-5 6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="14" y="15" width="7" height="5" rx="1"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="13" height="13" rx="2"/><rect x="8" y="8" width="13" height="13" rx="2"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M7 6h10M7 18h10"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M7.5 19H15a4 4 0 0 0 0-8H10"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="15.5" cy="10" r="1.2"/><path d="M12 21c-2-2-2-4 0-6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20 12 4l6 16-6-4-6 4Z"/><circle cx="12" cy="12" r="1.5"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h7M7 13h4M17 12v4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="16" cy="12" r="3"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10 7 7 17M14 7l3 10M7.5 19h9"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v4M15 2v4"/><path d="M7 6h10v4a5 5 0 0 1-10 0V6Z"/><path d="M12 15v6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="5" height="6" rx="1"/><rect x="9.5" y="9" width="5" height="6" rx="1"/><rect x="17" y="9" width="5" height="6" rx="1"/><path d="M7 12h2.5M14.5 12H17"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4c-2 1-2 3-2 4 0 2 1 2 2 4-1 2-2 2-2 4 0 1 0 3 2 4M17 4c2 1 2 3 2 4 0 2-1 2-2 4 1 2 2 2 2 4 0 1 0 3-2 4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2M2 16c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="3" width="8" height="6"/><path d="M7 21v-6h10v6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-4 3-6 4-8 .3 1.5 1 2.5 2 3-.5-3.5 0-5 0-7Z"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16 9.5 3.75 3.75 0 0 1 16.5 17H6Z"/><path d="M12 13v5M9 15l3-3 3 3"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><circle cx="7" cy="7.5" r="1"/><circle cx="7" cy="16.5" r="1"/><path d="M12 7.5h6M12 16.5h6"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><circle cx="7" cy="12" r="2"/><path d="M11 9l4 3-4 3Z"/><circle cx="19" cy="12" r="2"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c4-1 6-3 7-6l6-6-3-3-6 6c-3 1-5 3-4 9Z"/><path d="M14 8l3 3"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.5"/><path d="M2 14h3M19 14h3"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 7l1.5-3h5L16 7"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16M6 21V10M12 21V10M18 21V10M3 7l9-4 9 4H3Z"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v9"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M16 8.5c-.8-1.3-5.2-1.3-5.2.7 0 1.8 6.4 1.2 6.4 3.3 0 2-5.6 2-6.4.5"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>'];views.quizzes=()=>`<div class="page-head quizzes-head"><div class="quizzes-head-copy"><h1>Quizzes</h1></div></div>`+`<div class="learning-list quizzes-list">${pathHeadHtml("quizzes")}<div class="path"><div class="path-spine"></div><div class="path-spine-fill"></div>${phaseQuizSections()}</div></div><p id="quiz-search-empty" class="lessons-empty" style="display:none">No quizzes match your search.</p>`;function quizLang(){try{if(typeof getLang==="function"){var _l=getLang();if(_l==="hi"||_l==="hinglish"||_l==="hindi")return "hi";if(_l==="en"||_l==="english")return "en";}}catch(_e){}if(typeof window!=="undefined"&&window.__ffQuizLang)return window.__ffQuizLang;return "en";}
function quizQuestions(_q){if(!_q)return[];var _a=quizLang()==="hi"&&_q.questions_hi?_q.questions_hi:_q.questions_en;if(Array.isArray(_a)&&_a.length)return _a;if(Array.isArray(_q.questions))return _q.questions;return[];}
const QUIZ_TOPICS={},quizTopic=(e,t)=>QUIZ_TOPICS[e]&&QUIZ_TOPICS[e][t]||`Question ${t+1}`;async function quizPdfBuild(quiz, attempt) {
  var quizQs = quizQuestions(quiz);
  // ---------- helpers ----------
  var W = 595.28, H = 841.89, M = 50, CW = W - 2 * M; // A4, margins, content width
  var DARK = false;
  try { DARK = document.documentElement.dataset.theme === 'dark'; } catch (e) {}
  var PAGEBG, INK, GRAY, FAINT, BLUE, GREEN, GREENBG, RED, REDBG, LINE, CHIPBG, BOXFILL;
  if (DARK) {
    PAGEBG = [0.106, 0.094, 0.082]; INK = [0.949, 0.937, 0.914]; GRAY = [0.66, 0.64, 0.61]; FAINT = [0.48, 0.46, 0.43];
    BLUE = [0.51, 0.62, 0.98]; GREEN = [0.42, 0.76, 0.60]; GREENBG = [0.11, 0.19, 0.155];
    RED = [0.93, 0.58, 0.53]; REDBG = [0.22, 0.14, 0.13]; LINE = [0.24, 0.225, 0.205]; CHIPBG = [0.15, 0.14, 0.125]; BOXFILL = [0.13, 0.12, 0.105];
  } else {
    PAGEBG = null; INK = [0.09, 0.09, 0.09]; GRAY = [0.35, 0.33, 0.32]; FAINT = [0.55, 0.53, 0.51];
    BLUE = [0.118, 0.251, 0.686]; GREEN = [0.204, 0.455, 0.369]; GREENBG = [0.906, 0.941, 0.922];
    RED = [0.631, 0.239, 0.239]; REDBG = [0.961, 0.914, 0.906]; LINE = [0.91, 0.90, 0.89]; CHIPBG = [0.937, 0.929, 0.914]; BOXFILL = null;
  }
  var _mc = document.createElement('canvas').getContext('2d');
  var FONTMAP = { F1: 'Helvetica', F2: 'Helvetica-Bold', F3: 'Times-Roman', F4: 'Times-Bold', F5: 'Times-Italic' };
  var CSSMAP = { F1: 'Helvetica, Arial, sans-serif', F2: 'bold Helvetica, Arial, sans-serif', F3: '"Times New Roman", Times, serif', F4: 'bold "Times New Roman", Times, serif', F5: 'italic "Times New Roman", Times, serif' };
  function tw(str, font, size) {
    _mc.font = (font === 'F2' || font === 'F4' ? '' : '') + size + 'px ' + CSSMAP[font];
    if (font === 'F2') _mc.font = 'bold ' + size + 'px Helvetica, Arial, sans-serif';
    if (font === 'F4') _mc.font = 'bold ' + size + 'px "Times New Roman", Times, serif';
    if (font === 'F5') _mc.font = 'italic ' + size + 'px "Times New Roman", Times, serif';
    if (font === 'F1') _mc.font = size + 'px Helvetica, Arial, sans-serif';
    if (font === 'F3') _mc.font = size + 'px "Times New Roman", Times, serif';
    return _mc.measureText(str).width * 1.01; // 1% safety
  }
  function clean(s) {
    return String(s == null ? '' : s)
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...')
      .replace(/\u2713|\u2714/g, '').replace(/\u2717|\u2718/g, '')
      .replace(/\u2192/g, '->').replace(/[^\x20-\x7E\u2022]/g, '');
  }
  function esc(s) {
    return clean(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\u2022/g, '\\225');
  }
  function wrap(str, font, size, maxW) {
    var words = clean(str).split(/\s+/).filter(Boolean), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + ' ' + words[i] : words[i];
      if (tw(t, font, size) <= maxW || !cur) cur = t;
      else { lines.push(cur); cur = words[i]; }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }

  // ---------- page builder ----------
  var pages = [];
  var cur = null, y = 0;
  function newPage() {
    cur = []; pages.push(cur); y = H - M;
    if (PAGEBG) cur.push(PAGEBG[0].toFixed(3) + ' ' + PAGEBG[1].toFixed(3) + ' ' + PAGEBG[2].toFixed(3) + ' rg 0 0 ' + W + ' ' + H + ' re f');
  }
  function ops() { return cur; }
  function col(c) { return c[0].toFixed(3) + ' ' + c[1].toFixed(3) + ' ' + c[2].toFixed(3); }
  function text(str, x, yy, font, size, color, align) {
    var s = esc(str);
    var xx = x;
    if (align === 'r') xx = x - tw(clean(str), font, size);
    if (align === 'c') xx = x - tw(clean(str), font, size) / 2;
    cur.push('BT /' + font + ' ' + size + ' Tf ' + col(color) + ' rg 1 0 0 1 ' + xx.toFixed(1) + ' ' + yy.toFixed(1) + ' Tm (' + s + ') Tj ET');
  }
  function hline(yy, color, width) {
    cur.push(col(color || LINE) + ' RG ' + (width || 0.7) + ' w ' + M + ' ' + yy.toFixed(1) + ' m ' + (W - M) + ' ' + yy.toFixed(1) + ' l S');
  }
  function rrect(x, yy, w, h, r, fill, stroke) {
    var p = [];
    p.push('q');
    if (fill) p.push(col(fill) + ' rg');
    if (stroke) p.push(col(stroke) + ' RG 0.7 w');
    var k = 0.5523 * r;
    var s = (x + r) + ' ' + yy + ' m ';
    s += (x + w - r) + ' ' + yy + ' l ' + (x + w - r + k) + ' ' + yy + ' ' + (x + w) + ' ' + (yy + r - k) + ' ' + (x + w) + ' ' + (yy + r) + ' c ';
    s += (x + w) + ' ' + (yy + h - r) + ' l ' + (x + w) + ' ' + (yy + h - r + k) + ' ' + (x + w - r + k) + ' ' + (yy + h) + ' ' + (x + w - r) + ' ' + (yy + h) + ' c ';
    s += (x + r) + ' ' + (yy + h) + ' l ' + (x + r - k) + ' ' + (yy + h) + ' ' + x + ' ' + (yy + h - r + k) + ' ' + x + ' ' + (yy + h - r) + ' c ';
    s += x + ' ' + (yy + r) + ' l ' + x + ' ' + (yy + r - k) + ' ' + (x + r - k) + ' ' + yy + ' ' + (x + r) + ' ' + yy + ' c h';
    p.push(s);
    p.push(fill && stroke ? 'B' : fill ? 'f' : 'S');
    p.push('Q');
    cur.push(p.join(' '));
  }
  function need(h) { if (y - h < M + 14) { newPage(); } }

  // ---------- data ----------
  var total = quizQs.length;
  var correct = attempt.score;
  var missed = total - correct;
  var pct = attempt.pct != null ? attempt.pct : Math.round(100 * correct / total);
  var passed = pct >= QUIZ_PASS;
  var learner = 'Guest learner';
  try {
    var cu = typeof currentUser === 'function' ? currentUser() : currentUser;
    if (cu) learner = typeof cu === 'string' ? cu : (cu.displayName || cu.email || learner);
  } catch (e) {}
  var dateStr = attempt.at ? new Date(attempt.at).toLocaleString() : '';
  var topics = [];
  var missedList = [];
  quizQs.forEach(function (q, i) {
    if (attempt.answers[i] !== q.answer) {
      var t = quizTopic(quiz.id, i);
      if (t && topics.indexOf(t) < 0) topics.push(t);
      if (t) missedList.push({ qi: i, topic: t });
    }
  });
  var lessonStr = '';
  try {
    var les = null;
    if (typeof LESSON_META !== 'undefined') {
      les = LESSON_META.find(function (l) { return l.id === quiz.lessonId; }) || LESSON_META.find(function (l) { return l.quizId === quiz.id; });
    }
    if (les) lessonStr = 'Lesson ' + les.num + ' \u00B7 ' + les.title;
  } catch (e) {}

  pages = [];
  // ---------- page 1 ----------
  newPage();
  text('FlutterForward', M, y - 16, 'F4', 16, INK);
  text('QUIZ RESULT', W - M, y - 16, 'F2', 8, BLUE, 'r');
  y -= 30; hline(y); y -= 34;
  wrap(quiz.title, 'F3', 23, CW).forEach(function (ln) { text(ln, M, y - 20, 'F3', 23, INK); y -= 28; });
  y -= 2;
  text([learner, dateStr].filter(Boolean).join('  \u2022  '), M, y - 9, 'F1', 9.5, GRAY); y -= 26;

  // Score row
  text(pct + '%', M, y - 34, 'F3', 38, INK);
  var pillTxt = passed ? 'Passed' : 'Keep going';
  var pillW = tw(pillTxt, 'F2', 9) + 26;
  rrect(W - M - pillW, y - 40, pillW, 22, 11, passed ? GREENBG : REDBG, null);
  text(pillTxt, W - M - pillW / 2, y - 33, 'F2', 9, passed ? GREEN : RED, 'c');
  y -= 48;
  text(passed ? 'You have a solid grip on this lesson.' : 'Review the ' + missed + ' missed point' + (missed === 1 ? '' : 's') + ' below, then try again.', M, y - 10, 'F1', 10, GRAY);
  y -= 30;

  // Stat boxes
  var bw = (CW - 24) / 3, bh = 48;
  var stats = [[correct + '/' + total, 'POINTS'], [String(correct), 'CORRECT'], [String(missed), 'MISSED']];
  stats.forEach(function (st, i) {
    var bx = M + i * (bw + 12);
    rrect(bx, y - bh, bw, bh, 8, BOXFILL, LINE);
    text(st[0], bx + bw / 2, y - 25, 'F3', 17, INK, 'c');
    text(st[1], bx + bw / 2, y - 38, 'F2', 7, FAINT, 'c');
  });
  y -= bh + 24;

  // Topics
  text(topics.length ? 'Topics to revisit' : 'A clean result', M, y - 13, 'F3', 14, INK); y -= 20;
  if (!topics.length) { text('Every answer was correct.', M, y - 9, 'F1', 9.5, GRAY); y -= 14; }
  if (topics.length) {
    var cx = M;
    topics.forEach(function (t) {
      var chw = tw(t, 'F2', 8.5) + 26;
      if (cx + chw > W - M) { cx = M; y -= 30; }
      rrect(cx, y - 22, chw, 22, 11, CHIPBG, LINE);
      text(t, cx + chw / 2, y - 14.5, 'F2', 8.5, BLUE, 'c');
      cx += chw + 8;
    });
    y -= 22;
    // Exact pointers: which question each topic came from, and the lesson to reopen
    y -= 10;
    missedList.forEach(function (md) {
      var pre = 'Q' + (md.qi + 1) + ' \u00B7 ';
      text(pre, M, y - 9, 'F1', 9, FAINT);
      var aw = tw(pre, 'F1', 9);
      text(md.topic, M + aw, y - 9, 'F2', 9, INK);
      if (lessonStr) text(' \u2014 ' + lessonStr, M + aw + tw(md.topic, 'F2', 9), y - 9, 'F1', 9, GRAY);
      y -= 13.5;
    });
    y -= 2;
  }
  y -= 20;

  // Answer review header
  need(70);
  text('ANSWER REVIEW', M, y - 8, 'F2', 8, BLUE);
  text(correct + ' of ' + total + ' correct', W - M, y - 10, 'F1', 9.5, GRAY, 'r');
  y -= 16;
  text('Question by question', M, y - 17, 'F3', 18, INK); y -= 24; hline(y); y -= 8;

  // ---------- questions: cards, atomic, dynamically balanced across pages ----------
  var BOT = M + 14;
  var pad = 16, innerW = CW - pad * 2;
  function wrap2d(str, font, size, firstW, restW) {
    var words = clean(str).split(/\s+/).filter(Boolean), lines = [], curL = '', w = firstW;
    for (var i = 0; i < words.length; i++) {
      var t = curL ? curL + ' ' + words[i] : words[i];
      if (tw(t, font, size) <= w || !curL) curL = t;
      else { lines.push(curL); curL = words[i]; w = restW; }
    }
    if (curL) lines.push(curL);
    return lines.length ? lines : [''];
  }
  // Pre-render every card into lines with exact heights
  var cardsArr = quizQs.map(function (q, i) {
    var mine = attempt.answers[i];
    var ok = mine === q.answer;
    var lines = [], h = 0;
    function add(fn, lh) { lines.push({ fn: fn, lh: lh }); h += lh; }
    add(function (x, yy) {
      text('QUESTION ' + (i + 1), x + pad, yy - 4, 'F2', 7.5, BLUE);
      var tag = ok ? 'CORRECT' : 'REVIEW';
      var tagW = tw(tag, 'F2', 7) + 18;
      rrect(x + CW - pad - tagW, yy - 9, tagW, 15, 7.5, ok ? GREENBG : REDBG, null);
      text(tag, x + CW - pad - tagW / 2, yy - 4, 'F2', 7, ok ? GREEN : RED, 'c');
    }, 18);
    wrap(q.q, 'F3', 11.5, innerW).forEach(function (ln) {
      add(function (x, yy) { text(ln, x + pad, yy - 11, 'F3', 11.5, INK); }, 14.5);
    });
    add(null, 4);
    function answerBlock(label, value, valColor) {
      var lw = tw(label, 'F2', 9.5) + 6;
      wrap2d(value, 'F2', 9.5, innerW - lw, innerW).forEach(function (ln, li) {
        add(function (x, yy) {
          if (li === 0) { text(label, x + pad, yy - 9, 'F2', 9.5, GRAY); text(ln, x + pad + lw, yy - 9, 'F2', 9.5, valColor); }
          else text(ln, x + pad, yy - 9, 'F2', 9.5, valColor);
        }, 13);
      });
    }
    answerBlock('Your answer:', q.options[mine] != null ? q.options[mine] : '-', INK);
    if (!ok) answerBlock('Correct answer:', q.options[q.answer], GREEN);
    if (q.explanation) {
      add(null, 2);
      var whyW = tw('Why:', 'F2', 9.5) + 6;
      wrap2d(q.explanation, 'F1', 9.5, innerW - whyW, innerW).forEach(function (ln, li) {
        add(function (x, yy) {
          if (li === 0) { text('Why:', x + pad, yy - 9, 'F2', 9.5, GRAY); text(ln, x + pad + whyW, yy - 9, 'F1', 9.5, INK); }
          else text(ln, x + pad, yy - 9, 'F1', 9.5, INK);
        }, 13);
      });
    }
    // Card height: 14 top pad + lines + 12 bottom pad
    return { h: 14 + h + 12, lines: lines };
  });
  // Dynamic partition: contiguous card groups per page; minimize pages, then squared slack
  var capFirst = y - BOT;
  var capNext = (H - M - 30) - BOT;
  function pageCap(p) { return p === 0 ? capFirst : capNext; }
  var cardH = cardsArr.map(function (c) { return c.h; });
  var GAP = 12;
  var memo2 = {};
  function betterSol(a, b) {
    // Lexicographic: fewer pages wins; then more space used on earlier pages wins.
    if (!b) return true;
    if (a.pages !== b.pages) return a.pages < b.pages;
    for (var i = 0; i < a.used.length; i++) {
      if (a.used[i] !== b.used[i]) return a.used[i] > b.used[i];
    }
    return false;
  }
  function solveP(qi, p) {
    if (qi === cardsArr.length) return { pages: 0, used: [], groups: [] };
    var key = qi + ':' + p;
    if (memo2[key]) return memo2[key];
    var best = null, sum = 0;
    for (var j = qi; j < cardsArr.length; j++) {
      sum += cardH[j] + (j > qi ? GAP : 0);
      var cap = pageCap(p);
      if (sum > cap) {
        if (j === qi) {
          var r0 = solveP(j + 1, p + 1);
          var cand0 = { pages: 1 + r0.pages, used: [cap].concat(r0.used), groups: [{ from: qi, to: j, split: true }].concat(r0.groups) };
          if (betterSol(cand0, best)) best = cand0;
        }
        break;
      }
      var rest = solveP(j + 1, p + 1);
      var cand = { pages: 1 + rest.pages, used: [sum].concat(rest.used), groups: [{ from: qi, to: j, split: false }].concat(rest.groups) };
      if (betterSol(cand, best)) best = cand;
    }
    memo2[key] = best;
    return best;
  }
  var pageGroups = solveP(0, 0).groups;
  // Draw page by page; distribute each page's leftover slack evenly between its cards
  pageGroups.forEach(function (g, pi) {
    if (pi > 0) {
      newPage();
      text('ANSWER REVIEW - CONTINUED', M, y - 8, 'F2', 7.5, BLUE);
      y -= 14; hline(y); y -= 16;
    }
    var cap = pageCap(pi);
    var used = 0;
    for (var k = g.from; k <= g.to; k++) used += cardH[k] + (k > g.from ? GAP : 0);
    var slack = Math.max(0, cap - used);
    var gaps = g.to - g.from;
    var extra = gaps > 0 ? Math.min(30, slack / gaps) : 0;
    var yy = y;
    for (var ci = g.from; ci <= g.to; ci++) {
      var card = cardsArr[ci];
      if (g.split) {
        // Oversized card fallback: flow lines without a box (unreachable for current quizzes)
        var ly = yy - 14;
        card.lines.forEach(function (line) {
          if (ly - line.lh < BOT) { newPage(); ly = y - 14; }
          if (line.fn) line.fn(M, ly);
          ly -= line.lh;
        });
        yy = ly - 12;
      } else {
        rrect(M, yy - card.h, CW, card.h, 10, BOXFILL, LINE);
        var cy = yy - 14;
        card.lines.forEach(function (line) {
          if (line.fn) line.fn(M, cy);
          cy -= line.lh;
        });
        yy -= card.h;
      }
      if (ci < g.to) yy -= GAP + extra;
    }
    y = yy;
  });

  // ---------- footers ----------
  var totalPages = pages.length;
  pages.forEach(function (pg, i) {
    cur = pg;
    text('Generated by FlutterForward', M, 30, 'F1', 7.5, FAINT);
    text('Page ' + (i + 1) + ' of ' + totalPages, W - M, 30, 'F1', 7.5, FAINT, 'r');
  });

  // ---------- assemble ----------
  async function flate(bytes) {
    try {
      if (typeof CompressionStream !== 'undefined') {
        var cs = new CompressionStream('deflate');
        var stream = new Blob([bytes]).stream().pipeThrough(cs);
        var buf = await new Response(stream).arrayBuffer();
        return { data: new Uint8Array(buf), filter: true };
      }
    } catch (e) {}
    return { data: bytes, filter: false };
  }
  var enc = new TextEncoder();
  var fontObjs = { F1: 'Helvetica', F2: 'Helvetica-Bold', F3: 'Times-Roman', F4: 'Times-Bold', F5: 'Times-Italic' };
  var fkeys = Object.keys(fontObjs);
  var fontRes = fkeys.map(function (fk, i) { return '/' + fk + ' ' + (3 + i) + ' 0 R'; }).join(' ');
  var objects = {}; // num -> string | {stream:Uint8Array, filter:bool}
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [' + pages.map(function (_, i) { return (8 + i * 2) + ' 0 R'; }).join(' ') + '] /Count ' + pages.length + ' >>';
  fkeys.forEach(function (fk, i) {
    objects[3 + i] = '<< /Type /Font /Subtype /Type1 /BaseFont /' + fontObjs[fk] + ' /Encoding /WinAnsiEncoding >>';
  });
  for (var pi = 0; pi < pages.length; pi++) {
    var comp = await flate(enc.encode(pages[pi].join('\n')));
    var pageObjNum = 8 + pi * 2, contentObjNum = 9 + pi * 2;
    objects[pageObjNum] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << ' + fontRes + ' >> >> /Contents ' + contentObjNum + ' 0 R >>';
    objects[contentObjNum] = { stream: comp.data, filter: comp.filter };
  }
  var maxObj = 9 + pages.length * 2;
  var chunks = [], offsets = {}, pos = 0;
  function pushStr(s) { var b = enc.encode(s); chunks.push(b); pos += b.length; }
  function pushRaw(b) { chunks.push(b); pos += b.length; }
  pushStr('%PDF-1.4\n');
  pushRaw(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));
  for (var n = 1; n <= maxObj; n++) {
    if (objects[n] == null) continue;
    offsets[n] = pos;
    var o = objects[n];
    if (typeof o === 'string') {
      pushStr(n + ' 0 obj\n' + o + '\nendobj\n');
    } else {
      pushStr(n + ' 0 obj\n<< /Length ' + o.stream.length + (o.filter ? ' /Filter /FlateDecode' : '') + ' >>\nstream\n');
      pushRaw(o.stream);
      pushStr('\nendstream\nendobj\n');
    }
  }
  var xrefPos = pos;
  var xref = 'xref\n0 ' + (maxObj + 1) + '\n0000000000 65535 f \n';
  for (var m = 1; m <= maxObj; m++) {
    xref += (offsets[m] != null ? String(offsets[m]).padStart(10, '0') + ' 00000 n \n' : '0000000000 65535 f \n');
  }
  pushStr(xref);
  pushStr('trailer\n<< /Size ' + (maxObj + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF');
  var totalLen = 0;
  chunks.forEach(function (b) { totalLen += b.length; });
  var result = new Uint8Array(totalLen), off = 0;
  chunks.forEach(function (b) { result.set(b, off); off += b.length; });
  return result;
}
function openPdfSheet(e,t){if($("#pdfsheet-veil"))return void URL.revokeObjectURL(e);const n=document.createElement("div");n.className="modal-veil",n.id="pdfsheet-veil",n.innerHTML=`<div class="modal pdfsheet-dialog" role="dialog" aria-modal="true" aria-labelledby="ps-title">\n    <h2 id="ps-title">Your PDF is ready</h2>\n    <p style="word-break:break-all">${esc(t)}</p>\n    <a class="btn btn-accent btn-block" id="ps-dl" href="${e}" download="${esc(t)}">Download PDF</a>\n    <a class="btn btn-soft btn-block" id="ps-open" href="${e}" target="_blank" rel="noopener">Open in browser</a>\n    <button class="btn btn-soft btn-block" id="ps-close">Close</button>\n  </div>`,document.body.appendChild(n);const s=()=>{closeModalVeil(n,!0),setTimeout(()=>URL.revokeObjectURL(e),5e3)};n.querySelector("#ps-close").onclick=s,n.addEventListener("click",e=>{e.target===n&&s()});const a=e=>{"Escape"===e.key&&(document.removeEventListener("keydown",a),s())};document.addEventListener("keydown",a),viewCleanup.push(()=>{const t=$("#pdfsheet-veil");t&&(t.remove(),URL.revokeObjectURL(e))}),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("show")))}
let _pdfBusy=!1;;
async function downloadQuizPdf(e,t){const n=(DATA.quizzes||[]).find(t=>t.id===e);if(n&&t&&t.answers&&!_pdfBusy){_pdfBusy=!0;try{const bytes=await quizPdfBuild(n,t),i=new Blob([bytes],{type:"application/pdf"}),r=URL.createObjectURL(i),l=(t.at?new Date(t.at):new Date).toISOString().slice(0,10),c="flutterforward-"+n.id+"-"+l+".pdf";if(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches)openPdfSheet(r,c);else{const e=document.createElement("a");e.href=r,e.download=c,document.body.appendChild(e),e.click(),setTimeout(()=>{URL.revokeObjectURL(r),e.remove()},4e3)}}catch(e){}_pdfBusy=!1}}const quizState={};views.quiz=(e,t)=>{if(!currentUser&&e>FREE_LESSONS){setTimeout(()=>{if((location.hash||"")==="#/quiz/"+e&&!currentUser)showGatePrompt("quiz",e)},60);return views.quizzes();}const n=DATA.quizzes[e-1];const qs=quizQuestions(n);if(!n)return views.quizzes();const s=quizState[n.id]||(quizState[n.id]={answers:{},done:!1,score:0,current:0});if("number"!=typeof s.current&&(s.current=0),t){const e=Math.round(s.score/qs.length*100),t=e>=QUIZ_PASS,a=qs.length-s.score,o=qs.map((e,t)=>s.answers[t]===e.answer?null:quizTopic(n.id,t)).filter(Boolean);return`<div class="quiz-stage"><a class="back-link" href="#/quizzes">← All quizzes</a>
    <div style="text-align:right;margin:8px 0 4px"><button class="btn btn-soft" id="quiz-lang-toggle" type="button">${quizLang()==="hi"?"English":"Hinglish"}</button></div>\n    <div class="card score-hero">\n      <div class="score-ring" style="--p:${e}"><b>${e}%</b></div>\n      <div class="result-emoji" aria-hidden="true">${t?"🎉":"💪"}</div>
      <h2>${t?"You passed!":"Almost there"}</h2>\n      <p>${t?"You have a solid grip on this lesson.":`Review the ${a} point${1===a?"":"s"} below, then try again.`}</p>\n      <span class="pass-pill ${t?"pass":"fail"}">${t?"✓ Passed":`Need ${QUIZ_PASS}%to pass`}</span>\n      <div class="result-stats">\n        <div class="result-stat"><b>${s.score}/${qs.length}</b><span>Points</span></div>\n        <div class="result-stat"><b>${s.score}</b><span>Correct</span></div>\n        <div class="result-stat"><b>${a}</b><span>Missed</span></div>\n      </div>\n    
      ${currentUser?'<p class="saved-note">✓ Progress saved</p>':'<p class="saved-note">Log in to save this result</p>'}
    </div>\n    <div class="weak-card${o.length?"":" clear"}">\n      <div class="weak-head"><span class="weak-mark">${o.length?"!":"✓"}</span><div>\n        <b>${o.length?"Weak topics":"No weak topics"}</b>\n        <p>${o.length?"Focus on these before your next attempt.":"Every answer was correct."}</p>\n      </div></div>\n      ${o.length?`<div class="weak-tags">${o.map(e=>`<span>${esc(e)}</span>`).join("")}</div>`:""}\n    </div>\n    <div class="section-head"><h2>Question review</h2><span style="font-size:13px;color:var(--text-3)">${s.score} of ${qs.length} correct</span></div>\n    <div class="review-list">${qs.map((e,t)=>{const n=s.answers[t],a=n===e.answer;return`<article class="review-card ${a?"ok":"bad"}">\n<div class="review-top"><h3>${t+1}.${esc(e.q)}</h3><span class="review-status">${a?"Correct":"Needs review"}</span></div>\n<div class="review-answer"><span><b>Your answer:</b>${esc(null==e.options[n]?"—":e.options[n])}</span>\n ${a?"":`<span class="correct-line"><b>Correct answer:</b>${esc(e.options[e.answer])}</span>`}\n</div>\n<div class="review-why"><b>Why:</b>${esc(e.explanation)}</div>\n</article>`}).join("")}</div>\n    <div class="result-actions"><button class="btn btn-accent" id="quiz-retry">Retake quiz</button><button class="btn btn-soft" id="quiz-pdf">Download PDF</button><a class="btn btn-outline" href="#/quizzes">Back to quizzes</a></div></div>`}const a=Math.max(0,Math.min(s.current,qs.length-1));s.current=a;const o=qs[a],i=Object.keys(s.answers).length,r=s.answers[a];return`<div class="quiz-stage"><div class="quiz-view-head"><div class="quiz-view-head-copy"><a class="back-link" href="#/quizzes">← All quizzes</a>
    <h1 class="quiz-view-title">Quiz ${e} — ${esc(n.title.replace(/^Quiz:\s*/,""))}</h1></div>
    <div class="quiz-view-head-side"><span class="status-pill current quiz-prog-tag">Question ${a+1} of ${qs.length}</span><button class="btn btn-soft" id="quiz-lang-toggle" type="button">${quizLang()==="hi"?"English":"Hinglish"}</button></div></div>
    <div class="quiz-progress" aria-label="Quiz progress"><i style="transform:scaleX(${(a+1)/qs.length})"></i></div>
    <div class="quiz-q">
      <div class="caps">Question ${a+1} of ${qs.length}${o.type==="tf"?" · True / False":" · Multiple choice"}</div>
      <h3>${esc(o.q)}</h3>
      ${o.type==="tf"?`<div class="opt-tf-grid">${o.options.map((e,t)=>`<button class="opt opt-tf${r===t?" sel":""}${null!=r&&t===o.answer?" correct":""}${null!=r&&r===t&&t!==o.answer?" wrong":""}"${null!=r?" disabled":""}data-q="${n.id}:${a}:${t}"aria-pressed="${r===t?"true":"false"}">${t===0?"✓ ":"✕ "}${esc(e)}</button>`).join("")}</div>`:`<div class="opt-list">${o.options.map((e,t)=>`<button class="opt${r===t?" sel":""}${null!=r&&t===o.answer?" correct":""}${null!=r&&r===t&&t!==o.answer?" wrong":""}"${null!=r?" disabled":""}data-q="${n.id}:${a}:${t}"aria-pressed="${r===t?"true":"false"}"><span class="opt-key">${"ABCD"[t]}</span>${esc(e)}</button>`).join("")}</div>`}
      ${null!=r?`<div class="quiz-why ${r===o.answer?"why-right":"why-wrong"}"><b>Why:</b> ${esc(o.explanation)}</div>`:""}
    </div>
    <div class="quiz-nav">
      ${a>0?'<button class="btn btn-soft" id="quiz-back">Back</button>':""}
      <button class="btn btn-accent" id="quiz-next"${null==r?" disabled":""}>${a===qs.length-1?"See results":"Next question"}</button>
    </div>
  </div>`};const TROPHY_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a4 4 0 0 0 4 4M16 6h3v1a4 4 0 0 1-4 4M12 12v5m-3 3h6m-5-3h4"/></svg>',RANK_ICONS=Array.from({length:10},()=>TROPHY_ICON),fmtDate=e=>{try{const t=new Date(e);return t.toLocaleDateString(void 0,{day:"numeric",month:"short"})+", "+t.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}catch(e){return""}};function showAllRanks(){const e=document.getElementById("ranks-portal");e&&e.remove();const t=rankIndexFor(doneCount()),n=RANKS.map((e,n)=>{const s=n<t?"reached":n===t?"current rank":"locked",a=n<t?'<span class="rl-mark" aria-hidden="true">✓</span>':n===t?'<span class="rl-cur">Current</span>':'<span class="rl-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>';return`<div class="rl-row ${n<t?"done":n===t?"cur":"lock"}" aria-label="${esc(e.name)}, ${s}"${n===t?' aria-current="step"':""}>\n      <span class="rl-ico" aria-hidden="true">${RANK_ICONS[n]}</span>\n      <div class="rl-t"><b>${esc(e.name)}</b>${0===n?"<span>Starting rank</span>":""}</div>${a}</div>`}).join(""),s=document.createElement("div");s.id="ranks-portal",s.className="modal-veil ranks-portal",s.innerHTML=`<div class="modal ranks-dialog" role="dialog" aria-modal="true" aria-labelledby="ranks-title">\n    <div class="ranks-head">\n      <div class="ranks-head-copy"><h2 id="ranks-title">All ranks</h2><p>Your path from first widget to Flutter Master.</p></div>\n      <button class="ranks-close" type="button" aria-label="Close all ranks">×</button>\n    </div>\n    <div class="rl-list">${n}</div>\n    <button class="btn btn-accent btn-block ranks-done" type="button">Close</button>\n  </div>`,document.body.appendChild(s);const a=document.getElementById("ranks-help");let o=!1;const i=e=>{"Escape"===e.key&&r()},r=e=>{o||(o=!0,document.removeEventListener("keydown",i),e?(s.remove(),syncModalScrollLock()):(closeModalVeil(s,!0),a&&document.contains(a)&&setTimeout(()=>a.focus(),180)))};s.querySelector(".ranks-close").onclick=()=>r(!1),s.querySelector(".ranks-done").onclick=()=>r(!1),s.addEventListener("click",e=>{e.target===s&&r(!1)}),document.addEventListener("keydown",i),onViewCleanup(()=>r(!0)),requestAnimationFrame(()=>{s.classList.add("show"),s.querySelector(".ranks-close").focus()})}async function handleGoogleSignIn(){if(!auth)return;const t=$("#auth-error"),n=$("#auth-google"),s=n?n.querySelector("span"):null;if(t)t.textContent="";if(n)n.disabled=!0;if(s)s.textContent="Connecting to Google…";try{const p=new firebase.auth.GoogleAuthProvider();try{await auth.signInWithPopup(p);}catch(e){if(e&&e.code==="auth/popup-blocked"){await auth.signInWithRedirect(p);}else throw e;}}catch(e){if(t)t.textContent=(e&&e.code==="auth/operation-not-allowed")?"Google sign-in is not enabled yet. Enable Google in Firebase Authentication \u2192 Sign-in method.":friendlyAuthError(e);if(n)n.disabled=!1;if(s)s.textContent="Continue with Google";}}
function showResetView(){const e=$("#auth-email");authResetEmail=e?String(e.value||"").trim():"",authReset=!0,authResetSent=null,render();const t=$("#auth-reset-email");t&&t.focus()}
function backToLogin(){authReset=!1,authResetSent=null,authMode="login",render();const e=$("#auth-email");e&&e.focus()}
async function handleResetSubmit(e){if(!e)return;const t=$("#auth-reset-error"),n=$("#auth-reset-submit"),s=String(e.email.value||"").trim();if(!s)return t&&(t.textContent="Enter your email address."),void e.reportValidity();if(!e.checkValidity())return t&&(t.textContent="Enter a valid email address."),void e.reportValidity();if(!auth)return t&&(t.textContent="Authentication unavailable \u2014 check your connection and try again.");t&&(t.textContent=""),n&&(n.disabled=!0,n.textContent="Sending\u2026");try{await auth.sendPasswordResetEmail(s),authResetEmail=s,authResetSent=s,render()}catch(e){t&&(t.textContent=friendlyAuthError(e)),n&&(n.disabled=!1,n.textContent="Send reset link")}}
async function handleAuthSubmit(e){if(!auth||!e)return;const t=$("#auth-error"),n=$("#auth-submit"),s=String(e.email.value||"").trim(),a=String(e.password.value||""),o=e.elements.name,i=o?String(o.value||"").trim():"";if(!e.checkValidity())return t&&(t.textContent="Complete the fields above with valid details."),void e.reportValidity();if("register"!==authMode||i){t&&(t.textContent=""),n&&(n.disabled=!0,n.textContent="register"===authMode?"Creating account…":"Logging in…");try{if("register"===authMode){const e=await auth.createUserWithEmailAndPassword(s,a);await e.user.updateProfile({displayName:i.slice(0,32)}),currentUser=e.user,render()}else await auth.signInWithEmailAndPassword(s,a)}catch(e){t&&(t.textContent=friendlyAuthError(e)),n&&(n.disabled=!1,n.textContent="register"===authMode?"Create account":"Login")}}else t&&(t.textContent="Enter the name you want shown on your profile.")}views.progress=()=>{const e=rankIndexFor(doneCount()),t=RANKS[e],n=LESSON_META.filter(e=>S.lessonsDone[e.id]).length,s=Object.keys(S.quizzesPassed).length,a=DATA.quizzes.map((e,t)=>{const n=(S.quizHistory||{})[e.id]||[],s=!!S.quizzesPassed[e.id];let a,o="";if(n.length){const t=n.reduce((e,t)=>t.pct>e.pct?t:e,n[0]);a=t.pct>=QUIZ_PASS?'<span class="qh-badge pass">✓ Passed</span>':`<span class="qh-badge fail">${t.pct}% &middot; Not passed</span>`;const s=n.map((t,n)=>{const s=t.at?fmtDate(t.at):"Earlier attempt",a=t.answers?quizQuestions(e).map((e,n)=>{const s=t.answers[n],a=s===e.answer;return`<div class="qa ${a?"ok":"bad"}">\n            <div class="qa-q">${n+1}. ${esc(e.q)}</div>\n            <div class="qa-a">${a?"✓":"✗"} Your answer: <b>${esc(null==e.options[s]?"—":e.options[s])}</b>${a?"":`<span class="qa-correct">Correct:<b>${esc(e.options[e.answer])}</b></span>`}</div>\n          </div>`}).join(""):'<div class="qa-na">Answer details were not recorded for this attempt.</div>';return`<details class="att"><summary><b>${s}</b><span>${t.score}/${t.total} &middot; ${t.pct}%${t.answers?`<button class="qh-pdf"data-q="${e.id}"data-ai="${n}"title="Download result as PDF">PDF</button>`:""}</span></summary><div class="qa-list">${a}</div></details>`}).join("");o=`<div class="qh-bestrow"><div class="qh-best"><b>${t.pct}%</b><span>best &middot; ${t.score}/${t.total}</span></div>\n        <div class="qh-bar"><i style="transform:scaleX(${t.pct/100})"></i></div></div>\n        <details class="qh-review"><summary>Review answers (${n.length} attempt${n.length>1?"s":""})</summary>${s}</details>`}else s?(a='<span class="qh-badge pass">✓ Passed</span>',o='<div class="qh-na">Finished before result tracking &mdash; retake to record full results.</div>'):a='<span class="qh-badge todo">Not attempted</span>';return`<div class="qh-card">\n        <div class="qh-top"><b>${esc(e.title)}</b>${a}</div>\n        ${o}\n        <a class="qh-link" href="#/quiz/${t+1}">${n.length||s?"Retake quiz &rarr;":"Take quiz &rarr;"}</a>\n      </div>`}).join(""),o=`<div class="rk-card">\n    <div class="rk-side">\n      <span class="rk-cur-badge">${RANK_ICONS[e]}</span>\n      <div class="rk-info"><h3>${esc(t.name)}</h3><span class="rk-label">Level ${e+1} of ${RANKS.length}</span></div>\n      <button class="rk-help" id="ranks-help" aria-label="See all ranks" aria-haspopup="dialog">?</button>\n    </div>\n  </div>`;return pageHead(null,"Your progress","A quiet record of every lesson and quiz completed.")+`<div class="progress-layout${currentUser?"":" no-side"}">${currentUser?'<aside class="progress-side">\n    '+o+'\n  </aside>':''}\n  <div class="progress-main-shell">\n    <div class="progress-main">\n      <div class="stat-grid stagger" style="margin-bottom:18px">\n        <div class="stat"><b>${n}/${LESSON_META.length}</b><span>Lessons</span></div>\n        <div class="stat"><b>${s}/${DATA.quizzes.length}</b><span>Quizzes</span></div>\n      </div>\n      <div class="section-head"><h2>Quiz results</h2></div>\n      <div class="qhist">${a}</div>\n    </div>\n  </div>\n  </div>`},views.profile=()=>{if(!authReady&&!authUnavailable)return pageHead(null,"Profile","Sign in to view your learning profile.")+'<div class="auth-card auth-loading">Checking your account…</div>';if(authUnavailable)return pageHead(null,"Profile","Sign in to view your learning profile.")+'<div class="auth-card auth-fallback"><div class="auth-intro"><h2>Authentication unavailable</h2><p>Firebase could not load. Check your internet connection, then refresh this page.</p></div></div>';if(!currentUser){if(authReset){if(authResetSent)return`<div class="auth-screen"><section class="auth-card">\n        <div class="auth-intro"><h2>Check your email</h2>\n          <p>We sent a password reset link to <b>${esc(authResetSent)}</b>.</p></div>\n        <div class="box box-why auth-sent-box"><b>Check your email ✉</b><p>If an account exists for that email, a reset link is on its way. Check your spam if you don’t see it.</p></div>\n        <button class="auth-back-link" type="button" data-auth-back-login>\u2190 Back to login</button>\n      </section></div>`;return`<div class="auth-screen"><section class="auth-card">\n        <div class="auth-intro"><h2>Reset password</h2>\n          <p>Enter your email and we\u2019ll send you a link to reset your password.</p></div>\n        <div class="auth-form-panel">\n          <form class="auth-form" id="auth-reset-form" novalidate>\n            <div class="auth-field"><label for="auth-reset-email">Email</label><input id="auth-reset-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com"${authResetEmail?` value="${esc(authResetEmail)}"`:""} required></div>\n            <div class="auth-error" id="auth-reset-error" role="alert" aria-live="polite"></div>\n            <button class="btn btn-accent btn-block auth-submit" id="auth-reset-submit" type="submit">Send reset link</button>\n          </form>\n          <button class="auth-back-link" type="button" data-auth-back-login>\u2190 Back to login</button>\n        </div>\n      </section></div>`}const e="register"===authMode,t=authSlideDirection?" auth-enter-"+(authSlideDirection>0?"right":"left"):"";return authSlideDirection=0,`<div class="auth-screen"><section class="auth-card">\n        <div class="auth-intro${t}"><h2>${e?"Create your account":"Welcome back"}</h2>\n          <p>${e?"Set up your FlutterForward identity.":"Continue with your learning profile."}</p></div>\n        <div class="auth-tabs" data-mode="${e?"register":"login"}" role="tablist" aria-label="Account access">\n          <button class="auth-tab${e?"":" active"}" type="button" role="tab" aria-selected="${e?"false":"true"}" data-auth-mode="login">Login</button>\n          <button class="auth-tab${e?" active":""}" type="button" role="tab" aria-selected="${e?"true":"false"}" data-auth-mode="register">Register</button>\n        </div>\n        <div class="auth-form-panel${t}">\n          <form class="auth-form" id="auth-form" novalidate>\n            ${e?'<div class="auth-field"><label for="auth-name">Display name</label><input id="auth-name" name="name" type="text" maxlength="32" autocomplete="name" placeholder="Your name" required></div>':""}\n            <div class="auth-field"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com"${authResetEmail?` value="${esc(authResetEmail)}"`:""} required></div>\n            <div class="auth-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" autocomplete="${e?"new-password":"current-password"}" placeholder="${e?"At least 6 characters":"Your password"}" required></div>${e?"":'\n            <div class="auth-forgot"><button type="button" class="auth-forgot-link" id="auth-forgot">Forgot password?</button></div>'}\n            <div class="auth-error" id="auth-error" role="alert" aria-live="polite"></div>\n            <button class="btn btn-accent btn-block auth-submit" id="auth-submit" type="submit">${e?"Create account":"Login"}</button>\n          </form>\n          <div class="auth-divider"><span>or</span></div>\n          <button class="btn btn-block auth-google" id="auth-google" type="button"><svg class="auth-google-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/></svg><span>Continue with Google</span></button>\n        </div>\n      </section></div>`}const e=rankIndexFor(doneCount()),t=LESSON_META.filter(e=>S.lessonsDone[e.id]).length,n=DATA.quizzes.filter(q=>S.quizzesPassed[q.id]).length,s=DATA.quizzes.reduce((a,q)=>a+((S.quizHistory||{})[q.id]||[]).length,0),a=Object.values(S.quizHistory||{}).reduce((e,t)=>e.concat(t.map(e=>e.pct)),[]),o=a.length?Math.max.apply(null,a)+"%":"—",u=LESSON_META.find(l=>!(S.lessonsDone||{})[l.id]);return`<div class="page-head profile-head"><div class="caps">Your account</div><h1>Profile</h1></div>\n  <div class="profile-shell">\n    <section class="profile-summary">\n      <div class="profile-avatar-lg" aria-hidden="true">${esc((userName(currentUser)||"F").trim().charAt(0).toUpperCase())}</div>\n      <div class="profile-copy">\n        <h2>${esc(userName(currentUser))}</h2>\n        <p class="profile-email">${esc(currentUser.email||"")}</p>\n        <span class="tag tag-current profile-rank-tag">${esc(RANKS[e].name)} · Level ${e+1} of ${RANKS.length}</span>
        <span class="cloud-status">${cloudStatusText()}</span>\n      </div>\n      <div class="profile-actions"><button class="auth-logout" type="button" data-auth-logout>Log out</button></div>\n    </section>\n    <div class="stat-grid profile-stats">\n      <div class="stat"><b>${t}/${LESSON_META.length}</b><span>Lessons done</span></div>\n      <div class="stat"><b>${n}/${DATA.quizzes.length}</b><span>Quizzes passed</span></div>\n      <div class="stat"><b>${s}</b><span>Quiz attempts</span></div>\n      <div class="stat"><b>${o}</b><span>Best score</span></div>\n    </div>\n    <section class="card profile-continue">\n      <h3>Continue where you left off</h3>\n      <p>${u?`Lesson ${u.num} — ${esc(u.title)}`:"You finished all 40 lessons — nice work."}</p>\n      <a class="btn btn-accent" href="${u?`#/lesson/${u.num}`:"#/lessons"}">${u?"Continue →":"Browse lessons"}</a>\n    </section>\n  </div>`};const TABS=[{route:"#/home",label:"Home",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',match:["home"]},{route:"#/lessons",label:"Lessons",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>',match:["lessons","lesson"]},{route:"#/quizzes",label:"Quizzes",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',match:["quizzes","quiz"]},{route:"#/teardowns",label:"Teardowns",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="11" height="16" rx="2"/><path d="M8 7h3M7 11h5M9.5 19v2M18 8v11M15.5 10.5 18 8l2.5 2.5M15.5 16.5 18 19l2.5-2.5"/></svg>',match:["teardowns"]},{route:"#/resources",label:"Resources",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',match:["resources"]},{route:"#/profile",label:"Profile",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',match:["profile"],top:!1}];function setActiveTab(e){const t=TABS.find(t=>t.match.includes(e)),n=t?t.match[0]:e;$$(".side-link").forEach(e=>e.classList.toggle("active",e.dataset.match===n)),$$(".nav-link").forEach(e=>e.classList.toggle("active",e.dataset.match===n));updateNavPill()}function updateNavPill(animate){const nav=document.querySelector(".topnav .nav-links");if(!nav)return;if(nav.style.position!=="relative")nav.style.position="relative";let pill=nav.querySelector(".nav-pill");const active=nav.querySelector(".nav-link.active");if(!active){if(pill)pill.style.display="none";return;}if(!pill){pill=document.createElement("span");pill.className="nav-pill";pill.setAttribute("aria-hidden","true");nav.prepend(pill);}pill.style.display="";const left=active.offsetLeft,width=active.offsetWidth;if(!width)return;const snap=animate===false||!pill.dataset.ready;if(snap){pill.style.transition="none";pill.style.transform="translateX("+left+"px)";pill.style.width=width+"px";void pill.offsetWidth;pill.style.transition="";pill.dataset.ready="1";}else{pill.style.transform="translateX("+left+"px)";pill.style.width=width+"px";}if(!window.__navPillResize){window.__navPillResize=1;window.addEventListener("resize",()=>{updateNavPill(false);});}}var viewCleanup=[];
function runViewCleanup(){try{viewCleanup.forEach(function(fn){try{fn()}catch(e){}})}catch(e){}viewCleanup=[];}
function onViewCleanup(fn){try{viewCleanup.push(fn)}catch(e){}}



function route(){/* 2026-11-10 route-change dismiss: overlays opened by the previous route must not survive navigation — the teardown snapshot picker (#td-popout-layer, via tdDismissPopout) and the gate / progress-login modal (.progress-login-dialog veil). Runs FIRST, before the new view renders, so a modal/picker opened BY the new route itself (e.g. the 60ms gate timeout in views.lesson/views.quiz) is not dismissed. The gate close uses the veil's own _ffDismiss handle — its real close closure with a no-op callback — so the gate's onClose hash-reset never fires when the route already changed, and the Escape listener is removed (no stale listener). */try{tdDismissPopout()}catch(e){}try{document.querySelectorAll(".modal-veil:not([hidden])").forEach(function(v){if(!v.querySelector(".progress-login-dialog"))return;if(typeof v._ffDismiss==="function")v._ffDismiss();else try{closeModalVeil(v,!0)}catch(e){}})}catch(e){}if((location.hash||"").indexOf("#/playground")===0){location.hash="#/home";return;}if(currentUser&&cloudFailed&&Date.now()>=cloudRetryAt){cloudRetryAt=Date.now()+30000;try{switchProgressUser(null,currentUser.uid)}catch(e){}}try{if((location.hash||"#/home").indexOf("#/teardowns")!==0){tdReleaseOneFrame();}}catch(e){}try{if((location.hash||"#/home").indexOf("#/teardowns")===0&&typeof teardownState!=="undefined"&&teardownState){teardownState.app=null;teardownState.selected=null;}}catch(e){}runViewCleanup();window.__bookActive=0;const e=location.hash||"#/home",t=e.match(/^#\/(\w+)(?:\/(\d+))?/),n=t&&t[1]||"home",s=t&&t[2]?parseInt(t[2],10):null,a=$("#app");let o="",i=n,r=!1;views[n]?(o=s?views[n](s):views[n](),S.last={route:e}):(o=views.home(),i="home"),"playground"!==n&&"progress"!==n||(r=!0),document.body.classList.toggle("progress-page","progress"===n),document.body.classList.toggle("home-page","home"===n),document.body.classList.toggle("book-page",!!window.__bookActive),document.body.classList.toggle("lessons-page","lessons"===n),document.body.classList.toggle("quizzes-page","quizzes"===n),document.documentElement.classList.toggle("book-page",!!window.__bookActive),save(),a.innerHTML=`<div class="view${window.__lr===e?"":" view-anim ff-enter"}"><div class="wrap${r?" wide":""}">${o}</div></div>`,window.__lr=e,setActiveTab(i),updateRankUI(),updateAuthUI(),requestAnimationFrame(()=>requestAnimationFrame(()=>{$$(".pbar > i").forEach(e=>{e.style.width=e.dataset.w+"%"});const e=$("[data-count]");if(e){const t=+e.dataset.count,n=performance.now();!function s(a){const o=Math.min(1,(a-n)/900);e.textContent=Math.round(t*(1-Math.pow(1-o,3))),o<1&&requestAnimationFrame(s)}(n)}})),bindView(n,s),window.scrollTo({top:0}),setTimeout(function(){try{minTyping()}catch(e){}},100)}/* ===== Book lesson pages (integrated v4 design: continuous-flow DP pagination) ===== */
/* Lesson DETAIL view only. All other views are untouched. The book paginates the
   existing lesson HTML (html_en / html_hi) without editing any wording. */
var _book={num:0,lang:"en",pages:[],page:0,scale:1,blocks:[],lesson:null,meta:null,_cb:0,buildMs:0};
var _bookMeasurer=null;
var BOOK_MIN_SCALE=0.82;
function bookEl(id){return document.getElementById(id);}
function bookPartFromH2(text,fallback){var m=(text||"").match(/Part\s+(\d+)/);return m?parseInt(m[1],10):fallback;}
function bookParseBlocks(body){
  var tmp=document.createElement("div");tmp.innerHTML=body;
  var blocks=[],part=1,h2c=0;
  var kids=tmp.childNodes;
  for(var i=0;i<kids.length;i++){
    var el=kids[i];
    if(el.nodeType===3){if(el.textContent.trim())blocks.push({kind:"other",part:part,html:"<p>"+esc(el.textContent.trim())+"</p>"});continue;}
    if(el.nodeType!==1)continue;
    var tag=el.tagName.toLowerCase();
    var cls=(el.getAttribute("class")||"").split(/\s+/)[0]||"";
    if(tag==="h2"){h2c++;part=bookPartFromH2(el.textContent,h2c);blocks.push({kind:"h2",part:part,html:el.outerHTML});}
    else if(tag==="ul"){var items=[];for(var j=0;j<el.children.length;j++){if(el.children[j].tagName.toLowerCase()==="li")items.push(el.children[j].outerHTML);}blocks.push({kind:"ul",part:part,items:items});}
    else if(tag==="div"&&cls==="box")blocks.push({kind:"box",part:part,html:el.outerHTML});
    else if(tag==="div"&&cls==="fig")blocks.push({kind:"fig",part:part,html:el.outerHTML});
    else if(tag==="pre")blocks.push({kind:"pre",part:part,html:el.outerHTML});
    else if(tag==="p"&&cls==="promise")blocks.push({kind:"promise",part:part,html:el.outerHTML});
    else if(tag==="p"&&cls==="part-note")blocks.push({kind:"note",part:part,html:el.outerHTML});
    else blocks.push({kind:"other",part:part,html:el.outerHTML});
  }
  return blocks;
}
/* Colon safety net (content already carries colons) + pre -> site .codeblock markup
   (dots header + dart label + Copy button via the existing data-copy delegation). */
function bookEnhance(html){
  var t=document.createElement("div");t.innerHTML=html;
  var bs=t.querySelectorAll(".box > b:first-child");
  for(var i=0;i<bs.length;i++){var b=bs[i];if(!/:$/.test(b.textContent.trim()))b.textContent=b.textContent.trim()+":";var bx=b.closest(".box");if(bx&&!bx.classList.contains("warn")){var lb=b.textContent.trim();if(/^(Why|Kyon)/.test(lb))bx.classList.add("box-why");else if(/^(How|Kaise)/.test(lb))bx.classList.add("box-how");}}
  var pres=t.querySelectorAll("pre");
  for(var k=0;k<pres.length;k++){
    var pre=pres[k],raw=pre.textContent;
    _book._cb++;
    var id="bk"+_book.num+"_"+_book._cb;
    var w=document.createElement("div");w.className="codeblock";
    w.innerHTML='<div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span class="lang">dart</span><button class="copy-btn" data-copy="'+id+'">Copy</button></div>';
    var np=document.createElement("pre");np.id=id;
    var cd=document.createElement("code");cd.innerHTML=highlightDart(raw);
    np.appendChild(cd);w.appendChild(np);pre.replaceWith(w);
  }
  return t.innerHTML;
}
/* Hidden measurer: same class (hence same padding/typography) as the live sheet-inner,
   ids stripped so it never shadows the live Mark-complete button or code blocks. */
function bookMeasure(html){
  var si=bookEl("bookSheetInner");
  if(!_bookMeasurer){
    _bookMeasurer=document.createElement("div");
    _bookMeasurer.className="book-sheet-inner book-measurer";
    document.body.appendChild(_bookMeasurer);
  }
  _bookMeasurer.innerHTML=html;
  var ids=_bookMeasurer.querySelectorAll("[id]");
  for(var i=0;i<ids.length;i++)ids[i].removeAttribute("id");
  if(si)_bookMeasurer.style.width=si.clientWidth+"px";
  return _bookMeasurer.offsetHeight;
}
/* End-matter for the LAST page only: actions (PDF if present + Mark complete/Completed),
   today's quiz row card, today's pager. Built at render time so the done state is current. */
function bookEndMatter(){
  var t=_book.lesson,m=_book.meta,num=_book.num;
  if(!t)return"";
  var done=!!S.lessonsDone[t.id];
  var s=DATA.quizzes.find(function(e){return e.id===(t.quizId||(m&&m.quizId));});
  var passed=s?!!S.quizzesPassed[s.id]:false;
  var qc=s?(s.questions_en?s.questions_en.length:(s.questions?s.questions.length:10)):10;
  var prev=LESSON_META.find(function(l){return l.num===num-1;});
  var next=LESSON_META.find(function(l){return l.num===num+1;});
  var h='<div class="book-actions">';
  if(t.pdf)h+='<a class="btn btn-soft" href="'+esc(t.pdf)+'" download>Download PDF</a>';
  h+=done?'<button class="btn btn-accent" disabled>Completed</button>':'<button class="btn btn-accent" id="complete-lesson">Mark complete</button>';
  h+='</div>';
  h+='<div style="margin-top:18px"><a class="lesson-row'+(passed?" done":"")+'" href="#/quiz/'+num+'"><span class="quiz-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8M9 2v3m6-3v3"/><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/></svg></span><span class="t"><b>'+esc(s?s.title:("Quiz: "+t.title))+'</b><span>'+qc+' questions · pass at '+QUIZ_PASS+'%</span></span><span class="chev">›</span></a></div>';
  h+='<div class="pager">'+(prev?'<a href="#/lesson/'+prev.num+'"><span class="pager-label">← Previous</span><strong class="pager-title">'+esc(prev.title)+'</strong></a>':"<a></a>")+(next?'<a class="next" href="#/lesson/'+next.num+'"><span class="pager-label">Next →</span><strong class="pager-title">'+esc(next.title)+'</strong></a>':"<a></a>")+'</div>';
  return h;
}
/* Lesson cover page (design C — Big type): the first page of every lesson's book.
   Ghost lesson number behind a huge title (first part ink, second part blue),
   phase kicker, description, and a "turn the page" line at the bottom. The title
   and description are the lesson's English meta (same as the lessons list). */
var COVER_SPLIT={14:["Managing State","at Scale"],20:["Working with","JSON Data"],23:["Saving","Data Locally"],37:["","Ship It"]};
function bookCoverTitleParts(title,num){
  var o=COVER_SPLIT[num];if(o)return o;
  var ci=title.indexOf(":");
  if(ci>=0)return [title.slice(0,ci+1).trim(),title.slice(ci+1).trim()];
  var seps=[" & "," / "," + "],bi=-1,bl=0;
  seps.forEach(function(s){var i=title.lastIndexOf(s);if(i>bi){bi=i;bl=s.length;}});
  if(bi>=0)return [title.slice(0,bi+bl).trim(),title.slice(bi+bl).trim()];
  var w=title.split(/\s+/);
  if(w.length<=1)return ["",title];
  return [w.slice(0,-1).join(" "),w[w.length-1]];
}
function bookCoverHTML(){
  var m=_book.meta;if(!m)return"";
  var num=m.num,parts=bookCoverTitleParts(m.title,num);
  var ghost=String(num).padStart(2,"0");
  var ph=phaseNameFor(num);
  var phShort=ph.replace(/ & [^&]*$/, "");
  var foot=_book.lang==="hi"?"Page palto aur shuru karo →":"Turn the page to begin →";
  var titleHtml="";
  if(parts[0]&&parts[1])titleHtml=esc(parts[0])+" <em>"+esc(parts[1])+"</em>";
  else if(parts[1])titleHtml="<em>"+esc(parts[1])+"</em>";
  else titleHtml=esc(parts[0]||m.title);
  return '<div class="book-cover">'
    +'<div class="book-cover-ghost" aria-hidden="true">'+ghost+'</div>'
    +'<div class="book-cover-kicker"><span class="kicker-full">Lesson '+ghost+' · '+esc(ph)+'</span><span class="kicker-short">Lesson '+ghost+' · '+esc(phShort)+'</span></div>'
    +'<h1 class="book-cover-title">'+titleHtml+'</h1>'
    +'<p class="book-cover-desc">'+esc(m.description)+'</p>'
    +'<div class="book-cover-foot"><button type="button" class="btn btn-primary" onclick="bookNav(1)">'+foot+'</button></div>'
    +'</div>';
}
/* DP-optimal continuous flow: units = blocks with ul split per <li>; maximise the minimum
   fill over non-last pages (tie-break: fewer pages, then longer pages). Diagrams, code
   blocks and boxes move whole, never split; a page never ends on a part heading (no orphan
   headings); the last page is measured WITH its end-matter. */
function bookBuildFlow(){
  var t0=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();
  _book._cb=0;
  var blocks=_book.blocks;
  var enh=blocks.map(function(b){return b.kind==="ul"?null:bookEnhance(b.html);});
  var units=[];
  blocks.forEach(function(b,bi){
    if(b.kind==="ul"){b.items.forEach(function(li){units.push({bi:bi,kind:"li",part:b.part,html:li});});}
    else units.push({bi:bi,kind:b.kind,part:b.part,html:enh[bi]});
  });
  var area=bookEl("bookArea");
  var avail=area?area.clientHeight:600;
  _book.availUsed=avail;
  /* v4 behaviour: normal pages pack to avail (fill <=100%). A single unit taller
     than avail still gets its own page and scales down; the 0.82 floor is the
     safety net for units up to avail/0.82, taller singles breach it (reported). */
  var limit=avail;
  var last=units.length-1;
  var endWrap='<div class="book-endmatter">'+bookEndMatter()+'</div>';
  function contLabel(part){return '<p class="cont">Part '+part+' · '+(_book.lang==="hi"?"jaari":"continued")+'</p>';}
  function pageHTML(a,b,inc,showCont){
    var out="",open=false;
    if(showCont)out+=contLabel(units[a].part);
    for(var i=a;i<=b;i++){
      var u=units[i];
      if(u.kind==="li"){
        if(!open){out+="<ul>";open=true;}
        out+=u.html;
        if(i===b||units[i+1].kind!=="li"||units[i+1].bi!==u.bi){out+="</ul>";open=false;}
      }else{
        if(open){out+="</ul>";open=false;}
        out+=u.html;
      }
    }
    if(open)out+="</ul>";
    if(inc)out+=endWrap;
    return out;
  }
  function pageHeight(a,b,inc,showCont){return bookMeasure(pageHTML(a,b,inc,showCont));}
  var n=units.length;
  var hCache={};
  function H(a,b,inc,showCont){var k=a+"-"+b+"-"+(inc?1:0)+"-"+(showCont?1:0);if(hCache[k]===undefined)hCache[k]=pageHeight(a,b,inc,showCont);return hCache[k];}
  var dp=new Array(n+1),pagesArr=new Array(n+1),choice=new Array(n+1);
  dp[n]=Infinity;pagesArr[n]=0;choice[n]=-1;
  for(var pos=n-1;pos>=0;pos--){
    var showCont=(pos>0&&units[pos].kind!=="h2");
    var best=-1,bestEnd=-1,bestPages=Infinity;
    for(var end=pos;end<n;end++){
      var inc=(end===last);
      var h=H(pos,end,inc,showCont);
      if(h>limit&&end>pos)break;
      if(units[end].kind==="h2"&&end<last)continue;
      var rest=(end===last)?Infinity:dp[end+1];
      var score=Math.min(h/avail,rest);
      var pg=1+((end===last)?0:pagesArr[end+1]);
      if(score>best+1e-9||(Math.abs(score-best)<=1e-9&&(pg<bestPages||(pg===bestPages&&end>bestEnd)))){
        best=score;bestEnd=end;bestPages=pg;
      }
    }
    if(bestEnd<0){bestEnd=pos;best=H(pos,pos,false,showCont)/avail;bestPages=1+((pos===last)?0:pagesArr[pos+1]);}
    dp[pos]=best;pagesArr[pos]=bestPages;choice[pos]=bestEnd;
  }
  var pages=[],p=0;
  while(p<n){
    var e=choice[p];if(e<0)e=p;
    var inc=(e===last);
    var showCont=(p>0&&units[p].kind!=="h2");
    var h=H(p,e,inc,showCont);
    var segs=[];for(var i=p;i<=e;i++)segs.push(i);
    var headingParts=[];for(var j=p;j<=e;j++)if(units[j].kind==="h2")headingParts.push(units[j].part);
    pages.push({segs:segs,html:pageHTML(p,e,false,showCont),anchorPart:units[p].part,headingParts:headingParts,h:h,fill:(h/avail)*100});
    p=e+1;
  }
  /* Last-page split: the final page can only exceed avail via the single-unit
     exemption (one content unit + end-matter together). When that happens, move
     end-matter onto its own final page: both pages then scale better than one
     overstuffed page (a readability win worth one extra page). */
  var lp=pages[pages.length-1];
  if(lp&&lp.h>avail){
    var endH=bookMeasure(endWrap);
    lp.h=bookMeasure(lp.html);
    lp.fill=(lp.h/avail)*100;
    pages.push({segs:[],html:"",anchorPart:lp.anchorPart,headingParts:[],h:endH,fill:(endH/avail)*100,endOnly:true});
  }
  _book.pages=[{cover:true,segs:[],html:"",anchorPart:0,headingParts:[],h:0,fill:100}].concat(pages);
  var t1=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();
  _book.buildMs=t1-t0;
}
function bookFit(){
  var si=bookEl("bookSheetInner"),sw=bookEl("bookSheetWrap");if(!si||!sw)return 1;
  si.style.transform="";
  var avail=sw.clientHeight;
  var nat=si.scrollHeight;
  var s=Math.min(1,avail/Math.max(1,nat));
  si.style.transform="scale("+s+")";
  si.style.transformOrigin="top center";
  _book.scale=s;
  return s;
}
function bookSyncNav(){
  var total=_book.pages.length,cur=_book.page;
  var lb=bookEl("bookPageLabel");if(lb)lb.textContent="Page "+(cur+1)+" of "+total;
  var pf=bookEl("bookProgressFill");if(pf)pf.style.width=((cur+1)/total*100)+"%";
  var fp=bookEl("bookFootPrev"),fn=bookEl("bookFootNext");
  if(fp)fp.disabled=(cur===0);
  if(fn)fn.disabled=(cur===total-1);
  var dots=bookEl("bookDots");
  if(dots){
    var h="";
    for(var i=0;i<total;i++)h+='<button type="button" class="book-dot'+(i===cur?" on":"")+'" data-pg="'+i+'" aria-label="Go to page '+(i+1)+'"></button>';
    dots.innerHTML=h;
    var bs=dots.querySelectorAll(".book-dot");
    bs.forEach(function(b){b.onclick=function(){bookGoTo(parseInt(b.dataset.pg,10));};});
  }
}
function bookRender(){
  var si=bookEl("bookSheetInner");if(!si||!_book.pages.length)return;
  var pg=_book.pages[_book.page];
  si.innerHTML=pg.cover?bookCoverHTML():pg.html;
  if(_book.page===_book.pages.length-1){
    var w=document.createElement("div");w.className="book-endmatter";w.innerHTML=bookEndMatter();si.appendChild(w);
    var cb=si.querySelector("#complete-lesson");if(cb)wireCompleteLesson(cb,_book.num);
  }
  document.body.classList.toggle("book-cover-on",!!pg.cover);
  bookSyncNav();bookFit();
  saveBookPage(_book.num,_book.page);
}
var _bookFlip=false,_bookFoldRaf=0,_bookRestorePage=null;
function bookFlipEnd(){
  if(_bookFoldRaf){cancelAnimationFrame(_bookFoldRaf);_bookFoldRaf=0;}
  if(_bookRestorePage!==null){_book.page=_bookRestorePage;bookRender();_bookRestorePage=null;}
  var lf=document.querySelector(".book-leaf");if(lf)lf.remove();_bookFlip=false;
}
/* Real page-curl physics: the crease is the perpendicular bisector of the grab
   point G and the drag point D, so the fold is different for every grab point
   (corner = diagonal crease, middle edge = vertical crease). The paper wraps
   around a cylinder along the crease (radius R): the turned part is split into
   strips, each placed on the cylinder by its arc position, so the page bends
   instead of rotating flat. */
function bookClipHalf(poly,px,py,nx,ny,keepPos){
  var out=[];
  for(var i=0;i<poly.length;i++){
    var a=poly[i],b=poly[(i+1)%poly.length];
    var da=(a[0]-px)*nx+(a[1]-py)*ny,db=(b[0]-px)*nx+(b[1]-py)*ny;
    var ai=keepPos?da>=0:da<=0,bi=keepPos?db>=0:db<=0;
    if(ai)out.push(a);
    if(ai!==bi){var t=da/(da-db);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
  }
  return out;
}
function bookPoly(poly){return "polygon("+poly.map(function(p){return p[0].toFixed(1)+"px "+p[1].toFixed(1)+"px";}).join(",")+")";}
function bookFoldAnimate(setFold,fromD,toD,dur,done,easeFn){
  var t0=performance.now();
  var ease=easeFn||function(k){return k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;};
  function step(t){
    var k=Math.min(1,(t-t0)/dur);
    var e=ease(k);
    setFold({x:fromD.x+(toD.x-fromD.x)*e,y:fromD.y+(toD.y-fromD.y)*e});
    if(k<1){_bookFoldRaf=requestAnimationFrame(step);}else{_bookFoldRaf=0;if(done)done();}
  }
  _bookFoldRaf=requestAnimationFrame(step);
}
function bookMakeLeaf(dir,oldHTML,oldScale,oldH,W,H,G){
  var leaf=document.createElement("div");
  leaf.className="book-leaf"+(dir>0?" fwd":" back");
  leaf.style.height=oldH+"px";
  var rect=[[0,0],[W,0],[W,H],[0,H]];
  function pageCopy(){
    var inner=document.createElement("div");
    inner.className="book-sheet-inner";
    inner.style.transform="scale("+oldScale+")";
    inner.style.transformOrigin="top center";
    inner.innerHTML=oldHTML;
    return inner;
  }
  /* No shadows anywhere in the fold — the user asked for them gone. The turn
     reads from the motion and the foreshortening alone. */
  var main=document.createElement("div");main.className="book-leaf-main";main.appendChild(pageCopy());
  var wrap=document.createElement("div");wrap.className="book-leaf-wrap";
  var tip=document.createElement("div");tip.className="book-leaf-tip";tip.appendChild(pageCopy());
  wrap.appendChild(tip);
  leaf.appendChild(main);leaf.appendChild(wrap);
  var spineX=dir>0?0:W;
  var grabDist=Math.max(40,dir>0?G.x:(W-G.x));
  /* The bend line is VERTICAL and FIXED for the whole turn (computed once from
     the grab point, never from the moving finger). A diagonal bend line twists
     the page (top and bottom at different angles) and a bend line that slides
     with the finger tears the page apart along the fold — both are gone now.
     The grab sets where the bend sits: 20% of the page left of the grab point,
     clamped so the tip is always a sensible outer strip. */
  var bendX=dir>0?Math.max(0.55*W,Math.min(0.8*W,G.x-0.2*W)):Math.min(0.45*W,Math.max(0.2*W,G.x+0.2*W));
  var bendY=G.y;
  var npx=dir>0?1:-1,npy=0;
  var sG=(G.x-bendX)*npx;
  var keepTip=sG>=0;
  function setFold(D){
    var ratio=dir>0?D.x/grabDist:(W-D.x)/grabDist;
    ratio=Math.max(-1,Math.min(1,ratio));
    var th=Math.acos(ratio),deg=th*180/Math.PI;
    var rot=dir>0?-deg:deg,origin=spineX+"px center";
    main.style.transformOrigin=origin;main.style.transform="rotateY("+rot+"deg)";
    wrap.style.transformOrigin=origin;wrap.style.transform="rotateY("+rot+"deg)";
    var mainPoly=bookClipHalf(rect,bendX,bendY,npx,npy,!keepTip);
    var tipPoly=bookClipHalf(rect,bendX,bendY,npx,npy,keepTip);
    main.style.clipPath=mainPoly.length>=3?bookPoly(mainPoly):"polygon(0 0,0 0,0 0)";
    tip.style.clipPath=tipPoly.length>=3?bookPoly(tipPoly):"polygon(0 0,0 0,0 0)";
    /* Gentle bend only (8deg): a stiff sheet, not a creased fold. The bend is
       a pure extra turn around the same vertical axis as the spine, so the
       page never twists or shears. */
    var psi=8*Math.PI/180*Math.sin(th);
    tip.style.transformOrigin=bendX.toFixed(1)+"px "+bendY.toFixed(1)+"px";
    tip.style.transform="rotateY("+(-psi*180/Math.PI).toFixed(1)+"deg)";
    /* clip-path + backface-visibility:hidden hides the sheet in Chrome, so the
       past-vertical hide is done here instead: the sheet is edge-on at 90deg,
       so the switch is invisible. */
    main.style.visibility=th>Math.PI/2?"hidden":"visible";
    tip.style.visibility=(th+psi)>Math.PI/2?"hidden":"visible";
  }
  setFold(G);
  return {leaf:leaf,setFold:setFold};
}
function bookGoTo(j){
  if(j===_book.page||j<0||j>=_book.pages.length)return;
  if(_bookFlip)bookFlipEnd();
  var si=bookEl("bookSheetInner"),sw=bookEl("bookSheetWrap");
  if(!si||!sw)return;
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){_book.page=j;bookRender();return;}
  var dir=j>_book.page?1:-1;
  /* The Mark-complete id is stripped from the leaf copy so it never shadows
     the live button. */
  var oldHTML=si.innerHTML.replace('id="complete-lesson"','');
  var oldScale=_book.scale||1,oldH=sw.clientHeight;
  var W=sw.clientWidth,H=sw.clientHeight;
  /* Click turns grab the bottom corner, like a real page turn. */
  var G=dir>0?{x:W-8,y:H-8}:{x:8,y:H-8};
  var toD=dir>0?{x:-G.x,y:H*0.5}:{x:W+(W-G.x),y:H*0.5};
  _bookFlip=true;_book.page=j;bookRender();
  var made=bookMakeLeaf(dir,oldHTML,oldScale,oldH,W,H,G);
  sw.appendChild(made.leaf);
  bookFoldAnimate(made.setFold,G,toD,650,function(){made.leaf.remove();_bookFlip=false;},function(k){return k*k;});
}
function bookNav(d){bookGoTo(_book.page+d);}
/* Real page turn: drag the page itself. A small drag lifts the page and shows a
   glimpse of the next page underneath; let go and it springs back, drag far (or
   flick) and the turn completes. Vertical drags stay a page scroll. */
var _bookDrag=null;
function bookDragStart(e){
  if(_bookFlip||_bookDrag)return;
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  /* Desktop: no swipe. A mouse drag is how you select text — turning the page
     on it would fight text selection. Touch (and pen) keep the swipe. */
  if(e.pointerType==="mouse")return;
  if(e.target&&e.target.closest&&e.target.closest("a,button,input,textarea,select"))return;
  if(e.button!==undefined&&e.button!==0)return;
  var sw=bookEl("bookSheetWrap");
  _bookDrag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastT:Date.now(),vel:0,started:false,dir:0,fromPage:_book.page,toPage:-1,leaf:null,setFold:null,p:0,D:null,G:null,rect:sw?sw.getBoundingClientRect():null,W:sw?sw.clientWidth:0,sw:sw};
}
function bookDragMove(e){
  var d=_bookDrag;if(!d||e.pointerId!==d.pointerId)return;
  var dx=e.clientX-d.startX,dy=e.clientY-d.startY,now=Date.now();
  var dt=Math.max(1,now-d.lastT);d.vel=(e.clientX-d.lastX)/dt;d.lastX=e.clientX;d.lastT=now;
  if(!d.started){
    if(Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx)){_bookDrag=null;return;}
    if(Math.abs(dx)<10)return;
    var dir=dx<0?1:-1,toPage=d.fromPage+dir;
    var si=bookEl("bookSheetInner"),sw=d.sw;if(!si||!sw||!d.rect){_bookDrag=null;return;}
    /* G is the exact point the finger grabbed on the page — it sets the fold.
       Never start a turn from a grab near the spine (the joint): a real page
       cannot turn from its binding, and here a tiny drag there whips the page
       around so violently it looks torn. The grab must be on the free edge. */
    var G={x:d.startX-d.rect.left,y:d.startY-d.rect.top};
    if(dir>0&&G.x<0.6*d.W){_bookDrag=null;return;}
    if(dir<0&&G.x>0.4*d.W){_bookDrag=null;return;}
    var oldHTML=si.innerHTML.replace('id="complete-lesson"','');
    var oldScale=_book.scale||1,oldH=sw.clientHeight;
    if(toPage>=0&&toPage<_book.pages.length){_book.page=toPage;bookRender();}
    var made=bookMakeLeaf(dir,oldHTML,oldScale,oldH,d.W,sw.clientHeight,G);
    d.leaf=made.leaf;d.setFold=made.setFold;d.G=G;d.dir=dir;d.toPage=(toPage>=0&&toPage<_book.pages.length)?toPage:-1;d.started=true;_bookFlip=true;
    sw.appendChild(d.leaf);
    try{sw.setPointerCapture(e.pointerId);}catch(err){}
    document.body.style.userSelect="none";sw.classList.add("book-dragging");
  }
  var D={x:e.clientX-d.rect.left,y:e.clientY-d.rect.top};
  if(d.toPage<0){D={x:d.G.x+(D.x-d.G.x)*0.35,y:d.G.y+(D.y-d.G.y)*0.35};}
  d.D=D;
  d.p=Math.min(1,Math.abs(D.x-d.G.x)/Math.max(1,d.W));
  bookDragApply(d,D);
}
function bookDragApply(d,D){
  if(!d.setFold)return;
  d.setFold(D);
}
function bookDragEnd(e){
  var d=_bookDrag;if(!d||(e.pointerId!==undefined&&e.pointerId!==d.pointerId))return;
  _bookDrag=null;
  if(!d.started||!d.leaf||!d.D)return;
  var complete=d.toPage>=0&&(d.p>=0.3||(Math.abs(d.vel)>0.6&&d.p>=0.08));
  var leaf=d.leaf,sw=d.sw,fromPage=d.fromPage,toPage=d.toPage,dir=d.dir;
  if(!complete&&toPage>=0)_bookRestorePage=fromPage;
  document.body.style.userSelect="";if(sw)sw.classList.remove("book-dragging");
  var toD=complete?{x:dir>0?-d.G.x:d.W+(d.W-d.G.x),y:d.D.y}:{x:d.G.x,y:d.G.y};
  /* The release lands softly (ease-out): the page decelerates as it settles
     instead of stopping dead. */
  bookFoldAnimate(d.setFold,d.D,toD,350,function(){
    leaf.remove();
    if(_bookRestorePage!==null){_book.page=_bookRestorePage;bookRender();_bookRestorePage=null;}
    _bookFlip=false;
  },function(k){return 1-Math.pow(1-k,3);});
}
/* Language switch: repaginate in place and land on the page containing the same part's
   heading if possible, else clamp (v4 behaviour). Preference storage unchanged (setLang). */
function bookLang(l){
  if(!_book.lesson)return;
  var pg0=_book.pages.length?_book.pages[_book.page]:null;
  var anchorPart=pg0?(pg0.headingParts.length?pg0.headingParts[0]:pg0.anchorPart):1;
  setLang(l);
  var tg=document.getElementById("bookLangToggle");
  if(tg){tg.dataset.lang=l;var bs=tg.querySelectorAll(".lesson-lang-btn");bs.forEach(function(b){b.classList.toggle("on",b.dataset.lang===l);});}
  _book.lang=l;
  var t=_book.lesson;
  var body=(l==="hi"&&t.html_hi)?t.html_hi:(t.html_en||t.html_hi);
  if(!body)return;
  _book.blocks=bookParseBlocks(body);
  bookStabilize(function(){_book.page=bookLangTarget(anchorPart);});
}
function bookInit(num){
  var t=lessonFull(num);if(!t)return;
  var lang=getLang();
  var body=(lang==="hi"&&t.html_hi)?t.html_hi:(t.html_en||t.html_hi);
  if(!body)return;
  _book.num=num;_book.lesson=t;_book.meta=LESSON_META.find(function(l){return l.num===num;});
  _book.lang=lang;
  _book.blocks=bookParseBlocks(body);
  _book.page=readBookPage(num);
  bookStabilize(null);
  var fp=bookEl("bookFootPrev"),fn=bookEl("bookFootNext");
  if(fp)fp.onclick=function(){bookNav(-1);};
  if(fn)fn.onclick=function(){bookNav(1);};
  var sw=bookEl("bookSheetWrap");
  if(sw&&!sw.dataset.pagedrag){
    sw.dataset.pagedrag="1";
    sw.addEventListener("pointerdown",bookDragStart);
    sw.addEventListener("pointermove",bookDragMove);
    sw.addEventListener("pointerup",bookDragEnd);
    sw.addEventListener("pointercancel",bookDragEnd);
  }
  onViewCleanup(function(){if(_bookMeasurer){_bookMeasurer.remove();_bookMeasurer=null;}document.body.classList.remove("book-cover-on");});
}
function bookCurrentAnchorSeg(){
  var pg=_book.pages[_book.page];if(pg&&pg.cover)return -1;return pg&&pg.segs.length?pg.segs[0]:0;
}
function bookRestoreAnchor(seg){
  if(seg===-1)return 0;
  for(var i=0;i<_book.pages.length;i++){if(_book.pages[i].segs.indexOf(seg)>=0)return i;}
  return Math.min(_book.page,_book.pages.length-1);
}
function bookStabilize(setPage){
  var t0=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();
  for(var k=0;k<3;k++){
    bookBuildFlow();
    if(setPage)setPage();
    if(_book.page>=_book.pages.length)_book.page=_book.pages.length-1;
    if(_book.page<0)_book.page=0;
    bookRender();
    var ba=bookEl("bookArea");
    if(!ba||ba.clientHeight===_book.availUsed)break;
  }
  var t1=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();
  _book.stabilizeMs=t1-t0;
}
function bookRepack(){
  var anchor=bookCurrentAnchorSeg();
  bookStabilize(function(){_book.page=bookRestoreAnchor(anchor);});
}
function bookLangTarget(anchorPart){
  for(var i=0;i<_book.pages.length;i++){if(_book.pages[i].headingParts.indexOf(anchorPart)>=0)return i;}
  var maxPart=0;
  _book.pages.forEach(function(p){p.headingParts.forEach(function(hp){if(hp>maxPart)maxPart=hp;});});
  return (anchorPart>maxPart)?_book.pages.length-1:Math.min(_book.page,_book.pages.length-1);
}
if(!window.__bookGlobal){
  window.__bookGlobal=1;
  document.addEventListener("keydown",function(e){
    if(!document.getElementById("bookSheetInner"))return;
    var tg=e.target;
    if(tg&&(tg.tagName==="INPUT"||tg.tagName==="TEXTAREA"||tg.tagName==="SELECT"||tg.isContentEditable))return;
    if(e.key==="ArrowRight")bookNav(1);
    else if(e.key==="ArrowLeft")bookNav(-1);
  });
  var _bookRT=null;
  window.addEventListener("resize",function(){clearTimeout(_bookRT);_bookRT=setTimeout(function(){if(document.getElementById("bookSheetInner"))bookRepack();},150);});
  window.addEventListener("orientationchange",function(){setTimeout(function(){if(document.getElementById("bookSheetInner"))bookRepack();},150);});
}
/* Real Mark-complete flow, extracted verbatim from bindView so the book's last-page
   button behaves exactly like today's lesson-view button (guest -> login prompt only;
   logged-in but cloud not ready -> toast, nothing recorded; else record + rank bump). */
function wireCompleteLesson(btn,num){
  btn.onclick=()=>{
    const e=()=>{
      const e=LESSON_META.find(l=>l.num===num);
      if(!S.lessonsDone[e.id]){
        const t=rankIndexFor(doneCount());
        S.lessonsDone[e.id]=!0,bumpRank(t);
        if(rankIndexFor(doneCount())===t)showToast("Progress saved ✓");
      }
    };
    if(currentUser){
      if(cloudReadyUid!==currentUser.uid)return void showToast(cloudFailed?"Couldn't load your progress. Check your connection and try again.":"Syncing your progress, try again in a moment.");
      return void e();
    }
    const n=document.createElement("div");
    n.className="modal-veil",n.innerHTML='<div class="modal logout-dialog progress-login-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-login-title" aria-describedby="progress-login-message">\n      <h2 id="progress-login-title">Log in to save progress</h2>\n      <p id="progress-login-message">Log in to save your progress. Progress is saved to your account on the server — without login, it can\'t be saved.</p>\n      <button class=\"modal-close\" type=\"button\" data-progress-close aria-label=\"Close\">×</button>\n      <div class="logout-actions">\n        <button class=\"btn btn-soft\" type=\"button\" data-progress-close>Not now</button>\n        <button class="btn btn-accent" type="button" data-progress-login>Log in</button>\n        \n      </div>\n    </div>',document.body.appendChild(n);
    const s=e=>{document.removeEventListener("keydown",a),closeModalVeil(n,!0),e&&setTimeout(e,180)},
    a=e=>{"Escape"===e.key&&s()};
    n._ffDismiss=function(){s(function(){})};/* route-change dismiss handle (same as showProgressLoginPrompt): own close closure, no-op callback */
    n.addEventListener("click",e=>{e.target===n&&s()}),
    n.querySelector("[data-progress-login]").onclick=()=>s(()=>{location.hash="#/profile"}),
    n.querySelectorAll("[data-progress-close]").forEach(b=>b.onclick=()=>s()),
    document.addEventListener("keydown",a),
    requestAnimationFrame(()=>{n.classList.add("show"),syncModalScrollLock(),n.querySelector("[data-progress-login]").focus()});
  };
}

function bindView(e,t){if("lessons"===e||"quizzes"===e){requestAnimationFrame(layoutPathSpine);}if("lesson"===e){const r=$("#lesson-retry");r&&(r.onclick=()=>{delete _lessonFailed[t];ensureLesson(t);route();});$$(".article pre").forEach(p=>{if(p.closest(".codeblock"))return;const c=p.querySelector("code");if(!c)return;const id="cb"+Math.random().toString(36).slice(2,8),w=document.createElement("div");w.className="codeblock";w.innerHTML='<div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span class="lang">dart</span><button class="copy-btn" data-copy="'+id+'">Copy</button></div>';const n=document.createElement("pre");n.id=id;const d=document.createElement("code");d.innerHTML=highlightDart(c.textContent);n.appendChild(d);w.appendChild(n);p.replaceWith(w);});if(document.getElementById("bookSheetInner"))bookInit(t);}if("home"===e&&void 0,"progress"===e){const e=$("#ranks-help");e&&(e.onclick=showAllRanks)}if("profile"===e){$$("[data-auth-mode]").forEach(e=>{e.onclick=()=>{const t="register"===e.dataset.authMode?"register":"login";if(t===authMode||authSwitching)return;authSwitching=!0;const n="register"===t?1:-1,s=$(".auth-card"),a=$(".auth-tabs"),o=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;a&&(a.dataset.mode=t,$$("[data-auth-mode]").forEach(e=>{const n=e.dataset.authMode===t;e.classList.toggle("active",n),e.setAttribute("aria-selected",n?"true":"false")})),s&&!o&&s.classList.add(n>0?"auth-leave-left":"auth-leave-right"),window.setTimeout(()=>{authMode=t,authSlideDirection=o?0:n,authSwitching=!1,render()},o?0:190)}});const e=$("#auth-form");e&&(e.onsubmit=t=>{t.preventDefault(),handleAuthSubmit(e)});const g=$("#auth-google");g&&(g.onclick=()=>handleGoogleSignIn());const f=$("#auth-forgot");f&&(f.onclick=()=>showResetView());const r=$("#auth-reset-form");r&&(r.onsubmit=t=>{t.preventDefault(),handleResetSubmit(r)});$$("[data-auth-back-login]").forEach(e=>{e.onclick=()=>backToLogin()});$$("[data-auth-logout]").forEach(e=>{e.onclick=showLogoutConfirm})}const n=$("#complete-lesson");n&&wireCompleteLesson(n,t),$$("[data-q]").forEach(e=>e.onclick=()=>{const[t,n,s]=e.dataset.q.split(":"),a=quizState[t]||(quizState[t]={answers:{},done:!1,score:0,current:0});if(a.done)return;a.answers[+n]=+s;const qz=DATA.quizzes.find(x=>x.id===t),qq=qz?quizQuestions(qz)[+n]:null;$$(`[data-q^="${t}:${n}:"]`).forEach(t=>{const n=t===e;const idx=+t.dataset.q.split(":")[2];t.classList.toggle("sel",n),t.setAttribute("aria-pressed",n?"true":"false");if(qq){t.classList.toggle("correct",idx===qq.answer);t.classList.toggle("wrong",n&&idx!==qq.answer);}t.disabled=true;});if(qq){let w=document.getElementById("quiz-why");if(!w){w=document.createElement("div");w.className="quiz-why";w.id="quiz-why";const qc=document.querySelector(".quiz-q");if(qc)qc.appendChild(w);}w.classList.toggle("why-right",+s===qq.answer);w.classList.toggle("why-wrong",+s!==qq.answer);w.innerHTML="<b>Why:</b> "+esc(qq.explanation);w.hidden=false;}const o=$("#quiz-next");o&&(o.disabled=!1)}),"progress"===e&&$$(".qh-pdf").forEach(e=>e.onclick=t=>{t.preventDefault(),t.stopPropagation(),downloadQuizPdf(e.dataset.q,((S.quizHistory||{})[e.dataset.q]||[])[+e.dataset.ai])});const s=$("#quiz-back");s&&(s.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id];n.current=Math.max(0,n.current-1),renderQuizStep(t)});const a=$("#quiz-next");a&&(a.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id],eq=quizQuestions(e);if(null==n.answers[n.current])return;if(n.current<eq.length-1)return n.current++,void renderQuizStep(t);if(!currentUser){let s=0;eq.forEach((e,t)=>{n.answers[t]===e.answer&&s++}),n.score=s,n.done=!0;return void renderQuizResult(t);}if(cloudReadyUid!==currentUser.uid)return void showToast(cloudFailed?"Couldn't load your progress. Check your connection and try again.":"Syncing your progress, try again in a moment.");let s=0;eq.forEach((e,t)=>{n.answers[t]===e.answer&&s++}),n.score=s,n.done=!0;const a=Math.round(s/eq.length*100);S.quizHistory=S.quizHistory||{};const o=S.quizHistory[e.id]||(S.quizHistory[e.id]=[]);if(o.unshift({score:s,total:eq.length,pct:a,answers:Object.assign({},n.answers),at:Date.now()}),o.length>5&&(o.length=5),a>=QUIZ_PASS&&!S.quizzesPassed[e.id]){const t=rankIndexFor(doneCount());S.quizzesPassed[e.id]=!0,bumpRank(t)}else save();renderQuizResult(t)});const o=$("#quiz-retry");o&&(o.onclick=()=>{const e=DATA.quizzes[t-1];quizState[e.id]={answers:{},done:!1,score:0,current:0},renderQuizStep(t)});const i=$("#quiz-pdf");i&&(i.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id],s=quizQuestions(e).length;downloadQuizPdf(e.id,{score:n.score,total:s,pct:Math.round(n.score/s*100),answers:Object.assign({},n.answers),at:Date.now()})});const _qlt=$("#quiz-lang-toggle");_qlt&&(_qlt.onclick=()=>{const _nxt=quizLang()==="hi"?"en":"hi";if(typeof setLang==="function"){try{setLang(_nxt);}catch(_err){}}else{window.__ffQuizLang=_nxt;}if($("#quiz-retry"))renderQuizResult(t);else renderQuizStep(t);});}function openQuizPrompt(num){const q=DATA.quizzes[num-1];if(!q)return;const meta=LESSON_META.find(l=>l.id===q.lessonId);const st=quizState[q.id];const answered=st?Object.keys(st.answers||{}).length:0;const done=!!(st&&st.done);const total=quizQuestions(q).length;let btnLabel="Start quiz",note=total+" questions · Pass mark "+QUIZ_PASS+"%";if(done){btnLabel="Retake quiz";note="Passed · Score "+st.score+"/"+total;}else if(answered>0){btnLabel="Resume quiz";note="Question "+(Math.min(st.current,total-1)+1)+" of "+total+" · "+answered+" answered";}else if(S.quizzesPassed&&S.quizzesPassed[q.id]){btnLabel="Retake quiz";const h=(S.quizHistory||{})[q.id]||[];let b=null;h.forEach(e=>{if(e&&null!=e.score&&(!b||e.score>b.score))b=e;});note="Passed"+(b?" · Score "+b.score+"/"+total:"");}const veil=document.createElement("div");veil.className="modal-veil";veil.innerHTML='<div class="modal logout-dialog" role="dialog" aria-modal="true" aria-labelledby="quiz-start-title"><h2 id="quiz-start-title">'+esc(q.title.replace(/^Quiz:\s*/,""))+'</h2>'+(meta?'<p>Lesson '+meta.num+' · '+esc(meta.title)+'</p>':'')+'<p>'+note+'</p><div class="logout-actions"><button class="btn btn-accent" type="button" data-quiz-start>'+btnLabel+'</button><button class="btn logout-cancel" type="button" data-quiz-cancel>Cancel</button></div></div>';document.body.appendChild(veil);const close=()=>closeModalVeil(veil,!0);const startBtn=veil.querySelector("[data-quiz-start]");veil.querySelector("[data-quiz-cancel]").onclick=close;startBtn.onclick=()=>{close();setTimeout(()=>{if(done){quizState[q.id]={answers:{},done:!1,score:0,current:0};}location.hash="#/quiz/"+num;},180);};veil.addEventListener("click",e=>{if(e.target===veil)close();});const escHandler=e=>{if("Escape"===e.key){document.removeEventListener("keydown",escHandler);close();}};document.addEventListener("keydown",escHandler);requestAnimationFrame(()=>{veil.classList.add("show");syncModalScrollLock();startBtn.focus();});}
document.addEventListener("click",e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const t=e.target.closest&&e.target.closest('a[href^="#/quiz/"]');if(!t)return;const n=parseInt(t.getAttribute("href").split("/")[2],10);if(!n||!DATA.quizzes[n-1])return;e.preventDefault();openQuizPrompt(n);});
function renderQuizScreen(e,t){$("#app").innerHTML=`<div class="view"><div class="wrap">${views.quiz(e,t)}</div></div>`,bindView("quiz",e),window.scrollTo({top:0,behavior:"smooth"})}function renderQuizStep(e){renderQuizScreen(e,!1)}function renderQuizResult(e){renderQuizScreen(e,!0)}function render(){route()}function applyTheme(){"dark"!==S.theme&&"light"!==S.theme&&(S.theme="light");const e="dark"===S.theme;document.documentElement.dataset.theme=e?"dark":"light";const t=e?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';$$(".theme-btn").forEach(e=>{const n=e.querySelector(".ti");n?n.innerHTML=t:e.innerHTML=t})}function cycleTheme(e){const t="dark"===S.theme?"light":"dark",root=document.documentElement;if(root.classList.contains("theme-anim"))return;const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduced){S.theme=t;save();applyTheme();return}let n=e&&e.currentTarget;if(!n||!n.getBoundingClientRect||0===n.getBoundingClientRect().width){n=null;const btns=document.querySelectorAll(".theme-btn");for(const b of btns){if(b.getBoundingClientRect().width>0){n=b;break}}}const apply=()=>{S.theme=t;save();applyTheme()};if(n){n.classList.remove("ff-wob");void n.offsetWidth;n.classList.add("ff-wob")}if(!n){apply();return}const r=n.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.ceil(Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)))+2,clear=()=>root.classList.remove("theme-anim");if(!document.startViewTransition){apply();return}
root.style.setProperty("--theme-x",x+"px");
root.style.setProperty("--theme-y",y+"px");
root.style.setProperty("--theme-r",rad+"px");
root.classList.add("theme-anim");
const tr=document.startViewTransition(apply);
tr.finished.then(clear,clear);
setTimeout(clear,700);}function initPopupScrollLock(){new MutationObserver(syncModalScrollLock).observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden"]}),syncModalScrollLock()}function shell(){const e='<img class="brand-logo brand-logo-light" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAADBCAYAAACHSY8RAAAjOklEQVR42u2de3ydVZnvf8+z1t5Jk95ALJWmTVLaJg2tyIQ2LeC8gigoIt520aN+8MLlnJmPijpHPAik4SJezuBnjqMzgzLqKB7pRkadI4OXAluhTZGqgxCSUtqmFCsVKW2SNnvvdz3P+eN906Zt2lL67p29w/p9Plv8pG323u9a3/V7nmfdAC8vLy8vLy8vrwoVVf3nz2QY2TYFumT0HzQ2BrWpqXtP0kJqnlD4VwQ+UUnqVXEWFACBoFAizALxLKjqoc9DHbM1YRi+tX/Duv9EJmOQzTrfbbxslX5uRiZDyGbdSEees/icE7gYvpZIz1FFBzDc5or8KmKZzmRjyhgK3Y8HAYDGzFT9IOLlwXlJwKDx9GA6DxffCKMfRTFcQmxOYiIoABUZgUJVQ8E+PyEaw3U9NF4TFJwgsMjlQmSzmLNgabNh/gTyhUvZ8EyAoCRQcRKqCgEEItoPBRmPhtcrDRwGIMjlwsaWjiYmuhqEjzDbKSoOIqFAoSBiAEzRf728St4pK9lmLAABYBpbl13NzI+ysZ+AYooLi6GqKkAMIuPDLS/vOADiClbYOH/J69jaf2Q2Z6s4uLAYEpEhIuubz8s7zqhkPQgCi2zWNbcuu9xY+zATn+3CsKiqGgPj3cXLg3MwOLlcLmxq7biGjf2GqtaJCx0RUh4YLx+qjQFMNJkJNLU+c4dh8xFxoQMwksN4eXnHGRuarGtueeZOa9MfEReGAHzS7+XBObwCg2zWzW3t+Cxbe2lYLBThk38vD84RkAkCC+TCxpaOD5NJ3yquGMb5jJeXB2dsdXIulwvnti5fZNh8VVzRAT6f8fLgHDmvQRcBGaOq3yCiesAvtvTy4BxZmQwDcI2t/Z8x1i4TCUPvNl7VIjtuwGaz0jB/2SwGrnPOSRmhEURrdZSO7m4O0TYd9V3Fa9wdJwgCBqBp1k+zsXUa7QEocYimDoASMbOxxtiUZWPNkV8mzTZl2BcrvA7NM8blPbWhbdmJKaf9YKqPUptSfRYVAGC2rNH+nC1Q/EahW0mlW9iEh/+gTg3SJMPFtZs3r3tu5LP7buNV/lAtCAxyudA6/QDb1GQJi2Gp5mxUNWRjLaAQcauZ8b8L05Db1t299+X+St9lvMbTcdDUsrSP2c6Pw7QShIzq2KSMiHtYBTdt6Vv7s1GVCRMEOyj3Un9VLuc8NF7jBk4mkzHZbNbNXdDxFlhzrzgnJdp4JsyGVeUrJ9QVrlm/fn0xgjNDQFY8BF5VFapld+yIjsdgegcTg+CSd5s4PHMiN2zpXXtTVDxbYYCsA7K+xb0SUTmrahSFPO0pAOeoCJC026g6tikrLvzOlt61N7W3t6ciU/VHOnlVLTidBEAb5/NpRNSmKprw+wsxs3PhNrc39clMJmPWr1/vcxOv6gYnCB5kAGCDM4kNVDVZF1BVYkMguXbr1od2xmGh+Cb2qmpwcjNmKAAouD35qoQKGWPEhU/W0eBdADiuhHl5VXmo1tamAIiU5iYdPalConRJvtvT01MYWZngm9erdAl7+d5H5827sCa0O59m4lmqmlxFTVWJCRCcvqmv+w+Ido56x/GaCMUBIJ2eoskvmFQhNiSqT7vhmqdiSH1u4zURwMkwAAzLtgUEOjlanJzYe2t02i129vfnhkd+5pvWa8I4jjipJ6KSrDQmpZ1lDj+9PDhlSnSIEw+hNDo3GgB+B+zbsuDlNXHAKaWU4E/F8fLgHLOb+bzGy4Pj5eXB8fLy4Hh5eXlwvLw8OF5eHhwvLw+Ol5cHx8vLg+MfgZfXscsvU/Eqg5QQrDTAGwA8COS6qv4sCA+OVxlEihxCoOtAmKr4MHsPjldpnQak+Ni9Nbxjx8fUpmanh/78VP5HV38dIEFnJ6Orqyo3Hfocx6t06lxJjcFltfzHLf+B2slfJujHi1Nf89Wad9720Pz5p89CV5cgkzEeHC+vEWUyBl1d8sKkWa+jdN2bsGdnEcU9IfbuKhbrX7N8W+v7fjm/4fRZyGZdNcLjwfEqjXa0EQDU7H52MUEl2t9OFkQp5AfC4WlzWp85432rZ5/13lOqER4PjleJ6wLkDulnRJbyg2F+emPLn1/dfn9LyxkRPOhkD46X174CwZhAWRoeCAuTT2nZOn/F/Q2nXzQLWKnV4jweHK/xdCOLwp5ifnpTy/b5F90FkCKbdeisfOfx4HiNMzxIIb/bSc3Us1Pv+tovT1z6/oZqqLZ5cLwqAB42VBxyrv7ENw7MXv7LefMWN1R6wcCD41UpXdFgeLDoaqe3PLvw/atPOfPS2ZUMjwfHq7LCtsKeMD9tzoLnms/78atazppSqTmPB8er8goG+cFQ05PP2PXaD905ZckHX4WulVpp8HhwvCoTnuKQk5rJF++ds2zNq9veUI+uLq2keR4Pjlel0mOQHyrKpOkL/rLoA/8WX4WJSnEeD45Xhec8QyHSk99Jl85ZhU6gUsI2D45XpdNjkR8sUrr+3fTk7CwyK1Po6pLxhseD41UdzjO8O6R03btScvKv58xZfMJ4T5J6cLyqp2CQHyq6SdOXbl/6N6uaF5138niWqj04XtXlPPnB0NVOO/9Pcy94qGnh8sbxCts8OF5V6DyD4fDU2fO2t7z7P+a2nz9tPAoGHhyvqoSH8oNhcfJrFvfPfc+9yGS53DlPecFR9fdzeiWZ84RaM/Us5oG7G9refGI517aV9/JcpaJvca9k4RlwSE16x/Pzzu9ubOloiuBZZSYUOGwxK77oNvHztFR92FmJ2nVyO8SkQaU6f5DYID8Y5qc2zN/R8q5ftjSe3oTsipI7T1k6WxDsiGgRbSMiqGriZ2kRYY/vppUnR7b0hw4SWSoMhvkps07d9FcfWT3tgk+U3HnKAk4uNyN+ePpaqIIAShAYgiqY5FEAyM2Y4S/RrSCd+Nw6y64QtXpp6bEo7AnD+lfP3TtpzuqTOy4rqfOUAxwCstLe/rY6MP5aVQAiTnK4UZVQHT8PAGhr8+BUkuNw7YtRH5DSF4bialtYf/Lc5+csvx+X/FPJnKcM4GQYgO4c+MtyZjs7DtOSeogKIhaRvEVNHwBEy8+9xl0PdjkA2Nlw8S8kDHcTpQiqZQnbUBhyUjO1OWXC+xtbgpI4T7kSahJyn6aRND7BkgARAaDNIpMGYiA9OJUggiKzyuD7b9tpC7tvpHQtgzgsS/sQG8oPOFc7rfnZRSvuR+b/NCftPKUGh4Gsm7P4nGYic76IE4BMcthAiBik9PDGjfflgyAwvsdWkLIrHDKrTOHHn/572bv786ipTwFw5YIHxb3O1U5vNjRp9ZzXvqkZ2RUOQWCrAJyAAcAUw68wcypZtxkpDAAKvf/AIoRXpcGjd1/1Oc0P3YKayTaCpwxNRWyoMOjU1jbvmHvh6pqLbp2LXC5MwnlKB04QWCAXNrZ0fIiNfbtI6JJ0GwBKxCyu+EK4B7+MW0l8T61IeATBA1ZXXX6d5gduQXqyBSgsT8jIBuEel6+f2VysP2n1jMUXzR2BufLACQKLXC5sbl6ygIlvE+cc4pnPBLlxxIYArN62rfsFIGN8flOxUuTOdRE8V16nxcGbI3hQHngQOQ9sTdPO+ResxrvuOG54Egenvb09hVwunLuwYz5q7WoiOiEuRXLSQ4mKEyh/2ffLKoPnriuu1/wB8JQt5wnrTmqypnj/jDPfNfd4cp4EXSBjkAGQzbrm1iULQHY1ETWocw5EySbtqo6NNSLuJ5t7uy+J3CbrfN8cF9FRgTn47wedBrmukFZ880aqqb8e+cEQ5bodUMUhNclwYbDfCM7L3/M3m5BZZZBdcUz953g7NAdBYPr7PwTg64KeHp3bsvzDYP4BgWaqlACaqCqgIGJWef/O55/dDpzGQI8P00oY6wAZDoJXm6amJu5fupRw2mmMntMY6JGj/9uD4OnPKYJOi3s/vRqtFxiqmXIuXCFEOaZHiBhSdJKedgIVh97RkCr8ZNcDX3oBQWDR3y8va7QIXoJt5fb9n9wB8encBcvOVkv/k8GXqApURQBK/EGoamhsyrqw+M0tfeuuQCZjortVvBJ0EAqCgHNjtPPBamtrS+/ePdUYU6PO5QkAjKlR95o8beuuKQK5ESDk8M5z+41UM2XEeUyykdCRnKfWcGGwPzT2jbjrqqePxXmO6wM2LVzeyNC3iOq7mfh8IkZcPePSfHkVIkOqsjWtvLivb81Q/Ae+mpZAqB0EOyg3BiiNLR1NKbIzHdyZonoSE50OVY2XTp0ORQ1IFSML0qKl0Aoye50ULtva9+iakYLRofA8YJA7N4InPeV6FMoID8RparLh4p7+U57+4RufWX/f0wg6LXJd4TGB09TaccXh+ywxSIVAcwCar5C5BD6NjamDKkQcoFqa0Gx/rKxEzE7D5f29j3THD9i7zfG4SxCYgzo0nbrw7Dan4VkEej1IT4NSGxHXEvOI7Y+OAA6f2xNDVQac4MKtfWvXBEFgxwITwQM2guebXZSuvyGCR03yldjDOU+dSQ1t75/6XN/5f+6+Y+NLcZ4DPtipp53zkvMEVYGKxLAACc/RjAWNEBvjXPjh/r513/Yh2nHmLJkMjX5+ja1nL2PoRQS9WIHT2ZgD2xlQVXWHdBoaM7rQyHdUiI1R6D54DuM8++HJfLOLavbBY8tiPKoh0vUW4fATU3esv+jFB77efzR4DnSclo7iSxumABA4HhGo1EMCQErMRqT4oS29v/nOYR++1zEBM3fu8hma1hUgei+BziZmqAhUBVANFQAdbzurCjGzAgPO6Vu2buh++KhhW+YbK6lmcmcctpWt2qbpepMe/NPWqc89+cY/d9+x8Uj97ICH0dy6rLIqU6qOmA0Rw4n70Jbe7u+0t7en1q9f77dgH2tIlsnwCDCNLR1NhvljClzGzK+KQm1RVXUUOQgn3I774CGnb9l0RHjigsGB8JStYKDpemOGdz8z88m7ztvWkzts2Fap4KiqOmOsVZXnxLmrtmx45MeHjZG9jpj0j8xxRcUcfBzAR5nNNBEHFSlHqB0XdpiVMBCG8tZnNqx76Gjw8IrbO5GevBKFofI5D+KcZ2D7M1N3PHben7u/t3GsgkGlgROPemyNMXBOVou6y/v71m3x4dnLcBlkGMi6V7e1Ta6XqZ9i4k8R8zRxDqoSUlTIKePJQzE8wAA5eeumlwzPlBgeLdPnVaepOmOGdz9T/9xDp+966Ps7D86pDxhlTjipYeX4AkPG2hSr6guArNzcu/Z/7PrLszuDILD9HppjUCcDOQV6tLm14001qLuHjcmoSK2IC4lA5YcmqiRE8FCtMq044YRTHnrxt2u2jDn52J+LFobe+54HqPUCID35PEhBUJY9ZMQkBafpKdPD+lkdJ02a8uuhX971QsU5DhGB2cCJ7AX0e865W7dueGRz/PkIfp7mmEOzhoZlk+wUfJnBfwsAETDjAcvYOQ+YGcAgQvfWzU898uvDhOH7CgZ86TdugKnpQnFYkt16f5SwrWaKMQPP9U975tHlz6+/c3ulgKOI5mH+BOZ7WOn2p598+Imo/X25+ZgVhz2zFy45LYXUt5h5iXOhxNXhyjo+a3/BYMgJ3ry1b+0ajL3CYF+pmjO3/yfSdReiuMeVPifb9zlDpOssCkP3Sfaqt4z8eDwfZrR7k+nfKU3tm3vWfOLpJx9+oq2tLQ14aF5G1cwglwubFnZcapFaA6IlYViMl7tQ5Z05R8SqIlBMMkwPzmlZflY0kB7mDOjOTibgjnGILi0KewUmdeHoH4/nA2VVIRV9pxbxYPPC5V2zF559Wk9PTwGo7DvuKxAaRjbrmhcu+wKT/QGgU9WFjohsJX9wVQgzM0E3GQqjU4rQNfZf7uoSVZ0eg6NlhueQzcuVMBJZAi00bG5IQR5tbl32LwsWtJ8UOw7DHwx/xCYNgsAgm3VNLR23GU5dE+1RUi3h0qekqkGhMdaKym/VSLC59zcbxs5nOxm5N7iGhmWTSOUaSBEo76mtIdJ1rOK+VGngQFUkDIuhqtaysVeGnP5DvG5Oopd3nzGdJghMLpcLm1o6bjM2/UkXFoujCiqV7DRFY9NW1P1gEu1avvnxdc+Nmd90djLQJehcSX886/I7tXbKPIT5MhYHEKJmitX84Bc0e+U1Bz788S0OjDEQqWNmS8QQyI/FydV+Hufw4VnTwuW3WTafdGExRIWHZiPJNtuUlTD8v5v7uv/bqAFcDvp7BCJ9TXt73Z9O/dvvUXrSO8u6BAcIUTPZ6vDQlzR7+TUHT4JWWhhERGRVVcWFIZO5xDB3Ny1YeglyuTBI6Gifald7e7tFNuvmtnRUFTSqGrKxVp37fgwNjxmeZTIGRNrYFszc2fDeR5CufScKA+WHJj/4xVHQuEp2nEMfdOw+I2vVXvHOE3//pgUdt9h0+to4PEtVATRFa1Op0BUf3tK77pyoetZ16J6ETMYg26bI9JDV834qk6ZfgOHBIqhs33E/NKuu+OwoaPSwOY6qhkd7YeQVjRIlBS1yHxER55j5202tSy5DLhfileo8IyXnBUtWsDXXurBQzlH4uAZAa1Mp59wTTgsrRvU7PSSnyWYdOgHiC++W2ukXYHggrDRoDnGcY9qPs3/5uQOBSjxXoACE2RhxxczmvkfufgU6DwOQ2QuXnGbVdhOhXlW0IudoDq6eWWtV5OduT3hZf/9v/hS7zaGFgK4umbU4aNi+8AP/jPTki5AfKGcIGkOz+4u66qrPxpOuhz119CXuAGUCRKE8jVjbIQBIzwBoARtLqoLoNJuSAiQgAil2AfjrTb1rH8fhZponYjEAoMbGIM2TCo8R03wVV77Z88MPZgBUxuxaBKiSMzaVVhfeual37QdiQg4LzYIF7SdtbV3RXZg659SyQ5OebLUw8AVddeX/OpLTjAnOsY6A89qWtoryX6vio8zmTIXGAJXmzIF4q4Fxzj1u3fNnnnHGGWE2my15yFgpeU3zgo5/4lTqv7uwGI7D5KYCKqpQAghEhoiOWBkmZoRh4c4tves+EMMBjDVPg5WKYKXhk2f9KHKawSKIyhueFYZu1bsuv/ZoTjMmOMdxyg03LTwrw8CniWmJOAFQylNu0ta54i1beruvm/AhW7xmr7ml491sU3dL+StoIyvXLbPZN4suLgyVsJNAjwOaP/AfkJBhgsiGzb3dV4/qZ4fmNF0xNDPn/BDpurdHOU2ZnSY/dKtmR6B5gwPoqAPx8bhCNNEWBDyq41Jza8cnCXwziCapuFJMVmn8xYat0wVPPdX97Jj2P2FCtE46+bVrJtUVBp4g4tnxLZBcLmCY2RIbiAuLIKxXxcNg/pWGuqGW6Nm+vjUDL7Gv6FjhGTo7mXpn/4jS9ReXHZqoEPB5XXXF515KeJYUOGONjAJA57YsW6xE9xJzg7oweXjikzydhHdv6V2XmbAnecZu09iy7AvW2mvKFKKpqgozmxiYbcT0by7Ed/s3rO0du2iRGbsfRSe7yuGc5sSlb5myu/Edd0vNtDeVMaeJVuQfBzTJghNr5EyAuQs75qvyaiKM3MKW9CgpBCJmt2hjzyM9E891MgbIytyW9kXg9COqmkbJl9OoAMRsLMS5Z5T0H8Xab2z9w0M79/WXIDCYMUORzY7MwRxbfjk6PDt59r+jpv5tZZ+nSU+2Wnj50ADHfwTuIdq+fbsgCOzORx9+/sSpM3+hxlw+ChpKcFh0bK1xosMvPr/t59F36Z9A4ETHy0579ZyvsbGvLVHYe1DhxRhVFFTla1JTc2n/4w+v3rVj63C8QzMarfv7BT09xw7MSCEgF0FDM+fcQ+n6i6NCQDmgUQAUFwJGoHnAIvfhl3XRVelGr32VoGUfZWu+WYL7cYSISFX+KHuHF/X3/9euMRPQqlQ0q944/6zT2epvoFraVeLx+jEV9xiEPrqpb82jo9owoRvU4upZ+1WW5nX8kNJ1ZcxpYmjSk60Whm7RVZdfN7I57uX+xtI1Rry2bPOG7jucc79gtgbQJPMQVhVlTs0y6fp4E1RmgmxBeJABKFH4d8zGRiFUqZhBMYbmzgFKn72pb82jcXWV4qJPgtDcbvnUpfdQqu5iDA8Uy1cIiJ0mPzAamuPqiyX94CNXCxrQSlU9P2mHU4WAQGB5PYB7o7OPq54aBnKusS2YSZK/SMVpqSY6o+X9qZRz8VxLnFvlctkEy/tKAAmuPCXFL5p79uc0VO6c5mbNXnn9S52nGT/HARBVujLm6b61a5y6nzNbTtJ1ojtAlQT6eqCTc7lc1ec4QRAwAGXNX22MnS4iriQhdbQUJuVc8Xv7Jijjy46THOqRWcG47Fu1/CKPXyEgv/tmveuK66NCwLmJhJ5c+o6wI6oEOXwblPj1uSxRFLNo8ZzV0xDNSlM1g5PL5VxDw7JJKvo+EVEqQUFAoY6Ntc6F39vS2/1BAIyuLkXSy5fiPUO0N/wH1E67CPnBQvkXbO6+WbNXXf9yq2fjBk4uTi6N4/udhAPMnORdnYRozmHyYH1hURROd1YvONE5C2onY6lhM1vVafJtpMJsjYj7r8aTaz6M/Rc/JVtUUY3OqL7s/80k6EcwvFtQnu0Puh+agZtGQZPolYlcni/SyZs2vfl5CD1O0ZINTbSFiA2BJgMAenqqFpzM/rTgPWAm1cQXsEarLkSGROi90TlmGUIpKpErsgwA07Y9uIjY2DjUoDJA46LwbOAmXXXlDWNtQqsWcBAEDzLQJQT8CsTQBEOC6DojgoAWAUCwY0e1gkPZbFYaGpZNIsjFKhLfFJDkEKPCxhpVd1v/hrW9UfWsRCsudjxBAFAzvONUIlYlKnH+qfuhKYxA80Ci4VnZwdk/kOqmkvU60ClVXRXIZBiA2iluCbFpVHFJL5IVZsPOFTcWT+Bbo+pZruTLlARcLL3TKACKoRm6cT8055bsRuuygDNSliZHv49G0hKUVxVVffXHiFOSmHOIk3Xl2G2UmIlEv7Ctu3svsINQlsliLUMEEE9uFge7dNXlnUnM0xxN5d3TQaTV3UAlLaJE155Bz42ORUt0lBY2xjgXPmXlhe8hnitC9WtUTjPYpdkrViY1T1NRoZrXUaKaTMYANCdu8yTX9UlU1dbsxo0b8yNzRRMDmvpR0HSWBRoPTuWIAeA16zfNArQpunMzuYtjicioCEj4R6PdrcrlUFNvUdizcj80Xa5cA4IHpzIKA1EFKmVfZ4xNI7qkNilwhIhJ1fVs3rB2PcbaVFbi/p2800Q5DfKDK2XV5V2lmKfx4FSDRgoDoCmx0STWATS6TgOquB+AIAhMOTuYcG2iUWcUntVZFAZWyqoru0aVnMsfIniNr4J9SQ4Wo0S9mokeHf1eZfMbU5tQ1Kn7choUhzr3Q3Ouwzjka/5I2QoSEWYl/zvJiAsB0d+NR36TKr6YwK4I1Wiept4iP9Qp2StuPN79NN5xJpAU2FMKHgGADPaOz7cyx/9U4slNFIduqARoPDgVohkzogliBmYmvKYrLkNjExdP2Lo/IqyaoWR0IeAGueuKm8oxuenBqRJl42sbFVgUTX5S0pO5ezduvC9ffQY8Ep7tvkGyB0Az7nNQPseppBwHJVs2xNUJTZ1FYfB6yV51czknNz041dZbFMl7TVWmeqOgWXXlzZWQ0/hQzavCcxpUPDTecbwqrRAwMk9znay68pZKhcY7jlflQZMfuE7uuqKiofGO41Vh0Ax+TrJXfb7SofHgeI0/NEQOqRForvx8pczTeHC8xlmH27wYO02q3qIwdK1kr7w1LjlXxV1HPsfxKq0ktDhk7kUV4Cg8KwxcK6uuuHXU1oCqkHccr5LKpepfVFXaf2UoBMxCttZqYeBaWXXVrdWQ03jH8SqPHlzpAGDn7HPWqDiQSVkFQhjDZGps6sUtVQuNB8erhKkNKTo7GXd+cFuqsOsqcsUhw2xJsTu1u/8zwz+9rmqh8aGaV2nV1SUAKP+jv7t9+vKP/CyVsu1Dk+as3fOz67ZHN7OdW7WXHntwvEotRSZjXsz+az+AfgBApzK6qKoPDPGhmlfplc06oJMRdFpAqdqh8Y7jVc64TZCDAF0T4tt4x/Hy8uB4eXlwvLw8OF5eHhwvLw+Ol5eXB8fLy4Pj5eXBKam09Dcae3lNPHCIEPrm9JqQ4KhK6d5PcQKw/xxmL68JAw4bHlLVRI95JQJBFQo9AwCy2az4ZvWaIOBEnbmWGzYo9Ln4UPGEO7jWIAj8olWviec4hcIAJX+tOrGIA5RbG/803BDVCXy10GtigKPo7OSNG+8rkNITxAyoJuU4BFVnjEkz0xsBEKLryL28JoDjPPggA1AQtiReOY7PUFGVDwDQjC8QeE0UcEY6s5LeHyXzSdJDRl0ozPYNTa3Lgmw265DJGN+8XlUPTjbbFoET4jFVAcV37CXHDgEKJeBr7e3tqf1e5OVV1cWBLgVA9ak5T6tqDxEnXVljESds7Gl/GbRfRDbr2tvbrYfHq8rBgSIITE9PtgDorxMuEMSmQ0bCYmis/WRT6/Lr169fXwQ6CfBhm1f1ggPkcvHtyuY7Kg4gSr5DE1lxzhljbmxeuLwrOhwi66I5nozxDuSVSDcbp/ek5taOHiLToipSGoDVsbFGRR5ywMf7n1z7u31/NHqiNDdD4wlawuEvZi1Lla6pZVkfMy9I8JkIEbOqPLm5t7vNd/fkVP6Z9iAwyOVCFfpXTvEXNXSCpAsFEZ9GwtCxseewSHdz61l3ssF381Oke1sut3e84PDyjnM84aHMm7e0wVnuBTBpxIVKk1mpgIiZDRQKFdlMoPsV+nsCnlXGs6HjbXUA9hwS9RmdpI6cm/qXjRvvy3vH8RqfHCduzCAI7MaNj2xT1dvZWFbV0t3AFbmZigudiggRN5MxH2W2XyVj74HSOkvu6QK5p+1BL4PCU6HB06H5yxsAwM8NeY1fqAYgl8sJAAqF/p5c+GEinhpf1V0qB6SRQoSqiIRO6ICfc+3h7ApgUmEPjNe4Ow4ACDIZ3vZU97OAXG9K7ToHfWcisoheZj8gY75cdE+lz3+8KgOc+CBumBPr3b+4sNhtjLVRRx23XO9Ir2qXB3/CgAMA6NT169cXiegKVR2K+6hv5KSpIX+4/gQDp0uCILCbetc+7sR9jI01qv7sgMSAUVUiAkQ3RLUNX9yYIOAAuVwuBALb37fuW+rCldamUqoo+qZJKEQjAin9HgB27NjhV01MFHBifBwyGbOpt7srDIv3mAiegm+e407cWMQpQD+JBykfBk8scKDIZgXo5C193RkXFu+xqVRaVUOf87zsRypkDMHJhs2nN/w24gjOP5eJBU5cFOhSALqlrzsjLvxKVGkDAepPrjnm/AZCxCRM/4xs1iEIfH4zQcHBaHfZ9OTaT4mEnwZxntiwd59jcxtmYyQMtw+np3wDACOX824zgcEZgUeDILCbe9fdptA3k+JxY1MWAHmAXtLzExAIpJc999gvhg4elLwmJjgAoLlcLkQQ2C1Prv3VYGpwmYhcB6KBgwDyIdyhIVpobNqKhCs39677RbwHyT+nVwg4kXK5EMiY5x57bGjzk2tucaF5nbjwH0AYsDZliYih6uLlOq/wzqECVWetTYVh8e4tvY/cBAR25DBIr1cSOACArIsKBBmz9amHNm3u7b7aheHrnHNfVsUmNtYYa018+Ieqaoj9IL0SwhNR1ZDIMBtrnAuv3dLbnQE6AeScD9FeseCMxOdZB4CRyZitTz26aXPv2s+klV7noJeI6LdUtZ+IyNq0ZZsyxMzxUbvRv1d1o4Aa/arOHCZa16dEzMamrKr2iHNv39zbfWs00EQVSt/FS6NqW8MkyGYj4IOA+3K5AQA/AfCTefMurFGzq92pWwaVJSAsVNBMAp1MREQcbyuAHtCdVI/ev1S1TAPM0d+HiCj+n5HP/phz7u463vXFnp6eQpTTZH0FzYNzGIDiPT3IZBg7dtDG3H15AGviFwDQnMXnTDdhYZGDeRWJnhkdJIqzFVS3b2qIsJDAUw6zH4hU1THMQIm/T3TeAdGuIzoNEalIvxJtJeI1pLKulnf/tOfJnniVhYfGy8vLy8vLy8vrFa//Dy4v/56T0pzmAAAAAElFTkSuQmCC" alt=""><img class="brand-logo brand-logo-dark" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAADBCAYAAACHSY8RAAAl9ElEQVR42u2df5Qc1XXn733vdXV1d/WP+SEhLBASBhGDbOMF1hicWIPxro1EYsfRJJtlj2NLcnLObmIT55iEXz1jsDFJbB9vNtkE7NhOzCYZEWwngOPEaCYmYBzLwSaAHYEBDT/0a2Z6uquqq6rrvXf3j66WRtJICNTd0z287zl9dCTNdFdXvU99773v3VcARkZGRkZGRkZGPSrs54MnIgQABgCEiHrh/z377LP22rUrh6XU54Re8J8sOz0YR40cMLiMiFrfnYBgNRep1UrGhIh41Psrp1Dgvutf5RSHvklEHBGVGTZGoj+BKTOAMUwGsUoG+UAQVN4EUr9daf1WRDy/7gVDKZEqOXkHgHOw0mnQUh7xXjKOIY5jOBoaI6NlA065XGZjYy1gxoGoUpIRf6dUemvoVy6x0+lhzNgAoEA1IpBSQhRF1Gg0dOIyi7ksGmiMlm2oRkQCESUAQBBU1oGCjwDCL9u2vQoQIQoCiONYA4BOvheeKhQmVDPqW8chIoaIGhFlUKmsZWn8qNbwITvn5BuBB26tphGRAIAhIktyHiOjjor1ODQCEfXExBYe+pWPYhp3WZn8R0irvFedk41GgxhjDBG5CbeMjOM0oeGIKCuVFy7M2vn/Y9nO5aFfBa86KwGAI6Iwl8/IgHMYGEzAkLXagW1pkf68lU5nvepsDADCAGNkQrVFNYaIKL35/dfl80N3KiWzbrWqEDFlwjEj4ziLOw0DAPDd3/piNpv9kF+bU1prxhjj5lIZGcc5DjSIqPzazF1ZZ/BDnutKIuKMMeMyRgac44gjoqrN7//dXKH4y35tJgZEYSIzIwPO8d1GIKKsVvZ+MF9ccZtfq0oCSBlkjEyOc3xoGCLKyJ3dwFLWHwX+vCKtOTIzh2lkHOdEeQ0SEY9B3ylSqZyMY0CT0xgZcE782Yio3MqBj+ecwUtdtypN9czIhGonULlcZgCgfX9mNQN+Y+hXNQJ2BRoi0ABEAEDw8otcFRA1u3aMjJYanI0bNzJElF5t9mN2Pp/1qnOy0ysCiEgREctkbCbSNgBwSFp5ToCN4sBsQAxSZqgYLSk4RISIKInmB/1avD30a5SM4o5Ia60REZx8nmulIGo0npPS/76ScloTPcI5kyc63GyeoWaNf229nRkyRkvlOBwApFdrXOMUSo5Xne+Y2xCRdBxHEABEYfQAZ+IPM7mBf0bE4NW8X9K+YGS0JOAoIkJvfv//UnGjYwUKIlJOcUiEdfchReoWxxn61oL/4wCAU1NTJxFWAgBsVAYaoyUDp9VB6VUPvMfO5c8NfE8j68ikjXYKRR767uee+MnT11188cUxEbGkGKBNF6dRvzkONgHC94pUGgB93QHHkVknLwLPvTlbGL6FiNC0PBu1W12bx0kmPNWuXbtSCPR21Qja/vlaa5UrDAjfrX0lgSaV5CYGGqP2O0CXwGGIqL3K/gtFOv1o3GhQO/triEinLAulVC9K7b2pWFxTg0X2WzMy6ivHaX2WBrrYsnMALzuJ8orBoXTGQSXl9aXSWZWm0RhojPofnOb2mYxdhAjQzpYBItKZbI571dkfP//Swb9JCgEmPDNaHuA08xw8m6jtY1oLywYC+MsNGzY0oLkOzpSPjfobnGS1gAYAC4gukFHUts8mIkBEHtZrhDp1LwDAjh07DDRGHVW3y9GtxZVtdRvbtllQD552BlY8tQBSI6P+dpwdO3YwAADPm1tvWdZpjUaD2vXZiEicc0DOKogYLsynjIyWQ44DTFOOc55asAF6W0I1QAZEVGmxZC6r0bICB4h0O6E55C5MAAA9uiTfyciA089CBLPDp5EB51VUHUxeY2TAMTIy4BgZGXCMjIwMOEZGBhwjIwOOkZEBx8jIgGNkZMAxMjJ6pTLLVIw6LiLCsSngGwFgCgDGR0AB9HejoQHHqONKunHl+FEw9XOXrgHHqKNOg4j0+fspXRTwm3YGzhRaPfXvO/mfIKJu7XxkchwjowUaGwN89lmyC6D/3inAH2gNvxUj/6MLr1T/MjMzvRoR9cQEcQOOkVGiiQni4+Oon5qNL8w47F2VgxDXXZBeDeJA87c98tSqb8/MTK8eHUXVj/AYcIw6ohUrmp24p+XDN6YEaAJAQBCIkPJqICv11M88vHvVAz/4sf+60VFUE9Rf8Jgcx6izhQFNKrlBH8plGAMR1kFqSJ1HhDvJP3gFIr7UTzmPcRyjjkofZ+dJZCAadZC1SJx3349KO2dm/NUAQP3iPAYco6VzIwYi9CF2pTjv/kftv0FEGkVUyU6sBhwjoxPAk/JqoDSwy/9mSn37kR/NnIGIutedx4BjtPTwIPBGBEoz9s7pysC3Z2ZmzhjF3q62GXCMemMgInCvBnGk2XnffarwwL/+e/3MXi5Vm6qaUS85TyrwQTJMra/WU9/48Y8PvuMNb0C3F6ttxnGMest5GIi6B5IJeMuje4fv+t6T1SFEoHK5twoGBhyjXiwYCM/VChhc/dRLzsP79x/IjY0BlXuo2mbAMerRnIdx34OYpdj6+x9d+RdjY4AwBtArzmPAMerpnMd3QWZy8L6zLoUJAICxMaBemOcx4Bj1OjzCq0Kcc+D9a94KO8bGINVqSTDgGBmdkB5I1aog7Qz84jlv1w/u2bNnYKlbEkw52qhvnKfuQ+wU2H9+5NkzJvbtc69ZtQr3L1Wp2jiOUV/lPF4NZEzsyu8/m/6XuZfmzlqqsM2AY9R/zuOBrIapc77zTP7v5346VwTofsHAgGPUd2IMROCD9GLxxr97unj/6Ciwbuc8rOv3CyOjNjlP4INMpdllm7bD3Y8/Pj/YzbVtXQWHSMfmwWlGbQ7bVMqC9z5TzT6yd+/etd1qw+4KOFu2bAEAAEWwGnkKoAP0IKAJO3tIU8mfj+3JQiwBGHYMHl53Qc6HqXN3PTf87crevWuTZjje9+BA8gh1LvB8LmyABf3nbfIyQIS6Ga69J6k4dTrGQAYiqoOcr4vXf3v38APf/G6wFjvcz9MtcCiJ1d4EIA+B1D4oNahY7Tris4yWVBuTP9+yriosAaSp8/CEAch6Q5wdKvHAdx8NOhq2dRwcIkIA0ESUJYCfi6OwrZ+LiCjjWAqBMwac3lMj5vNKAVJ7b5bHzXniCKQXibOfmbN2/t+v0dpOdZJ2Y+UAQ0QVuAfflsvlz/TdmkbGWJugJCEEC+v1gJj8DwNO72hkBBQAwM5p55+GCGppC5w4BkLsMEAIIgy0smy2bnhA76zsrVwxcDo+R0QcEVXfOM6OHTuAiFAq/TFABGjvRttkWRYg4rP79vluv2/kvbyENDFB/Pc2Y8XJqE84BWCIILtxY0NkPAq1ijRb962f5Hf+7wla1+6cp6PgEBEbHR1VYbW6zrLSV4Z1XyNiO21Ts5QNAPTQ+vXrIwDgZsD2jlrzKr96pfhMZRY+5RQgBQAKqPPwMGS87oOKFF83OAgPPPdcZd3oKKry5KToeXBa76+g8TkrbaeUUu0+YQikgCTsNGFab8OzfTPe4NXgk04BBCAo6sKVYgx4FIIChHU/fNF54K57g7PHR0ZkOwoGHYs3iUggovQq+38tVxr8kletqHa6DRFRKpUCpWQl1sG5pdKaOROq9aoIJyeBj4yg/MJ9dKtTgBu8GkggENCFtSRag0pngCPBc29dU33neeeVnjnVnKcjjjM5OSkQUR448ML6lG1/thHUFWLbl9uodNZBKemBBBpuoOndfGdkBNTkJIltm/BGvwa3Js4ju/HpLedhHNY+tj/3wJ/cTWefas7Tdt6JKIWIcfXAgXPT+fROhuyMMKhr1qZK2sIbScpKg4yiS3OlFd9vd9XEqLPOc+d9dEu+ADd6NZBJbtpx79EEykoDt7jes2G1e8Wbzis9Mzk5KUZGRl4xwG0bzBMTEzwZvHG1emB92knvTAlxRhTUVbuhISKVzRdYFAb3GmiWGAUiPNFrMecpT5LYvglv8ly4xSmAAICuXDvW2jEU2FlPvuTs/OK9dPbIyIh8Nc7DTvGkMZqcFK3qGSIqrzrzwbSVfohzdobveQoZb3ulizEEFcfAkX3CDN2uwMGIiBORSF689UJEOtHr2D4ZpPEEnm1X4c1e9RA8shulHYbA63WtIsnPyuf1zvl982ePjqKafIXVNnZ0Qn8yr9aHIKLGkRGJiLper13eCKpfzxWcPweth8N6XTPGeLsLXZpIZvMDPAz8L+RKK35g3KbNkABgAsqR1xlRIaJMXqr1evzxxy0iyhCRPT09nZmens4QkU1EmSTX1SeEZ/MCeBBkt0rVUQQqUuysb/3E2fn5e+j1I6+w2oandieqnxWG8j2k5Ps5Y1damQx41aqC5mqBtsesWmttZzKoYjXthfKNw8PDfuvCmiF/6qH2li1bEBHlsdc5WBvHelVU9y5myIZZir9ZxarpJghvZsjSmjQBta45EeechGUFgVf9QHHojIdbVdbj5Tx33EufKBThpqTaxgG7k/OkbeACYM8la6rvXL++9NPJSRIjIyhfEThebXb7CQYtY4xpJL2GC+vcWEZnc566IJNzskASvJoLAKDaPMG58PNJCEEpK83qrve24vCqR4zbnHp+MjU1xY9KjjGK3PPjKLgMgf0sAlwAyM5PWSlbWJnkR1QydAhkFAEtMimjtQYrnYY4Vm5Yr777+PAAtAbrF+6jcacAN3s1kETAsUvw2BngpazcM2z5V152UenpkxlXeOSJlCdhkwQABCRjCMMQpJQKEaFTwCyARqftDPeq1Q8Wh0//soHm1atcLrOxsTFceP4afvVSYmyT1upq0OrNtlNoXm3ZgDAMQUlJkPz8wmAiCcOOGEdJboNEpNNpmwMyN6zX310cOu3l4fl7GndKh+AR2J15HpnJgSAFTwxmg02bL8/umZggPjp6/PF1xGG58wfik4/wmiesEyHZ0eGZEILSdoYHrvtrzuBpX3m1JUQDzJHAkOuurEM8KgT/FUS8PJXOgI4jCIIAiEguyINf9XXWWuu0bTNA5nrV2nuGTlv90MuFbV+8j8ZyBSh3c5KUCJRlAy9m5PRK23/nZReVnj7RODsyVKse7KkJRK21SqfT3EqnoVat/Vpx8LSv0K5dKbz44thg8MpCsiTvVAAAlUplbdbmvwmgP2DZ2SFQEjzPoyQGY4jt7aZtwYPI3NCvv6cwdNpx4SlPAh9vzvOM5fNQ9tzu5zxppp6/7BzvijVrSk8fz3l6EhwiIiBSTqkkGmG0Pwrqv14YXPWN49m80QnP5aGQtl6fO4uj+C0A2mrZuWLo10DGUgEiIHZ2gexCeLx67arBwdX/8nLO84V7qZwrwpjfzeU5BMq2gZey8vmzV/hXbDh3cedhvXedSQoh0CmtEI0gfKA+P3tpYXDVNyhZxmNQOHmXaUGzf//jTt2bu5kz60eWnfltLWXRq85JKSUhQ95paAAAGGMsCkNNpPNOrnB/be7FtyOiJKKj5k8OT5Ju24zjfhXGnDwI7FqpGngYgpoPxJk/3JPf+eCD8wOLTZL2hONQsyyjGKLIFgYhCrw5ALw9fftn/hDHxzXRpEA0Oc0rOJ+HtoUN3Pl3cUt8PmWl3xB4NVBKSQDgnc5NXzbnAfR8t3LV4MqzHny5gsEd91I5X4Ax3wMF1J3WkVa1zeIwdf7p4dY3nZd5pufAsSwLUnYOGoEfIGNf9SvebQOnn/5sEpujmad55aHZ9MMPZ1ZeeMEfcM7/JwJBEARLCswx8KTTDJB7vlu7anDl6gdfLmy783662U7DeBiARuxOpKQJVD4PnGm1563rwretXevs7RVwiDGuEGCfsMQ9uhHfkc4PPXF0bG500tAIRJTu7N4LrGzuS5adu8Srzmpo3n16KizXWmsrnWaIzA/rwX9JStWLbqC+YJ7nm5kcvLvug8IuNS1qDTLrgIjq8A9bN+F7ljzHISJtpdPABf+ahOiiVLrwkXR+6AkisogmDDSv6FxCK5+RdXf2l20n/7CVEpe48zMSEVmvQdPKeRpRpLWSGTubmapWZy+DRde2HQ4/tYYvdv84QYQ+aCbg3T1RHEBE1ogilHH8PsEyUyp2x1139gJEbCCOdnxDueVUBAAghojKr8582krbfy3juOC6rmKM9fRjXBBR29ksA9LPAKgZOEFbaHPNG5RYc8FCVyMjZAB0lA+yHrjwIiX4G5jI3Gxxsavuz/9ZrfbiMDZ3Y2REZHboPCE0UxwRlTd/8LPZwtB1Qd3Xcdyg5gLbnj526RSLIgqjf2vUwncUiyt3Q3Ny9oghWiZiG0dATU9PZ7K2vi6KALqV4ySS2RwwreD3F/5jT9yRgiDQEASaMWZn88UPN0L8+cCr3IyId5p85/jQtNaZebXZz+byA9f6tZkYAARjDHv82GOnOJyqu3N//ew/7PzAhtHRxmL5zaF/KxM764kz70rbcE7od684AAAyXwRRrcKnP7wZf6/nqmoLThQBgLIsS1iZLDTC4Bv1+bmPDpy+7jmanBRoltkscJrmSoB6bfazmfzAtV51RiKi6INjl05xWNTd+b/KFQZ/9QhAjvqOiEi7dr2Yfezg676adeB9bhUkYpdu9gTSKYLwqvD72zbjdeVJEuMLVk33VBiETYkoapBXnZeWnf2FbGnokdrcvl/AkZFFJstesxL9CI3WWjqFogj9+f+XKwz+ahKKHxOeTUxMcEQkz9u/6oVo5b+m0vA+bwmg8Wtw+2FojuxS7cn8gbEmQF61IoH0aU6x+PXq3P4PLD7T/JpzG4GIsVvZ/8lMfvBavzYb9wk0cb40JOq++1DGGfzvSe5KR2+wMjExwZ/YsoW2bCF+z0PDXw61uCCsQwzYtbRCOkUQbg1u37oJf/cwNEcepzjaRk/CF1o/3WpW61g83XSfSCulyMnnv1ydewkQ8Suv1TVrrZKzO7t3NJNzrq+7szI5F7193FrLfGk4FQXuE/XQHy1TmSXXl44uBIwiKigT+/MPwd3CZv/VnQeJDFJdcBkABOkUQLhVuH375uNDc0yO8/L9OAStVmjViCAMQ9CaVLMdp3NzBVpr4kLoTDbHq5W5LQPDr7v7tbYMp5UHuLN7L0hlso8A6Vwcx9SLczTH5jQl0QiCf5x35z5w2mnr9p2oEPD88zNnfGf3wJ+iYJt8t/vhWQua5qTr4tAcWxw4TgcogkYCRox0ETm/SCkFQPQWZGx9Nl9AkjH4vq+SNIV16ALolGUBIKvG0v+5fP70x5fqUd1LVAxAALACr/JYOp0+t173FOLSlZzpcNunPkFsonLFYSv0K3dlnKFrTlAIYIioa7Xa8NQTmUe8hni9XwOJrMuFgBp8etsm/L0TOc2ioZpTGLrzldwBI3f2Z8K6+3NAuNUpli5uAuQpAGz7ngPJhKnKF4oDqhH91W7afTEAyNfG7p1THHFEVuf2fq4wsOJcd35Wdntyk5onWifAIGOMCyHAstP82IfhEYAmAGbzujt3V64wdE1rPu6YeZpyM9cpl0l87bvwZWHD6/0axKwb4dmCnMZz4bZtm/D6l3Oa4+U4L38xpqZaA1kCwJMA8GS5XL7juuuu3cKAfcwpDlwSeC4opXS73Ydxzt1aVeZLwxtOn9c34QDemOzEsmxDtlZeU6vsf3++NPgbfq3SVWgOrVxnTGSzWQ48BUAafLcm40ZciRqNxxEhau1B0Pwl1JlMFsNobrdTGPpo4pjHFALKZWJjY0BjY8DXvBX+1srAJq8GsqvQFEB4Vbht2+YmNBs3vjw0cCqJ/eHwYYotyDWw7lauZRxvZYxlwiDQjHHWzi2iiICE4ASIoQ7U+tzw8IvLNWQ7fI73Zepu6gkrnT4zDIKuLNhsAZNOWyJl56HuVmKG+ANAfEiks99Rgbs7nYcXEVe4J/M9FoNmfBx1uUxszaXw9ZwDVyeFANFNaHwXPrX1KrzhZMKztoCz2J0RADQikju3740p274/lUqd4Xue7sROnk6hyL1a9e58aeWW5bqyoPW9qnP7Pl0YWHGdV53t+HwNNaXTaZtbmRwEbvUFnhJ/QXHjL+3Cip8sFrKfcBwhajzqzlkmYmMA9NRTs/nvPTd0N0/Du7qY0xAAqFOBBqC9jxRUye4mqfzgqn+P4sYVsZTPp22bEem2ugEict+taSudfn9Ymzm/ta5tOUEzMTHBAUC7c/veaGeyH6m7FQ0d3EkoqV5qRIb50iDXmp4PfPe6huZvSmeKN9iFFT9pdpVOtnbyPDR5uXCDwmNeR0NTbkIzNgb8oZ8O3WVl4V2+C3EXCwEqKTm/amja6jhH50rJfMOGVCbzA621UFK2dUecZplzQPjVymec0srfWW5Lcha4zY7CwNAvufNzqpMLN7XWKpfLcalUQyn9p1EM5YGBgfkFua8+1XD4UE4zBXxNCPfkHLjarUKM2PmchggAD8/TfGr7ZrzhZAsBXQNnITy1yt6t+eLgF7xatd2bFeqUZWEcN16KlbehVFpbTdyIlgE0DADInz/w5pSd+X7ciBh0cJVH6yYUBfXHVKOxNVdasWsBMKod57QFza/fAeJta+BvM13MaRZC49Xgk9s24Y0nu2Nnx0O1RcIpSUSiMHD6F323+k+5fIETUTvzEBaFIeWcwmqmc5clF3dZhGtTU1MMEUlr+B3Lzggi0h2EJnaKQyKs1++qus9fniut2JXsEY7JPtFtg+aOO0BcugbuybScpkvh2eLQnNoTEjp94NSkk48pKa/swNyOBuTIGPwsANwPANjv0CRuo4i8VYEXbQp9l6BDbcILlvfflSsMX7MgRJRt/AxERL33dZS6dA3ck3Vgs9el8OyI6lkNbt22CW86lfCsK47TKhhMTEzwbHHo4aDu/WPWybM2uw6SaiAy/NlkwC2HkjRDRKp74UczTqmUbDHciQeAySY0la/mCsPXtJoG21qdJMLRHcC+NEn2W8+Er7WggW5BQ0lOU4Nbt27Cm8qTJEY2njo0HQcHAGDLli1IzYn/L3dg+oE1oggIaANAtZjMbPe766jp6emMVuq/xZHfkfBTa62cYkk0oRn6HwtWKrf1xrNlB7Ado6hUHT5fGIBNbhUagN1dEeDW4NbtCTTjI6CgTTlwxwdZa/LLdfeuZJR6mjGWl1JSu+6iRKTtbJaCsD5SKKx8sJ8nQ1uVtHrtwDtSdnYyrNepE9vR5hyHhUHwo2x+6OLEpandRZXWdf/9CVpVysLznAEjAuzCmDs0T+NV4ZZtm/Hmo5vQ2nLH7nxi1ty5xHFWzRDox9MZ+1Du064TJVIpzgicbt0MOn6rJPglkbKx3aFn8qRuUkr5CuhXklymI2v9duxojq1Lzgk3ZLMgkpk87DAyTWjyh6GZXKQJrS/AWRC3ayL4DrI0tHlAEDRXpmzoZ3CoedyapqczQHS1jOptvz5EpO1ckQdB8NlCc0JTdGrFxYoVzeswlItfn80AEXU2/yQCAmxCU6sdhqYdhYClBKdFzzMdqawiA0B4XV/bzMQEQ0RyHfuSTNY5KwzDti6SJSJtZzKs7laeLrjRbUQTHLrw0FqtKU5CtE5CA4hJeObCJz58CBqUnYCma+Ds2LGjefAaf6gaAUAHyqsE1N+P/tiyBQEAhGBvF6m2uzIAEaXSWVRKfxrXrAmmplZ0px2j0+2pCyY3fQ/Gt23CcjvmaXrKceBEO871QaGj0zdnAABNeoR03NbvQwTazmZ43Z1/Kl9a8dVyucw2btzY/4tim+FZq+Q8vvU9ONbJ8GyhzK4xPaKklM796swaUrLNNwLSwsqyRhjtQMRoWezZkOQ0uXwTmu2bugfNEjiO0XGiKAYAUKm8tBqA1kZRo90OyhuBD9CIv77Q3fr7TpO0BtRgbPsmHCt3ERoDTi8NAwDgnF9o5/KWUkq1c54rk81hoxE+mR0+/Qetbsx+dho83Lk5tm0zjh+ep+neAl8TqvUQOIwgz0UK2jywNU9ZDBF3JuFgV8O0WLXxyyThWTZ/GJpuFAKM4/S82Bs7ZgaKdi3FNwrj9nTO04KcxvOgfCQ03W8lMeD0lu2s7kDRgde9GhDQo0uR35SyGk416CQCwhY0NShvvwo/0el5GgNOP4GDWO9AVR1Ja9CcBUvxnZQ+ZWiak5t5EHUXbt6+eSE0SxgbmOHaIykvAGiiVaTbV4pubrqRBgB4plBYMZ3A2TcVtcRppJMH4btw89ZNeMtS5TQGnN50GpXQs4Fkeyc/GWMARAEiRn12KzkUnrnVo6FZ+vZ4A05v5Tixuc6HcxonD8KvwU3br8Zbyj0EDYApR/ec95igtQlNtlkIuGnbZry1F3Ia4zhGPe80yTKanoXGOI5Rz0GTOM2NH96Mn+xVaIzjGPWc03g1uHF7j0NjHMeop6DxXbhh+2b8VK9DYxzHqHegqcIN2za1oIGe7xUyjmPUaToWLx8vDM9cuH771XhbuQ+cxjiOUXcGGCNx9BMLFjaheS5cv31TE5rxkf5prjOOY9RRBdKaj+URKyE0AOh8AUSt1oRmso+cxoBj1FE1HwkI8KM9mYcZAaQsEI0IpBAg8kVgQsXXb99k9SU0JlQz6pgQkcpE7MNX4QuljPp1O639gQEQtq1rFsQf/8V39C80xnGMOqpxRA1A+EtX4B0P/aD+rYFBedGPp/Pffe/b+d5kq+K+3TDEgGPUae+hiQnil1+EewBgD0DzGaD9/rBjE6oZdVyjo6jKZWKTk5OCiHB8GTwh3IBj1J2wbRz1yMiIXA6PmjTgGBkZcIyMDDhGRgYcIyMDjpGRkQHHyMiAY2RkwDEyMuB0XLgMnjZtZMDpuohAmstptDzBQWQdeZYqETDAgdbfzGU1WlbgaIa+UipuJzyIiKBj0EBvaX2MuaxGywKcLVu2aAAAxxnc3Wg09luWhe0c4EQERJCmyUnTJmG0LHMchDYn8UTEgiAAztjPhBdeeAYiUrlcNtVCo/4HBxEpebJyAxCfEM1ntug2vTdqrVU2X7RiiN9JRDg2NmbAMVo2jsMQkRjAc4jiuNttvWrnUQqI9DVJv4cpEBgtG3BaTx3bqVX7njqWuA73vZrOOvmNtbmX3oGIioi4ubxGywacFGOPxWEdsBOfTURcWH9MRKnkr2ZS1Kj/wSEiTOeHfiqletLOZJCI2lZZQ0QW1H2dzZcucKsHbk8eDygMPEZ9DU6Se3BEbADSg9zKtK1AcOjLMMb9WkXmC6VrvdrMTYgYAwBOTEyYsM2obx3nULjGUvwrUeADQEfyEOG7NZXLFz8RBdXxsbExGB0dVUQkiIgbBzLqO3CSpB0zmcHvxVH4H5lMtq3h2sJUx6tWlGVnb77+d6/958irvAURJSIqRKTJyUlBk5NicnJSTExMcCLCcrnMiAgXe5lhYnTMWO72BxKRQETp1Q5+PJcfuN2dn5OMYUdm/LXWKl8o8EYjaigNd6Ws9F8KYT+CiEEvXgx3/uB/ZDP2+noQaERkbTjXOpvNsqBe/7FTWnm+Ge79DQ5DRO37M2eAxp8wxIyUEhE788RlrbXmnLNsvgBaxhDU68+KlLVTNeIfWnbmxUYYvFiP6YVsFqBeP/J3MxmiHOYQstlZRIwMOEaH8oGuk4qoJycnRS43/II3f/AOuzh4rVedlZ06FsYY01qTV53XAIC2ba8T6cxWyBAAIEgZgQ0y1DGCnTrqMS4SFOQZ96tz7wWAbxERT6p1Rgac7mtqakoTEdbrs58J/OoHhUgVpIypU66TvC8HAAjDUEMYakQEIkJE5Jxze7HfU0oRMI6AYKpyRktXHGhpfHxcAwDL5YZfVDK+yc4VGRF15U6OzZ4gAQACEXkLkMVeAKBAK7OEx6g3wEkGsCIi7hRX/pnvzj6SLxSF1lot0bEsKgBA6JALdju1NEN9mYDTuqCIGKeQbZdx7KdSFlC7V3++5kUAgKZPaTmBg4iaiEQ6P/R4PfB+084VeD8/bKgXqUFuAQLsBmjOb5lTsjwcBxBREpEoDpz+JbdycCxXGE4RUWwuTZvAYQIA4Yet021OyTIBJ5EiIl4YXDUeeHP3OMXhFBE1zOU5xZsSIAsDl4Dg75r/ssOEwcsJnGQBqCYilvnDwS2BP3+PU1xhEZE0Oc+rtBoibWcyKBvR7mxx+N+apfdRMwe1zBwHDnVujgFlcgNbAnfuc06hIDjnqLU2O9e8cmlupREQ/xQR1dTUlMlvliM4C+CBsTGAbGHotz239rFUOh3lHIdprY37nCwxmnTatrlXm9/rFFbcWS6X2caNG43btFE9V6ZMNvaAsTESiPjZ2tyBXVkn98f50tCGwKuCUkpCs6/HJLqLh2jEONOMcQGkPoCIfrI+0Nx0lqvjLIQHEeXk5KQoDK78zsEnn7o0CrwbubBcpzggOOfYzH/M5oOLSObyQ6LuuWP50qp/StbXmfP0WgCnpZGRETkxMcFPv/BC386WPhlE/oVh4H8eGXed4pBIpy1GRKr5em1DpLXWBKCc4nAq8Ofuzg+cdgsRCTA7m3bm5t4n4QdCc3spBQAwP7/v7BS3foMz9v50NnM2AIIMAwijqLm+7PDGh6fUrkBEyikUuO/6VznFoW92enX0q2krSBoBdSaTEVykIIrC6+1s6bZkHzsyIdpr0HGOCt1U0qXJS6VVz+Tygx936/GFIOUvREH4JaX0Htu20SkOC6dY4rlcjiVb7QI1lTgT6YWvfsxhkmNXWmvKZrPMKQ4JpfSTdc/9+QQaNNAYxzl28JTLDMY2MsSRQ8tzaPfudHDG0EUM2KUylpcwhm8AZKsQ4LSUEMDTaQAgIClhYW0uiiI4XrWbiJRTLHK/5m92ioP3ddxxqgefytr2Ocd1HCJIWRYIIYAJATKOgTQ91ogbdz83ve/2DRs2NEzPkAHnpEO4qakpHBkZkYv8X8l1D27ggEOMi4ullIBAlzPGs6q1EJvgDVyIvJLymH4gItKZXI7qbnRFYXDwO50alElfELnVg7uymexF9bp/DDhERFwIJK33ENF0yrIeJq2/9/SzL963YcOGRvIzBhojIyMjIyMjI6PXuv4/GzOrdo1J3zgAAAAASUVORK5CYII=" alt="">';document.body.innerHTML=`\n  <nav class="topnav">\n    <a class="brand" href="#/home">${e}<span class="top-brand-text">FlutterForward</span></a>\n    <div class="nav-links">\n      ${TABS.filter(t=>t.match[0]!=="profile").map(t=>`<a class="nav-link" data-match="${t.match[0]}" href="${t.route}">${t.label}</a>`).join("")}\n    </div>\n    <div class="nav-right"><div class="nav-search" id="nav-search"><button type="button" class="nav-search-btn" id="nav-search-btn" aria-label="Search" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button><div class="nav-search-box" id="nav-search-box"><span class="nav-search-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span><input type="text" inputmode="search" id="nav-search-input" class="nav-search-input" placeholder="Search anything…" aria-label="Search anything"><button type="button" class="nav-search-close" id="nav-search-close" aria-label="Close search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="nav-search-results" id="nav-search-results" style="display:none"></div></div>${rankChip()}<div class="auth-nav">${authNavMarkup()}</div><button class="theme-btn" aria-label="Toggle theme"><span class="ti"></span></button></div>\n  </nav>\n  <main id="app"></main>\n  <footer class="site-footer"><b>FlutterForward</b>Not affiliated with Google or the Flutter team.</footer>\n  <div class="side-veil" id="side-veil"></div>\n  <aside class="sidebar" id="sidebar" aria-hidden="true" aria-label="Menu">\n    <div class="side-head">\n      <a class="side-brand" href="#/home">${e}<span class="side-brand-text">FlutterForward</span></a>\n      <button class="side-close" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button>\n    </div>\n    <nav class="side-links">\n      <div class="caps side-label">Learn</div>${TABS.filter(e=>!1!==e.top).map(e=>`<a class="side-link"data-match="${e.match[0]}"href="${e.route}"><span class="ico">${e.icon}</span><span>${e.label}</span></a>`).join("")}\n    </nav>\n  </aside>\n  <div class="modal-veil" id="rankup-veil" hidden>\n    <div class="modal rankup-dialog">\n      <span class="trophy">${TROPHY_ICON}</span>\n      <h2>Rank up</h2>\n      <div class="newrank" id="rankup-name"></div>\n      <p>Your Flutter skills are leveling up. Keep going.</p>\n      <button class="btn btn-accent btn-block" id="rankup-ok">Keep learning →</button>\n    </div>\n  </div>\n  <div class="modal-veil" id="logout-veil" hidden>\n    <div class="modal logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-message">\n      <span class="logout-icon" aria-hidden="true">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">\n          <path d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10"/>\n          <path d="M14.5 8.5 18 12l-3.5 3.5M18 12H9"/>\n        </svg>\n      </span>\n      <h2 id="logout-title">Log out?</h2>\n      <p id="logout-message">Your progress is saved on your account. You can sign back in anytime.</p>\n      <div class="logout-actions">\n        <button class="btn logout-confirm" type="button" id="logout-confirm">Log out</button>\n        <button class="btn logout-cancel" type="button" id="logout-cancel">Cancel</button>\n      </div>\n    </div>\n  </div>`,$$(".theme-btn").forEach(e=>e.onclick=cycleTheme),$("#rankup-ok").onclick=hideRankUp,$("#rankup-veil").addEventListener("click",e=>{"rankup-veil"===e.target.id&&hideRankUp()}),$("#logout-cancel").onclick=hideLogoutConfirm,$("#logout-confirm").onclick=confirmLogout,$("#logout-veil").addEventListener("click",e=>{"logout-veil"===e.target.id&&hideLogoutConfirm()});const t=$("#sidebar"),n=$("#side-veil"),s=()=>{t.classList.remove("open"),n.classList.remove("show"),t.setAttribute("aria-hidden","true"),document.body.classList.remove("side-open")};n.onclick=s,$(".side-close").onclick=s,$$(".side-link").forEach(e=>e.addEventListener("click",s)),t.addEventListener("click",e=>{const t=e.target.closest(".side-foot .rank-chip, .side-foot .auth-login, .side-foot .profile-link, .side-foot [data-auth-logout]");t&&(s(),t.matches("[data-auth-logout]")&&showLogoutConfirm({currentTarget:t}))}),document.addEventListener("keydown",e=>{"Escape"===e.key&&($("#logout-veil").classList.contains("show")?hideLogoutConfirm():$("#rankup-veil").classList.contains("show")?hideRankUp():s())});const a=document.createElement("div");a.innerHTML=`<div style="display:flex;align-items:center;gap:9px;padding:14px 14px 0;max-width:920px;margin:0 auto">\n    <button class="menu-btn" id="menu-btn" aria-label="Open menu"><span></span><span></span><span></span></button>\n    <a class="mobile-home" href="#/home" aria-label="FlutterForward home" style="display:flex;align-items:center;text-decoration:none;color:inherit">\n    ${e}<span>FlutterForward</span></a>\n    <div style="margin-left:auto;display:flex;gap:9px;align-items:center"><div class="nav-search" id="mobile-nav-search"><button type="button" class="nav-search-btn" id="mobile-nav-search-btn" aria-label="Search" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button><div class="nav-search-box" id="mobile-nav-search-box"><span class="nav-search-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span><input type="text" inputmode="search" id="mobile-nav-search-input" class="nav-search-input" placeholder="Search anything…" aria-label="Search anything" tabindex="-1"><button type="button" class="nav-search-close" id="mobile-nav-search-close" aria-label="Close search" tabindex="-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="nav-search-results" id="mobile-nav-search-results" style="display:none"></div></div><button class="theme-btn" style="width:36px;height:36px;font-size:15px" aria-label="Toggle theme"><span class="ti"></span></button></div></div>`,a.className="mobile-top",document.body.prepend(a),$("#menu-btn").onclick=()=>{t.classList.add("open"),n.classList.add("show"),t.setAttribute("aria-hidden","false"),document.body.classList.add("side-open")},$$(".mobile-top .theme-btn").forEach(e=>e.onclick=cycleTheme);const o=document.createElement("style");o.textContent="@media(min-width:1440px){.mobile-top{display:none}}",document.head.appendChild(o)}
function minTyping(){
  var el = document.getElementById("min-typing");
  if(!el || el.dataset.done) return;
  el.dataset.done = "1";
  var words = ["Widgets.", "Layouts.", "State.", "Animations.", "Navigation."];
  var wi = 0, ci = 0, deleting = false;
  function tick(){
    var word = words[wi];
    if(!deleting){
      ci++;
      el.textContent = word.substring(0, ci);
      if(ci === word.length){
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
      setTimeout(tick, 80);
    } else {
      ci--;
      el.textContent = word.substring(0, ci);
      if(ci === 0){
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  tick();
}

window.__FL_BOOTED=!0,window.__FL_TIMER&&clearTimeout(window.__FL_TIMER),shell(),initPopupScrollLock(),applyTheme(),updateRankUI(),updateAuthUI(),window.addEventListener("hashchange",route);if(!window.__ffTdNavFix){window.__ffTdNavFix=1;document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href="#/teardowns"]');if(a&&typeof teardownState!=="undefined"&&teardownState&&teardownState.app&&(location.hash||"").indexOf("#/teardowns")===0){e.preventDefault();try{if(typeof tdBack==="function"){tdBack()}else{teardownState.app=null;teardownState.selected=null;route();}}catch(err){try{teardownState.app=null;teardownState.selected=null;route();}catch(e2){}}}});}window.addEventListener("resize",function(){try{if(teardownState.app)tdEnforceOneFrame();}catch(e){}}),route(),initFirebaseAuth(),setTimeout(function(){if(!authReady&&!authUnavailable){authStuck=!0;try{route()}catch(e){}}},15000);;
/* ---------------- curated app teardowns ---------------- */
// Teardowns nav entry is now in TABS array above


const tdNode = (id, name, what, why, code, children) => ({ id, name, what, why, code, children: children || [] });
const TEARDOWNS = {
  whatsapp: {
    app: "WhatsApp", screen: "Chat screen", count: 16, glyph: "W", glyphClass: "", accent: "#008069",
    hotspots: ["wa-appbar","wa-list","wa-incoming","wa-outgoing","wa-composer","wa-send"],
    root: tdNode("wa-scaffold","Scaffold","Provides the page frame for the app bar and conversation body.","It keeps the WhatsApp header, message history, and composer in one screen structure.",`Scaffold(
  appBar: AppBar(title: const Text('Alex')),
  body: const ChatBody(),
)`,[
      tdNode("wa-appbar","AppBar","Builds a consistent top bar with a title and actions.","It keeps Back, the contact identity, video, call, and menu actions together.",`AppBar(
  backgroundColor: const Color(0xFF075E54),
  leading: const BackButton(),
  title: const ContactHeader(name: 'Alex'),
  actions: [
    IconButton(onPressed: startVideo, icon: const Icon(Icons.videocam_outlined)),
    IconButton(onPressed: startCall, icon: const Icon(Icons.call_outlined)),
  ],
)`,[
        tdNode("wa-avatar","CircleAvatar","Clips identity content into a compact circle.","It gives the contact a recognizable image beside their name.",`const CircleAvatar(
  radius: 18,
  backgroundColor: Color(0xFF7697A0),
  child: Text('A'),
)`),
        tdNode("wa-title","Column","Stacks widgets vertically.","It places the contact name above the online status inside the app bar.",`const Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [Text('Alex'), Text('online')],
)`),
        tdNode("wa-actions","Row","Lays children out horizontally.","It places the video and call actions on the same line.",`Row(
  children: [
    IconButton(onPressed: startVideo, icon: const Icon(Icons.videocam_outlined)),
    IconButton(onPressed: startCall, icon: const Icon(Icons.call_outlined)),
  ],
)`)
      ]),
      tdNode("wa-list","ListView","Builds a scrollable list of repeated content.","It lets the conversation grow while keeping the newest messages reachable.",`ListView.builder(
  padding: const EdgeInsets.all(12),
  itemCount: messages.length,
  itemBuilder: (context, index) => MessageBubble(messages[index]),
)`,[
        tdNode("wa-incoming","Row","Places children horizontally on one line.","This Row aligns an incoming bubble to the left side of the chat.",`Row(
  mainAxisAlignment: MainAxisAlignment.start,
  children: [IncomingBubble(message: message)],
)`,[
          tdNode("wa-in-bubble","Column","Stacks related content vertically.","It keeps message text and timestamp together inside the incoming bubble.",`Column(
  crossAxisAlignment: CrossAxisAlignment.end,
  children: [Text(message.text), Text(message.time)],
)`),
          tdNode("wa-incoming-bubble","Container","A white rounded box for received messages.","Distinguishes incoming messages from sent ones.",`Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
  ),
)`),
          tdNode("wa-incoming-text","Text","Displays the received message body.",`Text(message.text)`)
        ]),
        tdNode("wa-outgoing","Row","Places children horizontally on one line.","This reversed alignment pushes the user's bubble to the right.",`Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [OutgoingBubble(message: message)],
)`,[
          tdNode("wa-outgoing-bubble","Container","A colored box with rounded corners.","The green bubble distinguishes sent messages from received ones.",`Container(
  padding: const EdgeInsets.all(10),
  decoration: BoxDecoration(
    color: const Color(0xFFD9FDD3),
    borderRadius: BorderRadius.circular(12),
  ),
  child: Text(message.text),
)`,[
            tdNode("wa-outgoing-text","Text","Displays a short string with styling.","The sent message body inside the bubble.",`Text(message.text)`)
          ]),
          tdNode("wa-ticks","Stack","Layers children on top of one another.","Two small check marks overlap to form WhatsApp's delivered/read tick indicator.",`Stack(
  children: const [
    Icon(Icons.check, size: 13),
    Positioned(left: 4, child: Icon(Icons.check, size: 13)),
  ],
)`)
        ])
      ]),
      tdNode("wa-composer","Row","Places children horizontally on one line.","It keeps the expanding message field beside the circular Send button.",`Row(
  children: [
    Expanded(child: MessageTextField()),
    const SizedBox(width: 6),
    SendButton(),
  ],
)`,[
        tdNode("wa-field","TextField","Collects typed input and can show a hint.","It is where the user writes a new chat message.",`const TextField(
  decoration: InputDecoration(
    hintText: 'Message',
    prefixIcon: Icon(Icons.emoji_emotions_outlined),
    border: InputBorder.none,
  ),
)`),
        tdNode("wa-send","IconButton","Combines an icon with an accessible tap target.","It sends the text from the message field without taking much space.",`IconButton.filled(
  onPressed: sendMessage,
  icon: const Icon(Icons.send),
)`)
      ])
    ])
  },
  instagram: {
    app: "Instagram", screen: "Profile", count: 15, glyph: "IG", glyphClass: "instagram", accent: "#d83282",
    hotspots: ["ig-sliver","ig-avatar","ig-stats","ig-tabs","ig-grid","ig-bottom"],
    root: tdNode("ig-scroll","CustomScrollView","Combines multiple slivers into one coordinated scroll view.","It lets the profile header, tabs, and photo grid move as one Instagram profile.",`CustomScrollView(
  slivers: [
    const ProfileSliverAppBar(),
    SliverToBoxAdapter(child: ProfileSummary()),
    const SliverPersistentHeader(delegate: ProfileTabs()),
    SliverGrid(delegate: photoDelegate, gridDelegate: gridDelegate),
  ],
)`,[
      tdNode("ig-sliver","SliverAppBar","Creates an app bar designed for a custom scrolling layout.","It keeps the username and profile actions at the top while the content scrolls below.",`SliverAppBar(
  pinned: true,
  title: const Text('flutterforward'),
  actions: [
    IconButton(onPressed: createPost, icon: const Icon(Icons.add_box_outlined)),
    IconButton(onPressed: openMenu, icon: const Icon(Icons.menu)),
  ],
)`,[
        tdNode("ig-title","Text","Draws styled text.","It shows the profile's username in the top app bar.",`const Text(
  'flutterforward',
  style: TextStyle(fontWeight: FontWeight.w700),
)`)
      ]),
      tdNode("ig-profile","Column","Stacks widgets vertically.","It places the identity row, bio, and profile actions from top to bottom.",`Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: const [ProfileHeader(), ProfileBio(), ProfileActions()],
)`,[
        tdNode("ig-avatar","CircleAvatar","Clips identity content into a circle.","It shows the account image inside Instagram's story ring.",`Container(
  padding: const EdgeInsets.all(3),
  decoration: const BoxDecoration(
    shape: BoxShape.circle,
    gradient: LinearGradient(colors: [Colors.orange, Colors.pink, Colors.purple]),
  ),
  child: const CircleAvatar(radius: 33, backgroundImage: AssetImage('profile.jpg')),
)`),
        tdNode("ig-stats","Row","Lays children out horizontally.","It places Posts, Followers, and Following in a familiar three-column summary.",`const Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  children: [
    ProfileStat(value: '24', label: 'Posts'),
    ProfileStat(value: '1,248', label: 'Followers'),
    ProfileStat(value: '186', label: 'Following'),
  ],
)`)
      ]),
      tdNode("ig-tabs","TabBar","Displays a row of tabs and tracks the selected one.","It switches the profile content between posts, reels, and tagged photos.",`const TabBar(
  tabs: [
    Tab(icon: Icon(Icons.grid_on)),
    Tab(icon: Icon(Icons.smart_display_outlined)),
    Tab(icon: Icon(Icons.person_pin_outlined)),
  ],
)`),
      tdNode("ig-grid","GridView","Arranges repeated items in a scrollable two-dimensional grid.","It creates the three-column gallery used for profile posts.",`GridView.builder(
  physics: const NeverScrollableScrollPhysics(),
  shrinkWrap: true,
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 3,
    crossAxisSpacing: 2,
    mainAxisSpacing: 2,
  ),
  itemCount: posts.length,
  itemBuilder: (context, index) => Image.asset(posts[index], fit: BoxFit.cover),
)`),
      tdNode("ig-bottom","BottomNavigationBar","Places persistent primary destinations along the bottom edge.","It keeps Home, Search, Create, Reels, and Profile reachable with one tap.",`BottomNavigationBar(
  currentIndex: 4,
  type: BottomNavigationBarType.fixed,
  items: const [
    BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: ''),
    BottomNavigationBarItem(icon: Icon(Icons.search), label: ''),
    BottomNavigationBarItem(icon: Icon(Icons.add_box_outlined), label: ''),
    BottomNavigationBarItem(icon: Icon(Icons.smart_display_outlined), label: ''),
    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: ''),
  ],
)`)
    ])
  },
  swiggy: {
    app: "Swiggy-style", screen: "Home", count: 14, glyph: "S", glyphClass: "swiggy", accent: "#fc8019",
    hotspots: ["sw-appbar","sw-search","sw-categories","sw-offer","sw-restaurants","sw-bottom"],
    root: tdNode("sw-scaffold","Scaffold","Provides the screen frame for the page body and bottom navigation.","It keeps food discovery content above a persistent home navigation bar.",`Scaffold(
  body: const FoodHomeBody(),
  bottomNavigationBar: const FoodBottomNav(),
)`,[
      tdNode("sw-appbar","AppBar","Builds a consistent top area for screen identity and actions.","It shows the delivery location and profile action at the top of the food home screen.",`AppBar(
  title: const LocationHeader(
    title: 'Home',
    address: 'MG Road, Bengaluru',
  ),
  actions: [IconButton(onPressed: openProfile, icon: const Icon(Icons.person_outline))],
)`,[
        tdNode("sw-location","Column","Stacks widgets vertically.","It places the location name above the delivery address.",`const Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [Text('Home'), Text('MG Road, Bengaluru')],
)`)
      ]),
      tdNode("sw-search","TextField","Collects text input and can display search affordances.","It gives users one obvious place to search for dishes or restaurants.",`const TextField(
  decoration: InputDecoration(
    hintText: 'Search for dishes and restaurants',
    suffixIcon: Icon(Icons.search),
    border: OutlineInputBorder(),
  ),
)`),
      tdNode("sw-categories","ListView","Builds a scrollable list of repeated content.","With horizontal scrolling, it turns food categories into a quick browsing carousel.",`SizedBox(
  height: 78,
  child: ListView.separated(
    scrollDirection: Axis.horizontal,
    itemCount: categories.length,
    itemBuilder: (_, index) => FoodCategory(categories[index]),
    separatorBuilder: (_, __) => const SizedBox(width: 12),
  ),
)`),
      tdNode("sw-offer","Card","Groups related content on one Material surface.","It keeps the discount message and offer details together as a promotional section.",`Card(
  color: const Color(0xFFFC8019),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [Text('40% OFF'), Text('On your first order')],
    ),
  ),
)`,[
        tdNode("sw-offer-copy","Column","Stacks widgets vertically.","It places the discount headline above its supporting offer line.",`const Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [Text('40% OFF'), Text('On your first order')],
)`)
      ]),
      tdNode("sw-restaurants","ListView","Builds a scrollable list that can run horizontally.","It lets restaurant cards be browsed side by side without lengthening the page.",`SizedBox(
  height: 140,
  child: ListView.builder(
    scrollDirection: Axis.horizontal,
    itemCount: restaurants.length,
    itemBuilder: (_, index) => RestaurantCard(restaurants[index]),
  ),
)`,[
        tdNode("sw-card-one","Card","Groups a restaurant's image and details.","It makes one restaurant read as a single selectable result.",`Card(
  clipBehavior: Clip.antiAlias,
  child: Column(
    children: [Image.asset(restaurant.image), RestaurantDetails(restaurant)],
  ),
)`)
      ]),
      tdNode("sw-bottom","BottomNavigationBar","Places persistent destinations along the bottom edge.","It keeps Food, Search, Cart, and Account reachable throughout the app.",`BottomNavigationBar(
  currentIndex: 0,
  items: const [
    BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Food'),
    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
    BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: 'Cart'),
    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Account'),
  ],
)`)
    ])
  }
,
settings: {
    app: "Settings", screen: "App settings", count: 51, glyph: "04", glyphClass: "", accent: "#5b5bd6",
    hotspots: ["st-appbar","st-profile-card","st-tile-profile","st-notif-switch","st-tile-lang","st-tile-about"],
    root: tdNode("st-scaffold","Scaffold","Gives the settings page its frame: app bar on top, scrollable body below.","It keeps the Settings header pinned while the option groups scroll underneath.",`Scaffold(
  appBar: AppBar(title: const Text('Settings')),
  body: const SettingsBody(),
)`,[
      tdNode("st-appbar","AppBar","Builds the top bar with a title and a leading back action.","It tells the user where they are and offers one-tap exit back to the previous screen.",`AppBar(
  leading: const BackButton(),
  title: const Text('Settings'),
)`,[
        tdNode("st-back","IconButton","A tappable icon that runs an action.","The back chevron pops this route off the navigation stack.",`IconButton(
  icon: const Icon(Icons.arrow_back),
  onPressed: () => Navigator.pop(context),
)`),
        tdNode("st-appbar-title","Text","Renders a styled string on screen.","It labels the screen so the user knows these are app settings.",`const Text(
  'Settings',
  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
)`)
      ]),
      tdNode("st-body","ListView","Lays children out in a scrollable vertical list.","Settings has more rows than fit on screen, so the list scrolls while the app bar stays put.",`ListView(
  padding: const EdgeInsets.all(16),
  children: const [
    ProfileCard(),
    AccountGroup(),
    PreferencesGroup(),
    SupportGroup(),
  ],
)`,[
        tdNode("st-profile-card","Card","A Material surface with elevation and rounded corners.","It lifts the identity block off the background so the user spots their account first.",`Card(
  elevation: 1,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(16),
  ),
  child: const ProfileRow(),
)`,[
          tdNode("st-profile-row","Row","Places children side by side horizontally.","It lines the avatar, name column, and edit action up in one row.",`Row(
  children: [
    const CircleAvatar(radius: 28, child: Text('DK')),
    const SizedBox(width: 12),
    const Expanded(child: NameColumn()),
    TextButton(onPressed: edit, child: const Text('Edit')),
  ],
)`,[
            tdNode("st-avatar","CircleAvatar","Clips its child into a circle, usually for profile pictures.","The round avatar is the visual anchor of the identity row.",`const CircleAvatar(
  radius: 28,
  backgroundColor: Color(0xFF5B5BD6),
  child: Text('DK', style: TextStyle(color: Colors.white)),
)`),
            tdNode("st-profile-col","Column","Stacks children vertically.","It puts the display name above the email address.",`const Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Dheeraj Kumar', style: TextStyle(fontWeight: FontWeight.w700)),
    Text('dheeraj@example.com', style: TextStyle(color: Colors.grey)),
  ],
)`,[
              tdNode("st-name","Text","Renders a styled string on screen.","The name identifies whose settings these are.",`const Text(
  'Dheeraj Kumar',
  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
)`),
              tdNode("st-email","Text","Renders a styled string on screen.","The muted email confirms which account is signed in.",`const Text(
  'dheeraj@example.com',
  style: TextStyle(fontSize: 12, color: Colors.grey),
)`)
            ]),
            tdNode("st-edit","TextButton","A text-only button with a tap handler.","Edit jumps to the profile editor without leaving the settings flow.",`TextButton(
  onPressed: editProfile,
  child: const Text('Edit'),
)`)
          ])
        ]),
        tdNode("st-account-header","Text","Renders a styled string on screen.","The small-caps group label scans like a native settings section.",`const Padding(
  padding: EdgeInsets.only(top: 20, bottom: 8),
  child: Text('ACCOUNT', style: TextStyle(fontSize: 12, color: Colors.grey)),
)`),
        tdNode("st-account-group","Container","A box that can hold padding, color, and decoration.","It groups the account rows into one rounded white section.",`Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
  ),
  child: const Column(
    children: [ProfileTile(), Divider(), PrivacyTile()],
  ),
)`,[
          tdNode("st-tile-profile","ListTile","A ready-made settings row: leading icon, title, subtitle, trailing.","ListTile is the workhorse of settings screens — one widget builds the whole row.",`ListTile(
  leading: const Icon(Icons.person_outline),
  title: const Text('Profile'),
  subtitle: const Text('Name, email, avatar'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openProfile,
)`,[
            tdNode("st-tile-profile-icon","Icon","Draws a Material icon glyph.","The person icon hints at the row's purpose before reading.",`const Icon(Icons.person_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-profile-title","Text","Renders a styled string on screen.","'Profile' names the destination screen.",`const Text('Profile')`),
            tdNode("st-tile-profile-sub","Text","Renders a styled string on screen.","The subtitle previews what can be changed inside.",`const Text(
  'Name, email, avatar',
  style: TextStyle(fontSize: 12, color: Colors.grey),
)`),
            tdNode("st-tile-profile-chev","Icon","Draws a Material icon glyph.","The chevron promises another screen on tap.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div1","Divider","A thin horizontal line.","It separates rows inside the group so each option reads on its own.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-privacy","ListTile","A ready-made settings row: leading icon, title, trailing.","Tapping it opens privacy controls for the account.",`ListTile(
  leading: const Icon(Icons.lock_outline),
  title: const Text('Privacy'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openPrivacy,
)`,[
            tdNode("st-tile-privacy-icon","Icon","Draws a Material icon glyph.","The lock signals this row is about data protection.",`const Icon(Icons.lock_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-privacy-title","Text","Renders a styled string on screen.","'Privacy' is the whole point of the destination.",`const Text('Privacy')`),
            tdNode("st-tile-privacy-chev","Icon","Draws a Material icon glyph.","The chevron shows the row is tappable.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ])
        ]),
        tdNode("st-pref-header","Text","Renders a styled string on screen.","The group label separates preferences from account rows.",`const Padding(
  padding: EdgeInsets.only(top: 20, bottom: 8),
  child: Text('PREFERENCES', style: TextStyle(fontSize: 12, color: Colors.grey)),
)`),
        tdNode("st-pref-group","Container","A box that can hold padding, color, and decoration.","It wraps the toggle rows in the same rounded card style.",`Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
  ),
  child: const Column(
    children: [NotificationsTile(), Divider(), DarkModeTile(), Divider(), LanguageTile()],
  ),
)`,[
          tdNode("st-tile-notif","ListTile","A ready-made settings row with a trailing switch.","The trailing Switch turns the row into an inline toggle.",`ListTile(
  leading: const Icon(Icons.notifications_outlined),
  title: const Text('Notifications'),
  trailing: Switch(value: true, onChanged: toggleNotifications),
)`,[
            tdNode("st-tile-notif-icon","Icon","Draws a Material icon glyph.","The bell identifies this as the alerts setting.",`const Icon(Icons.notifications_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-notif-title","Text","Renders a styled string on screen.","'Notifications' labels the toggle.",`const Text('Notifications')`),
            tdNode("st-notif-switch","Switch","A Material on/off toggle.","It flips the preference in place — no new screen needed.",`Switch(
  value: true,
  onChanged: (v) => setState(() => notifications = v),
)`)
          ]),
          tdNode("st-div2","Divider","A thin horizontal line.","It keeps the toggle rows visually distinct.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-dark","ListTile","A ready-made settings row with a trailing switch.","Dark mode previews instantly, so a switch beats a new screen.",`ListTile(
  leading: const Icon(Icons.dark_mode_outlined),
  title: const Text('Dark mode'),
  trailing: Switch(value: false, onChanged: toggleDarkMode),
)`,[
            tdNode("st-tile-dark-icon","Icon","Draws a Material icon glyph.","The moon reads as 'night theme' at a glance.",`const Icon(Icons.dark_mode_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-dark-title","Text","Renders a styled string on screen.","'Dark mode' names the theme toggle.",`const Text('Dark mode')`),
            tdNode("st-dark-switch","Switch","A Material on/off toggle.","Flipping it rebuilds the app with the dark color scheme.",`Switch(
  value: false,
  onChanged: (v) => setState(() => darkMode = v),
)`)
          ]),
          tdNode("st-div3","Divider","A thin horizontal line.","The last divider before the language row.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-lang","ListTile","A ready-made settings row with a trailing value.","The trailing text shows the current choice; tapping opens the picker.",`ListTile(
  leading: const Icon(Icons.language_outlined),
  title: const Text('Language'),
  trailing: const Text('English'),
  onTap: pickLanguage,
)`,[
            tdNode("st-lang-icon","Icon","Draws a Material icon glyph.","The globe marks this as the locale setting.",`const Icon(Icons.language_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-lang-title","Text","Renders a styled string on screen.","'Language' labels the locale row.",`const Text('Language')`),
            tdNode("st-lang-value","Text","Renders a styled string on screen.","'English' shows the active language without opening the picker.",`const Text(
  'English',
  style: TextStyle(color: Colors.grey),
)`)
          ])
        ]),
        tdNode("st-app-header","Text","Renders a styled string on screen.","The group label for app-level options.",`const Padding(
  padding: EdgeInsets.only(top: 20, bottom: 8),
  child: Text('APP', style: TextStyle(fontSize: 12, color: Colors.grey)),
)`),
        tdNode("st-app-group","Container","A box that can hold padding, color, and decoration.","It groups the app rows into one rounded white section.",`Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
  ),
  child: const Column(
    children: [AppearanceTile(), Divider(), StorageTile(), Divider(), AccessibilityTile(), Divider(), DataTile()],
  ),
)`,[
          tdNode("st-tile-appearance","ListTile","A ready-made settings row: leading icon, title, subtitle, trailing.","Appearance opens the theme choice (system, light, dark).",`ListTile(
  leading: const Icon(Icons.dark_mode_outlined),
  title: const Text('Appearance'),
  subtitle: const Text('System default'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openAppearance,
)`,[
            tdNode("st-tile-appearance-icon","Icon","Draws a Material icon glyph.","The moon marks this as the theme setting.",`const Icon(Icons.dark_mode_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-appearance-title","Text","Renders a styled string on screen.","'Appearance' labels the theme row.",`const Text('Appearance')`),
            tdNode("st-tile-appearance-sub","Text","Renders a styled string on screen.","'System default' shows the theme follows the device.",`const Text('System default', style: TextStyle(color: Colors.grey))`),
            tdNode("st-tile-appearance-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div5","Divider","A thin horizontal line.","It separates the app rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-storage","ListTile","A ready-made settings row: leading icon, title, subtitle, trailing.","Storage opens download and cache management.",`ListTile(
  leading: const Icon(Icons.storage_outlined),
  title: const Text('Storage'),
  subtitle: const Text('Manage downloads'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openStorage,
)`,[
            tdNode("st-tile-storage-icon","Icon","Draws a Material icon glyph.","The storage icon marks this as the downloads setting.",`const Icon(Icons.storage_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-storage-title","Text","Renders a styled string on screen.","'Storage' labels the downloads row.",`const Text('Storage')`),
            tdNode("st-tile-storage-sub","Text","Renders a styled string on screen.","'Manage downloads' says what lives behind the row.",`const Text('Manage downloads', style: TextStyle(color: Colors.grey))`),
            tdNode("st-tile-storage-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div6","Divider","A thin horizontal line.","It separates the app rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-access","ListTile","A ready-made settings row: leading icon, title, subtitle, trailing.","Accessibility opens text size and contrast options.",`ListTile(
  leading: const Icon(Icons.accessibility_outlined),
  title: const Text('Accessibility'),
  subtitle: const Text('Text size, contrast'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openAccessibility,
)`,[
            tdNode("st-tile-access-icon","Icon","Draws a Material icon glyph.","The person icon marks this as the accessibility setting.",`const Icon(Icons.accessibility_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-access-title","Text","Renders a styled string on screen.","'Accessibility' labels the accessibility row.",`const Text('Accessibility')`),
            tdNode("st-tile-access-sub","Text","Renders a styled string on screen.","'Text size, contrast' previews what the row controls.",`const Text('Text size, contrast', style: TextStyle(color: Colors.grey))`),
            tdNode("st-tile-access-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div7","Divider","A thin horizontal line.","It separates the app rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-data","ListTile","A ready-made settings row with a trailing switch.","Data usage limits downloads to Wi-Fi when the switch is on.",`ListTile(
  leading: const Icon(Icons.language_outlined),
  title: const Text('Data usage'),
  subtitle: const Text('Wi-Fi only'),
  trailing: Switch(value: false, onChanged: toggleWifiOnly),
)`,[
            tdNode("st-tile-data-icon","Icon","Draws a Material icon glyph.","The globe marks this as the network setting.",`const Icon(Icons.language_outlined, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-data-title","Text","Renders a styled string on screen.","'Data usage' labels the network row.",`const Text('Data usage')`),
            tdNode("st-tile-data-sub","Text","Renders a styled string on screen.","'Wi-Fi only' shows downloads wait for Wi-Fi.",`const Text('Wi-Fi only', style: TextStyle(color: Colors.grey))`),
            tdNode("st-data-switch","Switch","A Material on/off toggle.","It flips the Wi-Fi-only preference in place.",`Switch(
  value: false,
  onChanged: (v) => setState(() => wifiOnly = v),
)`)
          ])
        ]),
        tdNode("st-support-header","Text","Renders a styled string on screen.","The final group label for help and info rows.",`const Padding(
  padding: EdgeInsets.only(top: 20, bottom: 8),
  child: Text('SUPPORT', style: TextStyle(fontSize: 12, color: Colors.grey)),
)`),
        tdNode("st-support-group","Container","A box that can hold padding, color, and decoration.","It gives the support rows the same grouped-card treatment.",`Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16),
  ),
  child: const Column(
    children: [HelpTile(), Divider(), RateTile(), Divider(), AboutTile(), Divider(), PrivacyPolicyTile(), Divider(), TermsTile()],
  ),
)`,[
          tdNode("st-tile-help","ListTile","A ready-made settings row: leading icon, title, trailing.","Help opens FAQs and contact options.",`ListTile(
  leading: const Icon(Icons.help_outline),
  title: const Text('Help & feedback'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openHelp,
)`,[
            tdNode("st-tile-help-icon","Icon","Draws a Material icon glyph.","The question mark marks this as the help entry.",`const Icon(Icons.help_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-help-title","Text","Renders a styled string on screen.","'Help & feedback' invites the user to get support.",`const Text('Help & feedback')`),
            tdNode("st-tile-help-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div4","Divider","A thin horizontal line.","It separates the two support rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-rate","ListTile","A ready-made settings row: leading icon, title, trailing.","Rate opens the store review sheet.",`ListTile(
  leading: const Icon(Icons.help_outline),
  title: const Text('Rate the app'),
  trailing: const Icon(Icons.chevron_right),
  onTap: rateApp,
)`,[
            tdNode("st-tile-rate-icon","Icon","Draws a Material icon glyph.","The question mark marks this as a feedback row.",`const Icon(Icons.help_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-rate-title","Text","Renders a styled string on screen.","'Rate the app' invites a store review.",`const Text('Rate the app')`),
            tdNode("st-tile-rate-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div8","Divider","A thin horizontal line.","It separates the support rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-about","ListTile","A ready-made settings row: leading icon, title, trailing.","About shows the app version and legal info.",`ListTile(
  leading: const Icon(Icons.info_outline),
  title: const Text('About'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openAbout,
)`,[
            tdNode("st-tile-about-icon","Icon","Draws a Material icon glyph.","The info mark signals app metadata lives here.",`const Icon(Icons.info_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-about-title","Text","Renders a styled string on screen.","'About' labels the app-info screen.",`const Text('About')`),
            tdNode("st-tile-about-chev","Icon","Draws a Material icon glyph.","The chevron shows the row is tappable.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div10","Divider","A thin horizontal line.","It separates the support rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-policy","ListTile","A ready-made settings row: leading icon, title, trailing.","Privacy policy opens the legal privacy document.",`ListTile(
  leading: const Icon(Icons.lock_outline),
  title: const Text('Privacy policy'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openPrivacyPolicy,
)`,[
            tdNode("st-tile-policy-icon","Icon","Draws a Material icon glyph.","The lock marks this as the privacy document.",`const Icon(Icons.lock_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-policy-title","Text","Renders a styled string on screen.","'Privacy policy' labels the legal document.",`const Text('Privacy policy')`),
            tdNode("st-tile-policy-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ]),
          tdNode("st-div11","Divider","A thin horizontal line.","It separates the support rows.",`const Divider(height: 1, indent: 56)`),
          tdNode("st-tile-terms","ListTile","A ready-made settings row: leading icon, title, trailing.","Terms of service opens the legal terms document.",`ListTile(
  leading: const Icon(Icons.info_outline),
  title: const Text('Terms of service'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openTerms,
)`,[
            tdNode("st-tile-terms-icon","Icon","Draws a Material icon glyph.","The info mark marks this as a legal document.",`const Icon(Icons.info_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-terms-title","Text","Renders a styled string on screen.","'Terms of service' labels the legal document.",`const Text('Terms of service')`),
            tdNode("st-tile-terms-chev","Icon","Draws a Material icon glyph.","The chevron shows the row leads somewhere.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
          ])
        ])
      ])
    ])
  }
,
login: {
    app: "Login", screen: "Sign in", count: 39, glyph: "L", glyphClass: "", accent: "#02569B",
    hotspots: ["lg-email-field","lg-pass-field","lg-eye","lg-forgot","lg-login-btn","lg-signup-row"],
    root: tdNode("lg-scaffold","Scaffold","Holds the sign-in form and its actions on one screen.","It keeps the brand header, email and password fields, and sign-in actions together.",`Scaffold(\n  body: const SignInForm(),\n)`,[
      tdNode("lg-form","Form","Groups the fields so they can be validated together.","It wraps the email and password fields under one GlobalKey.",`Form(\n  key: _formKey,\n  child: const SignInFields(),\n)`),
      tdNode("lg-login-btn","ElevatedButton","Submits the form and attempts sign-in.","It is the primary filled action on the screen.",`ElevatedButton(\n  onPressed: _submit,\n  child: const Text('Log in'),\n)`)
    ])
  },
    youtube: {
      app: "YouTube", screen: "Home feed", count: 49, glyph: "▶", glyphClass: "", accent: "#ff0000",
      hotspots: ["yt-appbar","yt-chips-row","yt-thumbnail","yt-card-one","yt-video-title","yt-bottom"],
      root: tdNode("yt-material","MaterialApp","...","...",`MaterialApp(
    home: const YouTubeHome(),
  )`,[])
    },
    spotify: {
      app: "Spotify", screen: "Home", count: 48, glyph: "♪", glyphClass: "", accent: "#1db954",
      hotspots: ["sp-appbar","sp-quick-grid","sp-recent-grid","sp-made-list","sp-player","sp-bottom"],
      root: tdNode("sp-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The Spotify home screen uses one shared dark Material theme and route context.",`MaterialApp(
    home: const SpotifyHome(),
  )`,[])
    },
  amazon: {
    app: "Amazon", screen: "Home", count: 59, glyph: "a", glyphClass: "", accent: "#ff9900",
    hotspots: ["am-appbar", "am-search-field", "am-chips", "am-hero", "am-grid", "am-bottom"],
    root: tdNode("am-material", "MaterialApp", "Sets the app-level theme, navigation, and Material behavior.", "The Amazon home screen inherits one shared theme and navigation context.", "MaterialApp(\n  home: const AmazonHome(),\n)", []),
  },
  gmail: {
    app: "Gmail", screen: "Inbox", count: 45, glyph: "M", glyphClass: "", accent: "#ea4335",
    hotspots: ["gm-appbar","gm-search-field","gm-inbox-list","gm-tile-1","gm-tile-2","gm-fab"],
    root: tdNode("gm-material","MaterialApp","The whole Gmail inbox runs under one Material theme and navigation context.","It sets the app-level theme and shows the inbox as the home screen.",`MaterialApp(
    home: const GmailInbox(),
  )`,[])
  },
  netflix: {
      app: "Netflix", screen: "Home", count: 49, glyph: "N", glyphClass: "", accent: "#e50914",
      hotspots: ["nf-hero","nf-play","nf-trending-row","nf-top10-row","nf-continue-progress","nf-bottom"],
      root: tdNode("nf-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The Netflix home screen inherits one dark Material theme and navigation context.",`MaterialApp(
    home: const NetflixHome(),
  )`,[])
    },
    calculator: {
      app: "Calculator", screen: "Main pad", count: 70, glyph: "÷", glyphClass: "", accent: "#1a73e8",
      hotspots: ["calc-display-fit","calc-display-text","calc-keys","calc-key-ac","calc-key-eq"],
      root: tdNode("calc-material","MaterialApp","...","...",`MaterialApp(
    home: const CalculatorScreen(),
  )`,[])
    },
    notes: {
      app: "Notes", screen: "Home", count: 41, glyph: "✎", glyphClass: "", accent: "#fbbc04",
      hotspots: ["nt-search","nt-notes-grid","nt-note-1","nt-bottom","nt-fab","nt-nav"],
      root: tdNode("nt-material","MaterialApp","...","...",`MaterialApp(
    home: const NotesHome(),
  )`,[])
    },
    tasks: {
      app: "Tasks", screen: "Task list", count: 42, glyph: "✓", glyphClass: "", accent: "#1a73e8",
      hotspots: ["tk-check-1","tk-list","tk-task-1","tk-add-row","tk-snackbar"],
      root: tdNode("tk-material","MaterialApp","...","...",`MaterialApp(
    home: const TaskListScreen(),
  )`,[])
    },
  "gmail-compose": {
  app: "Gmail", screen: "Compose", count: 26, glyph: "✎", glyphClass: "", accent: "#ea4335",
  hotspots: ["gc-appbar","gc-to-field","gc-to-error","gc-subject-field","gc-body-field","gc-snackbar"],
  root: tdNode("gc-material","MaterialApp","The compose screen runs under the same Gmail Material theme and navigation context as the inbox.","It sets the app-level theme and shows the compose screen as the home screen.",`MaterialApp(
  home: const GmailCompose(),
)`,[])
},
  "spotify-player": {
  app: "Spotify", screen: "Now Playing", count: 35, glyph: "♪", glyphClass: "", accent: "#1db954",
  hotspots: ["spp-appbar","spp-art-hero","spp-seek","spp-controls","spp-play","spp-player"],
  root: tdNode("spp-material","MaterialApp","The full player runs under the same dark Spotify Material theme and navigation context as the home feed.","It sets the app-level theme and shows the Now Playing screen as the home screen.",`MaterialApp(
  theme: ThemeData.dark(),
  home: const NowPlayingScreen(),
)`,[])
},
  "youtube-player": {
    app: "YouTube", screen: "Video player", count: 69, glyph: "▶", glyphClass: "", accent: "#ff0000",
    hotspots: ["yp-video-area","yp-buffer","yp-seek","yp-share-tip","yp-comments-sheet","yp-layout"],
    root: tdNode("yp-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The YouTube player runs under the same theme and navigation context as the home feed.",`MaterialApp(\n  home: const YouTubePlayer(),\n)`,[])
  },
  "netflix-detail": {
    app: "Netflix", screen: "Title detail", count: 65, glyph: "N", glyphClass: "", accent: "#e50914",
    hotspots: ["nd-backdrop-stack","nd-match","nd-genres","nd-tabs","nd-tabview","nd-episode-one"],
    root: tdNode("nd-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The Netflix title detail screen runs under the same dark theme and navigation context as home.",`MaterialApp(\n  home: const NetflixTitleDetail(),\n)`,[])
  },
  "amazon-product": {
    app: "Amazon", screen: "Product detail", count: 78, glyph: "a", glyphClass: "", accent: "#ff9900",
    hotspots: ["ap-hero", "ap-cart-badge", "ap-qty-dropdown", "ap-highlights-wrap", "ap-buybar", "ap-gallery-hero"],
    root: tdNode("ap-material", "MaterialApp", "Sets the app-level theme, navigation, and Material behavior.", "The Amazon product detail screen inherits one shared theme and navigation context, and owns the '/gallery' route for the Hero transition.", `MaterialApp(
  home: const ProductDetailPage(),
)`, []),
  },
  "instagram-reels": {
    app: "Instagram", screen: "Reels", count: 80, glyph: "IG", glyphClass: "instagram", accent: "#d83282",
    hotspots: ["ir-reels", "ir-heart-1", "ir-rail-1", "ir-caption-1", "ir-topbar", "ir-bottom"],
    root: tdNode("ir-material", "MaterialApp", "Sets the app-level theme, navigation, and Material behavior.", "The Instagram Reels screen inherits one shared dark theme and navigation context.", `MaterialApp(
  home: const ReelsScreen(),
)`, []),
  },
  "amazon-checkout": {
    app: "Amazon", screen: "Cart & Checkout", count: 64, glyph: "a", glyphClass: "", accent: "#ff9900",
    hotspots: ["ac-stepper", "ac-pay-upi", "ac-item-1", "ac-summary-card", "ac-place-order"],
    root: tdNode("ac-material", "MaterialApp", "Sets the app-level theme, navigation, and Material behavior.", "The Amazon checkout screen inherits one shared theme and navigation context.", `MaterialApp(
  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF9900)),
  home: const CheckoutScreen(),
)`, []),
  },
  "settings-appearance": {
    app: "Settings", screen: "Appearance", count: 47, glyph: "04", glyphClass: "", accent: "#5b5bd6",
    hotspots: ["sa-radio-light", "sa-lang-dropdown", "sa-textsize-row", "sa-preview-card"],
    root: tdNode("sa-scaffold", "Scaffold", "Gives the appearance page its frame: app bar on top, scrollable body below.", "It keeps the Appearance header pinned while the option groups scroll underneath.", `Scaffold(
  appBar: AppBar(title: const Text('Appearance')),
  body: const AppearanceBody(),
)`, []),
  },
  "settings-notifications": {
    app: "Settings", screen: "Notifications", count: 56, glyph: "04", glyphClass: "", accent: "#5b5bd6",
    hotspots: ["sn-master", "sn-cat-messages", "sn-cat-promos", "sn-quiet-tile"],
    root: tdNode("sn-scaffold", "Scaffold", "Gives the notifications page its frame: app bar on top, scrollable body below.", "It keeps the Notifications header pinned while the option groups scroll underneath.", `Scaffold(
  appBar: AppBar(title: const Text('Notifications')),
  body: const NotificationsBody(),
)`, []),
  },
"swiggy-menu": {
  app: "Swiggy-style", screen: "Restaurant menu", count: 97, glyph: "S", glyphClass: "", accent: "#fc8019",
  hotspots: ["sm-appbar","sm-tabs-header","sm-list1","sm-d1-flex","sm-cartbar"],
  root: tdNode("sm-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The whole restaurant menu runs under one Material theme and navigation context.",`MaterialApp(
  home: const RestaurantMenuScreen(),
)`,[])
},
"youtube-search": {
  app: "YouTube", screen: "Search", count: 51, glyph: "▶", glyphClass: "", accent: "#ff0000",
  hotspots: ["ys-searchbar","ys-suggest-list","ys-sug1-row","ys-recent-header","ys-bottom"],
  root: tdNode("ys-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The whole YouTube search screen runs under one Material theme and navigation context.",`MaterialApp(
  home: const YouTubeSearch(),
)`,[])
},
"spotify-search": {
  app: "Spotify", screen: "Search", count: 37, glyph: "♪", glyphClass: "", accent: "#1db954",
  hotspots: ["ss-search-field","ss-segments","ss-grid","ss-card-music","ss-bottom"],
  root: tdNode("ss-material","MaterialApp","Sets the app-level theme, navigation, and Material behavior.","The whole Spotify search screen runs under one Material theme and navigation context.",`MaterialApp(
  home: const SpotifySearch(),
)`,[])
},
  "whatsapp-status": {
    app: "WhatsApp", screen: "Status viewer", count: 29, glyph: "W", glyphClass: "", accent: "#008069",
    hotspots: ["ws-viewer","ws-page-1","ws-progress","ws-sender","ws-reply"],
    root: tdNode("ws-material","MaterialApp","The whole status viewer runs under one Material theme and navigation context.","It sets the app-level theme and shows the full-screen status viewer as the home screen.",`MaterialApp(
  home: const StatusViewerScreen(),
)`,[])
  },
  "spotify-playlist": {
    app: "Spotify", screen: "Playlist", count: 46, glyph: "♪", glyphClass: "", accent: "#1db954",
    hotspots: ["spl-appbar","spl-header","spl-play-btn","spl-list","spl-song-2"],
    root: tdNode("spl-material","MaterialApp","One dark Material theme and navigation context covers the whole Spotify playlist screen.","It sets the app-level theme and shows the playlist as the home screen.",`MaterialApp(
  theme: ThemeData.dark(),
  home: const PlaylistScreen(),
)`,[])
  },
  "login-signup": {
    app: "Login", screen: "Sign up", count: 37, glyph: "L", glyphClass: "", accent: "#02569B",
    hotspots: ["ls-name-field","ls-email-field","ls-pass-field","ls-terms-check","ls-create-btn"],
    root: tdNode("ls-material","MaterialApp","The whole sign-up screen runs under one Material theme and navigation context.","It sets the app-level theme and shows the sign-up form as the home screen.",`MaterialApp(
  home: const SignUpScreen(),
)`,[])
  },
  "gmail-drawer": {
    app: "Gmail", screen: "Navigation drawer", count: 35, glyph: "M", glyphClass: "", accent: "#ea4335",
    hotspots: ["gd-drawer","gd-header","gd-row-primary","gd-row-settings","gd-menu"],
    root: tdNode("gd-material","MaterialApp","The whole Gmail drawer runs under one Material theme and navigation context.","It sets the app-level theme and shows the inbox with its navigation drawer as the home screen.",`MaterialApp(
  home: const GmailInbox(),
)`,[])
  },
};

/* Full, hand-authored structural trees used by the interactive teardown canvas. */
const TD_WIDGET_PURPOSE = {
  MaterialApp:"Sets the app-level theme, navigation, and Material behavior.", Scaffold:"Provides the visual frame for one screen.",
  AppBar:"Creates the screen's top bar and action slots.", SafeArea:"Keeps content clear of system cutouts and gestures.",
  CustomScrollView:"Coordinates sliver-based content in one scroll position.", SliverAppBar:"Adds an app bar that participates in scrolling.",
  SliverToBoxAdapter:"Places a regular box widget inside a sliver list.", SliverPersistentHeader:"Keeps a custom header in a sliver scroll view.",
  SliverGrid:"Builds a lazily rendered grid inside a sliver scroll view.", Column:"Arranges children vertically.", Row:"Arranges children horizontally.",
  Expanded:"Gives a child the remaining space on its main axis.", Padding:"Adds deliberate space around its child.", Container:"Combines layout, decoration, and constraints.",
  SizedBox:"Adds fixed space or constrains a child.", Align:"Positions a child within available space.", Center:"Centers a child on both axes.",
  ListView:"Builds scrollable repeated content.", Text:"Renders styled text.", Icon:"Renders a Material icon.", Image:"Renders image content.",
  CircleAvatar:"Presents compact circular identity content.", Card:"Groups related content on a Material surface.", Stack:"Layers children in the same box.",
  TextField:"Collects and edits text input.", IconButton:"Provides an accessible icon-sized action.", PopupMenuButton:"Opens a compact menu of secondary actions.",
  TabBar:"Displays and controls a row of tabs.", Tab:"Represents one destination inside a TabBar.", OutlinedButton:"Shows a secondary action with a visible outline.",
  BottomNavigationBar:"Keeps primary app destinations at the bottom.", ClipRRect:"Clips a child to rounded corners.",
  Theme:"Applies a theme (colors, fonts, shapes) to the widgets below it.", SingleChildScrollView:"Makes its child scrollable when it is taller than the screen.",
  Form:"Groups form fields so they can be validated together.", InputDecoration:"Describes how a text field looks: label, hint, icons, borders.",
  TextButton:"A text-only button with a tap handler.", ElevatedButton:"A filled button for the primary action on a screen.",
  GestureDetector:"Makes any widget tappable by adding gesture handlers.",
  FittedBox: "Scales its child up or down so it fits the available box.",
  NavigationBar: "Material 3's bottom navigation: destinations with a pill indicator on the selected one.",
  BottomAppBar: "A bottom bar that holds actions and can cut a notch for a docked floating action button.",
  InkWell: "A tappable area that paints the Material ripple over its child when pressed.",
  Checkbox: "A square tick box the user taps to switch a boolean value on or off.",
  AspectRatio: "Forces its child into a fixed width-to-height ratio, such as 16:9 video.",
  CircularProgressIndicator: "A spinning ring that shows an indeterminate loading state, such as video buffering.",
  BottomSheet: "A panel that slides up from the bottom of the screen, such as a comments sheet.",
  Tooltip: "A label that appears on long-press or hover to name an icon-only action.",
  LayoutBuilder: "Rebuilds its child with a different layout depending on the space available, such as portrait vs landscape.",
  TabBarView: "The swipeable pages a TabBar switches between, such as Episodes, Trailers, and More Like This.",
  RichText: "One text run with differently styled spans inside it, such as a green match score beside a grey season count.",
  Wrap: "Flows children onto the next line when they run out of room, such as genre chips.",
  AnimatedSwitcher: "Crossfades between the old and new child when the child changes, such as a backdrop swapping episodes.",
  Hero: "Flies one widget between two screens as a shared-element transition.",
  Badge: "Shows a small count label anchored to another widget.",
  DropdownButton: "Shows the current choice and opens a compact menu to pick another.",
  Divider: "Draws a thin horizontal rule separating two sections.",
  Positioned: "Positions a child relative to the edges of its Stack.",
  PageView: "Builds swipeable full-screen pages, one at a time.",
  AnimatedOpacity: "Fades a child in or out when its opacity changes.",
  Stepper: "A numbered multi-step flow: one step at a time, with a clear sense of progress.",
  Step: "One step inside a Stepper: a title, content, and a state (complete, active, or upcoming).",
  Radio: "One option in a mutually-exclusive group — only one Radio in the group can be selected.",
  SwitchListTile: "A full settings row with a Switch built in: title, subtitle, and toggle in one widget.",
  CheckboxListTile: "A full settings row with a Checkbox built in: title, subtitle, and tick box in one widget.",
  Switch: "A Material on/off toggle.",
  SliverList: "Builds a lazily rendered list inside a sliver scroll view.",
  Flexible: "Lets a child take only the space it needs, up to the space available.",
  SearchBar: "A Material 3 search field with a leading icon, hint text, and callbacks that drive a suggestions list.",
  SegmentedButton: "A Material 3 segmented control that picks exactly one option from a small set.",
  SegmentedButtonSegment: "One option inside a SegmentedButton — its value and label.",
  ReorderableListView: "Builds a list whose items the user drags to reorder; each child needs a unique key.",
  TextFormField: "A text field with validation, used inside a Form.",
  Drawer: "Slides in from the side with navigation destinations; closes with a swipe or a tap outside.",
  ListTile: "Groups a leading icon and a label into one tappable row.",
  Dismissible: "Wraps a list row so swiping it away runs an action such as archive or delete.",
  AlertDialog: "A modal confirmation dialog with a title, content, and actions.",
  RefreshIndicator: "Wraps a scroll view so pulling down shows a spinner and refreshes the content.",
};
const TD_CODE_PROPS = {
  "wa-theme":"data: ThemeData(colorSchemeSeed: const Color(0xFF075E54)),",
  "wa-body":"decoration: const BoxDecoration(image: DecorationImage(image: AssetImage('chat_bg.png'))),",
  "wa-incoming":"alignment: Alignment.centerLeft,", "wa-outgoing":"alignment: Alignment.centerRight,",
  "wa-reply":"alignment: Alignment.centerLeft,", "wa-incoming-2":"alignment: Alignment.centerLeft,", "wa-incoming-3":"alignment: Alignment.centerLeft,", "wa-incoming-4":"alignment: Alignment.centerLeft,",
  "wa-outgoing-2":"alignment: Alignment.centerRight,", "wa-outgoing-3":"alignment: Alignment.centerRight,", "wa-outgoing-4":"alignment: Alignment.centerRight,",
  "wa-reply-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-incoming-2-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-incoming-3-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-incoming-4-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-outgoing-2-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Color(0xFFD9FDD3)),",
  "wa-outgoing-3-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Color(0xFFD9FDD3)),",
  "wa-outgoing-4-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Color(0xFFD9FDD3)),",
  "wa-encrypt":"padding: const EdgeInsets.all(8),\n  decoration: const BoxDecoration(color: Color(0xFFFDF3C6), borderRadius: BorderRadius.all(Radius.circular(8))),",
  "wa-incoming-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-outgoing-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Color(0xFFD9FDD3)),",
  "wa-composer-padding":"padding: const EdgeInsets.fromLTRB(7, 7, 7, 9),",
  "ig-profile-padding":"padding: const EdgeInsets.fromLTRB(14, 13, 14, 9),",
  "ig-top":"crossAxisAlignment: CrossAxisAlignment.center,", "ig-stats":"mainAxisAlignment: MainAxisAlignment.spaceAround,",
  "ig-bio-column":"crossAxisAlignment: CrossAxisAlignment.start,", "ig-actions":"mainAxisAlignment: MainAxisAlignment.spaceBetween,",
  "sw-head-padding":"padding: const EdgeInsets.fromLTRB(14, 13, 14, 10),", "sw-location-row":"crossAxisAlignment: CrossAxisAlignment.start,",
  "sw-location":"crossAxisAlignment: CrossAxisAlignment.start,", "sw-content-padding":"padding: const EdgeInsets.symmetric(horizontal: 14),",
  "sw-content-column":"crossAxisAlignment: CrossAxisAlignment.start,", "sw-category-box":"height: 78,", "sw-categories":"scrollDirection: Axis.horizontal,",
  "sw-offer-padding":"padding: const EdgeInsets.all(16),", "sw-offer-copy":"crossAxisAlignment: CrossAxisAlignment.start,",
  "sw-restaurants-box":"height: 140,", "sw-restaurants":"scrollDirection: Axis.horizontal,", "sw-card-image-clip":"borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),", "sw-card-details":"crossAxisAlignment: CrossAxisAlignment.start,"
};
function tdGeneratedCode(id,name,children) {
  const props = TD_CODE_PROPS[id] ? `  ${TD_CODE_PROPS[id].replace(/\n/g,"\n  ")}\n` : "";
  const rendered = (children || []).map(child => child.code).join(",\n").replace(/^/gm,"    ");
  if (name === "MaterialApp") { const screen = id.startsWith("ig-") ? "InstagramProfileScreen" : id.startsWith("sw-") ? "FoodHomeScreen" : "ChatScreen"; return `MaterialApp(\n${props}  home: const ${screen}(),\n)`; }
  if (name === "Scaffold") {
    const appBar = children.find(child=>/AppBar$/.test(child.name));
    const bottom = children.find(child=>child.name==="BottomNavigationBar");
    const body = children.find(child=>child!==appBar&&child!==bottom);
    return `Scaffold(\n${appBar?`  appBar: ${appBar.code.replace(/\n/g,"\n  ")},\n`:""}${body?`  body: ${body.code.replace(/\n/g,"\n  ")},\n`:""}${bottom?`  bottomNavigationBar: ${bottom.code.replace(/\n/g,"\n  ")},\n`:""})`;
  }
  if (/^(Row|Column|Stack|ListView)$/.test(name)) return `${name}(\n${props}  children: [\n${rendered}\n  ],\n)`;
  if (name === "CustomScrollView") return `CustomScrollView(\n${props}  slivers: [\n${rendered}\n  ],\n)`;
  if (name === "TabBar") return `TabBar(\n${props}  tabs: [\n${rendered}\n  ],\n)`;
  if (name === "SliverPersistentHeader") return `SliverPersistentHeader(\n  pinned: true,\n  delegate: ProfileTabsHeader(\n    child: ${children[0].code.replace(/\n/g,"\n    ")},\n  ),\n)`;
  if (name === "SliverToBoxAdapter") return `SliverToBoxAdapter(\n  child: ${children[0].code.replace(/\n/g,"\n  ")},\n)`;
  if (name === "SliverAppBar") return `SliverAppBar(\n  pinned: true,\n  title: ${children[0].code.replace(/\n/g,"\n  ")},\n  actions: [${children.slice(1).map(child=>child.code).join(", ")}],\n)`;
  if (name === "Theme") return `Theme(\n${props}  child: ${children[0].code.replace(/\n/g,"\n  ")},\n)`;
  if (children && children.length === 1) return `${name}(\n${props}  child: ${children[0].code.replace(/\n/g,"\n  ")},\n)`;
  return `${name}(\n${props}  children: [\n${rendered}\n  ],\n)`;
}
const T = (id,name,why,children,code,what) => tdNode(id,name,what || TD_WIDGET_PURPOSE[name] || "Builds this part of the interface.",why,code || tdGeneratedCode(id,name,children || []),children || []);

TEARDOWNS.whatsapp.root = T("wa-material","MaterialApp","The chat screen inherits one Material theme and navigation context.",[
  T("wa-theme","Theme","A focused chat palette supplies WhatsApp-style color and typography.",[],`Theme(\n  data: ThemeData(colorSchemeSeed: const Color(0xFF075E54)),\n  child: const ChatScreen(),\n)`),
  T("wa-scaffold","Scaffold","The app bar, message history, and composer belong to one stable page frame.",[
    T("wa-appbar","AppBar","Contact identity and conversation actions remain visible above the chat.",[
      T("wa-back","IconButton","Returns to the conversation list.",[],`IconButton(\n  onPressed: Navigator.of(context).pop,\n  icon: const Icon(Icons.arrow_back),\n)`),
      T("wa-title-row","Row","Avatar and two-line identity sit together in the title slot.",[
        T("wa-avatar","CircleAvatar","The contact has a compact visual identity.",[],`const CircleAvatar(radius: 18, child: Text('A'))`),
        T("wa-title-gap","SizedBox","Separates the avatar from the contact text.",[],`const SizedBox(width: 10)`),
        T("wa-title","Column","The contact name sits above their live presence.",[
          T("wa-name","Text","Shows the contact name.",[],`const Text('Alex', style: TextStyle(fontWeight: FontWeight.w700))`),
          T("wa-online","Text","Shows the short presence state.",[],`const Text('online', style: TextStyle(fontSize: 12))`)
        ])
      ]),
      T("wa-video","IconButton","Starts a video call without leaving the chat.",[],`IconButton(onPressed: startVideo, icon: const Icon(Icons.videocam_outlined))`),
      T("wa-call","IconButton","Starts a voice call from the same context.",[],`IconButton(onPressed: startCall, icon: const Icon(Icons.call_outlined))`),
      T("wa-menu","PopupMenuButton","Keeps less-used conversation actions out of the main row.",[],`PopupMenuButton<ChatAction>(\n  onSelected: handleChatAction,\n  itemBuilder: buildChatMenu,\n)`)
    ],`AppBar(\n  leading: const BackButton(),\n  title: const ContactTitle(),\n  actions: const [VideoAction(), CallAction(), ChatMenu()],\n)`),
    T("wa-body","Container","A decorated surface sits behind the entire message history.",[
      T("wa-body-column","Column","The message list expands while the composer stays at the bottom.",[
        T("wa-list-expanded","Expanded","The conversation takes every pixel not used by the composer.",[
          T("wa-list","ListView","Messages are built lazily and remain vertically scrollable.",[
            T("wa-day-align","Center","The day marker is centered independently of message alignment.",[
              T("wa-day-box","Container","The day label gets compact padding and a light surface.",[
                T("wa-day-text","Text","Labels the visible conversation day.",[],`const Text('TODAY', style: TextStyle(fontSize: 11))`)
              ])
            ]),
            T("wa-encrypt","Container","Shows the end-to-end encryption notice above the messages.",[
              T("wa-encrypt-text","Text","Reassures the user that the chat is private.",[],`const Text('Messages are end-to-end encrypted.')`)
            ]),
            T("wa-incoming","Align","Incoming messages attach to the left edge.",[
              T("wa-incoming-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-in-column","Column","Message text and time are stacked inside the bubble.",[
                  T("wa-incoming-text","Text","Displays the received message body.",[],`Text(message.text)`),
                  T("wa-in-time","Text","Shows when the message arrived.",[],`Text(message.time, style: const TextStyle(fontSize: 10))`)
                ])
              ])
            ]),
            T("wa-outgoing","Align","The user's message attaches to the right edge.",[
              T("wa-outgoing-bubble","Container","A green surface distinguishes the sent message.",[
                T("wa-out-row","Row","Time and delivery state share the bubble's trailing line.",[
                  T("wa-outgoing-text","Text","Displays the sent message body.",[],`Text(message.text)`),
                  T("wa-ticks","Stack","Two offset check icons form the read receipt.",[],`Stack(children: const [\n  Icon(Icons.check, size: 13),\n  Positioned(left: 4, child: Icon(Icons.check, size: 13)),\n])`)
                ])
              
              ])
            ]),
            T("wa-reply","Align","An incoming message attaches to the left edge.",[
              T("wa-reply-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-reply-text","Text","Displays the received reply: 'Perfect. See you there!'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-outgoing-2","Align","The user's message attaches to the right edge.",[
              T("wa-outgoing-2-bubble","Container","A green surface distinguishes the sent message.",[
                T("wa-outgoing-2-text","Text","Displays the sent message: 'By the way, it is at 4 pm.'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-incoming-2","Align","An incoming message attaches to the left edge.",[
              T("wa-incoming-2-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-incoming-2-text","Text","Displays the received message: 'Noted — I will bring my laptop.'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-outgoing-3","Align","The user's message attaches to the right edge.",[
              T("wa-outgoing-3-bubble","Container","A green surface distinguishes the sent message.",[
                T("wa-outgoing-3-text","Text","Displays the sent message: 'We will build the profile screen together.'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-incoming-3","Align","An incoming message attaches to the left edge.",[
              T("wa-incoming-3-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-incoming-3-text","Text","Displays the received message: 'Sounds good. See you then!'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-outgoing-4","Align","The user's message attaches to the right edge.",[
              T("wa-outgoing-4-bubble","Container","A green surface distinguishes the sent message.",[
                T("wa-outgoing-4-text","Text","Displays the sent message: 'Do not forget the widget tree notes.'.",[],`Text(message.text)`)
              ])
            ]),
            T("wa-incoming-4","Align","An incoming message attaches to the left edge.",[
              T("wa-incoming-4-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-incoming-4-text","Text","Displays the received message: 'Already saved them. See you at 4!'.",[],`Text(message.text)`)
              ])
            ])
          ],`ListView.builder(\n  reverse: true,\n  padding: const EdgeInsets.all(12),\n  itemCount: messages.length,\n  itemBuilder: (_, index) => MessageBubble(messages[index]),\n)`)
        ]),
        T("wa-safe-composer","SafeArea","The input row stays above the system gesture area.",[
          T("wa-composer-padding","Padding","Breathing room separates the composer from screen edges.",[
            T("wa-composer","Row","The expanding text field and fixed send action share one line.",[
              T("wa-field-expanded","Expanded","Typing space grows to fill the row.",[
                T("wa-field","TextField","The user writes a new message here.",[],`TextField(\n  controller: messageController,\n  decoration: const InputDecoration(\n    hintText: 'Message',\n    prefixIcon: Icon(Icons.emoji_emotions_outlined),\n  ),\n)`)
              ]),
              T("wa-send-gap","SizedBox","A small gap prevents the field and button from touching.",[],`const SizedBox(width: 6)`),
              T("wa-send","IconButton","The circular action submits the current message.",[],`IconButton.filled(\n  onPressed: sendMessage,\n  icon: const Icon(Icons.send),\n)`)
            ])
          ])
        ])
      ])
    ],`Container(\n  decoration: const BoxDecoration(image: DecorationImage(image: AssetImage('chat_bg.png'))),\n  child: const ChatColumn(),\n)`),
    T("wa-dialog","AlertDialog","AlertDialog is the modal confirmation that stops the user before a destructive action: it dims everything behind it, asks one question, and offers only the actions that answer it. In WhatsApp that is the delete confirm — long-press your own message, tap Delete, and this dialog asks 'Delete for everyone?' before anything disappears. A dialog is not placed in the widget tree like a normal child; it is shown with showDialog, which pushes it over the current screen, and it closes itself when an action is tapped. That is why there is no back button and no way to reach the chat behind it while it is open.",[
      T("wa-dialog-title","Text","Asks the question the dialog exists to answer.",[],`const Text('Delete message?')`),
      T("wa-dialog-content","Text","Explains what deleting will do, so the choice is informed.",[],`const Text('Delete for everyone? This message will be removed for everyone in this chat.')`),
      T("wa-dialog-actions","Row","The two answers share one row at the bottom of the dialog.",[
        T("wa-dialog-cancel","TextButton","Closes the dialog and keeps the message.",[],`TextButton(\n  onPressed: () => Navigator.pop(context),\n  child: const Text('Cancel'),\n)`),
        T("wa-dialog-delete","TextButton","Deletes the message for everyone in the chat.",[],`TextButton(\n  onPressed: () => deleteForEveryone(message),\n  child: const Text(\n    'Delete for everyone',\n    style: TextStyle(color: Colors.red),\n  ),\n)`)
      ])
    ],`showDialog(\n  context: context,\n  builder: (_) => AlertDialog(\n    title: const Text('Delete message?'),\n    content: const Text('Delete for everyone? This message will be removed for everyone in this chat.'),\n    actions: [\n      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),\n      TextButton(onPressed: () => deleteForEveryone(message), child: const Text('Delete for everyone')),\n    ],\n  ),\n)`,"A modal confirmation dialog with a title, content, and actions."),
  ],`Scaffold(\n  appBar: const ChatAppBar(),\n  body: const ChatBody(),\n)\n// Long-press wa-outgoing-2 \u2192 showDialog(...) opens the AlertDialog above.`)
]);

TEARDOWNS.instagram.root = T("ig-material","MaterialApp","The profile screen uses one shared Material theme and route context.",[
  T("ig-scaffold","Scaffold","Scrolling profile content and persistent bottom navigation share one screen frame.",[
    T("ig-scroll","CustomScrollView","The app bar, profile summary, tabs, and grid participate in one coordinated scroll.",[
      T("ig-sliver","SliverAppBar","The username and profile actions stay available while content moves below.",[
        T("ig-title","Text","Shows the active profile handle.",[],`const Text('flutterforward', style: TextStyle(fontWeight: FontWeight.w700))`),
        T("ig-create","IconButton","Opens Instagram's create flow.",[],`IconButton(onPressed: createPost, icon: const Icon(Icons.add_box_outlined))`),
        T("ig-menu","IconButton","Opens profile settings and secondary actions.",[],`IconButton(onPressed: openMenu, icon: const Icon(Icons.menu))`)
      ],`SliverAppBar(\n  pinned: true,\n  title: const Text('flutterforward'),\n  actions: [CreatePostButton(), ProfileMenuButton()],\n)`),
      T("ig-summary-sliver","SliverToBoxAdapter","Regular profile content is adapted into the sliver scroll sequence.",[
        T("ig-profile-padding","Padding","Consistent inset keeps profile content off the screen edges.",[
          T("ig-profile","Column","Identity, biography, and actions appear in reading order.",[
            T("ig-top","Row","Avatar and account statistics share the profile's first line.",[
              T("ig-avatar","CircleAvatar","The account image appears inside the story-ring treatment.",[],`const CircleAvatar(\n  radius: 34,\n  backgroundImage: AssetImage('profile.jpg'),\n)`),
              T("ig-stats-expanded","Expanded","Statistics consume the space beside the fixed avatar.",[
                T("ig-stats","Row","Posts, followers, and following are evenly distributed.",[
                  T("ig-posts-stat","Column","The posts count sits above its label.",[
                    T("ig-posts-value","Text","Displays the total post count.",[],`const Text('24', style: TextStyle(fontWeight: FontWeight.w700))`),
                    T("ig-posts-label","Text","Labels the post metric.",[],`const Text('posts')`)
                  ]),
                  T("ig-followers-stat","Column","The followers count sits above its label.",[
                    T("ig-followers-value","Text","Displays the follower count.",[],`const Text('1,248', style: TextStyle(fontWeight: FontWeight.w700))`),
                    T("ig-followers-label","Text","Labels the follower metric.",[],`const Text('followers')`)
                  ]),
                  T("ig-following-stat","Column","The following count sits above its label.",[
                    T("ig-following-value","Text","Displays how many accounts are followed.",[],`const Text('186', style: TextStyle(fontWeight: FontWeight.w700))`),
                    T("ig-following-label","Text","Labels the following metric.",[],`const Text('following')`)
                  ])
                ])
              ])
            ]),
            T("ig-bio-column","Column","Name, description, and link form one compact biography block.",[
              T("ig-bio-name","Text","Shows the profile display name.",[],`const Text('FlutterForward', style: TextStyle(fontWeight: FontWeight.w700))`),
              T("ig-bio-copy","Text","Explains what the account publishes.",[],`const Text('Learn Flutter through practical screens.')`),
              T("ig-bio-link","Text","Displays the account's external link.",[],`const Text('flutter.dev', style: TextStyle(color: Colors.blue))`)
            ]),
            T("ig-actions","Row","Profile actions remain aligned as one control group.",[
              T("ig-edit","Expanded","The edit action shares width evenly.",[
                T("ig-edit-button","OutlinedButton","Opens profile editing.",[],`OutlinedButton(onPressed: editProfile, child: const Text('Edit profile'))`)
              ]),
              T("ig-share","Expanded","The share action shares width evenly.",[
                T("ig-share-button","OutlinedButton","Opens profile sharing options.",[],`OutlinedButton(onPressed: shareProfile, child: const Text('Share profile'))`)
              ]),
              T("ig-person-add","IconButton","Opens people discovery from this profile.",[],`IconButton(onPressed: findPeople, icon: const Icon(Icons.person_add_outlined))`)
            ]),
            T("ig-highlights","Row","Saved story highlights sit below the profile actions.",[
              T("ig-story-1","CircleAvatar","A saved highlight for Flutter tips.",[],`const CircleAvatar(radius: 26, child: Text('Fl'))`),
              T("ig-story-2","CircleAvatar","A saved highlight for widget guides.",[],`const CircleAvatar(radius: 26, child: Text('Wi'))`),
              T("ig-story-3","CircleAvatar","A saved highlight for Dart notes.",[],`const CircleAvatar(radius: 26, child: Text('Da'))`)
            ])
          ])
        ])
      ]),
      T("ig-tabs-header","SliverPersistentHeader","The content switcher can remain pinned above the gallery.",[
        T("ig-tabs","TabBar","Grid, Reels, and tagged views share one selection control.",[
          T("ig-grid-tab","Tab","Selects the profile post grid.",[],`const Tab(icon: Icon(Icons.grid_on))`),
          T("ig-reels-tab","Tab","Selects the profile Reels feed.",[],`const Tab(icon: Icon(Icons.smart_display_outlined))`),
          T("ig-tagged-tab","Tab","Selects posts where the profile is tagged.",[],`const Tab(icon: Icon(Icons.person_pin_outlined))`)
        ])
      ]),
      T("ig-grid","SliverGrid","Post thumbnails are lazily built in three equal columns.",[
        T("ig-photo","Image","Each cell fills its square with one post thumbnail.",[],`Image.asset(post.image, fit: BoxFit.cover)`)
      ],`SliverGrid(\n  delegate: SliverChildBuilderDelegate(\n    (_, index) => Image.asset(posts[index].image, fit: BoxFit.cover),\n    childCount: posts.length,\n  ),\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),\n)`)
    ]),
    T("ig-bottom","BottomNavigationBar","Primary Instagram destinations stay reachable below the profile.",[
      T("ig-home-item","Icon","Represents the Home destination.",[],`const Icon(Icons.home_outlined)`),
      T("ig-search-item","Icon","Represents Search and Explore.",[],`const Icon(Icons.search)`),
      T("ig-create-item","Icon","Represents content creation.",[],`const Icon(Icons.add_box_outlined)`),
      T("ig-reels-item","Icon","Represents Reels.",[],`const Icon(Icons.smart_display_outlined)`),
      T("ig-profile-item","CircleAvatar","Represents the active profile destination.",[],`const CircleAvatar(radius: 11, backgroundImage: AssetImage('profile.jpg'))`)
    ],`BottomNavigationBar(\n  currentIndex: 4,\n  type: BottomNavigationBarType.fixed,\n  items: profileNavigationItems,\n)`)
  ])
]);

TEARDOWNS.swiggy.root = T("sw-material","MaterialApp","The food home screen inherits shared theme and navigation behavior.",[
  T("sw-scaffold","Scaffold","Discovery content and persistent destination navigation share one page frame.",[
    T("sw-safe","SafeArea","Location and search controls remain clear of system insets.",[
      T("sw-refresh","RefreshIndicator","RefreshIndicator is the pull-to-refresh wrapper: it watches the scroll view for a downward drag past the top and, when the user lets go, shows a spinner and calls onRefresh. On Swiggy Home that is how the restaurant list is re-fetched — pull the list down, the orange spinner appears at the top, and the latest restaurants load in. A plain CustomScrollView can scroll but cannot trigger a refresh; RefreshIndicator adds the gesture and the spinner around the scroll view without changing anything inside it. The spinner is built into RefreshIndicator itself, so there is no separate spinner widget in this tree.",[
      T("sw-scroll-view","CustomScrollView","Header, categories, offer, and restaurant results scroll as one surface.",[
        T("sw-appbar","SliverAppBar","Location identity and account access occupy the top of the food screen.",[
          T("sw-head-padding","Padding","The location row receives consistent horizontal inset.",[
            T("sw-location-row","Row","Pin, address, and profile action share the header line.",[
              T("sw-pin","Icon","Marks the delivery location context.",[],`const Icon(Icons.location_on_outlined, color: Color(0xFFFC8019))`),
              T("sw-location-expanded","Expanded","The address uses the space between pin and profile.",[
                T("sw-location","Column","Location name is stacked over the full address.",[
                  T("sw-home-text","Text","Shows the selected saved place.",[],`const Text('Home', style: TextStyle(fontWeight: FontWeight.w700))`),
                  T("sw-address-text","Text","Shows the resolved delivery address.",[],`const Text('MG Road, Bengaluru', overflow: TextOverflow.ellipsis)`)
                ])
              ]),
              T("sw-profile-avatar","CircleAvatar","Opens account and profile entry points.",[],`const CircleAvatar(radius: 16, child: Text('DK'))`)
            ])
          ])
        ],`SliverAppBar(\n  pinned: true,\n  title: const DeliveryLocationHeader(),\n)`),
        T("sw-content","SliverToBoxAdapter","The regular home sections are adapted into the sliver sequence.",[
          T("sw-content-padding","Padding","All discovery sections align to one page inset.",[
            T("sw-content-column","Column","Search, categories, promotion, and restaurants follow vertically.",[
              T("sw-search","TextField","Users can search dishes and restaurants from one entry point.",[],`TextField(\n  onChanged: searchFood,\n  decoration: const InputDecoration(\n    hintText: 'Search for dishes and restaurants',\n    suffixIcon: Icon(Icons.search),\n  ),\n)`),
              T("sw-search-gap","SizedBox","Separates search from the first content section.",[],`const SizedBox(height: 18)`),
              T("sw-category-title","Text","Introduces the food category carousel.",[],`const Text("What's on your mind?", style: TextStyle(fontWeight: FontWeight.w700))`),
              T("sw-category-box","SizedBox","Gives the horizontal category list a stable height.",[
                T("sw-categories","ListView","Food categories scroll horizontally without growing the page.",[
                  T("sw-category-item","Column","Category image and label form one tappable option.",[
                    T("sw-category-image","CircleAvatar","Presents the category illustration in a circle.",[],`CircleAvatar(radius: 28, backgroundImage: AssetImage(category.image))`),
                    T("sw-category-label","Text","Names the category beneath its image.",[],`Text(category.name)`)
                  ])
                ],`ListView.separated(\n  scrollDirection: Axis.horizontal,\n  itemCount: categories.length,\n  itemBuilder: (_, index) => FoodCategory(categories[index]),\n  separatorBuilder: (_, __) => const SizedBox(width: 12),\n)`)
              ]),
              T("sw-offer","Card","Discount content reads as one prominent promotional surface.",[
                T("sw-offer-padding","Padding","Offer text stays clear of the card edge.",[
                  T("sw-offer-copy","Column","Discount and qualification details are stacked.",[
                    T("sw-offer-title","Text","Shows the promotion's strongest value.",[],`const Text('40% OFF', style: TextStyle(fontWeight: FontWeight.w800))`),
                    T("sw-offer-detail","Text","Explains when the discount applies.",[],`const Text(
  'On your first order - use WELCOME',
  softWrap: true,
)`)
                  ])
                ])
              ],`Card(\n  color: const Color(0xFFFC8019),\n  child: const Padding(\n    padding: EdgeInsets.all(16),\n    child: OfferCopy(),\n  ),\n)`),
              T("sw-restaurants-title","Text","Introduces nearby restaurant results.",[],`const Text('Top restaurants near you', style: TextStyle(fontWeight: FontWeight.w700))`),
              T("sw-restaurants-subtitle","Text","States the delivery promise under the restaurant heading.",[],`const Text('Fast delivery and great ratings', style: TextStyle(color: Colors.grey))`),
              T("sw-restaurants-box","SizedBox","Constrains the horizontal restaurant rail to card height.",[
                T("sw-restaurants","ListView","Restaurant cards can be browsed side by side.",[
                  T("sw-card-one","Card","One restaurant's image and delivery facts stay grouped.",[
                    T("sw-card-column","Column","Restaurant image sits above its details.",[
                      T("sw-card-image-clip","ClipRRect","The restaurant image follows the card's top corners.",[
                        T("sw-card-image","Image","Shows the restaurant's representative food image.",[],`Image.asset(restaurant.image, height: 92, fit: BoxFit.cover)`)
                      ]),
                      T("sw-card-detail-padding","Padding","Restaurant text gets a compact inset.",[
                        T("sw-card-details","Column","Name and delivery metadata are stacked.",[
                          T("sw-card-name","Text","Shows the restaurant name.",[],`Text(restaurant.name, style: const TextStyle(fontWeight: FontWeight.w700))`),
                          T("sw-card-meta","Text","Shows rating and estimated delivery time.",[],`Text('\${restaurant.rating} · \${restaurant.eta}')`)
                        ])
                      ])
                    ])
                  ])
                ],`ListView.builder(\n  scrollDirection: Axis.horizontal,\n  itemCount: restaurants.length,\n  itemBuilder: (_, index) => RestaurantCard(restaurants[index]),\n)`)
              ])
            ]),
              T("sw-restaurants-2","ListView","The second row of restaurant cards.",[],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: 2,
  itemBuilder: (_, index) => RestaurantCard(restaurants[index + 2]),
)`),
              T("sw-restaurants-3","ListView","The third row of restaurant cards.",[],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: 2,
  itemBuilder: (_, index) => RestaurantCard(restaurants[index + 4]),
)`),
              T("sw-restaurants-4","ListView","The fourth row of restaurant cards.",[],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: 2,
  itemBuilder: (_, index) => RestaurantCard(restaurants[index + 6]),
)`)
          ])
        ])
      ])
      ],`RefreshIndicator(\n  onRefresh: refreshRestaurants,\n  color: const Color(0xFFFC8019),\n  child: const HomeScrollView(),\n)`,"Wraps a scroll view so pulling down shows a spinner and refreshes the content.")
    ]),
    T("sw-bottom","BottomNavigationBar","Food, Search, Cart, and Account remain one tap away.",[
      T("sw-food-nav","Icon","Represents the active Food destination.",[],`const Icon(Icons.home_outlined)`),
      T("sw-search-nav","Icon","Represents the Search destination.",[],`const Icon(Icons.search)`),
      T("sw-cart-nav","Icon","Represents the Cart destination.",[],`const Icon(Icons.shopping_bag_outlined)`),
      T("sw-account-nav","Icon","Represents the Account destination.",[],`const Icon(Icons.person_outline)`)
    ],`BottomNavigationBar(\n  currentIndex: 0,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Food'),\n    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),\n    BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: 'Cart'),\n    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Account'),\n  ],\n)`)
  ])
]);

TEARDOWNS.login.root = T("lg-material","MaterialApp","The sign-in screen inherits one Material theme and navigation context.",[
  T("lg-theme","Theme","A focused auth palette supplies brand color and typography.",[],`Theme(\n  data: ThemeData(colorSchemeSeed: const Color(0xFF02569B)),\n  child: const SignInScreen(),\n)`),
  T("lg-scaffold","Scaffold","The brand header, sign-in form, and its actions share one stable page frame.",[
    T("lg-safe","SafeArea","Form content stays clear of notches, the status bar, and system gestures.",[
      T("lg-scroll","SingleChildScrollView","The form scrolls when the keyboard shrinks the visible area.",[
        T("lg-center","Center","The sign-in form stays centered on tall screens.",[
          T("lg-form-padding","Padding","The form keeps one consistent inset from the screen edges.",[
            T("lg-form","Form","Groups the fields so they can be validated together with a GlobalKey.",[
              T("lg-col","Column","Logo, fields, and actions follow from top to bottom.",[
                T("lg-header","Column","Brand mark, title, and subtitle form the sign-in header.",[
                  T("lg-logo-ring","Container","A gradient ring gives the brand mark its badge shape.",[
                    T("lg-logo","Text","Shows the app monogram inside the badge.",[],`const Text(\n  'FF',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800),\n)`)
                  ],`Container(\n  width: 64,\n  height: 64,\n  decoration: const BoxDecoration(\n    borderRadius: BorderRadius.all(Radius.circular(22)),\n    gradient: LinearGradient(colors: [Color(0xFF02569B), Color(0xFF13B9FD)]),\n  ),\n  child: const Center(child: Text('FF')),\n)`),
                  T("lg-title","Text","Greets the returning user.",[],`const Text(\n  'Welcome back',\n  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),\n)`),
                  T("lg-subtitle","Text","Explains what signing in unlocks.",[],`const Text(\n  'Sign in to your account',\n  style: TextStyle(color: Colors.grey),\n)`)
                ]),
                T("lg-email-field","TextField","Collects the account email address.",[
                  T("lg-email-icon","Icon","Hints that this field expects an email address.",[],`const Icon(Icons.mail_outlined)`),
                  T("lg-email-decoration","InputDecoration","Labels, hints, and borders describe the email field's state.",[],`const InputDecoration(\n  labelText: 'Email',\n  hintText: 'you@example.com',\n  prefixIcon: Icon(Icons.mail_outlined),\n  border: OutlineInputBorder(),\n)`)
                ],`TextField(\n  controller: _emailController,\n  keyboardType: TextInputType.emailAddress,\n  decoration: const InputDecoration(\n    labelText: 'Email',\n    prefixIcon: Icon(Icons.mail_outlined),\n    border: OutlineInputBorder(),\n  ),\n  validator: (value) => value!.contains('@') ? null : 'Enter a valid email',\n)`),
                T("lg-field-gap","SizedBox","Keeps a steady rhythm between the two fields.",[],`const SizedBox(height: 12)`),
                T("lg-pass-field","TextField","Collects the password without showing it.",[
                  T("lg-pass-icon","Icon","Hints that this field expects a secret.",[],`const Icon(Icons.lock_outlined)`),
                  T("lg-pass-decoration","InputDecoration","Labels the password field and reserves the suffix slot.",[],`const InputDecoration(\n  labelText: 'Password',\n  prefixIcon: Icon(Icons.lock_outlined),\n  border: OutlineInputBorder(),\n)`),
                  T("lg-eye","IconButton","Toggles password visibility without leaving the field.",[],`IconButton(\n  onPressed: _toggleObscure,\n  icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),\n)`)
                ],`TextField(\n  controller: _passwordController,\n  obscureText: _obscure,\n  decoration: InputDecoration(\n    labelText: 'Password',\n    prefixIcon: const Icon(Icons.lock_outlined),\n    suffixIcon: IconButton(\n      onPressed: _toggleObscure,\n      icon: const Icon(Icons.visibility_outlined),\n    ),\n    border: const OutlineInputBorder(),\n  ),\n  validator: (value) => value!.length >= 6 ? null : 'Minimum 6 characters',\n)`),
                T("lg-forgot-align","Align","Pins the recovery link to the trailing edge.",[
                  T("lg-forgot","TextButton","Starts the password recovery flow.",[],`TextButton(\n  onPressed: _recoverPassword,\n  child: const Text('Forgot password?'),\n)`)
                ],`const Align(\n  alignment: Alignment.centerRight,\n  child: TextButton(\n    onPressed: _recoverPassword,\n    child: Text('Forgot password?'),\n  ),\n)`),
                T("lg-btn-gap","SizedBox","Separates the form from its primary action.",[],`const SizedBox(height: 16)`),
                T("lg-login-btn","ElevatedButton","Submits the form and attempts sign-in.",[],`ElevatedButton(\n  onPressed: () {\n    if (_formKey.currentState!.validate()) _signIn();\n  },\n  child: const Text('Log in'),\n)`),
                T("lg-or-gap","SizedBox","Breathing room before the alternative sign-in row.",[],`const SizedBox(height: 18)`),
                T("lg-or-row","Row","The 'or' divider separates password sign-in from social sign-in.",[],`Row(
  children: const [
    Expanded(child: Divider()),
    Padding(
      padding: EdgeInsets.symmetric(horizontal: 12),
      child: Text('or'),
    ),
    Expanded(child: Divider()),
  ],
)`),
                T("lg-google-btn","OutlinedButton","Offers one-tap sign-in with a Google account.",[],`OutlinedButton(
  onPressed: signInWithGoogle,
  child: const Text('Continue with Google'),
)`),
                T("lg-signup-gap","SizedBox","Lifts the sign-up prompt away from the social row.",[],`const SizedBox(height: 20)`),
                T("lg-signup-row","Row","The prompt and its link share one centered line.",[
                  T("lg-signup-text","Text","Invites new users without a link style.",[],`const Text("Don't have an account?")`),
                  T("lg-signup-space","SizedBox","A fixed gap keeps the link from touching the prompt.",[],`const SizedBox(width: 6)`),
                  T("lg-signup-link","GestureDetector","Makes the 'Sign up' text tappable.",[
                    T("lg-signup-link-text","Text","Routes new users to registration.",[],`const Text(\n  'Sign up',\n  style: TextStyle(color: Color(0xFF02569B), fontWeight: FontWeight.w700),\n)`)
                  ],`GestureDetector(\n  onTap: _goToSignUp,\n  child: const Text(\n    'Sign up',\n    style: TextStyle(color: Color(0xFF02569B)),\n  ),\n)`)
                ],`Row(\n  mainAxisAlignment: MainAxisAlignment.center,\n  children: [\n    const Text("Don't have an account?"),\n    const SizedBox(width: 6),\n    GestureDetector(onTap: _goToSignUp, child: const Text('Sign up')),\n  ],\n)`)
              ])
            ],`Form(\n  key: _formKey,\n  child: const SignInFields(),\n)`)
          ],`const Padding(\n  padding: EdgeInsets.symmetric(horizontal: 22),\n  child: SignInForm(),\n)`)
        ],`const Center(child: SignInCard())`)
      ],`const SingleChildScrollView(child: SignInCard())`)
    ],`const SafeArea(child: SignInBody())`)
  ],`Scaffold(\n  body: const SafeArea(child: SignInBody()),\n)`)
]);

TEARDOWNS.youtube.root = T("yt-material","MaterialApp","MaterialApp sits at the top of the app and gives every screen one theme, one navigation stack, and one Material look.",[
  T("yt-scaffold","Scaffold","Scaffold frames a single screen, so the top bar, the video feed, and the bottom navigation stay in one stable layout.",[
    T("yt-appbar","AppBar","The top bar stays pinned above the feed, so the logo, search, and profile are always one tap away while videos scroll underneath.",[
      T("yt-logo-row","Row","The logo mark and the wordmark sit side by side in one horizontal row, so they read as a single brand lockup.",[
        T("yt-logo-icon","Icon","A red rounded play mark is the instantly recognisable YouTube logo, drawn as a vector icon so it stays crisp at any size.",[],`const Icon(Icons.play_circle_fill, color: Color(0xFFFF0000), size: 28)`),
        T("yt-logo-text","Text","The wordmark next to the play mark names the app in the top bar, in bold so it reads clearly at a glance.",[],`const Text('YouTube', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700))`)
      ]),
      T("yt-search","IconButton","Tapping the magnifier opens search, and an icon button gives it a proper tap target without taking the space a text field would.",[],`IconButton(onPressed: openSearch, icon: const Icon(Icons.search))`),
      T("yt-cast","IconButton","Tapping the cast icon offers nearby TVs and speakers, so a video can jump from the phone to a bigger screen.",[],`IconButton(onPressed: openCast, icon: const Icon(Icons.cast))`),
      T("yt-avatar","CircleAvatar","The signed-in user's photo is clipped into a small circle, which is the compact identity pattern used across Google apps.",[],`const CircleAvatar(radius: 14, backgroundImage: AssetImage('avatar.png'))`)
    ],`AppBar(\n  title: const YouTubeLogo(),\n  actions: const [SearchAction(), CastAction(), ProfileAvatar()],\n)`),
    T("yt-body","ListView","The feed is a lazily built vertical list, so only the video cards on screen are built and the feed can scroll through hundreds of videos.",[
      T("yt-chips-row","Row","Topic chips sit in one horizontal row under the top bar, so the user can filter the feed by tapping a single word.",[
        T("yt-chip-all","Chip","The selected 'All' chip shows the unfiltered feed, and its filled style marks it as the active filter.",[],`const Chip(label: Text('All'))`,"A compact, tappable label that filters a list by one topic."),
        T("yt-chip-music","Chip","Tapping 'Music' narrows the feed to music videos, so the user reaches a mood without typing a search.",[],`const Chip(label: Text('Music'))`,"A compact, tappable label that filters a list by one topic."),
        T("yt-chip-flutter","Chip","Tapping 'Flutter' narrows the feed to Flutter tutorials, which is how the home feed personalises itself to what the user watches.",[],`const Chip(label: Text('Flutter'))`,"A compact, tappable label that filters a list by one topic."),
        T("yt-chip-gaming","Chip","Tapping 'Gaming' narrows the feed to game videos, keeping the filter row useful for very different interests.",[],`const Chip(label: Text('Gaming'))`,"A compact, tappable label that filters a list by one topic.")
      ]),
      T("yt-card-one","Card","Each video is grouped on one card surface, so its thumbnail, channel, and title are clearly one tappable unit in the feed.",[
        T("yt-card-one-col","Column","The thumbnail stacks above the video details, which is the vertical order every YouTube feed card follows.",[
          T("yt-thumbnail","Stack","The thumbnail layers the duration badge on top of the image, so the video length is visible without covering the artwork.",[
            T("yt-thumb-image","Image","The thumbnail is the video's poster frame, and a 16:9 image is what makes a viewer decide to tap.",[],`Image.network(video.thumbnailUrl, fit: BoxFit.cover)`),
            T("yt-duration","Container","A small dark box with padding sits in the corner of the thumbnail, giving the duration text a readable background.",[
              T("yt-duration-text","Text","The running time tells the viewer how long the video is before they commit to watching it.",[],`const Text('12:48', style: TextStyle(color: Colors.white, fontSize: 11))`)
            ])
          ]),
          T("yt-card-one-info","Row","The channel avatar, the video text, and the overflow menu share one horizontal line under the thumbnail.",[
            T("yt-channel-avatar","CircleAvatar","A small circular channel photo identifies who uploaded the video at a glance, without taking a full line.",[],`const CircleAvatar(radius: 16, backgroundImage: AssetImage('channel.png'))`),
            T("yt-card-one-text","Column","Title, channel name, and view count stack vertically, so the eye reads the video's details top to bottom.",[
              T("yt-video-title","Text","The title is the video's headline, shown in two lines at most so the card stays compact in the feed.",[],`const Text('Build a Flutter app in 20 minutes', maxLines: 2, style: TextStyle(fontWeight: FontWeight.w600))`),
              T("yt-channel-row","Row","The channel name and its verified tick sit on one line, so trust and identity are read together.",[
                T("yt-channel-name","Text","The channel name tells the viewer whose video this is, in a smaller, quieter style than the title.",[],`const Text('FlutterForward', style: TextStyle(fontSize: 12))`),
                T("yt-verified","Icon","A small check mark proves the channel is verified, which helps the viewer trust the source before tapping.",[],`const Icon(Icons.verified, size: 12)`)
              ]),
              T("yt-video-meta","Text","Views and upload time are combined in one grey line, giving the video's popularity and freshness at a glance.",[],`const Text('1.2M views • 3 days ago', style: TextStyle(fontSize: 12))`)
            ]),
            T("yt-more","IconButton","The three-dot menu hides secondary actions like Save to Watch later, so the card stays clean until the user asks for more.",[],`IconButton(onPressed: showVideoMenu, icon: const Icon(Icons.more_vert))`)
          ])
        ])
      ]),
      T("yt-card-two","Card","A second card repeats the same layout, which is how the feed shows that every video follows one consistent pattern.",[
        T("yt-card-two-col","Column","The second card stacks its thumbnail above its details exactly like the first, keeping the feed rhythm predictable.",[
          T("yt-thumbnail-two","Stack","The second thumbnail also layers its duration badge over the image, so the length is visible on every card.",[
            T("yt-thumb-image-two","Image","A different poster frame marks this as a different video, while the same 16:9 shape keeps the feed uniform.",[],`Image.network(video.thumbnailUrl, fit: BoxFit.cover)`),
            T("yt-duration-two","Container","The same dark corner box carries this video's duration, so the badge looks identical on every card.",[
              T("yt-duration-text-two","Text","This video's running time is shown before playback, letting the viewer pick a short watch over a long one.",[],`const Text('8:03', style: TextStyle(color: Colors.white, fontSize: 11))`)
            ])
          ]),
          T("yt-card-two-info","Row","Avatar, text, and menu repeat in the same horizontal line, so the second card is instantly recognisable as a video.",[
            T("yt-channel-avatar-two","CircleAvatar","A different channel's circular photo identifies this uploader, proving the avatar belongs to the video, not the screen.",[],`const CircleAvatar(radius: 16, backgroundImage: AssetImage('channel2.png'))`),
            T("yt-card-two-text","Column","Title, channel, and stats stack in the same order as the first card, so the eye knows exactly where to look.",[
              T("yt-video-title-two","Text","This title describes a different video, and the two-line limit keeps both cards the same height.",[],`const Text('Dart null safety, explained simply', maxLines: 2, style: TextStyle(fontWeight: FontWeight.w600))`),
              T("yt-channel-name-two","Text","The second channel's name is shown in the same quiet style, so the two cards feel like one list.",[],`const Text('Code with Dheeraj', style: TextStyle(fontSize: 12))`),
              T("yt-video-meta-two","Text","Views and upload time are repeated here, so each card carries its own popularity and freshness.",[],`const Text('845K views • 1 week ago', style: TextStyle(fontSize: 12))`)
            ]),
            T("yt-more-two","IconButton","Every card gets its own overflow menu, so actions like Save apply to that video and not the one above it.",[],`IconButton(onPressed: showVideoMenu, icon: const Icon(Icons.more_vert))`)
          ])
        ])
      ])
    ]),
    T("yt-bottom","BottomNavigationBar","The bottom bar keeps the app's five main destinations one thumb-tap away, which is why it never scrolls away with the feed.",[
      T("yt-nav-home","BottomNavigationBarItem","Home is the first destination and the selected one, so its filled icon and red label show where the user is.",[],`const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home')`,"One destination inside a BottomNavigationBar, with an icon and a label."),
      T("yt-nav-shorts","BottomNavigationBarItem","Shorts opens vertical short-form video, a separate feed from the home list, so it gets its own destination.",[],`const BottomNavigationBarItem(icon: Icon(Icons.play_arrow), label: 'Shorts')`,"One destination inside a BottomNavigationBar, with an icon and a label."),
      T("yt-nav-create","BottomNavigationBarItem","The plus in the middle is the create action, placed centrally because uploading is a primary action, not a hidden one.",[],`const BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: '')`,"One destination inside a BottomNavigationBar, with an icon and a label."),
      T("yt-nav-subs","BottomNavigationBarItem","Subscriptions shows only channels the user follows, so it is a personal feed rather than the algorithmic home feed.",[],`const BottomNavigationBarItem(icon: Icon(Icons.subscriptions_outlined), label: 'Subscriptions')`,"One destination inside a BottomNavigationBar, with an icon and a label."),
      T("yt-nav-you","BottomNavigationBarItem","You opens the user's own library, history, and profile, grouping everything personal under one destination.",[],`const BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'You')`,"One destination inside a BottomNavigationBar, with an icon and a label.")
    ],`BottomNavigationBar(\n  currentIndex: 0,\n  selectedItemColor: const Color(0xFFFF0000),\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.play_arrow), label: 'Shorts'),\n    BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: ''),\n    BottomNavigationBarItem(icon: Icon(Icons.subscriptions_outlined), label: 'Subscriptions'),\n    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'You'),\n  ],\n)`)
  ],`Scaffold(\n  appBar: const YouTubeAppBar(),\n  body: const HomeFeed(),\n  bottomNavigationBar: const YouTubeBottomNav(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF0000)),\n  home: const YouTubeHome(),\n)`);

TEARDOWNS.spotify.root = T("sp-material","MaterialApp","One dark Material theme and navigation context covers the whole Spotify home screen.",[
  T("sp-scaffold","Scaffold","The greeting bar, scrollable home feed, mini player, and bottom navigation share one stable screen frame.",[
    T("sp-appbar","AppBar","The greeting and quick actions stay visible at the top while the feed scrolls below.",[
      T("sp-greeting","Text","Shows the time-of-day greeting at the top of home.",[],`const Text(\n  'Good evening',\n  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),\n)`),
      T("sp-bell","IconButton","Opens notifications without leaving home.",[],`IconButton(onPressed: openNotifications, icon: const Icon(Icons.notifications_outlined))`),
      T("sp-history","IconButton","Opens recently played history.",[],`IconButton(onPressed: openHistory, icon: const Icon(Icons.history))`),
      T("sp-settings","IconButton","Opens app settings from the home bar.",[],`IconButton(onPressed: openSettings, icon: const Icon(Icons.settings_outlined))`)
    ],`AppBar(\n  title: const Text('Good evening'),\n  actions: [\n    IconButton(onPressed: openNotifications, icon: const Icon(Icons.notifications_outlined)),\n    IconButton(onPressed: openHistory, icon: const Icon(Icons.history)),\n    IconButton(onPressed: openSettings, icon: const Icon(Icons.settings_outlined)),\n  ],\n)`),
    T("sp-body","Column","The feed expands to fill the screen while the mini player stays pinned just above the bottom navigation.",[
      T("sp-content","Expanded","The home feed takes every pixel not used by the mini player.",[
        T("sp-feed","ListView","Home sections are built lazily and scroll vertically as one feed.",[
          T("sp-chips","Row","The filter chips sit on one horizontal line under the greeting.",[
            T("sp-chip-all","FilterChip","Shows everything when selected; it is the default home filter.",[],`FilterChip(\n  label: const Text('All'),\n  selected: true,\n  onSelected: filterHome,\n)`,"A compact selectable chip that filters a list by one category."),
            T("sp-chip-music","FilterChip","Narrows home to music only when tapped.",[],`FilterChip(\n  label: const Text('Music'),\n  selected: false,\n  onSelected: filterHome,\n)`,"A compact selectable chip that filters a list by one category."),
            T("sp-chip-podcasts","FilterChip","Narrows home to podcasts only when tapped.",[],`FilterChip(\n  label: const Text('Podcasts'),\n  selected: false,\n  onSelected: filterHome,\n)`,"A compact selectable chip that filters a list by one category.")
          ]),
          T("sp-quick-grid","GridView","Six shortcuts are packed into a tight two-column grid so the most-played mixes are one tap away.",[
            T("sp-card-one","Card","One shortcut reads as a single tappable tile: square art on the left, title on the right.",[
              T("sp-card-row","Row","Art and title share one horizontal line inside the tile.",[
                T("sp-card-art","Image","Shows the playlist cover art at the left edge of the tile.",[],`Image.asset(\n  'assets/covers/liked_songs.png',\n  width: 56,\n  height: 56,\n  fit: BoxFit.cover,\n)`),
                T("sp-card-label","Text","Names the playlist or mix on the tile.",[],`const Text(\n  'Liked Songs',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
              ])
            ])
          ],`GridView.count(\n  crossAxisCount: 2,\n  shrinkWrap: true,\n  physics: const NeverScrollableScrollPhysics(),\n  mainAxisSpacing: 8,\n  crossAxisSpacing: 8,\n  childAspectRatio: 3.2,\n  children: const [QuickMixCard(), QuickMixCard()],\n)`,"Builds a scrollable grid of tiles with a fixed number of columns."),
          T("sp-recent-title","Text","Heads the recently played section so the feed reads as clear groups.",[],`const Text(\n  'Recently played',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),\n)`),
          T("sp-recent-grid","GridView","Recent albums sit in a two-column grid, so four of them are visible without scrolling far.",[
            T("sp-recent-card","Card","One recent item reads as a single tile: cover art above its title and artist.",[
              T("sp-recent-col","Column","Art, title, and artist are stacked inside the tile.",[
                T("sp-recent-art","Image","Shows the album or playlist cover for the recent item.",[],`Image.asset(\n  'assets/covers/after_hours.png',\n  fit: BoxFit.cover,\n)`),
                T("sp-recent-name","Text","Names the album or playlist.",[],`const Text(\n  'After Hours',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                T("sp-recent-artist","Text","Names the artist under the title, in a quieter style.",[],`const Text(\n  'The Weeknd',\n  style: TextStyle(color: Colors.grey),\n)`)
              ])
            ])
          ],`GridView.count(\n  crossAxisCount: 2,\n  shrinkWrap: true,\n  physics: const NeverScrollableScrollPhysics(),\n  mainAxisSpacing: 16,\n  crossAxisSpacing: 16,\n  childAspectRatio: 0.85,\n  children: const [RecentCard(), RecentCard()],\n)`,"Builds a scrollable grid of tiles with a fixed number of columns."),
          T("sp-made-title","Text","Heads the personalised mixes section.",[],`const Text(\n  'Made for you',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),\n)`),
          T("sp-made-list","ListView","Made-for-you mixes scroll sideways, so the vertical feed stays short while many mixes stay reachable.",[
            T("sp-made-card","Card","One mix reads as a single card: square art above its title and short description.",[
              T("sp-made-col","Column","Art, title, and description are stacked inside the card.",[
                T("sp-made-art","Image","Shows the mix cover art at the top of the card.",[],`Image.asset(\n  'assets/covers/daily_mix.png',\n  fit: BoxFit.cover,\n)`),
                T("sp-made-name","Text","Names the personalised mix.",[],`const Text(\n  'Daily Mix 1',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                T("sp-made-desc","Text","Explains what is inside the mix in one short line.",[],`const Text(\n  'The Weeknd, Dua Lipa and more',\n  style: TextStyle(color: Colors.grey),\n)`)
              ])
            ])
          ],`SizedBox(\n  height: 210,\n  child: ListView.builder(\n    scrollDirection: Axis.horizontal,\n    itemCount: mixes.length,\n    itemBuilder: (_, index) => MadeForYouCard(mixes[index]),\n  ),\n)`)
        ])
      ]),
      T("sp-player","Container","A dark rounded bar floats above the bottom navigation so playback controls are always one tap away.",[
        T("sp-player-col","Column","The player row sits above a thin progress line inside the same bar.",[
          T("sp-player-row","Row","Cover art, song info, and playback actions share one line.",[
            T("sp-player-art","ClipRRect","Rounds the corners of the small square cover art.",[
              T("sp-player-img","Image","Shows the cover of the song that is playing.",[],`Image.asset(\n  'assets/covers/blinding_lights.png',\n  width: 40,\n  height: 40,\n  fit: BoxFit.cover,\n)`)
            ]),
            T("sp-player-info","Column","The song title sits above the artist name.",[
              T("sp-player-title","Text","Shows the title of the song that is playing.",[],`const Text(\n  'Blinding Lights',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sp-player-artist","Text","Shows the artist of the song that is playing.",[],`const Text(\n  'The Weeknd',\n  style: TextStyle(color: Colors.grey),\n)`)
            ]),
            T("sp-player-devices","IconButton","Opens the list of speakers and devices to play on.",[],`IconButton(onPressed: openDevices, icon: const Icon(Icons.speaker_outlined))`),
            T("sp-player-play","IconButton","Pauses or resumes the current song from anywhere in the app.",[],`IconButton(onPressed: togglePlay, icon: const Icon(Icons.pause))`)
          ]),
          T("sp-player-progress","LinearProgressIndicator","A thin green line shows how far through the song playback is.",[],`const LinearProgressIndicator(\n  value: 0.42,\n  color: Color(0xFF1DB954),\n  backgroundColor: Color(0xFF4D4D4D),\n)`,"A thin horizontal bar that shows progress through a task or track.")
        ])
      ],`Container(\n  margin: const EdgeInsets.fromLTRB(8, 0, 8, 8),\n  decoration: BoxDecoration(\n    color: const Color(0xFF282828),\n    borderRadius: BorderRadius.circular(8),\n  ),\n  child: const MiniPlayer(),\n)`)
    ]),
    T("sp-bottom","BottomNavigationBar","Home, Search, and Your Library stay reachable from every screen.",[
      T("sp-nav-home","BottomNavigationBarItem","Takes the user back to the home feed.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.home),\n  label: 'Home',\n)`,"One destination inside a BottomNavigationBar: an icon plus a label."),
      T("sp-nav-search","BottomNavigationBarItem","Opens search for songs, artists, and playlists.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.search),\n  label: 'Search',\n)`,"One destination inside a BottomNavigationBar: an icon plus a label."),
      T("sp-nav-library","BottomNavigationBarItem","Opens the user's saved playlists and albums.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.library_music_outlined),\n  label: 'Your Library',\n)`,"One destination inside a BottomNavigationBar: an icon plus a label.")
    ],`BottomNavigationBar(\n  currentIndex: 0,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),\n    BottomNavigationBarItem(icon: Icon(Icons.library_music_outlined), label: 'Your Library'),\n  ],\n)`)
  ],`Scaffold(\n  appBar: const HomeAppBar(),\n  body: const HomeBody(),\n  bottomNavigationBar: const HomeBottomNav(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark(),\n  home: const SpotifyHome(),\n)`);

TEARDOWNS.amazon.root = T("am-material","MaterialApp","The Amazon home screen inherits one shared theme and navigation context.",[
  T("am-scaffold","Scaffold","Search, home content, and bottom navigation share one stable page frame.",[
    T("am-appbar","AppBar","Search and the cart stay visible at the top of the home screen.",[
      T("am-search-row","Row","The search field and the cart action share the header line.",[
        T("am-search-expanded","Expanded","The search field takes all the space the cart button does not need.",[
          T("am-search-field","TextField","Shoppers type a product, brand, or category here to search the catalogue.",[
            T("am-search-icon","Icon","A magnifier marks this field as a search box before anything is typed.",[],`const Icon(Icons.search, color: Color(0xFF767676))`),
            T("am-search-hint","Text","The hint tells shoppers what they can search for.",[],`const Text('Search Amazon.in', style: TextStyle(color: Color(0xFF767676)))`),
            T("am-mic","IconButton","Starts voice search so shoppers can speak instead of typing.",[],`IconButton(\n  onPressed: startVoiceSearch,\n  icon: const Icon(Icons.mic),\n)`),
            T("am-camera","IconButton","Opens the camera so shoppers can search by taking a photo of a product.",[],`IconButton(\n  onPressed: openLens,\n  icon: const Icon(Icons.camera_alt_outlined),\n)`)
          ],`TextField(\n  decoration: const InputDecoration(\n    hintText: 'Search Amazon.in',\n    prefixIcon: Icon(Icons.search),\n    suffixIcon: Row(\n      mainAxisSize: MainAxisSize.min,\n      children: [Icon(Icons.mic), Icon(Icons.camera_alt_outlined)],\n    ),\n    filled: true,\n    fillColor: Colors.white,\n    border: OutlineInputBorder(borderSide: BorderSide.none),\n  ),\n)`)
        ]),
        T("am-cart-stack","Stack","The cart icon and its count badge are layered in the same spot.",[
          T("am-cart","IconButton","Opens the cart to review items before checkout.",[],`IconButton(\n  onPressed: openCart,\n  icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),\n)`),
          T("am-cart-badge","Positioned","The badge is pinned to the top corner of the cart icon.",[
            T("am-cart-count","Text","Shows how many items are already in the cart.",[],`const Text(\n  '2',\n  style: TextStyle(color: Color(0xFF131921), fontSize: 11, fontWeight: FontWeight.w800),\n)`)
          ],null,"Positions a child relative to the edges of its Stack.")
        ])
      ])
    ],`AppBar(\n  backgroundColor: const Color(0xFF131921),\n  title: const SearchBar(),\n  actions: [CartButton()],\n)`),
    T("am-body","ListView","Location, categories, the deal banner, and product results scroll as one home feed.",[
      T("am-location-row","Row","Pin, delivery address, and chevron share one compact line.",[
        T("am-location-icon","Icon","A pin marks this row as the delivery location.",[],`const Icon(Icons.location_on_outlined, color: Colors.white, size: 16)`),
        T("am-location-text","Text","Shows where the order will be delivered, so shoppers can spot a wrong address.",[],`const Text(\n  'Deliver to Dheeraj - Jaipur 302001',\n  overflow: TextOverflow.ellipsis,\n  style: TextStyle(color: Colors.white),\n)`),
        T("am-location-chevron","Icon","A chevron hints the location can be changed with a tap.",[],`const Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 16)`)
      ]),
      T("am-chips","ListView","Category chips scroll sideways so shoppers can filter without leaving the home feed.",[
        T("am-chip-deals","Chip","A tappable label that filters the feed to today's deals.",[
          T("am-chip-deals-text","Text","Names the deals filter.",[],`const Text('Deals')`)
        ],`const Chip(label: Text('Deals'))`,"Shows a compact, tappable label for one filter or category."),
        T("am-chip-prime","Chip","A tappable label that filters the feed to Prime-eligible products.",[
          T("am-chip-prime-text","Text","Names the Prime filter.",[],`const Text('Prime')`)
        ],`const Chip(label: Text('Prime'))`,"Shows a compact, tappable label for one filter or category."),
        T("am-chip-electronics","Chip","A tappable label that filters the feed to electronics.",[
          T("am-chip-electronics-text","Text","Names the electronics filter.",[],`const Text('Electronics')`)
        ],`const Chip(label: Text('Electronics'))`,"Shows a compact, tappable label for one filter or category."),
        T("am-chip-fashion","Chip","A tappable label that filters the feed to fashion.",[
          T("am-chip-fashion-text","Text","Names the fashion filter.",[],`const Text('Fashion')`)
        ],`const Chip(label: Text('Fashion'))`,"Shows a compact, tappable label for one filter or category."),
        T("am-chip-grocery","Chip","A tappable label that filters the feed to grocery.",[
          T("am-chip-grocery-text","Text","Names the grocery filter.",[],`const Text('Grocery')`)
        ],`const Chip(label: Text('Grocery'))`,"Shows a compact, tappable label for one filter or category.")
      ],`ListView.separated(\n  scrollDirection: Axis.horizontal,\n  itemCount: categories.length,\n  itemBuilder: (_, index) => FilterChip(categories[index]),\n  separatorBuilder: (_, __) => const SizedBox(width: 6),\n)`),
      T("am-hero","Card","The deal of the day reads as one prominent promotional surface.",[
        T("am-hero-stack","Stack","The banner image and its headline are layered in the same box.",[
          T("am-hero-image","Image","Shows the promotional artwork behind the deal headline.",[],`Image.asset(\n  'assets/deal_banner.png',\n  fit: BoxFit.cover,\n)`),
          T("am-hero-copy","Column","Kicker, headline, and button are stacked over the banner image.",[
            T("am-hero-kicker","Text","Labels the banner as the deal of the day.",[],`const Text(\n  'DEAL OF THE DAY',\n  style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),\n)`),
            T("am-hero-title","Text","States the headline offer in one line.",[],`const Text(\n  'Up to 70% off | Headphones',\n  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),\n)`),
            T("am-hero-cta","ElevatedButton","Takes shoppers straight to the deal's product list.",[
              T("am-hero-cta-text","Text","Labels the deal action.",[],`const Text('Shop now')`)
            ],`ElevatedButton(\n  onPressed: openDeal,\n  child: const Text('Shop now'),\n)`,"Shows a primary action with a filled background and elevation.")
          ])
        ])
      ]),
      T("am-section-title","Text","Introduces the product results below the banner.",[],`const Text(\n  'Best deals for you',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
      T("am-grid","GridView","Products are laid out in two columns so shoppers can compare them at a glance.",[
        T("am-product-card","Card","One product's image, rating, price, and Prime badge stay grouped.",[
          T("am-product-column","Column","Product image sits above its details.",[
            T("am-product-image-clip","ClipRRect","The product image follows the card's top corners.",[
              T("am-product-image","Image","Shows the product photo.",[],`Image.asset(\n  product.image,\n  height: 74,\n  fit: BoxFit.cover,\n)`)
            ]),
            T("am-product-padding","Padding","Product text gets a compact inset from the card edge.",[
              T("am-product-details","Column","Title, rating, price, and Prime badge are stacked.",[
                T("am-product-title","Text","Shows the product name.",[],`Text(product.name, style: const TextStyle(fontWeight: FontWeight.w700))`),
                T("am-product-stars","Row","Stars and the numeric rating share one line.",[
                  T("am-product-rating","Text","Shows the star rating and how many shoppers rated it.",[],`Text('\${product.stars} \\u2605 \\u00b7 \${product.rating}')`)
                ]),
                T("am-product-price-row","Row","Sale price and struck-through MRP sit side by side.",[
                  T("am-product-price","Text","Shows the price shoppers actually pay.",[],`Text(\n  product.price,\n  style: const TextStyle(fontWeight: FontWeight.w800),\n)`),
                  T("am-product-mrp","Text","Shows the original price so the saving is visible.",[],`Text(\n  product.mrp,\n  style: TextStyle(decoration: TextDecoration.lineThrough),\n)`)
                ]),
                T("am-prime-badge","Container","A small blue badge marks Prime-eligible products.",[
                  T("am-prime-text","Text","The Prime mark itself.",[],`const Text(\n  'prime',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800),\n)`)
                ],`Container(\n  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),\n  decoration: BoxDecoration(\n    color: const Color(0xFF00A8E1),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Text('prime'),\n)`)
              ])
            ])
          ])
        ])
      ],`GridView.builder(\n  shrinkWrap: true,\n  physics: const NeverScrollableScrollPhysics(),\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(\n    crossAxisCount: 2,\n    crossAxisSpacing: 10,\n    mainAxisSpacing: 10,\n    childAspectRatio: 0.72,\n  ),\n  itemCount: deals.length,\n  itemBuilder: (_, index) => ProductCard(deals[index]),\n)`,"Lays children out in a scrollable two-dimensional grid.")
    ]),
    T("am-bottom","BottomNavigationBar","Home, Account, Cart, and Menu remain one tap away.",[
      T("am-nav-home","Icon","Represents the active Home destination.",[],`const Icon(Icons.home_outlined)`),
      T("am-nav-account","Icon","Represents the Account destination.",[],`const Icon(Icons.person_outline)`),
      T("am-nav-cart","Icon","Represents the Cart destination.",[],`const Icon(Icons.shopping_bag_outlined)`),
      T("am-nav-menu","Icon","Represents the Menu destination.",[],`const Icon(Icons.menu)`)
    ],`BottomNavigationBar(\n  currentIndex: 0,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Account'),\n    BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), label: 'Cart'),\n    BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'Menu'),\n  ],\n)`)
  ])
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF9900)),\n  home: const AmazonHome(),\n)`);

TEARDOWNS.gmail.root = T("gm-material","MaterialApp","The whole Gmail inbox runs under one Material theme and navigation context.",[
  T("gm-scaffold","Scaffold","The search bar, inbox list, and compose button belong to one stable page frame.",[
    T("gm-appbar","AppBar","The menu, search field, and account avatar stay visible above the inbox.",[
      T("gm-menu","IconButton","Opens the navigation drawer with labels and folders.",[],`IconButton(\n  onPressed: openDrawer,\n  icon: const Icon(Icons.menu),\n)`),
      T("gm-search-expanded","Expanded","The search field takes all the width left between the menu and the avatar.",[
        T("gm-search-field","TextField","Searches mail by sender, subject, or words in the message.",[],`TextField(\n  decoration: const InputDecoration(\n    hintText: 'Search in mail',\n    prefixIcon: Icon(Icons.search),\n    border: InputBorder.none,\n  ),\n)`)
      ]),
      T("gm-avatar","CircleAvatar","Shows who is signed in at a glance.",[],`const CircleAvatar(\n  radius: 16,\n  backgroundColor: Color(0xFF5B5BD6),\n  child: Text('D'),\n)`)
    ],`AppBar(\n  leading: IconButton(\n    onPressed: openDrawer,\n    icon: const Icon(Icons.menu),\n  ),\n  title: const TextField(\n    decoration: InputDecoration(\n      hintText: 'Search in mail',\n      prefixIcon: Icon(Icons.search),\n      border: InputBorder.none,\n    ),\n  ),\n  actions: const [CircleAvatar(radius: 16, child: Text('D'))],\n)`),
    T("gm-body","Column","The Primary label sits above the inbox list, which takes the rest of the screen.",[
      T("gm-label-row","Row","The inbox label and its unread count share one line.",[
        T("gm-primary-label","Text","Names the inbox category shown below.",[],`const Text(\n  'Primary',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
      ]),
      T("gm-inbox-list","ListView","Email tiles are built lazily and stay vertically scrollable.",[
        T("gm-dismissible","Dismissible","Dismissible is the widget that turns a list row into a swipe action: it watches for a horizontal drag on its child and, once the drag passes the threshold, slides the child away and calls onDismissed. In Gmail that is the archive gesture — swipe a mail left-to-right and it leaves the inbox without opening it. A plain ListTile can only be tapped; Dismissible is what gives the row its swipe. The key is not optional: it is how Flutter knows exactly which mail was swiped when the list rebuilds without it.",[
          T("gm-dismiss-bg","Container","A red background sits behind the tile and is revealed only while the tile is being dragged.",[
            T("gm-dismiss-bg-row","Row","The archive icon and its label share one line on the background.",[
              T("gm-dismiss-bg-icon","Icon","The archive icon tells the user what the swipe will do before they let go.",[],`const Icon(Icons.archive_outlined, color: Colors.white)`),
              T("gm-dismiss-bg-label","Text","Labels the swipe action as Archive.",[],`const Text(\n  'Archive',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`)
            ])
          ]),
                  T("gm-tile-1","ListTile","One email reads as a single tappable row.",[
                    T("gm-tile1-avatar","CircleAvatar","The sender gets a compact coloured initial.",[],`const CircleAvatar(\n  backgroundColor: Color(0xFF02569B),\n  child: Text('F'),\n)`),
                    T("gm-tile1-body","Column","Sender, subject, and snippet stack inside the tile.",[
                      T("gm-tile1-sender","Text","Shows who sent the email.",[],`const Text(\n  'FlutterForward',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                      T("gm-tile1-subject","Text","Shows what the email is about.",[],`const Text(\n  'Your 40-lesson Flutter course is live',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                      T("gm-tile1-snippet","Text","Shows the first line so the inbox can be skimmed.",[],`const Text('All lessons, quizzes and ranks in one place…')`)
                    ]),
                    T("gm-tile1-time","Text","Shows when the email arrived.",[],`const Text('9:41', style: TextStyle(fontSize: 11))`),
                    T("gm-tile1-star","IconButton","Stars the email so it can be found later under Starred.",[],`IconButton(\n  onPressed: toggleStar,\n  icon: const Icon(Icons.star, color: Colors.amber),\n)`)
                  ],`ListTile(\n  leading: const CircleAvatar(child: Text('F')),\n  title: const Text('FlutterForward'),\n  subtitle: const Text('Your 40-lesson Flutter course is live'),\n  trailing: const Icon(Icons.star, color: Colors.amber),\n  onTap: openEmail,\n)`,"Groups a leading avatar, title, subtitle, and trailing action into one tappable row.")
        ],`Dismissible(\n  key: const ValueKey('mail-1'),\n  direction: DismissDirection.startToEnd,\n  background: Container(\n    color: const Color(0xFFEA4335),\n    alignment: Alignment.centerLeft,\n    padding: const EdgeInsets.only(left: 16),\n    child: const Row(\n      mainAxisSize: MainAxisSize.min,\n      children: [\n        Icon(Icons.archive_outlined, color: Colors.white),\n        SizedBox(width: 8),\n        Text('Archive', style: TextStyle(color: Colors.white)),\n      ],\n    ),\n  ),\n  onDismissed: (_) => archiveMail('mail-1'),\n  child: const MailTile(mail: mails[0]),\n)`,"Wraps a list row so swiping it away runs an action such as archive or delete."),
        T("gm-tile-2","ListTile","One email reads as a single tappable row.",[
          T("gm-tile2-avatar","CircleAvatar","The sender gets a compact coloured initial.",[],`const CircleAvatar(\n  backgroundColor: Color(0xFF188038),\n  child: Text('R'),\n)`),
          T("gm-tile2-body","Column","Sender, subject, and snippet stack inside the tile.",[
            T("gm-tile2-sender","Text","Shows who sent the email.",[],`const Text('RTU Kota')`),
            T("gm-tile2-subject","Text","Shows what the email is about.",[],`const Text('Exam timetable: V Sem main exams')`),
            T("gm-tile2-snippet","Text","Shows the first line so the inbox can be skimmed.",[],`const Text('Reporting 10:00 AM, first paper 27 Nov…')`)
          ]),
          T("gm-tile2-time","Text","Shows when the email arrived.",[],`const Text('8:15', style: TextStyle(fontSize: 11))`),
          T("gm-tile2-attach","Icon","Marks that the email carries a file attachment.",[],`const Icon(Icons.attach_file, size: 14)`),
          T("gm-tile2-star","IconButton","Stars the email so it can be found later under Starred.",[],`IconButton(\n  onPressed: toggleStar,\n  icon: const Icon(Icons.star_border),\n)`)
        ],`ListTile(\n  leading: const CircleAvatar(child: Text('R')),\n  title: const Text('RTU Kota'),\n  subtitle: const Text('Exam timetable: V Sem main exams'),\n  trailing: const Icon(Icons.attach_file),\n  onTap: openEmail,\n)`,"Groups a leading avatar, title, subtitle, and trailing action into one tappable row."),
        T("gm-tile-3","ListTile","One email reads as a single tappable row.",[
          T("gm-tile3-avatar","CircleAvatar","The sender gets a compact coloured initial.",[],`const CircleAvatar(\n  backgroundColor: Color(0xFF24292F),\n  child: Text('G'),\n)`),
          T("gm-tile3-body","Column","Sender, subject, and snippet stack inside the tile.",[
            T("gm-tile3-sender","Text","Shows who sent the email.",[],`const Text('GitHub')`),
            T("gm-tile3-subject","Text","Shows what the email is about.",[],`const Text('[flutterlearn] New pull request #42')`),
            T("gm-tile3-snippet","Text","Shows the first line so the inbox can be skimmed.",[],`const Text('Teardown: Gmail inbox mock ready for review')`)
          ]),
          T("gm-tile3-time","Text","Shows when the email arrived.",[],`const Text('Yesterday', style: TextStyle(fontSize: 11))`),
          T("gm-tile3-star","IconButton","Stars the email so it can be found later under Starred.",[],`IconButton(\n  onPressed: toggleStar,\n  icon: const Icon(Icons.star_border),\n)`)
        ],`ListTile(\n  leading: const CircleAvatar(child: Text('G')),\n  title: const Text('GitHub'),\n  subtitle: const Text('[flutterlearn] New pull request #42'),\n  trailing: const Icon(Icons.star_border),\n  onTap: openEmail,\n)`,"Groups a leading avatar, title, subtitle, and trailing action into one tappable row."),
        T("gm-tile-4","ListTile","One email reads as a single tappable row.",[
          T("gm-tile4-avatar","CircleAvatar","The sender gets a compact coloured initial.",[],`const CircleAvatar(\n  backgroundColor: Color(0xFF7C4DFF),\n  child: Text('D'),\n)`),
          T("gm-tile4-body","Column","Sender, subject, and snippet stack inside the tile.",[
            T("gm-tile4-sender","Text","Shows who sent the email.",[],`const Text('Dheeraj Kumar')`),
            T("gm-tile4-subject","Text","Shows what the email is about.",[],`const Text('Notes: Analysis of Algorithms PYQs')`),
            T("gm-tile4-snippet","Text","Shows the first line so the inbox can be skimmed.",[],`const Text('AoA papers 2019–2024, topic-wise breakdown…')`)
          ]),
          T("gm-tile4-time","Text","Shows when the email arrived.",[],`const Text('Mon', style: TextStyle(fontSize: 11))`),
          T("gm-tile4-star","IconButton","Stars the email so it can be found later under Starred.",[],`IconButton(\n  onPressed: toggleStar,\n  icon: const Icon(Icons.star_border),\n)`)
        ],`ListTile(\n  leading: const CircleAvatar(child: Text('D')),\n  title: const Text('Dheeraj Kumar'),\n  subtitle: const Text('Notes: Analysis of Algorithms PYQs'),\n  trailing: const Icon(Icons.star_border),\n  onTap: openEmail,\n)`,"Groups a leading avatar, title, subtitle, and trailing action into one tappable row.")
      ])
    ]),
    T("gm-fab","FloatingActionButton","A floating action stays above the list so composing is always one tap away.",[],`FloatingActionButton.extended(\n  onPressed: composeEmail,\n  icon: const Icon(Icons.edit),\n  label: const Text('Compose'),\n)`,"A prominent floating action that stays above the scrolling content.")
  ],`Scaffold(\n  appBar: AppBar(\n    title: const TextField(\n      decoration: InputDecoration(hintText: 'Search in mail'),\n    ),\n  ),\n  body: const InboxBody(),\n  floatingActionButton: FloatingActionButton.extended(\n    onPressed: composeEmail,\n    icon: const Icon(Icons.edit),\n    label: const Text('Compose'),\n  ),\n)`)
],`MaterialApp(\n  home: const GmailInbox(),\n)`);

TEARDOWNS.netflix.root = T("nf-material","MaterialApp","The Netflix home screen inherits one dark Material theme and navigation context.",[
  T("nf-scaffold","Scaffold","The top bar, scrolling home content, and bottom navigation share one stable screen frame.",[
    T("nf-appbar","AppBar","The Netflix wordmark, search action, and profile avatar stay visible above the scrolling rows.",[
      T("nf-logo","Text","Shows the Netflix wordmark as the screen identity.",[],`const Text(
  'NETFLIX',
  style: TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w900,
    letterSpacing: 1.5,
    color: Color(0xFFE50914),
  ),
)`),
      T("nf-search-btn","IconButton","Opens search without leaving the home screen.",[],`IconButton(
  onPressed: openSearch,
  icon: const Icon(Icons.search, color: Colors.white),
)`),
      T("nf-avatar","CircleAvatar","The profile avatar is the compact entry point to account switching.",[],`const CircleAvatar(
  radius: 14,
  backgroundColor: Color(0xFFE50914),
  child: Text('D', style: TextStyle(color: Colors.white)),
)`)
    ],`AppBar(
  backgroundColor: Colors.transparent,
  elevation: 0,
  title: const Text('NETFLIX'),
  actions: [
    IconButton(onPressed: openSearch, icon: const Icon(Icons.search)),
    const ProfileAvatar(),
  ],
)`),
    T("nf-body","ListView","The hero banner and every content row scroll together as one vertical list.",[
      T("nf-hero","Stack","The poster image, dark gradient, and title text are layered in the same box.",[
        T("nf-hero-image","Image","The featured show's key art fills the hero area.",[],`Image.network(
  featured.posterUrl,
  fit: BoxFit.cover,
)`),
        T("nf-hero-gradient","Container","A dark gradient sits over the poster's lower half so white text stays readable.",[],`Container(
  decoration: const BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [Colors.transparent, Colors.black87],
    ),
  ),
)`),
        T("nf-hero-content","Column","The title, genre tags, and action buttons are stacked at the bottom of the hero.",[
          T("nf-hero-title","Text","Shows the featured show's title in large bold type.",[],`const Text(
  'STRANGER THINGS',
  style: TextStyle(
    fontSize: 34,
    fontWeight: FontWeight.w900,
    color: Colors.white,
  ),
)`),
          T("nf-hero-genres","Row","Genre tags sit side by side on one line under the title.",[
            T("nf-genre-1","Text","Names the first genre of the featured show.",[],`const Text('Sci-Fi', style: TextStyle(color: Colors.white70))`),
            T("nf-genre-2","Text","Names the second genre of the featured show.",[],`const Text('Drama', style: TextStyle(color: Colors.white70))`),
            T("nf-genre-3","Text","Names the third genre of the featured show.",[],`const Text('Thriller', style: TextStyle(color: Colors.white70))`)
          ]),
          T("nf-hero-actions","Row","The Play and My List buttons share one row so both actions are one tap away.",[
            T("nf-play","ElevatedButton","Starts playback of the featured show immediately.",[
              T("nf-play-icon","Icon","The play triangle signals that tapping starts the video.",[],`const Icon(Icons.play_arrow, color: Colors.black)`),
              T("nf-play-label","Text","Labels the primary hero action.",[],`const Text(
  'Play',
  style: TextStyle(color: Colors.black, fontWeight: FontWeight.w700),
)`)
            ],`ElevatedButton.icon(
  onPressed: playFeatured,
  icon: const Icon(Icons.play_arrow, color: Colors.black),
  label: const Text('Play', style: TextStyle(color: Colors.black)),
  style: ElevatedButton.styleFrom(backgroundColor: Colors.white),
)`, "A filled button for the primary action on a screen."),
            T("nf-mylist","OutlinedButton","Saves the featured show to the user's list without starting playback.",[
              T("nf-mylist-label","Text","Labels the secondary hero action.",[],`const Text('+ My List', style: TextStyle(color: Colors.white))`)
            ],`OutlinedButton.icon(
  onPressed: addToMyList,
  icon: const Icon(Icons.add, color: Colors.white),
  label: const Text('My List', style: TextStyle(color: Colors.white)),
)`)
          ])
        ])
      ]),
      T("nf-trending-section","Column","The section title sits above its horizontal row of posters.",[
        T("nf-trending-title","Text","Labels the Trending Now row so the user knows what the posters are.",[],`const Text(
  'Trending Now',
  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
)`),
        T("nf-trending-row","ListView","Posters scroll sideways so the row shows many titles without lengthening the page.",[
          T("nf-trending-card","Card","One poster and its title are grouped as a single tappable result.",[
            T("nf-trending-poster","Image","The show's poster art is what the user recognises and taps.",[],`Image.network(show.posterUrl, fit: BoxFit.cover)`),
            T("nf-trending-name","Text","Shows the show title under its poster.",[],`Text(show.title, style: const TextStyle(color: Colors.white, fontSize: 12))`)
          ],`Card(
  clipBehavior: Clip.antiAlias,
  color: const Color(0xFF1F1F1F),
  child: Column(
    children: [
      Image.network(show.posterUrl),
      Text(show.title),
    ],
  ),
)`)
        ],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: trending.length,
  itemBuilder: (_, index) => TrendingCard(trending[index]),
)`)
      ]),
      T("nf-top10-section","Column","The section title sits above the ranked Top 10 row.",[
        T("nf-top10-title","Text","Labels the Top 10 row, Netflix's daily ranked chart.",[],`const Text(
  'Top 10 TV Shows Today',
  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
)`),
        T("nf-top10-row","ListView","Ranked titles scroll sideways so all ten stay reachable in one row.",[
          T("nf-top10-card","Row","A giant rank number and its poster sit side by side as one chart entry.",[
            T("nf-top10-rank","Text","The huge outlined number shows the show's chart position at a glance.",[],`Text(
  rank.toString(),
  style: const TextStyle(fontSize: 96, fontWeight: FontWeight.w900),
)`),
            T("nf-top10-poster","Image","The poster identifies which show holds that rank.",[],`Image.network(show.posterUrl, fit: BoxFit.cover)`)
          ])
        ],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: top10.length,
  itemBuilder: (_, index) => Top10Card(top10[index], index + 1),
)`)
      ]),
      T("nf-continue-section","Column","The section title sits above the in-progress titles.",[
        T("nf-continue-title","Text","Labels the row of shows the user has already started.",[],`const Text(
  'Continue Watching',
  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: Colors.white),
)`),
        T("nf-continue-row","ListView","In-progress titles scroll sideways so the user can resume any of them.",[
          T("nf-continue-card","Column","Poster, progress bar, and title info are stacked as one resumable title.",[
            T("nf-continue-poster","Image","The poster reminds the user which show this progress belongs to.",[],`Image.network(show.posterUrl, fit: BoxFit.cover)`),
            T("nf-continue-progress","LinearProgressIndicator","A thin red bar shows how much of the episode is already watched.",[],`const LinearProgressIndicator(
  value: 0.62,
  backgroundColor: Colors.white24,
  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
)`, "Draws a thin horizontal bar showing a fraction of progress."),
            T("nf-continue-info","Row","The title and remaining time share one line under the progress bar.",[
              T("nf-continue-name","Text","Names the show being resumed.",[],`Text(show.title, style: const TextStyle(color: Colors.white, fontSize: 12))`),
              T("nf-continue-time","Text","Shows how much of the episode is left to watch.",[],`const Text('32m left', style: TextStyle(color: Colors.white70, fontSize: 11))`)
            ])
          ])
        ],`ListView.builder(
  scrollDirection: Axis.horizontal,
  itemCount: continueWatching.length,
  itemBuilder: (_, index) => ContinueCard(continueWatching[index]),
)`)
      ])
    ]),
    T("nf-bottom","BottomNavigationBar","Five primary destinations stay reachable at the bottom of every home visit.",[
      T("nf-nav-home","BottomNavigationBarItem","Takes the user to the home feed.",[],`const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home')`, "One destination inside a BottomNavigationBar, with its icon and label."),
      T("nf-nav-search","BottomNavigationBarItem","Takes the user to search and browse by genre.",[],`const BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search')`, "One destination inside a BottomNavigationBar, with its icon and label."),
      T("nf-nav-coming","BottomNavigationBarItem","Takes the user to upcoming releases and trailers.",[],`const BottomNavigationBarItem(icon: Icon(Icons.video_library), label: 'Coming Soon')`, "One destination inside a BottomNavigationBar, with its icon and label."),
      T("nf-nav-downloads","BottomNavigationBarItem","Takes the user to titles saved for offline watching.",[],`const BottomNavigationBarItem(icon: Icon(Icons.download), label: 'Downloads')`, "One destination inside a BottomNavigationBar, with its icon and label."),
      T("nf-nav-more","BottomNavigationBarItem","Opens the menu with profile, settings, and account options.",[],`const BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'More')`, "One destination inside a BottomNavigationBar, with its icon and label.")
    ],`BottomNavigationBar(
  currentIndex: 0,
  backgroundColor: Colors.black,
  selectedItemColor: Colors.white,
  unselectedItemColor: Colors.grey,
  type: BottomNavigationBarType.fixed,
  items: const [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
    BottomNavigationBarItem(icon: Icon(Icons.video_library), label: 'Coming Soon'),
    BottomNavigationBarItem(icon: Icon(Icons.download), label: 'Downloads'),
    BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'More'),
  ],
)`)
  ],`Scaffold(
  appBar: const NetflixAppBar(),
  body: const NetflixHomeBody(),
  bottomNavigationBar: const NetflixBottomNav(),
)`)
],`MaterialApp(
  theme: ThemeData.dark().copyWith(
    scaffoldBackgroundColor: const Color(0xFF141414),
  ),
  home: const NetflixHome(),
)`);

TEARDOWNS.calculator.root = T("calc-material","MaterialApp","MaterialApp sits at the top of the app and gives every screen one theme, one navigation stack, and one Material look.",[
  T("calc-scaffold","Scaffold","Scaffold frames the single calculator screen, so the display takes the top half and the key grid stays docked at the bottom. Without it the display and the keys would be separate widgets with nothing keeping them aligned.",[
    T("calc-body","Column","The display stacks above the key grid, which is the vertical order every calculator follows: read the result on top, press keys below.",[
      T("calc-display","Expanded","The display takes all the vertical space the key grid does not need, so the expression has room to breathe on tall screens and the keys stay the same size.",[
        T("calc-display-col","Column","The previous entry, the live expression, and the result stack vertically and align to the right, so the eye reads the calculation top to bottom.",[
          T("calc-history","Text","The small grey line shows the previous entry, so the user can see what was just calculated without it competing with the live expression.",[],`const Text('128 × 45', style: TextStyle(color: Colors.grey, fontSize: 16))`),
          T("calc-display-fit","FittedBox","The display has a fixed width, but the expression keeps growing as the user types. FittedBox with BoxFit.scaleDown shrinks the whole expression so the full calculation stays visible instead of clipping off the edge. That shrinking is exactly why the calculator is the home for FittedBox: no other app on this list has text that must fit a fixed box.",[
            T("calc-display-text","Text","The live expression is the largest text on screen, so it reads at a glance while typing.",[],`const Text('128 × 45 + 3,592 − 128 ÷ 4', style: TextStyle(fontSize: 48, fontWeight: FontWeight.w300))`)
          ],`FittedBox(\n  fit: BoxFit.scaleDown,\n  alignment: Alignment.centerRight,\n  child: const Text('128 × 45 + 3,592 − 128 ÷ 4', style: TextStyle(fontSize: 48)),\n)`, "Scales its child up or down so it fits the available box."),
          T("calc-result","Text","The result sits under the expression in the brand blue, so the answer is unmistakable once equals is pressed.",[],`const Text('= 9,320', style: TextStyle(color: Color(0xFF1A73E8), fontSize: 28, fontWeight: FontWeight.w500))`)
        ])
      ]),
      T("calc-keys","GridView","The 20 keys are laid out in 4 columns by a grid, so every key is the same size and the pad fills the width exactly. Taught in depth in Spotify — Home grids; here it is the key pad, not a content feed.",[
        T("calc-key-ac","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player, where the same widget forces the 16:9 player; here it forces square keys.",[
          T("calc-keybtn-ac","ElevatedButton","AC clears the whole calculation and resets the display to zero.",[
            T("calc-keytext-ac","Text","The 'AC' label names the clear-all action.",[],`const Text('AC', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: clearAll,\n  child: const Text('AC'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-lparen","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-lparen","ElevatedButton","The opening bracket starts a grouped part of the calculation, so what is inside it is worked out first.",[
            T("calc-keytext-lparen","Text","The '(' label marks the open-bracket key.",[],`const Text('(', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append('('),\n  child: const Text('('),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-rparen","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-rparen","ElevatedButton","The closing bracket ends the grouped part of the calculation.",[
            T("calc-keytext-rparen","Text","The ')' label marks the close-bracket key.",[],`const Text(')', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append(')'),\n  child: const Text(')'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-div","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-div","ElevatedButton","Divide is one of the four operators, shown in the brand blue so operators stand apart from the digits.",[
            T("calc-keytext-div","Text","The '÷' label marks the divide key.",[],`const Text('÷', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append('÷'),\n  child: const Text('÷'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-7","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-7","ElevatedButton","Tapping 7 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-7","Text","The '7' label is the digit itself.",[],`const Text('7', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('7'),\n  child: const Text('7'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-8","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-8","ElevatedButton","Tapping 8 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-8","Text","The '8' label is the digit itself.",[],`const Text('8', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('8'),\n  child: const Text('8'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-9","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-9","ElevatedButton","Tapping 9 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-9","Text","The '9' label is the digit itself.",[],`const Text('9', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('9'),\n  child: const Text('9'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-mul","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-mul","ElevatedButton","Multiply is one of the four operators, shown in the brand blue so operators stand apart from the digits.",[
            T("calc-keytext-mul","Text","The '×' label marks the multiply key.",[],`const Text('×', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append('×'),\n  child: const Text('×'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-4","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-4","ElevatedButton","Tapping 4 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-4","Text","The '4' label is the digit itself.",[],`const Text('4', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('4'),\n  child: const Text('4'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-5","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-5","ElevatedButton","Tapping 5 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-5","Text","The '5' label is the digit itself.",[],`const Text('5', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('5'),\n  child: const Text('5'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-6","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-6","ElevatedButton","Tapping 6 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-6","Text","The '6' label is the digit itself.",[],`const Text('6', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('6'),\n  child: const Text('6'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-sub","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-sub","ElevatedButton","Subtract is one of the four operators, shown in the brand blue so operators stand apart from the digits.",[
            T("calc-keytext-sub","Text","The '−' label marks the subtract key.",[],`const Text('−', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append('−'),\n  child: const Text('−'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-1","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-1","ElevatedButton","Tapping 1 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-1","Text","The '1' label is the digit itself.",[],`const Text('1', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('1'),\n  child: const Text('1'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-2","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-2","ElevatedButton","Tapping 2 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-2","Text","The '2' label is the digit itself.",[],`const Text('2', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('2'),\n  child: const Text('2'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-3","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-3","ElevatedButton","Tapping 3 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-3","Text","The '3' label is the digit itself.",[],`const Text('3', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('3'),\n  child: const Text('3'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-add","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-add","ElevatedButton","Add is one of the four operators, shown in the brand blue so operators stand apart from the digits.",[
            T("calc-keytext-add","Text","The '+' label marks the add key.",[],`const Text('+', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w500))`)
          ],`ElevatedButton(\n  onPressed: () => append('+'),\n  child: const Text('+'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-0","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-0","ElevatedButton","Tapping 0 appends the digit to the current entry, building the number the user is typing.",[
            T("calc-keytext-0","Text","The '0' label is the digit itself.",[],`const Text('0', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('0'),\n  child: const Text('0'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-dot","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-dot","ElevatedButton","The decimal point lets the user type fractions, so 3.5 is entered as 3, point, 5.",[
            T("calc-keytext-dot","Text","The '.' label marks the decimal-point key.",[],`const Text('.', style: TextStyle(fontSize: 22))`)
          ],`ElevatedButton(\n  onPressed: () => append('.'),\n  child: const Text('.'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-del","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-del","ElevatedButton","Backspace deletes the last character typed, so a wrong digit can be fixed without clearing the whole calculation.",[
            T("calc-keytext-del","Text","The '⌫' label marks the backspace key.",[],`const Text('⌫', style: TextStyle(fontSize: 18))`)
          ],`ElevatedButton(\n  onPressed: backspace,\n  child: const Text('⌫'),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square."),
        T("calc-key-eq","AspectRatio","Every key must stay square no matter the screen width, so each key is wrapped in an AspectRatio of 1:1. Taught in depth in YouTube — Video player; here it forces square keys.",[
          T("calc-keybtn-eq","ElevatedButton","Equals works the calculation out and shows the answer in the display, in solid brand blue because it is the one action every calculation ends with.",[
            T("calc-keytext-eq","Text","The '=' label marks the equals key.",[],`const Text('=', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w600))`)
          ],`ElevatedButton(\n  onPressed: calculate,\n  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1A73E8)),\n  child: const Text('='),\n)`, "A filled button with elevation.")
        ],`const AspectRatio(aspectRatio: 1, child: KeyButton())`, "Taught in depth in YouTube — Video player (16:9); here it forces each key into a 1:1 square.")
      ],`GridView.builder(\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(\n    crossAxisCount: 4,\n    crossAxisSpacing: 8,\n    mainAxisSpacing: 8,\n  ),\n  itemCount: keys.length,\n  itemBuilder: (_, index) => CalculatorKey(keys[index]),\n)`, "Taught in depth in Spotify — Home grids; here it lays the 20 calculator keys out in 4 columns.")
    ])
  ],`Scaffold(\n  body: const CalculatorBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFF1A73E8)),\n  home: const CalculatorScreen(),\n)`);

TEARDOWNS.notes.root = T("nt-material","MaterialApp","MaterialApp sits at the top of the app and gives every screen one theme, one navigation stack, and one Material look.",[
  T("nt-scaffold","Scaffold","Scaffold frames the Keep home screen: the search bar and note grid fill the body, the BottomAppBar and NavigationBar stack at the bottom, and the + button docks into the bottom bar's notch. Without it each of those bars would need its own positioning; with it Flutter knows exactly which slot each piece belongs to.",[
    T("nt-body","Column","The search bar stacks above the note grid, so finding a note comes before browsing them.",[
      T("nt-search","SearchBar","The search bar is the first thing on the screen because Keep is searched far more than it is browsed: one tap here searches every note's title and body at once. Taught in depth in YouTube — Search, where the same widget carries a field plus suggestions; here it is the single search entry over the note grid.",[
        T("nt-search-menu","Icon","The hamburger opens the navigation drawer with labels, archive, and trash.",[],`const Icon(Icons.menu)`),
        T("nt-search-hint","Text","The hint tells the user this bar searches notes, not the web.",[],`const Text('Search your notes', style: TextStyle(color: Colors.grey))`),
        T("nt-search-avatar","CircleAvatar","The signed-in user's photo sits at the end of the search bar, so account and settings are one tap away from the home screen.",[],`const CircleAvatar(radius: 14, backgroundImage: AssetImage('avatar.png'))`)
      ],`SearchBar(\n  hintText: 'Search your notes',\n  leading: const Icon(Icons.menu),\n  trailing: [const CircleAvatar(radius: 14, child: Text('DK'))],\n)`, "Taught in depth in YouTube — Search (field + suggestions); here it is the single search entry over the note grid."),
      T("nt-notes-expanded","Expanded","The note grid takes all the space below the search bar, so the notes fill the screen instead of leaving empty space.",[
        T("nt-notes-grid","GridView","The notes are laid out in a two-column grid, so short and tall cards sit side by side like a pinboard instead of one long list. Taught in depth in Spotify — Home grids; here it is the masonry-style note board.",[
          T("nt-note-1","InkWell","A note card has no button inside it — the whole card is the tap target. InkWell wraps the card so a tap anywhere on it opens the note, and the ripple spreading from the touch point tells the user the tap registered. That ripple is the difference from GestureDetector, which detects the tap silently: Keep's cards feel alive because the ink answers every touch.",[
            T("nt-card-1","Card","Card lifts the note onto its own Material surface, so each note reads as one distinct sheet on the pinboard.",[
              T("nt-card-1-col","Column","Title, body, and label stack vertically, so the note reads top to bottom.",[
                T("nt-note-1-title","Text","The title names the note at a glance in the grid.",[],`const Text('Flutter ideas', style: TextStyle(fontWeight: FontWeight.w600))`),
                T("nt-note-1-body","Text","The body carries the note's content in a smaller, quieter style than the title.",[],`const Text('Teardown picker: search by widget name, not by app.', style: TextStyle(fontSize: 12))`),
                T("nt-note-1-labels","Row","Labels sit in one horizontal row under the body, so a note can carry several tags without growing taller.",[
                  T("nt-note-1-chip","Chip","The 'Ideas' label groups this note with every other idea note, and tapping it filters the grid to that label. Taught in depth in YouTube — Home feed chips; here it is a note label.",[],`const Chip(label: Text('Ideas'))`, "A compact, tappable label that filters a list by one topic.")
                ])
              ])
            ])
          ],`InkWell(\n  onTap: openNote,\n  borderRadius: BorderRadius.circular(12),\n  child: const NoteCard(),\n)`, "A tappable area that paints the Material ripple over its child when pressed."),
          T("nt-note-2","InkWell","A note card has no button inside it — the whole card is the tap target, and InkWell's ripple is what confirms the tap. Tapping this card opens the shopping list for editing.",[
            T("nt-card-2","Card","Card lifts the note onto its own Material surface, so each note reads as one distinct sheet on the pinboard.",[
              T("nt-card-2-col","Column","Title and body stack vertically, so the note reads top to bottom.",[
                T("nt-note-2-title","Text","The title names the note at a glance in the grid.",[],`const Text('Shopping list', style: TextStyle(fontWeight: FontWeight.w600))`),
                T("nt-note-2-body","Text","The body carries the note's content in a smaller, quieter style than the title.",[],`const Text('Milk · Eggs · Bread · Coffee', style: TextStyle(fontSize: 12))`)
              ])
            ])
          ],`InkWell(\n  onTap: openNote,\n  borderRadius: BorderRadius.circular(12),\n  child: const NoteCard(),\n)`, "A tappable area that paints the Material ripple over its child when pressed."),
          T("nt-note-3","InkWell","A note card has no button inside it — the whole card is the tap target, and InkWell's ripple is what confirms the tap. Tapping this card opens the meeting notes for editing.",[
            T("nt-card-3","Card","Card lifts the note onto its own Material surface, so each note reads as one distinct sheet on the pinboard.",[
              T("nt-card-3-col","Column","Title and body stack vertically, so the note reads top to bottom.",[
                T("nt-note-3-title","Text","The title names the note at a glance in the grid.",[],`const Text('Meeting notes', style: TextStyle(fontWeight: FontWeight.w600))`),
                T("nt-note-3-body","Text","The body carries the note's content in a smaller, quieter style than the title.",[],`const Text('Ship the 40-lesson course first. Certificates come last.', style: TextStyle(fontSize: 12))`)
              ])
            ])
          ],`InkWell(\n  onTap: openNote,\n  borderRadius: BorderRadius.circular(12),\n  child: const NoteCard(),\n)`, "A tappable area that paints the Material ripple over its child when pressed."),
          T("nt-note-4","InkWell","A note card has no button inside it — the whole card is the tap target, and InkWell's ripple is what confirms the tap. Tapping this card opens the reading list for editing.",[
            T("nt-card-4","Card","Card lifts the note onto its own Material surface, so each note reads as one distinct sheet on the pinboard.",[
              T("nt-card-4-col","Column","Title and body stack vertically, so the note reads top to bottom.",[
                T("nt-note-4-title","Text","The title names the note at a glance in the grid.",[],`const Text('Book to read', style: TextStyle(fontWeight: FontWeight.w600))`),
                T("nt-note-4-body","Text","The body carries the note's content in a smaller, quieter style than the title.",[],`const Text('The Design of Everyday Things — ch. 1–3', style: TextStyle(fontSize: 12))`)
              ])
            ])
          ],`InkWell(\n  onTap: openNote,\n  borderRadius: BorderRadius.circular(12),\n  child: const NoteCard(),\n)`, "A tappable area that paints the Material ripple over its child when pressed.")
        ],`GridView.builder(\n  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(\n    crossAxisCount: 2,\n    crossAxisSpacing: 8,\n    mainAxisSpacing: 8,\n  ),\n  itemCount: notes.length,\n  itemBuilder: (_, index) => NoteCard(notes[index]),\n)`, "Taught in depth in Spotify — Home grids; here it is the two-column note board.")
      ])
    ]),
    T("nt-bottom","BottomAppBar","Keep's create actions — checklist, drawing, audio note, photo note — live in a BottomAppBar pinned to the bottom of the screen, so starting any kind of note is always one tap away. The bar's CircularNotchedRectangle shape cuts a semicircular notch out of its top edge, and the + button docks into that notch instead of floating over the notes. That notch is the whole point of BottomAppBar: a plain Container bar could hold the icons, but only BottomAppBar makes room for the FAB.",[
      T("nt-act-check","IconButton","Starts a new checklist note, with one tappable line per item.",[],`IconButton(onPressed: newChecklist, icon: const Icon(Icons.check_box_outlined))`),
      T("nt-act-draw","IconButton","Starts a new drawing note on a blank canvas.",[],`IconButton(onPressed: newDrawing, icon: const Icon(Icons.brush_outlined))`),
      T("nt-act-mic","IconButton","Starts a new audio note that records and transcribes.",[],`IconButton(onPressed: newAudioNote, icon: const Icon(Icons.mic_outlined))`),
      T("nt-act-image","IconButton","Starts a new photo note from the camera or gallery.",[],`IconButton(onPressed: newPhotoNote, icon: const Icon(Icons.image_outlined))`)
    ],`BottomAppBar(\n  shape: const CircularNotchedRectangle(),\n  child: Row(\n    children: [\n      IconButton(onPressed: newChecklist, icon: const Icon(Icons.check_box_outlined)),\n      IconButton(onPressed: newDrawing, icon: const Icon(Icons.brush_outlined)),\n      IconButton(onPressed: newAudioNote, icon: const Icon(Icons.mic_outlined)),\n      IconButton(onPressed: newPhotoNote, icon: const Icon(Icons.image_outlined)),\n    ],\n  ),\n)`, "A bottom bar that holds actions and can cut a notch for a docked floating action button."),
    T("nt-nav","NavigationBar","NavigationBar is the Material 3 successor to BottomNavigationBar: instead of a fixed bar with a coloured label, the selected destination gets a pill-shaped indicator behind its icon, the labels stay visible, and the bar follows the M3 colour scheme. Keep uses it for its two top-level destinations, Notes and Reminders, because two destinations with a clear selected pill read better than the older bottom bar — and that pill is the visible difference to look for.",[
      T("nt-nav-notes","NavigationDestination","Notes is the selected destination, so its pill indicator shows where the user is.",[],`const NavigationDestination(icon: Icon(Icons.lightbulb_outline), selectedIcon: Icon(Icons.lightbulb), label: 'Notes')`, "One destination inside a NavigationBar, with an icon and a label."),
      T("nt-nav-reminders","NavigationDestination","Reminders opens the time- and place-based reminders list, a separate view from the notes grid.",[],`const NavigationDestination(icon: Icon(Icons.notifications_outlined), selectedIcon: Icon(Icons.notifications), label: 'Reminders')`, "One destination inside a NavigationBar, with an icon and a label.")
    ],`NavigationBar(\n  selectedIndex: 0,\n  onDestinationSelected: switchTab,\n  destinations: const [\n    NavigationDestination(icon: Icon(Icons.lightbulb_outline), label: 'Notes'),\n    NavigationDestination(icon: Icon(Icons.notifications_outlined), label: 'Reminders'),\n  ],\n)`, "Material 3's bottom navigation: destinations with a pill indicator on the selected one."),
    T("nt-fab","FloatingActionButton","The + button is the fastest way to start a note, so it floats above the content instead of hiding in a menu. Taught in depth in Gmail — Inbox compose button; here it docks into the BottomAppBar's notch to create a new note.",[
      T("nt-fab-icon","Icon","The plus mark is the universal sign for 'create something new'.",[],`const Icon(Icons.add)`)
    ],`FloatingActionButton(\n  onPressed: createNote,\n  child: const Icon(Icons.add),\n)`, "Taught in depth in Gmail — Inbox compose button; here it docks into the BottomAppBar's notch to create a new note.")
  ],`Scaffold(\n  body: const NotesHomeBody(),\n  floatingActionButton: const CreateNoteButton(),\n  floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,\n  bottomNavigationBar: const Column(\n    mainAxisSize: MainAxisSize.min,\n    children: [NotesBottomAppBar(), NotesNavigationBar()],\n  ),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFbbc04)),\n  home: const NotesHome(),\n)`);

TEARDOWNS.tasks.root = T("tk-material","MaterialApp","MaterialApp sits at the top of the app and gives every screen one theme, one navigation stack, and one Material look.",[
  T("tk-scaffold","Scaffold","Scaffold frames the task list screen: the AppBar stays on top, the reorderable list fills the middle, and the add-task field stays docked at the bottom. Without it the list and the input would be separate widgets with nothing keeping them aligned.",[
    T("tk-appbar","AppBar","The top bar stays pinned above the list, so the list name, sort, and menu are always one tap away while tasks scroll underneath.",[
      T("tk-menu","IconButton","Opens the list switcher, so the user can jump between their Personal, College, and Work lists.",[],`IconButton(onPressed: openListSwitcher, icon: const Icon(Icons.menu))`),
      T("tk-title","Text","The title names the active list, so the user always knows which list these tasks belong to.",[],`const Text('My Tasks', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500))`),
      T("tk-sort","IconButton","Sorts the list by date or by the user's own order.",[],`IconButton(onPressed: sortTasks, icon: const Icon(Icons.sort))`),
      T("tk-more","IconButton","The three-dot menu hides secondary actions like renaming or deleting the whole list.",[],`IconButton(onPressed: showListMenu, icon: const Icon(Icons.more_vert))`)
    ],`AppBar(\n  leading: const IconButton(icon: Icon(Icons.menu), onPressed: openListSwitcher),\n  title: const Text('My Tasks'),\n  actions: const [SortButton(), ListMenuButton()],\n)`),
    T("tk-body","Column","The task list expands while the add-task field stays at the bottom, so typing a new task never scrolls away.",[
      T("tk-list-expanded","Expanded","The list takes every pixel not used by the add field, so tasks fill the screen.",[
        T("tk-list","ReorderableListView","The tasks are a list the user drags to reorder: grabbing a row's handle and dropping it higher moves that task up the priority order, and the list rebuilds in the new order. Taught in depth in Spotify — Playlist, where songs are dragged into a new play order; here the same drag re-prioritises tasks.",[
          T("tk-task-1","Dismissible","Swiping this row sideways deletes the task, and the SnackBar at the bottom offers Undo before the delete becomes permanent. Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task.",[
            T("tk-row-1","Row","The checkbox, the task text, and the drag handle share one horizontal line, so each task reads as one row.",[
              T("tk-check-1","Checkbox","This is the canonical Checkbox: a real, tappable, state-changing tick box. Tapping it marks the task done, the row rebuilds with a strikethrough, and the task moves to the Completed section — the checkbox is not decoration, it is the control that changes the task's state. That is why Tasks, not a settings toggle or a sign-up form, is the home for Checkbox.",[
              ],`Checkbox(\n  value: false,\n  onChanged: (value) => setState(() => task.done = value!),\n)`, "A square tick box the user taps to switch a boolean value on or off."),
              T("tk-task-1-col","Column","The task title sits above its date and list, so the eye reads what is due before when it is due.",[
                T("tk-task-1-title","Text","The title names the task in one line.",[],`const Text('Buy Flutter course notes', style: TextStyle(fontSize: 15))`),
                T("tk-task-1-meta","Text","The date and list tell the user when it is due and which list it belongs to.",[],`const Text('Today • Personal', style: TextStyle(fontSize: 12, color: Colors.grey))`)
              ]),
              T("tk-drag-1","Icon","The two rows of dots are the drag handle: grabbing here, not on the text, starts the reorder drag.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`)
            ])
          ],`Dismissible(\n  key: Key(task.id),\n  background: Container(color: Colors.red, alignment: Alignment.centerLeft, child: const Icon(Icons.delete, color: Colors.white)),\n  onDismissed: (_) => deleteTask(task),\n  child: const TaskRow(),\n)`, "Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task and the SnackBar offers Undo."),
          T("tk-task-2","Dismissible","Swiping this row sideways deletes the task, and the SnackBar at the bottom offers Undo before the delete becomes permanent. Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task.",[
            T("tk-row-2","Row","The checkbox, the task text, and the drag handle share one horizontal line, so each task reads as one row.",[
              T("tk-check-2","Checkbox","Tapping this checkbox marks the assignment done and moves it to the Completed section, exactly like the first task's checkbox.",[
              ],`Checkbox(\n  value: false,\n  onChanged: (value) => setState(() => task.done = value!),\n)`, "A square tick box the user taps to switch a boolean value on or off."),
              T("tk-task-2-col","Column","The task title sits above its date and list, so the eye reads what is due before when it is due.",[
                T("tk-task-2-title","Text","The title names the task in one line.",[],`const Text('Finish AoA assignment', style: TextStyle(fontSize: 15))`),
                T("tk-task-2-meta","Text","The date and list tell the user when it is due and which list it belongs to.",[],`const Text('Tomorrow • College', style: TextStyle(fontSize: 12, color: Colors.grey))`)
              ]),
              T("tk-drag-2","Icon","The two rows of dots are the drag handle: grabbing here, not on the text, starts the reorder drag.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`)
            ])
          ],`Dismissible(\n  key: Key(task.id),\n  background: Container(color: Colors.red, alignment: Alignment.centerLeft, child: const Icon(Icons.delete, color: Colors.white)),\n  onDismissed: (_) => deleteTask(task),\n  child: const TaskRow(),\n)`, "Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task and the SnackBar offers Undo."),
          T("tk-task-3","Dismissible","Swiping this row sideways deletes the task, and the SnackBar at the bottom offers Undo before the delete becomes permanent. Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task.",[
            T("tk-row-3","Row","The checkbox, the task text, and the drag handle share one horizontal line, so each task reads as one row.",[
              T("tk-check-3","Checkbox","Tapping this checkbox marks the call done and moves it to the Completed section, exactly like the first task's checkbox.",[
              ],`Checkbox(\n  value: false,\n  onChanged: (value) => setState(() => task.done = value!),\n)`, "A square tick box the user taps to switch a boolean value on or off."),
              T("tk-task-3-col","Column","The task title sits above its date and list, so the eye reads what is due before when it is due.",[
                T("tk-task-3-title","Text","The title names the task in one line.",[],`const Text('Call mom', style: TextStyle(fontSize: 15))`),
                T("tk-task-3-meta","Text","The date and list tell the user when it is due and which list it belongs to.",[],`const Text('Fri • Personal', style: TextStyle(fontSize: 12, color: Colors.grey))`)
              ]),
              T("tk-drag-3","Icon","The two rows of dots are the drag handle: grabbing here, not on the text, starts the reorder drag.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`)
            ])
          ],`Dismissible(\n  key: Key(task.id),\n  background: Container(color: Colors.red, alignment: Alignment.centerLeft, child: const Icon(Icons.delete, color: Colors.white)),\n  onDismissed: (_) => deleteTask(task),\n  child: const TaskRow(),\n)`, "Taught in depth in Gmail — Inbox swipe to archive; here a swipe deletes the task and the SnackBar offers Undo.")
        ],`ReorderableListView(\n  onReorder: reorderTasks,\n  children: [\n    TaskRow(key: ValueKey('task-1')),\n    TaskRow(key: ValueKey('task-2')),\n    TaskRow(key: ValueKey('task-3')),\n  ],\n)`, "Taught in depth in Spotify — Playlist drag to reorder; here the user drags tasks by the handle to re-prioritise them.")
      ]),
      T("tk-completed-divider","Divider","A thin rule separates the active tasks from the completed section below them.",[],`const Divider(height: 1)`, "A thin horizontal rule."),
      T("tk-completed-title","Text","The 'Completed (1)' header counts the finished tasks, so the user sees progress without opening another screen.",[],`const Text('Completed (1)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600))`),
      T("tk-done-row","Row","The checked box and the struck-through title share one row, so a finished task reads as done at a glance.",[
        T("tk-check-done","Checkbox","This checkbox is the same widget in its checked state: the tick and the filled blue box prove the task is done, and tapping it again would un-complete it.",[
        ],`Checkbox(\n  value: true,\n  onChanged: (value) => setState(() => task.done = value!),\n)`, "A square tick box the user taps to switch a boolean value on or off."),
        T("tk-done-text","Text","The struck-through title shows the task is finished without removing it from the list.",[],`const Text('Submit lab record', style: TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey))`)
      ]),
      T("tk-add-row","Row","The add field and its send button share the bottom line, so a new task is typed and added without leaving the list.",[
        T("tk-add-field","TextField","Typing here starts a new task; the hint makes clear this field adds, it does not search.",[],`TextField(\n  controller: _newTaskController,\n  decoration: const InputDecoration(\n    hintText: 'Add a task',\n    border: InputBorder.none,\n  ),\n)`),
        T("tk-add-btn","IconButton","The send button adds the typed text as a new task at the bottom of the list.",[],`IconButton(onPressed: addTask, icon: const Icon(Icons.send))`)
      ])
    ]),
    T("tk-snackbar","SnackBar","After a swipe-delete, a SnackBar slides up at the bottom with 'Task deleted' and an Undo action, so a mistaken swipe can be undone before the task is gone for good. Taught in depth in Gmail — Compose, where it confirms 'Message sent'; here it confirms the delete and offers Undo.",[
      T("tk-snack-text","Text","The message names what just happened, so the user knows the swipe did something.",[],`const Text('Task deleted')`),
      T("tk-snack-undo","TextButton","Undo restores the deleted task to its old position in the list.",[],`SnackBarAction(label: 'Undo', onPressed: restoreTask)`, "A text-only button with a tap handler.")
    ],`SnackBar(\n  content: const Text('Task deleted'),\n  action: SnackBarAction(label: 'Undo', onPressed: restoreTask),\n)`, "Taught in depth in Gmail — Compose 'Message sent'; here it confirms the delete and offers Undo.")
  ],`Scaffold(\n  appBar: const TaskListAppBar(),\n  body: const TaskListBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFF1A73E8)),\n  home: const TaskListScreen(),\n)`);

TEARDOWNS["gmail-compose"].root = T("gc-material","MaterialApp","The compose screen runs under the same Gmail Material theme and navigation context as the inbox, so the red accent, text styles, and the back navigation that closes the draft all behave the same as everywhere else in the app.",[
  T("gc-scaffold","Scaffold","Scaffold is the frame of the compose screen: it pins the AppBar with Close, Attach, and Send on top, holds the form in its body, and gives the SnackBar a ScaffoldMessenger to appear from after sending. Without it the form and the sent confirmation would have no screen to belong to.",[
    T("gc-appbar","AppBar","The AppBar is the compose toolbar: Close on the left abandons the draft, the title names the screen, and Attach and Send sit as actions on the right so sending is always one tap away, even while the keyboard is up.",[
      T("gc-close","IconButton","Closes the draft and returns to the inbox without sending.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.close),\n)`),
      T("gc-title","Text","Names the screen so the user knows a new mail is being written.",[],`const Text('Compose')`),
      T("gc-attach","IconButton","Attaches a file or photo to the draft without leaving the compose screen.",[],`IconButton(\n  onPressed: attachFile,\n  icon: const Icon(Icons.attach_file),\n)`),
      T("gc-send","IconButton","Sends the mail — but only after the Form validates, so tapping it with an empty To field shows the inline error instead of sending.",[],`IconButton(\n  onPressed: () {\n    if (_formKey.currentState!.validate()) sendEmail();\n  },\n  icon: const Icon(Icons.send),\n)`)
    ],`AppBar(\n  leading: IconButton(\n    onPressed: () => Navigator.pop(context),\n    icon: const Icon(Icons.close),\n  ),\n  title: const Text('Compose'),\n  actions: [\n    IconButton(onPressed: attachFile, icon: const Icon(Icons.attach_file)),\n    IconButton(onPressed: sendEmail, icon: const Icon(Icons.send)),\n  ],\n)`),
    T("gc-form","Form","Form groups the To, Subject, and Body fields under one GlobalKey so the Send button can validate them all together. That single key is how one tap on Send knows whether the To field is filled before anything is sent.",[
      T("gc-scroll","SingleChildScrollView","The compose form is taller than the screen once the keyboard opens, so the whole form scrolls as one child instead of overflowing. Without it the Body field would be unreachable while typing.",[
        T("gc-fields","Column","To, Subject, and Body follow from top to bottom in the order the user fills them.",[
          T("gc-to-field","TextFormField","The To field is where TextFormField earns its keep: its validator checks the address before Send does anything, so tapping Send with an empty To shows the red error under the field instead of sending a mail to nobody. A plain TextField could not do that check on its own.",[
            T("gc-to-icon","Icon","The person icon marks this as the recipients field before anything is typed.",[],`const Icon(Icons.person_outline)`),
            T("gc-to-decoration","InputDecoration","Labels the field 'To', hints 'Add recipients', and draws the underline border the error text appears under.",[],`const InputDecoration(\n  labelText: 'To',\n  hintText: 'Add recipients',\n  prefixIcon: Icon(Icons.person_outline),\n  border: UnderlineInputBorder(),\n)`,"Describes a text field's label, hint, icons, and borders."),
            T("gc-to-error","Text","The validator's error string, painted in red under the To field when Send is tapped with no recipient. It is the visible half of validation — the validator returns this text, and the field displays it.",[],`const Text(\n  'Enter at least one recipient',\n  style: TextStyle(color: Colors.red, fontSize: 12),\n)`)
          ],`TextFormField(\n  controller: _toController,\n  keyboardType: TextInputType.emailAddress,\n  validator: (value) => value == null || value.trim().isEmpty ? 'Enter at least one recipient' : null,\n  decoration: const InputDecoration(\n    labelText: 'To',\n    hintText: 'Add recipients',\n    prefixIcon: Icon(Icons.person_outline),\n    border: UnderlineInputBorder(),\n  ),\n)`,"A text input that validates itself inside a Form — its validator returns an error string or null."),
          T("gc-to-divider","Divider","A thin rule separates the recipients row from the Subject field below it.",[],`const Divider(height: 1)`,"A thin horizontal rule."),
          T("gc-cc-row","Row","Cc and Bcc sit on one short row of their own, so expanding the recipient list costs no permanent space — the extra fields only appear after a tap.",[
            T("gc-cc","TextButton","Reveals the Cc field so a copy can go to someone who is not the main recipient.",[],`TextButton(\n  onPressed: showCcField,\n  child: const Text('Cc'),\n)`,"A text-only button with a tap handler."),
            T("gc-bcc","TextButton","Reveals the Bcc field so a hidden copy can go out without the other recipients seeing it.",[],`TextButton(\n  onPressed: showBccField,\n  child: const Text('Bcc'),\n)`,"A text-only button with a tap handler.")
          ]),
          T("gc-subject-field","TextFormField","Subject is a TextFormField too, but with the opposite rule from To: it has no required validator, so an empty subject still sends — the same widget, reused with a different validation rule for a different field.",[
            T("gc-subject-decoration","InputDecoration","Labels the field 'Subject' and keeps the underline style the To field uses, so the form reads as one consistent set of fields.",[],`const InputDecoration(\n  labelText: 'Subject',\n  hintText: 'Subject',\n  border: UnderlineInputBorder(),\n)`,"Describes a text field's label, hint, icons, and borders.")
          ],`TextFormField(\n  controller: _subjectController,\n  textCapitalization: TextCapitalization.sentences,\n  decoration: const InputDecoration(\n    labelText: 'Subject',\n    hintText: 'Subject',\n    border: UnderlineInputBorder(),\n  ),\n)`,"A text input that validates itself inside a Form — its validator returns an error string or null."),
          T("gc-subject-divider","Divider","A thin rule separates the Subject field from the message body below it.",[],`const Divider(height: 1)`,"A thin horizontal rule."),
          T("gc-body-field","TextFormField","The Body is the third TextFormField in the same Form, and it shows the widget's other shape: multiline and expanding, so it grows to fill the space under the Subject instead of staying one line tall. Its validator is empty because a blank body is a valid mail.",[
            T("gc-body-decoration","InputDecoration","The body field drops the label and the border entirely — just the 'Compose email' hint — so the writing area feels like a blank page, not another form row.",[],`const InputDecoration(\n  hintText: 'Compose email',\n  border: InputBorder.none,\n)`,"Describes a text field's label, hint, icons, and borders.")
          ],`TextFormField(\n  controller: _bodyController,\n  keyboardType: TextInputType.multiline,\n  maxLines: null,\n  expands: true,\n  textCapitalization: TextCapitalization.sentences,\n  decoration: const InputDecoration(\n    hintText: 'Compose email',\n    border: InputBorder.none,\n  ),\n)`,"A text input that validates itself inside a Form — its validator returns an error string or null.")
        ])
      ],`SingleChildScrollView(\n  padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),\n  child: const ComposeFields(),\n)`,"Taught in depth in Login — Sign in; here it scrolls the whole compose form when the keyboard shrinks the visible area."),
    ],`Form(\n  key: _formKey,\n  child: const ComposeScrollView(),\n)`,"Groups text fields under one key so they validate together."),
    T("gc-snackbar","SnackBar","After a valid Send, the screen does not navigate away with a dialog — it shows a SnackBar: a short dark bar at the bottom saying 'Message sent', with an Undo action that unsends within a few seconds. That is the SnackBar's job: confirm a completed action briefly, then disappear on its own.",[
      T("gc-snackbar-text","Text","The confirmation itself — short, past tense, and gone in four seconds.",[],`const Text('Message sent')`),
      T("gc-snackbar-undo","TextButton","The SnackBar's action: one tap pulls the mail back before it is delivered, which is why the confirmation is a SnackBar and not a toast with no action.",[],`TextButton(\n  onPressed: undoSend,\n  child: const Text('Undo'),\n)`,"A text-only button with a tap handler.")
    ],`SnackBar(\n  content: const Text('Message sent'),\n  action: SnackBarAction(\n    label: 'Undo',\n    onPressed: undoSend,\n  ),\n  duration: const Duration(seconds: 4),\n)`,"A temporary message bar at the bottom of the screen, shown with ScaffoldMessenger, with an optional action.")
  ],`Scaffold(\n  appBar: const ComposeAppBar(),\n  body: const ComposeForm(),\n)`)
],`MaterialApp(\n  home: const GmailCompose(),\n)`);

TEARDOWNS["spotify-player"].root = T("spp-material","MaterialApp","The full player runs under the same dark Spotify Material theme and navigation context as the home feed, so the green accent, the text styles, and the collapse back to the mini player all behave the same as everywhere else in the app.",[
  T("spp-scaffold","Scaffold","Scaffold is the frame of the player screen: it pins the AppBar with the collapse action on top and holds the expanding player in its body. Without it the art, seek bar, and controls would have no screen to belong to.",[
    T("spp-appbar","AppBar","The AppBar is the player's top strip: the chevron collapses back to the mini player, the title names the playlist the song is playing from, and the overflow menu holds the secondary actions, so the player controls below never have to carry navigation.",[
      T("spp-collapse","IconButton","Collapses the full player back down to the mini player bar on Home.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.keyboard_arrow_down),\n)`),
      T("spp-appbar-title","Column","The context line sits above the playlist name, so the title reads as two stacked lines in the AppBar's title slot.",[
        T("spp-context","Text","The small caps line tells the user where this song is playing from.",[],`const Text(\n  'PLAYING FROM PLAYLIST',\n  style: TextStyle(fontSize: 10, letterSpacing: 1.2),\n)`),
        T("spp-playlist","Text","Names the playlist the current song belongs to.",[],`const Text(\n  'Liked Songs',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
      ]),
      T("spp-more","IconButton","Opens the overflow menu: add to playlist, share, and song options.",[],`IconButton(\n  onPressed: openSongMenu,\n  icon: const Icon(Icons.more_vert),\n)`)
    ],`AppBar(\n  leading: IconButton(\n    onPressed: () => Navigator.pop(context),\n    icon: const Icon(Icons.keyboard_arrow_down),\n  ),\n  title: const PlayingFromTitle(),\n  actions: [\n    IconButton(onPressed: openSongMenu, icon: const Icon(Icons.more_vert)),\n  ],\n)`),
    T("spp-player","AnimatedContainer","This is the AnimatedContainer that makes the mini player feel like it grows into the full player: tapping the mini bar changes this container's height from the 64-pixel bar to the full screen, and AnimatedContainer interpolates the height and padding over 350 milliseconds instead of jumping. Change the height value and the whole player animates — no AnimationController needed.",[
      T("spp-content","Column","Album art, song info, seek bar, controls, and the device row stack from top to bottom inside the expanding player.",[
        T("spp-art-hero","Hero","Taught in depth in Amazon — Product detail; here it carries the album art from the home feed's mini player into the full player, so the cover appears to grow from the small square into the large art instead of cutting between screens. The tag must match the mini player's Hero tag exactly, or the flight never happens.",[
          T("spp-art","Image","The large album art is the visual anchor of the whole player — it is what the Hero carries across from the mini player.",[],`Image.asset(\n  'assets/covers/blinding_lights.png',\n  fit: BoxFit.cover,\n)`)
        ],`Hero(\n  tag: 'album-blinding-lights',\n  child: Image.asset(\n    'assets/covers/blinding_lights.png',\n    fit: BoxFit.cover,\n  ),\n)`,"Taught in depth in Amazon — Product detail; here it carries the album art from the mini player into the full player."),
        T("spp-title-row","Row","The song info takes the width it needs while the heart sits at the far end of the same line.",[
          T("spp-song-info","Column","The song title sits above the artist name, so the pair reads as one block.",[
            T("spp-song-title","Text","Shows the title of the song that is playing, in the largest text on the screen after the art.",[],`const Text(\n  'Blinding Lights',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),\n)`),
            T("spp-artist","Text","Shows the artist under the title, in a quieter style.",[],`const Text(\n  'The Weeknd',\n  style: TextStyle(color: Colors.grey),\n)`)
          ]),
          T("spp-like","IconButton","Hearts the song into Liked Songs; the filled green heart is the confirmation, no dialog needed.",[],`IconButton(\n  onPressed: toggleLike,\n  icon: const Icon(Icons.favorite, color: Color(0xFF1DB954)),\n)`)
        ]),
        T("spp-seek-row","Row","The elapsed time, the seek bar, and the total time share one line under the song info.",[
          T("spp-elapsed","Text","Shows how far into the song playback is, updating as the song plays.",[],`const Text('1:24', style: TextStyle(fontSize: 11))`),
          T("spp-seek-expanded","Expanded","The seek bar takes every pixel between the two time labels, so the thumb has the full width to drag across.",[
            T("spp-seek","Slider","The seek bar is a Slider: the thumb's position is the playback position, and dragging it calls seek so the song jumps to that time. The value is the elapsed seconds, the max is the song length, and onChanged is what makes the drag do something instead of just moving the thumb.",[],`Slider(\n  value: 84,\n  min: 0,\n  max: 200,\n  onChanged: seekTo,\n  activeColor: const Color(0xFFFFFFFF),\n  inactiveColor: const Color(0xFF4D4D4D),\n)`,"A draggable value selector — here it is the seek bar: the thumb's position is the playback position, and dragging it seeks the song.")
          ]),
          T("spp-total","Text","Shows the full length of the song, so the seek bar's end has a meaning.",[],`const Text('3:20', style: TextStyle(fontSize: 11))`)
        ]),
        T("spp-controls","Row","Shuffle, previous, play, next, and repeat share one controls row, with empty Spacer gaps pushing the outer pair to the edges so Play stays dead centre.",[
          T("spp-shuffle","IconButton","Toggles shuffle so the playlist plays in random order.",[],`IconButton(\n  onPressed: toggleShuffle,\n  icon: const Icon(Icons.shuffle),\n)`),
          T("spp-spacer-1","Spacer","The first Spacer takes all the free space between Shuffle and Previous, so the outer controls sit at the row's edges instead of bunching around Play.",[],`const Spacer(flex: 1)`,"An empty flexible space that pushes its siblings apart inside a Row or Column."),
          T("spp-prev","IconButton","Skips back to the previous song, or to the start of this one.",[],`IconButton(\n  onPressed: playPrevious,\n  icon: const Icon(Icons.skip_previous),\n)`),
          T("spp-play","IconButton","The big central control: pauses or resumes the current song. It is larger than the other controls because it is the action the thumb reaches for most.",[],`IconButton(\n  onPressed: togglePlay,\n  iconSize: 56,\n  icon: const Icon(Icons.pause),\n)`),
          T("spp-next","IconButton","Skips forward to the next song in the playlist.",[],`IconButton(\n  onPressed: playNext,\n  icon: const Icon(Icons.skip_next),\n)`),
          T("spp-spacer-2","Spacer","The second Spacer mirrors the first on the other side of Play, so Previous and Next stay the same distance from the centre and the row stays balanced.",[],`const Spacer(flex: 1)`,"An empty flexible space that pushes its siblings apart inside a Row or Column."),
          T("spp-repeat","IconButton","Toggles repeat: off, repeat the playlist, or repeat this one song.",[],`IconButton(\n  onPressed: toggleRepeat,\n  icon: const Icon(Icons.repeat),\n)`)
        ]),
        T("spp-bottom-row","Row","The device picker sits at the left and the share and queue actions at the right, with a Spacer holding them apart.",[
          T("spp-devices","IconButton","Opens the list of speakers and devices this song can play on.",[],`IconButton(\n  onPressed: openDevices,\n  icon: const Icon(Icons.speaker_outlined),\n)`),
          T("spp-spacer-3","Spacer","The Spacer in this row pushes Share and Queue to the far right, so the device action keeps the left edge to itself.",[],`const Spacer(flex: 1)`,"An empty flexible space that pushes its siblings apart inside a Row or Column."),
          T("spp-share","IconButton","Shares the song as a link or to another app.",[],`IconButton(\n  onPressed: shareSong,\n  icon: const Icon(Icons.share_outlined),\n)`),
          T("spp-queue","IconButton","Opens the play queue to see — and reorder — what plays next.",[],`IconButton(\n  onPressed: openQueue,\n  icon: const Icon(Icons.queue_music),\n)`)
        ])
      ])
    ],`AnimatedContainer(\n  duration: const Duration(milliseconds: 350),\n  curve: Curves.easeOut,\n  height: _expanded ? double.infinity : 64,\n  padding: const EdgeInsets.all(20),\n  color: const Color(0xFF121212),\n  child: const PlayerContent(),\n)`,"A Container that animates its size, colour, or padding whenever those values change — here it grows the mini player into the full player.")
  ],`Scaffold(\n  appBar: const PlayerAppBar(),\n  body: const ExpandingPlayer(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark(),\n  home: const NowPlayingScreen(),\n)`);

TEARDOWNS["youtube-player"].root = T("yp-material","MaterialApp","MaterialApp sits at the top of the player and gives this screen the same YouTube theme, navigation stack, and Material look as the home feed, so the player feels like the same app and not a separate video window.",[
  T("yp-scaffold","Scaffold","Scaffold frames the player screen: the top bar stays on top, the video and its details fill the body, and there is no bottom navigation because the player takes over the whole screen while a video is open.",[
    T("yp-appbar","AppBar","The top bar holds the back arrow, cast, and overflow menu over the player, so the viewer can leave the video, send it to a TV, or open more actions without hunting for them.",[
      T("yp-back","IconButton","Tapping back closes the player and returns to the feed it came from.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.arrow_back),\n)`),
      T("yp-cast","IconButton","Tapping cast offers nearby TVs and speakers, so the video can jump from the phone to a bigger screen.",[],`IconButton(\n  onPressed: openCast,\n  icon: const Icon(Icons.cast),\n)`),
      T("yp-more","IconButton","The three-dot menu hides secondary actions like Report and Playback speed, keeping the player chrome clean until asked for.",[],`IconButton(\n  onPressed: showPlayerMenu,\n  icon: const Icon(Icons.more_vert),\n)`)
    ],`AppBar(\n  backgroundColor: Colors.transparent,\n  leading: const BackButton(),\n  actions: const [\n    CastAction(),\n    PlayerOverflowMenu(),\n  ],\n)`),
    T("yp-layout","LayoutBuilder","LayoutBuilder is what lets one player screen serve both orientations: it reads the space the player actually gets, and in portrait it stacks the video above the title, actions, and comments, while in landscape it hands the whole screen to the video. NOTE: the fixed-width phone mock cannot show the layout changing — this portrait layout is the only state visible here; the portrait-vs-landscape branch lives in the code below, not in the mock.",[
      T("yp-body","Column","The video, seek bar, title, channel row, actions, comments sheet, and Up next list stack vertically in portrait, which is the reading order a viewer follows after tapping a video.",[
        T("yp-video-area","AspectRatio","AspectRatio forces the video surface into a fixed 16:9 frame no matter how wide the phone is, so the video never stretches, squashes, or leaves black bars that change size. Every YouTube video is shot and uploaded 16:9, and this widget is the guarantee the player honours that shape.",[
          T("yp-video-stack","Stack","The video frame, the buffering spinner, and the playback controls are layered in the same 16:9 box, so the controls float over the video instead of pushing it around.",[
            T("yp-video-frame","Image","The video frame itself is the current frame of the playing video, filling the whole 16:9 area edge to edge.",[],`Image.network(\n  video.streamUrl,\n  fit: BoxFit.cover,\n)`),
            T("yp-buffer-wrap","Center","Center puts the buffering spinner dead in the middle of the video, so the eye lands on it the moment playback stalls.",[
              T("yp-buffer","CircularProgressIndicator","CircularProgressIndicator is the spinning ring that says the video is still loading: it has no fixed value, so it spins indefinitely until enough of the video has buffered to resume. It appears over the video frame the moment the network stalls and disappears the moment playback resumes, which is why it sits centred on the video instead of in a corner.",[],`const CircularProgressIndicator(\n  value: null,\n  strokeWidth: 3,\n  color: Colors.white,\n)`,"A spinning ring that shows an indeterminate loading state, such as video buffering.")
            ],`const Center(\n  child: CircularProgressIndicator(),\n)`),
            T("yp-controls-align","Align","Align pins the playback controls to the bottom edge of the video, so play, next, time, and fullscreen always sit on the video itself and never drift into the title area below.",[
              T("yp-controls-row","Row","Play, next, the time readout, and fullscreen share one row across the bottom of the video, in the order a viewer reaches for them.",[
                T("yp-play-pause","IconButton","Toggles play and pause without leaving the video.",[],`IconButton(\n  onPressed: togglePlay,\n  icon: const Icon(Icons.pause),\n)`),
                T("yp-next","IconButton","Skips straight to the next video in the queue.",[],`IconButton(\n  onPressed: playNext,\n  icon: const Icon(Icons.skip_next),\n)`),
                T("yp-time","Text","Shows how far into the video playback is, next to the controls that change it.",[],`const Text(\n  '4:32 / 12:48',\n  style: TextStyle(color: Colors.white, fontSize: 12),\n)`),
                T("yp-fullscreen","IconButton","Rotates the player into fullscreen landscape, handing the whole display to the video.",[],`IconButton(\n  onPressed: enterFullscreen,\n  icon: const Icon(Icons.fullscreen),\n)`)
              ])
            ],`const Align(\n  alignment: Alignment.bottomCenter,\n  child: PlayerControls(),\n)`)
          ])
        ],`AspectRatio(\n  aspectRatio: 16 / 9,\n  child: const VideoSurface(),\n)`,"Forces its child into a fixed width-to-height ratio, such as 16:9 video."),
        T("yp-seek-row","Row","The seek bar sits in a row with the current time on the left and the total length on the right, so the viewer can read where they are and drag to anywhere in the video.",[
          T("yp-current","Text","Shows the current playback position in minutes and seconds.",[],`const Text(\n  '4:32',\n  style: TextStyle(fontSize: 12),\n)`),
          T("yp-seek-expanded","Expanded","The seek bar takes all the space between the two time labels, giving the thumb the longest possible drag track.",[
            T("yp-seek","Slider","Taught in depth in Spotify — Now Playing; here it is the video seek bar, so dragging it jumps to that point in the video and the filled track shows how much has played. It is the same widget as the audio seek bar, used for video instead of music.",[],`Slider(\n  value: 0.36,\n  onChanged: seekTo,\n)`,"A draggable thumb on a track that picks a value, such as a playback position.")
          ]),
          T("yp-total","Text","Shows the full length of the video, so the viewer knows how long the watch is.",[],`const Text(\n  '12:48',\n  style: TextStyle(fontSize: 12),\n)`)
        ]),
        T("yp-title","Text","The video title sits directly under the player in bold, so the viewer can confirm what is playing without scrolling.",[],`const Text(\n  'Build a Flutter app in 20 minutes',\n  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),\n)`),
        T("yp-channel-row","Row","The channel avatar, name, subscriber count, and Subscribe button share one row, so the whole channel identity is a single glanceable unit.",[
          T("yp-avatar","CircleAvatar","A small circular channel photo identifies who uploaded the video at a glance.",[],`const CircleAvatar(\n  radius: 16,\n  backgroundImage: AssetImage('channel.png'),\n)`),
          T("yp-channel-col","Column","The channel name sits above its subscriber count, stacking identity over scale.",[
            T("yp-channel-name","Text","Names the channel that uploaded the video.",[],`const Text(\n  'FlutterForward',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("yp-channel-subs","Text","The subscriber count tells the viewer how big this channel is before they decide to subscribe.",[],`const Text(\n  '1.2M subscribers',\n  style: TextStyle(fontSize: 12),\n)`)
          ]),
          T("yp-subscribe","ElevatedButton","Subscribe is the one primary action on the player, so it is a filled button that stands out from the quiet icon actions around it.",[
            T("yp-subscribe-label","Text","Labels the primary channel action.",[],`const Text(\n  'Subscribe',\n  style: TextStyle(color: Colors.white),\n)`)
          ],`ElevatedButton(\n  onPressed: subscribeToChannel,\n  child: const Text('Subscribe'),\n)`,"A filled button for the primary action on a screen.")
        ]),
        T("yp-actions-row","Row","Like, Share, Download, and Save sit in one row under the channel, so every way to react to the video is one tap away and none of them needs a menu.",[
          T("yp-like","IconButton","Tapping the thumb tells YouTube the video was liked, which feeds recommendations.",[],`IconButton(\n  onPressed: likeVideo,\n  icon: const Icon(Icons.thumb_up_outlined),\n)`),
          T("yp-like-count","Text","The like count next to the thumb shows how many viewers liked the video.",[],`const Text(\n  '12K',\n  style: TextStyle(fontSize: 12),\n)`),
          T("yp-share-tip","Tooltip","Tooltip is the label that appears when the viewer long-presses the Share icon: the icon alone is a bare arrow, so the tooltip reveals the word 'Share' on demand without taking up permanent space in the row. NOTE: a long-press-only label cannot be shown in its hidden state and its revealed state at once — the mock shows the revealed state on this one icon, and the long-press behaviour lives in the code below.",[
            T("yp-share","IconButton","Opens the share sheet to send the video to another app or copy its link.",[],`IconButton(\n  onPressed: shareVideo,\n  icon: const Icon(Icons.share_outlined),\n)`)
          ],`Tooltip(\n  message: 'Share',\n  waitDuration: const Duration(milliseconds: 500),\n  child: IconButton(\n    onPressed: shareVideo,\n    icon: const Icon(Icons.share_outlined),\n  ),\n)`,"A label that appears on long-press or hover to name an icon-only action."),
          T("yp-download","IconButton","Downloads the video for offline watching.",[],`IconButton(\n  onPressed: downloadVideo,\n  icon: const Icon(Icons.download_outlined),\n)`),
          T("yp-save","IconButton","Saves the video to a playlist such as Watch later.",[],`IconButton(\n  onPressed: saveVideo,\n  icon: const Icon(Icons.bookmark_outline),\n)`)
        ]),
        T("yp-comments-sheet","BottomSheet","BottomSheet is the comments panel that slides up from the bottom of the player: it is not a new screen, it is a sheet layered over the player, so the viewer can read comments and swipe it back down without losing their place in the video. Tapping the comments area opens it; dragging its handle or tapping outside closes it, and the video keeps playing underneath.",[
          T("yp-sheet-col","Column","The drag handle, header, and comment rows stack inside the sheet, in the order a reader scans them.",[
            T("yp-sheet-handle","Container","The short grey bar at the top of the sheet is the drag handle: it signals the sheet can be pulled down to dismiss it.",[],`Container(\n  width: 36,\n  height: 4,\n  decoration: BoxDecoration(\n    color: Colors.grey,\n    borderRadius: BorderRadius.circular(2),\n  ),\n)`),
            T("yp-sheet-header","Row","The comments count and the close button share the sheet header, so the reader knows how many comments there are and how to leave.",[
              T("yp-sheet-title","Text","Heads the sheet with the comment count, so the scale of the discussion is visible before reading.",[],`const Text(\n  'Comments • 1.2K',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("yp-sheet-close","IconButton","Closes the sheet and returns to the player.",[],`IconButton(\n  onPressed: closeComments,\n  icon: const Icon(Icons.close),\n)`)
            ]),
            T("yp-comment-one","Row","One comment is a row: the commenter's avatar on the left, their name and words on the right.",[
              T("yp-comment-one-avatar","CircleAvatar","The commenter's circular photo identifies who wrote the comment.",[],`const CircleAvatar(\n  radius: 14,\n  backgroundColor: Color(0xFF1A73E8),\n  child: Text('A'),\n)`),
              T("yp-comment-one-body","Column","The commenter's name sits above their words, so each comment reads as a small headed note.",[
                T("yp-comment-one-name","Text","Names the person who wrote the comment.",[],`const Text(\n  '@aarav.codes',\n  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),\n)`),
                T("yp-comment-one-text","Text","The comment itself, shown in full under its author's name.",[],`const Text(\n  'The diagrams in this one finally made state click for me.',\n  style: TextStyle(fontSize: 12),\n)`)
              ])
            ]),
            T("yp-comment-two","Row","A second comment repeats the same row pattern, showing the sheet is a list of comments, not a single note.",[
              T("yp-comment-two-avatar","CircleAvatar","A different commenter's photo marks this as a different voice in the thread.",[],`const CircleAvatar(\n  radius: 14,\n  backgroundColor: Color(0xFF0F9D58),\n  child: Text('P'),\n)`),
              T("yp-comment-two-body","Column","Name above words, in the same order as the first comment, so the thread scans evenly.",[
                T("yp-comment-two-name","Text","Names the second commenter.",[],`const Text(\n  '@priya.builds',\n  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),\n)`),
                T("yp-comment-two-text","Text","The second comment's words, showing the thread continues past the first reply.",[],`const Text(\n  'Watching this twice — once to learn, once to build along.',\n  style: TextStyle(fontSize: 12),\n)`)
              ])
            ])
          ])
        ],`BottomSheet(\n  elevation: 8,\n  shape: const RoundedRectangleBorder(\n    borderRadius: BorderRadius.vertical(top: Radius.circular(16)),\n  ),\n  builder: (context) => const CommentsSheet(),\n)`,"A panel that slides up from the bottom of the screen, such as a comments sheet."),
        T("yp-upnext-title","Text","Heads the list of videos YouTube suggests next, so the viewer knows the player is offering more to watch.",[],`const Text(\n  'Up next',\n  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),\n)`),
        T("yp-upnext-list","ListView","Up next is a lazily built vertical list, so only the suggestions on screen are built and the list can scroll through many videos.",[
          T("yp-upnext-card","Card","One suggestion is grouped on a card surface, so its thumbnail and text read as one tappable video.",[
            T("yp-upnext-row","Row","The thumbnail sits left and the text right, the compact horizontal pattern for suggested videos.",[
              T("yp-upnext-thumb","Image","A small 16:9 thumbnail is what the viewer recognises and taps.",[],`Image.network(\n  video.thumbnailUrl,\n  width: 120,\n  fit: BoxFit.cover,\n)`),
              T("yp-upnext-col","Column","Title above channel and stats, stacking the suggestion's details in reading order.",[
                T("yp-upnext-name","Text","Names the suggested video.",[],`const Text(\n  'Dart null safety, explained simply',\n  maxLines: 2,\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`),
                T("yp-upnext-meta","Text","Channel, views, and age in one quiet line under the title.",[],`const Text(\n  'Code with Dheeraj • 845K views • 1 week ago',\n  style: TextStyle(fontSize: 11),\n)`)
              ])
            ])
          ]),
          T("yp-upnext-card-two","Card","A second suggestion repeats the same card layout, proving every Up next item follows one pattern.",[
            T("yp-upnext-row-two","Row","Thumbnail left, text right, exactly like the first suggestion.",[
              T("yp-upnext-thumb-two","Image","A different thumbnail marks this as a different suggested video.",[],`Image.network(\n  video.thumbnailUrl,\n  width: 120,\n  fit: BoxFit.cover,\n)`),
              T("yp-upnext-col-two","Column","Title above channel and stats, in the same order as the first suggestion.",[
                T("yp-upnext-name-two","Text","Names the second suggested video.",[],`const Text(\n  'Flutter widgets every beginner must know',\n  maxLines: 2,\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`),
                T("yp-upnext-meta-two","Text","The second suggestion's channel and stats, in the same quiet style.",[],`const Text(\n  'FlutterForward • 2.1M views • 2 weeks ago',\n  style: TextStyle(fontSize: 11),\n)`)
              ])
            ])
          ])
        ])
      ])
    ],`LayoutBuilder(\n  builder: (context, constraints) {\n    final isLandscape = constraints.maxWidth > constraints.maxHeight;\n    return isLandscape ? const LandscapePlayer() : const PortraitPlayer();\n  },\n)`,"Rebuilds its child with a different layout depending on the space available, such as portrait vs landscape.")
  ],`Scaffold(\n  appBar: const PlayerAppBar(),\n  body: const PlayerBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF0000)),\n  home: const YouTubePlayer(),\n)`);

TEARDOWNS["netflix-detail"].root = T("nd-material","MaterialApp","The title detail screen inherits the same dark Netflix theme and navigation context as home, so the backdrop, match line, and tabs feel like the same app and not a separate page.",[
  T("nd-scaffold","Scaffold","Scaffold frames the detail screen: the top bar stays on top while the backdrop, tabs, and tab pages scroll in the body, and there is no bottom navigation because a detail page takes over the whole screen until the viewer goes back.",[
    T("nd-appbar","AppBar","The top bar holds the back arrow, search, and overflow menu over the detail page, so the viewer can leave the title, search for something else, or open more actions without scrolling back up.",[
      T("nd-back","IconButton","Tapping back closes the detail page and returns to the home rows it came from.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.arrow_back),\n)`),
      T("nd-search","IconButton","Opens search without leaving the title detail flow.",[],`IconButton(\n  onPressed: openSearch,\n  icon: const Icon(Icons.search),\n)`),
      T("nd-more","IconButton","The three-dot menu hides secondary actions like Share and Rate, keeping the top bar clean until asked for.",[],`IconButton(\n  onPressed: showTitleMenu,\n  icon: const Icon(Icons.more_vert),\n)`)
    ],`AppBar(\n  backgroundColor: Colors.transparent,\n  elevation: 0,\n  leading: const BackButton(),\n  actions: const [\n    SearchAction(),\n    TitleOverflowMenu(),\n  ],\n)`),
    T("nd-body","SingleChildScrollView","SingleChildScrollView makes the whole detail page scroll as one tall column — backdrop, match line, genres, actions, tabs, and tab pages — so the page can be longer than the screen without any section being cut off.",[
      T("nd-content","Column","The backdrop, tab bar, and tab pages stack vertically in reading order, which is the order a viewer scans a title page.",[
        T("nd-backdrop-stack","Stack","The backdrop art, the dark shade, and the title content are layered in the same box, so the title, match line, and buttons sit on top of the artwork instead of below it.",[
          T("nd-switcher","AnimatedSwitcher","AnimatedSwitcher crossfades the backdrop whenever the featured episode changes: the old backdrop fades out while the new one fades in over 400ms, instead of the image swapping instantly. It works by keying the backdrop image to the episode — a new key means a new child, and AnimatedSwitcher animates between the old child and the new one.",[
            T("nd-backdrop","Image","The title's key art fills the hero area, and it is the image that crossfades when the episode changes.",[],`Image.network(\n  episode.backdropUrl,\n  fit: BoxFit.cover,\n)`)
          ],`AnimatedSwitcher(\n  duration: const Duration(milliseconds: 400),\n  transitionBuilder: (child, animation) => FadeTransition(\n    opacity: animation,\n    child: child,\n  ),\n  child: Image.network(\n    episode.backdropUrl,\n    key: ValueKey(episode.id),\n  ),\n)`,"Crossfades between the old and new child when the child changes, such as a backdrop swapping episodes."),
          T("nd-backdrop-shade","Container","A dark gradient sits over the lower half of the backdrop so the white title and match line stay readable on any artwork.",[],`Container(\n  decoration: const BoxDecoration(\n    gradient: LinearGradient(\n      begin: Alignment.topCenter,\n      end: Alignment.bottomCenter,\n      colors: [Colors.transparent, Colors.black87],\n    ),\n  ),\n)`),
          T("nd-backdrop-content","Column","The title, match line, genre chips, and action buttons are stacked at the bottom of the backdrop, where the shade makes them readable.",[
            T("nd-title","Text","Shows the title's name in large bold type over the backdrop art.",[],`const Text(\n  'Stranger Things',\n  style: TextStyle(\n    fontSize: 28,\n    fontWeight: FontWeight.w900,\n    color: Colors.white,\n  ),\n)`),
            T("nd-match","RichText","RichText builds the match line as one text run with differently styled spans inside it: '98% Match' in bold green, the year in white, and the season count in muted grey. A plain Text widget can only style the whole line one way, so RichText is what makes this single line carry three meanings at once.",[],`RichText(\n  text: const TextSpan(\n    children: [\n      TextSpan(\n        text: '98% Match',\n        style: TextStyle(color: Color(0xFF46D369), fontWeight: FontWeight.w700),\n      ),\n      TextSpan(text: '  2024  ', style: TextStyle(color: Colors.white)),\n      TextSpan(text: '2 Seasons', style: TextStyle(color: Colors.white70)),\n    ],\n  ),\n)`,"One text run with differently styled spans inside it, such as a green match score beside a grey season count."),
            T("nd-genres","Wrap","Wrap lays the genre chips in a row and flows them onto a second line when they run out of room, so six genres fit under the title without shrinking or scrolling sideways. A Row would overflow or clip the last chips; Wrap is what lets the chips spill naturally onto the next line.",[
              T("nd-chip-scifi","Chip","Marks the title as science fiction, one tap away from similar sci-fi titles.",[],`const Chip(label: Text('Sci-Fi'))`,"A compact, tappable label that names one category or genre."),
              T("nd-chip-drama","Chip","Marks the title as drama, so viewers who like drama know what to expect.",[],`const Chip(label: Text('Drama'))`,"A compact, tappable label that names one category or genre."),
              T("nd-chip-thriller","Chip","Marks the title as a thriller, setting the mood before the first episode.",[],`const Chip(label: Text('Thriller'))`,"A compact, tappable label that names one category or genre."),
              T("nd-chip-horror","Chip","Marks the title as horror, the fourth genre in the wrapping row.",[],`const Chip(label: Text('Horror'))`,"A compact, tappable label that names one category or genre."),
              T("nd-chip-mystery","Chip","Marks the title as a mystery, flowing onto the second line of the chip row.",[],`const Chip(label: Text('Mystery'))`,"A compact, tappable label that names one category or genre."),
              T("nd-chip-supernatural","Chip","Marks the title as supernatural, the last chip on the second line.",[],`const Chip(label: Text('Supernatural'))`,"A compact, tappable label that names one category or genre.")
            ],`Wrap(\n  spacing: 8,\n  runSpacing: 8,\n  children: const [\n    Chip(label: Text('Sci-Fi')),\n    Chip(label: Text('Drama')),\n    Chip(label: Text('Thriller')),\n    Chip(label: Text('Horror')),\n    Chip(label: Text('Mystery')),\n    Chip(label: Text('Supernatural')),\n  ],\n)`,"Flows children onto the next line when they run out of room, such as genre chips."),
            T("nd-actions","Row","The Play button, My List button, and Download action share one row under the genres, so the three things a viewer does with a title are one tap away.",[
              T("nd-play","ElevatedButton","Starts playback of the title immediately, so it is the filled primary button in the row.",[
                T("nd-play-icon","Icon","The play triangle signals that tapping starts the video.",[],`const Icon(Icons.play_arrow, color: Colors.black)`),
                T("nd-play-label","Text","Labels the primary hero action.",[],`const Text(\n  'Play',\n  style: TextStyle(color: Colors.black, fontWeight: FontWeight.w700),\n)`)
              ],`ElevatedButton.icon(\n  onPressed: playTitle,\n  icon: const Icon(Icons.play_arrow, color: Colors.black),\n  label: const Text('Play', style: TextStyle(color: Colors.black)),\n  style: ElevatedButton.styleFrom(backgroundColor: Colors.white),\n)`,"A filled button for the primary action on a screen."),
              T("nd-mylist","OutlinedButton","Saves the title to the viewer's list without starting playback, so it is an outlined secondary button next to Play.",[
                T("nd-mylist-label","Text","Labels the secondary hero action.",[],`const Text('+ My List', style: TextStyle(color: Colors.white))`)
              ],`OutlinedButton.icon(\n  onPressed: addToMyList,\n  icon: const Icon(Icons.add, color: Colors.white),\n  label: const Text('My List', style: TextStyle(color: Colors.white)),\n)`),
              T("nd-download","IconButton","Downloads the title for offline watching.",[],`IconButton(\n  onPressed: downloadTitle,\n  icon: const Icon(Icons.download),\n)`)
            ])
          ])
        ]),
        T("nd-tabs","TabBar","TabBar is the row of tabs — Episodes, Trailers, More Like This — that switches the page below it. It only draws and controls the tabs; the swipeable pages themselves are the TabBarView that follows it, so this screen finally completes the pair that Instagram's profile started.",[
          T("nd-tab-episodes","Tab","The Episodes tab opens the episode list, which is the default page for a series.",[],`const Tab(text: 'Episodes')`),
          T("nd-tab-trailers","Tab","The Trailers tab opens the title's trailers and teasers.",[],`const Tab(text: 'Trailers')`),
          T("nd-tab-more","Tab","The More Like This tab opens titles similar to this one.",[],`const Tab(text: 'More Like This')`)
        ]),
        T("nd-tabview","TabBarView","TabBarView is the swipeable pages the TabBar switches between: Episodes, Trailers, and More Like This are three pages in one view, and swiping or tapping a tab slides from one to the next. The TabBar above only draws the tabs — this widget is what actually holds and switches the pages, which is why the pair is only complete with both.",[
          T("nd-episodes-page","Column","The Episodes page lists the season's episodes in order, newest season first, each as its own card.",[
            T("nd-episode-one","Card","One episode is grouped on a card surface, so its thumbnail, title, description, and download action read as a single episode.",[
              T("nd-episode-one-row","Row","The episode thumbnail sits left, the episode text in the middle, and the download action right, the compact horizontal pattern for episode rows.",[
                T("nd-episode-one-thumb","Image","A still from the episode is what the viewer recognises before reading its title.",[],`Image.network(\n  episode.thumbnailUrl,\n  width: 110,\n  fit: BoxFit.cover,\n)`),
                T("nd-episode-one-col","Column","Episode title above description above runtime, stacking the episode's details in reading order.",[
                  T("nd-episode-one-title","Text","Names the episode: chapter one of the season.",[],`const Text(\n  'Chapter One: The Vanishing',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                  T("nd-episode-one-desc","Text","A one-line summary of what happens in the episode, so the viewer can pick where to start.",[],`const Text(\n  'A boy vanishes on his way home, and the town starts asking questions.',\n  maxLines: 2,\n  style: TextStyle(fontSize: 12),\n)`),
                  T("nd-episode-one-time","Text","Shows the episode's runtime, so the viewer knows the commitment before pressing play.",[],`const Text(\n  '49m',\n  style: TextStyle(fontSize: 11),\n)`)
                ]),
                T("nd-episode-one-download","IconButton","Downloads just this episode for offline watching.",[],`IconButton(\n  onPressed: downloadEpisode,\n  icon: const Icon(Icons.download),\n)`)
              ])
            ]),
            T("nd-episode-two","Card","A second episode repeats the same card layout, proving every episode follows one pattern.",[
              T("nd-episode-two-row","Row","Thumbnail left, text in the middle, download right, exactly like the first episode.",[
                T("nd-episode-two-thumb","Image","A different still marks this as a different episode.",[],`Image.network(\n  episode.thumbnailUrl,\n  width: 110,\n  fit: BoxFit.cover,\n)`),
                T("nd-episode-two-col","Column","Title above description above runtime, in the same order as the first episode.",[
                  T("nd-episode-two-title","Text","Names the second episode of the season.",[],`const Text(\n  'Chapter Two: The Weirdo',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
                  T("nd-episode-two-desc","Text","The second episode's summary, showing the story continues from the first.",[],`const Text(\n  'A strange girl with a shaved head appears at the diner.',\n  maxLines: 2,\n  style: TextStyle(fontSize: 12),\n)`),
                  T("nd-episode-two-time","Text","The second episode's runtime, in the same quiet style.",[],`const Text(\n  '55m',\n  style: TextStyle(fontSize: 11),\n)`)
                ]),
                T("nd-episode-two-download","IconButton","Downloads the second episode on its own.",[],`IconButton(\n  onPressed: downloadEpisode,\n  icon: const Icon(Icons.download),\n)`)
              ])
            ])
          ]),
          T("nd-trailers-page","Column","The Trailers page shows the title's official trailer as a playable thumbnail with its title below.",[
            T("nd-trailer-thumb","Stack","The trailer thumbnail layers the play button over the trailer art, so it reads as a video before it is tapped.",[
              T("nd-trailer-image","Image","The trailer's poster frame is what the viewer recognises and taps to watch it.",[],`Image.network(\n  trailer.thumbnailUrl,\n  fit: BoxFit.cover,\n)`),
              T("nd-trailer-play","Icon","The play triangle centred on the thumbnail signals that tapping starts the trailer.",[],`const Icon(Icons.play_circle_fill, color: Colors.white, size: 48)`)
            ]),
            T("nd-trailer-title","Text","Names the trailer under its thumbnail.",[],`const Text(\n  'Official Trailer',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
          ]),
          T("nd-more-page","Column","The More Like This page lists similar titles as compact cards, so the viewer can jump to the next watch without going back to home.",[
            T("nd-more-one","Card","One similar title is grouped on a card surface, so its poster and name read as one recommendation.",[
              T("nd-more-one-row","Row","The poster sits left and the title right, the compact pattern for recommendations.",[
                T("nd-more-one-poster","Image","The similar title's poster is what the viewer recognises.",[],`Image.network(\n  show.posterUrl,\n  width: 64,\n  fit: BoxFit.cover,\n)`),
                T("nd-more-one-name","Text","Names the first similar title.",[],`const Text(\n  'Dark',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
              ])
            ]),
            T("nd-more-two","Card","A second recommendation repeats the same card layout, showing the list continues.",[
              T("nd-more-two-row","Row","Poster left, title right, exactly like the first recommendation.",[
                T("nd-more-two-poster","Image","A different poster marks this as a different recommendation.",[],`Image.network(\n  show.posterUrl,\n  width: 64,\n  fit: BoxFit.cover,\n)`),
                T("nd-more-two-name","Text","Names the second similar title.",[],`const Text(\n  'Wednesday',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
              ])
            ])
          ])
        ],`TabBarView(\n  children: const [\n    EpisodesPage(),\n    TrailersPage(),\n    MoreLikeThisPage(),\n  ],\n)`,"The swipeable pages a TabBar switches between, such as Episodes, Trailers, and More Like This.")
      ])
    ],`const SingleChildScrollView(\n  child: TitleDetailBody(),\n)`,"Makes one tall child scrollable, so a long detail page fits on any screen.")
  ],`Scaffold(\n  appBar: const TitleDetailAppBar(),\n  body: const TitleDetailBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark().copyWith(\n    scaffoldBackgroundColor: const Color(0xFF141414),\n  ),\n  home: const NetflixTitleDetail(),\n)`);

TEARDOWNS["amazon-product"].root = T("ap-material","MaterialApp","The product detail screen inherits one shared Amazon theme and navigation context, and it also owns the '/gallery' route so the product image can fly to the full-screen gallery.",[
  T("ap-scaffold","Scaffold","Scaffold is the frame of the product page: the AppBar stays on top with back, search and cart, the product details scroll in the body, and the Add to Cart / Buy Now bar stays docked at the bottom. Without it each part would need its own positioning; with it Flutter knows exactly which slot each piece belongs to.",[
    T("ap-appbar","AppBar","AppBar works here as the product header: back in the leading slot, the search field as the title, and the cart with its count badge in the actions. Because it is an AppBar it also gets the dark Amazon header surface for free.",[
      T("ap-back","IconButton","Returns to the search results or home feed.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.arrow_back, color: Colors.white),\n)`),
      T("ap-search-field","TextField","Shoppers can jump straight from a product to searching for something else without going back.",[
        T("ap-search-icon","Icon","A magnifier marks this field as a search box before anything is typed.",[],`const Icon(Icons.search, color: Color(0xFF767676))`),
        T("ap-search-hint","Text","The hint tells shoppers what they can search for.",[],`const Text('Search Amazon.in', style: TextStyle(color: Color(0xFF767676)))`)
      ],`TextField(\n  decoration: const InputDecoration(\n    hintText: 'Search Amazon.in',\n    prefixIcon: Icon(Icons.search),\n    filled: true,\n    fillColor: Colors.white,\n    border: OutlineInputBorder(borderSide: BorderSide.none),\n  ),\n)`),
      T("ap-cart-stack","Stack","The cart icon and its count badge are layered in the same spot.",[
        T("ap-cart-badge","Badge","Badge is the small count label that sits on top of the cart icon: it shows '3' because three items are already in the cart, so shoppers can see the cart state at a glance without opening it. The badge needs no layout of its own — it simply decorates its child, the cart button, with a label anchored to its top-right corner.",[
          T("ap-cart","IconButton","Opens the cart to review items before checkout.",[],`IconButton(\n  onPressed: openCart,\n  icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),\n)`),
          T("ap-cart-count","Text","Shows how many items are already in the cart.",[],`const Text(\n  '3',\n  style: TextStyle(color: Color(0xFF131921), fontSize: 11, fontWeight: FontWeight.w800),\n)`)
        ],`Badge(\n  label: const Text('3'),\n  child: IconButton(\n    onPressed: openCart,\n    icon: const Icon(Icons.shopping_cart_outlined),\n  ),\n)`,"Shows a small count label anchored to another widget.")
      ])
    ],`AppBar(\n  backgroundColor: const Color(0xFF131921),\n  leading: const BackButton(color: Colors.white),\n  title: const SearchField(),\n  actions: [CartBadgeButton()],\n)`),
    T("ap-body","SingleChildScrollView","The product page is taller than the screen — image, title, price, options, delivery and the about list — so one scrollable child holds all of it. A ListView would work too, but there is exactly one child (the content Column), which is what SingleChildScrollView is for.",[
      T("ap-content","Column","Product image, thumbnails and the info block are stacked in reading order.",[
        T("ap-hero","Hero","Hero is the shared-element transition that makes the product image fly: the image on this detail page and the image on the full-screen gallery share the tag 'product-image', so when the shopper taps the photo, Flutter animates the same image growing from this small box into the full-screen gallery instead of cutting to a new screen. That flight only works because both screens exist in this one teardown entry — the gallery below is the Hero's destination, not a separate app.",[
          T("ap-hero-image","Image","Shows the main product photo; tapping it opens the full-screen gallery.",[],`Image.asset(\n  'assets/earbuds_main.png',\n  fit: BoxFit.cover,\n)`)
        ],`Hero(\n  tag: 'product-image',\n  child: Image.asset('assets/earbuds_main.png', fit: BoxFit.cover),\n)`,"Flies one widget between two screens as a shared-element transition."),
        T("ap-thumbs-row","Row","The three alternate product photos sit side by side under the main image.",[
          T("ap-thumb-1","Image","First alternate photo: the earbuds in their charging case.",[],`Image.asset('assets/earbuds_case.png', fit: BoxFit.cover)`),
          T("ap-thumb-2","Image","Second alternate photo: a single earbud close-up.",[],`Image.asset('assets/earbuds_single.png', fit: BoxFit.cover)`),
          T("ap-thumb-3","Image","Third alternate photo: the earbuds worn, showing fit.",[],`Image.asset('assets/earbuds_worn.png', fit: BoxFit.cover)`)
        ]),
        T("ap-info-padding","Padding","The whole info block gets one consistent inset from the screen edges.",[
          T("ap-info-column","Column","Title, rating, price, options and delivery details are stacked in the order a shopper reads them.",[
            T("ap-title","Text","Shows the full product name, brand and model.",[],`const Text(\n  'Wireless Earbuds Pro — Bluetooth 5.3, ANC, 30H Playtime',\n  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),\n)`),
            T("ap-rating-row","Row","Stars and the rating count share one line under the title.",[
              T("ap-stars","Text","Shows the average star rating at a glance.",[],`const Text(\n  '★★★★☆ 4.5',\n  style: TextStyle(color: Color(0xFFDE7921), fontSize: 13),\n)`),
              T("ap-rating-count","Text","Shows how many shoppers rated the product, so the stars carry weight.",[],`const Text(\n  '12,438 ratings',\n  style: TextStyle(color: Color(0xFF007185), fontSize: 12),\n)`)
            ]),
            T("ap-price-row","Row","Sale price, original price and the saving sit side by side.",[
              T("ap-price","Text","Shows the price shoppers actually pay.",[],`const Text(\n  '₹1,499',\n  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),\n)`),
              T("ap-mrp","Text","Shows the original price struck through, so the saving is visible.",[],`const Text(\n  '₹2,999',\n  style: TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey),\n)`),
              T("ap-discount","Text","States the discount as a percentage.",[],`const Text(\n  '50% off',\n  style: TextStyle(color: Color(0xFFCC0C39), fontWeight: FontWeight.w700),\n)`)
            ]),
            T("ap-prime-row","Row","The Prime badge and the delivery promise share one line.",[
              T("ap-prime-badge","Container","A small blue badge marks Prime-eligible products.",[
                T("ap-prime-text","Text","The Prime mark itself.",[],`const Text(\n  'prime',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontStyle: FontStyle.italic),\n)`)
              ],`Container(\n  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),\n  decoration: BoxDecoration(\n    color: const Color(0xFF00A8E1),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Text('prime'),\n)`),
              T("ap-delivery-text","Text","Tells shoppers the fastest free delivery date before they scroll further.",[],`const Text(\n  'FREE delivery by Tomorrow',\n  style: TextStyle(fontSize: 12),\n)`)
            ]),
            T("ap-divider","Divider","A thin rule separates the price block from the options below it, so the two groups read as distinct sections.",[],`const Divider(height: 24)`,"Draws a thin horizontal rule separating two sections."),
            T("ap-colour-label","Text","Names the currently selected colour so the swatches below it mean something.",[],`const Text(\n  'Colour: Midnight Black',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`),
            T("ap-colour-row","Row","The three colour choices sit side by side; tapping one swaps the product photo.",[
              T("ap-swatch-1","Container","The selected colour: a filled black circle with an orange ring marking it as chosen.",[],`Container(\n  width: 28,\n  height: 28,\n  decoration: BoxDecoration(\n    color: const Color(0xFF1A1A1A),\n    shape: BoxShape.circle,\n    border: Border.all(color: Color(0xFFFF9900), width: 2),\n  ),\n)`),
              T("ap-swatch-2","Container","Second colour choice: pearl white.",[],`Container(\n  width: 28,\n  height: 28,\n  decoration: const BoxDecoration(\n    color: Color(0xFFF2F2F2),\n    shape: BoxShape.circle,\n    border: Border.fromBorderSide(BorderSide(color: Colors.grey)),\n  ),\n)`),
              T("ap-swatch-3","Container","Third colour choice: ocean blue.",[],`Container(\n  width: 28,\n  height: 28,\n  decoration: const BoxDecoration(\n    color: Color(0xFF3B6EA5),\n    shape: BoxShape.circle,\n  ),\n)`)
            ]),
            T("ap-qty-row","Row","The quantity label and its picker share one line.",[
              T("ap-qty-label","Text","Labels the quantity picker.",[],`const Text('Quantity:', style: TextStyle(fontWeight: FontWeight.w600))`),
              T("ap-qty-dropdown","DropdownButton","Taught in depth in Settings — Appearance; here it is the compact quantity picker. It shows the current value ('1') and opens a small menu of 1–5 when tapped, which is exactly the DropdownButton use case: one choice from a short list, taking almost no screen space until it is opened.",[
                T("ap-qty-value","Text","Shows the currently selected quantity.",[],`const Text('1')`)
              ],`DropdownButton<int>(\n  value: 1,\n  items: [1, 2, 3, 4, 5].map((q) => DropdownMenuItem(value: q, child: Text('$q'))).toList(),\n  onChanged: (q) => setState(() => quantity = q ?? 1),\n)`,"Shows the current choice and opens a compact menu to pick another.")
            ]),
            T("ap-highlights-wrap","Wrap","Taught in depth in Netflix — Title detail; here it lays out the feature chips. The four highlights do not fit on one line, so Wrap flows the extra chips onto a second line automatically — a Row would overflow instead.",[
              T("ap-chip-1","Chip","Names one headline feature as a small labelled pill.",[
                T("ap-chip-text-1","Text","Names the Bluetooth version.",[],`const Text('Bluetooth 5.3')`)
              ],`const Chip(label: Text('Bluetooth 5.3'))`,"Shows a compact, tappable label for one filter or category."),
              T("ap-chip-2","Chip","Names the battery life as a headline feature.",[
                T("ap-chip-text-2","Text","Names the total playtime.",[],`const Text('30h battery')`)
              ],`const Chip(label: Text('30h battery'))`,"Shows a compact, tappable label for one filter or category."),
              T("ap-chip-3","Chip","Names the water resistance as a headline feature.",[
                T("ap-chip-text-3","Text","Names the water-resistance rating.",[],`const Text('IPX5 water resistant')`)
              ],`const Chip(label: Text('IPX5 water resistant'))`,"Shows a compact, tappable label for one filter or category."),
              T("ap-chip-4","Chip","Names the noise cancellation as a headline feature.",[
                T("ap-chip-text-4","Text","Names the noise-cancellation feature.",[],`const Text('Active noise cancellation')`)
              ],`const Chip(label: Text('Active noise cancellation'))`,"Shows a compact, tappable label for one filter or category.")
            ],`Wrap(\n  spacing: 6,\n  runSpacing: 6,\n  children: const [Chip(label: Text('Bluetooth 5.3')), Chip(label: Text('30h battery')), Chip(label: Text('IPX5 water resistant')), Chip(label: Text('Active noise cancellation'))],\n)`),
            T("ap-delivery-box","Container","A bordered box groups the delivery and stock facts so they read as one block.",[
              T("ap-delivery-column","Column","Delivery date, delivery detail and stock status are stacked inside the box.",[
                T("ap-delivery-title","Text","Labels the delivery block.",[],`const Text('Delivery', style: TextStyle(fontWeight: FontWeight.w700))`),
                T("ap-delivery-detail","Text","Gives the exact free-delivery date and the order-by time.",[],`const Text('FREE delivery Tomorrow, 9 Nov. Order within 4 hrs 32 mins.')`),
                T("ap-stock","Text","Reassures shoppers the item is in stock and names the seller.",[],`const Text(\n  'In stock — sold by Cloudtail India',\n  style: TextStyle(color: Color(0xFF067D62)),\n)`)
              ])
            ],`Container(\n  padding: const EdgeInsets.all(12),\n  decoration: BoxDecoration(\n    border: Border.all(color: Color(0xFFE3E6E6)),\n    borderRadius: BorderRadius.circular(8),\n  ),\n  child: const DeliveryInfo(),\n)`),
            T("ap-about-title","Text","Introduces the bullet list of what the product does.",[],`const Text('About this item', style: TextStyle(fontWeight: FontWeight.w700))`),
            T("ap-about-list","Column","The three key facts about the earbuds are stacked as short lines.",[
              T("ap-about-1","Text","First key fact: active noise cancellation.",[],`const Text('• Active noise cancellation blocks up to 98% of ambient noise.')`),
              T("ap-about-2","Text","Second key fact: battery life.",[],`const Text('• 30 hours total playtime with the charging case; 10-min charge gives 3 hours.')`),
              T("ap-about-3","Text","Third key fact: microphones for calls.",[],`const Text('• 4-mic array with ENC for clear calls, even outdoors.')`)
            ])
          ])
        ],`Padding(\n  padding: const EdgeInsets.all(12),\n  child: const ProductInfo(),\n)`)
      ])
    ],`SingleChildScrollView(\n  child: const ProductContent(),\n)`),
    T("ap-buybar","Container","The buy bar is docked at the bottom of the Scaffold, outside the scrolling body, so Add to Cart and Buy Now are always one tap away no matter how far the shopper has scrolled.",[
      T("ap-buy-row","Row","The two purchase actions share the bottom bar equally.",[
        T("ap-add-cart","ElevatedButton","Adds one unit of the product to the cart and shows the cart count badge going up.",[
          T("ap-add-cart-text","Text","Labels the add-to-cart action.",[],`const Text('Add to Cart')`)
        ],`ElevatedButton(\n  onPressed: addToCart,\n  style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFFFD814)),\n  child: const Text('Add to Cart'),\n)`,"Shows a primary action with a filled background and elevation."),
        T("ap-buy-now","ElevatedButton","Skips the cart and goes straight to checkout with this product.",[
          T("ap-buy-now-text","Text","Labels the buy-now action.",[],`const Text('Buy Now')`)
        ],`ElevatedButton(\n  onPressed: buyNow,\n  style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFFFA41C)),\n  child: const Text('Buy Now'),\n)`,"Shows a primary action with a filled background and elevation.")
      ])
    ],`Container(\n  padding: const EdgeInsets.fromLTRB(12, 10, 12, 14),\n  decoration: const BoxDecoration(\n    border: Border(top: BorderSide(color: Color(0xFFE3E6E6))),\n  ),\n  child: const BuyBar(),\n)`)
  ],`Scaffold(\n  appBar: const ProductAppBar(),\n  body: const SingleChildScrollView(child: ProductContent()),\n  bottomNavigationBar: const BuyBar(),\n)`),
  T("ap-gallery","Scaffold","The full-screen gallery is the Hero's destination screen: it shows the same product image large, with a close action and a photo counter. It lives in this same teardown entry because a Hero needs two screens to demonstrate — without the gallery, the Hero on the detail page would be a claim, not a demo.",[
    T("ap-gallery-appbar","AppBar","The gallery header holds close, the photo position and share in one dark bar.",[
      T("ap-gallery-close","IconButton","Closes the gallery and flies the image back to the detail page.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.close, color: Colors.white),\n)`),
      T("ap-gallery-title","Text","Shows which photo of the set is on screen.",[],`const Text(\n  '1 of 4',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),\n)`),
      T("ap-gallery-share","IconButton","Shares the product photo or link.",[],`IconButton(\n  onPressed: shareProduct,\n  icon: const Icon(Icons.share_outlined, color: Colors.white),\n)`)
    ],`AppBar(\n  backgroundColor: Colors.black,\n  leading: const CloseButton(color: Colors.white),\n  title: const Text('1 of 4'),\n  actions: [ShareButton()],\n)`),
    T("ap-gallery-body","Stack","The large photo and the photo counter are layered in the same box.",[
      T("ap-gallery-hero","Hero","The other end of the shared-element transition: this Hero carries the same tag 'product-image' as the detail page, so Flutter knows the two images are the same widget flying between screens. Tapping the detail photo grows this image to full screen; closing shrinks it back.",[
        T("ap-gallery-image","Image","Shows the product photo at full-screen size.",[],`Image.asset(\n  'assets/earbuds_main.png',\n  fit: BoxFit.contain,\n)`)
      ],`Hero(\n  tag: 'product-image',\n  child: Image.asset('assets/earbuds_main.png', fit: BoxFit.contain),\n)`,"Flies one widget between two screens as a shared-element transition."),
      T("ap-gallery-counter","Positioned","Taught in depth in Amazon — Home; here it pins the '1 / 4' counter to the bottom centre of the gallery, floating over the photo.",[
        T("ap-gallery-counter-text","Text","Shows the current photo number out of four.",[],`const Text(\n  '1 / 4',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),\n)`)
      ],`Positioned(\n  bottom: 24,\n  left: 0,\n  right: 0,\n  child: const Center(child: Text('1 / 4')),\n)`,"Positions a child relative to the edges of its Stack.")
    ])
  ],`Scaffold(\n  backgroundColor: Colors.black,\n  appBar: const GalleryAppBar(),\n  body: const GalleryBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF9900)),\n  home: const ProductDetailPage(),\n  routes: {'/gallery': (_) => const ProductGalleryPage()},\n)`);

TEARDOWNS["instagram-reels"].root = T("ir-material","MaterialApp","The Reels screen inherits one shared Instagram theme and navigation context.",[
  T("ir-scaffold","Scaffold","Scaffold is the frame of the Reels screen: the full-screen vertical feed fills the body and the BottomNavigationBar stays docked below it. The top bar floats over the feed instead of being an AppBar, because Reels is an immersive full-screen view with no fixed header.",[
    T("ir-body","Stack","The vertical feed and the floating top bar are layered in the same box: the PageView fills the screen and the Reels title with its camera action sits on top of it.",[
      T("ir-reels","PageView","PageView is the vertical swipe between reels: each reel is one full-screen page, and swiping up moves to the next reel while swiping down goes back. This is the vertical case — the direction is what makes it different from a horizontal PageView like a photo carousel — so scrollDirection is Axis.vertical and every page is exactly one screen tall, which is why the feed feels like flipping through videos rather than scrolling a list.",[
        T("ir-reel-1","Stack","One reel page layers four things in the same full-screen box: the video, the double-tap heart overlay, the action rail on the right, and the caption block at the bottom.",[
          T("ir-video-1","Image","Shows the first reel's video frame — a gradient poster standing in for the playing video.",[],`Image.asset('assets/reel_flutter.png', fit: BoxFit.cover)`),
          T("ir-heart-1","AnimatedOpacity","AnimatedOpacity is the double-tap heart: when the reel is double-tapped, the heart's opacity animates from 0.0 to 1.0 over 300ms so the big heart pops in, then fades back out. A plain Opacity widget could only show or hide it instantly; AnimatedOpacity interpolates the fade, which is what makes the pop feel alive instead of blinking.",[
            T("ir-heart-icon-1","Icon","The big white heart that pops in the middle of the reel on a double-tap.",[],`const Icon(Icons.favorite, size: 84, color: Colors.white)`)
          ],`AnimatedOpacity(\n  opacity: _liked ? 1.0 : 0.0,\n  duration: const Duration(milliseconds: 300),\n  child: const Icon(Icons.favorite, size: 84, color: Colors.white),\n)`,"Fades a child in or out when its opacity changes."),
          T("ir-rail-1","Column","Like, comment, share and the music disc are stacked down the right edge of the reel.",[
            T("ir-like-1","IconButton","Likes the reel; the count below it goes up by one.",[],`IconButton(\n  onPressed: likeReel,\n  icon: const Icon(Icons.favorite_border, color: Colors.white),\n)`),
            T("ir-like-count-1","Text","Shows how many likes the reel has.",[],`const Text('128K', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-comment-1","IconButton","Opens the comments sheet for this reel.",[],`IconButton(\n  onPressed: openComments,\n  icon: const Icon(Icons.chat_bubble_outline, color: Colors.white),\n)`),
            T("ir-comment-count-1","Text","Shows how many comments the reel has.",[],`const Text('2,431', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-share-1","IconButton","Shares the reel to a chat or another app.",[],`IconButton(\n  onPressed: shareReel,\n  icon: const Icon(Icons.send, color: Colors.white),\n)`),
            T("ir-share-count-1","Text","Shows how many times the reel has been shared.",[],`const Text('8,204', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-disc-1","CircleAvatar","The spinning music disc: tapping it opens the audio page for the reel's sound.",[],`const CircleAvatar(\n  radius: 13,\n  backgroundColor: Colors.black54,\n  child: Icon(Icons.music_note, size: 14, color: Colors.white),\n)`)
          ]),
          T("ir-caption-1","Column","The creator row, caption and audio row sit at the bottom-left of the reel, over the video.",[
            T("ir-user-row-1","Row","Avatar, username and Follow share the creator line.",[
              T("ir-user-avatar-1","CircleAvatar","The creator's profile picture.",[],`const CircleAvatar(\n  radius: 14,\n  backgroundColor: Color(0xFF1A73E8),\n  child: Text('FF', style: TextStyle(fontSize: 10, color: Colors.white)),\n)`),
              T("ir-username-1","Text","Shows the reel creator's handle.",[],`const Text(\n  'flutterforward',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
              T("ir-follow-1","OutlinedButton","Follows the creator without leaving the reel.",[
                T("ir-follow-text-1","Text","Labels the follow action.",[],`const Text('Follow', style: TextStyle(color: Colors.white))`)
              ],`OutlinedButton(\n  onPressed: followCreator,\n  style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.white)),\n  child: const Text('Follow'),\n)`,"Shows a secondary action with a visible outline.")
            ]),
            T("ir-caption-text-1","Text","The reel's caption, truncated to two lines with more on tap.",[],`const Text(\n  'Build your first Flutter app in a day — full tutorial in bio.',\n  maxLines: 2,\n  overflow: TextOverflow.ellipsis,\n  style: TextStyle(color: Colors.white),\n)`),
            T("ir-audio-row-1","Row","The music note and the audio name share one line under the caption.",[
              T("ir-audio-icon-1","Icon","A music note marks this row as the reel's audio.",[],`const Icon(Icons.music_note, size: 14, color: Colors.white)`),
              T("ir-audio-text-1","Text","Names the audio track so viewers can find it.",[],`const Text(\n  'flutterforward • Original audio',\n  style: TextStyle(color: Colors.white, fontSize: 12),\n)`)
            ])
          ])
        ]),
        T("ir-reel-2","Stack","The second reel page: same layered structure as the first — video, heart overlay, action rail and caption — with different content.",[
          T("ir-video-2","Image","Shows the second reel's video frame.",[],`Image.asset('assets/reel_dart.png', fit: BoxFit.cover)`),
          T("ir-heart-2","AnimatedOpacity","The double-tap heart for the second reel: it fades in when this reel is double-tapped and out again, exactly like the first reel's heart.",[
            T("ir-heart-icon-2","Icon","The big white heart that pops in the middle of the second reel on a double-tap.",[],`const Icon(Icons.favorite, size: 84, color: Colors.white)`)
          ],`AnimatedOpacity(\n  opacity: _liked ? 1.0 : 0.0,\n  duration: const Duration(milliseconds: 300),\n  child: const Icon(Icons.favorite, size: 84, color: Colors.white),\n)`,"Fades a child in or out when its opacity changes."),
          T("ir-rail-2","Column","Like, comment, share and the music disc for the second reel.",[
            T("ir-like-2","IconButton","Likes the second reel.",[],`IconButton(\n  onPressed: likeReel,\n  icon: const Icon(Icons.favorite_border, color: Colors.white),\n)`),
            T("ir-like-count-2","Text","Shows how many likes the second reel has.",[],`const Text('86K', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-comment-2","IconButton","Opens the comments sheet for the second reel.",[],`IconButton(\n  onPressed: openComments,\n  icon: const Icon(Icons.chat_bubble_outline, color: Colors.white),\n)`),
            T("ir-comment-count-2","Text","Shows how many comments the second reel has.",[],`const Text('1,102', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-share-2","IconButton","Shares the second reel.",[],`IconButton(\n  onPressed: shareReel,\n  icon: const Icon(Icons.send, color: Colors.white),\n)`),
            T("ir-share-count-2","Text","Shows how many times the second reel has been shared.",[],`const Text('3,917', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-disc-2","CircleAvatar","The spinning music disc for the second reel's sound.",[],`const CircleAvatar(\n  radius: 13,\n  backgroundColor: Colors.black54,\n  child: Icon(Icons.music_note, size: 14, color: Colors.white),\n)`)
          ]),
          T("ir-caption-2","Column","The creator row, caption and audio row for the second reel.",[
            T("ir-user-row-2","Row","Avatar, username and Follow for the second reel's creator.",[
              T("ir-user-avatar-2","CircleAvatar","The second creator's profile picture.",[],`const CircleAvatar(\n  radius: 14,\n  backgroundColor: Color(0xFF0F9D58),\n  child: Text('CD', style: TextStyle(fontSize: 10, color: Colors.white)),\n)`),
              T("ir-username-2","Text","Shows the second reel creator's handle.",[],`const Text(\n  'codewithdheeraj',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
              T("ir-follow-2","OutlinedButton","Follows the second creator without leaving the reel.",[
                T("ir-follow-text-2","Text","Labels the follow action.",[],`const Text('Follow', style: TextStyle(color: Colors.white))`)
              ],`OutlinedButton(\n  onPressed: followCreator,\n  style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.white)),\n  child: const Text('Follow'),\n)`,"Shows a secondary action with a visible outline.")
            ]),
            T("ir-caption-text-2","Text","The second reel's caption.",[],`const Text(\n  'Dart null safety in 60 seconds — save this for later.',\n  maxLines: 2,\n  overflow: TextOverflow.ellipsis,\n  style: TextStyle(color: Colors.white),\n)`),
            T("ir-audio-row-2","Row","The music note and audio name for the second reel.",[
              T("ir-audio-icon-2","Icon","A music note marks this row as the second reel's audio.",[],`const Icon(Icons.music_note, size: 14, color: Colors.white)`),
              T("ir-audio-text-2","Text","Names the second reel's audio track.",[],`const Text(\n  'lofi beats • Trending audio',\n  style: TextStyle(color: Colors.white, fontSize: 12),\n)`)
            ])
          ])
        ]),
        T("ir-reel-3","Stack","The third reel page: same layered structure, different content.",[
          T("ir-video-3","Image","Shows the third reel's video frame.",[],`Image.asset('assets/reel_ui.png', fit: BoxFit.cover)`),
          T("ir-heart-3","AnimatedOpacity","The double-tap heart for the third reel: it fades in when this reel is double-tapped and out again, exactly like the first reel's heart.",[
            T("ir-heart-icon-3","Icon","The big white heart that pops in the middle of the third reel on a double-tap.",[],`const Icon(Icons.favorite, size: 84, color: Colors.white)`)
          ],`AnimatedOpacity(\n  opacity: _liked ? 1.0 : 0.0,\n  duration: const Duration(milliseconds: 300),\n  child: const Icon(Icons.favorite, size: 84, color: Colors.white),\n)`,"Fades a child in or out when its opacity changes."),
          T("ir-rail-3","Column","Like, comment, share and the music disc for the third reel.",[
            T("ir-like-3","IconButton","Likes the third reel.",[],`IconButton(\n  onPressed: likeReel,\n  icon: const Icon(Icons.favorite_border, color: Colors.white),\n)`),
            T("ir-like-count-3","Text","Shows how many likes the third reel has.",[],`const Text('214K', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-comment-3","IconButton","Opens the comments sheet for the third reel.",[],`IconButton(\n  onPressed: openComments,\n  icon: const Icon(Icons.chat_bubble_outline, color: Colors.white),\n)`),
            T("ir-comment-count-3","Text","Shows how many comments the third reel has.",[],`const Text('5,830', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-share-3","IconButton","Shares the third reel.",[],`IconButton(\n  onPressed: shareReel,\n  icon: const Icon(Icons.send, color: Colors.white),\n)`),
            T("ir-share-count-3","Text","Shows how many times the third reel has been shared.",[],`const Text('12,540', style: TextStyle(color: Colors.white, fontSize: 11))`),
            T("ir-disc-3","CircleAvatar","The spinning music disc for the third reel's sound.",[],`const CircleAvatar(\n  radius: 13,\n  backgroundColor: Colors.black54,\n  child: Icon(Icons.music_note, size: 14, color: Colors.white),\n)`)
          ]),
          T("ir-caption-3","Column","The creator row, caption and audio row for the third reel.",[
            T("ir-user-row-3","Row","Avatar, username and Follow for the third reel's creator.",[
              T("ir-user-avatar-3","CircleAvatar","The third creator's profile picture.",[],`const CircleAvatar(\n  radius: 14,\n  backgroundColor: Color(0xFF7B1FA2),\n  child: Text('UX', style: TextStyle(fontSize: 10, color: Colors.white)),\n)`),
              T("ir-username-3","Text","Shows the third reel creator's handle.",[],`const Text(\n  'uidesigndaily',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
              T("ir-follow-3","OutlinedButton","Follows the third creator without leaving the reel.",[
                T("ir-follow-text-3","Text","Labels the follow action.",[],`const Text('Follow', style: TextStyle(color: Colors.white))`)
              ],`OutlinedButton(\n  onPressed: followCreator,\n  style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.white)),\n  child: const Text('Follow'),\n)`,"Shows a secondary action with a visible outline.")
            ]),
            T("ir-caption-text-3","Text","The third reel's caption.",[],`const Text(\n  '5 layout mistakes every Flutter beginner makes.',\n  maxLines: 2,\n  overflow: TextOverflow.ellipsis,\n  style: TextStyle(color: Colors.white),\n)`),
            T("ir-audio-row-3","Row","The music note and audio name for the third reel.",[
              T("ir-audio-icon-3","Icon","A music note marks this row as the third reel's audio.",[],`const Icon(Icons.music_note, size: 14, color: Colors.white)`),
              T("ir-audio-text-3","Text","Names the third reel's audio track.",[],`const Text(\n  'uidesigndaily • Original audio',\n  style: TextStyle(color: Colors.white, fontSize: 12),\n)`)
            ])
          ])
        ])
      ],`PageView(\n  scrollDirection: Axis.vertical,\n  children: const [ReelPage(), ReelPage(), ReelPage()],\n)`),
      T("ir-top-positioned","Positioned","Pins the floating top bar to the top of the screen, over the playing reel.",[
        T("ir-topbar","Row","The Reels title and the camera action share the floating top line.",[
          T("ir-top-title","Text","Labels the feed as Reels so viewers know where they are.",[],`const Text(\n  'Reels',\n  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700),\n)`),
          T("ir-top-camera","IconButton","Opens the camera to record a new reel.",[],`IconButton(\n  onPressed: openCamera,\n  icon: const Icon(Icons.camera_alt_outlined, color: Colors.white),\n)`)
        ])
      ],`Positioned(\n  top: 0,\n  left: 0,\n  right: 0,\n  child: const ReelsTopBar(),\n)`,"Positions a child relative to the edges of its Stack.")
    ]),
    T("ir-bottom","BottomNavigationBar","BottomNavigationBar keeps the five primary Instagram destinations one tap away, with Reels highlighted as the active tab. It stays fixed while the reel feed swipes above it.",[
      T("ir-nav-home","Icon","Represents the Home destination.",[],`const Icon(Icons.home_outlined, color: Colors.white)`),
      T("ir-nav-search","Icon","Represents Search and Explore.",[],`const Icon(Icons.search, color: Colors.white)`),
      T("ir-nav-create","Icon","Represents content creation.",[],`const Icon(Icons.add_box_outlined, color: Colors.white)`),
      T("ir-nav-reels","Icon","Represents the active Reels destination.",[],`const Icon(Icons.smart_display, color: Colors.white)`),
      T("ir-nav-profile","CircleAvatar","Represents the active profile destination.",[],`const CircleAvatar(radius: 11, backgroundColor: Color(0xFF1A73E8))`)
    ],`BottomNavigationBar(\n  currentIndex: 3,\n  type: BottomNavigationBarType.fixed,\n  backgroundColor: Colors.black,\n  items: reelsNavigationItems,\n)`)
  ],`Scaffold(\n  body: const ReelsFeed(),\n  bottomNavigationBar: const ReelsBottomNav(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark(),\n  home: const ReelsScreen(),\n)`);

TEARDOWNS["amazon-checkout"].root = T("ac-material","MaterialApp","The Amazon checkout screen inherits one shared theme and navigation context.",[
  T("ac-scaffold","Scaffold","The app bar, the scrolling checkout content, and the place-order button share one stable page frame.",[
    T("ac-appbar","AppBar","The dark Amazon bar stays pinned above the checkout, so the back action and the Checkout title are always visible while the steps scroll underneath.",[
      T("ac-back","IconButton","Returns to the cart without placing the order.",[],`IconButton(\n  icon: const Icon(Icons.arrow_back, color: Colors.white),\n  onPressed: () => Navigator.pop(context),\n)`),
      T("ac-title","Text","It labels the screen so the shopper knows this is checkout, not the cart.",[],`const Text(\n  'Checkout',\n  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w600),\n)`)
    ],`AppBar(\n  backgroundColor: const Color(0xFF131921),\n  leading: const BackButton(color: Colors.white),\n  title: const Text('Checkout', style: TextStyle(color: Colors.white)),\n)`),
    T("ac-body","ListView","Address, payment, review, the order items, and the price summary scroll as one checkout page, so the shopper can move through the steps without leaving the screen.",[
      T("ac-stepper","Stepper","Stepper turns a long checkout into numbered steps — Address, Payment, Review — so the shopper always knows where they are and what is left. Each Step holds its own content, and the Stepper tracks which step is complete, which is active, and which is still ahead. Amazon uses it because a single giant form would overwhelm; steps let the shopper finish one decision at a time and go back to fix one without losing the rest.",[
        T("ac-step-address","Step","The first step is already done: the delivery address was picked on the cart screen, so it shows as complete with a check instead of asking again.",[
          T("ac-step-address-title","Text","Names the first step of the checkout.",[],`const Text('Delivery address')`),
          T("ac-step-address-detail","Text","Shows the saved address so the shopper can spot a wrong one before paying.",[],`const Text(\n  'Dheeraj Kumar · MG Road, Jaipur 302001',\n  style: TextStyle(color: Colors.grey),\n)`)
        ],`Step(\n  title: const Text('Delivery address'),\n  content: const Text('Dheeraj Kumar, MG Road, Jaipur 302001'),\n  state: StepState.complete,\n)`,"One step inside a Stepper: a title, content, and a state (complete, active, or upcoming)."),
        T("ac-step-payment","Step","This is the active step: the shopper is choosing how to pay right now, so its content is open while the review step below stays collapsed.",[
          T("ac-step-payment-title","Text","Names the step where the shopper picks a payment method.",[],`const Text('Payment method')`),
          T("ac-step-payment-options","Column","The three payment choices are stacked vertically inside the step, so each gets a full-width row that is easy to tap.",[
            T("ac-pay-upi-row","Row","One payment option: the Radio and its label share a row.",[
              T("ac-pay-upi","Radio","Radio is taught in depth in Settings — Appearance, where it picks the app theme. Here it does the same job for money: each payment method is one Radio in a single group, so picking UPI un-picks the card and cash on delivery automatically — the group guarantees exactly one payment method is chosen.",[],`Radio<String>(\n  value: 'upi',\n  groupValue: paymentMethod,\n  onChanged: selectPayment,\n)`,"One option in a mutually-exclusive group. Taught in depth in Settings — Appearance; here it picks one payment method."),
              T("ac-pay-upi-label","Text","Names the UPI option and shows which UPI id will be charged.",[],`const Text('UPI · dheeraj@okhdfc')`)
            ]),
            T("ac-pay-card-row","Row","One payment option: the Radio and its label share a row.",[
              T("ac-pay-card","Radio","Radio is taught in depth in Settings — Appearance, where it picks the app theme. Here it is the card option in the same payment group: selecting it clears the UPI choice, because only one Radio in a group can be selected at a time.",[],`Radio<String>(\n  value: 'card',\n  groupValue: paymentMethod,\n  onChanged: selectPayment,\n)`,"One option in a mutually-exclusive group. Taught in depth in Settings — Appearance; here it picks one payment method."),
              T("ac-pay-card-label","Text","Names the saved card option, showing only its last four digits.",[],`const Text('Card · HDFC •••• 4242')`)
            ]),
            T("ac-pay-cod-row","Row","One payment option: the Radio and its label share a row.",[
              T("ac-pay-cod","Radio","Radio is taught in depth in Settings — Appearance, where it picks the app theme. Here it is the cash-on-delivery option in the same payment group: picking it means no online payment happens at all.",[],`Radio<String>(\n  value: 'cod',\n  groupValue: paymentMethod,\n  onChanged: selectPayment,\n)`,"One option in a mutually-exclusive group. Taught in depth in Settings — Appearance; here it picks one payment method."),
              T("ac-pay-cod-label","Text","Names the pay-in-cash option.",[],`const Text('Cash on delivery')`)
            ])
          ])
        ],`Step(\n  title: const Text('Payment method'),\n  content: const PaymentOptions(),\n  isActive: true,\n)`,"One step inside a Stepper: a title, content, and a state (complete, active, or upcoming)."),
        T("ac-step-review","Step","The last step stays collapsed until payment is chosen: it will show the final order summary for one last check before the order is placed.",[
          T("ac-step-review-title","Text","Names the final step of the checkout.",[],`const Text('Review items')`),
          T("ac-step-review-detail","Text","Previews what the review step will confirm: how many items and when they arrive.",[],`const Text(\n  '2 items · arrives Thu, 12 Nov',\n  style: TextStyle(color: Colors.grey),\n)`)
        ],`Step(\n  title: const Text('Review items'),\n  content: const Text('2 items · arrives Thu, 12 Nov'),\n)`,"One step inside a Stepper: a title, content, and a state (complete, active, or upcoming).")
      ],`Stepper(\n  currentStep: 1,\n  steps: const [\n    Step(\n      title: Text('Delivery address'),\n      content: Text('Dheeraj Kumar, MG Road, Jaipur 302001'),\n      state: StepState.complete,\n    ),\n    Step(\n      title: Text('Payment method'),\n      content: PaymentOptions(),\n      isActive: true,\n    ),\n    Step(\n      title: Text('Review items'),\n      content: Text('2 items · arrives Thu, 12 Nov'),\n    ),\n  ],\n  onStepContinue: goToNextStep,\n)`,"A numbered multi-step flow: one step at a time, with a clear sense of progress."),
      T("ac-cart-header","Text","Introduces the items being bought, below the steps.",[],`const Text(\n  'Your order',\n  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),\n)`),
      T("ac-item-1","Card","One item reads as a single card: its photo, name, seller, and price stay grouped so the shopper can check each item before paying.",[
        T("ac-item-1-row","Row","Photo on the left, details on the right, in one horizontal row.",[
          T("ac-item-1-image","Image","Shows the product photo so the shopper can confirm it is the right item.",[],`Image.asset(\n  'assets/earbuds_pro.png',\n  width: 64,\n  height: 64,\n  fit: BoxFit.cover,\n)`),
          T("ac-item-1-col","Column","Name, seller, and price are stacked beside the photo.",[
            T("ac-item-1-name","Text","Shows the product name.",[],`const Text(\n  'Wireless Earbuds Pro',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("ac-item-1-meta","Text","Shows the colour and who is selling it.",[],`const Text(\n  'Black · Sold by Cloudtail',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`),
            T("ac-item-1-price-row","Row","Price and quantity sit side by side under the name.",[
              T("ac-item-1-price","Text","Shows what this item costs.",[],`const Text(\n  '₹1,499',\n  style: TextStyle(fontWeight: FontWeight.w800),\n)`),
              T("ac-item-1-qty","Text","Shows how many of this item are in the order.",[],`const Text(\n  'Qty: 1',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`)
            ])
          ])
        ])
      ]),
      T("ac-item-2","Card","The second item gets its own card, identical in shape to the first, so the order reads as a list of equal items.",[
        T("ac-item-2-row","Row","Photo on the left, details on the right, in one horizontal row.",[
          T("ac-item-2-image","Image","Shows the product photo so the shopper can confirm it is the right item.",[],`Image.asset(\n  'assets/backpack_32l.png',\n  width: 64,\n  height: 64,\n  fit: BoxFit.cover,\n)`),
          T("ac-item-2-col","Column","Name, seller, and price are stacked beside the photo.",[
            T("ac-item-2-name","Text","Shows the product name.",[],`const Text(\n  'Travel Backpack 32L',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("ac-item-2-meta","Text","Shows the colour and who is selling it.",[],`const Text(\n  'Grey · Sold by Appario',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`),
            T("ac-item-2-price-row","Row","Price and quantity sit side by side under the name.",[
              T("ac-item-2-price","Text","Shows what this item costs.",[],`const Text(\n  '₹899',\n  style: TextStyle(fontWeight: FontWeight.w800),\n)`),
              T("ac-item-2-qty","Text","Shows how many of this item are in the order.",[],`const Text(\n  'Qty: 1',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`)
            ])
          ])
        ])
      ]),
      T("ac-gift-row","Row","The gift tick box and its label share one row under the items.",[
        T("ac-gift-checkbox","Checkbox","Checkbox is taught in depth in Tasks — Task list, where it marks a task complete. Here it is a single independent choice: ticking it marks this order as a gift, without affecting anything else on the screen.",[],`Checkbox(\n  value: false,\n  onChanged: (value) => setState(() => isGift = value!),\n)`,"A square tick box. Taught in depth in Tasks — Task list; here it marks the order as a gift."),
        T("ac-gift-label","Text","Labels the gift option.",[],`const Text('This order is a gift')`)
      ]),
      T("ac-summary-card","Card","The price breakdown sits on its own raised card so the final total is unmissable before the order button.",[
        T("ac-summary-col","Column","Subtotal, delivery, divider, and total are stacked in reading order.",[
          T("ac-summary-subtotal-row","Row","Label on the left, amount on the right.",[
            T("ac-summary-subtotal-label","Text","Labels the items subtotal.",[],`const Text('Subtotal')`),
            T("ac-summary-subtotal-value","Text","Shows the items total before delivery.",[],`const Text(\n  '₹2,398',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`)
          ]),
          T("ac-summary-delivery-row","Row","Label on the left, amount on the right.",[
            T("ac-summary-delivery-label","Text","Labels the delivery charge.",[],`const Text('Delivery')`),
            T("ac-summary-delivery-value","Text","Shows delivery is free for this order.",[],`const Text(\n  'FREE',\n  style: TextStyle(color: Color(0xFF067D62), fontWeight: FontWeight.w600),\n)`)
          ]),
          T("ac-summary-divider","Divider","Separates the charges above from the final total below.",[],`const Divider(height: 1)`,"A thin horizontal line."),
          T("ac-summary-total-row","Row","Label on the left, amount on the right, both bold.",[
            T("ac-summary-total-label","Text","Labels the final amount to pay.",[],`const Text(\n  'Order total',\n  style: TextStyle(fontWeight: FontWeight.w800),\n)`),
            T("ac-summary-total-value","Text","Shows the final amount to pay.",[],`const Text(\n  '₹2,398',\n  style: TextStyle(fontWeight: FontWeight.w800),\n)`)
          ])
        ])
      ]),
      T("ac-place-order","ElevatedButton","The one primary action of the whole screen: it places the order with the chosen address and payment method. It is the only filled button on the page, so the eye lands on it last and the finger knows where to go.",[
        T("ac-place-order-label","Text","Labels the order action.",[],`const Text('Place order')`)
      ],`ElevatedButton(\n  onPressed: placeOrder,\n  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFFD814)),\n  child: const Text('Place order'),\n)`,"Shows a primary action with a filled background and elevation."),
      T("ac-secure-row","Row","The lock icon and the security note share one reassuring line under the button.",[
        T("ac-secure-icon","Icon","The lock marks the checkout as secure before the shopper pays.",[],`const Icon(Icons.lock, color: Color(0xFF067D62), size: 16)`),
        T("ac-secure-text","Text","Reassures the shopper that payment details are encrypted.",[],`const Text(\n  'Secure checkout · 256-bit SSL encryption',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`)
      ])
    ])
  ])
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF9900)),\n  home: const CheckoutScreen(),\n)`);

TEARDOWNS["settings-appearance"].root = T("sa-scaffold","Scaffold","Scaffold is the frame of the page: it holds the Appearance app bar on top and the scrolling option groups in its body. Without it, the header and the groups would be separate widgets with nothing keeping them aligned.",[
  T("sa-appbar","AppBar","AppBar builds the top bar and pins it above the scrolling content, so the title and back action stay visible while the option groups scroll underneath. It tells the user where they are and offers one-tap exit back to the settings list.",[
    T("sa-back","IconButton","The back chevron pops this route off the navigation stack.",[],`IconButton(\n  icon: const Icon(Icons.arrow_back),\n  onPressed: () => Navigator.pop(context),\n)`, "A tappable icon that runs an action."),
    T("sa-title","Text","It labels the screen so the user knows these are the appearance settings.",[],`const Text(\n  'Appearance',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen.")
  ],`AppBar(\n  leading: const BackButton(),\n  title: const Text('Appearance'),\n)`, "Builds the top bar with a title and a leading back action."),
  T("sa-body","ListView","ListView lays the theme group, the language group, the text-size group, and the preview out in one scrollable vertical list, so every appearance option is reachable on a small screen while the app bar stays put.",[
    T("sa-theme-header","Text","The small-caps group label scans like a native settings section.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('THEME', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sa-theme-group","Container","It groups the three theme rows into one rounded section, so the mutually-exclusive choice reads as a single question with three answers.",[
      T("sa-theme-col","Column","The theme rows and their dividers are stacked inside the group.",[
        T("sa-theme-light-row","Row","One theme option: the Radio and its two-line label share a row.",[
          T("sa-radio-light","Radio","Radio is the widget for a choice where only one answer can win. The three theme options share one groupValue — themeMode — so selecting Dark automatically clears Light and System default; Flutter enforces the mutual exclusion, the screen never has to. That is why a settings screen uses Radio instead of three separate Switches, which could all be on at once and contradict each other.",[],`Radio<ThemeMode>(\n  value: ThemeMode.light,\n  groupValue: themeMode,\n  onChanged: selectTheme,\n)`,"One option in a mutually-exclusive group — only one Radio in the group can be selected."),
          T("sa-radio-light-label","Text","Names the light theme option.",[],`const Text(\n  'Light',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sa-radio-light-sub","Text","Explains what the light theme looks like.",[],`const Text(\n  'Bright background, dark text',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ]),
        T("sa-div1","Divider","It separates the theme rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 56)`,"A thin horizontal line."),
        T("sa-theme-dark-row","Row","One theme option: the Radio and its two-line label share a row.",[
          T("sa-radio-dark","Radio","The dark option in the same theme group: it shares the groupValue with Light and System default, so selecting it clears the other two. Radio is the right control here because the app can only ever be in one theme at a time.",[],`Radio<ThemeMode>(\n  value: ThemeMode.dark,\n  groupValue: themeMode,\n  onChanged: selectTheme,\n)`,"One option in a mutually-exclusive group — only one Radio in the group can be selected."),
          T("sa-radio-dark-label","Text","Names the dark theme option.",[],`const Text(\n  'Dark',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sa-radio-dark-sub","Text","Explains what the dark theme looks like.",[],`const Text(\n  'Dark background, light text',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ]),
        T("sa-div2","Divider","It separates the theme rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 56)`,"A thin horizontal line."),
        T("sa-theme-system-row","Row","One theme option: the Radio and its two-line label share a row.",[
          T("sa-radio-system","Radio","The system option in the same theme group: it hands the choice to the phone, so the app follows light or dark automatically. It is still one Radio in the group — choosing it clears Light and Dark.",[],`Radio<ThemeMode>(\n  value: ThemeMode.system,\n  groupValue: themeMode,\n  onChanged: selectTheme,\n)`,"One option in a mutually-exclusive group — only one Radio in the group can be selected."),
          T("sa-radio-system-label","Text","Names the system-default theme option.",[],`const Text(\n  'System default',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sa-radio-system-sub","Text","Explains that the phone decides the theme.",[],`const Text(\n  'Follows your phone\\'s theme',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ])
      ])
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const Column(\n    children: [LightThemeRow(), Divider(), DarkThemeRow(), Divider(), SystemThemeRow()],\n  ),\n)`, "A box that can hold padding, color, and decoration."),
    T("sa-lang-header","Text","The group label separates the language picker from the theme rows.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('LANGUAGE', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sa-lang-group","Container","It wraps the language row in the same rounded section style as the theme group.",[
      T("sa-lang-row","Row","Icon, label column, and the dropdown share one row: the label explains the setting, the dropdown shows the current language.",[
        T("sa-lang-icon","Icon","The globe marks this as the locale setting.",[],`const Icon(Icons.language_outlined, color: Color(0xFF5B5BD6))`, "Draws a Material icon glyph."),
        T("sa-lang-label-col","Column","It puts the label above the explanation.",[
          T("sa-lang-label","Text","Names the language setting.",[],`const Text(\n  'App language',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sa-lang-sub","Text","Explains what the language choice changes.",[],`const Text(\n  'Language for menus and buttons',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ]),
        T("sa-lang-dropdown","DropdownButton","DropdownButton keeps a long list of choices behind one compact button, so the language picker costs a single row instead of a whole screen. Tapping it opens a menu of every language; picking one closes the menu and updates the button's value. It fits settings screens because the current choice stays visible at all times while the alternatives stay one tap away.",[
          T("sa-lang-opt-en","Text","The English option in the language menu; it is the current choice.",[],`const Text('English')`, "Renders a styled string on screen."),
          T("sa-lang-opt-hi","Text","The Hindi option in the language menu.",[],`const Text('हिन्दी')`, "Renders a styled string on screen."),
          T("sa-lang-opt-es","Text","The Spanish option in the language menu.",[],`const Text('Español')`, "Renders a styled string on screen.")
        ],`DropdownButton<String>(\n  value: 'en',\n  items: const [\n    DropdownMenuItem(value: 'en', child: Text('English')),\n    DropdownMenuItem(value: 'hi', child: Text('हिन्दी')),\n    DropdownMenuItem(value: 'es', child: Text('Español')),\n  ],\n  onChanged: selectLanguage,\n)`,"A compact button that opens a menu to pick one value from a list.")
      ])
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const LanguageRow(),\n)`, "A box that can hold padding, color, and decoration."),
    T("sa-textsize-header","Text","The group label separates the text-size row from the language row.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('TEXT SIZE', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sa-textsize-group","Container","It wraps the text-size row in the same rounded section style.",[
      T("sa-textsize-row","Row","Icon, label column, and the current size share one row.",[
        T("sa-textsize-icon","Icon","The text icon marks this as the readability setting.",[],`const Icon(Icons.text_fields_outlined, color: Color(0xFF5B5BD6))`, "Draws a Material icon glyph."),
        T("sa-textsize-col","Column","It puts the label above the explanation.",[
          T("sa-textsize-label","Text","Names the text-size setting.",[],`const Text(\n  'Text size',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sa-textsize-sub","Text","Explains why a bigger size helps.",[],`const Text(\n  'Larger text is easier to read',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ]),
        T("sa-textsize-value","Text","Shows the current text size without opening the picker.",[],`const Text(\n  'Medium',\n  style: TextStyle(color: Colors.grey),\n)`, "Renders a styled string on screen.")
      ])
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const TextSizeRow(),\n)`, "A box that can hold padding, color, and decoration."),
    T("sa-preview-header","Text","The group label introduces the live preview of the chosen theme.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('PREVIEW', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sa-preview-card","Card","The preview sits on its own raised card so the user can see the theme choice applied to real text before leaving the screen.",[
      T("sa-preview-col","Column","Sample heading sits above sample body text.",[
        T("sa-preview-title","Text","A sample heading, styled exactly as headings appear in the app.",[],`const Text(\n  'Sample heading',\n  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),\n)`, "Renders a styled string on screen."),
        T("sa-preview-body","Text","Sample body text, so the user can judge readability with the current choices.",[],`const Text(\n  'This is how headings and body text look with your choices.',\n  style: TextStyle(fontSize: 13, color: Colors.grey),\n)`, "Renders a styled string on screen.")
      ])
    ]),
    T("sa-note","Text","A short reassurance under the preview: nothing needs saving.",[],`const Padding(\n  padding: EdgeInsets.only(top: 16),\n  child: Text(\n    'Theme and language apply immediately across the app.',\n    style: TextStyle(fontSize: 12, color: Colors.grey),\n  ),\n)`, "Renders a styled string on screen.")
  ])
],`Scaffold(\n  appBar: AppBar(title: const Text('Appearance')),\n  body: const AppearanceBody(),\n)`, "Gives the appearance page its frame: app bar on top, scrollable body below.");

TEARDOWNS["settings-notifications"].root = T("sn-scaffold","Scaffold","Scaffold is the frame of the page: it holds the Notifications app bar on top and the scrolling option groups in its body. Without it, the header and the groups would be separate widgets with nothing keeping them aligned.",[
  T("sn-appbar","AppBar","AppBar builds the top bar and pins it above the scrolling content, so the title and back action stay visible while the option groups scroll underneath. It tells the user where they are and offers one-tap exit back to the settings list.",[
    T("sn-back","IconButton","The back chevron pops this route off the navigation stack.",[],`IconButton(\n  icon: const Icon(Icons.arrow_back),\n  onPressed: () => Navigator.pop(context),\n)`, "A tappable icon that runs an action."),
    T("sn-title","Text","It labels the screen so the user knows these are the notification settings.",[],`const Text(\n  'Notifications',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen.")
  ],`AppBar(\n  leading: const BackButton(),\n  title: const Text('Notifications'),\n)`, "Builds the top bar with a title and a leading back action."),
  T("sn-body","ListView","ListView lays the master toggles, the notification categories, and the quiet-hours group out in one scrollable vertical list, so every notification choice is reachable on a small screen while the app bar stays put.",[
    T("sn-master-header","Text","The small-caps group label scans like a native settings section.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('NOTIFICATIONS', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sn-master-group","Container","It groups the four master toggles into one rounded section, so the on/off choices read as one question: which kinds of alerts may reach the user at all.",[
      T("sn-master-col","Column","The toggle rows and their dividers are stacked inside the group.",[
        T("sn-master","SwitchListTile","SwitchListTile is a ListTile with a Switch built in, so a whole settings row — title, subtitle, and toggle — is one widget instead of three wired together. The row's value is a single bool, so tapping anywhere on the row flips the setting and the Switch animates to match. Notification settings are rows of independent on/off choices, which is exactly the shape SwitchListTile is built for.",[
          T("sn-master-title","Text","Names the master notification switch.",[],`const Text(\n  'Allow notifications',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-master-sub","Text","Explains what turning it off does.",[],`const Text(\n  'Turn off to silence all alerts',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen."),
          T("sn-master-switch","Switch","Switch is taught in depth in Settings — App settings, where it flips preferences in place. Here the Switch is not a standalone widget — it is the toggle built into the Allow notifications SwitchListTile row, so the row and its toggle are one tappable unit.",[],`Switch(\n  value: true,\n  onChanged: (value) => setState(() => allowNotifications = value),\n)`,"A Material on/off toggle. Taught in depth in Settings — App settings; here it is the toggle inside a SwitchListTile row.")
        ],`SwitchListTile(\n  title: const Text('Allow notifications'),\n  subtitle: const Text('Turn off to silence all alerts'),\n  value: true,\n  onChanged: toggleNotifications,\n)`,"A full settings row with a Switch built in: title, subtitle, and toggle in one widget."),
        T("sn-div1","Divider","It separates the toggle rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 16)`,"A thin horizontal line."),
        T("sn-sounds","SwitchListTile","Sounds is its own SwitchListTile row because it is an independent choice: alerts can be silent but still shown, or loud but hidden — the row's single bool keeps that decision separate from the master switch.",[
          T("sn-sounds-title","Text","Names the sounds toggle.",[],`const Text(\n  'Sounds',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-sounds-sub","Text","Explains what the sounds toggle does.",[],`const Text(\n  'Play a tone for new alerts',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen."),
          T("sn-sounds-switch","Switch","Switch is taught in depth in Settings — App settings. Here it is the toggle built into the Sounds SwitchListTile row.",[],`Switch(\n  value: true,\n  onChanged: (value) => setState(() => sounds = value),\n)`,"A Material on/off toggle. Taught in depth in Settings — App settings; here it is the toggle inside a SwitchListTile row.")
        ],`SwitchListTile(\n  title: const Text('Sounds'),\n  subtitle: const Text('Play a tone for new alerts'),\n  value: true,\n  onChanged: toggleSounds,\n)`,"A full settings row with a Switch built in: title, subtitle, and toggle in one widget."),
        T("sn-div2","Divider","It separates the toggle rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 16)`,"A thin horizontal line."),
        T("sn-vibrate","SwitchListTile","Vibrate is its own SwitchListTile row because some users want a silent buzz instead of a tone — the row's bool is independent of the Sounds row, so tone and vibration can be mixed freely.",[
          T("sn-vibrate-title","Text","Names the vibration toggle.",[],`const Text(\n  'Vibrate',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-vibrate-sub","Text","Explains what the vibration toggle does.",[],`const Text(\n  'Vibrate for new alerts',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen."),
          T("sn-vibrate-switch","Switch","Switch is taught in depth in Settings — App settings. Here it is the toggle built into the Vibrate SwitchListTile row.",[],`Switch(\n  value: false,\n  onChanged: (value) => setState(() => vibrate = value),\n)`,"A Material on/off toggle. Taught in depth in Settings — App settings; here it is the toggle inside a SwitchListTile row.")
        ],`SwitchListTile(\n  title: const Text('Vibrate'),\n  subtitle: const Text('Vibrate for new alerts'),\n  value: false,\n  onChanged: toggleVibrate,\n)`,"A full settings row with a Switch built in: title, subtitle, and toggle in one widget."),
        T("sn-div3","Divider","It separates the toggle rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 16)`,"A thin horizontal line."),
        T("sn-badges","SwitchListTile","Badges is its own SwitchListTile row because the count dot on the app icon is a separate decision from sound and vibration — the user may want to see unread counts without hearing anything.",[
          T("sn-badges-title","Text","Names the app-icon badges toggle.",[],`const Text(\n  'App icon badges',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-badges-sub","Text","Explains what the badges toggle does.",[],`const Text(\n  'Show a count on the app icon',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen."),
          T("sn-badges-switch","Switch","Switch is taught in depth in Settings — App settings. Here it is the toggle built into the App icon badges SwitchListTile row.",[],`Switch(\n  value: true,\n  onChanged: (value) => setState(() => badges = value),\n)`,"A Material on/off toggle. Taught in depth in Settings — App settings; here it is the toggle inside a SwitchListTile row.")
        ],`SwitchListTile(\n  title: const Text('App icon badges'),\n  subtitle: const Text('Show a count on the app icon'),\n  value: true,\n  onChanged: toggleBadges,\n)`,"A full settings row with a Switch built in: title, subtitle, and toggle in one widget.")
      ])
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const Column(\n    children: [AllowNotificationsTile(), Divider(), SoundsTile(), Divider(), VibrateTile(), Divider(), BadgesTile()],\n  ),\n)`, "A box that can hold padding, color, and decoration."),
    T("sn-cat-header","Text","The group label separates the notification categories from the master toggles.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('CATEGORIES', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sn-cat-group","Container","It groups the four category rows into one rounded section, so the categories read as one question with four independent answers.",[
      T("sn-cat-col","Column","The category rows and their dividers are stacked inside the group.",[
        T("sn-cat-messages","CheckboxListTile","CheckboxListTile is a ListTile with a Checkbox built in: title, subtitle, and tick box in one widget. Each notification category is an independent yes/no — messages can be on while promotions are off — so a Checkbox, not a Radio, is the right control. Tapping anywhere on the row toggles the box, giving the whole row a generous tap target.",[
          T("sn-cat-messages-check","Checkbox","Checkbox is taught in depth in Tasks — Task list, where it marks a task complete. Here it is the tick box built into the Messages CheckboxListTile row, so this one category of notifications can be switched on or off independently of the others.",[],`Checkbox(\n  value: true,\n  onChanged: (value) => setState(() => messages = value!),\n)`,"A square tick box. Taught in depth in Tasks — Task list; here it is the tick box inside a CheckboxListTile row."),
          T("sn-cat-messages-title","Text","Names the messages category.",[],`const Text(\n  'Messages',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-cat-messages-sub","Text","Explains what the messages category covers.",[],`const Text(\n  'Chats and mentions',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ],`CheckboxListTile(\n  title: const Text('Messages'),\n  subtitle: const Text('Chats and mentions'),\n  value: true,\n  onChanged: toggleMessages,\n)`,"A full settings row with a Checkbox built in: title, subtitle, and tick box in one widget."),
        T("sn-div4","Divider","It separates the category rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 56)`,"A thin horizontal line."),
        T("sn-cat-updates","CheckboxListTile","Updates is its own CheckboxListTile row because release news is a separate category from messages: the user may want chat alerts but not product announcements, and each row's Checkbox decides alone.",[
          T("sn-cat-updates-check","Checkbox","Checkbox is taught in depth in Tasks — Task list. Here it is the tick box built into the Updates CheckboxListTile row.",[],`Checkbox(\n  value: true,\n  onChanged: (value) => setState(() => updates = value!),\n)`,"A square tick box. Taught in depth in Tasks — Task list; here it is the tick box inside a CheckboxListTile row."),
          T("sn-cat-updates-title","Text","Names the updates category.",[],`const Text(\n  'Updates',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-cat-updates-sub","Text","Explains what the updates category covers.",[],`const Text(\n  'New features and releases',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ],`CheckboxListTile(\n  title: const Text('Updates'),\n  subtitle: const Text('New features and releases'),\n  value: true,\n  onChanged: toggleUpdates,\n)`,"A full settings row with a Checkbox built in: title, subtitle, and tick box in one widget."),
        T("sn-div5","Divider","It separates the category rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 56)`,"A thin horizontal line."),
        T("sn-cat-promos","CheckboxListTile","Offers is its own CheckboxListTile row because marketing alerts are the category users most often silence: its Checkbox is off by default, while Messages and Updates stay on.",[
          T("sn-cat-promos-check","Checkbox","Checkbox is taught in depth in Tasks — Task list. Here it is the tick box built into the Offers & promotions CheckboxListTile row.",[],`Checkbox(\n  value: false,\n  onChanged: (value) => setState(() => promos = value!),\n)`,"A square tick box. Taught in depth in Tasks — Task list; here it is the tick box inside a CheckboxListTile row."),
          T("sn-cat-promos-title","Text","Names the offers category.",[],`const Text(\n  'Offers & promotions',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-cat-promos-sub","Text","Explains what the offers category covers.",[],`const Text(\n  'Deals and discounts',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ],`CheckboxListTile(\n  title: const Text('Offers & promotions'),\n  subtitle: const Text('Deals and discounts'),\n  value: false,\n  onChanged: togglePromos,\n)`,"A full settings row with a Checkbox built in: title, subtitle, and tick box in one widget."),
        T("sn-div6","Divider","It separates the category rows inside the group so each option reads on its own.",[],`const Divider(height: 1, indent: 56)`,"A thin horizontal line."),
        T("sn-cat-reminders","CheckboxListTile","Reminders is its own CheckboxListTile row because task and event alerts are time-sensitive: the user may want them even while promotions are off, and the row's Checkbox keeps that choice independent.",[
          T("sn-cat-reminders-check","Checkbox","Checkbox is taught in depth in Tasks — Task list. Here it is the tick box built into the Reminders CheckboxListTile row.",[],`Checkbox(\n  value: true,\n  onChanged: (value) => setState(() => reminders = value!),\n)`,"A square tick box. Taught in depth in Tasks — Task list; here it is the tick box inside a CheckboxListTile row."),
          T("sn-cat-reminders-title","Text","Names the reminders category.",[],`const Text(\n  'Reminders',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
          T("sn-cat-reminders-sub","Text","Explains what the reminders category covers.",[],`const Text(\n  'Tasks and events',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen.")
        ],`CheckboxListTile(\n  title: const Text('Reminders'),\n  subtitle: const Text('Tasks and events'),\n  value: true,\n  onChanged: toggleReminders,\n)`,"A full settings row with a Checkbox built in: title, subtitle, and tick box in one widget.")
      ])
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const Column(\n    children: [MessagesTile(), Divider(), UpdatesTile(), Divider(), PromosTile(), Divider(), RemindersTile()],\n  ),\n)`, "A box that can hold padding, color, and decoration."),
    T("sn-quiet-header","Text","The group label separates the quiet-hours row from the categories.",[],`const Padding(\n  padding: EdgeInsets.only(top: 20, bottom: 8),\n  child: Text('DO NOT DISTURB', style: TextStyle(fontSize: 12, color: Colors.grey)),\n)`, "Renders a styled string on screen."),
    T("sn-quiet-group","Container","It wraps the single quiet-hours row in the same rounded section style.",[
      T("sn-quiet-tile","SwitchListTile","Quiet hours is a SwitchListTile row because it is one more independent on/off choice: when it is on, every category above is silenced between 10 PM and 7 AM, and the subtitle shows the schedule at a glance.",[
        T("sn-quiet-tile-title","Text","Names the scheduled quiet-hours setting.",[],`const Text(\n  'Scheduled quiet hours',\n  style: TextStyle(fontWeight: FontWeight.w600),\n)`, "Renders a styled string on screen."),
        T("sn-quiet-tile-sub","Text","Shows the hours when alerts are silenced.",[],`const Text(\n  '10:00 PM – 7:00 AM',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`, "Renders a styled string on screen."),
        T("sn-quiet-tile-switch","Switch","Switch is taught in depth in Settings — App settings. Here it is the toggle built into the Scheduled quiet hours SwitchListTile row.",[],`Switch(\n  value: false,\n  onChanged: (value) => setState(() => quietHours = value),\n)`,"A Material on/off toggle. Taught in depth in Settings — App settings; here it is the toggle inside a SwitchListTile row.")
      ],`SwitchListTile(\n  title: const Text('Scheduled quiet hours'),\n  subtitle: const Text('10:00 PM – 7:00 AM'),\n  value: false,\n  onChanged: toggleQuietHours,\n)`,"A full settings row with a Switch built in: title, subtitle, and toggle in one widget.")
    ],`Container(\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(16),\n  ),\n  child: const QuietHoursTile(),\n)`, "A box that can hold padding, color, and decoration."),
    T("sn-note","Text","A short explainer under the groups: categories decide which alerts exist at all.",[],`const Padding(\n  padding: EdgeInsets.only(top: 16),\n  child: Text(\n    'Categories control which kinds of alerts can reach you.',\n    style: TextStyle(fontSize: 12, color: Colors.grey),\n  ),\n)`, "Renders a styled string on screen.")
  ])
],`Scaffold(\n  appBar: AppBar(title: const Text('Notifications')),\n  body: const NotificationsBody(),\n)`, "Gives the notifications page its frame: app bar on top, scrollable body below.");

TEARDOWNS["swiggy-menu"].root = T("sm-material","MaterialApp","MaterialApp sits at the root and hands the menu screen one theme, one set of Material defaults, and one Navigator. That is why the Swiggy orange, the text styles, and the move back to the home screen all behave exactly as they do on the Swiggy home screen.",[
  T("sm-scaffold","Scaffold","Scaffold is the frame of the page: it holds the scrolling menu in its body and pins the View Cart bar to the bottom edge. Without it the menu list and the cart bar would be separate widgets with nothing keeping them aligned.",[
    T("sm-scroll","CustomScrollView","CustomScrollView coordinates the collapsing restaurant header, the offer banner, the sticky section tabs, and the three dish lists under one scroll position. The whole menu scrolls as a single page instead of nested scrollers fighting each other.",[
      T("sm-appbar","SliverAppBar","SliverAppBar is an app bar that lives inside the scroll view, so the restaurant header scrolls with the menu instead of floating above it. It stays pinned here so the restaurant name, rating, and favourite action remain reachable while the dishes scroll underneath.",[
        T("sm-head-padding","Padding","The header row receives a consistent inset from the screen edges.",[
          T("sm-head-row","Row","Back, restaurant identity, and favourite share one header line.",[
            T("sm-back","IconButton","The back chevron returns to the restaurant list. It pops this route off the navigation stack.",[],`IconButton(\n  icon: const Icon(Icons.arrow_back),\n  onPressed: () => Navigator.pop(context),\n)`),
            T("sm-head-col","Column","The restaurant name sits above its rating and delivery line.",[
              T("sm-rest-name","Text","Shows the restaurant name at the top of the menu. It is the first thing the user reads on this screen.",[],`const Text(\n  'Spice Kitchen',\n  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),\n)`),
              T("sm-rest-meta","Text","Shows the rating, delivery time, and price for two in one quiet line. It sets expectations before the user reads any dish.",[],`const Text(\n  '4.5 ★ · 25–30 min · ₹350 for two',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n)`)
            ]),
            T("sm-fav","IconButton","The heart saves this restaurant to favourites. It is an icon button because the action needs no label.",[],`IconButton(\n  icon: const Icon(Icons.favorite_border),\n  onPressed: toggleFavourite,\n)`)
          ])
        ])
      ],`SliverAppBar(\n  pinned: true,\n  title: const RestaurantHeader(),\n  actions: [\n    IconButton(icon: const Icon(Icons.favorite_border), onPressed: toggleFavourite),\n  ],\n)`,"Taught in depth in Instagram — Profile; here it is the restaurant header that collapses as the menu scrolls."),
      T("sm-offer-adapter","SliverToBoxAdapter","The offer banner is an ordinary box widget, so it needs an adapter to sit inside the sliver list. It places the promotion between the header and the section tabs.",[
        T("sm-offer","Card","Card lifts the promotion onto its own Material surface with rounded corners and a solid brand colour. The discount reads as one distinct offer instead of plain text on the page.",[
          T("sm-offer-padding","Padding","Offer text stays clear of the card edge.",[
            T("sm-offer-col","Column","Discount and qualification details are stacked.",[
              T("sm-offer-title","Text","Shows the promotion's strongest value in bold. It is what the eye lands on first.",[],`const Text(\n  '40% OFF up to ₹120',\n  style: TextStyle(fontWeight: FontWeight.w800),\n)`),
              T("sm-offer-sub","Text","Explains when the discount applies. It keeps the headline honest by stating the condition.",[],`const Text(\n  'Use code WELCOME on orders above ₹199',\n  style: TextStyle(fontSize: 12),\n)`)
            ])
          ])
        ],`Card(\n  color: const Color(0xFFFC8019),\n  child: const Padding(\n    padding: EdgeInsets.all(16),\n    child: OfferCopy(),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it carries the restaurant's own promotion instead of a home-screen offer.")
      ],undefined,"Taught in depth in Instagram — Profile; here it adapts the offer banner into the sliver sequence."),
      T("sm-tabs-header","SliverPersistentHeader","SliverPersistentHeader keeps the section tabs pinned at the top once they scroll into view. The user can jump between Recommended, Bestsellers, and Combos without scrolling back to the top.",[
        T("sm-tabs-row","Row","The three section tabs sit on one horizontal line. Tapping one scrolls the menu to that section.",[
          T("sm-tab-rec","Chip","The selected 'Recommended' tab shows the recommended dishes, and its filled style marks it as the active section.",[],`const Chip(label: Text('Recommended'))`,"Taught in depth in YouTube — Home feed; here it jumps to the Recommended section of the menu."),
          T("sm-tab-best","Chip","Tapping 'Bestsellers' jumps to the dishes other customers order most, so the user reaches proven dishes without scrolling.",[],`const Chip(label: Text('Bestsellers'))`,"Taught in depth in YouTube — Home feed; here it jumps to the Bestsellers section of the menu."),
          T("sm-tab-combo","Chip","Tapping 'Combos' jumps to the value meals, which is how the menu groups multi-dish deals in one place.",[],`const Chip(label: Text('Combos'))`,"Taught in depth in YouTube — Home feed; here it jumps to the Combos section of the menu.")
        ])
      ],`SliverPersistentHeader(\n  pinned: true,\n  delegate: MenuTabsHeader(\n    child: const MenuTabsRow(),\n  ),\n)`,"Taught in depth in Instagram — Profile; here it pins the menu section tabs while the dishes scroll underneath."),
      T("sm-sec1-adapter","SliverToBoxAdapter","The section title is an ordinary Text widget, so it needs an adapter to sit between the two sliver lists. It marks where the Recommended dishes begin.",[
        T("sm-sec1-title","Text","Heads the Recommended section so the menu reads as clear groups. It tells the user these dishes are the restaurant's picks.",[],`const Text(\n  'Recommended',\n  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),\n)`)
      ],undefined,"Taught in depth in Instagram — Profile; here it adapts the Recommended section title into the sliver sequence."),
      T("sm-list1","SliverList","SliverList is the lazily built list inside a CustomScrollView: each dish row is built only when it scrolls into view, so a menu with a hundred dishes costs no more than the few on screen. It belongs here — not a ListView — because the dishes must share one scroll position with the collapsing header and the sticky tabs above them; a ListView inside would create a second, nested scroller. Each menu section gets its own SliverList, so a section title can sit between them.",[
        T("sm-d1-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d1-veg","Container","A small bordered square marks the dish as vegetarian. The border and dot together are Swiggy's veg badge.",[
            T("sm-d1-veg-icon","Icon","A small filled dot inside the square completes the veg mark. Green means vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.green)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.green, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.green),\n)`),
          T("sm-d1-flex","Flexible","Flexible is like Expanded, but with a loose fit: the dish text takes only the space it needs, up to what is available, instead of being forced to fill every remaining pixel. That matters in this row because the ADD button must keep its own natural width — with Expanded the text column would claim all the space and the button would still sit at the edge, but Flexible states the real intent: the text sizes to its content and the button is never squeezed. It also lets long dish names wrap inside the space that is left, instead of overflowing the row.",[
            T("sm-d1-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d1-name","Text","Shows the dish name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Paneer Butter Masala',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d1-desc","Text","Describes the dish in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  'Creamy tomato gravy with soft paneer cubes, served with butter.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d1-price","Text","Shows the price of one portion. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹249',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"A flexible box that takes only the space its child needs, up to the space available — unlike Expanded, which forces its child to fill all remaining space."),
          T("sm-d1-add","OutlinedButton","The outlined ADD button adds one portion to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d1-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one portion of the dish in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.veg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`),
        T("sm-d2-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d2-veg","Container","A small bordered square marks the dish as non-vegetarian. The brown border and dot are Swiggy's non-veg badge.",[
            T("sm-d2-veg-icon","Icon","A small filled dot inside the square completes the non-veg mark. Brown means non-vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.brown)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.brown, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.brown),\n)`),
          T("sm-d2-flex","Flexible","Same Flexible as the first dish row: the text takes only the space it needs, so the ADD button keeps its natural width and long dish names wrap instead of overflowing.",[
            T("sm-d2-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d2-name","Text","Shows the dish name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Chicken Biryani',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d2-desc","Text","Describes the dish in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  'Fragrant basmati rice layered with spiced chicken, served with raita.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d2-price","Text","Shows the price of one portion. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹299',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"Same Flexible as the first dish row; here it sizes the biryani text to its content while the ADD button keeps its own width."),
          T("sm-d2-add","OutlinedButton","The outlined ADD button adds one portion to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d2-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one portion of the dish in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.nonVeg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`)
      ],`SliverList(\n  delegate: SliverChildBuilderDelegate(\n    (context, index) => DishRow(menu.recommended[index]),\n    childCount: 2,\n  ),\n)`,"A lazily built list of dish rows inside the CustomScrollView — each row is built only when it scrolls into view, and all sections share one scroll position."),
      T("sm-sec2-adapter","SliverToBoxAdapter","The section title is an ordinary Text widget, so it needs an adapter to sit between the two sliver lists. It marks where the Bestsellers begin.",[
        T("sm-sec2-title","Text","Heads the Bestsellers section so the menu reads as clear groups. It tells the user these dishes are ordered most often.",[],`const Text(\n  'Bestsellers',\n  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),\n)`)
      ],undefined,"Taught in depth in Instagram — Profile; here it adapts the Bestsellers section title into the sliver sequence."),
      T("sm-list2","SliverList","A second SliverList builds the Bestsellers section lazily, under the same scroll position as the Recommended list above it. Splitting the menu into one SliverList per section is what lets a plain section title sit between the two lists.",[
        T("sm-d3-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d3-veg","Container","A small bordered square marks the dish as vegetarian. The border and dot together are Swiggy's veg badge.",[
            T("sm-d3-veg-icon","Icon","A small filled dot inside the square completes the veg mark. Green means vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.green)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.green, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.green),\n)`),
          T("sm-d3-flex","Flexible","Same Flexible as the first dish row: the text takes only the space it needs, so the ADD button keeps its natural width and long dish names wrap instead of overflowing.",[
            T("sm-d3-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d3-name","Text","Shows the dish name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Masala Dosa',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d3-desc","Text","Describes the dish in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  'Crisp dosa with spiced potato filling, coconut chutney and sambar.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d3-price","Text","Shows the price of one portion. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹149',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"Same Flexible as the first dish row; here it sizes the dosa text to its content while the ADD button keeps its own width."),
          T("sm-d3-add","OutlinedButton","The outlined ADD button adds one portion to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d3-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one portion of the dish in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.veg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`),
        T("sm-d4-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d4-veg","Container","A small bordered square marks the dish as non-vegetarian. The brown border and dot are Swiggy's non-veg badge.",[
            T("sm-d4-veg-icon","Icon","A small filled dot inside the square completes the non-veg mark. Brown means non-vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.brown)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.brown, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.brown),\n)`),
          T("sm-d4-flex","Flexible","Same Flexible as the first dish row: the text takes only the space it needs, so the ADD button keeps its natural width and long dish names wrap instead of overflowing.",[
            T("sm-d4-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d4-name","Text","Shows the dish name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Butter Chicken',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d4-desc","Text","Describes the dish in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  'Tandoori chicken folded into a rich tomato-butter gravy.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d4-price","Text","Shows the price of one portion. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹329',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"Same Flexible as the first dish row; here it sizes the butter chicken text to its content while the ADD button keeps its own width."),
          T("sm-d4-add","OutlinedButton","The outlined ADD button adds one portion to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d4-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one portion of the dish in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.nonVeg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`)
      ],`SliverList(\n  delegate: SliverChildBuilderDelegate(\n    (context, index) => DishRow(menu.bestsellers[index]),\n    childCount: 2,\n  ),\n)`,"Same SliverList as the Recommended section; here it lazily builds the Bestsellers dishes under the same scroll position."),
      T("sm-sec3-adapter","SliverToBoxAdapter","The section title is an ordinary Text widget, so it needs an adapter to sit between the two sliver lists. It marks where the Combos begin.",[
        T("sm-sec3-title","Text","Heads the Combos section so the menu reads as clear groups. It tells the user these are multi-dish value meals.",[],`const Text(\n  'Combos',\n  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),\n)`)
      ],undefined,"Taught in depth in Instagram — Profile; here it adapts the Combos section title into the sliver sequence."),
      T("sm-list3","SliverList","A third SliverList builds the Combos section lazily, under the same scroll position as the two lists above it. Splitting the menu into one SliverList per section is what lets a plain section title sit between the lists.",[
        T("sm-d5-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d5-veg","Container","A small bordered square marks the combo as vegetarian. The border and dot together are Swiggy's veg badge.",[
            T("sm-d5-veg-icon","Icon","A small filled dot inside the square completes the veg mark. Green means vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.green)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.green, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.green),\n)`),
          T("sm-d5-flex","Flexible","Same Flexible as the first dish row: the text takes only the space it needs, so the ADD button keeps its natural width and long combo names wrap instead of overflowing.",[
            T("sm-d5-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d5-name","Text","Shows the combo name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Veg Family Combo',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d5-desc","Text","Describes the combo in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  '2 paneer curries, 4 butter naans, jeera rice and 2 desserts.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d5-price","Text","Shows the price of the whole combo. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹599',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"Same Flexible as the first dish row; here it sizes the combo text to its content while the ADD button keeps its own width."),
          T("sm-d5-add","OutlinedButton","The outlined ADD button adds one combo to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d5-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one combo in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.veg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`),
        T("sm-d6-row","Row","The veg badge, the dish text, and the ADD button share one horizontal line, with the text taking only the space it needs and the button pinned to the right edge.",[
          T("sm-d6-veg","Container","A small bordered square marks the combo as non-vegetarian. The brown border and dot are Swiggy's non-veg badge.",[
            T("sm-d6-veg-icon","Icon","A small filled dot inside the square completes the non-veg mark. Brown means non-vegetarian.",[],`const Icon(Icons.circle, size: 8, color: Colors.brown)`)
          ],`Container(\n  width: 16,\n  height: 16,\n  decoration: BoxDecoration(\n    border: Border.all(color: Colors.brown, width: 1.5),\n    borderRadius: BorderRadius.circular(3),\n  ),\n  child: const Icon(Icons.circle, size: 8, color: Colors.brown),\n)`),
          T("sm-d6-flex","Flexible","Same Flexible as the first dish row: the text takes only the space it needs, so the ADD button keeps its natural width and long combo names wrap instead of overflowing.",[
            T("sm-d6-col","Column","Name, description, and price stack inside the flexible text area.",[
              T("sm-d6-name","Text","Shows the combo name in bold. It is the first thing the eye reads in the row.",[],`const Text(\n  'Non-Veg Feast Combo',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
              T("sm-d6-desc","Text","Describes the combo in one short line so the user can decide without opening it. It wraps to two lines at most.",[],`const Text(\n  'Chicken biryani, butter chicken, 2 naans and gulab jamun.',\n  style: TextStyle(fontSize: 12, color: Colors.grey),\n  maxLines: 2,\n)`),
              T("sm-d6-price","Text","Shows the price of the whole combo. It sits under the description so name, detail, and price read top to bottom.",[],`const Text(\n  '₹649',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`)
            ])
          ],undefined,"Same Flexible as the first dish row; here it sizes the combo text to its content while the ADD button keeps its own width."),
          T("sm-d6-add","OutlinedButton","The outlined ADD button adds one combo to the cart. Its outline style marks it as a secondary action that can be tapped repeatedly.",[
            T("sm-d6-add-label","Text","Labels the add action. 'ADD' is short enough to fit the small button.",[],`const Text('ADD')`)
          ],`OutlinedButton(\n  onPressed: () => addToCart(dish),\n  child: const Text('ADD'),\n)`,"Taught in depth in Instagram — Profile; here it is the ADD button that puts one combo in the cart.")
        ],`Row(\n  mainAxisAlignment: MainAxisAlignment.spaceBetween,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [\n    const VegBadge.nonVeg(),\n    Flexible(child: DishText()),\n    OutlinedButton(onPressed: addDish, child: const Text('ADD')),\n  ],\n)`)
      ],`SliverList(\n  delegate: SliverChildBuilderDelegate(\n    (context, index) => DishRow(menu.combos[index]),\n    childCount: 2,\n  ),\n)`,"Same SliverList as the Recommended section; here it lazily builds the Combos dishes under the same scroll position.")
    ],`CustomScrollView(\n  slivers: [\n    SliverAppBar(pinned: true, title: RestaurantHeader()),\n    OfferBanner(),\n    MenuTabsHeader(),\n    SectionTitle('Recommended'),\n    DishList(menu.recommended),\n    SectionTitle('Bestsellers'),\n    DishList(menu.bestsellers),\n    SectionTitle('Combos'),\n    DishList(menu.combos),\n  ],\n)`,"Taught in depth in Instagram — Profile; here it coordinates the menu's slivers under one scroll position."),
    T("sm-cartbar","Container","A solid orange bar pins the cart summary above the bottom edge, so the user always sees what is in the cart while browsing the menu. It is a Container because it needs a brand background colour and padding in one box.",[
      T("sm-cart-row","Row","Item count, total, and the View Cart action share one line inside the cart bar.",[
        T("sm-cart-count","Text","Shows how many items are in the cart. It updates every time an ADD button is tapped.",[],`const Text(\n  '2 items',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
        T("sm-cart-total","Text","Shows the cart total next to the item count. It is the number the user checks before opening the cart.",[],`const Text(\n  '₹498',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
        T("sm-cart-view","TextButton","Opens the cart screen to review and place the order. It is a text button because it sits on the coloured bar.",[
          T("sm-cart-view-label","Text","Labels the cart action. 'View Cart' with an arrow promises the checkout flow.",[],`const Text(\n  'View Cart →',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`)
        ],`TextButton(\n  onPressed: openCart,\n  child: const Text('View Cart →'),\n)`,"Taught in depth in Login — Sign in; here it opens the cart from the orange cart bar.")
      ])
    ],`Container(\n  color: const Color(0xFFFC8019),\n  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),\n  child: const CartSummaryRow(),\n)`)
  ],`Scaffold(\n  body: const RestaurantMenuBody(),\n  bottomNavigationBar: const CartBar(),\n)`)
],`MaterialApp(\n  home: const RestaurantMenuScreen(),\n)`);

TEARDOWNS["youtube-search"].root = T("ys-material","MaterialApp","MaterialApp sits at the top of the app and gives every screen one theme, one navigation stack, and one Material look. The search screen inherits the same red accent and text styles as the home feed.",[
  T("ys-scaffold","Scaffold","Scaffold frames a single screen, so the search bar, the suggestion list, and the bottom navigation stay in one stable layout. The search field stays on top while the suggestions scroll underneath.",[
    T("ys-body","Column","The search row sits above the suggestion list, which takes the rest of the screen. The column keeps the field fixed while the list scrolls.",[
      T("ys-search-row","Row","Back, the search field, and voice search share one horizontal line at the top of the screen, exactly as the real YouTube search bar is laid out.",[
        T("ys-back","IconButton","The back arrow returns to the home feed. It pops this route off the navigation stack.",[],`IconButton(\n  icon: const Icon(Icons.arrow_back),\n  onPressed: () => Navigator.pop(context),\n)`),
        T("ys-searchbar-expanded","Expanded","The search field takes all the width left between the back arrow and the microphone. Without it the field would size to its hint text and leave a gap.",[
          T("ys-searchbar","SearchBar","SearchBar is the Material 3 search field: one widget that owns the search input, its leading search icon, its hint text, and the callbacks that drive suggestions. That is the difference from the plain TextField search boxes already covered in Amazon, Gmail, and Swiggy — a TextField is only an input with a decoration, so those screens hand-build everything around it, while SearchBar is built for search: typing in it fires onChanged, and the app rebuilds the suggestion list below from that query. The suggestion rows themselves are a separate ListView, not part of SearchBar — SearchBar supplies the query, the list shows the matches.",[],`SearchBar(\n  controller: _searchController,\n  hintText: 'Search YouTube',\n  leading: const Icon(Icons.search),\n  onChanged: showSuggestions,\n  onSubmitted: runSearch,\n)`,"A Material 3 search field with a leading icon, hint text, and callbacks that drive a suggestions list — distinct from a plain TextField search box.")
        ]),
        T("ys-mic","IconButton","The microphone starts voice search without typing. It sits beside the field so it is reachable on every search.",[],`IconButton(\n  icon: const Icon(Icons.mic),\n  onPressed: startVoiceSearch,\n)`)
      ]),
      T("ys-suggest-list","ListView","ListView builds the suggestion and recent rows lazily and scrolls them as one column, so only the rows on screen are built at any moment. The list rebuilds from the SearchBar query as the user types.",[
        T("ys-sug1-row","Row","One suggestion reads as a single tappable row: the search icon, the query text, and the fill arrow share one line.",[
          T("ys-sug1-icon","Icon","A small magnifier marks the row as a search suggestion rather than a history entry.",[],`const Icon(Icons.search, size: 18)`),
          T("ys-sug1-expanded","Expanded","The query text takes all the width left between the icon and the fill arrow.",[
            T("ys-sug1-text","Text","Shows the suggested query. Tapping it runs that search immediately.",[],`const Text('flutter tutorial for beginners')`)
          ]),
          T("ys-sug1-fill","IconButton","The arrow fills the search field with this suggestion so the user can edit it before searching.",[],`IconButton(\n  icon: const Icon(Icons.north_west),\n  onPressed: () => fillQuery('flutter tutorial for beginners'),\n)`)
        ]),
        T("ys-sug2-row","Row","One suggestion reads as a single tappable row: the search icon, the query text, and the fill arrow share one line.",[
          T("ys-sug2-icon","Icon","A small magnifier marks the row as a search suggestion rather than a history entry.",[],`const Icon(Icons.search, size: 18)`),
          T("ys-sug2-expanded","Expanded","The query text takes all the width left between the icon and the fill arrow.",[
            T("ys-sug2-text","Text","Shows the suggested query. Tapping it runs that search immediately.",[],`const Text('flutter state management')`)
          ]),
          T("ys-sug2-fill","IconButton","The arrow fills the search field with this suggestion so the user can edit it before searching.",[],`IconButton(\n  icon: const Icon(Icons.north_west),\n  onPressed: () => fillQuery('flutter state management'),\n)`)
        ]),
        T("ys-sug3-row","Row","One suggestion reads as a single tappable row: the search icon, the query text, and the fill arrow share one line.",[
          T("ys-sug3-icon","Icon","A small magnifier marks the row as a search suggestion rather than a history entry.",[],`const Icon(Icons.search, size: 18)`),
          T("ys-sug3-expanded","Expanded","The query text takes all the width left between the icon and the fill arrow.",[
            T("ys-sug3-text","Text","Shows the suggested query. Tapping it runs that search immediately.",[],`const Text('dart null safety')`)
          ]),
          T("ys-sug3-fill","IconButton","The arrow fills the search field with this suggestion so the user can edit it before searching.",[],`IconButton(\n  icon: const Icon(Icons.north_west),\n  onPressed: () => fillQuery('dart null safety'),\n)`)
        ]),
        T("ys-sug4-row","Row","One suggestion reads as a single tappable row: the search icon, the query text, and the fill arrow share one line.",[
          T("ys-sug4-icon","Icon","A small magnifier marks the row as a search suggestion rather than a history entry.",[],`const Icon(Icons.search, size: 18)`),
          T("ys-sug4-expanded","Expanded","The query text takes all the width left between the icon and the fill arrow.",[
            T("ys-sug4-text","Text","Shows the suggested query. Tapping it runs that search immediately.",[],`const Text('build a flutter app')`)
          ]),
          T("ys-sug4-fill","IconButton","The arrow fills the search field with this suggestion so the user can edit it before searching.",[],`IconButton(\n  icon: const Icon(Icons.north_west),\n  onPressed: () => fillQuery('build a flutter app'),\n)`)
        ]),
        T("ys-recent-header","Text","Heads the recent searches so suggestions and history read as two groups. It appears once the suggestion list ends.",[],`const Text(\n  'Recent searches',\n  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),\n)`),
        T("ys-rec1-row","Row","One recent search reads as a single tappable row: the history icon, the past query, and a clear button share one line.",[
          T("ys-rec1-icon","Icon","A clock-rotate icon marks the row as a past search rather than a fresh suggestion.",[],`const Icon(Icons.history, size: 18)`),
          T("ys-rec1-expanded","Expanded","The past query takes all the width left between the icon and the clear button.",[
            T("ys-rec1-text","Text","Shows the past query. Tapping it runs that search again.",[],`const Text('flutter animations')`)
          ]),
          T("ys-rec1-clear","IconButton","The close button removes this query from recent searches without running it.",[],`IconButton(\n  icon: const Icon(Icons.close),\n  onPressed: () => removeRecent('flutter animations'),\n)`)
        ]),
        T("ys-rec2-row","Row","One recent search reads as a single tappable row: the history icon, the past query, and a clear button share one line.",[
          T("ys-rec2-icon","Icon","A clock-rotate icon marks the row as a past search rather than a fresh suggestion.",[],`const Icon(Icons.history, size: 18)`),
          T("ys-rec2-expanded","Expanded","The past query takes all the width left between the icon and the clear button.",[
            T("ys-rec2-text","Text","Shows the past query. Tapping it runs that search again.",[],`const Text('riverpod vs bloc')`)
          ]),
          T("ys-rec2-clear","IconButton","The close button removes this query from recent searches without running it.",[],`IconButton(\n  icon: const Icon(Icons.close),\n  onPressed: () => removeRecent('riverpod vs bloc'),\n)`)
        ]),
        T("ys-rec3-row","Row","One recent search reads as a single tappable row: the history icon, the past query, and a clear button share one line.",[
          T("ys-rec3-icon","Icon","A clock-rotate icon marks the row as a past search rather than a fresh suggestion.",[],`const Icon(Icons.history, size: 18)`),
          T("ys-rec3-expanded","Expanded","The past query takes all the width left between the icon and the clear button.",[
            T("ys-rec3-text","Text","Shows the past query. Tapping it runs that search again.",[],`const Text('youtube clone flutter')`)
          ]),
          T("ys-rec3-clear","IconButton","The close button removes this query from recent searches without running it.",[],`IconButton(\n  icon: const Icon(Icons.close),\n  onPressed: () => removeRecent('youtube clone flutter'),\n)`)
        ])
      ])
    ]),
    T("ys-bottom","BottomNavigationBar","The bottom bar keeps the app's five main destinations one thumb-tap away, which is why it never scrolls away with the suggestions.",[
      T("ys-nav-home","BottomNavigationBarItem","Home is the first destination, so its icon and label take the user back to the feed.",[],`const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home')`,"Taught in depth in YouTube — Home feed; here it is the Home destination of the search screen's bottom bar."),
      T("ys-nav-shorts","BottomNavigationBarItem","Shorts opens vertical short-form video, a separate feed from the home list, so it gets its own destination.",[],`const BottomNavigationBarItem(icon: Icon(Icons.play_arrow), label: 'Shorts')`,"Taught in depth in YouTube — Home feed; here it is the Shorts destination of the search screen's bottom bar."),
      T("ys-nav-create","BottomNavigationBarItem","The plus in the middle is the create action, placed centrally because uploading is a primary action, not a hidden one.",[],`const BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: '')`,"Taught in depth in YouTube — Home feed; here it is the Create destination of the search screen's bottom bar."),
      T("ys-nav-subs","BottomNavigationBarItem","Subscriptions shows only channels the user follows, so it is a personal feed rather than the algorithmic home feed.",[],`const BottomNavigationBarItem(icon: Icon(Icons.subscriptions_outlined), label: 'Subscriptions')`,"Taught in depth in YouTube — Home feed; here it is the Subscriptions destination of the search screen's bottom bar."),
      T("ys-nav-you","BottomNavigationBarItem","You opens the user's own library, history, and profile, grouping everything personal under one destination.",[],`const BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'You')`,"Taught in depth in YouTube — Home feed; here it is the You destination of the search screen's bottom bar.")
    ],`BottomNavigationBar(\n  currentIndex: 0,\n  selectedItemColor: const Color(0xFFFF0000),\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.play_arrow), label: 'Shorts'),\n    BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: ''),\n    BottomNavigationBarItem(icon: Icon(Icons.subscriptions_outlined), label: 'Subscriptions'),\n    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'You'),\n  ],\n)`)
  ],`Scaffold(\n  body: const SearchBody(),\n  bottomNavigationBar: const YouTubeBottomNav(),\n)`)
],`MaterialApp(\n  theme: ThemeData(colorSchemeSeed: const Color(0xFFFF0000)),\n  home: const YouTubeSearch(),\n)`);

TEARDOWNS["spotify-search"].root = T("ss-material","MaterialApp","One Material theme and navigation context covers the whole Spotify search screen. The search screen inherits the same green accent and text styles as the home screen.",[
  T("ss-scaffold","Scaffold","The search bar, the Music/Podcasts switch, the browse grid, and the bottom navigation share one stable screen frame. The field and the switch stay fixed while the category grid scrolls.",[
    T("ss-appbar","AppBar","The title and the profile avatar stay visible at the top while the browse grid scrolls below.",[
      T("ss-appbar-title","Text","Labels the screen so the user knows this is search, not the home feed.",[],`const Text(\n  'Search',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),\n)`),
      T("ss-avatar","CircleAvatar","The signed-in user's photo is clipped into a small circle, which is the compact identity pattern used across the app.",[],`const CircleAvatar(radius: 14, child: Text('DK'))`)
    ],`AppBar(\n  title: const Text('Search'),\n  actions: const [CircleAvatar(radius: 14, child: Text('DK'))],\n)`),
    T("ss-body","Column","The search field, the segmented switch, and the browse grid follow from top to bottom, with the grid taking the rest of the screen.",[
      T("ss-search-field","TextField","The search field is a plain TextField here, not a SearchBar: Spotify's search box is a simple filled input with a hint and a search icon, and the browse grid below does the suggesting. It collects the query and filters the browse categories as the user types.",[],`TextField(\n  onChanged: filterBrowse,\n  decoration: const InputDecoration(\n    hintText: 'What do you want to listen to?',\n    prefixIcon: Icon(Icons.search),\n    filled: true,\n    border: OutlineInputBorder(\n      borderRadius: BorderRadius.circular(8),\n      borderSide: BorderSide.none,\n    ),\n  ),\n)`),
      T("ss-search-gap","SizedBox","Separates the search field from the Music/Podcasts switch.",[],`const SizedBox(height: 12)`),
      T("ss-segments","SegmentedButton","SegmentedButton is the Material 3 segmented control: one widget that offers a small set of mutually exclusive choices — here Music or Podcasts — with exactly one segment selected at a time. It is the right widget when there are only two or three options and the choice must stay visible on screen, unlike a DropdownButton that hides the options until tapped or a TabBar that switches whole pages. The selected value lives in a Set, and onSelectionChanged hands back the new set, so switching segments rebuilds the browse grid below between music categories and podcast categories.",[
        T("ss-seg-music","SegmentedButtonSegment","The Music segment shows the music browse categories when selected. It is the default selection on this screen.",[],`const SegmentedButtonSegment(value: 'music', label: Text('Music'))`,"One option inside a SegmentedButton — its value and label."),
        T("ss-seg-podcasts","SegmentedButtonSegment","The Podcasts segment swaps the browse grid to podcast categories when selected. It stays unfilled until tapped.",[],`const SegmentedButtonSegment(value: 'podcasts', label: Text('Podcasts'))`,"One option inside a SegmentedButton — its value and label.")
      ],`SegmentedButton<String>(\n  segments: const [\n    SegmentedButtonSegment(value: 'music', label: Text('Music')),\n    SegmentedButtonSegment(value: 'podcasts', label: Text('Podcasts')),\n  ],\n  selected: {'music'},\n  onSelectionChanged: (selection) => setState(() => _browse = selection.first),\n)`,"A Material 3 segmented control that picks exactly one option from a small set — here Music or Podcasts — with the selected segment filled."),
      T("ss-seg-gap","SizedBox","Separates the segmented switch from the browse heading.",[],`const SizedBox(height: 16)`),
      T("ss-browse-title","Text","Heads the browse section so the category grid reads as one group. It tells the user these tiles are starting points, not results.",[],`const Text(\n  'Browse all',\n  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),\n)`),
      T("ss-grid-expanded","Expanded","The browse grid takes every pixel not used by the search field and the switch, so the categories fill the screen.",[
        T("ss-grid","GridView","Six browse categories are packed into a two-column grid so the most useful starting points are visible without scrolling far. The grid scrolls if the categories grow beyond the screen.",[
          T("ss-card-music","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-music-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-music-title","Text","Names the browse category. 'Music' opens the music categories.",[],`const Text(\n  'Music',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFFE13300),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('Music'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid."),
          T("ss-card-podcasts","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-podcasts-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-podcasts-title","Text","Names the browse category. 'Podcasts' opens the podcast categories.",[],`const Text(\n  'Podcasts',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFF1E3264),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('Podcasts'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid."),
          T("ss-card-live","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-live-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-live-title","Text","Names the browse category. 'Live Events' opens concerts near the user.",[],`const Text(\n  'Live Events',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFF8D67AB),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('Live Events'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid."),
          T("ss-card-made","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-made-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-made-title","Text","Names the browse category. 'Made For You' opens the personalised mixes.",[],`const Text(\n  'Made For You',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFF1E6F5C),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('Made For You'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid."),
          T("ss-card-charts","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-charts-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-charts-title","Text","Names the browse category. 'Charts' opens the most-played songs.",[],`const Text(\n  'Charts',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFFBA5D07),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('Charts'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid."),
          T("ss-card-new","Card","One browse tile reads as a single tappable card: a coloured tile with its category name on it.",[
            T("ss-card-new-col","Column","The category name sits on the coloured tile.",[
              T("ss-card-new-title","Text","Names the browse category. 'New Releases' opens this week's new music.",[],`const Text(\n  'New Releases',\n  style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white),\n)`)
            ])
          ],`Card(\n  color: const Color(0xFF0D73EC),\n  child: const Padding(\n    padding: EdgeInsets.all(12),\n    child: Text('New Releases'),\n  ),\n)`,"Taught in depth in Swiggy — Home; here it is one coloured browse tile in the search grid.")
        ],`GridView.count(\n  crossAxisCount: 2,\n  mainAxisSpacing: 12,\n  crossAxisSpacing: 12,\n  childAspectRatio: 1.8,\n  children: const [\n    BrowseCard('Music'),\n    BrowseCard('Podcasts'),\n    BrowseCard('Live Events'),\n    BrowseCard('Made For You'),\n    BrowseCard('Charts'),\n    BrowseCard('New Releases'),\n  ],\n)`,"Taught in depth in Spotify — Home; here it lays the six browse categories out in two columns.")
      ])
    ]),
    T("ss-bottom","BottomNavigationBar","Home, Search, and Your Library stay reachable from every screen. Search is the selected destination here.",[
      T("ss-nav-home","BottomNavigationBarItem","Takes the user back to the home feed.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.home),\n  label: 'Home',\n)`,"Taught in depth in Spotify — Home; here it is the Home destination of the search screen's bottom bar."),
      T("ss-nav-search","BottomNavigationBarItem","Opens search for songs, artists, and playlists. It is the selected destination on this screen.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.search),\n  label: 'Search',\n)`,"Taught in depth in Spotify — Home; here it is the selected Search destination of the search screen's bottom bar."),
      T("ss-nav-library","BottomNavigationBarItem","Opens the user's saved playlists and albums.",[],`const BottomNavigationBarItem(\n  icon: Icon(Icons.library_music_outlined),\n  label: 'Your Library',\n)`,"Taught in depth in Spotify — Home; here it is the Your Library destination of the search screen's bottom bar.")
    ],`BottomNavigationBar(\n  currentIndex: 1,\n  items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),\n    BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),\n    BottomNavigationBarItem(icon: Icon(Icons.library_music_outlined), label: 'Your Library'),\n  ],\n)`)
  ],`Scaffold(\n  appBar: const SearchAppBar(),\n  body: const SearchBody(),\n  bottomNavigationBar: const SearchBottomNav(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark(),\n  home: const SpotifySearch(),\n)`);

TEARDOWNS["whatsapp-status"].root = T("ws-material","MaterialApp","MaterialApp builds the whole status-viewer experience from one place: it holds the WhatsApp-green theme, the text styles and the navigation stack, so the full-screen viewer inherits the same colours and routing as the chat list it opens from instead of defining them itself.",[
  T("ws-scaffold","Scaffold","Scaffold is the frame of the viewer: it holds the full-screen status image in its body and gives the overlay rows (progress, sender, reply) one stable surface to sit on. Without it the image and the overlays would be separate widgets with nothing keeping them aligned to the screen edges.",[
    T("ws-stack","Stack","Stack layers the three parts of the viewer in one box: the swipeable status pages at the back, the progress and sender rows on top, and the reply field at the bottom. The overlays float over the image instead of pushing it down, which is exactly how a full-screen viewer works.",[
      T("ws-viewer","PageView","PageView is taught in depth in Instagram — Reels (S6), where vertical swiping moves between reels. Here it does the same job horizontally: each swipe moves to the next person's status, so the viewer needs no back buttons and no list to pick from.",[
        T("ws-page-1","Stack","One status page layers its photo and its caption in the same full-screen box.",[
          T("ws-hero","Hero","Hero is taught in depth in Amazon — Product detail (S5), where a product image flies into a full-screen gallery. Here it does the same job locally: the small status thumbnail from the chat list grows into this full-screen photo, so the viewer feels like a continuation of the list instead of a new screen.",[
            T("ws-page1-image","Image","Shows the first status photo filling the whole screen.",[],`Image.asset(\n  'assets/status/alex_beach.png',\n  fit: BoxFit.cover,\n)`)
          ],`Hero(\n  tag: 'status-alex',\n  child: Image.asset('assets/status/alex_beach.png', fit: BoxFit.cover),\n)`,"Flies one widget between two screens in a shared-element transition."),
          T("ws-page1-caption","Text","Shows the caption Alex wrote under this status photo.",[],`const Text(\n  'Beach day with the Flutter crew',\n  style: TextStyle(color: Colors.white, fontSize: 14),\n)`)
        ]),
        T("ws-page-2","Stack","The second status page layers its photo and caption in the same full-screen box.",[
          T("ws-page2-image","Image","Shows the second status photo filling the whole screen.",[],`Image.asset(\n  'assets/status/alex_code.png',\n  fit: BoxFit.cover,\n)`),
          T("ws-page2-caption","Text","Shows the caption under the second status photo.",[],`const Text(\n  'Shipping the widget tree lesson tonight',\n  style: TextStyle(color: Colors.white, fontSize: 14),\n)`)
        ]),
        T("ws-page-3","Stack","The third status page layers its photo and caption in the same full-screen box.",[
          T("ws-page3-image","Image","Shows the third status photo filling the whole screen.",[],`Image.asset(\n  'assets/status/alex_food.png',\n  fit: BoxFit.cover,\n)`),
          T("ws-page3-caption","Text","Shows the caption under the third status photo.",[],`const Text(\n  'Dinner after the session',\n  style: TextStyle(color: Colors.white, fontSize: 14),\n)`)
        ])
      ],`PageView.builder(\n  itemCount: statuses.length,\n  itemBuilder: (_, index) => StatusPage(statuses[index]),\n)`,"Builds swipeable full pages; each child is one page the user swipes through."),
      T("ws-top","Column","The progress segments and the sender row sit together at the top of the viewer, above the photo.",[
        T("ws-progress","Row","Three segments show how far through Alex's statuses the viewer is: the first is full, the second is half full, the third is empty.",[
          T("ws-seg-1","Container","A filled segment marks a status that has already been viewed.",[],`Container(\n  height: 3,\n  decoration: BoxDecoration(\n    color: Colors.white,\n    borderRadius: BorderRadius.circular(2),\n  ),\n)`),
          T("ws-seg-2","Container","A half-filled segment marks the status on screen right now.",[],`Container(\n  height: 3,\n  decoration: BoxDecoration(\n    color: Colors.white54,\n    borderRadius: BorderRadius.circular(2),\n  ),\n)`),
          T("ws-seg-3","Container","An empty segment marks a status that has not been viewed yet.",[],`Container(\n  height: 3,\n  decoration: BoxDecoration(\n    color: Colors.white30,\n    borderRadius: BorderRadius.circular(2),\n  ),\n)`)
        ]),
        T("ws-sender","Row","The sender's avatar, name and time share one line under the progress segments.",[
          T("ws-sender-avatar","CircleAvatar","Shows whose status this is at a glance.",[],`const CircleAvatar(radius: 16, child: Text('A'))`),
          T("ws-sender-name","Text","Names the person whose status is on screen.",[],`const Text(\n  'Alex',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
          T("ws-sender-time","Text","Shows how long ago this status was posted.",[],`const Text(\n  '2h ago',\n  style: TextStyle(color: Colors.white70, fontSize: 12),\n)`),
          T("ws-close","IconButton","Closes the viewer and returns to the status list.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.close, color: Colors.white),\n)`)
        ])
      ]),
      T("ws-reply","Row","The reply field and its two actions sit in one row pinned to the bottom of the viewer.",[
        T("ws-reply-field","TextField","Lets the viewer type a reply to this status without leaving it.",[
          T("ws-reply-hint","Text","Shows the 'Reply' hint until the viewer starts typing.",[],`const Text('Reply', style: TextStyle(color: Colors.white70))`)
        ],`TextField(\n  decoration: InputDecoration(\n    hintText: 'Reply',\n    border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),\n  ),\n)`),
        T("ws-reply-heart","IconButton","Likes the status with one tap.",[],`IconButton(\n  onPressed: likeStatus,\n  icon: const Icon(Icons.favorite_border, color: Colors.white),\n)`),
        T("ws-reply-send","IconButton","Sends the typed reply to Alex.",[],`IconButton(\n  onPressed: sendReply,\n  icon: const Icon(Icons.send, color: Colors.white),\n)`)
      ])
    ])
  ],`Scaffold(\n  body: const StatusViewer(),\n)`)
],`MaterialApp(\n  home: const StatusViewerScreen(),\n)`);

TEARDOWNS["spotify-playlist"].root = T("spl-material","MaterialApp","One dark Material theme and navigation context covers the whole Spotify playlist screen.",[
  T("spl-scaffold","Scaffold","The app bar, playlist header, and reorderable song list share one stable screen frame.",[
    T("spl-appbar","AppBar","The back action, playlist title, and overflow menu stay visible at the top while the song list scrolls below.",[
      T("spl-back","IconButton","Returns to Your Library without losing the playlist.",[],`IconButton(\n  onPressed: () => Navigator.pop(context),\n  icon: const Icon(Icons.arrow_back),\n)`),
      T("spl-appbar-title","Text","Names the playlist at the top of the screen.",[],`const Text(\n  'Liked Songs',\n  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),\n)`),
      T("spl-more","IconButton","Opens playlist options such as share, edit, and download.",[],`IconButton(\n  onPressed: openPlaylistMenu,\n  icon: const Icon(Icons.more_vert),\n)`)
    ],`AppBar(\n  title: const Text('Liked Songs'),\n  actions: [PlaylistMenuButton()],\n)`),
    T("spl-body","Column","The playlist header sits above the song list, which takes the rest of the screen.",[
      T("spl-header","Row","The large cover art and the playlist details share the header line.",[
        T("spl-cover","ClipRRect","Rounds the corners of the large playlist cover.",[
          T("spl-cover-art","Image","Shows the playlist cover art at the top of the screen.",[],`Image.asset(\n  'assets/covers/liked_songs.png',\n  width: 120,\n  height: 120,\n  fit: BoxFit.cover,\n)`)
        ]),
        T("spl-header-info","Column","The playlist title sits above its owner and song count.",[
          T("spl-playlist-title","Text","Names the playlist in large type.",[],`const Text(\n  'Liked Songs',\n  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),\n)`),
          T("spl-playlist-meta","Text","Shows who made the playlist and how many songs it holds.",[],`const Text(\n  'Dheeraj Kumar · 4 songs',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
        ])
      ]),
      T("spl-actions","Row","The play button and the shuffle toggle share one action row under the header.",[
        T("spl-play-btn","ElevatedButton","Starts playing the playlist from the top.",[
          T("spl-play-label","Text","Labels the primary play action.",[],`const Text('Play')`)
        ],`ElevatedButton.icon(\n  onPressed: playPlaylist,\n  icon: const Icon(Icons.play_arrow),\n  label: const Text('Play'),\n)`,"A filled button for the primary action on the screen."),
        T("spl-shuffle-btn","IconButton","Toggles shuffle so the songs play in a random order.",[],`IconButton(\n  onPressed: toggleShuffle,\n  icon: const Icon(Icons.shuffle, color: Color(0xFF1DB954)),\n)`)
      ]),
      T("spl-list","ReorderableListView","ReorderableListView is the widget that makes a playlist feel like a playlist: the user presses a song's drag handle and slides it up or down, and the list reorders itself with an animation. A plain ListView can only scroll — it cannot let the user change the order, which is the whole point of curating a playlist. Each song row needs a unique key so Flutter knows which song moved where.",[
        T("spl-song-1","Row","One song row: drag handle, cover, title and artist, and duration.",[
          T("spl-song1-drag","Icon","The drag handle — press and hold it to lift the song out of the list.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`),
          T("spl-song1-art","Image","Shows the song's cover art at the left of the row.",[],`Image.asset(\n  'assets/covers/blinding_lights.png',\n  width: 44,\n  height: 44,\n  fit: BoxFit.cover,\n)`),
          T("spl-song1-info","Column","The song title sits above the artist name.",[
            T("spl-song1-title","Text","Names the song in the playlist row, so the list can be scanned by title.",[],`const Text(\n  'Blinding Lights',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("spl-song1-artist","Text","Names the artist under the title.",[],`const Text(\n  'The Weeknd',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
          ]),
          T("spl-song1-time","Text","Shows the song length at the trailing edge.",[],`const Text(\n  '3:20',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
        ]),
        T("spl-song-2","Row","One song row: drag handle, cover, title and artist, and duration.",[
          T("spl-song2-drag","Icon","The drag handle — press and hold it to lift the song out of the list.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`),
          T("spl-song2-art","Image","Shows the song's cover art at the left of the row.",[],`Image.asset(\n  'assets/covers/after_hours.png',\n  width: 44,\n  height: 44,\n  fit: BoxFit.cover,\n)`),
          T("spl-song2-info","Column","The song title sits above the artist name.",[
            T("spl-song2-title","Text","Names the song in the playlist row, so the list can be scanned by title.",[],`const Text(\n  'After Hours',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("spl-song2-artist","Text","Names the artist under the title.",[],`const Text(\n  'The Weeknd',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
          ]),
          T("spl-song2-time","Text","Shows the song length at the trailing edge.",[],`const Text(\n  '6:01',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
        ]),
        T("spl-song-3","Row","One song row: drag handle, cover, title and artist, and duration.",[
          T("spl-song3-drag","Icon","The drag handle — press and hold it to lift the song out of the list.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`),
          T("spl-song3-art","Image","Shows the song's cover art at the left of the row.",[],`Image.asset(\n  'assets/covers/future_nostalgia.png',\n  width: 44,\n  height: 44,\n  fit: BoxFit.cover,\n)`),
          T("spl-song3-info","Column","The song title sits above the artist name.",[
            T("spl-song3-title","Text","Names the song in the playlist row, so the list can be scanned by title.",[],`const Text(\n  'Levitating',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("spl-song3-artist","Text","Names the artist under the title.",[],`const Text(\n  'Dua Lipa',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
          ]),
          T("spl-song3-time","Text","Shows the song length at the trailing edge.",[],`const Text(\n  '3:23',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
        ]),
        T("spl-song-4","Row","One song row: drag handle, cover, title and artist, and duration.",[
          T("spl-song4-drag","Icon","The drag handle — press and hold it to lift the song out of the list.",[],`const Icon(Icons.drag_handle, color: Colors.grey)`),
          T("spl-song4-art","Image","Shows the song's cover art at the left of the row.",[],`Image.asset(\n  'assets/covers/divide.png',\n  width: 44,\n  height: 44,\n  fit: BoxFit.cover,\n)`),
          T("spl-song4-info","Column","The song title sits above the artist name.",[
            T("spl-song4-title","Text","Names the song in the playlist row, so the list can be scanned by title.",[],`const Text(\n  'Shape of You',\n  style: TextStyle(fontWeight: FontWeight.w700),\n)`),
            T("spl-song4-artist","Text","Names the artist under the title.",[],`const Text(\n  'Ed Sheeran',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
          ]),
          T("spl-song4-time","Text","Shows the song length at the trailing edge.",[],`const Text(\n  '3:53',\n  style: TextStyle(color: Colors.grey, fontSize: 12),\n)`)
        ])
      ],`ReorderableListView.builder(\n  itemCount: songs.length,\n  itemBuilder: (_, index) => SongRow(\n    key: ValueKey(songs[index].id),\n    song: songs[index],\n  ),\n  onReorder: (oldIndex, newIndex) => reorderSong(oldIndex, newIndex),\n)`,"Builds a list whose items the user drags to reorder; each child needs a unique key.")
    ])
  ],`Scaffold(\n  appBar: const PlaylistAppBar(),\n  body: const PlaylistBody(),\n)`)
],`MaterialApp(\n  theme: ThemeData.dark(),\n  home: const PlaylistScreen(),\n)`);

TEARDOWNS["login-signup"].root = T("ls-material","MaterialApp","MaterialApp sits at the root and hands the sign-up screen one theme, one set of Material defaults, and one Navigator. That is why the brand blue, the text styles, and the move back to sign-in all behave consistently here.",[
  T("ls-theme","Theme","A focused auth palette supplies brand color and typography.",[],`Theme(\n  data: ThemeData(colorSchemeSeed: const Color(0xFF02569B)),\n  child: const SignUpScreen(),\n)`),
  T("ls-scaffold","Scaffold","Scaffold is the frame of the page: it holds the centred sign-up form in its body and gives the screen one stable background. Without it the form would have no page frame to sit in.",[
    T("ls-safe","SafeArea","Form content stays clear of notches, the status bar, and system gestures.",[
      T("ls-scroll","SingleChildScrollView","The form scrolls when the keyboard shrinks the visible area.",[
        T("ls-center","Center","The sign-up form stays centered on tall screens.",[
          T("ls-form-padding","Padding","The form keeps one consistent inset from the screen edges.",[
            T("ls-form","Form","Form groups the name, email, and password fields under one GlobalKey so they can be validated together when Create account is tapped. That single key is how the button knows whether all three fields are valid before creating the account.",[
              T("ls-col","Column","Logo, fields, terms, and actions follow from top to bottom.",[
                T("ls-header","Column","Brand mark, title, and subtitle form the sign-up header.",[
                  T("ls-logo-ring","Container","A gradient ring gives the brand mark its badge shape.",[
                    T("ls-logo","Text","Shows the app monogram inside the badge.",[],`const Text(\n  'FF',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800),\n)`)
                  ],`Container(\n  width: 64,\n  height: 64,\n  decoration: const BoxDecoration(\n    borderRadius: BorderRadius.all(Radius.circular(22)),\n    gradient: LinearGradient(colors: [Color(0xFF02569B), Color(0xFF13B9FD)]),\n  ),\n  child: const Center(child: Text('FF')),\n)`),
                  T("ls-title","Text","Invites the new user to create an account.",[],`const Text(\n  'Create account',\n  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),\n)`),
                  T("ls-subtitle","Text","Explains what signing up unlocks.",[],`const Text(\n  'Join FlutterForward to start learning',\n  style: TextStyle(color: Colors.grey),\n)`)
                ]),
                T("ls-name-field","TextFormField","TextFormField is taught in depth in Gmail — Compose (S1), where validated To, Subject, and Body fields gate sending. Here it does the same job locally: it collects the display name and refuses an empty one, showing 'Enter your name' until something is typed.",[
                  T("ls-name-icon","Icon","Hints that this field expects a person's name.",[],`const Icon(Icons.person_outlined)`),
                  T("ls-name-decoration","InputDecoration","Labels, hints, and borders describe the name field's state.",[],`const InputDecoration(\n  labelText: 'Full name',\n  hintText: 'Dheeraj Kumar',\n  prefixIcon: Icon(Icons.person_outlined),\n  border: OutlineInputBorder(),\n)`)
                ],`TextFormField(\n  controller: _nameController,\n  decoration: const InputDecoration(\n    labelText: 'Full name',\n    prefixIcon: Icon(Icons.person_outlined),\n    border: OutlineInputBorder(),\n  ),\n  validator: (value) => value!.isEmpty ? 'Enter your name' : null,\n)`,"A text field with validation, used inside a Form."),
                T("ls-field-gap","SizedBox","Keeps a steady rhythm between the fields.",[],`const SizedBox(height: 12)`),
                T("ls-email-field","TextFormField","TextFormField is taught in depth in Gmail — Compose (S1). Here it collects the account email and refuses one without '@', showing 'Enter a valid email' until the address looks right.",[
                  T("ls-email-icon","Icon","Hints that this field expects an email address.",[],`const Icon(Icons.mail_outlined)`),
                  T("ls-email-decoration","InputDecoration","Labels, hints, and borders describe the email field's state.",[],`const InputDecoration(\n  labelText: 'Email',\n  hintText: 'you@example.com',\n  prefixIcon: Icon(Icons.mail_outlined),\n  border: OutlineInputBorder(),\n)`)
                ],`TextFormField(\n  controller: _emailController,\n  keyboardType: TextInputType.emailAddress,\n  decoration: const InputDecoration(\n    labelText: 'Email',\n    prefixIcon: Icon(Icons.mail_outlined),\n    border: OutlineInputBorder(),\n  ),\n  validator: (value) => value!.contains('@') ? null : 'Enter a valid email',\n)`,"A text field with validation, used inside a Form."),
                T("ls-field-gap-2","SizedBox","Keeps a steady rhythm between the fields.",[],`const SizedBox(height: 12)`),
                T("ls-pass-field","TextFormField","TextFormField is taught in depth in Gmail — Compose (S1). Here it collects the password without showing it, and refuses one shorter than 6 characters, showing 'Minimum 6 characters' until it is long enough.",[
                  T("ls-pass-icon","Icon","Hints that this field expects a secret.",[],`const Icon(Icons.lock_outlined)`),
                  T("ls-pass-decoration","InputDecoration","Labels the password field and reserves the suffix slot.",[],`const InputDecoration(\n  labelText: 'Password',\n  prefixIcon: Icon(Icons.lock_outlined),\n  border: OutlineInputBorder(),\n)`),
                  T("ls-eye","IconButton","Toggles password visibility without leaving the field.",[],`IconButton(\n  onPressed: _toggleObscure,\n  icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),\n)`)
                ],`TextFormField(\n  controller: _passwordController,\n  obscureText: _obscure,\n  decoration: InputDecoration(\n    labelText: 'Password',\n    prefixIcon: const Icon(Icons.lock_outlined),\n    suffixIcon: IconButton(\n      onPressed: _toggleObscure,\n      icon: const Icon(Icons.visibility_outlined),\n    ),\n    border: const OutlineInputBorder(),\n  ),\n  validator: (value) => value!.length >= 6 ? null : 'Minimum 6 characters',\n)`,"A text field with validation, used inside a Form."),
                T("ls-field-gap-3","SizedBox","Breathing room before the terms row.",[],`const SizedBox(height: 14)`),
                T("ls-terms-row","Row","The checkbox and its label share one line, so the whole row reads as one agreement.",[
                  T("ls-terms-check","Checkbox","Checkbox is taught in depth in Tasks (N3), where tapping a row's box completes the task. Here it does the same job locally: it holds the one true/false choice the form needs — whether the user agrees to the terms — and Create account stays disabled until it is ticked.",[],`Checkbox(\n  value: _agreedToTerms,\n  onChanged: (value) => setState(() => _agreedToTerms = value!),\n)`,"A square tick box that holds a true/false choice."),
                  T("ls-terms-text","Text","States the agreement the checkbox confirms.",[],`const Text('I agree to the Terms and Privacy Policy')`)
                ]),
                T("ls-btn-gap","SizedBox","Separates the form from its primary action.",[],`const SizedBox(height: 16)`),
                T("ls-create-btn","ElevatedButton","Submits the form and creates the account.",[
                  T("ls-create-label","Text","Labels the primary create action.",[],`const Text('Create account')`)
                ],`ElevatedButton(\n  onPressed: () {\n    if (_formKey.currentState!.validate() && _agreedToTerms) _signUp();\n  },\n  child: const Text('Create account'),\n)`,"A filled button for the primary action on the screen."),
                T("ls-login-row","Row","The prompt and its link share one centered line.",[
                  T("ls-login-text","Text","Invites existing users without a link style.",[],`const Text('Already have an account?')`),
                  T("ls-login-link","GestureDetector","Makes the 'Log in' text tappable.",[
                    T("ls-login-link-text","Text","Routes existing users back to sign-in.",[],`const Text(\n  'Log in',\n  style: TextStyle(color: Color(0xFF02569B), fontWeight: FontWeight.w700),\n)`)
                  ],`GestureDetector(\n  onTap: _goToSignIn,\n  child: const Text(\n    'Log in',\n    style: TextStyle(color: Color(0xFF02569B)),\n  ),\n)`)
                ])
              ])
            ],`Form(\n  key: _formKey,\n  child: const SignUpFields(),\n)`, "Groups fields so they can be validated together.")
          ],`const Padding(\n  padding: EdgeInsets.symmetric(horizontal: 22),\n  child: SignUpForm(),\n)`)
        ],`const Center(child: SignUpCard())`)
      ],`const SingleChildScrollView(child: SignUpCard())`)
    ],`const SafeArea(child: SignUpBody())`)
  ],`Scaffold(\n  body: const SafeArea(child: SignUpBody()),\n)`)
],`MaterialApp(\n  home: const SignUpScreen(),\n)`);

TEARDOWNS["gmail-drawer"].root = T("gd-material","MaterialApp","The whole Gmail drawer experience runs under one Material theme and navigation context.",[
  T("gd-scaffold","Scaffold","Scaffold is the frame that owns the drawer: it holds the dimmed inbox in its body and slides the drawer in from the left edge on top of it. The drawer is a Scaffold slot, not a page of its own, which is why opening it never leaves the inbox.",[
    T("gd-drawer","Drawer","Drawer is the slide-in side menu that Gmail opens from the hamburger: it groups the account header, the inbox labels and folders, and settings into one panel that covers the left of the screen while the inbox stays dimmed behind it. It closes with a swipe or a tap outside, so it never needs its own back button. This is the canonical Drawer — no other existing app has one.",[
      T("gd-drawer-col","Column","The account header sits above the scrolling label list inside the drawer.",[
        T("gd-header","Container","A coloured header block gives the account its own space at the top of the drawer.",[
          T("gd-header-row","Row","The account avatar and the name-and-email column share the header line.",[
            T("gd-header-avatar","CircleAvatar","Shows who is signed in at the top of the drawer.",[],`const CircleAvatar(\n  radius: 20,\n  backgroundColor: Color(0xFF5B5BD6),\n  child: Text('D'),\n)`),
            T("gd-header-info","Column","The account name sits above its email address.",[
              T("gd-header-name","Text","Shows the signed-in account name.",[],`const Text(\n  'Dheeraj Kumar',\n  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),\n)`),
              T("gd-header-email","Text","Shows the signed-in email address.",[],`const Text(\n  'dheeraj@example.com',\n  style: TextStyle(color: Colors.white70, fontSize: 12),\n)`)
            ])
          ])
        ]),
        T("gd-menu","ListView","The drawer rows scroll as one list, so every label and folder stays reachable even on a short screen.",[
          T("gd-row-all","ListTile","One drawer row: every mailbox in one place.",[
            T("gd-row-all-icon","Icon","Marks the all-mailboxes row.",[],`const Icon(Icons.all_inbox)`),
            T("gd-row-all-label","Text","Names the all-inboxes destination.",[],`const Text('All inboxes')`)
          ],`ListTile(\n  leading: const Icon(Icons.all_inbox),\n  title: const Text('All inboxes'),\n  onTap: showAllInboxes,\n)`,"Groups a leading icon and a label into one tappable row."),
          T("gd-row-primary","ListTile","One drawer row: the main inbox category.",[
            T("gd-row-primary-icon","Icon","Marks the Primary inbox row.",[],`const Icon(Icons.inbox)`),
            T("gd-row-primary-label","Text","Names the Primary inbox.",[],`const Text('Primary')`)
          ],`ListTile(\n  leading: const Icon(Icons.inbox),\n  title: const Text('Primary'),\n  onTap: showPrimary,\n)`,"Groups a leading icon and a label into one tappable row."),
          T("gd-row-starred","ListTile","One drawer row: mail the user starred for later.",[
            T("gd-row-starred-icon","Icon","Marks the Starred row.",[],`const Icon(Icons.star_border)`),
            T("gd-row-starred-label","Text","Names the Starred folder.",[],`const Text('Starred')`)
          ],`ListTile(\n  leading: const Icon(Icons.star_border),\n  title: const Text('Starred'),\n  onTap: showStarred,\n)`,"Groups a leading icon and a label into one tappable row."),
          T("gd-row-sent","ListTile","One drawer row: mail the user has sent.",[
            T("gd-row-sent-icon","Icon","Marks the Sent row with a paper-plane icon, so sent mail is recognised at a glance.",[],`const Icon(Icons.send_outlined)`),
            T("gd-row-sent-label","Text","Names the Sent folder.",[],`const Text('Sent')`)
          ],`ListTile(\n  leading: const Icon(Icons.send_outlined),\n  title: const Text('Sent'),\n  onTap: showSent,\n)`,"Groups a leading icon and a label into one tappable row."),
          T("gd-row-drafts","ListTile","One drawer row: unfinished mail waiting to be sent.",[
            T("gd-row-drafts-icon","Icon","Marks the Drafts row.",[],`const Icon(Icons.drafts_outlined)`),
            T("gd-row-drafts-label","Text","Names the Drafts folder.",[],`const Text('Drafts')`)
          ],`ListTile(\n  leading: const Icon(Icons.drafts_outlined),\n  title: const Text('Drafts'),\n  onTap: showDrafts,\n)`,"Groups a leading icon and a label into one tappable row."),
          T("gd-divider","Divider","A thin rule separates the folders from settings.",[],`const Divider()`,"A thin horizontal rule."),
          T("gd-row-settings","ListTile","One drawer row: the settings destination at the bottom of the menu.",[
            T("gd-row-settings-icon","Icon","Marks the Settings row.",[],`const Icon(Icons.settings_outlined)`),
            T("gd-row-settings-label","Text","Names the Settings destination.",[],`const Text('Settings')`)
          ],`ListTile(\n  leading: const Icon(Icons.settings_outlined),\n  title: const Text('Settings'),\n  onTap: openSettings,\n)`,"Groups a leading icon and a label into one tappable row.")
        ])
      ])
    ],`Drawer(\n  child: Column(\n    children: [\n      const DrawerHeader(child: AccountHeader()),\n      const DrawerMenu(),\n    ],\n  ),\n)`,"Slides in from the side with navigation destinations; closes with a swipe or a tap outside."),
    T("gd-body","Stack","The dimmed inbox sits behind the drawer in one layered box, so the drawer can slide over it without the inbox scrolling away.",[
      T("gd-inbox","Column","Two faded inbox lines show the inbox waiting behind the drawer.",[
        T("gd-inbox-line-1","Text","A faded preview of the first mail behind the drawer.",[],`const Text('FlutterForward — Your 40-lesson Flutter course')`),
        T("gd-inbox-line-2","Text","A faded preview of the second mail behind the drawer.",[],`const Text('RTU Kota — Exam timetable: V Sem main exams')`)
      ]),
      T("gd-inbox-dim","Container","A dark translucent layer dims the inbox while the drawer is open, so the drawer reads as the active surface.",[],`Container(color: Colors.black54)`)
    ])
  ],`Scaffold(\n  drawer: const GmailDrawer(),\n  body: const InboxBody(),\n)`)
],`MaterialApp(\n  home: const GmailInbox(),\n)`);


/*

/* Keep the teaching tree aligned with the visible mockups. Every selectable node below has a complete, contextual snippet. */
Object.values(TEARDOWNS).forEach(item => { item.count = Object.keys(tdIndex(item).map).length; });

const TD_ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/></svg>',
  call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h3l1 5-2 1a14 14 0 0 0 6 6l1-2 5 1v3c0 2-2 4-4 4C9 20 4 15 3 7c0-2 2-4 4-4Z"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.3 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 11 18-8-8 18-2-8-8-2Z"/><path d="m11 13 10-10"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 12-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 4.5a3.7 3.7 0 0 1 5.2 5.2l-8.2 8.2a1.8 1.8 0 0 1-2.6-2.6L14 8.7"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="14" r="3.5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
  reels: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m8 4 3 5M14 4l3 5M3 9h18m-11 3 5 3-5 3Z"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3"/><path d="M5 20c1-4 3-6 7-6s6 2 7 6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>'
};
function tdStatus(dark) { return `<div class="app-status${dark?' dark':''}" aria-hidden="true"><span>9:41</span><span class="app-status-icons"><span>▮▮▮</span><i></i></span></div>`; }
function tdPhoneWhatsApp() {
  return `${tdStatus(true)}<div class="wa-screen td-region" data-node="wa-scaffold" data-widget="Scaffold"><header class="wa-bar td-region" data-node="wa-appbar" data-widget="AppBar"><span class="wa-back td-region" data-node="wa-back" data-widget="IconButton">‹</span><span class="wa-title-row td-region" data-node="wa-title-row" data-widget="Row"><span class="wa-avatar td-region" data-node="wa-avatar" data-widget="CircleAvatar">A</span><span class="wa-person td-region" data-node="wa-title" data-widget="Column"><b class="td-region" data-node="wa-name" data-widget="Text">Alex</b><span class="td-region" data-node="wa-online" data-widget="Text">online</span></span></span><span class="wa-actions"><span class="td-region" data-node="wa-video" data-widget="IconButton">${TD_ICON.video}</span><span class="td-region" data-node="wa-call" data-widget="IconButton">${TD_ICON.call}</span><b class="td-region" data-node="wa-menu" data-widget="PopupMenuButton" style="font-size:17px;letter-spacing:2px">⋮</b></span></header><main class="wa-chat td-region" data-node="wa-list" data-widget="ListView"><div class="wa-day-align td-region" data-node="wa-day-align" data-widget="Center"><div class="wa-day td-region" data-node="wa-day-box" data-widget="Container"><span class="td-region" data-node="wa-day-text" data-widget="Text">TODAY</span></div></div><div class="wa-encrypt td-region" data-node="wa-encrypt" data-widget="Container"><span class="td-region" data-node="wa-encrypt-text" data-widget="Text">Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.</span></div><div class="wa-message-row td-region" data-node="wa-incoming" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-incoming-bubble" data-widget="Container"><span class="td-region" data-node="wa-incoming-text" data-widget="Text">Are you joining the Flutter session?<span class="wa-time">9:38</span></span></div></div><div class="wa-message-row mine td-region" data-node="wa-outgoing" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-outgoing-bubble" data-widget="Container"><span class="td-region" data-node="wa-outgoing-text" data-widget="Text">Yes — just finished the widget tree.<span class="wa-time">9:39 <span class="wa-ticks"></span></span></span></div></div><div class="wa-message-row td-region" data-node="wa-reply" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-reply-bubble" data-widget="Container"><span class="td-region" data-node="wa-reply-text" data-widget="Text">Perfect. See you there!<span class="wa-time">9:40</span></span></div></div><div class="wa-message-row mine td-region" data-node="wa-outgoing-2" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-outgoing-2-bubble" data-widget="Container"><span class="td-region" data-node="wa-outgoing-2-text" data-widget="Text">By the way, it is at 4 pm.<span class="wa-time">9:41 <span class="wa-ticks"></span></span></span></div></div><div class="wa-message-row td-region" data-node="wa-incoming-2" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-incoming-2-bubble" data-widget="Container"><span class="td-region" data-node="wa-incoming-2-text" data-widget="Text">Noted — I will bring my laptop.<span class="wa-time">9:42</span></span></div></div><div class="wa-message-row mine td-region" data-node="wa-outgoing-3" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-outgoing-3-bubble" data-widget="Container"><span class="td-region" data-node="wa-outgoing-3-text" data-widget="Text">We will build the profile screen together.<span class="wa-time">9:43 <span class="wa-ticks"></span></span></span></div></div><div class="wa-message-row td-region" data-node="wa-incoming-3" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-incoming-3-bubble" data-widget="Container"><span class="td-region" data-node="wa-incoming-3-text" data-widget="Text">Sounds good. See you then!<span class="wa-time">9:44</span></span></div></div><div class="wa-message-row mine td-region" data-node="wa-outgoing-4" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-outgoing-4-bubble" data-widget="Container"><span class="td-region" data-node="wa-outgoing-4-text" data-widget="Text">Do not forget the widget tree notes.<span class="wa-time">9:45 <span class="wa-ticks"></span></span></span></div></div><div class="wa-message-row td-region" data-node="wa-incoming-4" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-incoming-4-bubble" data-widget="Container"><span class="td-region" data-node="wa-incoming-4-text" data-widget="Text">Already saved them. See you at 4!<span class="wa-time">9:46</span></span></div></div></main><footer class="wa-composer-wrap td-region" data-node="wa-composer" data-widget="Row"><div class="wa-composer td-region" data-node="wa-field" data-widget="TextField">${TD_ICON.smile}<span>Message</span><span style="margin-left:auto;display:flex;gap:10px;align-items:center">${TD_ICON.clip}${TD_ICON.camera}</span></div><div class="wa-send td-region" data-node="wa-send" data-widget="IconButton">${TD_ICON.send}</div></footer>` + `<div class="wa-dialog-scrim td-region" data-node="wa-dialog" data-widget="AlertDialog">` +
`<div class="wa-dialog-box">` +
`<b class="td-region" data-node="wa-dialog-title" data-widget="Text">Delete message?</b>` +
`<span class="td-region" data-node="wa-dialog-content" data-widget="Text">Delete for everyone? This message will be removed for everyone in this chat.</span>` +
`<div class="wa-dialog-actions td-region" data-node="wa-dialog-actions" data-widget="Row">` +
`<span class="wa-dialog-cancel td-region" data-node="wa-dialog-cancel" data-widget="TextButton">Cancel</span>` +
`<span class="wa-dialog-delete td-region" data-node="wa-dialog-delete" data-widget="TextButton">Delete for everyone</span></div>` +
`</div></div>` + `</div>`;
}
function tdPhoneInstagram() {
  const photos = ["#7b8b9c","#b78363","#4e6d64","#a88767","#6d7e98","#986f78","#556c7e","#8f8068","#66765d","#9c7b8b","#7a9c6d","#8a7a9c","#c08a5e","#5e8a9c","#a05e6d","#6d8a7a","#b09c5e","#7e6d8a"];
  const stat=(id,value,label)=>`<span class="ig-stat td-region" data-node="ig-${id}-stat" data-widget="Column"><b class="td-region" data-node="ig-${id}-value" data-widget="Text">${value}</b><span class="td-region" data-node="ig-${id}-label" data-widget="Text">${label}</span></span>`;
  return `${tdStatus(false)}<div class="ig-screen td-region" data-node="ig-scaffold" data-widget="Scaffold"><main class="ig-scroll td-region" data-node="ig-scroll" data-widget="CustomScrollView"><header class="ig-bar td-region" data-node="ig-sliver" data-widget="SliverAppBar"><b class="td-region" data-node="ig-title" data-widget="Text">flutterforward⌄</b><span class="td-region" data-node="ig-create" data-widget="IconButton">${TD_ICON.plus}</span><span class="td-region" data-node="ig-menu" data-widget="IconButton" style="font-size:20px">☰</span></header><section class="ig-profile td-region" data-node="ig-profile-padding" data-widget="Padding"><div class="td-region" data-node="ig-profile" data-widget="Column"><div class="ig-top td-region" data-node="ig-top" data-widget="Row"><div class="ig-ring td-region" data-node="ig-avatar" data-widget="CircleAvatar"><div class="ig-avatar">FF</div></div><div class="td-region" data-node="ig-stats-expanded" data-widget="Expanded"><div class="ig-stats td-region" data-node="ig-stats" data-widget="Row">${stat('posts','24','posts')}${stat('followers','1,248','followers')}${stat('following','186','following')}</div></div></div><div class="ig-bio td-region" data-node="ig-bio-column" data-widget="Column"><b class="td-region" data-node="ig-bio-name" data-widget="Text">FlutterForward</b><span class="td-region" data-node="ig-bio-copy" data-widget="Text">Learn Flutter through practical screens.</span><span class="td-region" data-node="ig-bio-link" data-widget="Text" style="color:#00376b">flutter.dev</span></div><div class="ig-actions td-region" data-node="ig-actions" data-widget="Row"><span class="td-region" data-node="ig-edit" data-widget="Expanded"><span class="td-region" data-node="ig-edit-button" data-widget="OutlinedButton">Edit profile</span></span><span class="td-region" data-node="ig-share" data-widget="Expanded"><span class="td-region" data-node="ig-share-button" data-widget="OutlinedButton">Share profile</span></span><span class="td-region" data-node="ig-person-add" data-widget="IconButton">＋</span></div><div class="ig-highlights td-region" data-node="ig-highlights" data-widget="Row"><span class="ig-story td-region" data-node="ig-story-1" data-widget="CircleAvatar"><i>Fl</i></span><span class="ig-story td-region" data-node="ig-story-2" data-widget="CircleAvatar"><i>Wi</i></span><span class="ig-story td-region" data-node="ig-story-3" data-widget="CircleAvatar"><i>Da</i></span></div></div></section><div class="td-region" data-node="ig-tabs-header" data-widget="SliverPersistentHeader"><div class="ig-tabs td-region" data-node="ig-tabs" data-widget="TabBar"><span class="ig-tab td-region" data-node="ig-grid-tab" data-widget="Tab">${TD_ICON.grid}</span><span class="ig-tab td-region" data-node="ig-reels-tab" data-widget="Tab">${TD_ICON.reels}</span><span class="ig-tab td-region" data-node="ig-tagged-tab" data-widget="Tab">${TD_ICON.person}</span></div></div><div class="ig-grid td-region" data-node="ig-grid" data-widget="SliverGrid">${photos.map((p,i)=>`<div class="ig-photo td-region" data-node="ig-photo" data-widget="Image" style="--photo:${p};--rot:${i%2?'-10deg':'8deg'}"></div>`).join('')}</div></main><nav class="ig-bottom td-region" data-node="ig-bottom" data-widget="BottomNavigationBar"><span class="td-region" data-node="ig-home-item" data-widget="Icon">${TD_ICON.home}</span><span class="td-region" data-node="ig-search-item" data-widget="Icon">${TD_ICON.search}</span><span class="td-region" data-node="ig-create-item" data-widget="Icon">${TD_ICON.plus}</span><span class="td-region" data-node="ig-reels-item" data-widget="Icon">${TD_ICON.reels}</span><span class="mini-avatar td-region" data-node="ig-profile-item" data-widget="CircleAvatar">FF</span></nav></div>`;
}
function tdPhoneSwiggy() {
  const category=(name,color)=>`<span class="sw-category td-region" data-node="sw-category-item" data-widget="Column"><i class="sw-food td-region" data-node="sw-category-image" data-widget="CircleAvatar" style="--food:${color}">${name}</i><span class="td-region" data-node="sw-category-label" data-widget="Text">${name}</span></span>`;
  const restaurant=(name,meta,color)=>`<article class="sw-card td-region" data-node="sw-card-one" data-widget="Card"><div class="td-region" data-node="sw-card-column" data-widget="Column"><div class="sw-card-pic td-region" data-node="sw-card-image" data-widget="Image" style="--food:${color}"></div><div class="sw-card-body td-region" data-node="sw-card-detail-padding" data-widget="Padding"><span class="td-region" data-node="sw-card-details" data-widget="Column"><b class="td-region" data-node="sw-card-name" data-widget="Text">${name}</b><span class="td-region" data-node="sw-card-meta" data-widget="Text">${meta}</span></span></div></div></article>`;
  return `${tdStatus(false)}<div class="sw-screen td-region" data-node="sw-scaffold" data-widget="Scaffold"><main class="sw-scroll td-region" data-node="sw-scroll-view" data-widget="CustomScrollView">` + `<div class="sw-refresh td-region" data-node="sw-refresh" data-widget="RefreshIndicator"><span class="sw-refresh-spinner">⟳</span></div>` + `<header class="sw-head td-region" data-node="sw-appbar" data-widget="SliverAppBar"><div class="sw-location td-region" data-node="sw-location-row" data-widget="Row"><span class="td-region" data-node="sw-pin" data-widget="Icon">${TD_ICON.pin}</span><span class="sw-location-copy td-region" data-node="sw-location" data-widget="Column"><b class="td-region" data-node="sw-home-text" data-widget="Text">Home⌄</b><span class="td-region" data-node="sw-address-text" data-widget="Text">MG Road, Bengaluru</span></span><span class="sw-profile td-region" data-node="sw-profile-avatar" data-widget="CircleAvatar">DK</span></div><div class="sw-search td-region" data-node="sw-search" data-widget="TextField"><span>Search for dishes and restaurants</span><span style="margin-left:auto">${TD_ICON.search}</span></div></header><section class="sw-section"><h3 class="td-region" data-node="sw-category-title" data-widget="Text">What's on your mind?</h3><div class="sw-categories td-region" data-node="sw-categories" data-widget="ListView">${category('Biryani','#f4d4a5')}${category('Pizza','#f0c48d')}${category('Dosa','#ead39e')}${category('Rolls','#f2b3a0')}</div><div class="sw-offer td-region" data-node="sw-offer" data-widget="Card"><span class="td-region" data-node="sw-offer-copy" data-widget="Column"><b class="td-region" data-node="sw-offer-title" data-widget="Text">40% OFF</b><span class="td-region" data-node="sw-offer-detail" data-widget="Text">On your first order - use WELCOME</span></span></div></section><section class="sw-section"><h3 class="td-region" data-node="sw-restaurants-title" data-widget="Text">Top restaurants near you</h3><p class="sw-sub td-region" data-node="sw-restaurants-subtitle" data-widget="Text">Fast delivery and great ratings</p><div class="sw-restaurants td-region" data-node="sw-restaurants" data-widget="ListView">${restaurant('Spice Kitchen','4.5 · 25–30 min','#c87a4c')}${restaurant('South Bowl','4.3 · 20–25 min','#d6a56f')}</div><div class="sw-restaurants td-region" data-node="sw-restaurants-2" data-widget="ListView">${restaurant('Burger Barn','4.6 · 15–20 min','#b5654a')}${restaurant('Taco Town','4.2 · 20–25 min','#c99a4a')}</div><div class="sw-restaurants td-region" data-node="sw-restaurants-3" data-widget="ListView">${restaurant('Pizza Place','4.4 · 30–35 min','#c98a4a')}${restaurant('Dessert Den','4.7 · 15–20 min','#b07a8a')}</div><div class="sw-restaurants td-region" data-node="sw-restaurants-4" data-widget="ListView">${restaurant('Noodle House','4.5 · 20–25 min','#7a9c6d')}${restaurant('Salad Stop','4.3 · 10–15 min','#8a9c5e')}</div></section></main><nav class="sw-bottom td-region" data-node="sw-bottom" data-widget="BottomNavigationBar"><span class="sw-nav td-region" data-node="sw-food-nav" data-widget="Icon">${TD_ICON.home}<span>Food</span></span><span class="sw-nav td-region" data-node="sw-search-nav" data-widget="Icon">${TD_ICON.search}<span>Search</span></span><span class="sw-nav td-region" data-node="sw-cart-nav" data-widget="Icon">${TD_ICON.bag}<span>Cart</span></span><span class="sw-nav td-region" data-node="sw-account-nav" data-widget="Icon">${TD_ICON.person}<span>Account</span></span></nav></div>`;
}
function tdPhoneSettings() {
  const ic = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICON = {
    person: ic('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>'),
    lock: ic('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
    bell: ic('<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15Z"/><path d="M10 21a2 2 0 0 0 4 0"/>'),
    moon: ic('<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>'),
    help: ic('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1.9-1.1 1.8"/>'),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/>')
  };
  const row = (id, icon, title, sub, trail) =>
    `<div class="st-row td-region" data-node="${id}" data-widget="ListTile">` +
    `<span class="st-ic td-region" data-node="${id}-icon" data-widget="Icon">${icon}</span>` +
    `<span class="st-txcol"><b class="td-region" data-node="${id}-title" data-widget="Text">${title}</b>` +
    (sub ? `<span class="td-region" data-node="${id}-sub" data-widget="Text">${sub}</span>` : ``) + `</span>` +
    trail + `</div>`;
  const chev = (id) => `<span class="st-chev td-region" data-node="${id}-chev" data-widget="Icon">›</span>`;
  const sw = (id, on) => `<span class="st-switch${on ? " on" : ""} td-region" data-node="${id}-switch" data-widget="Switch"><i></i></span>`;
  const div = (id) => `<div class="st-div td-region" data-node="${id}" data-widget="Divider"></div>`;
  return `<div class="st-screen td-region" data-node="st-scaffold" data-widget="Scaffold">` +
  `<header class="st-bar td-region" data-node="st-appbar" data-widget="AppBar">` +
    `<span class="st-back td-region" data-node="st-back" data-widget="IconButton">‹</span>` +
    `<b class="td-region" data-node="st-appbar-title" data-widget="Text">Settings</b>` +
  `</header>` +
  `<main class="st-body td-region" data-node="st-body" data-widget="ListView">` +
    `<section class="st-card td-region" data-node="st-profile-card" data-widget="Card">` +
      `<div class="st-profile-row td-region" data-node="st-profile-row" data-widget="Row">` +
        `<span class="st-avatar td-region" data-node="st-avatar" data-widget="CircleAvatar">DK</span>` +
        `<span class="st-idcol td-region" data-node="st-profile-col" data-widget="Column">` +
          `<b class="td-region" data-node="st-name" data-widget="Text">Dheeraj Kumar</b>` +
          `<span class="td-region" data-node="st-email" data-widget="Text">dheeraj@example.com</span>` +
        `</span>` +
        `<span class="st-edit td-region" data-node="st-edit" data-widget="TextButton">Edit</span>` +
      `</div>` +
    `</section>` +
    `<div class="st-group-label td-region" data-node="st-account-header" data-widget="Text">Account</div>` +
    `<section class="st-group td-region" data-node="st-account-group" data-widget="Container">` +
      row("st-tile-profile", ICON.person, "Profile", "Name, email, avatar", chev("st-tile-profile")) +
      div("st-div1") +
      row("st-tile-privacy", ICON.lock, "Privacy", null, chev("st-tile-privacy")) +
    `</section>` +
    `<div class="st-group-label td-region" data-node="st-pref-header" data-widget="Text">Preferences</div>` +
    `<section class="st-group td-region" data-node="st-pref-group" data-widget="Container">` +
      row("st-tile-notif", ICON.bell, "Notifications", null, sw("st-notif", true)) +
      div("st-div2") +
      row("st-tile-dark", ICON.moon, "Dark mode", null, sw("st-dark", false)) +
      div("st-div3") +
      `<div class="st-row td-region" data-node="st-tile-lang" data-widget="ListTile">` +
        `<span class="st-ic td-region" data-node="st-lang-icon" data-widget="Icon">${ICON.globe}</span>` +
        `<span class="st-txcol"><b class="td-region" data-node="st-lang-title" data-widget="Text">Language</b></span>` +
        `<span class="st-lang-val td-region" data-node="st-lang-value" data-widget="Text">English</span>` +
      `</div>` +
    `</section>` +
    `<div class="st-group-label td-region" data-node="st-app-header" data-widget="Text">App</div>` +
    `<section class="st-group td-region" data-node="st-app-group" data-widget="Container">` +
      row("st-tile-appearance", ICON.moon, "Appearance", "System default", chev("st-tile-appearance")) +
      div("st-div5") +
      row("st-tile-storage", ICON.info, "Storage", "Manage downloads", chev("st-tile-storage")) +
      div("st-div6") +
      row("st-tile-access", ICON.person, "Accessibility", "Text size, contrast", chev("st-tile-access")) +
      div("st-div7") +
      row("st-tile-data", ICON.globe, "Data usage", "Wi-Fi only", sw("st-data", false)) +
    `</section>` +
    `<div class="st-group-label td-region" data-node="st-support-header" data-widget="Text">Support</div>` +
    `<section class="st-group td-region" data-node="st-support-group" data-widget="Container">` +
      row("st-tile-help", ICON.help, "Help & feedback", null, chev("st-tile-help")) +
      div("st-div4") +
      row("st-tile-rate", ICON.help, "Rate the app", null, chev("st-tile-rate")) +
      div("st-div8") +
      row("st-tile-about", ICON.info, "About", null, chev("st-tile-about")) +
      div("st-div10") +
      row("st-tile-policy", ICON.lock, "Privacy policy", null, chev("st-tile-policy")) +
      div("st-div11") +
      row("st-tile-terms", ICON.info, "Terms of service", null, chev("st-tile-terms")) +
    `</section>` +
  `</main></div>`;
}

function tdPhoneLogin() {
  const eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  return `${tdStatus(false)}<div class="lg-screen td-region" data-node="lg-scaffold" data-widget="Scaffold"><div class="lg-safe td-region" data-node="lg-safe" data-widget="SafeArea"><div class="lg-center td-region" data-node="lg-center" data-widget="Center"><div class="lg-form-pad td-region" data-node="lg-form-padding" data-widget="Padding"><div class="td-region" data-node="lg-form" data-widget="Form"><div class="lg-col td-region" data-node="lg-col" data-widget="Column"><div class="td-region" data-node="lg-header" data-widget="Column"><div class="lg-logo-ring td-region" data-node="lg-logo-ring" data-widget="Container"><span class="td-region" data-node="lg-logo" data-widget="Text">FF</span></div><b class="lg-title td-region" data-node="lg-title" data-widget="Text">Welcome back</b><span class="lg-subtitle td-region" data-node="lg-subtitle" data-widget="Text">Sign in to your account</span></div><div class="lg-field td-region" data-node="lg-email-field" data-widget="TextField"><span class="td-region" data-node="lg-email-icon" data-widget="Icon">${mail}</span><span class="td-region" data-node="lg-email-decoration" data-widget="InputDecoration">Email</span></div><div class="lg-field td-region" data-node="lg-pass-field" data-widget="TextField"><span class="td-region" data-node="lg-pass-icon" data-widget="Icon">${lock}</span><span class="td-region" data-node="lg-pass-decoration" data-widget="InputDecoration">Password</span><span class="lg-eye td-region" data-node="lg-eye" data-widget="IconButton">${eye}</span></div><div class="lg-forgot td-region" data-node="lg-forgot-align" data-widget="Align"><span class="td-region" data-node="lg-forgot" data-widget="TextButton">Forgot password?</span></div><div class="lg-login td-region" data-node="lg-login-btn" data-widget="ElevatedButton"><span>Log in</span></div><div class="lg-or td-region" data-node="lg-or-row" data-widget="Row"><span>or</span></div><div class="lg-google td-region" data-node="lg-google-btn" data-widget="OutlinedButton"><span class="lg-g">G</span><span>Continue with Google</span></div><div class="lg-signup-row td-region" data-node="lg-signup-row" data-widget="Row"><span class="td-region" data-node="lg-signup-text" data-widget="Text">Don't have an account?</span><span class="td-region" data-node="lg-signup-link" data-widget="GestureDetector"><b class="td-region" data-node="lg-signup-link-text" data-widget="Text">Sign up</b></span></div></div></div></div></div></div></div>`;
}
function tdPhoneYouTube() {
  const cast = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18v11H3z"/><path d="M3 9a8 8 0 0 1 8 8M3 13a4 4 0 0 1 4 4"/></svg>';
  const card = (one, thumb, title, channel, meta, avatar) => {
    const p = one ? "" : "-two";
    const q = one ? "-one" : "-two";
    return `<article class="yt-card td-region" data-node="yt-card${q}" data-widget="Card"><div class="yt-card-col td-region" data-node="yt-card${q}-col" data-widget="Column"><div class="yt-thumb td-region" data-node="yt-thumbnail${p}" data-widget="Stack" style="--thumb:${thumb}"><div class="yt-thumb-art td-region" data-node="yt-thumb-image${p}" data-widget="Image"><span class="yt-play">▶</span></div><span class="yt-duration td-region" data-node="yt-duration${p}" data-widget="Container"><span class="td-region" data-node="yt-duration-text${p}" data-widget="Text">${one ? "12:48" : "8:03"}</span></span></div><div class="yt-info td-region" data-node="yt-card${q}-info" data-widget="Row"><span class="yt-ch-avatar td-region" data-node="yt-channel-avatar${p}" data-widget="CircleAvatar">${avatar}</span><div class="yt-text td-region" data-node="yt-card${q}-text" data-widget="Column"><b class="td-region" data-node="yt-video-title${p}" data-widget="Text">${title}</b><div class="yt-channel-row${one ? " td-region" : ""}"${one ? ` data-node="yt-channel-row" data-widget="Row"` : ""}><span class="td-region" data-node="yt-channel-name${p}" data-widget="Text">${channel}</span>${one ? `<span class="td-region" data-node="yt-verified" data-widget="Icon">✓</span>` : ""}</div><span class="td-region" data-node="yt-video-meta${p}" data-widget="Text">${meta}</span></div><span class="yt-more td-region" data-node="yt-more${p}" data-widget="IconButton">⋮</span></div></div></article>`;
  };
  return `${tdStatus(false)}<div class="yt-screen td-region" data-node="yt-scaffold" data-widget="Scaffold"><header class="yt-bar td-region" data-node="yt-appbar" data-widget="AppBar"><span class="yt-logo-row td-region" data-node="yt-logo-row" data-widget="Row"><span class="yt-logo-icon td-region" data-node="yt-logo-icon" data-widget="Icon">▶</span><b class="td-region" data-node="yt-logo-text" data-widget="Text">YouTube</b></span><span class="yt-search td-region" data-node="yt-search" data-widget="IconButton">${TD_ICON.search}</span><span class="yt-cast td-region" data-node="yt-cast" data-widget="IconButton">${cast}</span><span class="yt-avatar td-region" data-node="yt-avatar" data-widget="CircleAvatar">DK</span></header><main class="yt-scroll td-region" data-node="yt-body" data-widget="ListView"><div class="yt-chips td-region" data-node="yt-chips-row" data-widget="Row"><span class="yt-chip on td-region" data-node="yt-chip-all" data-widget="Chip">All</span><span class="yt-chip td-region" data-node="yt-chip-music" data-widget="Chip">Music</span><span class="yt-chip td-region" data-node="yt-chip-flutter" data-widget="Chip">Flutter</span><span class="yt-chip td-region" data-node="yt-chip-gaming" data-widget="Chip">Gaming</span></div>${card(true, "linear-gradient(135deg,#1a73e8,#7b1fa2)", "Build a Flutter app in 20 minutes", "FlutterForward", "1.2M views • 3 days ago", "FF")}${card(false, "linear-gradient(135deg,#0f9d58,#00acc1)", "Dart null safety, explained simply", "Code with Dheeraj", "845K views • 1 week ago", "CD")}</main><nav class="yt-bottom td-region" data-node="yt-bottom" data-widget="BottomNavigationBar"><span class="yt-nav on td-region" data-node="yt-nav-home" data-widget="BottomNavigationBarItem">${TD_ICON.home}<span>Home</span></span><span class="yt-nav td-region" data-node="yt-nav-shorts" data-widget="BottomNavigationBarItem">${TD_ICON.reels}<span>Shorts</span></span><span class="yt-nav td-region" data-node="yt-nav-create" data-widget="BottomNavigationBarItem">${TD_ICON.plus}</span><span class="yt-nav td-region" data-node="yt-nav-subs" data-widget="BottomNavigationBarItem">${TD_ICON.video}<span>Subscriptions</span></span><span class="yt-nav td-region" data-node="yt-nav-you" data-widget="BottomNavigationBarItem">${TD_ICON.person}<span>You</span></span></nav></div>`;
}
function tdPhoneSpotify() {
  const bell = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15Z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>';
  const history = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 3"/></svg>';
  const gear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>';
  const speaker = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const library = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4v16M9 4v16M14 5v14l5-1V4l-5 1Z"/></svg>';
  const quick = (art, label, grad) => `<div class="sp-quick-card td-region" data-node="sp-card-one" data-widget="Card"><div class="sp-card-row td-region" data-node="sp-card-row" data-widget="Row"><span class="sp-card-art td-region" data-node="sp-card-art" data-widget="Image" style="background:${grad}">${art}</span><span class="td-region" data-node="sp-card-label" data-widget="Text">${label}</span></div></div>`;
  const recent = (art, name, artist, grad) => `<div class="sp-recent-card td-region" data-node="sp-recent-card" data-widget="Card"><div class="sp-recent-col td-region" data-node="sp-recent-col" data-widget="Column"><span class="sp-recent-art td-region" data-node="sp-recent-art" data-widget="Image" style="background:${grad}">${art}</span><b class="td-region" data-node="sp-recent-name" data-widget="Text">${name}</b><span class="td-region" data-node="sp-recent-artist" data-widget="Text">${artist}</span></div></div>`;
  const made = (art, name, desc, grad) => `<div class="sp-made-card td-region" data-node="sp-made-card" data-widget="Card"><div class="sp-made-col td-region" data-node="sp-made-col" data-widget="Column"><span class="sp-made-art td-region" data-node="sp-made-art" data-widget="Image" style="background:${grad}">${art}</span><b class="td-region" data-node="sp-made-name" data-widget="Text">${name}</b><span class="td-region" data-node="sp-made-desc" data-widget="Text">${desc}</span></div></div>`;
  return `${tdStatus(true)}<div class="sp-screen td-region" data-node="sp-scaffold" data-widget="Scaffold"><header class="sp-top td-region" data-node="sp-appbar" data-widget="AppBar"><b class="td-region" data-node="sp-greeting" data-widget="Text">Good evening</b><span class="sp-top-actions"><span class="td-region" data-node="sp-bell" data-widget="IconButton">${bell}</span><span class="td-region" data-node="sp-history" data-widget="IconButton">${history}</span><span class="td-region" data-node="sp-settings" data-widget="IconButton">${gear}</span></span></header><main class="sp-scroll td-region" data-node="sp-feed" data-widget="ListView"><div class="sp-chips td-region" data-node="sp-chips" data-widget="Row"><span class="sp-chip on td-region" data-node="sp-chip-all" data-widget="FilterChip">All</span><span class="sp-chip td-region" data-node="sp-chip-music" data-widget="FilterChip">Music</span><span class="sp-chip td-region" data-node="sp-chip-podcasts" data-widget="FilterChip">Podcasts</span></div><div class="sp-quick td-region" data-node="sp-quick-grid" data-widget="GridView">${quick('♥','Liked Songs','linear-gradient(135deg,#4b2bb3,#8d67d8)')}${quick('1','Daily Mix 1','linear-gradient(135deg,#b3541e,#e08a3c)')}${quick('✦','Discover Weekly','linear-gradient(135deg,#1e6f5c,#3cae8b)')}${quick('☾','Chill Hits','linear-gradient(135deg,#274b8f,#5b8fd6)')}${quick('50','Top 50 – Global','linear-gradient(135deg,#8f2440,#d65b7a)')}${quick('↗','Release Radar','linear-gradient(135deg,#5c5c5c,#9a9a9a)')}</div><h3 class="td-region" data-node="sp-recent-title" data-widget="Text">Recently played</h3><div class="sp-recent td-region" data-node="sp-recent-grid" data-widget="GridView">${recent('AH','After Hours','The Weeknd','linear-gradient(135deg,#c0392b,#e74c3c)')}${recent('FL','Future Nostalgia','Dua Lipa','linear-gradient(135deg,#8e44ad,#c07be0)')}${recent('÷','Divide','Ed Sheeran','linear-gradient(135deg,#2471a3,#5dade2)')}${recent('★','Starboy','The Weeknd','linear-gradient(135deg,#1a1a2e,#3d3d6b)')}</div><h3 class="td-region" data-node="sp-made-title" data-widget="Text">Made for you</h3><div class="sp-made td-region" data-node="sp-made-list" data-widget="ListView">${made('1','Daily Mix 1','The Weeknd, Dua Lipa and more','linear-gradient(135deg,#b3541e,#e08a3c)')}${made('2','Daily Mix 2','Ed Sheeran, Coldplay and more','linear-gradient(135deg,#1e6f5c,#3cae8b)')}${made('✦','Discover Weekly','Your weekly mixtape of fresh music','linear-gradient(135deg,#274b8f,#5b8fd6)')}${made('↻','On Repeat','Songs you can\u2019t get enough of','linear-gradient(135deg,#8f2440,#d65b7a)')}</div></main><div class="sp-player td-region" data-node="sp-player" data-widget="Container"><div class="sp-player-col td-region" data-node="sp-player-col" data-widget="Column"><div class="sp-player-row td-region" data-node="sp-player-row" data-widget="Row"><span class="sp-player-art td-region" data-node="sp-player-art" data-widget="ClipRRect"><span class="td-region" data-node="sp-player-img" data-widget="Image" style="background:linear-gradient(135deg,#c0392b,#e74c3c)">BL</span></span><span class="sp-player-info td-region" data-node="sp-player-info" data-widget="Column"><b class="td-region" data-node="sp-player-title" data-widget="Text">Blinding Lights</b><span class="td-region" data-node="sp-player-artist" data-widget="Text">The Weeknd</span></span><span class="td-region" data-node="sp-player-devices" data-widget="IconButton">${speaker}</span><span class="sp-play td-region" data-node="sp-player-play" data-widget="IconButton">❚❚</span></div><div class="sp-progress td-region" data-node="sp-player-progress" data-widget="LinearProgressIndicator"><i></i></div></div></div><nav class="sp-bottom td-region" data-node="sp-bottom" data-widget="BottomNavigationBar"><span class="sp-nav on td-region" data-node="sp-nav-home" data-widget="BottomNavigationBarItem">${TD_ICON.home}<span>Home</span></span><span class="sp-nav td-region" data-node="sp-nav-search" data-widget="BottomNavigationBarItem">${TD_ICON.search}<span>Search</span></span><span class="sp-nav td-region" data-node="sp-nav-library" data-widget="BottomNavigationBarItem">${library}<span>Your Library</span></span></nav></div>`;
}
function tdPhoneAmazon() {
  const mic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  const camera = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const cart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h10L20 8H7"/></svg>';
  const menu = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const chip = (id, label, active) => `<span class="am-chip${active ? " active" : ""} td-region" data-node="am-chip-${id}" data-widget="Chip"><span class="td-region" data-node="am-chip-${id}-text" data-widget="Text">${label}</span></span>`;
  const product = (name, stars, price, mrp, color) => `<article class="am-card td-region" data-node="am-product-card" data-widget="Card"><div class="td-region" data-node="am-product-column" data-widget="Column"><div class="am-pic td-region" data-node="am-product-image-clip" data-widget="ClipRRect"><div class="am-pic-in td-region" data-node="am-product-image" data-widget="Image" style="--prod:${color}"></div></div><div class="am-pbody td-region" data-node="am-product-padding" data-widget="Padding"><div class="td-region" data-node="am-product-details" data-widget="Column"><b class="td-region" data-node="am-product-title" data-widget="Text">${name}</b><span class="am-stars td-region" data-node="am-product-stars" data-widget="Row"><span class="td-region" data-node="am-product-rating" data-widget="Text">${stars}</span></span><span class="am-price-row td-region" data-node="am-product-price-row" data-widget="Row"><b class="td-region" data-node="am-product-price" data-widget="Text">${price}</b><span class="td-region" data-node="am-product-mrp" data-widget="Text">${mrp}</span></span><span class="am-prime td-region" data-node="am-prime-badge" data-widget="Container"><b class="td-region" data-node="am-prime-text" data-widget="Text">✓prime</b></span></div></div></div></article>`;
  return `${tdStatus(false)}<div class="am-screen td-region" data-node="am-scaffold" data-widget="Scaffold"><header class="am-bar td-region" data-node="am-appbar" data-widget="AppBar"><div class="am-search-row td-region" data-node="am-search-row" data-widget="Row"><div class="am-search-expanded td-region" data-node="am-search-expanded" data-widget="Expanded"><div class="am-search td-region" data-node="am-search-field" data-widget="TextField"><span class="td-region" data-node="am-search-icon" data-widget="Icon">${TD_ICON.search}</span><span class="td-region" data-node="am-search-hint" data-widget="Text">Search Amazon.in</span><span class="td-region" data-node="am-mic" data-widget="IconButton">${mic}</span><span class="td-region" data-node="am-camera" data-widget="IconButton">${camera}</span></div></div><span class="am-cart-stack td-region" data-node="am-cart-stack" data-widget="Stack"><span class="td-region" data-node="am-cart" data-widget="IconButton">${cart}</span><span class="am-badge td-region" data-node="am-cart-badge" data-widget="Positioned"><b class="td-region" data-node="am-cart-count" data-widget="Text">2</b></span></span></div></header><main class="am-scroll td-region" data-node="am-body" data-widget="ListView"><div class="am-location td-region" data-node="am-location-row" data-widget="Row"><span class="td-region" data-node="am-location-icon" data-widget="Icon">${TD_ICON.pin}</span><span class="td-region" data-node="am-location-text" data-widget="Text">Deliver to Dheeraj - Jaipur 302001</span><span class="td-region" data-node="am-location-chevron" data-widget="Icon">⌄</span></div><div class="am-chips td-region" data-node="am-chips" data-widget="ListView">${chip("deals", "Deals", true)}${chip("prime", "Prime", false)}${chip("electronics", "Electronics", false)}${chip("fashion", "Fashion", false)}${chip("grocery", "Grocery", false)}</div><div class="am-hero td-region" data-node="am-hero" data-widget="Card"><div class="am-hero-stack td-region" data-node="am-hero-stack" data-widget="Stack"><div class="am-hero-img td-region" data-node="am-hero-image" data-widget="Image"></div><div class="am-hero-copy td-region" data-node="am-hero-copy" data-widget="Column"><span class="td-region" data-node="am-hero-kicker" data-widget="Text">DEAL OF THE DAY</span><b class="td-region" data-node="am-hero-title" data-widget="Text">Up to 70% off | Headphones</b><span class="am-cta td-region" data-node="am-hero-cta" data-widget="ElevatedButton"><span class="td-region" data-node="am-hero-cta-text" data-widget="Text">Shop now</span></span></div></div></div><h3 class="am-section-title td-region" data-node="am-section-title" data-widget="Text">Best deals for you</h3><div class="am-grid td-region" data-node="am-grid" data-widget="GridView">${product("Wireless Earbuds Pro", "★★★★☆ 4.5", "₹1,499", "₹2,999", "linear-gradient(135deg,#3b6ea5,#7fb0d8)")}${product("Smart Watch Series 5", "★★★★★ 4.8", "₹2,799", "₹5,999", "linear-gradient(135deg,#4a4a55,#9a9aad)")}${product("Running Shoes", "★★★★☆ 4.3", "₹1,199", "₹2,499", "linear-gradient(135deg,#b34700,#f0903f)")}${product("Travel Backpack 32L", "★★★★☆ 4.6", "₹899", "₹1,799", "linear-gradient(135deg,#3f6b4f,#7fb08a)")}</div></main><nav class="am-bottom td-region" data-node="am-bottom" data-widget="BottomNavigationBar"><span class="am-nav td-region" data-node="am-nav-home" data-widget="Icon">${TD_ICON.home}<span>Home</span></span><span class="am-nav td-region" data-node="am-nav-account" data-widget="Icon">${TD_ICON.person}<span>Account</span></span><span class="am-nav td-region" data-node="am-nav-cart" data-widget="Icon">${cart}<span>Cart</span></span><span class="am-nav td-region" data-node="am-nav-menu" data-widget="Icon">${menu}<span>Menu</span></span></nav></div>`;
}
function tdPhoneGmail() {
  const tile = (n, initial, color, sender, subject, snippet, time, starred, attach, unread) =>
    `<article class="gm-tile${unread ? " unread" : ""} td-region" data-node="gm-tile-${n}" data-widget="ListTile">` +
    `<span class="gm-avatar td-region" data-node="gm-tile${n}-avatar" data-widget="CircleAvatar" style="--av:${color}">${initial}</span>` +
    `<span class="gm-tile-body td-region" data-node="gm-tile${n}-body" data-widget="Column">` +
    `<b class="td-region" data-node="gm-tile${n}-sender" data-widget="Text">${sender}</b>` +
    `<span class="td-region" data-node="gm-tile${n}-subject" data-widget="Text">${subject}</span>` +
    `<span class="td-region" data-node="gm-tile${n}-snippet" data-widget="Text">${snippet}</span></span>` +
    `<span class="gm-trail"><span class="td-region" data-node="gm-tile${n}-time" data-widget="Text">${time}</span>` +
    (attach ? `<span class="gm-attach td-region" data-node="gm-tile${n}-attach" data-widget="Icon">📎</span>` : ``) +
    `<span class="gm-star${starred ? " on" : ""} td-region" data-node="gm-tile${n}-star" data-widget="IconButton">${starred ? "★" : "☆"}</span></span></article>`;
  return `${tdStatus(false)}<div class="gm-screen td-region" data-node="gm-scaffold" data-widget="Scaffold">` +
  `<header class="gm-bar td-region" data-node="gm-appbar" data-widget="AppBar">` +
  `<span class="gm-menu td-region" data-node="gm-menu" data-widget="IconButton">☰</span>` +
  `<span class="gm-search td-region" data-node="gm-search-expanded" data-widget="Expanded"><span class="gm-search-inner td-region" data-node="gm-search-field" data-widget="TextField">${TD_ICON.search}<span>Search in mail</span></span></span>` +
  `<span class="gm-avatar me td-region" data-node="gm-avatar" data-widget="CircleAvatar" style="--av:#5b5bd6">D</span></header>` +
  `<main class="gm-scroll td-region" data-node="gm-body" data-widget="Column">` +
  `<div class="gm-label-row td-region" data-node="gm-label-row" data-widget="Row"><span class="td-region" data-node="gm-primary-label" data-widget="Text">Primary</span><span class="gm-count">12 new</span></div>` +
  `<div class="gm-list td-region" data-node="gm-inbox-list" data-widget="ListView">` +
`<div class="gm-dismiss td-region" data-node="gm-dismissible" data-widget="Dismissible">` +
`<span class="gm-dismiss-bg td-region" data-node="gm-dismiss-bg" data-widget="Container">` +
`<span class="gm-dismiss-bg-row td-region" data-node="gm-dismiss-bg-row" data-widget="Row">` +
`<span class="gm-dismiss-bg-icon td-region" data-node="gm-dismiss-bg-icon" data-widget="Icon">🗄</span>` +
`<span class="td-region" data-node="gm-dismiss-bg-label" data-widget="Text">Archive</span></span></span>` +
tile(1, "F", "#02569b", "FlutterForward", "Your 40-lesson Flutter course is live", "All lessons, quizzes and ranks in one place…", "9:41", true, false, true) +
`</div>` +
  tile(2, "R", "#188038", "RTU Kota", "Exam timetable: V Sem main exams", "Reporting 10:00 AM, first paper 27 Nov…", "8:15", false, true, false) +
  tile(3, "G", "#24292f", "GitHub", "[flutterlearn] New pull request #42", "Teardown: Gmail inbox mock ready for review", "Yesterday", false, false, false) +
  tile(4, "D", "#7c4dff", "Dheeraj Kumar", "Notes: Analysis of Algorithms PYQs", "AoA papers 2019–2024, topic-wise breakdown…", "Mon", false, false, false) +
  `</div></main>` +
  `<button class="gm-fab td-region" data-node="gm-fab" data-widget="FloatingActionButton">✎&nbsp;Compose</button></div>`;
}
function tdPhoneNetflix() {
  const trending = (initials, name, color) => `<div class="nf-card td-region" data-node="nf-trending-card" data-widget="Card"><div class="nf-poster td-region" data-node="nf-trending-poster" data-widget="Image" style="--poster:${color}">${initials}</div><span class="nf-card-name td-region" data-node="nf-trending-name" data-widget="Text">${name}</span></div>`;
  const top10 = (rank, initials, color) => `<div class="nf-top10-card td-region" data-node="nf-top10-card" data-widget="Row"><b class="nf-rank td-region" data-node="nf-top10-rank" data-widget="Text">${rank}</b><div class="nf-poster nf-poster-top10 td-region" data-node="nf-top10-poster" data-widget="Image" style="--poster:${color}">${initials}</div></div>`;
  const cont = (initials, name, time, color, pct) => `<div class="nf-cw-card td-region" data-node="nf-continue-card" data-widget="Column"><div class="nf-poster nf-poster-cw td-region" data-node="nf-continue-poster" data-widget="Image" style="--poster:${color}">${initials}</div><div class="nf-progress td-region" data-node="nf-continue-progress" data-widget="LinearProgressIndicator"><i style="width:${pct}%"></i></div><span class="nf-cw-info td-region" data-node="nf-continue-info" data-widget="Row"><span class="td-region" data-node="nf-continue-name" data-widget="Text">${name}</span><span class="td-region" data-node="nf-continue-time" data-widget="Text">${time}</span></span></div>`;
  const downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>';
  return `${tdStatus(false)}<div class="nf-screen td-region" data-node="nf-scaffold" data-widget="Scaffold"><main class="nf-scroll td-region" data-node="nf-body" data-widget="ListView"><header class="nf-topbar td-region" data-node="nf-appbar" data-widget="AppBar"><b class="nf-logo td-region" data-node="nf-logo" data-widget="Text">NETFLIX</b><span class="nf-search td-region" data-node="nf-search-btn" data-widget="IconButton">${TD_ICON.search}</span><span class="nf-avatar td-region" data-node="nf-avatar" data-widget="CircleAvatar">D</span></header><section class="nf-hero td-region" data-node="nf-hero" data-widget="Stack"><div class="nf-hero-img td-region" data-node="nf-hero-image" data-widget="Image">ST</div><div class="nf-hero-shade td-region" data-node="nf-hero-gradient" data-widget="Container"></div><div class="nf-hero-copy td-region" data-node="nf-hero-content" data-widget="Column"><b class="nf-hero-title td-region" data-node="nf-hero-title" data-widget="Text">STRANGER<br>THINGS</b><span class="nf-genres td-region" data-node="nf-hero-genres" data-widget="Row"><span class="td-region" data-node="nf-genre-1" data-widget="Text">Sci-Fi</span><i>·</i><span class="td-region" data-node="nf-genre-2" data-widget="Text">Drama</span><i>·</i><span class="td-region" data-node="nf-genre-3" data-widget="Text">Thriller</span></span><div class="nf-hero-actions td-region" data-node="nf-hero-actions" data-widget="Row"><span class="nf-play td-region" data-node="nf-play" data-widget="ElevatedButton"><span class="td-region" data-node="nf-play-icon" data-widget="Icon">▶</span><span class="td-region" data-node="nf-play-label" data-widget="Text">Play</span></span><span class="nf-mylist td-region" data-node="nf-mylist" data-widget="OutlinedButton"><span class="td-region" data-node="nf-mylist-label" data-widget="Text">＋ My List</span></span></div></div></section><section class="nf-row-sec td-region" data-node="nf-trending-section" data-widget="Column"><h3 class="nf-sec-title td-region" data-node="nf-trending-title" data-widget="Text">Trending Now</h3><div class="nf-row td-region" data-node="nf-trending-row" data-widget="ListView">${trending('SG','Squid Game','#0d6e4f')}${trending('W','Wednesday','#3a3a6e')}${trending('MH','Money Heist','#8a1f1f')}${trending('TC','The Crown','#6e5a1f')}</div></section><section class="nf-row-sec td-region" data-node="nf-top10-section" data-widget="Column"><h3 class="nf-sec-title td-region" data-node="nf-top10-title" data-widget="Text">Top 10 TV Shows Today</h3><div class="nf-row td-region" data-node="nf-top10-row" data-widget="ListView">${top10('1','ST','#7a1f2b')}${top10('2','W','#2b3a6e')}${top10('3','MH','#8a2f1f')}</div></section><section class="nf-row-sec td-region" data-node="nf-continue-section" data-widget="Column"><h3 class="nf-sec-title td-region" data-node="nf-continue-title" data-widget="Text">Continue Watching</h3><div class="nf-row td-region" data-node="nf-continue-row" data-widget="ListView">${cont('BB','Breaking Bad','32m left','#1f4d2b','62')}${cont('D','Dark','18m left','#1f2b4d','35')}</div></section></main><nav class="nf-bottom td-region" data-node="nf-bottom" data-widget="BottomNavigationBar"><span class="nf-nav on td-region" data-node="nf-nav-home" data-widget="BottomNavigationBarItem">${TD_ICON.home}<span>Home</span></span><span class="nf-nav td-region" data-node="nf-nav-search" data-widget="BottomNavigationBarItem">${TD_ICON.search}<span>Search</span></span><span class="nf-nav td-region" data-node="nf-nav-coming" data-widget="BottomNavigationBarItem">${TD_ICON.video}<span>Coming Soon</span></span><span class="nf-nav td-region" data-node="nf-nav-downloads" data-widget="BottomNavigationBarItem">${downloadIcon}<span>Downloads</span></span><span class="nf-nav td-region" data-node="nf-nav-more" data-widget="BottomNavigationBarItem"><span class="nf-more">☰</span><span>More</span></span></nav></div>`;
}
function tdPhoneCalculator() {
  const keys = [
    ["ac", "AC", "fn"], ["lparen", "(", "fn"], ["rparen", ")", "fn"], ["div", "÷", "op"],
    ["7", "7", "digit"], ["8", "8", "digit"], ["9", "9", "digit"], ["mul", "×", "op"],
    ["4", "4", "digit"], ["5", "5", "digit"], ["6", "6", "digit"], ["sub", "−", "op"],
    ["1", "1", "digit"], ["2", "2", "digit"], ["3", "3", "digit"], ["add", "+", "op"],
    ["0", "0", "digit"], ["dot", ".", "digit"], ["del", "⌫", "fn"], ["eq", "=", "eq"]
  ];
  const key = ([suffix, label, kind]) => `<div class="calc-key td-region" data-node="calc-key-${suffix}" data-widget="AspectRatio"><button class="calc-keybtn ${kind} td-region" data-node="calc-keybtn-${suffix}" data-widget="ElevatedButton"><span class="td-region" data-node="calc-keytext-${suffix}" data-widget="Text">${label}</span></button></div>`;
  return `${tdStatus(false)}<div class="calc-screen td-region" data-node="calc-scaffold" data-widget="Scaffold"><div class="calc-body td-region" data-node="calc-body" data-widget="Column"><div class="calc-display td-region" data-node="calc-display" data-widget="Expanded"><div class="calc-display-col td-region" data-node="calc-display-col" data-widget="Column"><span class="calc-history td-region" data-node="calc-history" data-widget="Text">128 × 45</span><div class="calc-fit td-region" data-node="calc-display-fit" data-widget="FittedBox"><span class="td-region" data-node="calc-display-text" data-widget="Text">128 × 45 + 3,592 − 128 ÷ 4</span></div><span class="calc-result td-region" data-node="calc-result" data-widget="Text">= 9,320</span></div></div><div class="calc-keys td-region" data-node="calc-keys" data-widget="GridView">${keys.map(key).join("")}</div></div></div>`;
}
function tdPhoneNotes() {
  const note = (n, title, body, chip) => `<article class="nt-note td-region" data-node="nt-note-${n}" data-widget="InkWell"><div class="nt-card td-region" data-node="nt-card-${n}" data-widget="Card"><div class="nt-card-col td-region" data-node="nt-card-${n}-col" data-widget="Column"><b class="td-region" data-node="nt-note-${n}-title" data-widget="Text">${title}</b><span class="td-region" data-node="nt-note-${n}-body" data-widget="Text">${body}</span>${chip ? `<span class="nt-labels td-region" data-node="nt-note-${n}-labels" data-widget="Row"><span class="nt-chip td-region" data-node="nt-note-${n}-chip" data-widget="Chip">${chip}</span></span>` : ""}</div></div></article>`;
  return `${tdStatus(false)}<div class="nt-screen td-region" data-node="nt-scaffold" data-widget="Scaffold"><main class="nt-scroll td-region" data-node="nt-body" data-widget="Column"><div class="nt-search td-region" data-node="nt-search" data-widget="SearchBar"><span class="td-region" data-node="nt-search-menu" data-widget="Icon">☰</span><span class="td-region" data-node="nt-search-hint" data-widget="Text">Search your notes</span><span class="nt-avatar td-region" data-node="nt-search-avatar" data-widget="CircleAvatar">DK</span></div><div class="nt-notes-expanded td-region" data-node="nt-notes-expanded" data-widget="Expanded"><div class="nt-grid td-region" data-node="nt-notes-grid" data-widget="GridView">${note(1, "Flutter ideas", "Teardown picker: search by widget name, not by app.", "Ideas")}${note(2, "Shopping list", "Milk · Eggs · Bread · Coffee", "")}${note(3, "Meeting notes", "Ship the 40-lesson course first. Certificates come last.", "")}${note(4, "Book to read", "The Design of Everyday Things — ch. 1–3", "")}</div></div></main><div class="nt-bottom-wrap"><div class="nt-bottom td-region" data-node="nt-bottom" data-widget="BottomAppBar"><span class="td-region" data-node="nt-act-check" data-widget="IconButton">☑</span><span class="td-region" data-node="nt-act-draw" data-widget="IconButton">✎</span><span class="nt-notch-gap"></span><span class="td-region" data-node="nt-act-mic" data-widget="IconButton">🎙</span><span class="td-region" data-node="nt-act-image" data-widget="IconButton">🖼</span></div><nav class="nt-nav td-region" data-node="nt-nav" data-widget="NavigationBar"><span class="nt-dest on td-region" data-node="nt-nav-notes" data-widget="NavigationDestination">💡<span>Notes</span></span><span class="nt-dest td-region" data-node="nt-nav-reminders" data-widget="NavigationDestination">🔔<span>Reminders</span></span></nav><span class="nt-fab td-region" data-node="nt-fab" data-widget="FloatingActionButton"><span class="td-region" data-node="nt-fab-icon" data-widget="Icon">${TD_ICON.plus}</span></span></div></div>`;
}
function tdPhoneTasks() {
  const task = (n, title, meta) => `<div class="tk-task td-region" data-node="tk-task-${n}" data-widget="Dismissible"><div class="tk-row td-region" data-node="tk-row-${n}" data-widget="Row"><span class="tk-check td-region" data-node="tk-check-${n}" data-widget="Checkbox"></span><div class="tk-task-col td-region" data-node="tk-task-${n}-col" data-widget="Column"><b class="td-region" data-node="tk-task-${n}-title" data-widget="Text">${title}</b><span class="td-region" data-node="tk-task-${n}-meta" data-widget="Text">${meta}</span></div><span class="tk-drag td-region" data-node="tk-drag-${n}" data-widget="Icon">⋮⋮</span></div></div>`;
  return `${tdStatus(false)}<div class="tk-screen td-region" data-node="tk-scaffold" data-widget="Scaffold"><header class="tk-bar td-region" data-node="tk-appbar" data-widget="AppBar"><span class="td-region" data-node="tk-menu" data-widget="IconButton">☰</span><b class="td-region" data-node="tk-title" data-widget="Text">My Tasks</b><span class="tk-bar-actions"><span class="td-region" data-node="tk-sort" data-widget="IconButton">⇅</span><span class="td-region" data-node="tk-more" data-widget="IconButton">⋮</span></span></header><main class="tk-scroll td-region" data-node="tk-body" data-widget="Column"><div class="tk-list-wrap td-region" data-node="tk-list-expanded" data-widget="Expanded"><div class="tk-list td-region" data-node="tk-list" data-widget="ReorderableListView">${task(1, "Buy Flutter course notes", "Today • Personal")}${task(2, "Finish AoA assignment", "Tomorrow • College")}${task(3, "Call mom", "Fri • Personal")}</div></div><div class="tk-divider td-region" data-node="tk-completed-divider" data-widget="Divider"></div><span class="tk-completed-title td-region" data-node="tk-completed-title" data-widget="Text">Completed (1)</span><div class="tk-done-row td-region" data-node="tk-done-row" data-widget="Row"><span class="tk-check on td-region" data-node="tk-check-done" data-widget="Checkbox">✓</span><span class="tk-done-text td-region" data-node="tk-done-text" data-widget="Text">Submit lab record</span></div></main><div class="tk-snack td-region" data-node="tk-snackbar" data-widget="SnackBar"><span class="td-region" data-node="tk-snack-text" data-widget="Text">Task deleted</span><span class="td-region" data-node="tk-snack-undo" data-widget="TextButton">Undo</span></div><div class="tk-add td-region" data-node="tk-add-row" data-widget="Row"><span class="td-region" data-node="tk-add-field" data-widget="TextField">Add a task</span><span class="td-region" data-node="tk-add-btn" data-widget="IconButton">${TD_ICON.send}</span></div></div>`;
}
function tdPhoneGmailCompose() {
  const clip = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m21 12-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 4.5a3.7 3.7 0 0 1 5.2 5.2l-8.2 8.2a1.8 1.8 0 0 1-2.6-2.6L14.5 8"/></svg>';
  const person = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3"/><path d="M5 20c1-4 3-6 7-6s6 2 7 6"/></svg>';
  return `${tdStatus(false)}<div class="gc-screen td-region" data-node="gc-scaffold" data-widget="Scaffold">` +
  `<header class="gc-bar td-region" data-node="gc-appbar" data-widget="AppBar">` +
  `<span class="gc-close td-region" data-node="gc-close" data-widget="IconButton">✕</span>` +
  `<b class="gc-title td-region" data-node="gc-title" data-widget="Text">Compose</b>` +
  `<span class="gc-action td-region" data-node="gc-attach" data-widget="IconButton">${clip}</span>` +
  `<span class="gc-send td-region" data-node="gc-send" data-widget="IconButton">${TD_ICON.send}</span></header>` +
  `<form class="gc-form td-region" data-node="gc-form" data-widget="Form"><main class="gc-scroll td-region" data-node="gc-scroll" data-widget="SingleChildScrollView">` +
  `<div class="gc-fields td-region" data-node="gc-fields" data-widget="Column">` +
  `<div class="gc-field td-region" data-node="gc-to-field" data-widget="TextFormField">` +
  `<div class="gc-decor td-region" data-node="gc-to-decoration" data-widget="InputDecoration"><span class="gc-to-icon td-region" data-node="gc-to-icon" data-widget="Icon">${person}</span><span class="gc-label">To</span><span class="gc-hint">Add recipients</span></div>` +
  `<span class="gc-error td-region" data-node="gc-to-error" data-widget="Text">Enter at least one recipient</span></div>` +
  `<div class="gc-divider td-region" data-node="gc-to-divider" data-widget="Divider"></div>` +
  `<div class="gc-cc-row td-region" data-node="gc-cc-row" data-widget="Row"><span class="gc-cc td-region" data-node="gc-cc" data-widget="TextButton">Cc</span><span class="gc-cc td-region" data-node="gc-bcc" data-widget="TextButton">Bcc</span></div>` +
  `<div class="gc-field td-region" data-node="gc-subject-field" data-widget="TextFormField"><div class="gc-decor td-region" data-node="gc-subject-decoration" data-widget="InputDecoration"><span class="gc-label">Subject</span></div></div>` +
  `<div class="gc-divider td-region" data-node="gc-subject-divider" data-widget="Divider"></div>` +
  `<div class="gc-field body td-region" data-node="gc-body-field" data-widget="TextFormField"><div class="gc-decor plain td-region" data-node="gc-body-decoration" data-widget="InputDecoration"><span class="gc-hint">Compose email</span></div><p class="gc-draft">Hi everyone,<br><br>Sharing the Flutter notes from today's session — the widget tree is attached.</p></div>` +
  `</div></main></form>` +
  `<div class="gc-snackbar td-region" data-node="gc-snackbar" data-widget="SnackBar"><span class="td-region" data-node="gc-snackbar-text" data-widget="Text">Message sent</span><span class="gc-undo td-region" data-node="gc-snackbar-undo" data-widget="TextButton">Undo</span></div></div>`;
}

function tdPhoneSpotifyPlayer() {
  const chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>';
  const speaker = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const shuffle = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h4l10 12h4m0 0-3-3m3 3-3 3M3 18h4l2.5-3M13.5 9 17 6h4m0 0-3-3m3 3-3 3"/></svg>';
  const prev = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>';
  const next = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>';
  const repeat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>';
  const share = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"/></svg>';
  const queue = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 11h10M4 16h7"/><path d="m17 13 4 3-4 3"/></svg>';
  return `${tdStatus(false)}<div class="spp-screen td-region" data-node="spp-scaffold" data-widget="Scaffold">` +
  `<header class="spp-bar td-region" data-node="spp-appbar" data-widget="AppBar">` +
  `<span class="spp-collapse td-region" data-node="spp-collapse" data-widget="IconButton">${chev}</span>` +
  `<span class="spp-appbar-title td-region" data-node="spp-appbar-title" data-widget="Column"><span class="spp-context td-region" data-node="spp-context" data-widget="Text">PLAYING FROM PLAYLIST</span><b class="td-region" data-node="spp-playlist" data-widget="Text">Liked Songs</b></span>` +
  `<span class="spp-more td-region" data-node="spp-more" data-widget="IconButton">⋮</span></header>` +
  `<main class="spp-player td-region" data-node="spp-player" data-widget="AnimatedContainer">` +
  `<div class="spp-content td-region" data-node="spp-content" data-widget="Column">` +
  `<div class="spp-art-wrap td-region" data-node="spp-art-hero" data-widget="Hero"><div class="spp-art td-region" data-node="spp-art" data-widget="Image">BL</div></div>` +
  `<div class="spp-title-row td-region" data-node="spp-title-row" data-widget="Row"><span class="spp-song-info td-region" data-node="spp-song-info" data-widget="Column"><b class="td-region" data-node="spp-song-title" data-widget="Text">Blinding Lights</b><span class="td-region" data-node="spp-artist" data-widget="Text">The Weeknd</span></span><span class="spp-like td-region" data-node="spp-like" data-widget="IconButton">♥</span></div>` +
  `<div class="spp-seek-row td-region" data-node="spp-seek-row" data-widget="Row"><span class="td-region" data-node="spp-elapsed" data-widget="Text">1:24</span><span class="spp-seek-expanded td-region" data-node="spp-seek-expanded" data-widget="Expanded"><span class="spp-seek td-region" data-node="spp-seek" data-widget="Slider"><i style="width:42%"></i><b></b></span></span><span class="td-region" data-node="spp-total" data-widget="Text">3:20</span></div>` +
  `<div class="spp-controls td-region" data-node="spp-controls" data-widget="Row"><span class="spp-ctl td-region" data-node="spp-shuffle" data-widget="IconButton">${shuffle}</span><i class="spp-spacer td-region" data-node="spp-spacer-1" data-widget="Spacer"></i><span class="spp-ctl td-region" data-node="spp-prev" data-widget="IconButton">${prev}</span><span class="spp-play td-region" data-node="spp-play" data-widget="IconButton">❚❚</span><span class="spp-ctl td-region" data-node="spp-next" data-widget="IconButton">${next}</span><i class="spp-spacer td-region" data-node="spp-spacer-2" data-widget="Spacer"></i><span class="spp-ctl td-region" data-node="spp-repeat" data-widget="IconButton">${repeat}</span></div>` +
  `<div class="spp-bottom-row td-region" data-node="spp-bottom-row" data-widget="Row"><span class="spp-ctl td-region" data-node="spp-devices" data-widget="IconButton">${speaker}</span><i class="spp-spacer td-region" data-node="spp-spacer-3" data-widget="Spacer"></i><span class="spp-ctl td-region" data-node="spp-share" data-widget="IconButton">${share}</span><span class="spp-ctl td-region" data-node="spp-queue" data-widget="IconButton">${queue}</span></div>` +
  `</div></main></div>`;
}

function tdPhoneYouTubePlayer() {
  const cast = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18v11H3z"/><path d="M3 9a8 8 0 0 1 8 8M3 13a4 4 0 0 1 4 4"/></svg>';
  const share = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/></svg>';
  const download = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>';
  const comment = (word, initial, color, name, text) =>
    `<div class="yp-comment td-region" data-node="yp-comment-${word}" data-widget="Row"><span class="yp-c-avatar td-region" data-node="yp-comment-${word}-avatar" data-widget="CircleAvatar" style="--av:${color}">${initial}</span><span class="yp-c-body td-region" data-node="yp-comment-${word}-body" data-widget="Column"><b class="td-region" data-node="yp-comment-${word}-name" data-widget="Text">${name}</b><span class="td-region" data-node="yp-comment-${word}-text" data-widget="Text">${text}</span></span></div>`;
  const upnext = (word, title, meta, grad) =>
    `<article class="yp-up-card td-region" data-node="yp-upnext-card${word === "two" ? "-two" : ""}" data-widget="Card"><div class="yp-up-row td-region" data-node="yp-upnext-row${word === "two" ? "-two" : ""}" data-widget="Row"><span class="yp-up-thumb td-region" data-node="yp-upnext-thumb${word === "two" ? "-two" : ""}" data-widget="Image" style="background:${grad}">▶</span><span class="yp-up-col td-region" data-node="yp-upnext-col${word === "two" ? "-two" : ""}" data-widget="Column"><b class="td-region" data-node="yp-upnext-name${word === "two" ? "-two" : ""}" data-widget="Text">${title}</b><span class="td-region" data-node="yp-upnext-meta${word === "two" ? "-two" : ""}" data-widget="Text">${meta}</span></span></div></article>`;
  return `${tdStatus(false)}<div class="yp-screen td-region" data-node="yp-scaffold" data-widget="Scaffold"><header class="yp-bar td-region" data-node="yp-appbar" data-widget="AppBar"><span class="yp-back td-region" data-node="yp-back" data-widget="IconButton">${TD_ICON.back}</span><span class="yp-bar-spacer"></span><span class="yp-cast td-region" data-node="yp-cast" data-widget="IconButton">${cast}</span><span class="yp-more td-region" data-node="yp-more" data-widget="IconButton">⋮</span></header><main class="yp-scroll td-region" data-node="yp-layout" data-widget="LayoutBuilder"><div class="yp-body td-region" data-node="yp-body" data-widget="Column"><div class="yp-video td-region" data-node="yp-video-area" data-widget="AspectRatio"><div class="yp-video-stack td-region" data-node="yp-video-stack" data-widget="Stack"><div class="yp-frame td-region" data-node="yp-video-frame" data-widget="Image"></div><div class="yp-buffer-wrap td-region" data-node="yp-buffer-wrap" data-widget="Center"><span class="yp-spinner td-region" data-node="yp-buffer" data-widget="CircularProgressIndicator"></span></div><div class="yp-controls td-region" data-node="yp-controls-align" data-widget="Align"><div class="yp-controls-row td-region" data-node="yp-controls-row" data-widget="Row"><span class="yp-ctl td-region" data-node="yp-play-pause" data-widget="IconButton">❚❚</span><span class="yp-ctl td-region" data-node="yp-next" data-widget="IconButton">⏭</span><span class="yp-time td-region" data-node="yp-time" data-widget="Text">4:32 / 12:48</span><span class="yp-ctl td-region" data-node="yp-fullscreen" data-widget="IconButton">⛶</span></div></div></div></div><div class="yp-seek-row td-region" data-node="yp-seek-row" data-widget="Row"><span class="yp-seek-time td-region" data-node="yp-current" data-widget="Text">4:32</span><span class="yp-seek-expanded td-region" data-node="yp-seek-expanded" data-widget="Expanded"><span class="yp-slider td-region" data-node="yp-seek" data-widget="Slider"><i style="width:36%"></i><b></b></span></span><span class="yp-seek-time td-region" data-node="yp-total" data-widget="Text">12:48</span></div><h3 class="yp-title td-region" data-node="yp-title" data-widget="Text">Build a Flutter app in 20 minutes</h3><div class="yp-channel td-region" data-node="yp-channel-row" data-widget="Row"><span class="yp-avatar td-region" data-node="yp-avatar" data-widget="CircleAvatar">FF</span><span class="yp-channel-col td-region" data-node="yp-channel-col" data-widget="Column"><b class="td-region" data-node="yp-channel-name" data-widget="Text">FlutterForward</b><span class="td-region" data-node="yp-channel-subs" data-widget="Text">1.2M subscribers</span></span><span class="yp-sub td-region" data-node="yp-subscribe" data-widget="ElevatedButton"><span class="td-region" data-node="yp-subscribe-label" data-widget="Text">Subscribe</span></span></div><div class="yp-actions td-region" data-node="yp-actions-row" data-widget="Row"><span class="yp-act td-region" data-node="yp-like" data-widget="IconButton">👍</span><span class="yp-like-count td-region" data-node="yp-like-count" data-widget="Text">12K</span><span class="yp-tip-wrap td-region" data-node="yp-share-tip" data-widget="Tooltip"><span class="yp-tip-bubble">Share</span><span class="td-region" data-node="yp-share" data-widget="IconButton">${share}</span></span><span class="yp-act td-region" data-node="yp-download" data-widget="IconButton">${download}</span><span class="yp-act td-region" data-node="yp-save" data-widget="IconButton">🔖</span></div><section class="yp-sheet td-region" data-node="yp-comments-sheet" data-widget="BottomSheet"><div class="yp-sheet-col td-region" data-node="yp-sheet-col" data-widget="Column"><span class="yp-handle td-region" data-node="yp-sheet-handle" data-widget="Container"></span><div class="yp-sheet-header td-region" data-node="yp-sheet-header" data-widget="Row"><b class="td-region" data-node="yp-sheet-title" data-widget="Text">Comments • 1.2K</b><span class="yp-close td-region" data-node="yp-sheet-close" data-widget="IconButton">✕</span></div>${comment("one", "A", "#1a73e8", "@aarav.codes", "The diagrams in this one finally made state click for me.")}${comment("two", "P", "#0f9d58", "@priya.builds", "Watching this twice — once to learn, once to build along.")}</div></section><h3 class="yp-up-title td-region" data-node="yp-upnext-title" data-widget="Text">Up next</h3><div class="yp-up-list td-region" data-node="yp-upnext-list" data-widget="ListView">${upnext("one", "Dart null safety, explained simply", "Code with Dheeraj • 845K views • 1 week ago", "linear-gradient(135deg,#0f9d58,#00acc1)")}${upnext("two", "Flutter widgets every beginner must know", "FlutterForward • 2.1M views • 2 weeks ago", "linear-gradient(135deg,#1a73e8,#7b1fa2)")}</div></div></main></div>`;
}

function tdPhoneNetflixDetail() {
  const downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11m0 0 5-5m-5 5-5-5"/><path d="M4 20h16"/></svg>';
  const episode = (word, initials, title, desc, time, grad) =>
    `<article class="nd-ep-card td-region" data-node="nd-episode-${word}" data-widget="Card"><div class="nd-ep-row td-region" data-node="nd-episode-${word}-row" data-widget="Row"><span class="nd-ep-thumb td-region" data-node="nd-episode-${word}-thumb" data-widget="Image" style="background:${grad}">${initials}</span><span class="nd-ep-col td-region" data-node="nd-episode-${word}-col" data-widget="Column"><b class="td-region" data-node="nd-episode-${word}-title" data-widget="Text">${title}</b><span class="td-region" data-node="nd-episode-${word}-desc" data-widget="Text">${desc}</span><span class="td-region" data-node="nd-episode-${word}-time" data-widget="Text">${time}</span></span><span class="nd-ep-dl td-region" data-node="nd-episode-${word}-download" data-widget="IconButton">${downloadIcon}</span></div></article>`;
  return `${tdStatus(false)}<div class="nd-screen td-region" data-node="nd-scaffold" data-widget="Scaffold"><header class="nd-bar td-region" data-node="nd-appbar" data-widget="AppBar"><span class="nd-back td-region" data-node="nd-back" data-widget="IconButton">${TD_ICON.back}</span><span class="nd-bar-spacer"></span><span class="nd-search td-region" data-node="nd-search" data-widget="IconButton">${TD_ICON.search}</span><span class="nd-more td-region" data-node="nd-more" data-widget="IconButton">⋮</span></header><main class="nd-scroll td-region" data-node="nd-body" data-widget="SingleChildScrollView"><div class="nd-content td-region" data-node="nd-content" data-widget="Column"><section class="nd-hero td-region" data-node="nd-backdrop-stack" data-widget="Stack"><div class="nd-backdrop td-region" data-node="nd-switcher" data-widget="AnimatedSwitcher"><span class="nd-backdrop-art td-region" data-node="nd-backdrop" data-widget="Image">ST</span></div><div class="nd-shade td-region" data-node="nd-backdrop-shade" data-widget="Container"></div><div class="nd-hero-copy td-region" data-node="nd-backdrop-content" data-widget="Column"><b class="nd-title td-region" data-node="nd-title" data-widget="Text">Stranger Things</b><span class="nd-match td-region" data-node="nd-match" data-widget="RichText"><b class="nd-match-green">98% Match</b><span>  2024  </span><span class="nd-match-dim">2 Seasons</span></span><div class="nd-chips td-region" data-node="nd-genres" data-widget="Wrap"><span class="nd-chip td-region" data-node="nd-chip-scifi" data-widget="Chip">Sci-Fi</span><span class="nd-chip td-region" data-node="nd-chip-drama" data-widget="Chip">Drama</span><span class="nd-chip td-region" data-node="nd-chip-thriller" data-widget="Chip">Thriller</span><span class="nd-chip td-region" data-node="nd-chip-horror" data-widget="Chip">Horror</span><span class="nd-chip td-region" data-node="nd-chip-mystery" data-widget="Chip">Mystery</span><span class="nd-chip td-region" data-node="nd-chip-supernatural" data-widget="Chip">Supernatural</span></div><div class="nd-actions td-region" data-node="nd-actions" data-widget="Row"><span class="nd-play td-region" data-node="nd-play" data-widget="ElevatedButton"><span class="td-region" data-node="nd-play-icon" data-widget="Icon">▶</span><span class="td-region" data-node="nd-play-label" data-widget="Text">Play</span></span><span class="nd-mylist td-region" data-node="nd-mylist" data-widget="OutlinedButton"><span class="td-region" data-node="nd-mylist-label" data-widget="Text">＋ My List</span></span><span class="nd-dl td-region" data-node="nd-download" data-widget="IconButton">${downloadIcon}</span></div></div></section><div class="nd-tabs td-region" data-node="nd-tabs" data-widget="TabBar"><span class="nd-tab on td-region" data-node="nd-tab-episodes" data-widget="Tab">Episodes</span><span class="nd-tab td-region" data-node="nd-tab-trailers" data-widget="Tab">Trailers</span><span class="nd-tab td-region" data-node="nd-tab-more" data-widget="Tab">More Like This</span></div><div class="nd-tabview td-region" data-node="nd-tabview" data-widget="TabBarView"><div class="nd-episodes td-region" data-node="nd-episodes-page" data-widget="Column">${episode("one", "S1", "Chapter One: The Vanishing", "A boy vanishes on his way home, and the town starts asking questions.", "49m", "linear-gradient(135deg,#7a1f2b,#2b0a12)")}${episode("two", "S2", "Chapter Two: The Weirdo", "A strange girl with a shaved head appears at the diner.", "55m", "linear-gradient(135deg,#1f2b4d,#0a122b)")}</div><div class="nd-page-next td-region" data-node="nd-trailers-page" data-widget="Column"><div class="nd-trailer-thumb td-region" data-node="nd-trailer-thumb" data-widget="Stack"><div class="nd-trailer-image td-region" data-node="nd-trailer-image" data-widget="Image"></div><span class="td-region" data-node="nd-trailer-play" data-widget="Icon">▶</span></div><span class="td-region" data-node="nd-trailer-title" data-widget="Text">Official Trailer</span></div><div class="nd-page-next td-region" data-node="nd-more-page" data-widget="Column"><div class="td-region" data-node="nd-more-one" data-widget="Card"><div class="td-region" data-node="nd-more-one-row" data-widget="Row"><span class="td-region" data-node="nd-more-one-poster" data-widget="Image"></span><span class="td-region" data-node="nd-more-one-name" data-widget="Text">Dark</span></div></div><div class="td-region" data-node="nd-more-two" data-widget="Card"><div class="td-region" data-node="nd-more-two-row" data-widget="Row"><span class="td-region" data-node="nd-more-two-poster" data-widget="Image"></span><span class="td-region" data-node="nd-more-two-name" data-widget="Text">Wednesday</span></div></div></div></div></div></main></div>`;
}

function tdPhoneAmazonProduct(showGallery) {
  const cart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h10L20 8H7"/></svg>';
  const share = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-3.8M8.6 13.4l6.8 3.8"/></svg>';
  const chip = (n, label) => `<span class="ap-fchip td-region" data-node="ap-chip-${n}" data-widget="Chip"><span class="td-region" data-node="ap-chip-text-${n}" data-widget="Text">${label}</span></span>`;
  if (showGallery) {
    return `${tdStatus(false)}<div class="ap-screen ap-gallery-screen td-region" data-node="ap-gallery" data-widget="Scaffold"><header class="ap-gal-bar td-region" data-node="ap-gallery-appbar" data-widget="AppBar"><span class="ap-gal-close td-region" data-node="ap-gallery-close" data-widget="IconButton">✕</span><b class="td-region" data-node="ap-gallery-title" data-widget="Text">1 of 4</b><span class="ap-gal-share td-region" data-node="ap-gallery-share" data-widget="IconButton">${share}</span></header><div class="ap-gal-body td-region" data-node="ap-gallery-body" data-widget="Stack"><div class="ap-gal-hero td-region" data-node="ap-gallery-hero" data-widget="Hero"><div class="ap-gal-img td-region" data-node="ap-gallery-image" data-widget="Image"><span class="ap-earbuds"><i></i><i></i></span></div></div><span class="ap-gal-count td-region" data-node="ap-gallery-counter" data-widget="Positioned"><span class="td-region" data-node="ap-gallery-counter-text" data-widget="Text">1 / 4</span></span></div></div>`;
  }
  return `${tdStatus(false)}<div class="ap-screen td-region" data-node="ap-scaffold" data-widget="Scaffold"><header class="ap-bar td-region" data-node="ap-appbar" data-widget="AppBar"><span class="ap-back td-region" data-node="ap-back" data-widget="IconButton">‹</span><div class="ap-search td-region" data-node="ap-search-field" data-widget="TextField"><span class="td-region" data-node="ap-search-icon" data-widget="Icon">${TD_ICON.search}</span><span class="td-region" data-node="ap-search-hint" data-widget="Text">Search Amazon.in</span></div><span class="ap-cart-stack td-region" data-node="ap-cart-stack" data-widget="Stack"><span class="ap-badge td-region" data-node="ap-cart-badge" data-widget="Badge"><span class="td-region" data-node="ap-cart" data-widget="IconButton">${cart}</span><b class="td-region" data-node="ap-cart-count" data-widget="Text">3</b></span></span></header><main class="ap-scroll td-region" data-node="ap-body" data-widget="SingleChildScrollView"><div class="ap-content td-region" data-node="ap-content" data-widget="Column"><div class="ap-hero td-region" data-node="ap-hero" data-widget="Hero"><div class="ap-hero-img td-region" data-node="ap-hero-image" data-widget="Image"><span class="ap-earbuds"><i></i><i></i></span></div></div><div class="ap-thumbs td-region" data-node="ap-thumbs-row" data-widget="Row"><span class="ap-thumb on td-region" data-node="ap-thumb-1" data-widget="Image" style="--thumb:linear-gradient(135deg,#3b6ea5,#7fb0d8)"></span><span class="ap-thumb td-region" data-node="ap-thumb-2" data-widget="Image" style="--thumb:linear-gradient(135deg,#4a4a55,#9a9aad)"></span><span class="ap-thumb td-region" data-node="ap-thumb-3" data-widget="Image" style="--thumb:linear-gradient(135deg,#b34700,#f0903f)"></span></div><div class="ap-info td-region" data-node="ap-info-padding" data-widget="Padding"><div class="td-region" data-node="ap-info-column" data-widget="Column"><b class="ap-title td-region" data-node="ap-title" data-widget="Text">Wireless Earbuds Pro — Bluetooth 5.3, ANC, 30H Playtime</b><div class="ap-rating-row td-region" data-node="ap-rating-row" data-widget="Row"><span class="ap-stars td-region" data-node="ap-stars" data-widget="Text">★★★★☆ 4.5</span><span class="td-region" data-node="ap-rating-count" data-widget="Text">12,438 ratings</span></div><div class="ap-price-row td-region" data-node="ap-price-row" data-widget="Row"><b class="td-region" data-node="ap-price" data-widget="Text">₹1,499</b><span class="td-region" data-node="ap-mrp" data-widget="Text">₹2,999</span><span class="td-region" data-node="ap-discount" data-widget="Text">50% off</span></div><div class="ap-prime-row td-region" data-node="ap-prime-row" data-widget="Row"><span class="ap-prime td-region" data-node="ap-prime-badge" data-widget="Container"><b class="td-region" data-node="ap-prime-text" data-widget="Text">✓prime</b></span><span class="td-region" data-node="ap-delivery-text" data-widget="Text">FREE delivery by Tomorrow</span></div><div class="ap-divider td-region" data-node="ap-divider" data-widget="Divider"></div><span class="td-region" data-node="ap-colour-label" data-widget="Text">Colour: Midnight Black</span><div class="ap-colours td-region" data-node="ap-colour-row" data-widget="Row"><span class="ap-swatch on td-region" data-node="ap-swatch-1" data-widget="Container" style="--sw:#1a1a1a"></span><span class="ap-swatch td-region" data-node="ap-swatch-2" data-widget="Container" style="--sw:#f2f2f2"></span><span class="ap-swatch td-region" data-node="ap-swatch-3" data-widget="Container" style="--sw:#3b6ea5"></span></div><div class="ap-qty-row td-region" data-node="ap-qty-row" data-widget="Row"><span class="td-region" data-node="ap-qty-label" data-widget="Text">Quantity:</span><span class="ap-dropdown td-region" data-node="ap-qty-dropdown" data-widget="DropdownButton"><span class="td-region" data-node="ap-qty-value" data-widget="Text">1</span><span class="ap-dd-arrow">⌄</span></span></div><div class="ap-highlights td-region" data-node="ap-highlights-wrap" data-widget="Wrap">${chip(1, "Bluetooth 5.3")}${chip(2, "30h battery")}${chip(3, "IPX5 water resistant")}${chip(4, "Active noise cancellation")}</div><div class="ap-delivery-box td-region" data-node="ap-delivery-box" data-widget="Container"><div class="td-region" data-node="ap-delivery-column" data-widget="Column"><b class="td-region" data-node="ap-delivery-title" data-widget="Text">Delivery</b><span class="td-region" data-node="ap-delivery-detail" data-widget="Text">FREE delivery Tomorrow, 9 Nov. Order within 4 hrs 32 mins.</span><span class="ap-stock td-region" data-node="ap-stock" data-widget="Text">In stock — sold by Cloudtail India</span></div></div><b class="td-region" data-node="ap-about-title" data-widget="Text">About this item</b><div class="ap-about td-region" data-node="ap-about-list" data-widget="Column"><span class="td-region" data-node="ap-about-1" data-widget="Text">• Active noise cancellation blocks up to 98% of ambient noise.</span><span class="td-region" data-node="ap-about-2" data-widget="Text">• 30 hours total playtime with the charging case; 10-min charge gives 3 hours.</span><span class="td-region" data-node="ap-about-3" data-widget="Text">• 4-mic array with ENC for clear calls, even outdoors.</span></div></div></div></div></main><div class="ap-buybar td-region" data-node="ap-buybar" data-widget="Container"><div class="ap-buy-row td-region" data-node="ap-buy-row" data-widget="Row"><span class="ap-add td-region" data-node="ap-add-cart" data-widget="ElevatedButton"><span class="td-region" data-node="ap-add-cart-text" data-widget="Text">Add to Cart</span></span><span class="ap-buy td-region" data-node="ap-buy-now" data-widget="ElevatedButton"><span class="td-region" data-node="ap-buy-now-text" data-widget="Text">Buy Now</span></span></div></div></div>`;
}

function tdPhoneInstagramReels() {
  const reel = (n, grad, avatar, user, caption, audio, likes, comments, shares, liked) => {
    return `<section class="ir-reel td-region" data-node="ir-reel-${n}" data-widget="Stack" style="--reel:${grad}"><div class="ir-video td-region" data-node="ir-video-${n}" data-widget="Image"><span class="ir-video-tag">${user} • Reel ${n}</span></div><div class="ir-heart${liked ? " on" : ""} td-region" data-node="ir-heart-${n}" data-widget="AnimatedOpacity"><span class="td-region" data-node="ir-heart-icon-${n}" data-widget="Icon">♥</span></div><div class="ir-rail td-region" data-node="ir-rail-${n}" data-widget="Column"><span class="ir-rail-btn td-region" data-node="ir-like-${n}" data-widget="IconButton">♥</span><span class="td-region" data-node="ir-like-count-${n}" data-widget="Text">${likes}</span><span class="ir-rail-btn td-region" data-node="ir-comment-${n}" data-widget="IconButton">💬</span><span class="td-region" data-node="ir-comment-count-${n}" data-widget="Text">${comments}</span><span class="ir-rail-btn td-region" data-node="ir-share-${n}" data-widget="IconButton">${TD_ICON.send}</span><span class="td-region" data-node="ir-share-count-${n}" data-widget="Text">${shares}</span><span class="ir-disc td-region" data-node="ir-disc-${n}" data-widget="CircleAvatar">♪</span></div><div class="ir-caption td-region" data-node="ir-caption-${n}" data-widget="Column"><div class="ir-user-row td-region" data-node="ir-user-row-${n}" data-widget="Row"><span class="ir-mini-avatar td-region" data-node="ir-user-avatar-${n}" data-widget="CircleAvatar">${avatar}</span><b class="td-region" data-node="ir-username-${n}" data-widget="Text">${user}</b><span class="ir-follow td-region" data-node="ir-follow-${n}" data-widget="OutlinedButton"><span class="td-region" data-node="ir-follow-text-${n}" data-widget="Text">Follow</span></span></div><span class="td-region" data-node="ir-caption-text-${n}" data-widget="Text">${caption}</span><div class="ir-audio-row td-region" data-node="ir-audio-row-${n}" data-widget="Row"><span class="td-region" data-node="ir-audio-icon-${n}" data-widget="Icon">♪</span><span class="td-region" data-node="ir-audio-text-${n}" data-widget="Text">${audio}</span></div></div></section>`;
  };
  return `${tdStatus(false)}<div class="ir-screen td-region" data-node="ir-scaffold" data-widget="Scaffold"><div class="ir-body td-region" data-node="ir-body" data-widget="Stack"><div class="ir-reels td-region" data-node="ir-reels" data-widget="PageView">${reel(1, "linear-gradient(160deg,#1a73e8,#7b1fa2)", "FF", "flutterforward", "Build your first Flutter app in a day — full tutorial in bio.", "flutterforward • Original audio", "128K", "2,431", "8,204", true)}${reel(2, "linear-gradient(160deg,#0f9d58,#00acc1)", "CD", "codewithdheeraj", "Dart null safety in 60 seconds — save this for later.", "lofi beats • Trending audio", "86K", "1,102", "3,917", false)}${reel(3, "linear-gradient(160deg,#8e44ad,#e74c3c)", "UX", "uidesigndaily", "5 layout mistakes every Flutter beginner makes.", "uidesigndaily • Original audio", "214K", "5,830", "12,540", false)}</div><div class="ir-top td-region" data-node="ir-top-positioned" data-widget="Positioned"><div class="ir-topbar td-region" data-node="ir-topbar" data-widget="Row"><b class="td-region" data-node="ir-top-title" data-widget="Text">Reels</b><span class="td-region" data-node="ir-top-camera" data-widget="IconButton">${TD_ICON.video}</span></div></div></div><nav class="ir-bottom td-region" data-node="ir-bottom" data-widget="BottomNavigationBar"><span class="ir-nav td-region" data-node="ir-nav-home" data-widget="Icon">${TD_ICON.home}</span><span class="ir-nav td-region" data-node="ir-nav-search" data-widget="Icon">${TD_ICON.search}</span><span class="ir-nav td-region" data-node="ir-nav-create" data-widget="Icon">${TD_ICON.plus}</span><span class="ir-nav on td-region" data-node="ir-nav-reels" data-widget="Icon">${TD_ICON.reels}</span><span class="ir-mini-avatar ir-nav-avatar td-region" data-node="ir-nav-profile" data-widget="CircleAvatar">D</span></nav></div>`;
}

function tdPhoneAmazonCheckout() {
  const shield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>';
  const payRow = (id, label, on) => `<div class="ac-pay-row${on ? " on" : ""} td-region" data-node="ac-pay-${id}-row" data-widget="Row"><span class="ac-radio${on ? " on" : ""} td-region" data-node="ac-pay-${id}" data-widget="Radio"><i></i></span><span class="td-region" data-node="ac-pay-${id}-label" data-widget="Text">${label}</span></div>`;
  const item = (n, name, meta, price, color) => `<article class="ac-item td-region" data-node="ac-item-${n}" data-widget="Card"><div class="ac-item-row td-region" data-node="ac-item-${n}-row" data-widget="Row"><div class="ac-thumb td-region" data-node="ac-item-${n}-image" data-widget="Image" style="--prod:${color}"></div><div class="ac-item-col td-region" data-node="ac-item-${n}-col" data-widget="Column"><b class="td-region" data-node="ac-item-${n}-name" data-widget="Text">${name}</b><span class="td-region" data-node="ac-item-${n}-meta" data-widget="Text">${meta}</span><span class="ac-price-row td-region" data-node="ac-item-${n}-price-row" data-widget="Row"><b class="td-region" data-node="ac-item-${n}-price" data-widget="Text">${price}</b><span class="td-region" data-node="ac-item-${n}-qty" data-widget="Text">Qty: 1</span></span></div></div></article>`;
  const sumRow = (id, label, value, cls) => `<div class="ac-sum-row td-region" data-node="ac-summary-${id}-row" data-widget="Row"><span class="td-region" data-node="ac-summary-${id}-label" data-widget="Text">${label}</span><b class="td-region${cls ? " " + cls : ""}" data-node="ac-summary-${id}-value" data-widget="Text">${value}</b></div>`;
  return `${tdStatus(false)}<div class="ac-screen td-region" data-node="ac-scaffold" data-widget="Scaffold"><header class="ac-bar td-region" data-node="ac-appbar" data-widget="AppBar"><span class="ac-back td-region" data-node="ac-back" data-widget="IconButton">‹</span><b class="td-region" data-node="ac-title" data-widget="Text">Checkout</b></header><main class="ac-scroll td-region" data-node="ac-body" data-widget="ListView"><section class="ac-stepper td-region" data-node="ac-stepper" data-widget="Stepper"><div class="ac-step done td-region" data-node="ac-step-address" data-widget="Step"><span class="ac-step-dot">✓</span><div class="ac-step-body"><b class="td-region" data-node="ac-step-address-title" data-widget="Text">Delivery address</b><span class="td-region" data-node="ac-step-address-detail" data-widget="Text">Dheeraj Kumar · MG Road, Jaipur 302001</span></div></div><div class="ac-step active td-region" data-node="ac-step-payment" data-widget="Step"><span class="ac-step-dot">2</span><div class="ac-step-body"><b class="td-region" data-node="ac-step-payment-title" data-widget="Text">Payment method</b><div class="ac-pay-options td-region" data-node="ac-step-payment-options" data-widget="Column">${payRow("upi", "UPI · dheeraj@okhdfc", true)}${payRow("card", "Card · HDFC •••• 4242", false)}${payRow("cod", "Cash on delivery", false)}</div></div></div><div class="ac-step td-region" data-node="ac-step-review" data-widget="Step"><span class="ac-step-dot">3</span><div class="ac-step-body"><b class="td-region" data-node="ac-step-review-title" data-widget="Text">Review items</b><span class="td-region" data-node="ac-step-review-detail" data-widget="Text">2 items · arrives Thu, 12 Nov</span></div></div></section><h3 class="ac-cart-header td-region" data-node="ac-cart-header" data-widget="Text">Your order</h3>${item(1, "Wireless Earbuds Pro", "Black · Sold by Cloudtail", "₹1,499", "linear-gradient(135deg,#3b6ea5,#7fb0d8)")}${item(2, "Travel Backpack 32L", "Grey · Sold by Appario", "₹899", "linear-gradient(135deg,#3f6b4f,#7fb08a)")}<div class="ac-gift td-region" data-node="ac-gift-row" data-widget="Row"><span class="ac-check td-region" data-node="ac-gift-checkbox" data-widget="Checkbox"></span><span class="td-region" data-node="ac-gift-label" data-widget="Text">This order is a gift</span></div><section class="ac-summary td-region" data-node="ac-summary-card" data-widget="Card"><div class="td-region" data-node="ac-summary-col" data-widget="Column">${sumRow("subtotal", "Subtotal", "₹2,398")}${sumRow("delivery", "Delivery", "FREE", "ac-free")}<div class="ac-sum-div td-region" data-node="ac-summary-divider" data-widget="Divider"></div>${sumRow("total", "Order total", "₹2,398")}</div></section><div class="ac-order td-region" data-node="ac-place-order" data-widget="ElevatedButton"><span class="td-region" data-node="ac-place-order-label" data-widget="Text">Place order</span></div><div class="ac-secure td-region" data-node="ac-secure-row" data-widget="Row"><span class="td-region" data-node="ac-secure-icon" data-widget="Icon">${shield}</span><span class="td-region" data-node="ac-secure-text" data-widget="Text">Secure checkout · 256-bit SSL encryption</span></div></main></div>`;
}

function tdPhoneSettingsAppearance() {
  const ic = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const globe = ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>');
  const textIcon = ic('<path d="M5 6h14M12 6v13M9 19h6"/>');
  const radioRow = (id, label, sub, on) =>
    `<div class="sa-radio-row${on ? " on" : ""} td-region" data-node="sa-theme-${id}-row" data-widget="Row">` +
    `<span class="sa-radio${on ? " on" : ""} td-region" data-node="sa-radio-${id}" data-widget="Radio"><i></i></span>` +
    `<span class="sa-radio-tx"><b class="td-region" data-node="sa-radio-${id}-label" data-widget="Text">${label}</b>` +
    `<span class="td-region" data-node="sa-radio-${id}-sub" data-widget="Text">${sub}</span></span></div>`;
  const div = (id) => `<div class="sa-div td-region" data-node="${id}" data-widget="Divider"></div>`;
  return `${tdStatus(false)}<div class="sa-screen td-region" data-node="sa-scaffold" data-widget="Scaffold">` +
  `<header class="sa-bar td-region" data-node="sa-appbar" data-widget="AppBar">` +
    `<span class="sa-back td-region" data-node="sa-back" data-widget="IconButton">‹</span>` +
    `<b class="td-region" data-node="sa-title" data-widget="Text">Appearance</b>` +
  `</header>` +
  `<main class="sa-body td-region" data-node="sa-body" data-widget="ListView">` +
    `<div class="sa-group-label td-region" data-node="sa-theme-header" data-widget="Text">Theme</div>` +
    `<section class="sa-group td-region" data-node="sa-theme-group" data-widget="Container">` +
      `<div class="td-region" data-node="sa-theme-col" data-widget="Column">` +
        radioRow("light", "Light", "Bright background, dark text", true) +
        div("sa-div1") +
        radioRow("dark", "Dark", "Dark background, light text", false) +
        div("sa-div2") +
        radioRow("system", "System default", "Follows your phone's theme", false) +
      `</div>` +
    `</section>` +
    `<div class="sa-group-label td-region" data-node="sa-lang-header" data-widget="Text">Language</div>` +
    `<section class="sa-group td-region" data-node="sa-lang-group" data-widget="Container">` +
      `<div class="sa-lang-row td-region" data-node="sa-lang-row" data-widget="Row">` +
        `<span class="sa-ic td-region" data-node="sa-lang-icon" data-widget="Icon">${globe}</span>` +
        `<span class="sa-lang-tx td-region" data-node="sa-lang-label-col" data-widget="Column">` +
          `<b class="td-region" data-node="sa-lang-label" data-widget="Text">App language</b>` +
          `<span class="td-region" data-node="sa-lang-sub" data-widget="Text">Language for menus and buttons</span>` +
        `</span>` +
        `<span class="sa-drop td-region" data-node="sa-lang-dropdown" data-widget="DropdownButton">` +
          `<span class="sa-drop-btn"><span class="sa-drop-val">English</span><span class="sa-drop-chev">⌄</span></span>` +
          `<span class="sa-menu">` +
            `<span class="sa-opt on td-region" data-node="sa-lang-opt-en" data-widget="Text">English ✓</span>` +
            `<span class="sa-opt td-region" data-node="sa-lang-opt-hi" data-widget="Text">हिन्दी</span>` +
            `<span class="sa-opt td-region" data-node="sa-lang-opt-es" data-widget="Text">Español</span>` +
          `</span>` +
        `</span>` +
      `</div>` +
    `</section>` +
    `<div class="sa-group-label td-region" data-node="sa-textsize-header" data-widget="Text">Text size</div>` +
    `<section class="sa-group td-region" data-node="sa-textsize-group" data-widget="Container">` +
      `<div class="sa-ts-row td-region" data-node="sa-textsize-row" data-widget="Row">` +
        `<span class="sa-ic td-region" data-node="sa-textsize-icon" data-widget="Icon">${textIcon}</span>` +
        `<span class="sa-ts-tx td-region" data-node="sa-textsize-col" data-widget="Column">` +
          `<b class="td-region" data-node="sa-textsize-label" data-widget="Text">Text size</b>` +
          `<span class="td-region" data-node="sa-textsize-sub" data-widget="Text">Larger text is easier to read</span>` +
        `</span>` +
        `<span class="sa-ts-val td-region" data-node="sa-textsize-value" data-widget="Text">Medium</span>` +
      `</div>` +
    `</section>` +
    `<div class="sa-group-label td-region" data-node="sa-preview-header" data-widget="Text">Preview</div>` +
    `<section class="sa-preview td-region" data-node="sa-preview-card" data-widget="Card">` +
      `<div class="td-region" data-node="sa-preview-col" data-widget="Column">` +
        `<b class="td-region" data-node="sa-preview-title" data-widget="Text">Sample heading</b>` +
        `<span class="td-region" data-node="sa-preview-body" data-widget="Text">This is how headings and body text look with your choices.</span>` +
      `</div>` +
    `</section>` +
    `<p class="sa-note td-region" data-node="sa-note" data-widget="Text">Theme and language apply immediately across the app.</p>` +
  `</main></div>`;
}

function tdPhoneSettingsNotifications() {
  const swTile = (id, title, sub, on) =>
    `<div class="sn-tile td-region" data-node="sn-${id}" data-widget="SwitchListTile">` +
    `<span class="sn-tile-tx"><b class="td-region" data-node="sn-${id}-title" data-widget="Text">${title}</b>` +
    `<span class="td-region" data-node="sn-${id}-sub" data-widget="Text">${sub}</span></span>` +
    `<span class="sn-switch${on ? " on" : ""} td-region" data-node="sn-${id}-switch" data-widget="Switch"><i></i></span></div>`;
  const cbTile = (id, title, sub, on) =>
    `<div class="sn-tile td-region" data-node="sn-cat-${id}" data-widget="CheckboxListTile">` +
    `<span class="sn-check${on ? " on" : ""} td-region" data-node="sn-cat-${id}-check" data-widget="Checkbox"><i>✓</i></span>` +
    `<span class="sn-tile-tx"><b class="td-region" data-node="sn-cat-${id}-title" data-widget="Text">${title}</b>` +
    `<span class="td-region" data-node="sn-cat-${id}-sub" data-widget="Text">${sub}</span></span></div>`;
  const div = (id) => `<div class="sn-div td-region" data-node="${id}" data-widget="Divider"></div>`;
  return `${tdStatus(false)}<div class="sn-screen td-region" data-node="sn-scaffold" data-widget="Scaffold">` +
  `<header class="sn-bar td-region" data-node="sn-appbar" data-widget="AppBar">` +
    `<span class="sn-back td-region" data-node="sn-back" data-widget="IconButton">‹</span>` +
    `<b class="td-region" data-node="sn-title" data-widget="Text">Notifications</b>` +
  `</header>` +
  `<main class="sn-body td-region" data-node="sn-body" data-widget="ListView">` +
    `<div class="sn-group-label td-region" data-node="sn-master-header" data-widget="Text">Notifications</div>` +
    `<section class="sn-group td-region" data-node="sn-master-group" data-widget="Container">` +
      `<div class="td-region" data-node="sn-master-col" data-widget="Column">` +
        swTile("master", "Allow notifications", "Turn off to silence all alerts", true) +
        div("sn-div1") +
        swTile("sounds", "Sounds", "Play a tone for new alerts", true) +
        div("sn-div2") +
        swTile("vibrate", "Vibrate", "Vibrate for new alerts", false) +
        div("sn-div3") +
        swTile("badges", "App icon badges", "Show a count on the app icon", true) +
      `</div>` +
    `</section>` +
    `<div class="sn-group-label td-region" data-node="sn-cat-header" data-widget="Text">Categories</div>` +
    `<section class="sn-group td-region" data-node="sn-cat-group" data-widget="Container">` +
      `<div class="td-region" data-node="sn-cat-col" data-widget="Column">` +
        cbTile("messages", "Messages", "Chats and mentions", true) +
        div("sn-div4") +
        cbTile("updates", "Updates", "New features and releases", true) +
        div("sn-div5") +
        cbTile("promos", "Offers & promotions", "Deals and discounts", false) +
        div("sn-div6") +
        cbTile("reminders", "Reminders", "Tasks and events", true) +
      `</div>` +
    `</section>` +
    `<div class="sn-group-label td-region" data-node="sn-quiet-header" data-widget="Text">Do not disturb</div>` +
    `<section class="sn-group td-region" data-node="sn-quiet-group" data-widget="Container">` +
      swTile("quiet-tile", "Scheduled quiet hours", "10:00 PM – 7:00 AM", false) +
    `</section>` +
    `<p class="sn-note td-region" data-node="sn-note" data-widget="Text">Categories control which kinds of alerts can reach you.</p>` +
  `</main></div>`;
}

function tdPhoneSwiggyMenu() {
  const dish = (id, name, desc, price, veg) =>
    `<div class="sm-dish td-region" data-node="${id}-row" data-widget="Row">` +
    `<span class="sm-veg${veg ? "" : " nonveg"} td-region" data-node="${id}-veg" data-widget="Container"><span class="td-region" data-node="${id}-veg-icon" data-widget="Icon">●</span></span>` +
    `<span class="sm-dish-text td-region" data-node="${id}-flex" data-widget="Flexible"><span class="td-region" data-node="${id}-col" data-widget="Column"><b class="td-region" data-node="${id}-name" data-widget="Text">${name}</b><span class="td-region" data-node="${id}-desc" data-widget="Text">${desc}</span><span class="td-region" data-node="${id}-price" data-widget="Text">${price}</span></span></span>` +
    `<span class="sm-add td-region" data-node="${id}-add" data-widget="OutlinedButton"><span class="td-region" data-node="${id}-add-label" data-widget="Text">ADD</span></span></div>`;
  const section = (adapterId, titleId, title, listId, dishes) =>
    `<div class="sm-sec-title-wrap td-region" data-node="${adapterId}" data-widget="SliverToBoxAdapter"><h3 class="td-region" data-node="${titleId}" data-widget="Text">${title}</h3></div>` +
    `<div class="sm-list td-region" data-node="${listId}" data-widget="SliverList">${dishes}</div>`;
  return `${tdStatus(false)}<div class="sm-screen td-region" data-node="sm-scaffold" data-widget="Scaffold"><main class="sm-scroll td-region" data-node="sm-scroll" data-widget="CustomScrollView">` +
  `<header class="sm-head td-region" data-node="sm-appbar" data-widget="SliverAppBar"><div class="sm-head-pad td-region" data-node="sm-head-padding" data-widget="Padding"><div class="sm-head-row td-region" data-node="sm-head-row" data-widget="Row"><span class="sm-back td-region" data-node="sm-back" data-widget="IconButton">‹</span><span class="sm-head-col td-region" data-node="sm-head-col" data-widget="Column"><b class="td-region" data-node="sm-rest-name" data-widget="Text">Spice Kitchen</b><span class="td-region" data-node="sm-rest-meta" data-widget="Text">4.5 ★ · 25–30 min · ₹350 for two</span></span><span class="sm-fav td-region" data-node="sm-fav" data-widget="IconButton">♡</span></div></div></header>` +
  `<div class="sm-offer-wrap td-region" data-node="sm-offer-adapter" data-widget="SliverToBoxAdapter"><div class="sm-offer td-region" data-node="sm-offer" data-widget="Card"><div class="sm-offer-pad td-region" data-node="sm-offer-padding" data-widget="Padding"><span class="sm-offer-col td-region" data-node="sm-offer-col" data-widget="Column"><b class="td-region" data-node="sm-offer-title" data-widget="Text">40% OFF up to ₹120</b><span class="td-region" data-node="sm-offer-sub" data-widget="Text">Use code WELCOME on orders above ₹199</span></span></div></div></div>` +
  `<div class="sm-tabs td-region" data-node="sm-tabs-header" data-widget="SliverPersistentHeader"><div class="sm-tabs-row td-region" data-node="sm-tabs-row" data-widget="Row"><span class="sm-tab on td-region" data-node="sm-tab-rec" data-widget="Chip">Recommended</span><span class="sm-tab td-region" data-node="sm-tab-best" data-widget="Chip">Bestsellers</span><span class="sm-tab td-region" data-node="sm-tab-combo" data-widget="Chip">Combos</span></div></div>` +
  section("sm-sec1-adapter", "sm-sec1-title", "Recommended", "sm-list1",
    dish("sm-d1", "Paneer Butter Masala", "Creamy tomato gravy with soft paneer cubes, served with butter.", "₹249", true) +
    dish("sm-d2", "Chicken Biryani", "Fragrant basmati rice layered with spiced chicken, served with raita.", "₹299", false)) +
  section("sm-sec2-adapter", "sm-sec2-title", "Bestsellers", "sm-list2",
    dish("sm-d3", "Masala Dosa", "Crisp dosa with spiced potato filling, coconut chutney and sambar.", "₹149", true) +
    dish("sm-d4", "Butter Chicken", "Tandoori chicken folded into a rich tomato-butter gravy.", "₹329", false)) +
  section("sm-sec3-adapter", "sm-sec3-title", "Combos", "sm-list3",
    dish("sm-d5", "Veg Family Combo", "2 paneer curries, 4 butter naans, jeera rice and 2 desserts.", "₹599", true) +
    dish("sm-d6", "Non-Veg Feast Combo", "Chicken biryani, butter chicken, 2 naans and gulab jamun.", "₹649", false)) +
  `</main><footer class="sm-cartbar td-region" data-node="sm-cartbar" data-widget="Container"><div class="sm-cart-row td-region" data-node="sm-cart-row" data-widget="Row"><span class="td-region" data-node="sm-cart-count" data-widget="Text">2 items</span><span class="td-region" data-node="sm-cart-total" data-widget="Text">₹498</span><span class="sm-cart-view td-region" data-node="sm-cart-view" data-widget="TextButton"><span class="td-region" data-node="sm-cart-view-label" data-widget="Text">View Cart →</span></span></div></footer></div>`;
}

function tdPhoneYouTubeSearch() {
  const history = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 3"/></svg>';
  const mic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  const sug = (n, query) =>
    `<div class="ys-row td-region" data-node="ys-sug${n}-row" data-widget="Row"><span class="ys-row-icon td-region" data-node="ys-sug${n}-icon" data-widget="Icon">${TD_ICON.search}</span><span class="ys-row-text td-region" data-node="ys-sug${n}-expanded" data-widget="Expanded"><span class="td-region" data-node="ys-sug${n}-text" data-widget="Text">${query}</span></span><span class="ys-row-action td-region" data-node="ys-sug${n}-fill" data-widget="IconButton">↗</span></div>`;
  const rec = (n, query) =>
    `<div class="ys-row td-region" data-node="ys-rec${n}-row" data-widget="Row"><span class="ys-row-icon td-region" data-node="ys-rec${n}-icon" data-widget="Icon">${history}</span><span class="ys-row-text td-region" data-node="ys-rec${n}-expanded" data-widget="Expanded"><span class="td-region" data-node="ys-rec${n}-text" data-widget="Text">${query}</span></span><span class="ys-row-action td-region" data-node="ys-rec${n}-clear" data-widget="IconButton">✕</span></div>`;
  return `${tdStatus(false)}<div class="ys-screen td-region" data-node="ys-scaffold" data-widget="Scaffold"><main class="ys-body td-region" data-node="ys-body" data-widget="Column">` +
  `<div class="ys-search-row td-region" data-node="ys-search-row" data-widget="Row"><span class="ys-back td-region" data-node="ys-back" data-widget="IconButton">‹</span><span class="ys-searchbar-wrap td-region" data-node="ys-searchbar-expanded" data-widget="Expanded"><span class="ys-searchbar td-region" data-node="ys-searchbar" data-widget="SearchBar">${TD_ICON.search}<span class="ys-hint">Search YouTube</span></span></span><span class="ys-mic td-region" data-node="ys-mic" data-widget="IconButton">${mic}</span></div>` +
  `<div class="ys-scroll td-region" data-node="ys-suggest-list" data-widget="ListView">` +
  sug(1, "flutter tutorial for beginners") +
  sug(2, "flutter state management") +
  sug(3, "dart null safety") +
  sug(4, "build a flutter app") +
  `<div class="ys-rec-header td-region" data-node="ys-recent-header" data-widget="Text">Recent searches</div>` +
  rec(1, "flutter animations") +
  rec(2, "riverpod vs bloc") +
  rec(3, "youtube clone flutter") +
  `</div></main><nav class="ys-bottom td-region" data-node="ys-bottom" data-widget="BottomNavigationBar"><span class="ys-nav on td-region" data-node="ys-nav-home" data-widget="BottomNavigationBarItem">${TD_ICON.home}<span>Home</span></span><span class="ys-nav td-region" data-node="ys-nav-shorts" data-widget="BottomNavigationBarItem">${TD_ICON.reels}<span>Shorts</span></span><span class="ys-nav td-region" data-node="ys-nav-create" data-widget="BottomNavigationBarItem">${TD_ICON.plus}</span><span class="ys-nav td-region" data-node="ys-nav-subs" data-widget="BottomNavigationBarItem">${TD_ICON.video}<span>Subscriptions</span></span><span class="ys-nav td-region" data-node="ys-nav-you" data-widget="BottomNavigationBarItem">${TD_ICON.person}<span>You</span></span></nav></div>`;
}

function tdPhoneSpotifySearch() {
  const library = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4v16M9 4v16M14 5v14l5-1V4l-5 1Z"/></svg>';
  const card = (id, title, grad) =>
    `<div class="ss-card td-region" data-node="ss-card-${id}" data-widget="Card" style="background:${grad}"><div class="ss-card-col td-region" data-node="ss-card-${id}-col" data-widget="Column"><b class="td-region" data-node="ss-card-${id}-title" data-widget="Text">${title}</b></div></div>`;
  return `${tdStatus(false)}<div class="ss-screen td-region" data-node="ss-scaffold" data-widget="Scaffold">` +
  `<header class="ss-top td-region" data-node="ss-appbar" data-widget="AppBar"><b class="td-region" data-node="ss-appbar-title" data-widget="Text">Search</b><span class="ss-avatar td-region" data-node="ss-avatar" data-widget="CircleAvatar">DK</span></header>` +
  `<main class="ss-body td-region" data-node="ss-body" data-widget="Column">` +
  `<div class="ss-field td-region" data-node="ss-search-field" data-widget="TextField">${TD_ICON.search}<span>What do you want to listen to?</span></div>` +
  `<div class="td-region" data-node="ss-search-gap" data-widget="SizedBox" style="height:12px"></div>` +
  `<div class="ss-segments td-region" data-node="ss-segments" data-widget="SegmentedButton"><span class="ss-seg on td-region" data-node="ss-seg-music" data-widget="SegmentedButtonSegment">Music</span><span class="ss-seg td-region" data-node="ss-seg-podcasts" data-widget="SegmentedButtonSegment">Podcasts</span></div>` +
  `<div class="td-region" data-node="ss-seg-gap" data-widget="SizedBox" style="height:16px"></div>` +
  `<h3 class="td-region" data-node="ss-browse-title" data-widget="Text">Browse all</h3>` +
  `<div class="ss-grid-wrap td-region" data-node="ss-grid-expanded" data-widget="Expanded"><div class="ss-grid td-region" data-node="ss-grid" data-widget="GridView">` +
  card("music", "Music", "linear-gradient(135deg,#e13300,#f08a4b)") +
  card("podcasts", "Podcasts", "linear-gradient(135deg,#1e3264,#4a6db3)") +
  card("live", "Live Events", "linear-gradient(135deg,#8d67ab,#b89ad1)") +
  card("made", "Made For You", "linear-gradient(135deg,#1e6f5c,#3cae8b)") +
  card("charts", "Charts", "linear-gradient(135deg,#ba5d07,#e08a3c)") +
  card("new", "New Releases", "linear-gradient(135deg,#0d73ec,#5b9fe8)") +
  `</div></div></main>` +
  `<nav class="ss-bottom td-region" data-node="ss-bottom" data-widget="BottomNavigationBar"><span class="ss-nav td-region" data-node="ss-nav-home" data-widget="BottomNavigationBarItem">${TD_ICON.home}<span>Home</span></span><span class="ss-nav on td-region" data-node="ss-nav-search" data-widget="BottomNavigationBarItem">${TD_ICON.search}<span>Search</span></span><span class="ss-nav td-region" data-node="ss-nav-library" data-widget="BottomNavigationBarItem">${library}<span>Your Library</span></span></nav></div>`;
}

function tdPhoneWhatsAppStatus() {
  return `${tdStatus(true)}<div class="ws-screen td-region" data-node="ws-scaffold" data-widget="Scaffold">` +
  `<div class="ws-stack td-region" data-node="ws-stack" data-widget="Stack">` +
  `<main class="ws-viewer td-region" data-node="ws-viewer" data-widget="PageView">` +
  `<div class="ws-page td-region" data-node="ws-page-1" data-widget="Stack">` +
  `<div class="ws-photo td-region" data-node="ws-hero" data-widget="Hero"><span class="td-region" data-node="ws-page1-image" data-widget="Image"></span></div>` +
  `<span class="ws-caption td-region" data-node="ws-page1-caption" data-widget="Text">Beach day with the Flutter crew</span></div>` +
  `<div class="ws-page next td-region" data-node="ws-page-2" data-widget="Stack">` +
  `<span class="ws-photo p2 td-region" data-node="ws-page2-image" data-widget="Image"></span>` +
  `<span class="ws-caption td-region" data-node="ws-page2-caption" data-widget="Text">Shipping the widget tree lesson tonight</span></div>` +
  `<div class="ws-page next td-region" data-node="ws-page-3" data-widget="Stack">` +
  `<span class="ws-photo p3 td-region" data-node="ws-page3-image" data-widget="Image"></span>` +
  `<span class="ws-caption td-region" data-node="ws-page3-caption" data-widget="Text">Dinner after the session</span></div>` +
  `</main>` +
  `<div class="ws-top td-region" data-node="ws-top" data-widget="Column">` +
  `<div class="ws-progress td-region" data-node="ws-progress" data-widget="Row">` +
  `<span class="ws-seg done td-region" data-node="ws-seg-1" data-widget="Container"></span>` +
  `<span class="ws-seg half td-region" data-node="ws-seg-2" data-widget="Container"></span>` +
  `<span class="ws-seg td-region" data-node="ws-seg-3" data-widget="Container"></span></div>` +
  `<div class="ws-sender td-region" data-node="ws-sender" data-widget="Row">` +
  `<span class="ws-avatar td-region" data-node="ws-sender-avatar" data-widget="CircleAvatar">A</span>` +
  `<b class="td-region" data-node="ws-sender-name" data-widget="Text">Alex</b>` +
  `<span class="td-region" data-node="ws-sender-time" data-widget="Text">2h ago</span>` +
  `<span class="ws-close td-region" data-node="ws-close" data-widget="IconButton">✕</span></div></div>` +
  `<div class="ws-reply td-region" data-node="ws-reply" data-widget="Row">` +
  `<span class="ws-field td-region" data-node="ws-reply-field" data-widget="TextField"><span class="td-region" data-node="ws-reply-hint" data-widget="Text">Reply</span></span>` +
  `<span class="ws-heart td-region" data-node="ws-reply-heart" data-widget="IconButton">♡</span>` +
  `<span class="ws-send td-region" data-node="ws-reply-send" data-widget="IconButton">${TD_ICON.send}</span></div>` +
  `</div></div>`;
}

function tdPhoneSpotifyPlaylist() {
  const song = (n, grad, glyph, title, artist, time, dragging) =>
    `<div class="spl-song${dragging ? " dragging" : ""} td-region" data-node="spl-song-${n}" data-widget="Row">` +
    `<span class="spl-drag td-region" data-node="spl-song${n}-drag" data-widget="Icon">⋮⋮</span>` +
    `<span class="spl-art td-region" data-node="spl-song${n}-art" data-widget="Image" style="--art:${grad}">${glyph}</span>` +
    `<span class="spl-info td-region" data-node="spl-song${n}-info" data-widget="Column">` +
    `<b class="td-region" data-node="spl-song${n}-title" data-widget="Text">${title}</b>` +
    `<span class="td-region" data-node="spl-song${n}-artist" data-widget="Text">${artist}</span></span>` +
    `<span class="spl-time td-region" data-node="spl-song${n}-time" data-widget="Text">${time}</span></div>`;
  return `${tdStatus(true)}<div class="spl-screen td-region" data-node="spl-scaffold" data-widget="Scaffold">` +
  `<header class="spl-bar td-region" data-node="spl-appbar" data-widget="AppBar">` +
  `<span class="spl-back td-region" data-node="spl-back" data-widget="IconButton">‹</span>` +
  `<b class="td-region" data-node="spl-appbar-title" data-widget="Text">Liked Songs</b>` +
  `<span class="spl-more td-region" data-node="spl-more" data-widget="IconButton">⋮</span></header>` +
  `<main class="spl-scroll td-region" data-node="spl-body" data-widget="Column">` +
  `<div class="spl-header td-region" data-node="spl-header" data-widget="Row">` +
  `<span class="spl-cover td-region" data-node="spl-cover" data-widget="ClipRRect"><span class="spl-cover-art td-region" data-node="spl-cover-art" data-widget="Image">♥</span></span>` +
  `<span class="spl-header-info td-region" data-node="spl-header-info" data-widget="Column">` +
  `<b class="td-region" data-node="spl-playlist-title" data-widget="Text">Liked Songs</b>` +
  `<span class="td-region" data-node="spl-playlist-meta" data-widget="Text">Dheeraj Kumar · 4 songs</span></span></div>` +
  `<div class="spl-actions td-region" data-node="spl-actions" data-widget="Row">` +
  `<span class="spl-play td-region" data-node="spl-play-btn" data-widget="ElevatedButton"><span class="td-region" data-node="spl-play-label" data-widget="Text">▶&nbsp;Play</span></span>` +
  `<span class="spl-shuffle td-region" data-node="spl-shuffle-btn" data-widget="IconButton">⇄</span></div>` +
  `<div class="spl-list td-region" data-node="spl-list" data-widget="ReorderableListView">` +
  song(1, "linear-gradient(135deg,#c0392b,#e74c3c)", "BL", "Blinding Lights", "The Weeknd", "3:20", false) +
  song(2, "linear-gradient(135deg,#8e44ad,#c07be0)", "AH", "After Hours", "The Weeknd", "6:01", true) +
  song(3, "linear-gradient(135deg,#2471a3,#5dade2)", "LV", "Levitating", "Dua Lipa", "3:23", false) +
  song(4, "linear-gradient(135deg,#1e6f5c,#3cae8b)", "SY", "Shape of You", "Ed Sheeran", "3:53", false) +
  `</div></main></div>`;
}

function tdPhoneLoginSignup() {
  const field = (id, icon, label, value, eye) =>
    `<div class="ls-field td-region" data-node="ls-${id}-field" data-widget="TextFormField">` +
    `<span class="td-region" data-node="ls-${id}-icon" data-widget="Icon">${icon}</span>` +
    `<span class="ls-deco td-region" data-node="ls-${id}-decoration" data-widget="InputDecoration">${label}</span>` +
    (value ? `<span class="ls-value">${value}</span>` : ``) +
    (eye ? `<span class="ls-eye td-region" data-node="ls-eye" data-widget="IconButton">👁</span>` : ``) +
    `</div>`;
  return `${tdStatus(false)}<div class="ls-screen td-region" data-node="ls-scaffold" data-widget="Scaffold">` +
  `<div class="ls-safe td-region" data-node="ls-safe" data-widget="SafeArea">` +
  `<div class="ls-scroll td-region" data-node="ls-scroll" data-widget="SingleChildScrollView">` +
  `<div class="ls-center td-region" data-node="ls-center" data-widget="Center">` +
  `<div class="ls-pad td-region" data-node="ls-form-padding" data-widget="Padding">` +
  `<div class="td-region" data-node="ls-form" data-widget="Form">` +
  `<div class="ls-col td-region" data-node="ls-col" data-widget="Column">` +
  `<div class="ls-header td-region" data-node="ls-header" data-widget="Column">` +
  `<div class="ls-logo-ring td-region" data-node="ls-logo-ring" data-widget="Container"><span class="td-region" data-node="ls-logo" data-widget="Text">FF</span></div>` +
  `<b class="ls-title td-region" data-node="ls-title" data-widget="Text">Create account</b>` +
  `<span class="ls-subtitle td-region" data-node="ls-subtitle" data-widget="Text">Join FlutterForward to start learning</span></div>` +
  field("name", "👤", "Full name", "Dheeraj Kumar", false) +
  `<div class="td-region" data-node="ls-field-gap" data-widget="SizedBox" style="height:12px"></div>` +
  field("email", "✉", "Email", "dheeraj@example.com", false) +
  `<div class="td-region" data-node="ls-field-gap-2" data-widget="SizedBox" style="height:12px"></div>` +
  field("pass", "🔒", "Password", "••••••••", true) +
  `<div class="td-region" data-node="ls-field-gap-3" data-widget="SizedBox" style="height:14px"></div>` +
  `<div class="ls-terms td-region" data-node="ls-terms-row" data-widget="Row">` +
  `<span class="ls-check on td-region" data-node="ls-terms-check" data-widget="Checkbox">✓</span>` +
  `<span class="td-region" data-node="ls-terms-text" data-widget="Text">I agree to the Terms and Privacy Policy</span></div>` +
  `<div class="td-region" data-node="ls-btn-gap" data-widget="SizedBox" style="height:16px"></div>` +
  `<div class="ls-create td-region" data-node="ls-create-btn" data-widget="ElevatedButton"><span class="td-region" data-node="ls-create-label" data-widget="Text">Create account</span></div>` +
  `<div class="ls-login-row td-region" data-node="ls-login-row" data-widget="Row">` +
  `<span class="td-region" data-node="ls-login-text" data-widget="Text">Already have an account?</span>` +
  `<span class="td-region" data-node="ls-login-link" data-widget="GestureDetector"><b class="td-region" data-node="ls-login-link-text" data-widget="Text">Log in</b></span></div>` +
  `</div></div></div></div></div></div></div>`;
}

function tdPhoneGmailDrawer() {
  const row = (id, icon, label) =>
    `<div class="gd-row td-region" data-node="gd-row-${id}" data-widget="ListTile">` +
    `<span class="gd-row-icon td-region" data-node="gd-row-${id}-icon" data-widget="Icon">${icon}</span>` +
    `<span class="td-region" data-node="gd-row-${id}-label" data-widget="Text">${label}</span></div>`;
  return `${tdStatus(false)}<div class="gd-screen td-region" data-node="gd-scaffold" data-widget="Scaffold">` +
  `<div class="gd-body td-region" data-node="gd-body" data-widget="Stack">` +
  `<div class="gd-inbox td-region" data-node="gd-inbox" data-widget="Column">` +
  `<span class="gd-line td-region" data-node="gd-inbox-line-1" data-widget="Text">FlutterForward — Your 40-lesson Flutter course</span>` +
  `<span class="gd-line td-region" data-node="gd-inbox-line-2" data-widget="Text">RTU Kota — Exam timetable: V Sem main exams</span></div>` +
  `<div class="gd-dim td-region" data-node="gd-inbox-dim" data-widget="Container"></div>` +
  `<aside class="gd-drawer td-region" data-node="gd-drawer" data-widget="Drawer">` +
  `<div class="gd-drawer-col td-region" data-node="gd-drawer-col" data-widget="Column">` +
  `<div class="gd-header td-region" data-node="gd-header" data-widget="Container">` +
  `<div class="gd-header-row td-region" data-node="gd-header-row" data-widget="Row">` +
  `<span class="gd-avatar td-region" data-node="gd-header-avatar" data-widget="CircleAvatar">D</span>` +
  `<span class="gd-header-info td-region" data-node="gd-header-info" data-widget="Column">` +
  `<b class="td-region" data-node="gd-header-name" data-widget="Text">Dheeraj Kumar</b>` +
  `<span class="td-region" data-node="gd-header-email" data-widget="Text">dheeraj@example.com</span></span></div></div>` +
  `<div class="gd-menu td-region" data-node="gd-menu" data-widget="ListView">` +
  row("all", "▣", "All inboxes") +
  row("primary", "✉", "Primary") +
  row("starred", "☆", "Starred") +
  row("sent", "➤", "Sent") +
  row("drafts", "✎", "Drafts") +
  `<span class="gd-divider td-region" data-node="gd-divider" data-widget="Divider"></span>` +
  row("settings", "⚙", "Settings") +
  `</div></div></aside>` +
  `</div></div>`;
}

function tdPhone(key) { return key === "whatsapp" ? tdPhoneWhatsApp() : key === "instagram" ? tdPhoneInstagram() : key === "settings" ? tdPhoneSettings() : key === "login" ? tdPhoneLogin() : key === "youtube" ? tdPhoneYouTube() : key === "spotify" ? tdPhoneSpotify() : key === "amazon" ? tdPhoneAmazon() : key === "gmail" ? tdPhoneGmail() : key === "netflix" ? tdPhoneNetflix() : key === "calculator" ? tdPhoneCalculator() : key === "notes" ? tdPhoneNotes() : key === "tasks" ? tdPhoneTasks() : key === "gmail-compose" ? tdPhoneGmailCompose() : key === "spotify-player" ? tdPhoneSpotifyPlayer() : key === "youtube-player" ? tdPhoneYouTubePlayer() : key === "netflix-detail" ? tdPhoneNetflixDetail() : key === "amazon-product" ? tdPhoneAmazonProduct(tdGalleryOpen) : key === "instagram-reels" ? tdPhoneInstagramReels() : key === "amazon-checkout" ? tdPhoneAmazonCheckout() : key === "settings-appearance" ? tdPhoneSettingsAppearance() : key === "settings-notifications" ? tdPhoneSettingsNotifications() : key === "swiggy-menu" ? tdPhoneSwiggyMenu() : key === "youtube-search" ? tdPhoneYouTubeSearch() : key === "spotify-search" ? tdPhoneSpotifySearch() : key === "whatsapp-status" ? tdPhoneWhatsAppStatus() : key === "spotify-playlist" ? tdPhoneSpotifyPlaylist() : key === "login-signup" ? tdPhoneLoginSignup() : key === "gmail-drawer" ? tdPhoneGmailDrawer() : tdPhoneSwiggy(); }
function tdIndex(teardown) {
  const map = {}, parents = {};
  (function walk(node, parent) { map[node.id] = node; if (parent) parents[node.id] = parent.id; node.children.forEach(child => walk(child, node)); })(teardown.root, null);
  return { map, parents };
}
function tdPath(key, id) {
  const teardown = TEARDOWNS[key], indexed = tdIndex(teardown), path = [];
  let node = indexed.map[id] || teardown.root;
  while (node) { path.unshift(node); node = indexed.parents[node.id] ? indexed.map[indexed.parents[node.id]] : null; }
  return path;
}
let tdGalleryOpen = false;
let teardownState = { app: null, selected: null, bounds: false, sheet: null };
function tdSelectedNode() {
  if(!teardownState.app || !teardownState.selected) return null;
  var node = tdIndex(TEARDOWNS[teardownState.app]).map[teardownState.selected];
  if(node) return node;
  // Fallback: create synthetic node from HTML data-widget
  var el = document.querySelector('[data-node="' + teardownState.selected + '"]');
  if(el){
    var widget = el.getAttribute('data-widget') || 'Widget';
    return { id: teardownState.selected, name: widget, what: 'A ' + widget + ' widget in the ' + TEARDOWNS[teardownState.app].screen + '.', why: 'Part of the ' + widget + ' layout.', code: widget + '()' };
  }
  return null;
}
// Phase 5: the concept's filter-chip categories for the 13 real apps.
// WhatsApp=Chat, Instagram=Social, Swiggy/Amazon=Shopping,
// YouTube/Spotify/Netflix=Media, everything else=Utility.
var TD_APP_CATS = { "WhatsApp": "Chat", "Instagram": "Social", "Swiggy": "Shopping", "Amazon": "Shopping", "YouTube": "Media", "Spotify": "Media", "Netflix": "Media", "Settings": "Utility", "Login": "Utility", "Calculator": "Utility", "Notes": "Utility", "Tasks": "Utility", "Gmail": "Utility" };
function tdAppGroups() {
  // Phase C: group the 29 TEARDOWNS entries into one row per app, in first-
  // seen (insertion) order. "Swiggy-style" is displayed as "Swiggy".
  // Widget totals use item.count, which tdEnforceOneFrame setup recomputes
  // from each tree at load (line ~4286), so meta == tree for all 29.
  var groups = [], byApp = {};
  Object.entries(TEARDOWNS).forEach(function(entry) {
    var key = entry[0], item = entry[1];
    var name = item.app === "Swiggy-style" ? "Swiggy" : item.app;
    var g = byApp[name];
    if (!g) { g = { name: name, glyph: item.glyph, glyphClass: item.glyphClass || "", accent: item.accent || "", cat: TD_APP_CATS[name] || "Utility", keys: [], total: 0 }; byApp[name] = g; groups.push(g); }
    g.keys.push(key);
    g.total += item.count || 0;
  });
  return groups;
}
function teardownIndexView() {
  // Phase 5: list RESTRUCTURED to the Rev 2 concept layout — page head with
  // a head search pill (same pattern as lessons/quizzes), filter chips
  // (concept .chip), and app CARDS in a 3-col grid (concept .card.res-card:
  // coloured icon tile + name + "N screens · M widgets" + category tag +
  // Open). The whole card is the open button (data-teardown-open), so the
  // existing document delegation opens the detail; the "Open \u2192" is a
  // span, not a nested button. Screen names stay in a visually-hidden span
  // so search still finds individual screens ("Reels" -> Instagram).
  // List-local state resets on every render (route() and tdBack both
  // re-render): category back to All. The search query is NOT reset here —
  // navSearchFilter owns window.__navSearchQuery (route-change collapse
  // clears it; the detail->back search path sets it before its 200ms
  // re-filter).
  window.__tdCat = "All";
  var cats = ["All", "Chat", "Social", "Shopping", "Media", "Utility"];
  var chips = cats.map(function(c) {
    return '<button type="button" class="td-chip' + (c === "All" ? " active" : "") + '" data-td-cat="' + c + '" aria-pressed="' + (c === "All" ? "true" : "false") + '">' + c + '</button>';
  }).join("");
  var appCount = tdAppGroups().length, screenCount = Object.keys(TEARDOWNS).length;
  var cards = tdAppGroups().map(function(g) {
    var screens = g.keys.map(function(k) { return TEARDOWNS[k]; });
    var sub = screens.length > 1 ? screens.length + " screens" : screens[0].screen;
    var hidden = screens.map(function(it) { return esc(it.screen); }).join(" ");
    return `<button type="button" class="td-app-card" data-teardown-open="${g.keys[0]}" data-td-cat="${g.cat}"><span class="td-app-top"><span class="teardown-glyph" role="img" aria-label="${esc(g.name)} app icon">${TD_APP_ICONS[g.name] || esc(g.glyph)}</span><span class="td-app-copy"><span class="td-app-name">${esc(g.name)}</span><span class="td-app-meta">${sub} \u00b7 ${g.total} widgets</span><span class="td-sr-only">${hidden}</span></span></span><span class="td-app-foot"><span class="td-cat-tag">${g.cat}</span><span class="td-app-open">Open \u2192</span></span></button>`;
  }).join("");
  return `<div class="page-head teardowns-head"><div class="teardowns-head-copy"><h1>Teardowns</h1><p>Tap any widget in a real app UI. See what it is, why it\u2019s there, and its Dart code.</p></div></div><div class="td-chips" role="group" aria-label="Filter teardowns by category">${chips}</div><div class="teardown-index">${cards}</div><p id="teardown-search-empty" class="lessons-empty" style="display:none">No teardowns match your search.</p>`;
}

// Phase 5: ONE list filter — category chip AND search query compose.
// Category reads from the DOM's active chip (every render marks All active,
// so a re-render can never disagree with the stored value); the query is
// window.__navSearchQuery, set by the sidebar search and by the head search
// input alike. Called by chip clicks, both search inputs, and
// navSearchFilter's teardowns branch.
function tdApplyListFilters() {
  var activeChip = document.querySelector(".td-chip.active");
  var cat = activeChip ? activeChip.dataset.tdCat : (window.__tdCat || "All");
  var q = (window.__navSearchQuery || "").toLowerCase().trim();
  var v = 0;
  $$(".td-app-card").forEach(function(card) {
    var tx = card.textContent.toLowerCase();
    var show = (cat === "All" || card.dataset.tdCat === cat) && (!q || tx.indexOf(q) >= 0);
    card.style.display = show ? "" : "none";
    if (show) v++;
  });
  var m = document.getElementById("teardown-search-empty");
  if (m) m.style.display = v ? "none" : "block";
}

const TD_PROP_DESCS = {
  padding: 'Empty space inside the widget, around its child.',
  margin: 'Empty space outside the widget.',
  decoration: 'Visual styling like color, shape, shadows, borders.',
  color: 'The background color of the widget.',
  borderRadius: 'Rounds the corners of the widget.',
  child: 'The single widget placed inside this one.',
  children: 'The list of widgets placed inside this one.',
  alignment: 'Where the child sits within available space.',
  width: 'Fixed horizontal size in logical pixels.',
  height: 'Fixed vertical size in logical pixels.',
  mainAxisAlignment: 'How children are spaced along the main axis.',
  crossAxisAlignment: 'How children align across the main axis.',
  onPressed: 'Called when the user taps the widget.',
  icon: 'The icon displayed inside the button.',
  title: 'The main text shown in the bar.',
  actions: 'Widgets shown at the end of the bar.',
  leading: 'Widget shown at the start, often a back button.',
  pinned: 'Whether the bar stays visible when scrolled.',
  floating: 'Whether the bar reappears when scrolling up.',
  expandedHeight: 'Height of the bar when fully expanded.',
  fit: 'How the image fills its box.',
  radius: 'Size of the circular avatar.',
  backgroundImage: 'The image shown inside the circle.',
  data: 'The text string to display.',
  style: 'Font, size, color and weight of the text.',
};

function tdHighlight(code) {
  var s = esc(code);
  return s.replace(/(&#39;.*?&#39;|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|\b(?:const|final|var|late|required|return|if|else|for|in|while|do|switch|case|default|break|continue|class|extends|implements|with|mixin|enum|import|export|library|part|of|is|as|assert|async|await|yield|sync|get|set|operator|covariant|deferred|hide|show|on|try|catch|finally|throw|rethrow|new|this|super|null|true|false)\b|\b[A-Z][A-Za-z0-9_]*)/g, function(m) {
    if (m.indexOf('&#39;') === 0) return '<span class="tok-s">' + m + '</span>';
    if (m.indexOf('//') === 0) return '<span class="tok-c">' + m + '</span>';
    if (/^\d/.test(m)) return '<span class="tok-n">' + m + '</span>';
    if (/^[A-Z]/.test(m)) return '<span class="tok-f">' + m + '</span>';
    return '<span class="tok-k">' + m + '</span>';
  });
}

function tdPanel() {
  const node = tdSelectedNode();
  if (!node) return `<aside class="teardown-panel is-empty"><div><h3>Select a widget</h3><p>Tap any part of the app to inspect it.</p></div></aside>`;
  const item = TEARDOWNS[teardownState.app];
  const path = tdPath(teardownState.app, node.id);
  const crumbs = path.map(p => esc(p.name)).join('<span>›</span>');
  // Parse properties with values from code
  var props = [];
  try {
    var codeLines = node.code.split('\n');
    for (var i = 0; i < codeLines.length; i++) {
      var m = codeLines[i].match(/^\s*(\w+)\s*:\s*(.+?),?\s*$/);
      if (m && ['child','children','builder'].indexOf(m[1]) === -1) {
        var val = m[2].replace(/,$/, '').trim();
        // Truncate long values
        if (val.length > 40) val = val.substring(0, 37) + '...';
        props.push({ name: m[1], value: val });
      }
    }
  } catch(e) {}
  props = props.slice(0, 8);
  var propsHtml = props.length ? '<div class="td-fi-sec-t">Properties</div>' + props.map(function(p){
    var d = (typeof TD_PROP_DESCS !== 'undefined' && TD_PROP_DESCS[p.name]) || '';
    return '<div class="td-fi-prop"><span class="td-fi-pname">• ' + esc(p.name) + ': <span class="td-val">' + esc(p.value) + '</span></span>' + (d ? '<span class="td-fi-pdesc">' + esc(d) + '</span>' : '') + '</div>';
  }).join('') : '';
  return `<aside class="teardown-panel" aria-live="polite">`
    + `<div class="td-sheet-peekbar" data-teardown-peekbar><span class="td-sheet-peekhint"><span class="td-sheet-handle"></span><span class="td-sheet-peekchev"></span></span><span class="td-sheet-peekrow"><span class="td-sheet-peekname">${esc(node.name)}</span><button class="td-sheet-peekclose" data-teardown-close aria-label="Close description">×</button></span></div>`
    + `<div class="td-panel-head"><div class="teardown-kicker">${esc(item.app)} teardown • ${esc(item.screen)}</div><button class="td-panel-close" data-teardown-close aria-label="Close panel">×</button></div>`
    + `<div class="td-fi-crumb">${crumbs}</div>`
    + `<h2 class="td-fi-name">${esc(node.name)}</h2>`
    + `<p class="td-fi-desc">${esc(node.what)} ${esc(node.why)}</p>`
    + propsHtml
    + `<div class="codeblock"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span class="lang">dart</span><button class="copy-btn" data-teardown-copy>Copy</button></div>`
    + `<pre><code>${tdHighlight(node.code)}</code></pre></div>`
    + `</aside>`;
}
function tdDetailView() {
  const item = TEARDOWNS[teardownState.app];
  return `<div class="teardown-detail"><a class="td-back-link" href="#/teardowns" data-teardown-index>← All teardowns</a><div class="teardown-workbench"><div class="teardown-phone-stage"><div class="teardown-phone"><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div></div>${tdPanel()}</div></div>`;
}
function teardownsView() {
  teardownState = { app: null, selected: null, bounds: false };
  return `<div id="teardowns-root">${teardownIndexView()}</div>`;
}
views.teardowns = teardownsView;
function tdPrepare() {
  const root = $("#teardowns-root"); if (!root || !teardownState.app) return;
  const item = TEARDOWNS[teardownState.app], stage = root.querySelector(".teardown-phone-stage");
  root.querySelectorAll(".td-region").forEach(region => {
    const id = region.dataset.node, interactive = false || item.hotspots.includes(id);
    if (interactive) { region.setAttribute("role","button"); region.setAttribute("tabindex","0"); region.setAttribute("aria-label",`Inspect ${region.dataset.widget}`); }
    if (item.hotspots.includes(id) && !region.querySelector(":scope > .td-hotspot")) {
      const b = document.createElement("span"); b.className = "td-hotspot"; b.textContent = String(item.hotspots.indexOf(id)+1); b.dataset.teardownSelect = id; b.setAttribute("aria-hidden","true"); region.appendChild(b);
    }
  });
  if (stage) stage.classList.toggle("show-bounds",false);
  const active = root.querySelector(`[data-node="${teardownState.selected||''}"]`); if (active) requestAnimationFrame(()=>active.classList.add("td-active"));
  document.body.classList.toggle("td-sheet-open",!!teardownState.selected && window.matchMedia("(max-width: 860px)").matches);
}

function mqMatches(q){return window.matchMedia&&window.matchMedia(q).matches;}
function tdEnforceOneFrame() {
  // CONTAINER-SIZED PHONE (2026-11-10, Worker B): the detail/phone fit is now
  // pure CSS (flex chain under body.td-detail-open, styles.css) — the phone
  // is sized by its container, not by a JS-frozen pixel height. This function
  // is kept ONLY as a safety net: it clears any stale inline sizing (from the
  // old enforcer or an older render) so CSS always owns the fit. It must never
  // set a pixel height again. Call sites (resize, fonts.ready, search
  // observer, tdRender) are unchanged and now invoke this cleanup.
  if (window.addEventListener) { window.addEventListener('resize', tdOnResize); }
  var d = document.querySelector('.teardown-detail');
  if (d) {
    d.style.removeProperty('height');
    d.style.removeProperty('min-height');
    d.style.removeProperty('max-height');
    d.style.removeProperty('overflow');
    d.style.removeProperty('display');
    d.style.removeProperty('flex-direction');
    d.style.removeProperty('transition');
    var wb = d.querySelector('.teardown-workbench');
    if (wb) { wb.style.removeProperty('flex'); wb.style.removeProperty('min-height'); wb.style.removeProperty('overflow'); }
    var pn = d.querySelector('.teardown-panel');
    if (pn) { pn.style.removeProperty('height'); pn.style.removeProperty('max-height'); pn.style.removeProperty('overflow-y'); }
  }
  document.documentElement.style.removeProperty('height');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('height');
  document.body.style.removeProperty('max-height');
  document.body.style.removeProperty('margin');
}
// Re-enforce teardown sizing after fonts load (fixes first-load stretch)
if(document.fonts&&document.fonts.ready){
  document.fonts.ready.then(function(){
    try{if(teardownState&&teardownState.app){tdEnforceOneFrame();}}catch(e){}
    try{tdFitLogin();}catch(e){}
  });
}

var tdResizeTimer = null;
function tdOnResize() { if (tdResizeTimer) { clearTimeout(tdResizeTimer); } tdResizeTimer = setTimeout(function() { try { if (teardownState && teardownState.app) { tdEnforceOneFrame(); } } catch (e) {} try { tdFitLogin(); } catch (e) {} }, 150); }

// Login form scale-to-fit (2026-11-10, Worker B): the Login form is a fixed
// form (~481px natural height), not a scrolling feed. Below ~713px viewport
// height the screen is shorter than the form, so the Google button + Sign-up
// row were cut inside the phone (measured +84px at 1097x617, +190/+242px at
// 200% zoom) with a hidden scrollbar and no scroll affordance. This scales
// the form pad to exactly the room from the pad's top to its scroll column's
// visible bottom, less an 8px gap, about the pad's top edge (styles.css reads
// --td-fit). Fits exactly when the pad's bottom is inside the column (then
// the var is removed and the form is centred by its auto margins as before).
// Idempotent: transforms do not change layout rects, so re-measuring after a
// scale returns the same ratio. Only the Login app ('login' Sign-in,
// 'login-signup' Sign-up) has a fixed form; every feed scrolls by design and
// is left alone. Runs on every tdRender, on resize (debounced) and after
// fonts load.
function tdFitLogin() {
  try {
    if (!teardownState || (teardownState.app !== 'login' && teardownState.app !== 'login-signup')) return;
    var screen = document.querySelector('.teardown-screen');
    if (!screen) return;
    var col = screen.querySelector('.lg-center') || screen.querySelector('.ls-scroll');
    var pad = screen.querySelector('.lg-form-pad') || screen.querySelector('.ls-pad');
    if (!col || !pad) return;
    screen.style.removeProperty('--td-fit');
    try { delete screen.dataset.tdFit; } catch (e) {}
    try { col.scrollTop = 0; } catch (e) {}
    var pr = pad.getBoundingClientRect();
    var cr = col.getBoundingClientRect();
    if (!pr.height || !cr.height) return;
    if (pr.bottom <= cr.bottom + 0.5) { screen.style.removeProperty('--td-fit'); try { delete screen.dataset.tdFit; } catch (e) {} return; }
    var ratio = (cr.bottom - 8 - pr.top) / pr.height;
    if (!(ratio > 0)) ratio = 1;
    if (ratio >= 1) { screen.style.removeProperty('--td-fit'); try { delete screen.dataset.tdFit; } catch (e) {} }
    else { screen.style.setProperty('--td-fit', ratio.toFixed(3)); try { screen.dataset.tdFit = '1'; } catch (e) {} }
  } catch (e) {}
}

function tdReleaseOneFrame() {
  var d = document.querySelector('.teardown-detail');
  if (d) {
    d.style.removeProperty('height');
    d.style.removeProperty('min-height');
    d.style.removeProperty('max-height');
    d.style.removeProperty('overflow');
    d.style.removeProperty('display');
    d.style.removeProperty('flex-direction');
    d.style.removeProperty('transition');
  }
  document.documentElement.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('height');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('height');
  document.body.style.removeProperty('max-height');
  document.body.style.removeProperty('margin');
  document.body.classList.remove('td-detail-open');
  if (window.removeEventListener) { window.removeEventListener('resize', tdOnResize); }
}

function tdRender() {
  const root=$("#teardowns-root"); if(!root)return;
  // Force cleanup: remove all children explicitly to break references
  while (root.firstChild) { root.removeChild(root.firstChild); }
  // Force style recalc to flush pending animations
  void root.offsetHeight;
  root.innerHTML=teardownState.app?tdDetailView():teardownIndexView();
  tdPrepare();

  // Container-sized phone (2026-11-10, Worker B): the fit is pure CSS now, so
  // the old re-runs (animationend + 700ms timeout + double-rAF) that re-froze
  // the detail height are gone. One direct call runs the stale-inline cleanup
  // (tdEnforceOneFrame) and the Login form fit (tdFitLogin).
  try { if (teardownState.app) { tdEnforceOneFrame(); tdFitLogin(); } else { tdReleaseOneFrame(); } } catch(e) {}}
function tdOpen(key) { if(!TEARDOWNS[key])return; teardownState={app:key,selected:null,bounds:false}; tdGalleryOpen=false; tdRender(); window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"}); }
function tdBack() {
  try {
    tdGalleryOpen=false;
    teardownState={app:null,selected:null,bounds:false}; try { tdReleaseOneFrame(); } catch(e) {}
    document.body.classList.remove("td-sheet-open");
    var root = document.getElementById("teardowns-root");
    if (root) {
      // Use requestAnimationFrame to avoid blocking the UI
      requestAnimationFrame(function(){ tdRender(); });
    }
    window.scrollTo({top:0});
  } catch(e) {
    // Fallback: reload the list via router
    try { location.hash = "#/teardowns"; } catch(e2){}
  }
}
function tdSelect(id) { if(!teardownState.app || !tdIndex(TEARDOWNS[teardownState.app]).map[id])return; teardownState.selected=id; tdRender(); }

function tdToggleBounds() {}
function tdCopy() {
  const node=tdSelectedNode(); if(!node)return;
  const done=()=>{const b=$("[data-teardown-copy]");if(b){b.textContent="Copied ✓";b.classList.add("ok");window.setTimeout(()=>{if(document.contains(b)){b.textContent="Copy";b.classList.remove("ok");}},1300);}};
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(node.code).then(done).catch(done);
  else { const ta=document.createElement("textarea");ta.value=node.code;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");}catch(e){}ta.remove();done(); }
}
function initTeardowns() {
  const root=$("#teardowns-root"); if(!root)return;
  root.addEventListener("click",e=>{
    const open=e.target.closest("[data-teardown-open]"); if(open){tdOpen(open.dataset.teardownOpen);return;}
    if(e.target.closest("[data-teardown-index]")){tdBack();return;}
    if(e.target.closest("[data-teardown-close]")){tdClose();return;}
    if(e.target.closest("[data-teardown-bounds]")){tdToggleBounds();return;}
    if(e.target.closest("[data-teardown-copy]")){tdCopy();return;}
    const select=e.target.closest("[data-teardown-select]"); if(select){e.preventDefault();e.stopPropagation();tdSelect(select.dataset.teardownSelect);return;}
    if(teardownState.app){const hit=e.target.closest(false?".td-region":".td-region[data-node]");if(hit&&root.contains(hit)&&TEARDOWNS[teardownState.app].hotspots.includes(hit.dataset.node)){e.preventDefault();tdSelect(hit.dataset.node);}}
  });
  root.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".td-region[tabindex]")){e.preventDefault();tdSelect(e.target.dataset.node);}});
  onViewCleanup(()=>document.body.classList.remove("td-sheet-open"));
}


/* Interactive widget-tree canvas behavior. These assignments replace the earlier hotspot-only renderer. */

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


// tdPanel override removed (using new Flutter-inspector version);

tdDetailView = function() {
  const item=TEARDOWNS[teardownState.app];
  return `<div class="teardown-detail"><a class="td-back-link" href="#/teardowns" data-teardown-index>← All teardowns</a><div class="teardown-workbench"><div class="teardown-phone-stage">${tdScreenSwitcher()}<div class="teardown-phone"><div class="teardown-dynamic-island"></div><div class="td-active-label" id="td-active-label" hidden></div><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div></div>${tdPanel()}</div></div>`;
};

// Phase C: slider-pill screen switcher (detail) + screen switching.
function tdScreenSwitcher() {
  if (!teardownState.app) return "";
  var cur = TEARDOWNS[teardownState.app];
  if (!cur) return "";
  var name = cur.app === "Swiggy-style" ? "Swiggy" : cur.app;
  var screens = Object.entries(TEARDOWNS).filter(function(entry) { return entry[1].app === cur.app; });
  if (screens.length < 2) return "";
  return '<div class="td-switcher" role="tablist" aria-label="' + esc(name) + ' screens">'
    + '<span class="td-switcher-ind" aria-hidden="true"></span>'
    + screens.map(function(entry) {
        var key = entry[0], item = entry[1];
        var active = key === teardownState.app;
        return '<button type="button" role="tab" class="td-switcher-opt' + (active ? " is-active" : "") + '" data-teardown-switch="' + key + '" aria-selected="' + (active ? "true" : "false") + '">' + esc(item.screen) + '</button>';
      }).join("")
    + '</div>';
}
function tdPositionSwitcher() {
  var sw = document.querySelector(".td-switcher");
  if (!sw) return;
  var active = sw.querySelector(".td-switcher-opt.is-active");
  var ind = sw.querySelector(".td-switcher-ind");
  if (!active || !ind) return;
  var left = active.offsetLeft, w = active.offsetWidth;
  var flip = window.__tdSwitchFlip; window.__tdSwitchFlip = null;
  if (flip) {
    /* Screen switch. The indicator element is brand new (tdRender rebuilt
       the detail), so a snap+target in this same task never animates: the
       browser has never painted the element, so it treats the target as its
       initial style and the pill jumps. Instead: snap to the OLD option now
       (transition off) so the first paint shows the pill where it was, then
       glide to the new option on the frame AFTER that paint (double rAF),
       when the element has a painted state to transition from. A newer
       switch cancels a pending glide by replacing its target. */
    window.__tdSwitchTarget = { left: left, width: w };
    ind.style.transition = "none";
    ind.style.width = flip.width + "px";
    ind.style.transform = "translateX(" + flip.left + "px)";
    void ind.offsetWidth;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var ind2 = document.querySelector(".td-switcher-ind");
        var tgt = window.__tdSwitchTarget; window.__tdSwitchTarget = null;
        if (!ind2 || !tgt) return;
        ind2.style.transition = "";
        ind2.style.width = tgt.width + "px";
        ind2.style.transform = "translateX(" + tgt.left + "px)";
      });
    });
    return;
  }
  /* A switch glide is in flight; don't disturb it. */
  if (window.__tdSwitchTarget) return;
  /* No switch (first mount, selection re-render, resize): place the
     indicator at the active option with no animation. */
  ind.style.transition = "none";
  ind.style.width = w + "px";
  ind.style.transform = "translateX(" + left + "px)";
  void ind.offsetWidth;
  ind.style.transition = "";
}
/* Screen-swap fade: runs only right after a screen switch (flag set by
   tdSwitchScreen), so the phone content crossfades subtly instead of
   popping. Never runs on first load. */
function tdScreenSwapIn() {
  if (!window.__tdScreenSwap) return;
  window.__tdScreenSwap = null;
  var sc = document.querySelector(".teardown-screen");
  if (!sc) return;
  sc.classList.add("td-screen-swap");
  setTimeout(function(){ try{ sc.classList.remove("td-screen-swap"); }catch(e){} }, 300);
}
function tdSwitchScreen(key) {
  if (!TEARDOWNS[key] || key === teardownState.app) return;
  /* FLIP: remember the pill indicator's current geometry BEFORE the
     re-render destroys it, so tdPositionSwitcher can glide the pill from
     the old option to the new one. Without this the fresh indicator starts
     at the CSS default (width 0, translateX 0) and the pill collapses and
     regrows from the left edge on every switch. */
  try {
    var sw0 = document.querySelector(".td-switcher");
    var act0 = sw0 && sw0.querySelector(".td-switcher-opt.is-active");
    if (act0) window.__tdSwitchFlip = { left: act0.offsetLeft, width: act0.offsetWidth };
  } catch (e) {}
  window.__tdScreenSwap = true;
  try { if (typeof tdDismissPopout === "function") tdDismissPopout(); } catch (e) {}
  tdGalleryOpen = false;
  teardownState.app = key;
  teardownState.selected = null;
  teardownState.sheet = null;
  teardownState.bounds = false;
  teardownState.view = null;
  teardownState.animateFrom = null;
  if (teardownState.collapsed) teardownState.collapsed.clear();
  document.body.classList.remove("td-sheet-open");
  var d = document.querySelector(".teardown-detail");
  if (d) { d.classList.remove("td-split"); d.classList.remove("td-sheet-open"); d.classList.remove("td-sheet-peek"); }
  tdRender(false);
}

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
  try{ if(typeof tdApplyLayout==="function") tdApplyLayout(); }catch(e){}
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
  const stage=root.querySelector(".teardown-phone-stage");if(stage)stage.classList.toggle("show-bounds",false);
  tdBindCanvas();tdApplyView();tdSyncSelection();
};
tdRender = function(keepView) {
  const root=$("#teardowns-root");if(!root)return;
  const previous=keepView?teardownState.view:null;
  root.innerHTML=teardownState.app?tdDetailView():teardownIndexView();
  teardownState.view=previous;tdPrepare();
  requestAnimationFrame(function(){ try{ tdPositionSwitcher(); }catch(e){} try{ tdScreenSwapIn(); }catch(e){} });
  // Single-frame detail view: hide the footer + bottom padding on mobile
  // (body.td-detail-open) so the page does not scroll past the viewport.
  try { document.body.classList.toggle("td-detail-open", !!teardownState.app); } catch(e) {}
  if(teardownState.app&&!previous)requestAnimationFrame(tdFitTree);
  // Container-sized phone (2026-11-10, Worker B): same as the first tdRender()
  // — the old animationend + 700ms + double-rAF re-runs are gone; one direct
  // call runs the stale-inline cleanup and the Login form fit.
  try { if (teardownState.app) { tdEnforceOneFrame(); tdFitLogin(); } else { tdReleaseOneFrame(); } } catch(e) {}
};
tdOpen = function(key) {
  if(!TEARDOWNS[key])return;
  teardownState={app:key,selected:null,bounds:false,collapsed:new Set(),view:null,layout:null,animateFrom:null}; tdGalleryOpen=false;
  tdRender(false);window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"});
};
tdBack = function(){ try { if(typeof tdDismissPopout==="function") tdDismissPopout(); tdGalleryOpen=false; teardownState.app=null; teardownState.selected=null; teardownState.view=null; if(teardownState.collapsed) teardownState.collapsed.clear(); try { tdReleaseOneFrame(); } catch(e) {} document.body.classList.remove("td-sheet-open"); if(typeof tdRender==="function") tdRender(false); window.scrollTo({top:0,behavior:"smooth"}); } catch(e){ console.error("tdBack failed:", e); location.hash="#/teardowns"; location.reload(); } };
tdSelect = function(id){if(!teardownState.app)return;teardownState.selected=id;if(window.innerWidth<=900)teardownState.sheet="open";tdSyncSelection();};
function tdRealSnapshot(regionEl, boxW, boxH, allowWide) {
  if (!regionEl) return null;
  var w = regionEl.offsetWidth, h = regionEl.offsetHeight;
  if (!w || !h) { w = 48; h = 48; }
  var clone = regionEl.cloneNode(true);
  var strip = function(el){
    if (!el || !el.removeAttribute) return;
    el.removeAttribute("id");
    el.removeAttribute("data-node");
    if (el.classList) {
      el.classList.remove("td-active");
      el.classList.remove("td-highlight");
    }
  };
  strip(clone);
  var all = clone.querySelectorAll("*");
  for (var i = 0; i < all.length; i++) strip(all[i]);
  // Keep the element's measured box, in flow, with no absolute offset.
  var cs = null;
  try { cs = window.getComputedStyle(regionEl); } catch (e) {}
  if (cs && (cs.position === "absolute" || cs.position === "fixed")) {
    clone.style.position = "relative";
    clone.style.top = "auto";
    clone.style.left = "auto";
    clone.style.right = "auto";
    clone.style.bottom = "auto";
  }
  clone.style.width = w + "px";
  clone.style.height = h + "px";
  clone.style.flex = "none";
  clone.style.margin = "0";
  clone.style.boxSizing = "border-box";
  clone.style.pointerEvents = "none";
  // Size-lock: the clone keeps its mock classes, but its containing block
  // in the snapshot is the narrow .td-snap-scale (w px), NOT the phone's
  // row/column. A percentage max-width rule (e.g. .wa-bubble's 82%) then
  // resolves against w and shrinks the clone below its measured size:
  // the bubble rendered 117px instead of 143px, its text wrapped to two
  // lines and spilled out of the fixed 26px height. Lock the clone to
  // exactly its measured box so it renders as in the phone.
  clone.style.maxWidth = "none";
  clone.style.minWidth = "0";
  clone.style.maxHeight = "none";
  clone.style.minHeight = "0";
  // Effective background: a region cloned alone loses the background its
  // ancestors provided (e.g. white text on the orange offer Card becomes
  // white-on-white and invisible). Carry the nearest non-transparent
  // background colour down onto the clone so text stays readable exactly
  // as in the phone. The walk starts at the region itself, so a region
  // with its own background keeps it; a gradient background-image is
  // untouched (the colour only paints underneath it).
  try {
    var bgEl = regionEl, bg = null;
    while (bgEl && bgEl.classList && !bgEl.classList.contains("teardown-screen")) {
      var bgc = window.getComputedStyle(bgEl).backgroundColor;
      if (bgc && bgc !== "rgba(0, 0, 0, 0)" && bgc !== "transparent") { bg = bgc; break; }
      bgEl = bgEl.parentElement;
    }
    if (bg) clone.style.backgroundColor = bg;
  } catch (e) {}
  // Inline elements (span, b, a, ...) ignore width/height, so their text can
  // re-wrap inside the snapshot box by a sub-pixel and split into separate
  // per-line outlines, leaving the card blank or unreadable. Give the clone
  // the block-level equivalent of its display so the measured size applies,
  // and keep single-line text on one line (nowrap) so it cannot wrap.
  // Computed display alone cannot tell: a flex-item span reports "block"
  // while behaving inline once cloned, so a "block" element whose parent is
  // flex/grid is pinned to block too.
  if (cs) {
    var disp = cs.display || "";
    var blockDisp = null;
    if (disp === "inline" || disp === "inline-block") blockDisp = "block";
    else if (disp === "inline-flex") blockDisp = "flex";
    else if (disp === "inline-grid") blockDisp = "grid";
    else if (disp === "inline-table") blockDisp = "table";
    else if (disp === "block") {
      var par = regionEl.parentElement, pd = "";
      if (par) { try { pd = getComputedStyle(par).display || ""; } catch (e) {} }
      if (pd === "flex" || pd === "inline-flex" || pd === "grid" || pd === "inline-grid") blockDisp = "block";
    }
    if (blockDisp) {
      clone.style.display = blockDisp;
      var lh = parseFloat(cs.lineHeight);
      if (!lh || isNaN(lh)) { var fs = parseFloat(cs.fontSize); lh = (fs && !isNaN(fs)) ? fs * 1.2 : h; }
      if (h <= lh * 1.6) {
        clone.style.whiteSpace = "nowrap";
        // Inline elements (span, b) report offsetHeight as the font's
        // content height, which is SHORTER than the line box (line-height):
        // e.g. a 9px span measures 10px tall but its line box is 12.6px.
        // A block fixed to that height lets its single line box overflow
        // vertically (scrollHeight 13 in a 10px box). Grow the clone to
        // the line height so the line box fits exactly.
        if (lh > h) { h = lh; clone.style.height = h + "px"; }
      }
    }
  }
  // Fit to ~88% of the card box (not edge-to-edge) so the widget's own box
  // sits visibly inset from the card frame: the blue outline reads as the
  // widget's box, and a Card's border/shadow shows against the card
  // background instead of touching the frame. Parent and child boxes that
  // differ only by a few px then read as different insets.
  // Wide elements (bars, offer cards, long text, aspect > 2) whose standard
  // fit would shrink them below readability (scale < 0.7) may grow toward
  // 300px wide so their text stays readable instead of shrinking to a thin
  // unreadable strip; tdShowPicker resizes the card box to fit. The wide
  // scale never exceeds 1.0 (never larger than the phone) and keeps the
  // 0.95 fit so the snapshot stays visibly inset.
  var s0 = Math.min(boxW / w, boxH / h, 2.5) * 0.88;
  var aspect = (h > 0) ? (w / h) : 1;
  var wide = !!allowWide && aspect > 2 && s0 < 0.7;
  var s = wide ? Math.min(300 / w, boxH / h, 1.0) * 0.95 : s0;
  if (!(s > 0) || !isFinite(s)) s = 1;
  // Blue outline around THIS widget's own box, width compensated for the
  // scale so it reads ~2px on screen at any zoom; offset OUTSIDE the box
  // so it never clips the widget's own content (a Text glyph starts at
  // the box edge and the old inset outline cut its first pixels). The
  // 88%/95% fit leaves room around the snapshot for the outline.
  var ow = Math.min(12, Math.max(1, 2 / s));
  clone.style.outline = ow + "px solid #2563eb";
  clone.style.outlineOffset = ow + "px";
  var wrap = document.createElement("div");
  wrap.className = "td-snap";
  wrap.style.width = Math.max(1, Math.round(w * s)) + "px";
  wrap.style.height = Math.max(1, Math.round(h * s)) + "px";
  var inner = document.createElement("div");
  inner.className = "td-snap-scale";
  inner.style.width = w + "px";
  inner.style.height = h + "px";
  inner.style.transform = "scale(" + s + ")";
  // Ancestor-class chain (fixes text overlap / wrapping in snapshots):
  // mock CSS scopes layout rules under ancestor classes (e.g. ".sw-offer
  // span", ".wa-bubble > .td-region[data-widget=Text]"). A region cloned
  // alone loses those ancestors, so its children fall back to inline flow
  // and overlap. Rebuild the ancestor chain as display:contents links
  // carrying the real ancestors' classes (no box of their own), so every
  // scoped rule matches exactly as in the phone.
  var host = inner;
  var anc = regionEl.parentElement;
  var links = [];
  while (anc && anc.classList && !anc.classList.contains("teardown-screen")) {
    if (anc.className && typeof anc.className === "string" && anc.className) {
      var link = document.createElement("div");
      link.className = anc.className;
      if (link.classList) { link.classList.remove("td-active"); link.classList.remove("td-highlight"); }
      link.style.display = "contents";
      links.push(link);
    }
    anc = anc.parentElement;
  }
  for (var li = links.length - 1; li >= 0; li--) { host.appendChild(links[li]); host = links[li]; }
  host.appendChild(clone);
  wrap.appendChild(inner);
  return wrap;
}

function tdShowPicker(stack, x, y) {
  // Snapshot picker, restored 2026-11-10 (WORKER A) from the live-site ZIP:
  // each widget lifts out as its own real-UI snapshot card, filtered and
  // uniformly sized, with search filter, name-only labels, and depth
  // indentation in the vertical layout. The centred dialog (cleanup round)
  // is gone; the Phase 5 beside-phone flip was never in this build and is
  // not restored. The row is centred on the viewport by centrePickerRow()
  // below — the ZIP's centring logic, renamed (the old name is a
  // removed-generation marker and must stay at 0 occurrences).
  tdDismissPopout();
  // Filter out huge parents (more than 40% of phone area) - not what user wants
  var phone = document.querySelector(".teardown-phone");
  var phoneArea = phone ? phone.getBoundingClientRect().width * phone.getBoundingClientRect().height : 100000;
  var filtered = stack.filter(function(r){
    var rect = r.getBoundingClientRect();
    var area = rect.width * rect.height;
    return area < phoneArea * 0.4;
  });
  if (!filtered.length) filtered = stack.slice(0, 3); // fallback to 3 smallest
  // Sort by size (smallest first)
  filtered.sort(function(a, b){
    var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return (ra.width * ra.height) - (rb.width * rb.height);
  });
  var layer = document.createElement("div");
  layer.id = "td-popout-layer";
  layer.innerHTML = '<div class="td-popout-backdrop"></div>'
    + '<div class="td-popout-search"><input class="td-popout-search-input" type="search" placeholder="Search widgets\u2026" aria-label="Search widgets" autocomplete="off"></div>'
    + '<div class="td-popout-stage"></div>'
    + '<div class="td-popout-empty" hidden><p class="td-popout-empty-title">No widgets match</p><p class="td-popout-empty-sub">Try a different search.</p><button type="button" class="td-popout-empty-clear">Clear search</button></div>'
    + '<button class="td-popout-close" aria-label="Close">\u00d7</button>';
  layer.querySelector(".td-popout-close").addEventListener("click", function(e){ e.stopPropagation(); tdDismissPopout(); });
  document.body.appendChild(layer);
  var stage = layer.querySelector(".td-popout-stage");
  var searchInput = layer.querySelector(".td-popout-search-input");
  var emptyState = layer.querySelector(".td-popout-empty");
  var idx = tdIndex(TEARDOWNS[teardownState.app]);
  var n = filtered.length;
  // Smart layout: use vertical if horizontal cards won't fit comfortably
  // Each card ~150px + 20px gap; need 85% of viewport for comfortable fit
  var cardWidth = 170;
  var needsVertical = (n * cardWidth) > (window.innerWidth * 0.85);
  // Also use vertical on small screens regardless
  if (window.innerWidth < 600) needsVertical = true;
  if (needsVertical) stage.classList.add("td-vertical");
  // Smart layout: vertical list on mobile, horizontal row on desktop
  var isMobile = window.innerWidth < 760;
  var useVertical = isMobile; // vertical list on mobile, horizontal row on desktop

  // Horizontal layout: measure each visible card's real width (wide cards
  // are wider) and lay them out sequentially with a gap, centred as a
  // group. Items are translate(-50%,-50%), so left is the card's centre.
  var centrePickerRow = function(visible){
    if (useVertical) return;
    var gap = 24;
    var widths = visible.map(function(it){ return it.offsetWidth || 170; });
    var totalW = widths.reduce(function(a, b){ return a + b; }, 0) + gap * Math.max(0, visible.length - 1);
    if (totalW > window.innerWidth - 40) gap = 12;
    totalW = widths.reduce(function(a, b){ return a + b; }, 0) + gap * Math.max(0, visible.length - 1);
    var cx = Math.max(0, (window.innerWidth - totalW) / 2);
    visible.forEach(function(it, i){
      var w = widths[i];
      it.style.left = (cx + w / 2) + "px";
      it.style.top = (window.innerHeight / 2) + "px";
      cx += w + gap;
    });
  };

  var cards = []; // { item, nameLower }
  filtered.forEach(function(r, i){
    var nodeId = r.dataset.node;
    var node = idx.map[nodeId];
    var name = node ? node.name : nodeId;
    // Path is used for the depth indent only; the label shows the widget
    // name alone (parent path removed per user request).
    var path = tdPath(teardownState.app, nodeId);
    // Depth in the tree (root = 0); capped at 5 levels = 50px indent.
    var depth = Math.max(0, path.length - 1);
    var indent = Math.min(depth, 5) * 10;
    // Real-UI snapshot (2026-11-08): the card shows THIS widget's own
    // rendered element from the phone mock — never an abstract diagram,
    // never the tapped region cloned for every card.
    var item = document.createElement("div");
    item.className = "td-popout-item";
    item.dataset.popoutNode = nodeId;
    if (useVertical) {
      // Vertical stack, centered, scrollable; deeper widgets sit further
      // right. The shift is a CSS variable so the existing vertical rule
      // (left:auto !important) still wins the layout slot and only the
      // visual position moves -- see .td-popout-item in styles.css.
      item.style.setProperty("--td-indent", indent + "px");
      // Vertical stack, centered, scrollable
      item.style.left = "50%";
      item.style.top = "auto";
      item.style.position = "relative";
      item.style.transform = "none";
      item.style.margin = "8px auto";
    } else {
      // Horizontal: left is set by centrePickerRow() after all cards are
      // built (it measures real card widths, so wide cards don't overlap).
      item.style.top = (window.innerHeight / 2) + "px";
    }
    item.innerHTML = '<div class="td-popout-box"><div class="td-popout-widget"></div></div>'
      + '<div class="td-popout-label"><span class="td-popout-label-name">' + esc(name) + '</span></div>';
    stage.appendChild(item);
    // Fill the card with the widget's own real UI, scaled to fit the box.
    var boxEl = item.querySelector(".td-popout-box");
    var bw = (boxEl && boxEl.clientWidth) || 150;
    var bh = (boxEl && boxEl.clientHeight) || 110;
    var snap = tdRealSnapshot(r, bw, bh, true);
    if (snap) item.querySelector(".td-popout-widget").appendChild(snap);
    // Wide snapshots (bars, offer cards, long text) grow the card box to
    // fit so the snapshot is not a thin unreadable strip in a mostly empty
    // box. In the vertical (mobile) layout the depth indent is dropped for
    // a resized card so it cannot push the wide box past the viewport edge.
    if (snap) {
      var sw2 = snap.offsetWidth, sh2 = snap.offsetHeight;
      if (sw2 > bw || sh2 > bh) {
        boxEl.style.width = Math.min(320, sw2 + 16) + "px";
        boxEl.style.height = Math.min(160, sh2 + 16) + "px";
        if (useVertical) item.style.setProperty("--td-indent", "0px");
      }
    }
    cards.push({ item: item, nameLower: String(name).toLowerCase() });
    item.addEventListener("click", function(ev){
      ev.stopPropagation();
      tdDismissPopout();
      tdSelect(nodeId);
    });
  });

  // Position the horizontal row now that every card (and wide box) exists.
  centrePickerRow(cards.map(function(c){ return c.item; }));

  // Live search: case-insensitive match on the widget NAME only, over the
  // cards currently in the picker (the stack at the tap point). Empty
  // input restores every card. Shows the empty state when nothing matches.
  var applyFilter = function(q){
    var query = String(q == null ? "" : q).trim().toLowerCase();
    var visible = [];
    cards.forEach(function(c){
      var show = !query || c.nameLower.indexOf(query) !== -1;
      c.item.style.display = show ? "" : "none";
      if (show) visible.push(c.item);
    });
    centrePickerRow(visible);
    if (emptyState) emptyState.hidden = visible.length !== 0;
  };
  var clearSearch = function(focusBack){
    if (searchInput) searchInput.value = "";
    applyFilter("");
    if (focusBack && searchInput && !isMobile) {
      try { searchInput.focus(); } catch (e) {}
    }
  };
  if (searchInput) {
    searchInput.addEventListener("input", function(){ applyFilter(searchInput.value); });
    // Autofocus on desktop only: on mobile it would pop the keyboard.
    if (!isMobile) {
      try { searchInput.focus(); } catch (e) {}
    }
  }
  var clearBtn = layer.querySelector(".td-popout-empty-clear");
  if (clearBtn) clearBtn.addEventListener("click", function(e){ e.stopPropagation(); clearSearch(true); });

  layer.querySelector(".td-popout-backdrop").addEventListener("click", tdDismissPopout);
  // Close when clicking empty space on the stage (not on a card)
  stage.addEventListener("click", function(e){
    if (e.target === stage) tdDismissPopout();
  });
  // Escape to dismiss
  var escHandler = function(e) {
    if (e.key === "Escape") {
      tdDismissPopout();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
  // Store handler for cleanup
  layer._escHandler = escHandler;
}

function tdDismissPopout() {
  var l = document.getElementById("td-popout-layer");
  if (!l) {
    document.querySelectorAll(".td-pick-badge").forEach(function(b){ b.remove(); });
    return;
  }
  if (l.classList.contains("td-popout-layer-closing")) return;
  l.classList.add("td-popout-layer-closing");
  setTimeout(function(){
    var el = document.getElementById("td-popout-layer");
    if (el) el.remove();
    document.querySelectorAll(".td-pick-badge").forEach(function(b){ b.remove(); });
  }, 200);
}
function tdClose(){
  var detail = document.querySelector(".teardown-detail");
  var panel = detail ? detail.querySelector(".teardown-panel:not(.is-empty)") : null;
  var reduced = mqMatches("(prefers-reduced-motion: reduce)");
  if (panel && !reduced && !panel.classList.contains("td-closing")) {
    /* Symmetric close: the panel exits with the EXACT reverse of the open
       animation (same .45s easing) AND the phone slides back to centre at the
       same moment — the two run together, like the open. The old code waited
       280ms with no exit animation (the panel just sat there, then the phone
       snapped back) and the panel's exit used the mobile sheet-down animation
       on desktop, which jumped it left 50% and dropped it off the bottom —
       that was the glitch.
       How the concurrency works on desktop: the panel is pinned in place as
       an absolute overlay (so it leaves the flex flow and the phone's natural
       position becomes centred) while it plays its exit animation; the phone
       is FLIPped from its split position to centre over the same .45s. On
       mobile the panel is a fixed bottom sheet, so it slides down (its
       transform transitions to 105%) while the phone grows back — the sheet
       classes are removed here so both run together over the same .45s. */
    var stage = detail ? detail.querySelector(".teardown-phone-stage") : null;
    var workbench = detail ? detail.querySelector(".teardown-workbench") : null;
    var isDesktop = window.innerWidth > 900;
    var flipFrom = (isDesktop && stage) ? stage.getBoundingClientRect() : null;
    var wbRect = (isDesktop && workbench) ? workbench.getBoundingClientRect() : null;
    var pRect = panel.getBoundingClientRect();
    if (isDesktop && wbRect) {
      panel.style.position = "absolute";
      panel.style.top = (pRect.top - wbRect.top) + "px";
      panel.style.left = (pRect.left - wbRect.left) + "px";
      panel.style.width = pRect.width + "px";
      panel.style.height = pRect.height + "px";
      panel.style.margin = "0";
    }
    panel.classList.add("td-closing");
    teardownState.selected = null;
    teardownState.sheet = null;
    document.body.classList.remove("td-sheet-open");
    if (detail) { detail.classList.remove("td-split"); detail.classList.remove("td-sheet-open"); detail.classList.remove("td-sheet-peek"); }
    if (isDesktop && stage && flipFrom) {
      var flipTo = stage.getBoundingClientRect();
      var dx = flipFrom.left - flipTo.left;
      if (Math.abs(dx) > 2) {
        stage.style.transition = "none";
        stage.style.transform = "translateX(" + dx + "px)";
        void stage.offsetWidth;
        stage.style.transition = "";
        stage.style.transform = "";
        setTimeout(function(){ if(stage) stage.style.transform = ""; }, 600);
      }
    }
    // Only touch THIS panel in the timeout: if the user picked another widget
    // mid-close, tdSyncSelection has already replaced this panel (it is
    // disconnected), so leave the new one alone.
    var closingPanel = panel;
    setTimeout(function(){
      if (closingPanel.isConnected && closingPanel.classList.contains("td-closing")) {
        var empty = document.createElement('aside');
        empty.className = 'teardown-panel is-empty';
        empty.innerHTML = '<div><h3>Select a widget</h3><p>Tap any part of the app to inspect it.</p></div>';
        closingPanel.replaceWith(empty);
        document.querySelectorAll('.td-active').forEach(function(el){ el.classList.remove('td-active'); });
      }
    }, 450);
  } else {
    teardownState.selected=null;
    teardownState.sheet=null;
    document.body.classList.remove("td-sheet-open");
    var d2 = document.querySelector(".teardown-detail");
    if (d2) { d2.classList.remove("td-split"); d2.classList.remove("td-sheet-open"); d2.classList.remove("td-sheet-peek"); }
    // Surgical: replace panel with empty state
    var p2 = document.querySelector(".teardown-detail .teardown-panel:not(.is-empty)");
    if(p2){
      var e2 = document.createElement('aside');
      e2.className = 'teardown-panel is-empty';
      e2.innerHTML = '<div><h3>Select a widget</h3><p>Tap any part of the app to inspect it.</p></div>';
      p2.replaceWith(e2);
    }
    document.querySelectorAll('.td-active').forEach(function(el){ el.classList.remove('td-active'); });
    try{ if(typeof tdApplyLayout==="function") tdApplyLayout(); }catch(e){}
  }
};
/* Teardown inspector layout (2026-11-07, approved solution):
   Desktop (>900px): phone slides left, description opens on the right (td-split).
   Mobile (<=900px): the description is a bottom sheet + the phone shrinks
   (user's solution 2026-11-07 — replaces the full-screen push).
   Selection logic is untouched — this only arranges the phone and the panel. */
/* Selected-widget name label (2026-11-08): the old CSS ::after label clipped
   whenever the widget sat near the phone's right edge (the screen's
   overflow:hidden cut up to 36px — the user saw "Ci" for "CircleAvatar").
   The label is now a real element inside .teardown-phone, positioned here and
   clamped inside the phone screen rect, so the full name is always readable.
   Hidden while the phone is shrunk (mobile sheet open) — it would be tiny —
   and when the widget is scrolled out of view. Re-run on phone scroll and
   window resize via the guarded listeners installed below. */
function tdPositionLabel(){
  var label = document.getElementById('td-active-label');
  if(!label) return;
  var detail = document.querySelector('.teardown-detail');
  var region = detail ? detail.querySelector('.td-region.td-active') : null;
  var phone = detail ? detail.querySelector('.teardown-phone') : null;
  var screen = detail ? detail.querySelector('.teardown-screen') : null;
  if(!region || !phone || !screen || !teardownState || !teardownState.selected){ label.hidden = true; return; }
  if(detail.classList.contains('td-sheet-open')){ label.hidden = true; return; }
  var wr = region.getBoundingClientRect();
  var pr = phone.getBoundingClientRect();
  var sr = screen.getBoundingClientRect();
  if(wr.bottom <= sr.top + 1 || wr.top >= sr.bottom - 1 || wr.right <= sr.left + 1 || wr.left >= sr.right - 1){ label.hidden = true; return; }
  var scale = (phone.offsetWidth && pr.width) ? (pr.width / phone.offsetWidth) : 1;
  if(!(scale > 0)) scale = 1;
  label.textContent = region.dataset.widget || '';
  label.hidden = false;
  var lw = label.offsetWidth, lh = label.offsetHeight;
  var lx = (wr.left - pr.left) / scale + 8;
  var ly = (wr.top - pr.top) / scale - lh / 2;
  var minX = (sr.left - pr.left) / scale + 4;
  var maxX = (sr.right - pr.left) / scale - lw - 4;
  if(maxX < minX){ lx = minX; } else { lx = Math.max(minX, Math.min(maxX, lx)); }
  var minY = (sr.top - pr.top) / scale + 4;
  if(ly < minY){ ly = Math.max(minY, (wr.top - pr.top) / scale + 4); }
  var maxY = (sr.bottom - pr.top) / scale - lh - 4;
  if(ly > maxY){ ly = Math.min(maxY, Math.max(minY, (wr.bottom - pr.top) / scale - lh - 4)); }
  // hard clamp: when the widget is only partly visible (scrolled), the label
  // must still sit inside the screen, never float above/below the phone
  ly = Math.max(minY, Math.min(maxY, ly));
  label.style.left = Math.round(lx) + 'px';
  label.style.top = Math.round(ly) + 'px';
  if(!window.__ffTdLabelListeners){
    window.__ffTdLabelListeners = 1;
    document.addEventListener('scroll', function(e){
      if(e.target && e.target.closest && e.target.closest('.teardown-screen')){ try{ tdPositionLabel(); }catch(err){} }
    }, true);
    window.addEventListener('resize', function(){ try{ tdPositionLabel(); }catch(err){} });
  }
}
function tdApplyLayout(){
  var d = document.querySelector(".teardown-detail"); if(!d) return;
  var isDesktop = window.innerWidth > 900;
  var hasSel = !!(typeof teardownState!=="undefined" && teardownState && teardownState.app && teardownState.selected);
  var wasSplit = d.classList.contains("td-split");
  var willSplit = isDesktop && hasSel;
  var stage = d.querySelector(".teardown-phone-stage");
  /* FLIP the phone slide (desktop only): the split layout is a centred flex
     row now, so the phone's new position is measured, not guessed. When the
     split state changes, record where the phone is, flip the layout, then
     animate the phone from its old spot to its new spot. This keeps the slide
     smooth AND the phone+panel group centred at every viewport width. */
  var flipFrom = null;
  var reduceMotion = false;
  try{ reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}
  if(isDesktop && stage && wasSplit !== willSplit && !reduceMotion){
    try{ flipFrom = stage.getBoundingClientRect(); }catch(e){ flipFrom = null; }
  }
  d.classList.toggle("td-split", willSplit);
  /* Mobile sheet (<=900px, user's solution 2026-11-07): the description is a
     bottom sheet; open = fully up + phone shrunk, peek = only the 28px
     swipe-up indicator visible + phone full size. The classes drive the CSS
     transforms (.45s, same easing as the desktop slide). */
  var sheet = (!isDesktop && hasSel) ? (teardownState.sheet || "open") : null;
  var wasOpen = d.classList.contains("td-sheet-open");
  var wasPeek = d.classList.contains("td-sheet-peek");
  d.classList.toggle("td-sheet-open", sheet === "open");
  d.classList.toggle("td-sheet-peek", sheet === "peek");
  /* Fresh open (was closed, now open): slide the sheet up from the bottom.
     The panel is re-rendered on every selection, so a plain CSS enter
     animation would replay on re-select; instead, start it off-screen and
     let the .45s transform transition carry it up. Re-select (already open)
     and peek->open (class change) animate via the transition, no JS needed. */
  if (!isDesktop && sheet === "open" && !wasOpen && !wasPeek) {
    var sheetPanel = d.querySelector(".teardown-panel:not(.is-empty)");
    if (sheetPanel) {
      sheetPanel.style.transition = "none";
      sheetPanel.style.transform = "translateY(105%)";
      void sheetPanel.offsetWidth;
      sheetPanel.style.transition = "";
      sheetPanel.style.transform = "";
    }
  }
  if(flipFrom && stage){
    try{
      var flipTo = stage.getBoundingClientRect();
      var dx = flipFrom.left - flipTo.left;
      if(Math.abs(dx) > 2){
        stage.style.transition = "none";
        stage.style.transform = "translateX(" + dx + "px)";
        void stage.offsetWidth;
        stage.style.transition = "";
        stage.style.transform = "";
        setTimeout(function(){ if(stage) stage.style.transform = ""; }, 600);
      }
    }catch(e){}
  }
  try{ if(typeof tdPositionLabel==="function") tdPositionLabel(); }catch(e){}
  try{ if(typeof tdPositionSwitcher==="function") tdPositionSwitcher(); }catch(e){}
}
/* Mobile sheet state (2026-11-07): peek = phone grows big, sheet drops to the
   28px swipe-up indicator; open = phone shrinks to the top, sheet slides fully up.
   Desktop is untouched (no sheet there). */
function tdSheetPeek(){ if(window.innerWidth>900)return; if(!teardownState.selected)return; teardownState.sheet="peek"; tdApplyLayout(); }
function tdSheetOpen(){ if(window.innerWidth>900)return; if(!teardownState.selected)return; teardownState.sheet="open"; tdApplyLayout(); }
/* tdStackFront removed (2026-11-07): the mobile stack is gone; the
   description is a bottom sheet + shrinking phone now, so there is no
   front/back layer to swap. */
if(!window.__ffTdLayoutResize){
  window.__ffTdLayoutResize = 1;
  window.addEventListener("resize", function(){
    try{ if(typeof teardownState!=="undefined" && teardownState && teardownState.app) tdApplyLayout(); }catch(e){}
  });
}
/* Search-open re-measure (2026-11-10, WORKER 1b): expanding/collapsing the
   nav search adds/removes 52px of #app padding-top, moving the detail's real
   top offset — but tdEnforceOneFrame only runs on window resize, so its
   pixel height went stale and the detail + panel bottom ran past the
   viewport (measured 1366x768: detail bottom 808 > 768). Re-measure whenever
   body.mobile-search-open toggles while a teardown is open; the CSS rules
   above shrink the phone itself, this re-fit keeps the detail + panel inside
   the viewport too. Filtered to actual toggles only, so theme changes and
   other class churn never re-run it. */
if(!window.__ffTdSearchObs){
  window.__ffTdSearchObs = 1;
  var __tdSearchOpen = document.body.classList.contains("mobile-search-open");
  new MutationObserver(function(){
    var now = document.body.classList.contains("mobile-search-open");
    if(now === __tdSearchOpen) return;
    __tdSearchOpen = now;
    try{ if(typeof teardownState!=="undefined" && teardownState && teardownState.app) tdEnforceOneFrame(); }catch(e){}
  }).observe(document.body, { attributes:true, attributeFilter:["class"] });
}
tdToggleBounds = function(){};
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


// Note: teardown clicks are handled by document-level delegation below.
// (Removed MutationObserver-based initTeardowns which caused exponential
//  listener growth: every innerHTML render triggered the observer, which
//  re-added root click listeners, leading to slowdown/freeze after repeats.)

// Document-level click delegation for all teardown interactions
// (single handler, no duplicates, works regardless of render timing)
document.addEventListener("click", function(e){
  if (!e.target.closest || !document.getElementById("teardowns-root")) return;
  var t = e.target;
  // Ignore the click that follows a sheet drag (the drag already snapped the
  // sheet to its state); only for clicks inside the teardown detail.
  if (window.__tdSheetSuppressClick && window.__tdSheetSuppressClick()) {
    var inTd = t.closest ? (t.closest(".teardown-detail") || t.closest(".teardown-panel")) : null;
    if (inTd) return;
  }
  var open = t.closest("[data-teardown-open]");
  if (open && typeof tdOpen === "function") { e.preventDefault(); tdOpen(open.dataset.teardownOpen); return; }
  // Phase 5: filter chips (concept .chip). Document-level so the wiring
  // survives tdRender re-renders (bindView does not run on tdBack).
  var chip = t.closest("[data-td-cat]");
  if (chip && typeof tdApplyListFilters === "function") {
    e.preventDefault();
    document.querySelectorAll(".td-chip").forEach(function(c) {
      var on = c === chip;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    window.__tdCat = chip.dataset.tdCat;
    tdApplyListFilters();
    return;
  }
  var sel = t.closest("[data-teardown-select]");
  if (sel && typeof tdSelect === "function") { e.preventDefault(); e.stopPropagation(); tdSelect(sel.dataset.teardownSelect); return; }
  // Screen switcher (Phase C): the pill above the phone switches the app's
  // screen. Must run here, before the picker block below (region taps
  // stopPropagation) and before the mobile phone-tap branch (the switcher
  // lives inside .teardown-phone-stage, which that branch also matches).
  var swt = t.closest("[data-teardown-switch]");
  if (swt && typeof tdSwitchScreen === "function") { e.preventDefault(); tdSwitchScreen(swt.dataset.teardownSwitch); return; }
  // (Mobile stack tap-to-front removed 2026-11-07 with the stack itself.)
  // Amazon Product gallery: tapping the hero image opens the full-screen
  // gallery (and the gallery close returns). Must run here, before the
  // picker handler below, which stopPropagation()s every region tap.
  if (teardownState.app === "amazon-product") {
    var gal = t.closest ? t.closest(".td-region[data-node]") : null;
    if (gal) {
      if (gal.dataset.node === "ap-hero-image") { e.preventDefault(); e.stopPropagation(); tdGalleryOpen = true; tdRender(); return; }
      if (gal.dataset.node === "ap-gallery-close") { e.preventDefault(); e.stopPropagation(); tdGalleryOpen = false; tdRender(); return; }
    }
  }
  // Tapping shows picker with all widgets at that point
  var region = t.closest(".td-region[data-node]");
  if (region && typeof tdSelect === "function") {
    var root = document.getElementById("teardowns-root");
    if (root && root.contains(region)) {
      // Tapping the SHRUNK phone (sheet fully open, mobile) restores it to
      // full size (peek) instead of selecting a widget. Widget selection
      // only works when the phone is full size (closed or peek state).
      if (window.innerWidth <= 900) {
        var openDetail = document.querySelector(".teardown-detail.td-sheet-open");
        if (openDetail && openDetail.contains(region)) {
          e.preventDefault(); e.stopPropagation();
          if (typeof tdSheetPeek === "function") tdSheetPeek();
          return;
        }
      }
      e.preventDefault(); e.stopPropagation();
      // Find all regions at tap point, innermost first
      var stack = [];
      try {
        var els = document.elementsFromPoint(e.clientX, e.clientY);
        for (var i = 0; i < els.length; i++) {
          var r = els[i].closest ? els[i].closest(".td-region[data-node]") : null;
          if (r && root.contains(r) && stack.indexOf(r) === -1) stack.push(r);
        }
      } catch(err) {}
      if (!stack.length) stack = [region];
      // Show pop-out with all widgets at tap point (even if just one)
      tdShowPicker(stack, e.clientX, e.clientY);
      return;
    }
  }
  // Dismiss pop-out when tapping elsewhere (handled by backdrop)
  var close = t.closest("[data-teardown-close]");
  if (close && typeof tdClose === "function") { tdClose(); return; }
  // Mobile sheet: tapping the peek bar reopens the sheet fully.
  var peekbar = t.closest("[data-teardown-peekbar]");
  if (peekbar && typeof tdSheetOpen === "function") { tdSheetOpen(); return; }

  var copy = t.closest("[data-teardown-copy]");
  if (copy && typeof tdCopy === "function") { tdCopy(); return; }
  var idx = t.closest("[data-teardown-index]");
  if (idx && typeof tdBack === "function") {
    tdBack();
    return;
  }
  // Mobile sheet: tapping the phone (not a widget region — those open the
  // picker above) while the sheet is open drops the sheet to the peek strip,
  // growing the phone big again.
  if (window.innerWidth <= 900) {
    var openDetail = document.querySelector(".teardown-detail.td-sheet-open");
    if (openDetail && typeof tdSheetPeek === "function") {
      var phoneTap = t.closest ? t.closest(".teardown-phone-stage") : null;
      if (phoneTap && openDetail.contains(phoneTap)) { tdSheetPeek(); return; }
    }
  }
}, true);

/* Mobile sheet drag (2026-11-07): drag the sheet's peek bar up/down to slide
   it between open, peek and closed (Pointer Events, touch + mouse). A tap on
   the peek bar (no drag) is left to the click handler, which reopens it.
   The drag reads the sheet's CURRENT rendered position, so grabbing it
   mid-animation does not jump. */
(function(){
  if (window.__ffTdSheetDrag) return;
  window.__ffTdSheetDrag = 1;
  var drag = null;
  var suppressClickUntil = 0;
  window.__tdSheetSuppressClick = function(){ return Date.now() < suppressClickUntil; };
  document.addEventListener("pointerdown", function(e){
    if (window.innerWidth > 900) return;
    if (!e.target.closest) return;
    var bar = e.target.closest("[data-teardown-peekbar]");
    if (!bar) return;
    if (e.target.closest("[data-teardown-close]")) return; // X closes, not drag
    var detail = document.querySelector(".teardown-detail");
    var panel = detail ? detail.querySelector(".teardown-panel:not(.is-empty)") : null;
    if (!detail || !panel) return;
    var isOpen = detail.classList.contains("td-sheet-open");
    var isPeek = detail.classList.contains("td-sheet-peek");
    if (!isOpen && !isPeek) return;
    var H = panel.getBoundingClientRect().height;
    if (!H) return;
    var rect = panel.getBoundingClientRect();
    var curY = Math.max(0, Math.min(H, rect.top - (window.innerHeight - H)));
    drag = {
      startY: e.clientY, startTime: Date.now(),
      panel: panel, H: H,
      baseY: curY,
      state: curY < (H - 28) / 2 ? "open" : "peek",
      moved: false, curY: null
    };
    panel.style.transition = "none";
  });
  document.addEventListener("pointermove", function(e){
    if (!drag) return;
    var dy = e.clientY - drag.startY;
    if (Math.abs(dy) > 6) drag.moved = true;
    var newY = drag.baseY + dy;
    newY = Math.max(0, Math.min(drag.H, newY));
    drag.curY = newY;
    drag.panel.style.transform = "translateY(" + newY + "px)";
  });
  function endDrag(e, cancelled){
    if (!drag) return;
    var d = drag; drag = null;
    var panel = d.panel, H = d.H;
    panel.style.transition = "";
    panel.style.transform = "";
    if (cancelled || !d.moved) return; // tap: let the click handler reopen
    suppressClickUntil = Date.now() + 300;
    var endY = (typeof d.curY === "number") ? d.curY : d.baseY;
    var totalDy = e.clientY - d.startY;
    var totalDt = Math.max(1, Date.now() - d.startTime);
    var vel = totalDy / totalDt; // px/ms, positive = down
    var peekY = H - 28;
    if (d.state === "open") {
      if (endY > peekY / 2 || vel > 0.3) { if (typeof tdSheetPeek === "function") tdSheetPeek(); }
      else if (typeof tdSheetOpen === "function") tdSheetOpen();
    } else { // peek
      if (endY < peekY / 2 || vel < -0.3) { if (typeof tdSheetOpen === "function") tdSheetOpen(); }
      /* Close from peek: only 16px down (or a flick) — the peek bar sits
         ~31px from the screen edge, so a 40px drag is unreachable by a real
         finger; a short deliberate drag or a downward flick closes it. */
      else if (endY > peekY + 16 || vel > 0.25) { if (typeof tdClose === "function") tdClose(); }
      else if (typeof tdSheetPeek === "function") tdSheetPeek();
    }
  }
  document.addEventListener("pointerup", function(e){ endDrag(e, false); });
  document.addEventListener("pointercancel", function(e){ endDrag(e, true); });
})();

// Re-route for teardowns on direct load (views.teardowns now exists)
(function(){
  var h = location.hash || "";
  if (h.indexOf("#/teardowns") === 0 && typeof route === "function" && typeof views !== "undefined" && views.teardowns) {
    try { route(); } catch(e){}
  }
})();

// Dynamic home animations: scroll reveals + counters
(function(){
function initDyn(scope){
  var root=scope||document;
  // Scroll reveals
  var revs=root.querySelectorAll?Array.from(root.querySelectorAll(".dyn-reveal:not(.dyn-visible)")):[];
  if(revs.length){
    if("IntersectionObserver" in window){
      var ro=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add("dyn-visible");ro.unobserve(x.target);}});},{threshold:.15});
      revs.forEach(function(el){ro.observe(el);});
    }else{revs.forEach(function(el){el.classList.add("dyn-visible");});}
  }
  // Animated counters
  var nums=root.querySelectorAll?Array.from(root.querySelectorAll(".dyn-num[data-dcount]")):[];
  if(nums.length&&"IntersectionObserver" in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(x){
      if(!x.isIntersecting)return;
      var el=x.target,target=parseInt(el.getAttribute("data-dcount"),10)||0;co.unobserve(el);
      var cur=0;var step=function(){cur+=Math.max(1,Math.ceil(target/30));if(cur>=target)cur=target;el.textContent=cur+(target>=100?"+":"");if(cur<target)requestAnimationFrame(step);};
      step();
    });},{threshold:.4});
    nums.forEach(function(el){co.observe(el);});
  }
}
// Watch for home view being rendered
if("MutationObserver" in window){
  var mo=new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType===1){
          if(n.classList&&n.classList.contains("dyn-home"))initDyn(n);
          else if(n.querySelector&&n.querySelector(".dyn-home"))initDyn(n);
        }
      });
    });
  });
  mo.observe(document.body,{childList:true,subtree:true});
}
// Init on load too
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){initDyn(document);});
else initDyn(document);
})();

// Editorial home typing animation
(function(){
var words=["beautifully.","confidently.","from scratch."];
var wi=0,ci=0,deleting=false;
function tick(){
  var el=document.getElementById("ed-typing");
  if(!el){setTimeout(tick,500);return;}
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=words[0];return;}
  var word=words[wi];
  if(!deleting){
    ci++;
    el.textContent=word.slice(0,ci);
    if(ci>=word.length){deleting=true;setTimeout(tick,1800);return;}
    setTimeout(tick,90);
  }else{
    ci--;
    el.textContent=word.slice(0,ci);
    if(ci<=0){deleting=false;wi=(wi+1)%words.length;setTimeout(tick,400);return;}
    setTimeout(tick,45);
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",tick);
else tick();
})();

/* Navbar search (2026-11-01): one icon in navbar, filters current list, Home = global dropdown. */
function navSearchRoute(){const m=(location.hash||"#/home").match(/^#\/(\w+)/);return m?m[1]:"home";}
function navSearchContainers(){return [document.getElementById("nav-search"),document.getElementById("mobile-nav-search")].filter(Boolean);}
function navSearchInputs(){return [document.getElementById("nav-search-input"),document.getElementById("mobile-nav-search-input")].filter(Boolean);}
function navSearchUpdatePlaceholders(){const r=navSearchRoute();const map={lessons:["Search lessons…","Search lessons"],quizzes:["Search quizzes…","Search quizzes"],teardowns:["Search teardowns…","Search teardowns"],resources:["Search resources…","Search resources"],home:["Search anything…","Search anything"]};const pair=map[r]||["Search anything…","Search anything"];navSearchInputs().forEach(inp=>{inp.placeholder=pair[0];inp.setAttribute("aria-label",pair[1]);});}
function navSearchUpdateVisibility(){const r=navSearchRoute();const show=["home","lessons","quizzes","teardowns","resources"].indexOf(r)>=0;navSearchContainers().forEach(c=>{c.style.display=show?"":"none";});}
function navSearchFilterRows(rowSel,textSel,emptyId,q){const qq=(q||"").toLowerCase().trim();let v=0;$$(rowSel).forEach(r=>{const t=r.querySelector(textSel);const tx=t?t.textContent.toLowerCase():"";const sh=!qq||tx.indexOf(qq)>=0;r.style.display=sh?"":"none";if(sh)v++;});const m=emptyId?document.getElementById(emptyId):null;if(m)m.style.display=v?"none":"block";afterPhaseSearch(rowSel,q);}
function navSearchFilter(q){window.__navSearchQuery=q||"";const r=navSearchRoute(),qq=(q||"").toLowerCase().trim();if(r==="lessons"){navSearchFilterRows(".learning-list .lesson-row",".t","lesson-search-empty",q);}else if(r==="quizzes"){navSearchFilterRows(".learning-list .quiz-row",".t","quiz-search-empty",q);}else if(r==="teardowns"){const detail=document.querySelector(".teardown-phone-stage")||(window.teardownState&&window.teardownState.app);if(detail&&qq){const back=document.querySelector("[data-teardown-index]");if(back){back.click();setTimeout(()=>{tdApplyListFilters();},200);}else{tdApplyListFilters();}}else if(!detail){tdApplyListFilters();}}else if(r==="resources"){if(typeof window.applyResFilter==="function"){try{window.applyResFilter();}catch(e){}}}else if(r==="home"){navSearchGlobal(q);}}
function navSearchRenderDropdown(items){window.__navSearchResults=items||[];const dds=navSearchContainers().map(c=>c.querySelector(".nav-search-results")).filter(Boolean);if(!items||!items.length){dds.forEach(d=>{d.innerHTML='<div class="nav-search-results-empty">No matches found.</div>';d.style.display="block";});return;}const html=items.map((it,i)=>{const typeLabel=it.type==="lesson"?"Lesson":it.type==="quiz"?"Quiz":it.type==="teardown"?"Teardown":"Resource";return '<button type="button" class="nav-search-result" data-nav-result="'+i+'"><span class="nav-search-result-main"><span class="nav-search-result-title">'+esc(it.title||"")+'</span><span class="nav-search-result-sub">'+esc(it.sub||"")+'</span></span><span class="nav-search-result-type">'+typeLabel+'</span></button>';}).join("");dds.forEach(d=>{d.innerHTML=html;d.style.display="block";});}
function navSearchGlobal(q){const qq=(q||"").toLowerCase().trim();const dds=navSearchContainers().map(c=>c.querySelector(".nav-search-results")).filter(Boolean);if(!qq){dds.forEach(d=>{d.style.display="none";d.innerHTML="";});window.__navSearchResults=[];return;}let lm=[],qm=[],tm=[],rm=[];try{if(typeof LESSON_META!=="undefined"&&LESSON_META){lm=LESSON_META.filter(l=>((l.title||"")+" "+(l.description||"")).toLowerCase().indexOf(qq)>=0).slice(0,5).map(l=>({type:"lesson",title:l.title,sub:"Lesson "+l.num,filterText:l.title,route:"#/lesson/"+l.num,num:l.num}));}}catch(e){}try{if(typeof DATA!=="undefined"&&DATA&&DATA.quizzes){const all=[];DATA.quizzes.forEach(e=>{const title=(e.title||"").replace(/^Quiz:\s*/,"");let s=null;try{s=LESSON_META.find(x=>x.id===e.lessonId);}catch(err){}const hay=(title+" "+(s?s.title:"")).toLowerCase();if(hay.indexOf(qq)>=0){all.push({type:"quiz",title:title,sub:s?("Lesson "+s.num+" · "+s.title):"Quiz",filterText:title,route:"#/quizzes"});}});qm=all.slice(0,5);}}catch(e){}try{if(typeof TEARDOWNS!=="undefined"&&TEARDOWNS){const all=[];Object.entries(TEARDOWNS).forEach(entry=>{const item=entry[1];const hay=((item.app||"")+" "+(item.screen||"")).toLowerCase();if(hay.indexOf(qq)>=0){all.push({type:"teardown",title:item.app,sub:(item.screen||"")+" · "+(item.count||0)+" widgets",filterText:item.app,route:"#/teardowns"});}});tm=all.slice(0,5);}}catch(e){}let needFetch=false;try{if(window.__resData&&typeof window.__resData==="object"){rm=Object.values(window.__resData).filter(r=>((r.title||"").toLowerCase().indexOf(qq)>=0)).slice(0,5).map(r=>({type:"resource",title:r.title,sub:((r.fileType||"PDF")+" · "+(r.paid?"Paid":"Free")),filterText:r.title,route:"#/resources"}));}else if(typeof window.__navSearchResCache!=="undefined"&&window.__navSearchResCache){rm=(window.__navSearchResCache||[]).filter(r=>((r.title||"").toLowerCase().indexOf(qq)>=0)).slice(0,5).map(r=>({type:"resource",title:r.title,sub:((r.fileType||"PDF")+" · "+(r.paid?"Paid":"Free")),filterText:r.title,route:"#/resources"}));}else{needFetch=true;}}catch(e){needFetch=true;}navSearchRenderDropdown([].concat(lm,qm,tm,rm));if(needFetch){try{if(typeof db!=="undefined"&&db&&db.collection){db.collection("resources").orderBy("uploadedAt","desc").get().then(function(snap){const all=[];snap.forEach(function(doc){const d=doc.data()||{};all.push({title:d.title||"",fileType:d.fileType||"PDF",paid:d.freeOrPaid==="paid"});});window.__navSearchResCache=all;const curQ=(function(){const ins=navSearchInputs();let v="";ins.forEach(inp=>{if(inp.value)v=inp.value;});return (v||window.__navSearchQuery||"").toLowerCase().trim();})();if(curQ!==qq)return;navSearchGlobal(q);}).catch(function(){});}}catch(e){}}}
function navSearchResultTap(item){if(!item)return;navSearchContainers().forEach(c=>{const d=c.querySelector(".nav-search-results");if(d){d.style.display="none";d.innerHTML="";}});if(item.type==="lesson"){location.hash="#/lesson/"+item.num;return;}const filterText=item.filterText||item.title||"";navSearchInputs().forEach(inp=>{inp.value=filterText;});window.__navSearchQuery=filterText;window.__navSearchKeep=1;location.hash=item.route;}
function navSearchCollapse(focusBtn){document.body.classList.remove("mobile-search-open");navSearchContainers().forEach(c=>{c.classList.remove("expanded");const b=c.querySelector(".nav-search-btn");if(b)b.setAttribute("aria-expanded","false");const inp=c.querySelector(".nav-search-input");if(inp){inp.value="";if(c.id!=="nav-search")inp.tabIndex=-1;}const cl=c.querySelector(".nav-search-close");if(cl&&c.id!=="nav-search")cl.tabIndex=-1;const d=c.querySelector(".nav-search-results");if(d){d.style.display="none";d.innerHTML="";}});window.__navSearchQuery="";window.__navSearchResults=[];try{navSearchFilter("");}catch(e){}if(focusBtn){const cons=navSearchContainers();for(let i=0;i<cons.length;i++){const b=cons[i].querySelector(".nav-search-btn");if(b&&cons[i].offsetWidth>0){b.focus();break;}}}}
function navSearchExpand(container){if(!container)return;container.classList.add("expanded");if(container.id==="mobile-nav-search")document.body.classList.add("mobile-search-open");const b=container.querySelector(".nav-search-btn");if(b)b.setAttribute("aria-expanded","true");const inp=container.querySelector(".nav-search-input");if(inp){inp.tabIndex=0;}const cl=container.querySelector(".nav-search-close");if(cl)cl.tabIndex=0;navSearchUpdatePlaceholders();if(inp)inp.focus();}
function navSearchInit(){navSearchContainers().forEach(container=>{if(container.dataset.navWired)return;container.dataset.navWired="1";const btn=container.querySelector(".nav-search-btn");const inp=container.querySelector(".nav-search-input");const closeBtn=container.querySelector(".nav-search-close");const resultsBox=container.querySelector(".nav-search-results");if(btn)btn.onclick=()=>{if(container.classList.contains("expanded")){navSearchCollapse(true);}else{navSearchExpand(container);}};if(closeBtn)closeBtn.onclick=()=>{navSearchCollapse(true);};if(inp){inp.oninput=()=>{const v=inp.value||"";navSearchInputs().forEach(other=>{if(other!==inp)other.value=v;});navSearchFilter(v);};inp.onkeydown=(ke)=>{if("Escape"===ke.key){navSearchCollapse(true);}};}if(resultsBox)resultsBox.onclick=(ev)=>{const tgt=ev.target;const btnEl=tgt&&tgt.closest?tgt.closest(".nav-search-result"):null;if(!btnEl)return;const idx=parseInt(btnEl.getAttribute("data-nav-result"),10);const item=(window.__navSearchResults||[])[idx];if(item)navSearchResultTap(item);};});navSearchUpdateVisibility();navSearchUpdatePlaceholders();}
function navSearchTapOutside(ev){const cons=navSearchContainers();let anyExpanded=false;cons.forEach(c=>{if(c.classList.contains("expanded"))anyExpanded=true;});if(!anyExpanded)return;for(let i=0;i<cons.length;i++){if(cons[i].contains(ev.target))return;}navSearchCollapse(false);}
function navSearchHashChange(){navSearchInit();if(window.__navSearchKeep){window.__navSearchKeep=0;navSearchUpdateVisibility();navSearchUpdatePlaceholders();setTimeout(()=>{const q=window.__navSearchQuery||"";navSearchFilter(q);},150);return;}navSearchCollapse(false);navSearchUpdateVisibility();navSearchUpdatePlaceholders();}
if(!window.__ffNavSearchInit){window.__ffNavSearchInit=1;document.addEventListener("click",navSearchTapOutside);window.addEventListener("hashchange",navSearchHashChange);document.addEventListener("DOMContentLoaded",navSearchInit);}
navSearchInit();
