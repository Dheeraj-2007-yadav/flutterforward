/* ---------------- curated app teardowns ---------------- */
// Add Teardowns to nav (like resources.js does)
(function(){
  try {
    if (typeof TABS !== "undefined") {
      const TD_TAB = {
        route: "#/teardowns",
        label: "Teardowns",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="11" height="16" rx="2"/><path d="M8 7h3M7 11h5M9.5 19v2M18 8v11M15.5 10.5 18 8l2.5 2.5M15.5 16.5 18 19l2.5-2.5"/></svg>',
        match: ["teardowns"]
      };
      // Avoid duplicates
      if (!TABS.some(t => t.route === "#/teardowns")) {
        TABS.push(TD_TAB);
      }
      // Inject into already-rendered nav
      document.querySelectorAll(".nav-links").forEach(function(nav){
        if (nav.querySelector('[href="#/teardowns"]')) return;
        const a = document.createElement("a");
        a.className = "nav-link";
        a.dataset.match = "teardowns";
        a.href = "#/teardowns";
        a.textContent = "Teardowns";
        // Insert before Resources or at end
        const res = nav.querySelector('[href="#/resources"]');
        if (res) nav.insertBefore(a, res);
        else nav.appendChild(a);
      });
    }
  } catch(e){}
})();

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
function tdStatus(dark) { return `<div class="app-status${dark?' dark':''}"><span>9:41</span><span class="app-status-icons"><span>▮▮▮</span><i></i></span></div>`; }
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
function tdPhone(key) { return key === "whatsapp" ? tdPhoneWhatsApp() : key === "instagram" ? tdPhoneInstagram() : tdPhoneSwiggy(); }
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
  return `<div class="teardown-intro">${pageHead(null,"App Teardowns","Real apps, taken apart widget by widget.")}</div><div class="teardown-index">${Object.entries(TEARDOWNS).map(([key,item])=>`<button class="teardown-row" data-teardown-open="${key}" onclick="if(typeof tdOpen==='function')tdOpen('${key}')"><span class="teardown-glyph ${item.glyphClass}" style="--glyph:${item.accent}">${item.glyph}</span><span class="teardown-row-copy"><span class="teardown-row-title">${item.app}</span><span class="teardown-row-screen">${item.screen}</span></span><span class="teardown-row-count">${item.count} widgets</span><span class="teardown-row-chevron" aria-hidden="true">›</span></button>`).join("")}</div><p class="teardown-note">Each teardown is hand-built from a familiar interface so the widget choices, hierarchy, and code stay dependable for learning.</p>`;
}
function tdPanel() {
  const node = tdSelectedNode();
  if (!node) return `<aside class="teardown-panel is-empty"><div><span class="teardown-empty-icon">${TD_ICON.grid}</span><h3>Choose a numbered area</h3><p>Tap part of the app to see the Flutter widget behind it, why it fits, and how it is written.</p></div></aside>`;
  const item = TEARDOWNS[teardownState.app], path = tdPath(teardownState.app,node.id);
  const crumbs = path.map((part,i)=>`${i?'<span>›</span>':''}<button data-teardown-select="${part.id}"${part.id===node.id?' aria-current="page"':''}>${esc(part.name)}</button>`).join("");
  const children = node.children.map((child,i)=>`<button class="teardown-child-chip" data-teardown-select="${child.id}" style="animation-delay:${i*45}ms">${esc(child.name)}</button>`).join("");
  return `<aside class="teardown-panel" aria-live="polite"><div class="teardown-card-top"><span class="teardown-card-kicker">${esc(item.app)} · selected widget</span><button class="teardown-card-close" data-teardown-close aria-label="Close widget card">×</button></div><nav class="teardown-breadcrumb" aria-label="Widget breadcrumb">${crumbs}</nav><div class="teardown-widget-title"><span class="teardown-widget-mark">${esc(node.name.slice(0,3))}</span><span><h3>${esc(node.name)}</h3><p>${node.children.length} child widget${node.children.length===1?'':'s'}</p></span></div><div class="teardown-facts"><div class="teardown-fact"><b>What it does</b><p>${esc(node.what)}</p></div><div class="teardown-fact"><b>Why it's here</b><p>${esc(node.why)}</p></div></div>${node.children.length?`<div class="teardown-children"><b>Child widgets</b><div class="teardown-child-chips">${children}</div></div>`:''}<div class="teardown-code"><div class="teardown-code-head"><span>Real Dart</span><button class="teardown-copy" data-teardown-copy>Copy code</button></div><pre><code>${esc(node.code)}</code></pre></div></aside>`;
}
function tdDetailView() {
  const item = TEARDOWNS[teardownState.app];
  return `<div class="teardown-detail-head"><button class="teardown-back" data-teardown-index>${TD_ICON.back}All teardowns</button><button class="teardown-bounds" data-teardown-bounds aria-pressed="${teardownState.bounds}"><span>Show all bounds</span><span class="toggle-track" aria-hidden="true"><span class="toggle-thumb"></span></span></button></div><div class="teardown-detail-title"><span class="teardown-detail-kicker">${esc(item.app)} teardown</span><h2>${esc(item.screen)}</h2><p>Tap a numbered region, then follow its child widgets deeper.</p></div><div class="teardown-workbench"><div class="teardown-phone-stage${teardownState.bounds?' show-bounds':''}"><div class="teardown-phone"><div class="teardown-screen">${tdPhone(teardownState.app)}</div></div></div>${tdPanel()}</div>`;
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
    const id = region.dataset.node, interactive = teardownState.bounds || item.hotspots.includes(id);
    if (interactive) { region.setAttribute("role","button"); region.setAttribute("tabindex","0"); region.setAttribute("aria-label",`Inspect ${region.dataset.widget}`); }
    if (item.hotspots.includes(id) && !region.querySelector(":scope > .td-hotspot")) {
      const b = document.createElement("button"); b.type = "button"; b.className = "td-hotspot"; b.textContent = String(item.hotspots.indexOf(id)+1); b.dataset.teardownSelect = id; b.setAttribute("aria-label",`Inspect hotspot ${item.hotspots.indexOf(id)+1}: ${region.dataset.widget}`); region.appendChild(b);
    }
  });
  if (stage) stage.classList.toggle("show-bounds",teardownState.bounds);
  const active = root.querySelector(`[data-node="${teardownState.selected||''}"]`); if (active) requestAnimationFrame(()=>active.classList.add("td-active"));
  document.body.classList.toggle("td-sheet-open",!!teardownState.selected && window.matchMedia("(max-width: 860px)").matches);
}
function tdRender() { const root=$("#teardowns-root"); if(!root)return; root.innerHTML=teardownState.app?tdDetailView():teardownIndexView(); tdPrepare(); }
function tdOpen(key) { if(!TEARDOWNS[key])return; teardownState={app:key,selected:null,bounds:false}; tdRender(); window.scrollTo({top:0,behavior:mqMatches("(prefers-reduced-motion: reduce)")?"auto":"smooth"}); }
function tdBack() { teardownState={app:null,selected:null,bounds:false}; document.body.classList.remove("td-sheet-open"); tdRender(); window.scrollTo({top:0}); }
function tdSelect(id) { if(!teardownState.app || !tdIndex(TEARDOWNS[teardownState.app]).map[id])return; teardownState.selected=id; tdRender(); }
function tdClose() { teardownState.selected=null; document.body.classList.remove("td-sheet-open"); tdRender(); }
function tdToggleBounds() { teardownState.bounds=!teardownState.bounds; tdRender(); }
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
    if(teardownState.app){const hit=e.target.closest(teardownState.bounds?".td-region":".td-region[data-node]");if(hit&&root.contains(hit)&&TEARDOWNS[teardownState.app].hotspots.includes(hit.dataset.node)){e.preventDefault();tdSelect(hit.dataset.node);}}
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
    // Dark theme: improve text readability only (don't touch icons/buttons)
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      clone.querySelectorAll("*").forEach(function(el){
        var tag = el.tagName.toLowerCase();
        if (tag === "button" || tag === "svg" || el.closest("button")) return;
        var hasText = Array.from(el.childNodes).some(function(n){
          return n.nodeType === 3 && n.textContent.trim().length > 0;
        });
        if (hasText) {
          el.style.color = "#ffffff";
          el.style.textShadow = "0 1px 3px rgba(0,0,0,.8)";
        }
      });
    }

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

// Init teardown click handlers when the view is shown
(function(){
  function tryInit(){
    if (typeof initTeardowns === "function" && document.getElementById("teardowns-root")) {
      initTeardowns();
    }
  }
  // Try now (in case view already rendered)
  tryInit();
  // Try on hash change
  window.addEventListener("hashchange", function(){ setTimeout(tryInit, 100); });
  // Try on DOM mutations (view renders async)
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(function(){ tryInit(); }).observe(document.body, { childList: true, subtree: true });
  }
})();

// Failsafe: document-level click delegation for teardown rows
// (works regardless of initTeardowns timing)
document.addEventListener("click", function(e){
  const open = e.target.closest && e.target.closest("[data-teardown-open]");
  if (open && typeof tdOpen === "function") {
    // Only handle if we're on the teardowns page
    if (document.getElementById("teardowns-root")) {
      e.preventDefault();
      tdOpen(open.dataset.teardownOpen);
    }
  }
}, true);

