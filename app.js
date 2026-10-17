"use strict";const $=(e,t)=>(t||document).querySelector(e),$$=(e,t)=>Array.from((t||document).querySelectorAll(e)),esc=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),escAttr=e=>esc(e).replace(/"/g,"&quot;").replace(/'/g,"&#39;");let memStore=null;function progKey(e){return"ff_prog_"+(null!=e?e:window._cuid||"guest")}function readLocalProgress(e){if(memStore)return memStore;try{const t=localStorage.getItem(progKey(e));if(t){const e=JSON.parse(t);if(e&&"object"==typeof e)return e}}catch(e){}return null}function writeLocalProgress(e,t){memStore=e;try{localStorage.setItem(progKey(t),JSON.stringify(e))}catch(e){}}void 0===window._cuid&&(window._cuid=null);const store={read:()=>readLocalProgress(),write(e){writeLocalProgress(e),saveProgressToFirestore()}};let firestoreSaveTimer=null,lastCloudJson="";function activeUid(){try{return currentUser?currentUser.uid:null}catch(e){return null}}function authIsBroken(){try{return!!authUnavailable}catch(e){return!0}}function firestoreUsable(){return!(!window.firebase||authIsBroken()||"function"!=typeof firebase.firestore)}function progressPayload(e){return{lessonsDone:e&&e.lessonsDone||{},quizzesPassed:e&&e.quizzesPassed||{},quizHistory:e&&e.quizHistory||{},last:e&&e.last||null}}function writeProgressToFirestore(e,t){if(e&&firestoreUsable())try{let n=null;try{n=firebase.firestore.FieldValue.serverTimestamp()}catch(e){n=Date.now()}firebase.firestore().collection("userProgress").doc(e).set(Object.assign(progressPayload(t),{updatedAt:n}),{merge:!0}).catch(e=>console.warn("[progress] cloud save failed:",e))}catch(e){console.warn("[progress] cloud save error:",e)}}function saveProgressToFirestore(){const e=activeUid();e&&(clearTimeout(firestoreSaveTimer),firestoreSaveTimer=setTimeout(()=>{const t=JSON.stringify(progressPayload(S));t!==lastCloudJson&&(lastCloudJson=t,writeProgressToFirestore(e,S))},1500))}function flushProgressToFirestore(e){clearTimeout(firestoreSaveTimer),firestoreSaveTimer=null,e&&(lastCloudJson=JSON.stringify(progressPayload(S)),writeProgressToFirestore(e,S))}function loadProgressFromFirestore(e){if(!e||!firestoreUsable())return Promise.resolve(null);try{return firebase.firestore().collection("userProgress").doc(e).get().then(e=>{if(e&&e.exists){const t=e.data()||{};return{lessonsDone:t.lessonsDone||{},quizzesPassed:t.quizzesPassed||{},quizHistory:t.quizHistory||{},last:t.last||null}}return null}).catch(e=>(console.warn("[progress] cloud load failed, using local copy:",e),null))}catch(e){return Promise.resolve(null)}}function mergeProgressStates(e,t){const n=Object.assign(defaultState(),e||{});if(n.theme=e&&e.theme||n.theme,!t)return n;n.lessonsDone=Object.assign({},n.lessonsDone,t.lessonsDone),n.quizzesPassed=Object.assign({},n.quizzesPassed,t.quizzesPassed);const s={};return[n.quizHistory,t.quizHistory].forEach(e=>{Object.keys(e||{}).forEach(t=>{s[t]=(s[t]||[]).concat(e[t]||[])})}),Object.keys(s).forEach(e=>{const t=new Set;s[e]=s[e].filter(e=>{const n=e&&e.at;return!t.has(n)&&(t.add(n),!0)}).sort((e,t)=>(e.at||0)-(t.at||0))}),n.quizHistory=s,n.last=t.last||n.last||null,n.seenRanks=Array.from(new Set([].concat(n.seenRanks||[],t&&t.seenRanks||[]))),n}function applyProgressState(e,t){S=e,writeLocalProgress(S,t);try{updateRankUI()}catch(e){}try{route()}catch(e){}t&&flushProgressToFirestore(t)}function switchProgressUser(e,t){if(e===t)return void(window._cuid=t||null);flushProgressToFirestore(e);const n=S;window._cuid=t||null,memStore=null,lastCloudJson="",t?loadProgressFromFirestore(t).then(s=>{let a=Object.assign(defaultState(),readLocalProgress(t)||{});if(s&&(a=mergeProgressStates(a,s)),!e&&n&&(a=mergeProgressStates(a,n)),!e)try{localStorage.removeItem("ff_prog_guest")}catch(e){}applyProgressState(a,t)}):applyProgressState(Object.assign(defaultState(),readLocalProgress(null)||{}),null)}function defaultState(){return{lessonsDone:{},quizzesPassed:{},quizHistory:{},last:null,theme:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",seenRanks:[0]}}let S=Object.assign(defaultState(),store.read()||{});function save(){store.write(S)}!function(){if(S.quizHistory||(S.quizHistory={}),S.quizScores){let e=!1;for(const t of Object.keys(S.quizScores))if(!S.quizHistory[t]){const n=S.quizScores[t];S.quizHistory[t]=[{score:n.score,total:n.total,pct:Math.round(n.score/n.total*100),answers:null,at:0}],e=!0}delete S.quizScores,e&&save()}}();const FIREBASE_CONFIG={apiKey:"AIzaSyCp2thp67ICMbOUDZoBzh0PTbKqp9DNjto",authDomain:"flutterforward-2f275.firebaseapp.com",projectId:"flutterforward-2f275",storageBucket:"flutterforward-2f275.firebasestorage.app",messagingSenderId:"1037995308206",appId:"1:1037995308206:web:276ba49391aafdbd82293f"};let auth=null,currentUser=null,authReady=!1,authUnavailable=!1,authMode="login",authSlideDirection=0,authSwitching=!1;function userName(e){return e?(e.displayName||(e.email?e.email.split("@")[0]:"Flutter Learner")).trim():"Flutter Learner"}function authInitial(e){return(userName(e).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0)).join("")||"FL").toUpperCase()}function friendlyAuthError(e){const t=e&&e.code?e.code:"";return{"auth/wrong-password":"That password is incorrect. Please try again.","auth/user-not-found":"No account was found for that email.","auth/email-already-in-use":"An account already exists for that email. Try logging in.","auth/weak-password":"Use a stronger password with at least 6 characters.","auth/network-request-failed":"Network issue. Check your connection and try again.","auth/invalid-email":"Enter a valid email address.","auth/too-many-requests":"Too many attempts. Wait a little, then try again.","auth/operation-not-allowed":"Email and password sign-in is not enabled yet.","auth/unauthorized-domain":"This site domain needs to be added in Firebase Authentication settings.","auth/invalid-credential":"The email or password doesn't match an account.","auth/invalid-login-credentials":"The email or password doesn't match an account."}[t]||(t?`Something went wrong (${t}) — try again.`:"Something went wrong — try again.")}function authNavMarkup(){return(authReady||authUnavailable)&&currentUser?`<a class="profile-link" data-match="profile" href="#/profile" aria-label="Open profile">\n    <span class="profile-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span class="profile-name">${esc(userName(currentUser))}</span></a>\n    <button class="auth-logout" type="button" data-auth-logout>Logout</button>`:'<a class="auth-login" href="#/profile"><span class="auth-login-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span>Login</span></a>'}function updateAuthUI(){$$(".auth-nav").forEach(e=>{e.innerHTML=authNavMarkup()}),$$("[data-auth-logout]").forEach(e=>{e.closest("#sidebar")||(e.onclick=showLogoutConfirm)}),(location.hash||"#/home").startsWith("#/profile")&&setActiveTab("profile")}function syncModalScrollLock(){const e=!!document.querySelector(".modal-veil:not([hidden])");document.body.classList.toggle("popup-open",e)}const MODAL_CLOSE_MS=180;function closeModalVeil(e,t){e&&!e.classList.contains("closing")&&(e.classList.add("closing"),syncModalScrollLock(),setTimeout(()=>{e.classList.remove("show","closing"),t?e.remove():e.hidden=!0,syncModalScrollLock()},180))}let logoutReturnFocus=null;function showLogoutConfirm(e){if(!auth||!currentUser)return;logoutReturnFocus=e&&e.currentTarget||document.activeElement;const t=$("#logout-veil");t&&(t.hidden=!1,requestAnimationFrame(()=>{t.classList.add("show");const e=$("#logout-cancel");e&&e.focus()}))}function hideLogoutConfirm(){const e=$("#logout-veil");if(!e||!e.classList.contains("show"))return;closeModalVeil(e,!1);const t=logoutReturnFocus;logoutReturnFocus=null,t&&document.contains(t)&&setTimeout(()=>t.focus(),180)}async function confirmLogout(){if(!auth)return;const e=$("#logout-confirm");e&&(e.disabled=!0,e.textContent="Logging out…");try{await auth.signOut(),hideLogoutConfirm()}catch(e){}finally{e&&(e.disabled=!1,e.textContent="Log out")}}function initFirebaseAuth(){if(!window.firebase)return authUnavailable=!0,authReady=!0,updateAuthUI(),void((location.hash||"").startsWith("#/profile")&&render());try{firebase.apps.length||firebase.initializeApp(FIREBASE_CONFIG),auth=firebase.auth(),auth.onAuthStateChanged(e=>{const t=currentUser?currentUser.uid:null,n=e?e.uid:null;currentUser=e||null,authReady=!0,switchProgressUser(t,n),updateAuthUI(),(location.hash||"#/home").startsWith("#/profile")&&render()},()=>{authUnavailable=!0,authReady=!0,updateAuthUI(),(location.hash||"").startsWith("#/profile")&&render()})}catch(e){authUnavailable=!0,authReady=!0,updateAuthUI()}}const RANKS=DATA.ranks,QUIZ_PASS=DATA.quiz.passPercent;function doneCount(){const e=S.lessonsDone||{},t=S.quizzesPassed||{};let n=0;for(let s=1;s<=18;s++){const a=e["lesson-"+s],o=t["quiz-"+s];a&&o&&n++}return n}function rankIndexFor(e){let t=0;return RANKS.forEach((n,s)=>{e>=n.need&&(t=s)}),t}function bumpRank(e){save();const t=rankIndexFor(doneCount());updateRankUI(),t>e&&setTimeout(()=>showRankUp(t),450),render()}function updateRankUI(){const e=rankIndexFor(doneCount());$$(".rank-chip").forEach(t=>{t.innerHTML=`<span class="rank-dot">${TROPHY_ICON}</span><span>${esc(RANKS[e].name)}</span>`})}function confetti(){const e=document.createElement("canvas");e.id="confetti",document.body.appendChild(e);const t=e.getContext("2d");e.width=innerWidth,e.height=innerHeight;const n=["#02569B","#13B9FD","#34d399","#fcd34d","#f0abfc","#ffffff"],s=Array.from({length:140},()=>({x:innerWidth/2+220*(Math.random()-.5),y:.38*innerHeight,vx:13*(Math.random()-.5),vy:-11*Math.random()-4,s:8*Math.random()+4,r:Math.random()*Math.PI,vr:.3*(Math.random()-.5),col:n[Math.random()*n.length|0],life:1}));let a=0;!function n(){t.clearRect(0,0,e.width,e.height),s.forEach(e=>{e.x+=e.vx,e.y+=e.vy,e.vy+=.32,e.r+=e.vr,e.life-=.008,t.save(),t.translate(e.x,e.y),t.rotate(e.r),t.globalAlpha=Math.max(e.life,0),t.fillStyle=e.col,t.fillRect(-e.s/2,-e.s/2,e.s,.62*e.s),t.restore()}),++a<240?requestAnimationFrame(n):e.remove()}()}function showRankUp(e){const t=RANKS[e],n=$("#rankup-veil");$("#rankup-name").textContent=t.name,n.hidden=!1,requestAnimationFrame(()=>n.classList.add("show")),confetti()}function hideRankUp(){closeModalVeil($("#rankup-veil"),!1)}function highlightDart(e){let t=esc(e);return t=t.replace(/(\/\/[^\n]*)/g,"$1"),t=t.replace(/('.*?'|".*?")/g,"$1"),t=t.replace(/\b(import|void|class|extends|final|const|var|return|if|else|for|while|do|new|this|super|required|late|get|set|async|await|switch|case|break|continue|true|false|null|int|double|bool|String|dynamic|override)\b/g,'<span class="tok-k">$1</span>'),t=t.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="tok-n">$1</span>'),t=t.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g,'<span class="tok-a">$1</span>'),t=t.replace(/([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g,'<span class="tok-f">$1</span>'),t=t.replace(/(@\w+)/g,'<span class="tok-a">$1</span>'),t=t.replace(/\u0001([\s\S]*?)\u0002/g,'<span class="tok-c">$1</span>'),t=t.replace(/\u0003([\s\S]*?)\u0004/g,'<span class="tok-s">$1</span>'),t}function inlineFmt(e){let t=esc(e);return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/`([^`]+?)`/g,'<code class="inline">$1</code>'),t}function mdToHtml(e){const t=/```(\w*)\n([\s\S]*?)\n```/g;let n,s="",a=0;for(;n=t.exec(e);)s+=mdText(e.slice(a,n.index)),s+=codeBlock(n[2],n[1]||"dart"),a=n.index+n[0].length;return s+=mdText(e.slice(a)),s}function mdText(e){const t=e.split("\n");let n="",s=[],a=null;const o=()=>{s.length&&(n+=`<p>${inlineFmt(s.join(" "))}</p>`,s=[])},i=()=>{a&&(n+=("ul"===a?"<ul>":"<ol>")+r+("ul"===a?"</ul>":"</ol>"),a=null,r="")};let r="";for(const e of t){const t=e.trim();if(!t){o(),i();continue}if(t.startsWith("## ")){o(),i(),n+=`<h2>${inlineFmt(t.slice(3))}</h2>`;continue}if(t.startsWith("# ")){o(),i(),n+=`<h1>${inlineFmt(t.slice(2))}</h1>`;continue}const l=t.match(/^[-*] (.+)/),c=t.match(/^\d+\. (.+)/);if(l||c){o();const e=l?"ul":"ol",t=(l||c)[1];a!==e&&(i(),a=e),r+=`<li>${inlineFmt(t)}</li>`;continue}i(),s.push(t)}return o(),i(),n}function codeBlock(e,t){const n="cb"+Math.random().toString(36).slice(2,8),s="dart"===t?highlightDart(e):esc(e);return`<div class="codeblock">\n    <div class="code-head"><span class="dots"><i></i><i></i><i></i></span>\n    <span class="lang">${esc(t||"code")}</span>\n    <button class="copy-btn" data-copy="${n}">Copy</button></div>\n    <pre id="${n}"><code>${s}</code></pre></div>`}function rankChip(){return'<a class="rank-chip" href="#/progress" aria-label="View your rank and progress"></a>'}function pageHead(e,t,n){return`<div class="page-head">${e?`<div class="crumb">${e}</div>`:""}\n    <h1>${t}</h1>${n?`<p>${n}</p>`:""}</div>`}document.addEventListener("click",e=>{const t=e.target.closest("[data-copy]");if(!t)return;const n=document.getElementById(t.dataset.copy),s=n?n.innerText:"",a=()=>{t.textContent="Copied ✓",t.classList.add("ok"),setTimeout(()=>{t.textContent="Copy",t.classList.remove("ok")},1600)};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(a).catch(a);else{const t=document.createElement("textarea");t.value=s,document.body.appendChild(t),t.select();try{document.execCommand("copy")}catch(e){}t.remove(),a()}});const views={},FEATURES=[{title:"Guided lessons",href:"#/lessons",text:"Focused modules move from setup to state, with a PDF for revision whenever you need it.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H4z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v18a3 3 0 0 1 3-3h3z"/></svg>'},{title:"Live playground",href:"#/playground",text:"Open DartPad, change the code, and see what happens. No local setup required.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 5-4 14"/></svg>'},{title:"Quick checks",href:"#/quizzes",text:"Short quizzes explain every answer, so weak points become clear before you move on.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5 11 14l4-5"/><circle cx="12" cy="12" r="9"/></svg>'},{title:"Visible progress",href:"#/progress",text:"Completed lessons, quiz results, and ranks stay together in one simple progress view.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>'},{title:"Resources",href:"#/resources",text:"Cheat sheets, notes, and guides. Free downloads and premium content.",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>'}];views.home=()=>{return`<div class="min-home">
<section class="min-hero min-fade">
<h1>Learn Flutter<br><em>the right way.</em></h1>
<p class="min-tagline"><strong>Everything you need,</strong> Nothing you don't.</p>
<a class="min-btn" href="#/lessons">Begin →</a>
</section>
<div class="min-ticker min-fade"><div class="min-ticker-track">
<span>18 Lessons</span><i>·</i><span>5 App Teardowns</span><i>·</i><span>Interactive Quizzes</span><i>·</i><span>7 Ranks</span><i>·</i><span>100% Free</span><i>·</i>
<span>18 Lessons</span><i>·</i><span>5 App Teardowns</span><i>·</i><span>Interactive Quizzes</span><i>·</i><span>7 Ranks</span><i>·</i><span>100% Free</span><i>·</i>
</div></div>
</div>`};
const lessonRow=e=>{const n=!!S.lessonsDone[e.id];return`<a class="lesson-row${n?" done":""}" href="#/lesson/${e.num}">
<span class="lesson-num">${e.num}</span>
<span class="t"><b>${esc(e.title)}</b><span>${esc(e.description)}</span></span>
<span class="lesson-meta"><span class="row-tag">PDF</span><span class="chev">›</span></span></a>`};
views.lessons=()=>pageHead(null,"Lessons","Eighteen lessons. Read, build, then test yourself.")+`<div class="learning-list">${DATA.lessons.map(lessonRow).join("")}</div>`,views.lesson=e=>{const t=DATA.lessons[e-1];if(!t)return views.lessons();const n=!!S.lessonsDone[t.id],s=DATA.quizzes.find(e=>e.id===t.quizId),a=!!S.quizzesPassed[s.id],o=t.markdown.replace(/^# .+\n/,""),i=DATA.lessons[e-2],r=DATA.lessons[e];return`<a class="back-link" href="#/lessons">← All lessons</a>\n  <div class="article">\n    <div class="lesson-kicker">Module 1 · Lesson ${t.num}</div>\n    <h1 style="font-size:clamp(26px,5vw,36px);letter-spacing:-.03em;line-height:1.15;margin-bottom:6px">${esc(t.title)}</h1>\n    <p style="color:var(--text-2);margin-bottom:6px">${esc(t.description)}</p>\n    ${mdToHtml(o)}\n    <div class="lesson-actions">\n      <a class="btn btn-soft" href="pdfs/lesson-${String(t.num).padStart(2,"0")}.pdf" download>Download PDF</a>\n      ${n?'<button class="btn btn-accent" disabled>Completed</button>':'<button class="btn btn-accent" id="complete-lesson">Mark complete</button>'}\n    </div>\n    <div style="margin-top:18px">\n      <a class="lesson-row${a?" done":""}" href="#/quiz/${e}">\n        <span class="quiz-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8M9 2v3m6-3v3"/><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/></svg></span>\n        <span class="t"><b>${esc(s.title)}</b><span>4 questions · pass at ${QUIZ_PASS}%</span></span>\n        <span class="chev">›</span></a>\n    </div>\n  </div>\n  <div class="pager">\n    ${i?`<a href="#/lesson/${i.num}"><span class="pager-label">← Previous</span><strong class="pager-title">${esc(i.title)}</strong></a>`:"<a></a>"}\n    ${r?`<a class="next"href="#/lesson/${r.num}"><span class="pager-label">Next →</span><strong class="pager-title">${esc(r.title)}</strong></a>`:"<a></a>"}\n  </div>\n  <script>void 0<\/script>`},views.playground=()=>pageHead(null,"Playground","Write and run real Flutter code. No setup needed.")+'<div class="playground-shell">\n    <div class="playground-bar"><span class="playground-dot"></span><b>main.dart</b><a class="btn" href="https://dartpad.dev" target="_blank" rel="noopener">Run</a></div>\n    <div class="dartpad-shell"><iframe title="DartPad playground" src="https://dartpad.dev/embed-flutter.html" allow="clipboard-write"></iframe></div>\n   </div>\n   <div class="dartpad-fallback">Tip: edit the example, then run it to preview your changes.</div>';const QUIZ_ICONS=['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="m12 3 4.5 2.5v5L12 13l-4.5-2.5v-5L12 3Z"/><path d="m7.5 10.5-4 2.3v5L8 21.3l4-2.3v-6M16.5 10.5l4 2.3v5L16 21.3 12 19"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 10.5h4M17.5 10v4"/></svg>','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>'];views.quizzes=()=>pageHead(null,"Quizzes","One question at a time. Get a clear breakdown when you finish.")+`<div class="learning-list">${DATA.quizzes.map((e,t)=>{const n=!!S.quizzesPassed[e.id],s=DATA.lessons.find(t=>t.id===e.lessonId);return`<a class="quiz-row"href="#/quiz/${t+1}">\n<span class="quiz-icon"aria-hidden="true">${QUIZ_ICONS[t%QUIZ_ICONS.length]}</span>\n<span class="t"><b>${esc(e.title.replace(/^Quiz:\s*/,""))}</b><span>Lesson ${s.num}· ${esc(s.title)}· 4 questions</span></span>\n<span class="status-pill${n?"pass":""}">${n?"Passed":"Not started"}</span></a>`}).join("")}</div>`;const QUIZ_TOPICS={"quiz-1":["runApp()","Dart entry point","MaterialApp","Scaffold"],"quiz-2":["Widget basics","build()","Immutability","Widget trees"],"quiz-3":["Row","Main axis","Overflow","Expanded"],"quiz-4":["StatefulWidget","setState()","State object","UI rebuilds"]},quizTopic=(e,t)=>QUIZ_TOPICS[e]&&QUIZ_TOPICS[e][t]||`Question ${t+1}`;function _pdfImgBuild(e){const t=[],n={};let s=0;const a=e=>{t.push(e),s+=e.length};a("%PDF-1.4\n");const o=e.length,i=e=>3+e,r=e=>3+o+e,l=e=>3+2*o+e,c=2+3*o;n[1]=s,a("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),n[2]=s,a("2 0 obj\n<< /Type /Pages /Kids ["+e.map((e,t)=>i(t)+" 0 R").join(" ")+"] /Count "+o+" >>\nendobj\n"),e.forEach((e,o)=>{n[i(o)]=s,a(i(o)+" 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents "+r(o)+" 0 R /Resources << /XObject << /Im"+o+" "+l(o)+" 0 R >> >> >>\nendobj\n");const c="q\n595.28 0 0 841.89 0 0 cm\n/Im"+o+" Do\nQ\n";var d;n[r(o)]=s,a(r(o)+" 0 obj\n<< /Length "+c.length+" >>\nstream\n"+c+"endstream\nendobj\n"),n[l(o)]=s,a(l(o)+" 0 obj\n<< /Type /XObject /Subtype /Image /Width "+e.w+" /Height "+e.h+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+e.data.length+" >>\nstream\n"),d=e.data,t.push(d),s+=d.length,a("\nendstream\nendobj\n")});const d=s;a("xref\n0 "+(c+1)+"\n0000000000 65535 f \n");for(let e=1;e<=c;e++)a(String(n[e]).padStart(10,"0")+" 00000 n \n");a("trailer\n<< /Size "+(c+1)+" /Root 1 0 R >>\nstartxref\n"+d+"\n%%EOF");const u=new Uint8Array(s);let p=0;for(const e of t)if("string"==typeof e)for(let t=0;t<e.length;t++)u[p++]=255&e.charCodeAt(t);else u.set(e,p),p+=e.length;return u}function _pdfWrapC(e,t,n){const s=String(t).split(/\s+/).filter(Boolean),a=[];let o="";for(const t of s){const s=o?o+" "+t:t;!o||e.measureText(s).width<=n?o=s:(a.push(o),o=t)}return o&&a.push(o),a.length?a:[""]}function _pdfRR(e,t,n,s,a,o){e.beginPath(),e.roundRect?e.roundRect(t,n,s,a,o):e.rect(t,n,s,a)}async function quizPdfPages(e,t){const n=()=>new Promise(e=>setTimeout(e,0)),s=999,a="#171717",o="#555451",i="#888681",r="#1E40AF",l="#34745E",c="#E7F0EB",d="#A13D3D",u="#F5E9E7",p="#FFFFFF",h="#E8E6E2",g=(e,t)=>e+" "+2*t+'px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',f=e=>2*e+'px Georgia, "Times New Roman", Times, serif',v=e.questions.length,m=t.score,b=v-m,w=t.pct,A=w>=QUIZ_PASS,k="function"==typeof currentUser?currentUser():currentUser,y=k?"string"==typeof k?k:k.displayName||k.email||null:null,z=[...new Set(e.questions.map((n,s)=>{return t.answers[s]===n.answer?null:(a=s,quizTopic(e.id,a));var a}).filter(Boolean))],S=(e,t)=>{const n=document.createElement("canvas");n.width=s,n.height=3600;const a=n.getContext("2d"),o=Math.ceil(e(a)),i=document.createElement("canvas");i.width=s,i.height=o;const r=i.getContext("2d");return t&&(r.fillStyle=p,_pdfRR(r,0,0,s,o,36),r.fill(),r.strokeStyle=h,r.lineWidth=2,r.stroke()),r.drawImage(n,0,0,s,o,0,0,s,o),i},x=S(n=>{let i=16;n.textAlign="left",n.fillStyle=a,n.font=f(18),n.fillText("FlutterForward",0,i+36),n.fillStyle=r,n.font=g(700,10.5),n.textAlign="right",n.fillText("QUIZ RESULT",s,i+34),n.textAlign="left",i+=76,n.strokeStyle=h,n.lineWidth=1.5,n.beginPath(),n.moveTo(0,i),n.lineTo(s,i),n.stroke(),i+=90,n.fillStyle=a,n.font=f(34),_pdfWrapC(n,e.title,s).forEach(e=>{n.fillText(e,0,i),i+=82}),i+=30,n.fillStyle=o,n.font=g(400,14);const l=t.at?new Date(t.at).toLocaleString():"",c=[y||"Guest learner",l].filter(Boolean).join("   •   ");return _pdfWrapC(n,c,s).forEach(e=>{n.fillText(e,0,i),i+=44}),i+48},!1);await n();const T=S(e=>{let t=76;e.fillStyle=r,e.font=g(700,11),e.textAlign="left",e.fillText("YOUR SCORE",76,t),t+=108,e.fillStyle=a,e.font=f(64),e.fillText(w+"%",76,t);const n=A?"Passed":"Keep going";e.font=g(700,13);const s=e.measureText(n).width+68;e.fillStyle=A?c:u,_pdfRR(e,923-s,t-60,s,68,34),e.fill(),e.fillStyle=A?l:d,e.textAlign="center",e.fillText(n,923-s/2,t-16),e.textAlign="left",t+=68,e.fillStyle=o,e.font=g(400,16),_pdfWrapC(e,A?"You have a solid grip on this lesson.":`Review the ${b} point${1===b?"":"s"} below, then try again.`,847).forEach(n=>{e.fillText(n,76,t),t+=48}),t+=56,e.strokeStyle=h,e.lineWidth=1.5,e.beginPath(),e.moveTo(76,t),e.lineTo(923,t),e.stroke(),t+=60;const k=767/3;return[[m+"/"+v,"Points"],[String(m),"Correct"],[String(b),"Missed"]].forEach(([n,s],o)=>{const r=76+o*(k+40);e.fillStyle=p,_pdfRR(e,r,t,k,164,16),e.fill(),e.strokeStyle=h,e.lineWidth=1.5,e.stroke(),e.fillStyle=a,e.font=f(28),e.textAlign="center",e.fillText(n,r+k/2,t+80),e.fillStyle=i,e.font=g(600,12.5),e.fillText(s,r+k/2,t+128)}),e.textAlign="left",t+164+76},!0);await n();const q=S(e=>{let t=70;if(e.fillStyle=a,e.font=f(23),e.textAlign="left",e.fillText(z.length?"Topics to revisit":"A clean result",76,t),t+=60,e.fillStyle=o,e.font=g(400,14.5),e.fillText(z.length?"Focus here before your next attempt.":"Every answer was correct.",76,t),t+=72,z.length){e.font=g(600,13.5);let n=76;z.forEach(s=>{const a=e.measureText(s).width+56;n+a>923&&(n=76,t+=78),e.fillStyle="#F6F5F3",_pdfRR(e,n,t,a,62,31),e.fill(),e.strokeStyle=h,e.lineWidth=1,e.stroke(),e.fillStyle=r,e.fillText(s,n+28,t+42),n+=a+18}),t+=78}return t+64},!0);await n();const C=S(e=>(e.fillStyle=r,e.font=g(700,10.5),e.fillText("ANSWER REVIEW",0,26),e.fillStyle=a,e.font=f(32),e.fillText("Question by question",0,106),e.fillStyle=o,e.font=g(400,14),e.textAlign="right",e.fillText(`${m} of ${v} correct`,s,104),e.textAlign="left",e.strokeStyle=h,e.lineWidth=1.5,e.beginPath(),e.moveTo(0,150),e.lineTo(s,150),e.stroke(),180),!1);await n();const E=e.questions.map((e,n)=>{const s=t.answers[n],i=s===e.answer;return S(t=>{let p=64;const v=68;t.font=g(700,11.5);const m=i?"CORRECT":"REVIEW",b=t.measureText(m).width+56;t.fillStyle=i?c:u,_pdfRR(t,931-b,p-8,b,54,27),t.fill(),t.fillStyle=i?l:d,t.textAlign="center",t.fillText(m,931-b/2,p+28),t.textAlign="left",t.fillStyle=r,t.font=g(700,11),t.fillText(`QUESTION ${n+1}`,v,p+28),p+=100,t.fillStyle=a,t.font=f(21),_pdfWrapC(t,e.q,863).forEach(e=>{t.fillText(e,v,p),p+=56}),p+=36;const w=(e,n,s,a,o)=>{t.font=g(600,13.5),t.fillStyle=s,t.fillText(e,v,p);const i=t.measureText(e).width;t.font=g(o?700:400,14.5),t.fillStyle=a,_pdfWrapC(t,String(n),863-i).forEach((e,n)=>{0===n?t.fillText(e,v+i,p):(p+=46,t.fillText(e,v,p))}),p+=60};w("Your answer: ",null==e.options[s]?"—":e.options[s],o,a,!0),i||w("Correct answer: ",e.options[e.answer],l,l,!0),t.strokeStyle=h,t.lineWidth=1.5,t.beginPath(),t.moveTo(v,p),t.lineTo(931,p),t.stroke(),p+=54,t.font=g(700,13.5),t.fillStyle=o,t.fillText("Why: ",v,p);const A=t.measureText("Why: ").width;return t.font=g(400,14.5),t.fillStyle=a,_pdfWrapC(t,e.explanation,863-A).forEach((e,n)=>{t.fillText(e,v+(n?0:A),p+(n?48:0)),n&&(p+=48)}),p+=48,p+68},!0)});await n();const R=[[{cv:x},{cv:T},{cv:q}]],M=[{cv:C,keepWithNext:!0},...E.map(e=>({cv:e,isQ:!0}))];let I=[],P=0;if(M.forEach((e,t)=>{let n=e.cv.height+(I.length?28:0);e.keepWithNext&&M[t+1]&&(n+=28+M[t+1].cv.height),I.length&&P+n>1516&&(R.push(I),I=[],P=0),I.length&&(P+=28),I.push(e),P+=e.cv.height}),I.length&&R.push(I),R.length>=3){const e=R[R.length-1],t=R[R.length-2];if(1===e.length&&e[0].isQ){let n=-1;for(let e=t.length-1;e>=0;e--)if(t[e].isQ){n=e;break}const s=t.filter(e=>e.isQ).length;if(n>=0&&s>=2){const s=t[n];s.cv.height+28+e[0].cv.height<=1516&&(t.splice(n,1),e.unshift(s))}}}const B=R.map(e=>{const t=document.createElement("canvas");t.width=1191,t.height=1684;const n=t.getContext("2d");n.fillStyle="#FFFFFF",n.fillRect(0,0,1191,1684);let s=72;return e.forEach((e,t)=>{t&&(s+=28),n.drawImage(e.cv,96,s),s+=e.cv.height}),t});return B.forEach((e,t)=>{const n=e.getContext("2d");n.fillStyle=i,n.font=g(400,10.5),n.fillText("Generated by FlutterForward",96,1638);const s=`Page ${t+1} of ${B.length}`;n.textAlign="right",n.fillText(s,1095,1638),n.textAlign="left"}),B}function openPdfSheet(e,t){if($("#pdfsheet-veil"))return void URL.revokeObjectURL(e);const n=document.createElement("div");n.className="modal-veil",n.id="pdfsheet-veil",n.innerHTML=`<div class="modal pdfsheet-dialog" role="dialog" aria-modal="true" aria-labelledby="ps-title">\n    <h2 id="ps-title">Your PDF is ready</h2>\n    <p style="word-break:break-all">${esc(t)}</p>\n    <a class="btn btn-accent btn-block" id="ps-dl" href="${e}" download="${esc(t)}">Download PDF</a>\n    <a class="btn btn-soft btn-block" id="ps-open" href="${e}" target="_blank" rel="noopener">Open in browser</a>\n    <button class="btn btn-soft btn-block" id="ps-close">Close</button>\n  </div>`,document.body.appendChild(n);const s=()=>{closeModalVeil(n,!0),setTimeout(()=>URL.revokeObjectURL(e),5e3)};n.querySelector("#ps-close").onclick=s,n.addEventListener("click",e=>{e.target===n&&s()});const a=e=>{"Escape"===e.key&&(document.removeEventListener("keydown",a),s())};document.addEventListener("keydown",a),viewCleanup.push(()=>{const t=$("#pdfsheet-veil");t&&(t.remove(),URL.revokeObjectURL(e))}),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("show")))}let _pdfBusy=!1;async function downloadQuizPdf(e,t){const n=(DATA.quizzes||[]).find(t=>t.id===e);if(n&&t&&t.answers&&!_pdfBusy){_pdfBusy=!0;try{const e=()=>new Promise(e=>setTimeout(e,0)),s=await quizPdfPages(n,t),a=[];for(const t of s){await e();const n=t.toDataURL("image/jpeg",.92).split(",")[1],s=atob(n),o=new Uint8Array(s.length);for(let e=0;e<s.length;e++)o[e]=s.charCodeAt(e);a.push({w:t.width,h:t.height,data:o})}const o=_pdfImgBuild(a),i=new Blob([o],{type:"application/pdf"}),r=URL.createObjectURL(i),l=(t.at?new Date(t.at):new Date).toISOString().slice(0,10),c="flutterforward-"+n.id+"-"+l+".pdf";if(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches)openPdfSheet(r,c);else{const e=document.createElement("a");e.href=r,e.download=c,document.body.appendChild(e),e.click(),setTimeout(()=>{URL.revokeObjectURL(r),e.remove()},4e3)}}catch(e){}_pdfBusy=!1}}const quizState={};views.quiz=(e,t)=>{const n=DATA.quizzes[e-1];if(!n)return views.quizzes();const s=quizState[n.id]||(quizState[n.id]={answers:{},done:!1,score:0,current:0});if("number"!=typeof s.current&&(s.current=0),t){const e=Math.round(s.score/n.questions.length*100),t=e>=QUIZ_PASS,a=n.questions.length-s.score,o=n.questions.map((e,t)=>s.answers[t]===e.answer?null:quizTopic(n.id,t)).filter(Boolean);return`<div class="quiz-stage"><a class="back-link" href="#/quizzes">← All quizzes</a>\n    <div class="card score-hero">\n      <div class="score-ring" style="--p:${e}"><b>${e}%</b></div>\n      <h2>${t?"Quiz passed":"Keep going"}</h2>\n      <p>${t?"You have a solid grip on this lesson.":`Review the ${a}point${1===a?"":"s"}below,then try again.`}</p>\n      <span class="pass-pill ${t?"pass":"fail"}">${t?"✓ Passed":`Need ${QUIZ_PASS}%to pass`}</span>\n      <div class="result-stats">\n        <div class="result-stat"><b>${s.score}/${n.questions.length}</b><span>Points</span></div>\n        <div class="result-stat"><b>${s.score}</b><span>Correct</span></div>\n        <div class="result-stat"><b>${a}</b><span>Missed</span></div>\n      </div>\n    </div>\n    <div class="weak-card${o.length?"":" clear"}">\n      <div class="weak-head"><span class="weak-mark">${o.length?"!":"✓"}</span><div>\n        <b>${o.length?"Weak topics":"No weak topics"}</b>\n        <p>${o.length?"Focus on these before your next attempt.":"Every answer was correct."}</p>\n      </div></div>\n      ${o.length?`<div class="weak-tags">${o.map(e=>`<span>${esc(e)}</span>`).join("")}</div>`:""}\n    </div>\n    <div class="section-head"><h2>Question review</h2><span style="font-size:13px;color:var(--text-3)">${s.score} of ${n.questions.length} correct</span></div>\n    <div class="review-list">${n.questions.map((e,t)=>{const n=s.answers[t],a=n===e.answer;return`<article class="review-card ${a?"ok":"bad"}">\n<div class="review-top"><h3>${t+1}.${esc(e.q)}</h3><span class="review-status">${a?"Correct":"Needs review"}</span></div>\n<div class="review-answer"><span>Your answer:<b>${esc(null==e.options[n]?"—":e.options[n])}</b></span>\n ${a?"":`<span class="correct-line">Correct answer: <b>${esc(e.options[e.answer])}</b></span>`}\n</div>\n<div class="review-why"><b>Why:</b>${esc(e.explanation)}</div>\n</article>`}).join("")}</div>\n    <div class="result-actions"><button class="btn btn-soft" id="quiz-retry">Retry quiz</button><button class="btn btn-soft" id="quiz-pdf">Download PDF</button><a class="btn btn-accent" href="#/quizzes">Back to quizzes</a></div></div>`}const a=Math.max(0,Math.min(s.current,n.questions.length-1));s.current=a;const o=n.questions[a],i=Object.keys(s.answers).length,r=s.answers[a];return`<div class="quiz-stage"><a class="back-link" href="#/quizzes">← All quizzes</a>\n    ${pageHead(null,n.title,`Pass mark:${QUIZ_PASS}%`)}\n    <div class="quiz-flow-head">\n      <div class="quiz-flow-meta"><b>Question ${a+1} of ${n.questions.length}</b><span>${i} answered</span></div>\n      <div class="quiz-progress" aria-label="Quiz progress"><i style="width:${(a+1)/n.questions.length*100}%"></i></div>\n    </div>\n    <div class="quiz-q">\n      <span class="quiz-topic">${esc(quizTopic(n.id,a))}</span>\n      <h3>${esc(o.q)}</h3>\n      ${o.options.map((e,t)=>`<button class="opt${r===t?"sel":""}"data-q="${n.id}:${a}:${t}"aria-pressed="${r===t?"true":"false"}">${esc(e)}</button>`).join("")}\n    </div>\n    <div class="quiz-nav">\n      ${a>0?'<button class="btn btn-soft" id="quiz-back">Back</button>':""}\n      <button class="btn btn-accent" id="quiz-next"${null==r?" disabled":""}>${a===n.questions.length-1?"See results":"Next question"}</button>\n    </div>\n  </div>`};const TROPHY_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v1a4 4 0 0 0 4 4M16 6h3v1a4 4 0 0 1-4 4M12 12v5m-3 3h6m-5-3h4"/></svg>',RANK_ICONS=Array.from({length:7},()=>TROPHY_ICON),fmtDate=e=>{try{const t=new Date(e);return t.toLocaleDateString(void 0,{day:"numeric",month:"short"})+", "+t.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}catch(e){return""}};function showAllRanks(){const e=document.getElementById("ranks-portal");e&&e.remove();const t=rankIndexFor(doneCount()),n=RANKS.map((e,n)=>{const s=n<t?"reached":n===t?"current rank":"locked",a=n<t?'<span class="rl-mark" aria-hidden="true">✓</span>':n===t?'<span class="rl-cur">Current</span>':'<span class="rl-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>';return`<div class="rl-row ${n<t?"done":n===t?"cur":"lock"}" aria-label="${esc(e.name)}, ${s}"${n===t?' aria-current="step"':""}>\n      <span class="rl-ico" aria-hidden="true">${RANK_ICONS[n]}</span>\n      <div class="rl-t"><b>${esc(e.name)}</b>${0===n?"<span>Starting rank</span>":""}</div>${a}</div>`}).join(""),s=document.createElement("div");s.id="ranks-portal",s.className="modal-veil ranks-portal",s.innerHTML=`<div class="modal ranks-dialog" role="dialog" aria-modal="true" aria-labelledby="ranks-title">\n    <div class="ranks-head">\n      <div class="ranks-head-copy"><h2 id="ranks-title">All ranks</h2><p>Your path from first widget to Flutter Master.</p></div>\n      <button class="ranks-close" type="button" aria-label="Close all ranks">×</button>\n    </div>\n    <div class="rl-list">${n}</div>\n    <button class="btn btn-accent btn-block ranks-done" type="button">Close</button>\n  </div>`,document.body.appendChild(s);const a=document.getElementById("ranks-help");let o=!1;const i=e=>{"Escape"===e.key&&r()},r=e=>{o||(o=!0,document.removeEventListener("keydown",i),e?(s.remove(),syncModalScrollLock()):(closeModalVeil(s,!0),a&&document.contains(a)&&setTimeout(()=>a.focus(),180)))};s.querySelector(".ranks-close").onclick=()=>r(!1),s.querySelector(".ranks-done").onclick=()=>r(!1),s.addEventListener("click",e=>{e.target===s&&r(!1)}),document.addEventListener("keydown",i),onViewCleanup(()=>r(!0)),requestAnimationFrame(()=>{s.classList.add("show"),s.querySelector(".ranks-close").focus()})}async function handleAuthSubmit(e){if(!auth||!e)return;const t=$("#auth-error"),n=$("#auth-submit"),s=String(e.email.value||"").trim(),a=String(e.password.value||""),o=e.elements.name,i=o?String(o.value||"").trim():"";if(!e.checkValidity())return t&&(t.textContent="Complete the fields above with valid details."),void e.reportValidity();if("register"!==authMode||i){t&&(t.textContent=""),n&&(n.disabled=!0,n.textContent="register"===authMode?"Creating account…":"Logging in…");try{if("register"===authMode){const e=await auth.createUserWithEmailAndPassword(s,a);await e.user.updateProfile({displayName:i.slice(0,32)}),currentUser=e.user,render()}else await auth.signInWithEmailAndPassword(s,a)}catch(e){t&&(t.textContent=friendlyAuthError(e)),n&&(n.disabled=!1,n.textContent="register"===authMode?"Create account":"Login")}}else t&&(t.textContent="Enter the name you want shown on your profile.")}views.progress=()=>{const e=rankIndexFor(doneCount()),t=RANKS[e],n=DATA.lessons.filter(e=>S.lessonsDone[e.id]).length,s=Object.keys(S.quizzesPassed).length,a=DATA.quizzes.map((e,t)=>{const n=(S.quizHistory||{})[e.id]||[],s=!!S.quizzesPassed[e.id];let a,o="";if(n.length){const t=n.reduce((e,t)=>t.pct>e.pct?t:e,n[0]);a=t.pct>=QUIZ_PASS?'<span class="qh-badge pass">✓ Passed</span>':`<span class="qh-badge fail">${t.pct}% &middot; Not passed</span>`;const s=n.map((t,n)=>{const s=t.at?fmtDate(t.at):"Earlier attempt",a=t.answers?e.questions.map((e,n)=>{const s=t.answers[n],a=s===e.answer;return`<div class="qa ${a?"ok":"bad"}">\n            <div class="qa-q">${n+1}. ${esc(e.q)}</div>\n            <div class="qa-a">${a?"✓":"✗"} Your answer: <b>${esc(null==e.options[s]?"—":e.options[s])}</b>${a?"":`<span class="qa-correct">Correct:<b>${esc(e.options[e.answer])}</b></span>`}</div>\n          </div>`}).join(""):'<div class="qa-na">Answer details were not recorded for this attempt.</div>';return`<details class="att"><summary><b>${s}</b><span>${t.score}/${t.total} &middot; ${t.pct}%${t.answers?`<button class="qh-pdf"data-q="${e.id}"data-ai="${n}"title="Download result as PDF">PDF</button>`:""}</span></summary><div class="qa-list">${a}</div></details>`}).join("");o=`<div class="qh-bestrow"><div class="qh-best"><b>${t.pct}%</b><span>best &middot; ${t.score}/${t.total}</span></div>\n        <div class="qh-bar"><i style="width:${t.pct}%"></i></div></div>\n        <details class="qh-review"><summary>Review answers (${n.length} attempt${n.length>1?"s":""})</summary>${s}</details>`}else s?(a='<span class="qh-badge pass">✓ Passed</span>',o='<div class="qh-na">Finished before result tracking &mdash; retake to record full results.</div>'):a='<span class="qh-badge todo">Not attempted</span>';return`<div class="qh-card">\n        <div class="qh-top"><b>${esc(e.title)}</b>${a}</div>\n        ${o}\n        <a class="qh-link" href="#/quiz/${t+1}">${n.length||s?"Retake quiz &rarr;":"Take quiz &rarr;"}</a>\n      </div>`}).join(""),o=`<div class="rk-card">\n    <div class="rk-side">\n      <span class="rk-cur-badge">${RANK_ICONS[e]}</span>\n      <div class="rk-info"><h3>${esc(t.name)}</h3><span class="rk-label">Level ${e+1} of ${RANKS.length}</span></div>\n      <button class="rk-help" id="ranks-help" aria-label="See all ranks" aria-haspopup="dialog">?</button>\n    </div>\n  </div>`;return pageHead(null,"Your progress","A quiet record of every lesson and quiz completed.")+`<div class="progress-layout">\n  <aside class="progress-side">\n    ${o}\n  </aside>\n  <div class="progress-main-shell">\n    <div class="progress-main">\n      <div class="stat-grid stagger" style="margin-bottom:18px">\n        <div class="stat"><b>${n}/${DATA.lessons.length}</b><span>Lessons</span></div>\n        <div class="stat"><b>${s}/${DATA.quizzes.length}</b><span>Quizzes</span></div>\n      </div>\n      <div class="section-head"><h2>Quiz results</h2></div>\n      <div class="qhist">${a}</div>\n    </div>\n  </div>\n  </div>`},views.profile=()=>{if(!authReady&&!authUnavailable)return pageHead(null,"Profile","Sign in to view your learning profile.")+'<div class="auth-card auth-loading">Checking your account…</div>';if(authUnavailable)return pageHead(null,"Profile","Sign in to view your learning profile.")+'<div class="auth-card"><div class="auth-intro"><h2>Authentication unavailable</h2><p>Firebase could not load. Check your internet connection, then refresh this page.</p></div></div>';if(!currentUser){const e="register"===authMode,t=authSlideDirection?" auth-enter-"+(authSlideDirection>0?"right":"left"):"";return authSlideDirection=0,`<section class="auth-card">\n        <div class="auth-intro${t}"><h2>${e?"Create your account":"Welcome back"}</h2>\n          <p>${e?"Set up your FlutterForward identity.":"Continue with your learning profile."}</p></div>\n        <div class="auth-tabs" data-mode="${e?"register":"login"}" role="tablist" aria-label="Account access">\n          <button class="auth-tab${e?"":" active"}" type="button" role="tab" aria-selected="${e?"false":"true"}" data-auth-mode="login">Login</button>\n          <button class="auth-tab${e?" active":""}" type="button" role="tab" aria-selected="${e?"true":"false"}" data-auth-mode="register">Register</button>\n        </div>\n        <div class="auth-form-panel${t}">\n          <form class="auth-form" id="auth-form" novalidate>\n            ${e?'<div class="auth-field"><label for="auth-name">Display name</label><input id="auth-name" name="name" type="text" maxlength="32" autocomplete="name" placeholder="Your name" required></div>':""}\n            <div class="auth-field"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required></div>\n            <div class="auth-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" autocomplete="${e?"new-password":"current-password"}" placeholder="${e?"At least 6 characters":"Your password"}" required></div>\n            <div class="auth-error" id="auth-error" role="alert" aria-live="polite"></div>\n            <button class="btn btn-accent btn-block auth-submit" id="auth-submit" type="submit">${e?"Create account":"Login"}</button>\n          </form>\n        </div>\n      </section>`}const e=rankIndexFor(doneCount()),t=DATA.lessons.filter(e=>S.lessonsDone[e.id]).length,n=Object.keys(S.quizzesPassed||{}).length,s=Object.values(S.quizHistory||{}).reduce((e,t)=>e+t.length,0),a=Object.values(S.quizHistory||{}).reduce((e,t)=>e.concat(t.map(e=>e.pct)),[]),o=a.length?Math.max.apply(null,a)+"%":"—";return`<div class="profile-kicker">Profile</div>\n  <div class="profile-shell">\n    <section class="profile-summary">\n      <div class="profile-rank-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg></div>\n      <div class="profile-copy">\n        <h2>${esc(userName(currentUser))}</h2>\n        <p>${esc(RANKS[e].name)} · Level ${e+1} of ${RANKS.length}</p>\n        <span class="profile-email">${esc(currentUser.email||"")}</span>\n      </div>\n      <div class="profile-actions"><button class="auth-logout" type="button" data-auth-logout>Logout</button></div>\n    </section>\n    <div class="stat-grid profile-stats">\n      <div class="stat"><b>${t}/${DATA.lessons.length}</b><span>Lessons done</span></div>\n      <div class="stat"><b>${n}/${DATA.quizzes.length}</b><span>Quizzes passed</span></div>\n      <div class="stat"><b>${s}</b><span>Quiz attempts</span></div>\n      <div class="stat"><b>${o}</b><span>Best score</span></div>\n    </div>\n  </div>`};const TABS=[{route:"#/home",label:"Home",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',match:["home"]},{route:"#/lessons",label:"Lessons",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>',match:["lessons","lesson"]},{route:"#/playground",label:"Play",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',match:["playground"]},{route:"#/quizzes",label:"Quizzes",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',match:["quizzes","quiz"]},{route:"#/teardowns",label:"Teardowns",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="11" height="16" rx="2"/><path d="M8 7h3M7 11h5M9.5 19v2M18 8v11M15.5 10.5 18 8l2.5 2.5M15.5 16.5 18 19l2.5-2.5"/></svg>',match:["teardowns"]},{route:"#/profile",label:"Profile",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',match:["profile"],top:!1}];function setActiveTab(e){const t=TABS.find(t=>t.match.includes(e)),n=t?t.match[0]:e;$$(".side-link").forEach(e=>e.classList.toggle("active",e.dataset.match===n)),$$(".nav-link").forEach(e=>e.classList.toggle("active",e.dataset.match===n))}var viewCleanup=[];
function runViewCleanup(){try{viewCleanup.forEach(function(fn){try{fn()}catch(e){}})}catch(e){}viewCleanup=[];}
function onViewCleanup(fn){try{viewCleanup.push(fn)}catch(e){}}
function route(){try{if((location.hash||"#/home").indexOf("#/teardowns")!==0){tdReleaseOneFrame();}}catch(e){}runViewCleanup();const e=location.hash||"#/home",t=e.match(/^#\/(\w+)(?:\/(\d+))?/),n=t&&t[1]||"home",s=t&&t[2]?parseInt(t[2],10):null,a=$("#app");let o="",i=n,r=!1;views[n]?(o=s?views[n](s):views[n](),S.last={route:e}):(o=views.home(),i="home"),"playground"!==n&&"progress"!==n||(r=!0),document.body.classList.toggle("progress-page","progress"===n),document.body.classList.toggle("home-page","home"===n),save(),a.innerHTML=`<div class="view${window.__lr===e?"":" view-anim"}"><div class="wrap${r?" wide":""}">${o}</div></div>`,window.__lr=e,setActiveTab(i),updateRankUI(),updateAuthUI(),requestAnimationFrame(()=>requestAnimationFrame(()=>{$$(".pbar > i").forEach(e=>{e.style.width=e.dataset.w+"%"});const e=$("[data-count]");if(e){const t=+e.dataset.count,n=performance.now();!function s(a){const o=Math.min(1,(a-n)/900);e.textContent=Math.round(t*(1-Math.pow(1-o,3))),o<1&&requestAnimationFrame(s)}(n)}})),bindView(n,s),window.scrollTo({top:0})}function bindView(e,t){if("home"===e&&void 0,"progress"===e){const e=$("#ranks-help");e&&(e.onclick=showAllRanks)}if("profile"===e){$$("[data-auth-mode]").forEach(e=>{e.onclick=()=>{const t="register"===e.dataset.authMode?"register":"login";if(t===authMode||authSwitching)return;authSwitching=!0;const n="register"===t?1:-1,s=$(".auth-card"),a=$(".auth-tabs"),o=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;a&&(a.dataset.mode=t,$$("[data-auth-mode]").forEach(e=>{const n=e.dataset.authMode===t;e.classList.toggle("active",n),e.setAttribute("aria-selected",n?"true":"false")})),s&&!o&&s.classList.add(n>0?"auth-leave-left":"auth-leave-right"),window.setTimeout(()=>{authMode=t,authSlideDirection=o?0:n,authSwitching=!1,render()},o?0:190)}});const e=$("#auth-form");e&&(e.onsubmit=t=>{t.preventDefault(),handleAuthSubmit(e)}),$$("[data-auth-logout]").forEach(e=>{e.onclick=showLogoutConfirm})}const n=$("#complete-lesson");n&&(n.onclick=()=>{const e=()=>{const e=DATA.lessons[t-1];if(!S.lessonsDone[e.id]){const t=rankIndexFor(doneCount());S.lessonsDone[e.id]=!0,bumpRank(t)}};if(currentUser)return void e();const n=document.createElement("div");n.className="modal-veil",n.innerHTML='<div class="modal logout-dialog progress-login-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-login-title" aria-describedby="progress-login-message">\n      <h2 id="progress-login-title">Log in to save progress</h2>\n      <p id="progress-login-message">Your progress is only saved on this device right now. Log in to keep it tied to your account — otherwise it could be lost.</p>\n      <div class="logout-actions">\n        <button class="btn btn-accent" type="button" data-progress-login>Log in</button>\n        <button class="btn logout-cancel" type="button" data-progress-continue>Continue without login</button>\n      </div>\n    </div>',document.body.appendChild(n);const s=e=>{document.removeEventListener("keydown",a),closeModalVeil(n,!0),e&&setTimeout(e,180)},a=e=>{"Escape"===e.key&&s()};n.addEventListener("click",e=>{e.target===n&&s()}),n.querySelector("[data-progress-login]").onclick=()=>s(()=>{location.hash="#/profile"}),n.querySelector("[data-progress-continue]").onclick=()=>s(e),document.addEventListener("keydown",a),requestAnimationFrame(()=>{n.classList.add("show"),syncModalScrollLock(),n.querySelector("[data-progress-login]").focus()})}),$$("[data-q]").forEach(e=>e.onclick=()=>{const[t,n,s]=e.dataset.q.split(":"),a=quizState[t]||(quizState[t]={answers:{},done:!1,score:0,current:0});if(a.done)return;a.answers[+n]=+s,$$(`[data-q^="${t}:${n}:"]`).forEach(t=>{const n=t===e;t.classList.toggle("sel",n),t.setAttribute("aria-pressed",n?"true":"false")});const o=$("#quiz-next");o&&(o.disabled=!1)}),"progress"===e&&$$(".qh-pdf").forEach(e=>e.onclick=t=>{t.preventDefault(),t.stopPropagation(),downloadQuizPdf(e.dataset.q,((S.quizHistory||{})[e.dataset.q]||[])[+e.dataset.ai])});const s=$("#quiz-back");s&&(s.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id];n.current=Math.max(0,n.current-1),renderQuizStep(t)});const a=$("#quiz-next");a&&(a.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id];if(null==n.answers[n.current])return;if(n.current<e.questions.length-1)return n.current++,void renderQuizStep(t);let s=0;e.questions.forEach((e,t)=>{n.answers[t]===e.answer&&s++}),n.score=s,n.done=!0;const a=Math.round(s/e.questions.length*100);S.quizHistory=S.quizHistory||{};const o=S.quizHistory[e.id]||(S.quizHistory[e.id]=[]);if(o.unshift({score:s,total:e.questions.length,pct:a,answers:Object.assign({},n.answers),at:Date.now()}),o.length>5&&(o.length=5),a>=QUIZ_PASS&&!S.quizzesPassed[e.id]){const t=rankIndexFor(doneCount());S.quizzesPassed[e.id]=!0,bumpRank(t)}else save();renderQuizResult(t)});const o=$("#quiz-retry");o&&(o.onclick=()=>{const e=DATA.quizzes[t-1];quizState[e.id]={answers:{},done:!1,score:0,current:0},renderQuizStep(t)});const i=$("#quiz-pdf");i&&(i.onclick=()=>{const e=DATA.quizzes[t-1],n=quizState[e.id],s=e.questions.length;downloadQuizPdf(e.id,{score:n.score,total:s,pct:Math.round(n.score/s*100),answers:Object.assign({},n.answers),at:Date.now()})})}function renderQuizScreen(e,t){$("#app").innerHTML=`<div class="view"><div class="wrap">${views.quiz(e,t)}</div></div>`,bindView("quiz",e),window.scrollTo({top:0,behavior:"smooth"})}function renderQuizStep(e){renderQuizScreen(e,!1)}function renderQuizResult(e){renderQuizScreen(e,!0)}function render(){route()}function applyTheme(){"dark"!==S.theme&&"light"!==S.theme&&(S.theme="light");const e="dark"===S.theme;document.documentElement.dataset.theme=e?"dark":"light";const t=e?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';$$(".theme-btn").forEach(e=>{const n=e.querySelector(".ti");n?n.innerHTML=t:e.innerHTML=t})}function cycleTheme(e){const t="dark"===S.theme?"light":"dark";try{const n=e&&e.currentTarget?e.currentTarget:document.querySelector(".theme-btn");if(n&&document.startViewTransition){const e=n.getBoundingClientRect(),s=e.left+e.width/2,a=e.top+e.height/2,o=Math.hypot(Math.max(s,innerWidth-s),Math.max(a,innerHeight-a));return void document.startViewTransition(()=>{S.theme=t,save(),applyTheme()}).ready.then(()=>{document.documentElement.animate({clipPath:[`circle(0px at ${s}px ${a}px)`,`circle(${o}px at ${s}px ${a}px)`]},{duration:550,easing:"cubic-bezier(.22,1,.36,1)",pseudoElement:"::view-transition-new(root)"})})}if(n){const e=n.getBoundingClientRect(),s=e.left+e.width/2,a=e.top+e.height/2,o=Math.hypot(Math.max(s,innerWidth-s),Math.max(a,innerHeight-a)),i=document.createElement("div");i.style.cssText=`position:fixed;left:${s}px;top:${a}px;width:0;height:0;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);background:${"dark"===t?"#0a1424":"#e8edf5"};`,document.body.appendChild(i);const r=i.animate([{width:"0px",height:"0px"},{width:2*o+"px",height:2*o+"px"}],{duration:550,easing:"cubic-bezier(.22,1,.36,1)",fill:"forwards"});return setTimeout(()=>{S.theme=t,save(),applyTheme()},200),void(r.onfinish=()=>setTimeout(()=>i.remove(),120))}}catch(e){}S.theme=t,save(),applyTheme()}function initPopupScrollLock(){new MutationObserver(syncModalScrollLock).observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden"]}),syncModalScrollLock()}function shell(){const e='<img class="brand-logo brand-logo-light" src="data:image/png;base64,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" alt=""><img class="brand-logo brand-logo-dark" src="data:image/png;base64,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" alt="">';document.body.innerHTML=`\n  <nav class="topnav">\n    <a class="brand" href="#/home">${e}<span>FlutterForward</span></a>\n    <div class="nav-links">\n      ${TABS.filter(e=>!1!==e.top).map(e=>`<a class="nav-link"data-match="${e.match[0]}"href="${e.route}">${e.label}</a>`).join("")}\n    </div>\n    <div class="nav-right">${rankChip()}<div class="auth-nav">${authNavMarkup()}</div><button class="theme-btn" aria-label="Toggle theme"><span class="ti"></span></button></div>\n  </nav>\n  <main id="app"></main>\n  <div class="side-veil" id="side-veil"></div>\n  <aside class="sidebar" id="sidebar" aria-hidden="true" aria-label="Menu">\n    <div class="side-head">\n      <span class="side-brand">${e}<span>FlutterForward</span></span>\n      <button class="side-close" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button>\n    </div>\n    <nav class="side-links">\n      ${TABS.filter(e=>!1!==e.top).map(e=>`<a class="side-link"data-match="${e.match[0]}"href="${e.route}"><span class="ico">${e.icon}</span><span>${e.label}</span></a>`).join("")}\n    </nav>\n    <div class="side-foot">\n      <div class="auth-nav">${authNavMarkup()}</div>\n      ${rankChip()}\n      <button class="theme-btn side-theme" aria-label="Toggle theme"><span class="ti"></span><span>Theme</span></button>\n    </div>\n  </aside>\n  <div class="modal-veil" id="rankup-veil" hidden>\n    <div class="modal rankup-dialog">\n      <span class="trophy">${TROPHY_ICON}</span>\n      <h2>Rank up</h2>\n      <div class="newrank" id="rankup-name"></div>\n      <p>Your Flutter skills are leveling up. Keep going.</p>\n      <button class="btn btn-accent btn-block" id="rankup-ok">Keep learning →</button>\n    </div>\n  </div>\n  <div class="modal-veil" id="logout-veil" hidden>\n    <div class="modal logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-message">\n      <span class="logout-icon" aria-hidden="true">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">\n          <path d="M10 5H6.8A1.8 1.8 0 0 0 5 6.8v10.4A1.8 1.8 0 0 0 6.8 19H10"/>\n          <path d="M14.5 8.5 18 12l-3.5 3.5M18 12H9"/>\n        </svg>\n      </span>\n      <h2 id="logout-title">Log out?</h2>\n      <p id="logout-message">Your progress stays saved in this browser.</p>\n      <div class="logout-actions">\n        <button class="btn logout-confirm" type="button" id="logout-confirm">Log out</button>\n        <button class="btn logout-cancel" type="button" id="logout-cancel">Cancel</button>\n      </div>\n    </div>\n  </div>`,$$(".theme-btn").forEach(e=>e.onclick=cycleTheme),$("#rankup-ok").onclick=hideRankUp,$("#rankup-veil").addEventListener("click",e=>{"rankup-veil"===e.target.id&&hideRankUp()}),$("#logout-cancel").onclick=hideLogoutConfirm,$("#logout-confirm").onclick=confirmLogout,$("#logout-veil").addEventListener("click",e=>{"logout-veil"===e.target.id&&hideLogoutConfirm()});const t=$("#sidebar"),n=$("#side-veil"),s=()=>{t.classList.remove("open"),n.classList.remove("show"),t.setAttribute("aria-hidden","true"),document.body.classList.remove("side-open")};n.onclick=s,$(".side-close").onclick=s,$$(".side-link").forEach(e=>e.addEventListener("click",s)),t.addEventListener("click",e=>{const t=e.target.closest(".side-foot .rank-chip, .side-foot .auth-login, .side-foot .profile-link, .side-foot [data-auth-logout]");t&&(s(),t.matches("[data-auth-logout]")&&showLogoutConfirm({currentTarget:t}))}),document.addEventListener("keydown",e=>{"Escape"===e.key&&($("#logout-veil").classList.contains("show")?hideLogoutConfirm():$("#rankup-veil").classList.contains("show")?hideRankUp():s())});const a=document.createElement("div");a.innerHTML=`<div style="display:flex;align-items:center;gap:9px;padding:14px 14px 0;max-width:920px;margin:0 auto">\n    <button class="menu-btn" id="menu-btn" aria-label="Open menu"><span></span><span></span><span></span></button>\n    <a class="mobile-home" href="#/home" aria-label="FlutterForward home" style="display:flex;align-items:center;text-decoration:none;color:inherit">\n    ${e}<span>FlutterForward</span></a>\n    <button class="theme-btn" style="width:36px;height:36px;font-size:15px;margin-left:auto" aria-label="Toggle theme"><span class="ti"></span></button></div>`,a.className="mobile-top",document.body.prepend(a),$("#menu-btn").onclick=()=>{t.classList.add("open"),n.classList.add("show"),t.setAttribute("aria-hidden","false"),document.body.classList.add("side-open")},$$(".mobile-top .theme-btn").forEach(e=>e.onclick=cycleTheme);const o=document.createElement("style");o.textContent="@media(min-width:1080px){.mobile-top{display:none}}",document.head.appendChild(o)}window.__FL_BOOTED=!0,window.__FL_TIMER&&clearTimeout(window.__FL_TIMER),shell(),initPopupScrollLock(),applyTheme(),updateRankUI(),updateAuthUI(),window.addEventListener("hashchange",route);window.addEventListener("resize",function(){try{if(teardownState.app)tdEnforceOneFrame();}catch(e){}}),route(),initFirebaseAuth();;
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
)`)
        ]),
        tdNode("wa-outgoing","Row","Places children horizontally on one line.","This reversed alignment pushes the user's bubble to the right.",`Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [OutgoingBubble(message: message)],
)`,[
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
    children: [HelpTile(), Divider(), AboutTile()],
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
          tdNode("st-tile-about","ListTile","A ready-made settings row: leading icon, title, trailing.","About shows the app version and legal info.",`ListTile(
  leading: const Icon(Icons.info_outline),
  title: const Text('About'),
  trailing: const Icon(Icons.chevron_right),
  onTap: openAbout,
)`,[
            tdNode("st-tile-about-icon","Icon","Draws a Material icon glyph.","The info mark signals app metadata lives here.",`const Icon(Icons.info_outline, color: Color(0xFF5B5BD6))`),
            tdNode("st-tile-about-title","Text","Renders a styled string on screen.","'About' labels the app-info screen.",`const Text('About')`),
            tdNode("st-tile-about-chev","Icon","Draws a Material icon glyph.","The chevron shows the row is tappable.",`const Icon(Icons.chevron_right, color: Colors.grey)`)
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
  }
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
  BottomNavigationBar:"Keeps primary app destinations at the bottom.", ClipRRect:"Clips a child to rounded corners."
};
const TD_CODE_PROPS = {
  "wa-theme":"data: ThemeData(colorSchemeSeed: const Color(0xFF075E54)),",
  "wa-body":"decoration: const BoxDecoration(image: DecorationImage(image: AssetImage('chat_bg.png'))),",
  "wa-incoming":"alignment: Alignment.centerLeft,", "wa-outgoing":"alignment: Alignment.centerRight,",
  "wa-in-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Colors.white),",
  "wa-out-bubble":"padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: const BoxDecoration(color: Color(0xFFD9FDD3)),",
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
            T("wa-incoming","Align","Incoming messages attach to the left edge.",[
              T("wa-in-bubble","Container","Padding, color, and corner radius form one incoming bubble.",[
                T("wa-in-column","Column","Message text and time are stacked inside the bubble.",[
                  T("wa-in-text","Text","Displays the received message body.",[],`Text(message.text)`),
                  T("wa-in-time","Text","Shows when the message arrived.",[],`Text(message.time, style: const TextStyle(fontSize: 10))`)
                ])
              ])
            ]),
            T("wa-outgoing","Align","The user's message attaches to the right edge.",[
              T("wa-out-bubble","Container","A green surface distinguishes the sent message.",[
                T("wa-out-row","Row","Time and delivery state share the bubble's trailing line.",[
                  T("wa-out-text","Text","Displays the sent message body.",[],`Text(message.text)`),
                  T("wa-ticks","Stack","Two offset check icons form the read receipt.",[],`Stack(children: const [\n  Icon(Icons.check, size: 13),\n  Positioned(left: 4, child: Icon(Icons.check, size: 13)),\n])`)
                ])
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
    ],`Container(\n  decoration: const BoxDecoration(image: DecorationImage(image: AssetImage('chat_bg.png'))),\n  child: const ChatColumn(),\n)`)
  ],`Scaffold(\n  appBar: const ChatAppBar(),\n  body: const ChatBody(),\n)`)
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
            ])
          ])
        ])
      ])
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


/*

/* Keep the teaching tree aligned with the visible mockups. Every selectable node below has a complete, contextual snippet. */
(function refineTeardownContent(){
  const wa = tdIndex(TEARDOWNS.whatsapp).map;
  const messageText = (id,text) => T(id,"Text",`It shows “${text}” inside this bubble.`,[],`Text.rich(\n  TextSpan(\n    children: [\n      const TextSpan(text: '${text.replace(/'/g,"\\'")}'),\n      const TextSpan(text: '  9:40', style: TextStyle(fontSize: 10)),\n    ],\n  ),\n)`);
  const bubble = (side,key,text,time) => {
    const textNode = messageText(`wa-${key}-text`,text); textNode.code = textNode.code.replace("9:40",time);
    const box = T(`wa-${key}-bubble`,"Container",`${side === "right" ? "Green color marks this as the user's message." : "A white surface separates this received message from the chat background."}`,[textNode],`Container(\n  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),\n  decoration: BoxDecoration(\n    color: ${side === "right" ? "const Color(0xFFD9FDD3)" : "Colors.white"},\n    borderRadius: BorderRadius.circular(7),\n  ),\n  child: ${textNode.code.replace(/\n/g,"\n  ")},\n)`);
    return T(`wa-${key}`,"Align",`${side === "right" ? "It pins the sent message to the right." : "It pins the received message to the left."}`,[box],`Align(\n  alignment: Alignment.center${side === "right" ? "Right" : "Left"},\n  child: ${box.code.replace(/\n/g,"\n  ")},\n)`);
  };
  const day = wa["wa-day-align"];
  const incoming = bubble("left","incoming","Are you joining the Flutter session?","9:38");
  const outgoing = bubble("right","outgoing","Yes — just finished the widget tree.","9:39");
  const reply = bubble("left","reply","Perfect. See you there!","9:40");
  wa["wa-list"].children = [day,incoming,outgoing,reply];
  wa["wa-list"].code = `ListView.builder(\n  padding: const EdgeInsets.all(12),\n  itemCount: messages.length + 1,\n  itemBuilder: (context, index) {\n    if (index == 0) return const DayLabel('TODAY');\n    final message = messages[index - 1];\n    return Align(\n      alignment: message.isMine ? Alignment.centerRight : Alignment.centerLeft,\n      child: MessageBubble(message: message),\n    );\n  },\n)`;

  const sw = tdIndex(TEARDOWNS.swiggy).map;
  const swColumn = sw["sw-content-column"];
  const restaurantTitleIndex = swColumn.children.findIndex(node=>node.id==="sw-restaurants-title");
  if (restaurantTitleIndex >= 0 && !swColumn.children.some(node=>node.id==="sw-restaurants-subtitle")) {
    swColumn.children.splice(restaurantTitleIndex + 1,0,T("sw-restaurants-subtitle","Text","It adds a short note below the restaurant heading.",[],`const Text('Fast delivery and great ratings')`));
  }

  const simplePurpose = {
    MaterialApp:"Starts the Material app and applies shared settings.", Scaffold:"Holds the main parts of one screen.", Theme:"Applies a focused color and text style to its child.",
    AppBar:"Builds the top bar and its actions.", SafeArea:"Keeps content away from system cutouts and gestures.", CustomScrollView:"Scrolls several page sections together.",
    SliverAppBar:"Builds a top bar that can stay visible while scrolling.", SliverToBoxAdapter:"Places a regular widget inside a sliver page.", SliverPersistentHeader:"Keeps a header available while the page scrolls.",
    SliverGrid:"Builds the scrolling photo grid.", Column:"Places children from top to bottom.", Row:"Places children side by side.", Expanded:"Fills the remaining space on the row or column.",
    Padding:"Adds space around its child.", Container:"Adds spacing, color, shape, or size around a child.", SizedBox:"Sets a fixed gap or size.", Align:"Pins its child to a chosen edge.", Center:"Centers its child.",
    ListView:"Builds a scrollable list.", Text:"Draws text on the screen.", Icon:"Draws a Material icon.", Image:"Shows an image.", CircleAvatar:"Shows identity content in a circle.",
    Card:"Groups related content on one surface.", Stack:"Layers children on top of each other.", TextField:"Lets the user type text.", IconButton:"Makes an icon tappable.", PopupMenuButton:"Opens a menu of extra actions.",
    TabBar:"Lets the user switch between content views.", Tab:"Represents one view in a tab bar.", OutlinedButton:"Shows a secondary action button.", BottomNavigationBar:"Keeps primary destinations at the bottom.", ClipRRect:"Clips its child to rounded corners."
  };
  Object.values(TEARDOWNS).forEach(item => {
    (function walk(node){ node.what = simplePurpose[node.name] || "Builds this visible part of the interface."; node.children.forEach(walk); })(item.root);
  });
})();
Object.values(TEARDOWNS).forEach(item => { item.count = Object.keys(tdIndex(item).map).length; });

const TD_ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/></svg>',
  call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h3l1 5-2 1a14 14 0 0 0 6 6l1-2 5 1v3c0 2-2 4-4 4C9 20 4 15 3 7c0-2 2-4 4-4Z"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.3 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 11 18-8-8 18-2-8-8-2Z"/><path d="m11 13 10-10"/></svg>',
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
  return `${tdStatus(true)}<div class="wa-screen td-region" data-node="wa-scaffold" data-widget="Scaffold"><header class="wa-bar td-region" data-node="wa-appbar" data-widget="AppBar"><span class="wa-back td-region" data-node="wa-back" data-widget="IconButton">‹</span><span class="wa-title-row td-region" data-node="wa-title-row" data-widget="Row"><span class="wa-avatar td-region" data-node="wa-avatar" data-widget="CircleAvatar">A</span><span class="wa-person td-region" data-node="wa-title" data-widget="Column"><b class="td-region" data-node="wa-name" data-widget="Text">Alex</b><span class="td-region" data-node="wa-online" data-widget="Text">online</span></span></span><span class="wa-actions"><span class="td-region" data-node="wa-video" data-widget="IconButton">${TD_ICON.video}</span><span class="td-region" data-node="wa-call" data-widget="IconButton">${TD_ICON.call}</span><b class="td-region" data-node="wa-menu" data-widget="PopupMenuButton" style="font-size:17px;letter-spacing:2px">⋮</b></span></header><main class="wa-chat td-region" data-node="wa-list" data-widget="ListView"><div class="wa-day-align td-region" data-node="wa-day-align" data-widget="Center"><div class="wa-day td-region" data-node="wa-day-box" data-widget="Container"><span class="td-region" data-node="wa-day-text" data-widget="Text">TODAY</span></div></div><div class="wa-message-row td-region" data-node="wa-incoming" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-incoming-bubble" data-widget="Container"><span class="td-region" data-node="wa-incoming-text" data-widget="Text">Are you joining the Flutter session?<span class="wa-time">9:38</span></span></div></div><div class="wa-message-row mine td-region" data-node="wa-outgoing" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-outgoing-bubble" data-widget="Container"><span class="td-region" data-node="wa-outgoing-text" data-widget="Text">Yes — just finished the widget tree.<span class="wa-time">9:39 <span class="wa-ticks"></span></span></span></div></div><div class="wa-message-row td-region" data-node="wa-reply" data-widget="Align"><div class="wa-bubble td-region" data-node="wa-reply-bubble" data-widget="Container"><span class="td-region" data-node="wa-reply-text" data-widget="Text">Perfect. See you there!<span class="wa-time">9:40</span></span></div></div></main><footer class="wa-composer-wrap td-region" data-node="wa-composer" data-widget="Row"><div class="wa-composer td-region" data-node="wa-field" data-widget="TextField">${TD_ICON.smile}<span>Message</span><span style="margin-left:auto">⌕</span></div><div class="wa-send td-region" data-node="wa-send" data-widget="IconButton">${TD_ICON.send}</div></footer></div>`;
}
function tdPhoneInstagram() {
  const photos = ["#7b8b9c","#b78363","#4e6d64","#a88767","#6d7e98","#986f78","#556c7e","#8f8068","#66765d"];
  const stat=(id,value,label)=>`<span class="ig-stat td-region" data-node="ig-${id}-stat" data-widget="Column"><b class="td-region" data-node="ig-${id}-value" data-widget="Text">${value}</b><span class="td-region" data-node="ig-${id}-label" data-widget="Text">${label}</span></span>`;
  return `${tdStatus(false)}<div class="ig-screen td-region" data-node="ig-scaffold" data-widget="Scaffold"><main class="ig-scroll td-region" data-node="ig-scroll" data-widget="CustomScrollView"><header class="ig-bar td-region" data-node="ig-sliver" data-widget="SliverAppBar"><b class="td-region" data-node="ig-title" data-widget="Text">flutterforward⌄</b><span class="td-region" data-node="ig-create" data-widget="IconButton">${TD_ICON.plus}</span><span class="td-region" data-node="ig-menu" data-widget="IconButton" style="font-size:20px">☰</span></header><section class="ig-profile td-region" data-node="ig-profile-padding" data-widget="Padding"><div class="td-region" data-node="ig-profile" data-widget="Column"><div class="ig-top td-region" data-node="ig-top" data-widget="Row"><div class="ig-ring td-region" data-node="ig-avatar" data-widget="CircleAvatar"><div class="ig-avatar">FF</div></div><div class="td-region" data-node="ig-stats-expanded" data-widget="Expanded"><div class="ig-stats td-region" data-node="ig-stats" data-widget="Row">${stat('posts','24','posts')}${stat('followers','1,248','followers')}${stat('following','186','following')}</div></div></div><div class="ig-bio td-region" data-node="ig-bio-column" data-widget="Column"><b class="td-region" data-node="ig-bio-name" data-widget="Text">FlutterForward</b><span class="td-region" data-node="ig-bio-copy" data-widget="Text">Learn Flutter through practical screens.</span><span class="td-region" data-node="ig-bio-link" data-widget="Text" style="color:#00376b">flutter.dev</span></div><div class="ig-actions td-region" data-node="ig-actions" data-widget="Row"><span class="td-region" data-node="ig-edit" data-widget="Expanded"><span class="td-region" data-node="ig-edit-button" data-widget="OutlinedButton">Edit profile</span></span><span class="td-region" data-node="ig-share" data-widget="Expanded"><span class="td-region" data-node="ig-share-button" data-widget="OutlinedButton">Share profile</span></span><span class="td-region" data-node="ig-person-add" data-widget="IconButton">＋</span></div></div></section><div class="ig-tabs td-region" data-node="ig-tabs" data-widget="TabBar"><span class="ig-tab td-region" data-node="ig-grid-tab" data-widget="Tab">${TD_ICON.grid}</span><span class="ig-tab td-region" data-node="ig-reels-tab" data-widget="Tab">${TD_ICON.reels}</span><span class="ig-tab td-region" data-node="ig-tagged-tab" data-widget="Tab">${TD_ICON.person}</span></div><div class="ig-grid td-region" data-node="ig-grid" data-widget="SliverGrid">${photos.map((p,i)=>`<div class="ig-photo td-region" data-node="ig-photo" data-widget="Image" style="--photo:${p};--rot:${i%2?'-10deg':'8deg'}"></div>`).join('')}</div></main><nav class="ig-bottom td-region" data-node="ig-bottom" data-widget="BottomNavigationBar"><span class="td-region" data-node="ig-home-item" data-widget="Icon">${TD_ICON.home}</span><span class="td-region" data-node="ig-search-item" data-widget="Icon">${TD_ICON.search}</span><span class="td-region" data-node="ig-create-item" data-widget="Icon">${TD_ICON.plus}</span><span class="td-region" data-node="ig-reels-item" data-widget="Icon">${TD_ICON.reels}</span><span class="mini-avatar td-region" data-node="ig-profile-item" data-widget="CircleAvatar"></span></nav></div>`;
}
function tdPhoneSwiggy() {
  const category=(name,color)=>`<span class="sw-category td-region" data-node="sw-category-item" data-widget="Column"><i class="sw-food td-region" data-node="sw-category-image" data-widget="CircleAvatar" style="--food:${color}">${name}</i><span class="td-region" data-node="sw-category-label" data-widget="Text">${name}</span></span>`;
  const restaurant=(name,meta,color)=>`<article class="sw-card td-region" data-node="sw-card-one" data-widget="Card"><div class="td-region" data-node="sw-card-column" data-widget="Column"><div class="sw-card-pic td-region" data-node="sw-card-image" data-widget="Image" style="--food:${color}"></div><div class="sw-card-body td-region" data-node="sw-card-detail-padding" data-widget="Padding"><span class="td-region" data-node="sw-card-details" data-widget="Column"><b class="td-region" data-node="sw-card-name" data-widget="Text">${name}</b><span class="td-region" data-node="sw-card-meta" data-widget="Text">${meta}</span></span></div></div></article>`;
  return `${tdStatus(false)}<div class="sw-screen td-region" data-node="sw-scaffold" data-widget="Scaffold"><main class="sw-scroll td-region" data-node="sw-scroll-view" data-widget="CustomScrollView"><header class="sw-head td-region" data-node="sw-appbar" data-widget="SliverAppBar"><div class="sw-location td-region" data-node="sw-location-row" data-widget="Row"><span class="td-region" data-node="sw-pin" data-widget="Icon">${TD_ICON.pin}</span><span class="sw-location-copy td-region" data-node="sw-location" data-widget="Column"><b class="td-region" data-node="sw-home-text" data-widget="Text">Home⌄</b><span class="td-region" data-node="sw-address-text" data-widget="Text">MG Road, Bengaluru</span></span><span class="sw-profile td-region" data-node="sw-profile-avatar" data-widget="CircleAvatar">DK</span></div><div class="sw-search td-region" data-node="sw-search" data-widget="TextField"><span>Search for dishes and restaurants</span><span style="margin-left:auto">${TD_ICON.search}</span></div></header><section class="sw-section"><h3 class="td-region" data-node="sw-category-title" data-widget="Text">What's on your mind?</h3><div class="sw-categories td-region" data-node="sw-categories" data-widget="ListView">${category('Biryani','#f4d4a5')}${category('Pizza','#f0c48d')}${category('Dosa','#ead39e')}${category('Rolls','#f2b3a0')}</div><div class="sw-offer td-region" data-node="sw-offer" data-widget="Card"><span class="td-region" data-node="sw-offer-copy" data-widget="Column"><b class="td-region" data-node="sw-offer-title" data-widget="Text">40% OFF</b><span class="td-region" data-node="sw-offer-detail" data-widget="Text">On your first order - use WELCOME</span></span></div></section><section class="sw-section"><h3 class="td-region" data-node="sw-restaurants-title" data-widget="Text">Top restaurants near you</h3><p class="sw-sub td-region" data-node="sw-restaurants-subtitle" data-widget="Text">Fast delivery and great ratings</p><div class="sw-restaurants td-region" data-node="sw-restaurants" data-widget="ListView">${restaurant('Spice Kitchen','4.5 · 25–30 min','#c87a4c')}${restaurant('South Bowl','4.3 · 20–25 min','#d6a56f')}</div></section></main><nav class="sw-bottom td-region" data-node="sw-bottom" data-widget="BottomNavigationBar"><span class="sw-nav td-region" data-node="sw-food-nav" data-widget="Icon">${TD_ICON.home}<span>Food</span></span><span class="sw-nav td-region" data-node="sw-search-nav" data-widget="Icon">${TD_ICON.search}<span>Search</span></span><span class="sw-nav td-region" data-node="sw-cart-nav" data-widget="Icon">${TD_ICON.bag}<span>Cart</span></span><span class="sw-nav td-region" data-node="sw-account-nav" data-widget="Icon">${TD_ICON.person}<span>Account</span></span></nav></div>`;
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
    `<div class="st-group-label td-region" data-node="st-support-header" data-widget="Text">Support</div>` +
    `<section class="st-group td-region" data-node="st-support-group" data-widget="Container">` +
      row("st-tile-help", ICON.help, "Help & feedback", null, chev("st-tile-help")) +
      div("st-div4") +
      row("st-tile-about", ICON.info, "About", null, chev("st-tile-about")) +
    `</section>` +
  `</main></div>`;
}

function tdPhoneLogin() {
  const eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  return `${tdStatus(false)}<div class="lg-screen td-region" data-node="lg-scaffold" data-widget="Scaffold"><div class="lg-safe td-region" data-node="lg-safe" data-widget="SafeArea"><div class="lg-center td-region" data-node="lg-center" data-widget="Center"><div class="lg-form-pad td-region" data-node="lg-form-padding" data-widget="Padding"><div class="td-region" data-node="lg-form" data-widget="Form"><div class="lg-col td-region" data-node="lg-col" data-widget="Column"><b class="lg-title td-region" data-node="lg-title" data-widget="Text">Welcome back</b><span class="lg-subtitle td-region" data-node="lg-subtitle" data-widget="Text">Sign in to continue</span><div class="lg-field td-region" data-node="lg-email-field" data-widget="TextField"><span class="td-region" data-node="lg-email-icon" data-widget="Icon">${mail}</span><span class="td-region" data-node="lg-email-decoration" data-widget="InputDecoration">Email</span></div><div class="lg-field td-region" data-node="lg-pass-field" data-widget="TextField"><span class="td-region" data-node="lg-pass-icon" data-widget="Icon">${lock}</span><span class="td-region" data-node="lg-pass-decoration" data-widget="InputDecoration">Password</span><span class="lg-eye td-region" data-node="lg-eye" data-widget="IconButton">${eye}</span></div><div class="lg-login td-region" data-node="lg-login-btn" data-widget="ElevatedButton"><span>Log in</span></div><div class="lg-signup-row td-region" data-node="lg-signup-row" data-widget="Row"><span class="td-region" data-node="lg-signup-text" data-widget="Text">New here?</span><span class="td-region" data-node="lg-signup-link" data-widget="GestureDetector"><b class="td-region" data-node="lg-signup-link-text" data-widget="Text">Create account</b></span></div></div></div></div></div></div></div>`;
}
function tdPhone(key) { return key === "whatsapp" ? tdPhoneWhatsApp() : key === "instagram" ? tdPhoneInstagram() : key === "settings" ? tdPhoneSettings() : key === "login" ? tdPhoneLogin() : tdPhoneSwiggy(); }
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
let teardownState = { app: null, selected: null, bounds: false };
function tdSelectedNode() { return teardownState.app && teardownState.selected ? tdIndex(TEARDOWNS[teardownState.app]).map[teardownState.selected] : null; }
function teardownIndexView() {
  return `<div class="teardown-intro">${pageHead(null,"App Teardowns","Real apps, taken apart widget by widget.")}</div><div class="teardown-index">${Object.entries(TEARDOWNS).map(([key,item])=>`<button class="teardown-row" data-teardown-open="${key}"><span class="teardown-num">${String(Object.keys(TEARDOWNS).indexOf(key)+1).padStart(2,"0")}</span><span class="teardown-row-copy"><span class="teardown-row-title">${item.app}</span><span class="teardown-row-screen">${item.screen}</span></span><span class="teardown-row-count">${item.count} widgets</span><span class="teardown-row-chevron" aria-hidden="true">›</span></button>`).join("")}</div>`;
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
    if (m.indexOf('&#39;') === 0) return '<span class="tk-str">' + m + '</span>';
    if (m.indexOf('//') === 0) return '<span class="tk-com">' + m + '</span>';
    if (/^\d/.test(m)) return '<span class="tk-num">' + m + '</span>';
    if (/^[A-Z]/.test(m)) return '<span class="tk-type">' + m + '</span>';
    return '<span class="tk-kw">' + m + '</span>';
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
    + `<div class="td-panel-head"><div class="teardown-kicker">${esc(item.app)} teardown • ${esc(item.screen)}</div><button class="td-panel-close" data-teardown-close aria-label="Close panel">×</button></div>`
    + `<div class="td-fi-crumb">${crumbs}</div>`
    + `<h2 class="td-fi-name">${esc(node.name)}</h2>`
    + `<p class="td-fi-desc">${esc(node.what)} ${esc(node.why)}</p>`
    + propsHtml
    + `<div class="td-fi-code-wrap"><div class="td-fi-code-head"><span>Example</span><button class="td-fi-copy" data-teardown-copy>Copy</button></div>`
    + `<pre class="td-fi-code"><code>${tdHighlight(node.code)}</code></pre></div>`
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

function tdEnforceOneFrame() {
  var isMobile = window.innerWidth < 901;
  // Lock body scroll (html stays scrollable for pull-to-refresh)
  document.body.style.setProperty('overflow', 'hidden', 'important');
  var d = document.querySelector('.teardown-detail');
  if (!d) return;
  if (isMobile) {
    // Mobile: size detail to fit viewport accounting for top offset
    var rect = d.getBoundingClientRect();
    var top = rect.top;
    var targetH = window.innerHeight - top - 8;
    d.style.setProperty('height', targetH + 'px', 'important');
    d.style.setProperty('min-height', targetH + 'px', 'important');
    d.style.setProperty('max-height', targetH + 'px', 'important');
    d.style.setProperty('overflow', 'hidden', 'important');
    return;
  }
  if (!d) return;
  var vh = window.innerHeight;
  var rect = d.getBoundingClientRect();
  var top = rect.top;
  var targetH = vh - top - 20;
  d.style.setProperty('height', targetH + 'px', 'important');
  d.style.setProperty('min-height', targetH + 'px', 'important');
  d.style.setProperty('max-height', targetH + 'px', 'important');
  d.style.setProperty('overflow', 'hidden', 'important');
  d.style.setProperty('display', 'flex', 'important');
  d.style.setProperty('flex-direction', 'column', 'important');
  d.style.setProperty('transition', 'none', 'important');
  var wb = d.querySelector('.teardown-workbench');
  if (wb) {
    wb.style.setProperty('flex', '1', 'important');
    wb.style.setProperty('min-height', '0', 'important');
    wb.style.setProperty('overflow', 'hidden', 'important');
  }
  var panel = d.querySelector('.teardown-panel');
  if (panel && !panel.classList.contains('is-empty')) {
    panel.style.setProperty('height', '100%', 'important');
    panel.style.setProperty('max-height', '100%', 'important');
    panel.style.setProperty('overflow-y', 'auto', 'important');
  }
  // Phone sizing is now pure CSS (responsive), no JS needed
  document.body.style.setProperty('margin', '0', 'important');
  document.documentElement.style.setProperty('height', '100vh', 'important');
  document.body.style.setProperty('height', '100vh', 'important');
  document.body.style.setProperty('max-height', '100vh', 'important');
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
}

function tdRender() {
  const root=$("#teardowns-root"); if(!root)return;
  // Force cleanup: remove all children explicitly to break references
  while (root.firstChild) { root.removeChild(root.firstChild); }
  // Force style recalc to flush pending animations
  void root.offsetHeight;
  root.innerHTML=teardownState.app?tdDetailView():teardownIndexView();
  tdPrepare();

  try { if (teardownState.app) { tdEnforceOneFrame(); } else { tdReleaseOneFrame(); } } catch(e) {}}
function tdOpen(key) { if(!TEARDOWNS[key])return; teardownState={app:key,selected:null,bounds:false}; tdRender(); window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"}); }
function tdBack() {
  try {
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
function tdClose() { teardownState.selected=null; document.body.classList.remove("td-sheet-open"); tdRender(); }
function tdToggleBounds() {}
function tdCopy() {
  const node=tdSelectedNode(); if(!node)return;
  const done=()=>{const b=$("[data-teardown-copy]");if(b){b.textContent="Copied ✓";b.classList.add("ok");window.setTimeout(()=>{if(document.contains(b)){b.textContent="Copy code";b.classList.remove("ok");}},1300);}};
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

// tdPanel override removed (using new Flutter-inspector version);

tdDetailView = function() {
  const item=TEARDOWNS[teardownState.app];
  return `<div class="teardown-detail"><a class="td-back-link" href="#/teardowns" data-teardown-index>← All teardowns</a><div class="teardown-workbench"><div class="teardown-phone-stage"><div class="teardown-phone"><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div></div>${tdPanel()}</div></div>`;
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
  const stage=root.querySelector(".teardown-phone-stage");if(stage)stage.classList.toggle("show-bounds",false);
  tdBindCanvas();tdApplyView();tdSyncSelection();
};
tdRender = function(keepView) {
  const root=$("#teardowns-root");if(!root)return;
  const previous=keepView?teardownState.view:null;
  root.innerHTML=teardownState.app?tdDetailView():teardownIndexView();
  teardownState.view=previous;tdPrepare();
  if(teardownState.app&&!previous)requestAnimationFrame(tdFitTree);
  try { if (teardownState.app) { tdEnforceOneFrame(); } else { tdReleaseOneFrame(); } } catch(e) {}
};
tdOpen = function(key) {
  if(!TEARDOWNS[key])return;
  teardownState={app:key,selected:null,bounds:false,collapsed:new Set(),view:null,layout:null,animateFrom:null};
  tdRender(false);window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"});
};
tdBack = function(){ try { teardownState.app=null; teardownState.selected=null; teardownState.view=null; if(teardownState.collapsed) teardownState.collapsed.clear(); try { tdReleaseOneFrame(); } catch(e) {} document.body.classList.remove("td-sheet-open"); if(typeof tdRender==="function") tdRender(false); window.scrollTo({top:0,behavior:"smooth"}); } catch(e){ console.error("tdBack failed:", e); location.hash="#/teardowns"; location.reload(); } };
tdSelect = function(id){if(!teardownState.app||!tdIndex(TEARDOWNS[teardownState.app]).map[id])return;teardownState.selected=id;tdSyncSelection();};
function tdShowPicker(stack, x, y) {
  // Visual pop-out: each widget lifts out, filtered and uniformly sized
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
  layer.innerHTML = '<div class="td-popout-backdrop"></div><div class="td-popout-stage"></div><button class="td-popout-close" aria-label="Close">×</button>';
  layer.querySelector(".td-popout-close").addEventListener("click", function(e){ e.stopPropagation(); tdDismissPopout(); });
  document.body.appendChild(layer);
  var stage = layer.querySelector(".td-popout-stage");
  var idx = tdIndex(TEARDOWNS[teardownState.app]);
  var n = filtered.length;
  // Smart layout: use vertical if horizontal cards won't fit comfortably
  // Each card ~150px + 20px gap; need 85% of viewport for comfortable fit
  var cardWidth = 170;
  var needsVertical = (n * cardWidth) > (window.innerWidth * 0.85);
  // Also use vertical on small screens regardless
  if (window.innerWidth < 600) needsVertical = true;
  if (needsVertical) stage.classList.add("td-vertical");
  filtered.forEach(function(r, i){
    var nodeId = r.dataset.node;
    var node = idx.map[nodeId];
    var name = node ? node.name : nodeId;
    var rect = r.getBoundingClientRect();
    var clone = r.cloneNode(true);
    clone.removeAttribute("data-node");
    clone.classList.remove("td-region", "td-active");
    clone.querySelectorAll(".td-hotspot, .td-pick-badge").forEach(function(h){ h.remove(); });
    var cs = window.getComputedStyle(r);
    // Intelligent background: find natural bg by walking up DOM
    var natBg = cs.backgroundColor;
    var p = r.parentElement;
    var depth = 0;
    while ((natBg === 'rgba(0, 0, 0, 0)' || natBg === 'transparent') && p && depth < 8) {
      var pcs = window.getComputedStyle(p);
      if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') {
        natBg = pcs.backgroundColor;
        break;
      }
      p = p.parentElement;
      depth++;
    }
    // Fallback: contrast-based on text color
    if (natBg === 'rgba(0, 0, 0, 0)' || natBg === 'transparent') {
      var tc = cs.color;
      // Parse rgb to determine lightness
      var m = tc.match(/\d+/g);
      if (m && m.length >= 3) {
        var lum = (0.299 * parseInt(m[0]) + 0.587 * parseInt(m[1]) + 0.114 * parseInt(m[2])) / 255;
        natBg = lum > 0.6 ? '#1a1d21' : '#ffffff'; // dark text -> light bg, light text -> dark bg
      } else {
        natBg = '#ffffff';
      }
    }
    // Uniform scale: fit in box (larger on mobile)
    var isMob = window.innerWidth < 760;
    var maxW = isMob ? 120 : 140;
    var maxH = isMob ? 90 : 100;
    var scale = Math.min(maxW / Math.max(rect.width, 1), maxH / Math.max(rect.height, 1), 1);
    clone.style.cssText += ";color:" + cs.color + ";background-color:" + cs.backgroundColor + ";font-size:" + cs.fontSize + ";font-family:" + cs.fontFamily + ";border-radius:" + cs.borderRadius + ";transform:scale(" + scale + ");transform-origin:center;";
    var item = document.createElement("div");
    item.className = "td-popout-item";
    item.dataset.popoutNode = nodeId;
    // Smart layout: vertical list on mobile, horizontal row on desktop
    var isMobile = window.innerWidth < 760;
    var useVertical = isMobile; // vertical list on mobile, horizontal row on desktop
    if (useVertical) {
      // Vertical stack, centered, scrollable
      item.style.left = "50%";
      item.style.top = "auto";
      item.style.position = "relative";
      item.style.transform = "none";
      item.style.margin = "8px auto";
    } else {
      var spacing = isMobile ? 140 : 180;
      var totalW = n * spacing;
      var startX = Math.max(70, (window.innerWidth - totalW) / 2 + spacing/2);
      item.style.left = (startX + i * spacing) + "px";
      item.style.top = (window.innerHeight / 2) + "px";
    }
    item.innerHTML = '<div class="td-popout-box" style="background:' + natBg + '"><div class="td-popout-widget"></div></div><div class="td-popout-label">' + esc(name) + '</div>';
    item.querySelector(".td-popout-widget").appendChild(clone);
    stage.appendChild(item);
    item.addEventListener("click", function(ev){
      ev.stopPropagation();
      tdDismissPopout();
      tdSelect(nodeId);
    });
  });
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
function tdHighlightRegion(nodeId, on) {
  var root = document.getElementById("teardowns-root");
  if (!root) return;
  var region = root.querySelector('.td-region[data-node="' + nodeId + '"]');
  if (region) region.classList.toggle("td-highlight", on);
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
tdClose = function(){
  var panel = document.querySelector(".teardown-detail .teardown-panel:not(.is-empty)");
  var isMobileSheet = panel && window.innerWidth < 901;
  if (isMobileSheet && panel && !panel.classList.contains("td-sheet-closing")) {
    panel.classList.add("td-sheet-closing");
    setTimeout(function(){
      teardownState.selected=null;
      document.body.classList.remove("td-sheet-open");
      tdSyncSelection();
    }, 280);
  } else {
    teardownState.selected=null;
    document.body.classList.remove("td-sheet-open");
    tdSyncSelection();
  }
};
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
  var open = t.closest("[data-teardown-open]");
  if (open && typeof tdOpen === "function") { e.preventDefault(); tdOpen(open.dataset.teardownOpen); return; }
  var sel = t.closest("[data-teardown-select]");
  if (sel && typeof tdSelect === "function") { e.preventDefault(); e.stopPropagation(); tdSelect(sel.dataset.teardownSelect); return; }
  // Tapping shows picker with all widgets at that point
  var region = t.closest(".td-region[data-node]");
  if (region && typeof tdSelect === "function") {
    var root = document.getElementById("teardowns-root");
    if (root && root.contains(region)) {
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
  
  var copy = t.closest("[data-teardown-copy]");
  if (copy && typeof tdCopy === "function") { tdCopy(); return; }
  var idx = t.closest("[data-teardown-index]");
  if (idx && typeof tdBack === "function") {
    tdBack();
    return;
  }
}, true);

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
