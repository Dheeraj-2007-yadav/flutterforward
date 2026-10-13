
/* Auto-generated course content — do not edit by hand */
const DATA = {
 "module": {
  "description": "A practical 15-lesson path from your first Flutter app through real app features, Firebase, and publishing.",
  "title": "FlutterForward Course"
 },
 "lessons": [
  {
   "id": "lesson-1",
   "num": 1,
   "title": "Setup & Your First App",
   "description": "Install Flutter and understand the skeleton every app is built on: main(), runApp(), MaterialApp, Scaffold.",
   "markdown": "# Lesson 1: Setup & Your First App\n\n## What is Flutter?\nFlutter is Google's open-source toolkit for building apps from a **single codebase**. Write Dart once, and Flutter compiles it into native apps for Android, iOS, web, and desktop.\n\nThe central idea is simple: **everything on screen is a widget**. Buttons, text, layouts, and even the app itself are widgets composed together like building blocks.\n\n## What you need\n1. **Flutter SDK** — download it from flutter.dev and add it to the system PATH.\n2. **An editor** — VS Code with the Flutter extension is a light setup.\n3. **Verify** — open a terminal and run `flutter doctor` to see any missing tools.\n\n## The anatomy of a Flutter app\nEvery Flutter app has four familiar pieces:\n- **`main()`** — the entry point.\n- **`runApp()`** — attaches the root widget to the screen.\n- **`MaterialApp`** — supplies Material styling, navigation, and themes.\n- **`Scaffold`** — supplies a page structure with an app bar and body.\n\n```dart\nimport 'package:flutter/material.dart';\n\nvoid main() {\n  runApp(const MyApp());\n}\n\nclass MyApp extends StatelessWidget {\n  const MyApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'Starter App',\n      home: Scaffold(\n        appBar: AppBar(title: const Text('Starter App')),\n        body: const Center(child: Text('Hello, Flutter!')),\n      ),\n    );\n  }\n}\n```\n\nRead it from top to bottom: `main()` starts the app, `MaterialApp` sets it up, `Scaffold` builds the page, and `Center` holds a `Text` widget.\n\n## Key terms\n- **Widget** — the basic building block of a Flutter interface.\n- **Widget tree** — the nested structure formed by widgets inside widgets.\n- **BuildContext** — a handle to a widget's location in that tree.\n\n## Try it yourself\nOpen App Teardowns, choose a familiar screen, then tap its numbered regions to see how the widget tree is nested. Connecting real interfaces to Flutter code makes the structure easier to remember.\n",
   "pdf": "assets/lesson-01.pdf",
   "quizId": "quiz-1"
  },
  {
   "id": "lesson-2",
   "num": 2,
   "title": "Everything Is a Widget",
   "description": "The core mental model: everything is a widget. Build your first StatelessWidget.",
   "markdown": "# Lesson 2: Everything Is a Widget\n\n## The one idea that matters\nIn Flutter, **everything is a widget**. Text, buttons, padding, alignment, rows, columns, and the whole app are widgets. A widget describes what the interface should look like; Flutter handles the drawing.\n\nWidgets form a tree: large widgets contain smaller widgets, which contain even smaller ones. That nesting is the widget tree.\n\n## StatelessWidget\nA `StatelessWidget` is useful when its appearance does not change after construction. Every stateless widget overrides `build()`, which returns the widget tree:\n\n```dart\nclass StatusLabel extends StatelessWidget {\n  final String message;\n\n  const StatusLabel({super.key, required this.message});\n\n  @override\n  Widget build(BuildContext context) {\n    return Text(\n      message,\n      style: const TextStyle(fontSize: 24),\n    );\n  }\n}\n```\n\nThe value arrives through the constructor, remains immutable because it is `final`, and `build()` returns what should appear. Use it like this: `StatusLabel(message: 'Ready')`.\n\n## Widgets used every day\n- **`Text`** displays a string.\n- **`Icon`** displays a Material symbol.\n- **`Image`** displays an asset or network image.\n- **`ElevatedButton`** runs a callback when pressed.\n\n```dart\nElevatedButton(\n  onPressed: () {\n    print('Button tapped');\n  },\n  child: const Text('Run action'),\n)\n```\n\n## Stateless vs stateful\nA stateless widget cannot update itself. Counters, toggles, and forms change over time, so they use `StatefulWidget`, covered in Lesson 4.\n\n## Key terms\n- **`build()`** — returns a widget's interface description.\n- **Immutable** — properties cannot change after construction.\n- **Callback** — a function passed to run after an event.\n",
   "pdf": "assets/lesson-02.pdf",
   "quizId": "quiz-2"
  },
  {
   "id": "lesson-3",
   "num": 3,
   "title": "Layout: Row, Column & Container",
   "description": "Arrange UI with Row, Column and Container. Alignment, padding, and the classic overflow bug.",
   "markdown": "# Lesson 3: Layout — Row, Column & Container\n\n## How Flutter lays things out\nFlutter interfaces are arranged by parent widgets whose job is positioning. Use a `Row` for side-by-side content, a `Column` for vertical content, and a `Container` for padding, margins, backgrounds, borders, or a fixed size.\n\n## Row and Column\n`Row` arranges children horizontally. `Column` arranges them vertically. Both accept a `children` list.\n\n```dart\nColumn(\n  children: const [\n    Text('First'),\n    Text('Second'),\n    Text('Third'),\n  ],\n)\n```\n\n`mainAxisAlignment` controls the primary direction. `crossAxisAlignment` controls the perpendicular direction. Common values include `start`, `center`, `end`, `spaceBetween`, and `spaceEvenly`.\n\n```dart\nRow(\n  mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n  children: const [\n    Icon(Icons.star),\n    Icon(Icons.favorite),\n    Icon(Icons.thumb_up),\n  ],\n)\n```\n\n## Container: the styling workhorse\n```dart\nContainer(\n  padding: const EdgeInsets.all(16),\n  margin: const EdgeInsets.symmetric(vertical: 8),\n  color: Colors.blue,\n  child: const Text(\n    'Inside a container',\n    style: TextStyle(color: Colors.white),\n  ),\n)\n```\n\n## Putting it together\n```dart\nContainer(\n  padding: const EdgeInsets.all(16),\n  margin: const EdgeInsets.all(16),\n  child: Row(\n    children: const [\n      Icon(Icons.extension, size: 48),\n      SizedBox(width: 16),\n      Expanded(\n        child: Column(\n          crossAxisAlignment: CrossAxisAlignment.start,\n          children: [\n            Text('Reusable component', style: TextStyle(fontSize: 20)),\n            Text('Row outside, Column inside'),\n          ],\n        ),\n      ),\n    ],\n  ),\n)\n```\n\n## Preventing overflow\nIf a Row's children are wider than the screen, Flutter shows a striped overflow warning. Wrap flexible content in `Expanded` so it uses the remaining space.\n\n```dart\nRow(\n  children: const [\n    Expanded(child: Text('This text uses the remaining space')),\n    Icon(Icons.arrow_forward),\n  ],\n)\n```\n\n## Key terms\n- **Main axis** — the direction a Row or Column lays out children.\n- **Cross axis** — the perpendicular direction.\n- **Expanded** — lets a child use remaining space.\n- **EdgeInsets** — describes padding and margins.\n",
   "pdf": "assets/lesson-03.pdf",
   "quizId": "quiz-3"
  },
  {
   "id": "lesson-4",
   "num": 4,
   "title": "State & Interactivity",
   "description": "Make UI interactive with StatefulWidget and setState(). Build a working counter.",
   "markdown": "# Lesson 4: State & Interactivity\n\n## Why stateless isn't enough\n\nA `StatelessWidget` is frozen after it's built. But real apps change: counters count, text fields fill, toggles flip. For UI that changes over time, Flutter gives you **`StatefulWidget`**.\n\nThe trick: a stateful widget is split in two. The **widget** itself is still immutable and lightweight — it gets thrown away and recreated freely. The **mutable data** lives in a separate `State` object that Flutter keeps alive.\n\n## The pattern\n\n```dart\nclass Counter extends StatefulWidget {\n  const Counter({super.key});\n\n  @override\n  State<Counter> createState() => _CounterState();\n}\n\nclass _CounterState extends State<Counter> {\n  int count = 0; // mutable state lives here\n\n  void _increment() {\n    setState(() {\n      count++;\n    });\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Column(\n      mainAxisAlignment: MainAxisAlignment.center,\n      children: [\n        Text('Count: $count', style: const TextStyle(fontSize: 24)),\n        ElevatedButton(\n          onPressed: _increment,\n          child: const Text('Increment'),\n        ),\n      ],\n    );\n  }\n}\n```\n\nThree things to notice:\n\n1. `createState()` returns the `State` object where your variables live.\n2. **`setState()`** is the magic call. You change your variables *inside* it, and it tells Flutter: \"my data changed, rebuild me.\" Flutter then calls `build()` again with the new values.\n3. `onPressed: _increment` — note there are **no parentheses**. You're passing the function itself as the callback, not calling it.\n\n## The golden rule\n\n**Changing a variable without `setState()` changes the data but not the screen.** Flutter has no idea anything happened, so `build()` never re-runs and the UI stays stale. This single mistake causes half of all beginner \"my button does nothing\" bugs.\n\n```dart\n// WRONG: count changes, screen doesn't\nvoid _increment() {\n  count++;\n}\n\n// RIGHT: screen rebuilds with the new count\nvoid _increment() {\n  setState(() {\n    count++;\n  });\n}\n```\n\n## Where you've seen this before\n\nThink back: `StatelessWidget` describes UI that never changes. `StatefulWidget` + `setState()` is how UI *becomes* changeable. Between Lesson 2's static widgets, Lesson 3's layouts, and this lesson's state, you now have everything needed to build genuinely interactive apps.\n\n## Key terms\n\n- **State** — data that can change over the lifetime of a widget.\n- **setState()** — notifies Flutter that state changed; triggers a rebuild.\n- **State object** — the long-lived companion of a StatefulWidget that holds mutable data.\n",
   "pdf": "assets/lesson-04.pdf",
   "quizId": "quiz-4"
  },
  {
   "id": "lesson-5",
   "num": 5,
   "title": "Dart Basics for Flutter",
   "description": "The only Dart you need before building Flutter apps",
   "markdown": "## Variables — var, final, const\nA variable is a labeled box that holds a value. `var` allows later changes, `final` allows one assignment at run time, and `const` is fixed when the code is compiled.\n\n```dart\nvar score = 0;\nscore = 10;\n\nfinal launchMode = 'practice';\nconst pi = 3.14;\n```\n\n## Common data types\nThe types used most often are `int`, `double`, `String`, and `bool`.\n\n```dart\nint itemCount = 20;\ndouble price = 99.99;\nString status = 'Ready';\nbool isEnabled = false;\n\nString message = '$status: $itemCount items';\n```\n\n## Functions\nA function is a reusable block of code. It can accept parameters and return a result.\n\n```dart\nString formatScore(int score) {\n  return 'Score: $score';\n}\n\nvoid main() {\n  final message = formatScore(10);\n  print(message);\n}\n```\n\n## Lists and Maps\nA List stores ordered values. A Map stores key-value pairs.\n\n```dart\nList<String> colors = ['blue', 'green', 'orange'];\nprint(colors[0]);\ncolors.add('purple');\n\nMap<String, int> points = {'basics': 8, 'layout': 9};\nprint(points['layout']);\n```\n\n## Classes and objects\nA class is a blueprint, and an object is one value built from it.\n\n```dart\nclass CourseModule {\n  String topic;\n  int lessons;\n\n  CourseModule(this.topic, this.lessons);\n\n  void describe() {\n    print('$topic contains $lessons lessons.');\n  }\n}\n\nvoid main() {\n  final module = CourseModule('Layouts', 4);\n  module.describe();\n}\n```\n\n## Null safety\nAdd `?` after a type when a value may be absent. Use `!` only when the value is definitely available; checking first is safer.\n\n```dart\nString? selectedColor;\nselectedColor = 'blue';\n\nif (selectedColor != null) {\n  print(selectedColor.length);\n}\n```\n\n## Key takeaways\n- `var` changes, `final` is assigned once, and `const` is compile-time fixed.\n- Functions keep repeated logic in one place.\n- Lists are ordered; Maps use keys.\n- Classes define reusable structures; objects are instances.\n- `?` allows null; check before use.\n",
   "pdf": "assets/lesson-05.pdf",
   "quizId": "quiz-5"
  },
  {
   "id": "lesson-6",
   "num": 6,
   "title": "Handling User Input",
   "description": "Buttons, text fields, validation, and taps — how an app responds to input",
   "markdown": "## Buttons — the simplest input\nButtons trigger actions. `ElevatedButton` suits the main action, while `TextButton` suits a quieter secondary action.\n\n```dart\nElevatedButton(\n  onPressed: () {\n    print('Preview opened');\n  },\n  child: const Text('Open preview'),\n)\n\nTextButton(\n  onPressed: () {\n    print('Reset');\n  },\n  child: const Text('Reset'),\n)\n```\n\nSetting `onPressed` to null disables a button.\n\n## TextField — collecting a short value\nA `TextField` displays an editable box. Decoration controls the label, hint, and border.\n\n```dart\nTextField(\n  decoration: const InputDecoration(\n    labelText: 'Search topic',\n    hintText: 'widgets',\n    border: OutlineInputBorder(),\n  ),\n)\n```\n\n## Reading typed text\nUse a `TextEditingController` to read the current value. Create it once in the State class and dispose of it when the screen closes.\n\n```dart\nfinal queryController = TextEditingController();\n\nTextField(controller: queryController);\n\nvoid runSearch() {\n  print('Query: ${queryController.text}');\n}\n\n@override\nvoid dispose() {\n  queryController.dispose();\n  super.dispose();\n}\n```\n\n## Forms and validation\n`Form` groups fields. A `TextFormField` validator returns an error message when the value is invalid, or null when it is valid.\n\n```dart\nfinal formKey = GlobalKey<FormState>();\n\nForm(\n  key: formKey,\n  child: TextFormField(\n    validator: (value) =>\n      value == null || value.isEmpty ? 'Enter a project code' : null,\n  ),\n)\n\nif (formKey.currentState!.validate()) {\n  print('Input is valid');\n}\n```\n\n## Gestures\n`GestureDetector` handles taps, double-taps, long presses, and swipes. `InkWell` adds the Material ripple effect.\n\n```dart\nInkWell(\n  onTap: () => print('Card tapped'),\n  child: const Padding(\n    padding: EdgeInsets.all(20),\n    child: Text('Tap this card'),\n  ),\n)\n```\n\n## Key takeaways\n- Buttons run callbacks; `onPressed: null` disables them.\n- `TextField` collects text and a controller reads it.\n- Dispose controllers when finished.\n- Validators return an error string or null.\n- `InkWell` provides touch feedback.\n",
   "pdf": "assets/lesson-06.pdf",
   "quizId": "quiz-6"
  },
  {
   "id": "lesson-7",
   "num": 7,
   "title": "Navigation & Routes",
   "description": "Moving between screens — the push, the pop, and the stack",
   "markdown": "## Screens are a stack of cards\nThink of screens as a stack. Opening a screen pushes it onto the top. Going back pops the top screen. Only the top screen is visible.\n\n```dart\nNavigator.push(\n  context,\n  MaterialPageRoute(builder: (context) => SettingsScreen()),\n);\n\nNavigator.pop(context);\n```\n\n## MaterialPageRoute\n`MaterialPageRoute` wraps the destination screen and supplies a platform-appropriate transition.\n\n```dart\nElevatedButton(\n  onPressed: () {\n    Navigator.push(\n      context,\n      MaterialPageRoute(\n        builder: (context) => HelpScreen(),\n      ),\n    );\n  },\n  child: const Text('Open help'),\n)\n```\n\n## The back button\nThe system back button and the automatic AppBar arrow call `Navigator.pop`. To block accidental navigation while work is unfinished, use `PopScope`.\n\n```dart\nPopScope(\n  canPop: false,\n  child: Scaffold(\n    appBar: AppBar(title: const Text('Editor')),\n    body: const Text('Finish the draft first'),\n  ),\n)\n```\n\n## Named routes\nFor larger apps, route labels keep navigation in one central map.\n\n```dart\nMaterialApp(\n  initialRoute: '/',\n  routes: {\n    '/': (context) => HomeScreen(),\n    '/settings': (context) => SettingsScreen(),\n    '/help': (context) => HelpScreen(),\n  },\n)\n\nNavigator.pushNamed(context, '/settings');\n```\n\n## Passing values between screens\nPass values through a destination constructor.\n\n```dart\nNavigator.push(\n  context,\n  MaterialPageRoute(\n    builder: (context) => DetailsScreen(itemCode: 'ITEM-01'),\n  ),\n);\n\nclass DetailsScreen extends StatelessWidget {\n  final String itemCode;\n  const DetailsScreen({required this.itemCode});\n}\n```\n\n## Getting a result back\n`Navigator.push` returns a Future. Await it, then send a result back with `Navigator.pop`.\n\n```dart\nfinal color = await Navigator.push(\n  context,\n  MaterialPageRoute(builder: (context) => ColorPickerScreen()),\n);\n\nNavigator.pop(context, 'Blue');\n```\n\n## Key takeaways\n- `push` opens a screen and `pop` closes the top one.\n- `MaterialPageRoute` creates a standard transition.\n- Route labels keep large apps organized.\n- Constructors pass values forward; `pop` can pass a result back.\n",
   "pdf": "assets/lesson-07.pdf",
   "quizId": "quiz-7"
  },
  {
   "id": "lesson-8",
   "num": 8,
   "title": "State Management",
   "description": "Making your app remember things and update the screen",
   "markdown": "## What is state?\n\nState is just data your app needs to remember. Think of a counter app: the current number is state. If the viewer taps a button and the number changes, the app must remember the new number.\n\nIn Flutter, a widget is \"stateful\" when it holds data that can change. A text label that never changes is stateless. A counter that goes up and down is stateful.\n\nRule of thumb: if something on screen can change because of viewer action or time, it's state. If it never changes, it isn't.\n\n```dart\nclass CounterPage extends StatefulWidget {\n  const CounterPage({super.key});\n  @override\n  State<CounterPage> createState() => _CounterPageState();\n}\n\nclass _CounterPageState extends State<CounterPage> {\n  int count = 0; // <-- this is state\n  // ...\n}\n```\n\n## setState — telling Flutter to redraw\n\nChanging a variable is not enough. Flutter doesn't watch your variables. You must call `setState()` to say: \"hey, something changed, redraw this widget.\"\n\nInside `setState()`, you update the variable. Flutter then rebuilds the widget with the new value. It's that simple.\n\nForget to call `setState()` and the variable changes silently — the screen shows the old value. This is the #1 beginner bug. Always change state inside `setState()`.\n\n```dart\nElevatedButton(\n  onPressed: () {\n    setState(() {\n      count++; // change state INSIDE setState\n    });\n  },\n  child: const Text('Tap me'),\n)\n```\n\n## Lifting state up\n\nSometimes two widgets need the same data. Example: a product card shows a quantity, and a cart badge in the app bar shows the total. Both need the same number.\n\nThe fix: move the state to their common parent. The parent holds the variable and passes it down. This is called \"lifting state up.\"\n\nThe parent owns the data. Children just display it and tell the parent when something happens, usually through a callback function.\n\n```dart\n// Parent holds the state\nint quantity = 0;\n\nvoid addItem() {\n  setState(() => quantity++);\n}\n\n// Pass down to children:\nCartBadge(count: quantity)\nProductCard(quantity: quantity, onAdd: addItem)\n```\n\n## When setState isn't enough\n\n`setState()` works great for one screen. But what if the cart count needs to show on five different screens? Passing it down through every screen gets messy fast.\n\nThis mess has a name: \"prop drilling.\" You pass data through widgets that don't even use it, just to reach the ones that do.\n\nWhen many screens share the same data — like a logged-in viewer, a cart, or app settings — you need a better tool. That's where Provider comes in.\n\n```dart\n// Prop drilling pain: passing cart through screens\n// that don't care about it, just to reach one that does\nHomeScreen(cart: cart)\n  -> ShopScreen(cart: cart)\n    -> ProductScreen(cart: cart) // only this one uses it!\n```\n\n## Provider basics\n\nProvider is a popular package that stores your state in one place and lets any widget read it. Add it to `pubspec.yaml` first:\n\n```yaml\ndependencies:\n  provider: ^6.1.2\n```\n\nYou create a class that extends `ChangeNotifier`. It holds your data. Whenever data changes, you call `notifyListeners()` — it works like `setState()`, but for the whole app.\n\n```dart\nclass Cart extends ChangeNotifier {\n  int items = 0;\n\n  void add() {\n    items++;\n    notifyListeners(); // rebuilds every listening widget\n  }\n}\n```\n\n## Reading state with Consumer\n\nTo use your state, first wrap your app with `ChangeNotifierProvider`. Then any widget can read the data using `Consumer` or `context.watch()`.\n\n`Consumer` rebuilds only the small part of the screen that needs the data. That's efficient — the rest of the screen stays untouched.\n\n`context.read()` is for actions (like button taps) where you don't need a rebuild — just call a method.\n\n```dart\n// 1. Provide it at the top of your app\nChangeNotifierProvider(\n  create: (_) => Cart(),\n  child: const MyApp(),\n)\n\n// 2. Read it anywhere below\nConsumer<Cart>(\n  builder: (context, cart, child) {\n    return Text('Items: ${cart.items}');\n  },\n)\n\n// 3. Update it from a button (no rebuild needed here)\nonPressed: () => context.read<Cart>().add(),\n```\n\n## Key takeaways\n\n- State is data your app remembers that can change over time.\n- Always change state inside `setState()`, or the screen won't update.\n- When two widgets need the same data, lift the state to their common parent.\n- `setState()` is fine for one screen; Provider is better when many screens share data.\n- A `ChangeNotifier` holds shared data, `notifyListeners()` updates listeners, and `Consumer` rebuilds only what needs it.\n",
   "pdf": "assets/lesson-08.pdf",
   "quizId": "quiz-8"
  },
  {
   "id": "lesson-9",
   "num": 9,
   "title": "Lists & Grids",
   "description": "Showing scrollable collections the Flutter way",
   "markdown": "## Why not just a Column?\n\nA `Column` puts widgets one below another. Fine for 5 items. But 500 items? A Column builds them all at once, even the ones you can't see. Your app gets slow and eats memory.\n\n`ListView` fixes this. It only builds the items currently on screen, and builds more as you scroll. This trick is called \"lazy building\" — build late, build only what's needed.\n\nIf your list can grow or come from data (like messages, products, todos), always use ListView, never Column.\n\n```dart\nListView(\n  children: const [\n    ListTile(title: Text('Buy milk')),\n    ListTile(title: Text('Water plants')),\n    ListTile(title: Text('Learn Flutter')),\n  ],\n)\n```\n\n## ListView.builder — lists from data\n\nReal lists come from data, not hand-written widgets. `ListView.builder` takes your list and a function that builds one row at a time. Flutter calls it only for visible rows.\n\nYou give it `itemCount` (how many rows) and `itemBuilder` (how to build row number `index`). The `index` tells you which item you're building — `items[0]`, `items[1]`, and so on.\n\nThis is the most-used list widget in Flutter. Learn it well.\n\n```dart\nfinal todos = ['Buy milk', 'Water plants', 'Learn Flutter'];\n\nListView.builder(\n  itemCount: todos.length,\n  itemBuilder: (context, index) {\n    return ListTile(\n      leading: const Icon(Icons.check_box_outline_blank),\n      title: Text(todos[index]),\n    );\n  },\n)\n```\n\n## GridView — items in a grid\n\nSometimes a list looks better as a grid — photo galleries, product catalogs, emoji pickers. `GridView` arranges items in rows and columns.\n\n`GridView.count` is the simplest: you say how many columns with `crossAxisCount`, and give it children. For long grids from data, use `GridView.builder` — same lazy idea as ListView.builder.\n\n`crossAxisSpacing` and `mainAxisSpacing` add gaps between tiles so they don't touch each other.\n\n```dart\nGridView.count(\n  crossAxisCount: 2, // 2 columns\n  crossAxisSpacing: 8,\n  mainAxisSpacing: 8,\n  padding: const EdgeInsets.all(8),\n  children: const [\n    Card(child: Center(child: Text('One'))),\n    Card(child: Center(child: Text('Two'))),\n    Card(child: Center(child: Text('Three'))),\n    Card(child: Center(child: Text('Four'))),\n  ],\n)\n```\n\n## Dismissible — swipe to delete\n\nMany apps let you swipe an item away to delete it. `Dismissible` gives you this for free. Wrap your list row in it.\n\nEach Dismissible needs a unique `key` so Flutter can track which item is which. The `onDismissed` callback tells you the swipe direction — that's where you remove the item from your list.\n\nAdd a colored `background` so the viewer sees a hint of what's happening as they swipe — red with a trash icon means delete.\n\n```dart\nDismissible(\n  key: Key(todos[index]), // unique key per item\n  background: Container(\n    color: Colors.red,\n    alignment: Alignment.centerRight,\n    padding: const EdgeInsets.only(right: 16),\n    child: const Icon(Icons.delete, color: Colors.white),\n  ),\n  onDismissed: (direction) {\n    setState(() => todos.removeAt(index));\n  },\n  child: ListTile(title: Text(todos[index])),\n)\n```\n\n## Pull to refresh\n\nViewers expect to pull a list down to reload it — like refreshing a feed. `RefreshIndicator` adds this in one wrap. No extra code for the animation.\n\nIts `onRefresh` must return a `Future`. Inside it, you reload your data (usually from the network — see the Networking lesson). The spinner shows until your Future finishes.\n\nAfter loading new data, call `setState()` so the list rebuilds with the fresh items.\n\n```dart\nRefreshIndicator(\n  onRefresh: () async {\n    final fresh = await loadTodos(); // your reload logic\n    setState(() => todos = fresh);\n  },\n  child: ListView.builder(\n    itemCount: todos.length,\n    itemBuilder: (context, index) =>\n        ListTile(title: Text(todos[index])),\n  ),\n)\n```\n\n## Separators and dividers\n\nLong lists are easier to read with lines between rows. `ListView.separated` is like `builder`, but adds a `separatorBuilder` for the gaps.\n\nUse a thin `Divider()` for a line, or a `SizedBox(height: 8)` for plain space. Small detail, big readability win.\n\n```dart\nListView.separated(\n  itemCount: todos.length,\n  itemBuilder: (context, index) =>\n      ListTile(title: Text(todos[index])),\n  separatorBuilder: (context, index) =>\n      const Divider(height: 1),\n)\n```\n\n## Key takeaways\n\n- Use `ListView` instead of `Column` for scrollable content — it lazily builds only visible items.\n- `ListView.builder` builds rows from your data using `itemCount` and `itemBuilder`.\n- `GridView.count` makes a simple grid; use `GridView.builder` for long grids from data.\n- Wrap rows in `Dismissible` for swipe-to-delete, with a unique key per item.\n- `RefreshIndicator` adds pull-to-refresh; `ListView.separated` adds dividers between rows.\n",
   "pdf": "assets/lesson-09.pdf",
   "quizId": "quiz-9"
  },
  {
   "id": "lesson-10",
   "num": 10,
   "title": "Networking",
   "description": "Fetching data from the internet into your app",
   "markdown": "## What is an API?\nMost apps show data from the internet, such as weather or product information. An API is a server interface that returns data, usually as JSON.\n\n```json\n{\n  \"condition\": \"Sunny\",\n  \"temperature\": 32,\n  \"unit\": \"C\"\n}\n```\n\n## The http package\nAdd the package, import it, and call `http.get()` with a Uri. Status code 200 means success.\n\n```yaml\ndependencies:\n  http: ^1.2.2\n```\n\n```dart\nimport 'package:http/http.dart' as http;\n\nfinal response = await http.get(\n  Uri.parse('https://api.example.com/weather'),\n);\n\nif (response.statusCode == 200) {\n  print(response.body);\n}\n```\n\n## async and await\nMark a function `async` and place `await` before a slow operation. The interface remains responsive while Dart waits. Async functions return a `Future`.\n\n```dart\nFuture<String> fetchWeather() async {\n  final response = await http.get(\n    Uri.parse('https://api.example.com/weather'),\n  );\n  return response.body;\n}\n```\n\n## Parsing JSON into a model\n`jsonDecode()` turns JSON text into a Map. A `fromJson` factory converts that map into a typed object.\n\n```dart\nimport 'dart:convert';\n\nclass Weather {\n  final String condition;\n  final double temperature;\n\n  Weather({required this.condition, required this.temperature});\n\n  factory Weather.fromJson(Map<String, dynamic> json) {\n    return Weather(\n      condition: json['condition'],\n      temperature: (json['temperature'] as num).toDouble(),\n    );\n  }\n}\n```\n\n## FutureBuilder\nCreate the Future once in `initState`, then let `FutureBuilder` display loading, error, and data states.\n\n```dart\nlate final Future<Weather> futureWeather;\n\n@override\nvoid initState() {\n  super.initState();\n  futureWeather = fetchWeather();\n}\n```\n\n```dart\nFutureBuilder<Weather>(\n  future: futureWeather,\n  builder: (context, snapshot) {\n    if (snapshot.connectionState == ConnectionState.waiting) {\n      return const CircularProgressIndicator();\n    }\n    if (snapshot.hasError) return const Text('Could not load data');\n    final weather = snapshot.data!;\n    return Text('${weather.condition}: ${weather.temperature}°C');\n  },\n)\n```\n\n## Handling errors\nWrap requests in try/catch and check status codes explicitly.\n\n```dart\nFuture<Weather> fetchWeather() async {\n  try {\n    final response = await http.get(\n      Uri.parse('https://api.example.com/weather'),\n    );\n    if (response.statusCode == 200) {\n      return Weather.fromJson(jsonDecode(response.body));\n    }\n    throw Exception('Unexpected server response');\n  } catch (_) {\n    throw Exception('Could not load weather');\n  }\n}\n```\n\n## Key takeaways\n- APIs return data such as JSON.\n- `async` and `await` keep the interface responsive.\n- Model classes make JSON easier to use safely.\n- `FutureBuilder` handles loading, error, and data states.\n- Always handle failures clearly.\n",
   "pdf": "assets/lesson-10.pdf",
   "quizId": "quiz-10"
  },
  {
   "id": "lesson-11",
   "num": 11,
   "title": "Styling & Theming",
   "description": "Make your app look the way you want — colors, fonts, and themes.",
   "markdown": "## Colors in Flutter\nEvery color in Flutter is an object of type `Color`. The easiest way to make one is to write a hex code — the same kind of code designers use. Flutter writes it as `Color(0xFF...)` where `FF` means fully visible (not transparent).\n\nFlutter also gives you ready-made colors. `Colors.blue`, `Colors.red`, `Colors.green` all work instantly. You can go one step further with shades, like `Colors.blue[200]` for a lighter blue or `Colors.blue[800]` for a darker one. Think of the number as \"how strong\" — small number, light color.\n\nYou use colors almost everywhere: text, backgrounds, buttons, app bars. Once you learn the two formats below, you know all you need for coloring anything.\n\n```dart\n// Ready-made color with a shade\nContainer(color: Colors.blue[200])\n\n// Custom color from a hex code (fully opaque)\nContainer(color: Color(0xFF02569B))\n```\n\n## Styling text with TextStyle\nPlain text in Flutter looks boring by default. To change how text looks — size, color, bold — you wrap it in a `TextStyle`. You attach it to a `Text` widget using the `style:` property.\n\nThe most common things you'll change are `fontSize` (a number), `color`, and `fontWeight` (like `FontWeight.bold`). That's enough for 90% of what you'll ever style. Keep your sizes consistent across the app — if headings are 24 and body text is 16, stick with it everywhere.\n\nOne more tip: instead of repeating the same `TextStyle` in ten places, define it once as a variable at the top of your file and reuse it. Less typing, fewer mistakes.\n\n```dart\nfinal headingStyle = TextStyle(\n  fontSize: 24,\n  fontWeight: FontWeight.bold,\n  color: Colors.black87,\n);\n\nText('Welcome back!', style: headingStyle)\n```\n\n## Using Google Fonts\nThe default Flutter font is fine, but a nicer font instantly makes your app feel more polished. The `google_fonts` package gives you hundreds of free fonts with one line of code.\n\nFirst add it to your project by running `flutter pub add google_fonts` in the terminal. Then use `GoogleFonts.poppins(...)` (or any font name) exactly where you'd normally write `TextStyle(...)`. It works the same way — you can still set size, weight, and color inside it.\n\nPick one font for headings and one for body text, and use them everywhere. Two fonts is the sweet spot. More than that and your app starts looking messy.\n\n```dart\n// After running: flutter pub add google_fonts\nText(\n  'Learn Flutter',\n  style: GoogleFonts.poppins(\n    fontSize: 28,\n    fontWeight: FontWeight.w600,\n  ),\n)\n```\n\n## One theme for the whole app (ThemeData)\nImagine setting the color of every single button in your app, one by one. Painful, right? `ThemeData` fixes that. You define your app's look once — in the `MaterialApp` widget — and every screen follows it automatically.\n\nInside `ThemeData` you set things like `primarySwatch` (your main color), `scaffoldBackgroundColor` (the background of every screen), and default text styles. Any widget that doesn't specify its own color will use the theme's color instead.\n\nThe beauty of this: when you want to change your app's main color later, you change it in ONE place and the whole app updates. That's the real power of theming.\n\n```dart\nMaterialApp(\n  theme: ThemeData(\n    primarySwatch: Colors.blue,\n    scaffoldBackgroundColor: Colors.white,\n    textTheme: TextTheme(\n      bodyMedium: TextStyle(fontSize: 16),\n    ),\n  ),\n  home: HomeScreen(),\n)\n```\n\n## Light and dark mode\nMost devices today have a dark mode, and viewers expect apps to support it. Flutter makes this easy: `MaterialApp` accepts both a `theme` (light) and a `darkTheme`, and the device picks the right one automatically.\n\nYou just define two `ThemeData` objects — one with light colors, one with dark colors. Set `themeMode: ThemeMode.system` and Flutter follows the device's setting. The viewer switches their device to dark mode, your app switches too. Zero extra code.\n\nThe trick is to never hardcode colors like `Colors.white` for backgrounds inside your screens. Instead, read colors from the theme with `Theme.of(context)`. That way they flip automatically when the mode changes.\n\n```dart\nMaterialApp(\n  theme: ThemeData.light(),       // light colors\n  darkTheme: ThemeData.dark(),    // dark colors\n  themeMode: ThemeMode.system,    // follow the device\n  home: HomeScreen(),\n)\n\n// Inside a screen — adapts to the mode automatically\nContainer(color: Theme.of(context).scaffoldBackgroundColor)\n```\n\n## Custom button styles\nDefault buttons look okay, but you'll often want your own style — rounded corners, a specific color, bigger text. You style buttons with `style:` using `ElevatedButton.styleFrom(...)`.\n\nThe useful options are `backgroundColor`, `foregroundColor` (that's the text/icon color), `padding`, and `shape`. For rounded corners, use `RoundedRectangleBorder` with a `borderRadius`. Once you find a style you like, make a small helper or put it in your theme so all buttons match.\n\nConsistency matters more than creativity here. If all your buttons look the same, your app instantly feels more professional — even if the style itself is simple.\n\n```dart\nElevatedButton(\n  style: ElevatedButton.styleFrom(\n    backgroundColor: Colors.blue,\n    foregroundColor: Colors.white,\n    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),\n    shape: RoundedRectangleBorder(\n      borderRadius: BorderRadius.circular(12),\n    ),\n  ),\n  onPressed: () {},\n  child: Text('Get Started'),\n)\n```\n\n## Key takeaways\n- Use `Colors.blue[200]` for ready-made shades and `Color(0xFF...)` for custom hex colors.\n- Style text with `TextStyle` — set size, weight, and color; reuse it via a variable.\n- Add the `google_fonts` package for nicer fonts, but stick to two fonts max.\n- Define `ThemeData` once in `MaterialApp` so the whole app shares one look.\n- Support dark mode with `theme` + `darkTheme` + `ThemeMode.system`, and read colors via `Theme.of(context)`.\n- Style buttons with `ElevatedButton.styleFrom(...)` and keep them consistent.\n",
   "pdf": "assets/lesson-11.pdf",
   "quizId": "quiz-11"
  },
  {
   "id": "lesson-12",
   "num": 12,
   "title": "Animations",
   "description": "Bring your app to life — smooth motion with very little code.",
   "markdown": "## Why animations matter\nOpen a good app and pay attention: buttons gently grow when you tap them, screens slide in, items fade into lists. Nothing jumps or teleports. That smoothness is animation, and it's a big part of why an app feels \"premium\" instead of \"cheap\".\n\nThe good news: Flutter is famous for making animation easy. Many animations need just one widget swap — you change one widget name and Flutter handles all the in-between frames for you. You don't do any math.\n\nStart small. One or two smooth animations in the right places beat ten flashy ones. In this lesson you'll learn the three animations beginners use most.\n\n```dart\n// Without animation: jumps instantly\nContainer(width: 100)\n\n// With animation: glides smoothly (you'll see how next)\nAnimatedContainer(width: 100, duration: Duration(milliseconds: 300))\n```\n\n## AnimatedContainer — the easiest animation\n`AnimatedContainer` is a normal `Container` that animates whenever its properties change — size, color, padding, border radius, anything. You just change a value (usually inside `setState`) and Flutter smoothly transitions from the old value to the new one.\n\nYou must give it a `duration` — how long the animation takes. Around 200–500 milliseconds feels natural. Shorter feels snappy, longer feels slow and dreamy. For most UI changes, 300ms is the sweet spot.\n\nTry this: make a box that grows and changes color when tapped. It's about ten lines of code, and it already looks impressive. This one widget covers a huge number of real-world animation needs.\n\n```dart\nbool big = false;\n\nGestureDetector(\n  onTap: () => setState(() => big = !big),\n  child: AnimatedContainer(\n    duration: Duration(milliseconds: 300),\n    width: big ? 200 : 100,\n    height: big ? 200 : 100,\n    color: big ? Colors.blue : Colors.grey,\n  ),\n)\n```\n\n## AnimatedOpacity — fading things in and out\nSometimes you don't want something to move — you just want it to appear or disappear gently. That's what `AnimatedOpacity` does. It fades its child in or out when you change the `opacity` value between `0.0` (invisible) and `1.0` (fully visible).\n\nA common use: showing a success message after a button tap, or fading a loading spinner out when data arrives. It's softer than making a widget suddenly pop into existence, and viewers perceive it as more polished.\n\nLike `AnimatedContainer`, it needs a `duration`. And remember: at `opacity: 0.0` the widget is invisible but still there — it still takes up space in the layout. If you need it fully gone, look into `Visibility` later.\n\n```dart\nbool visible = true;\n\nColumn(\n  children: [\n    AnimatedOpacity(\n      opacity: visible ? 1.0 : 0.0,\n      duration: Duration(milliseconds: 400),\n      child: Text('Hello!'),\n    ),\n    ElevatedButton(\n      onPressed: () => setState(() => visible = !visible),\n      child: Text('Toggle'),\n    ),\n  ],\n)\n```\n\n## Hero animations between screens\nYou've seen this in great apps: you tap a small image, and it smoothly grows into the full-screen version on the next page. In Flutter, that's called a **Hero** animation, and it's surprisingly simple.\n\nYou wrap the widget on the first screen in `Hero(tag: 'something', child: ...)`, and wrap the matching widget on the second screen in a `Hero` with the SAME tag. When you navigate, Flutter automatically animates the widget flying from one screen to the other.\n\nThe tag just needs to be unique per pair — like `'product-image-1'`. The two widgets don't even need to be the same size; Flutter morphs between them. Product images, diagrams, and cards are classic use cases.\n\n```dart\n// Screen 1 — the small image\nHero(\n  tag: 'product-photo',\n  child: Image.network('https://example.com/photo.jpg', width: 100),\n)\n\n// Screen 2 — the big image (same tag!)\nHero(\n  tag: 'product-photo',\n  child: Image.network('https://example.com/photo.jpg'),\n)\n```\n\n## When NOT to animate\nAnimations are like spices: the right amount improves everything, too much ruins it. Here are the rules professionals follow.\n\nDon't animate something the viewer needs to read — moving text is hard to read and annoying. Don't animate every single widget on a screen \"just because\"; pick the one or two moments that matter, like a screen transition or a key state change.\n\nAlso, keep animations fast. Anything over 500ms starts feeling sluggish, and viewers will think your app is slow — even though it's just the animation. And always respect viewers who turn on \"reduce motion\" in their device settings for accessibility reasons.\n\nWhen in doubt, leave it out. A clean, instant UI always beats a flashy, distracting one.\n\n```dart\n// Good: quick, purposeful (300ms fade on a state change)\nAnimatedOpacity(opacity: x, duration: Duration(milliseconds: 300), child: ...)\n\n// Bad: slow and distracting (2 seconds on every list item)\nAnimatedContainer(duration: Duration(seconds: 2), ...)\n```\n\n## Key takeaways\n- Animations make apps feel premium; Flutter makes the common ones very easy.\n- `AnimatedContainer` smoothly transitions size, color, padding — just change a value in `setState` and give it a `duration`.\n- `AnimatedOpacity` fades widgets in/out between `0.0` and `1.0`; invisible still takes up layout space.\n- `Hero` with matching `tag`s on two screens creates the flying-image transition automatically.\n- Keep animations between 200–500ms; never animate text viewers need to read.\n- When in doubt, animate less — a clean instant UI beats a distracting one.\n",
   "pdf": "assets/lesson-12.pdf",
   "quizId": "quiz-12"
  },
  {
   "id": "lesson-13",
   "num": 13,
   "title": "Local Storage",
   "description": "Choose preferences, files, or SQLite for non-sensitive on-device data",
   "markdown": "## Why apps need storage\nValues held only in memory disappear when an app closes. Storage keeps non-sensitive app settings and offline content available between sessions.\n\nUse each storage tool for the right job:\n- `shared_preferences` for small settings.\n- Files for larger text or binary content.\n- SQLite for structured, searchable records.\n\n## Small settings with shared_preferences\n```yaml\ndependencies:\n  shared_preferences: ^2.3.2\n```\n\n```dart\nfinal prefs = await SharedPreferences.getInstance();\n\nawait prefs.setBool('darkMode', true);\nawait prefs.setInt('launchCount', 3);\nawait prefs.setString('startTab', 'lessons');\n\nfinal darkMode = prefs.getBool('darkMode') ?? false;\nfinal launchCount = prefs.getInt('launchCount') ?? 0;\n```\n\nUse `remove()` for one setting and `clear()` only when every setting should reset.\n\n```dart\nawait prefs.remove('startTab');\n```\n\n## Saving a file\nUse `path_provider` to find an app-safe directory, then Dart's `File` class to write content.\n\n```dart\nfinal directory = await getApplicationDocumentsDirectory();\nfinal file = File('${directory.path}/draft.txt');\nawait file.writeAsString('Draft content');\nfinal text = await file.readAsString();\n```\n\nFile operations are asynchronous because storage can be slow.\n\n## Structured data with SQLite\nSQLite is useful for many related records that need filtering or sorting, such as a catalog of lessons or a set of offline reference cards.\n\n```dart\nawait db.insert('topics', {\n  'code': 'LAYOUT-01',\n  'title': 'Rows and Columns',\n  'completed': 0,\n});\n\nfinal rows = await db.query(\n  'topics',\n  where: 'completed = ?',\n  whereArgs: [0],\n);\n```\n\nAlways use `whereArgs` instead of placing values directly into a query string.\n\n## Choosing the right option\n- A few settings: `shared_preferences`.\n- A document or downloaded asset: file storage.\n- Many searchable records: SQLite.\n- Data shared across devices: a cloud service.\n\n## Key takeaways\n- Storage survives app restarts; memory does not.\n- Use preferences for small settings, files for larger content, and SQLite for structured data.\n- Await storage operations.\n- Keep stored content minimal and avoid sensitive material unless the app truly requires it.\n",
   "pdf": "assets/lesson-13.pdf",
   "quizId": "quiz-13"
  },
  {
   "id": "lesson-15",
   "num": 15,
   "title": "Publishing Your App",
   "description": "From your code to the Play Store, step by step",
   "markdown": "## Debug vs release builds\nDebug builds support hot reload and detailed errors. Release builds are smaller, faster, and optimized for distribution.\n\n```text\nflutter build appbundle --release\n```\n\n## App signing and integrity\nAndroid verifies that each update comes from the same publisher as the installed app. Flutter and the Android toolchain apply this signing step during a configured release build.\n\nTreat signing material as protected project infrastructure. Do not place it in source control, lesson examples, screenshots, or chat. Follow the current Android Studio and Play Console setup guidance when preparing a real release.\n\n## Build an Android App Bundle\nFor Play Store distribution, build an `.aab` file:\n\n```text\nflutter build appbundle --release\n```\n\nThe output appears under `build/app/outputs/bundle/release/`. Upload the `.aab`, not a debug build.\n\n## Create the store listing\nA clear listing needs:\n- a short store title and description,\n- screenshots from the release build,\n- a high-resolution icon,\n- the correct category and content information,\n- a support page when required.\n\n## Version every release\nFlutter versions use the format `1.0.0+1`. The first part is the public version. The number after `+` is the build number and must increase with every upload.\n\n```yaml\nversion: 1.0.1+2\n```\n\n## Test before uploading\nRun the release build on real hardware. Check startup, navigation, offline behavior, icons, text, and the most important flows. Fix release-only issues before opening a wider testing track.\n\n## Key takeaways\n- Publish release builds, never debug builds.\n- Platform signing protects update integrity.\n- Upload an Android App Bundle to Play Console.\n- Increase the build number for every upload.\n- Test the exact release build before distribution.\n",
   "pdf": "assets/lesson-15.pdf",
   "quizId": "quiz-15"
  }
 ],
 "quizzes": [
  {
   "id": "quiz-1",
   "lessonId": "lesson-1",
   "questions": [
    {
     "answer": 1,
     "explanation": "runApp() inflates the widget tree and attaches it to the screen. Without it, nothing is drawn.",
     "options": [
      "It compiles the Dart code to native machine code",
      "It inflates the widget tree and attaches it to the screen",
      "It downloads the Flutter SDK",
      "It opens the app in a web browser"
     ],
     "q": "What does runApp() do?"
    },
    {
     "answer": 2,
     "explanation": "Every Dart program starts executing from the main() function.",
     "options": [
      "runApp()",
      "build()",
      "main()",
      "initState()"
     ],
     "q": "Which function is the entry point of every Dart app?"
    },
    {
     "answer": 0,
     "explanation": "MaterialApp is the root widget that wires up Material Design styling, themes and navigation.",
     "options": [
      "Material Design styling, themes and navigation",
      "Access to the device's camera",
      "A connection to Firebase",
      "Nothing — it's optional decoration"
     ],
     "q": "What does MaterialApp provide?"
    },
    {
     "answer": 3,
     "explanation": "Scaffold implements the basic Material page layout: app bar, body, floating action button.",
     "options": [
      "Container",
      "Row",
      "MaterialApp",
      "Scaffold"
     ],
     "q": "Which widget gives you a page with an AppBar and a body?"
    }
   ],
   "title": "Quiz: Setup & Your First App"
  },
  {
   "id": "quiz-2",
   "lessonId": "lesson-2",
   "questions": [
    {
     "answer": 1,
     "explanation": "In Flutter, everything — text, buttons, layout, the app itself — is a widget.",
     "options": [
      "A function",
      "A widget",
      "A variable",
      "A package"
     ],
     "q": "In Flutter, everything on screen is a ___."
    },
    {
     "answer": 0,
     "explanation": "build() describes the widget's UI by returning a widget tree.",
     "options": [
      "build()",
      "render()",
      "draw()",
      "paint()"
     ],
     "q": "Which method must every StatelessWidget override?"
    },
    {
     "answer": 2,
     "explanation": "Stateless widgets are immutable — once built, their configuration can't change.",
     "options": [
      "Yes, whenever it wants",
      "Yes, but only inside build()",
      "No — it is immutable after creation",
      "Only on weekends"
     ],
     "q": "Can a StatelessWidget change its own appearance after being built?"
    },
    {
     "answer": 3,
     "explanation": "build() returns a widget (usually a tree of widgets) describing what should appear.",
     "options": [
      "A string of HTML",
      "A pixel buffer",
      "Nothing — it draws directly",
      "A widget describing the UI"
     ],
     "q": "What does the build() method return?"
    }
   ],
   "title": "Quiz: Everything Is a Widget"
  },
  {
   "id": "quiz-3",
   "lessonId": "lesson-3",
   "questions": [
    {
     "answer": 0,
     "explanation": "Row lays children out horizontally; Column lays them out vertically.",
     "options": [
      "Row",
      "Column",
      "Stack",
      "Container"
     ],
     "q": "Which widget arranges its children horizontally?"
    },
    {
     "answer": 2,
     "explanation": "A Column's main axis is vertical, so mainAxisAlignment controls vertical alignment.",
     "options": [
      "Horizontally",
      "Diagonally",
      "Vertically",
      "It doesn't align anything"
     ],
     "q": "In a Column, mainAxisAlignment aligns children ___."
    },
    {
     "answer": 1,
     "explanation": "Flutter paints the famous yellow-and-black striped overflow warning when children exceed the available space.",
     "options": [
      "The app crashes immediately",
      "A yellow-and-black striped overflow warning appears",
      "The extra children are silently hidden",
      "The screen scrolls automatically"
     ],
     "q": "What happens when a Row's children are wider than the screen?"
    },
    {
     "answer": 3,
     "explanation": "Expanded forces a child of a Row/Column to fill the remaining available space.",
     "options": [
      "Container",
      "Padding",
      "SizedBox",
      "Expanded"
     ],
     "q": "Which widget makes a child of a Row fill the remaining space?"
    }
   ],
   "title": "Quiz: Layout"
  },
  {
   "id": "quiz-4",
   "lessonId": "lesson-4",
   "questions": [
    {
     "answer": 1,
     "explanation": "StatefulWidget is for UI that changes over time — counters, forms, toggles.",
     "options": [
      "When the UI never changes",
      "When the UI needs to change over time",
      "When the app needs internet",
      "Never — it's deprecated"
     ],
     "q": "When should you use a StatefulWidget?"
    },
    {
     "answer": 2,
     "explanation": "setState() tells Flutter the state changed, so it re-runs build() with the new values.",
     "options": [
      "It saves data to disk",
      "It restarts the whole app",
      "It marks the widget dirty so build() runs again",
      "It creates a new widget"
     ],
     "q": "What does setState() do?"
    },
    {
     "answer": 0,
     "explanation": "The widget stays immutable; the mutable data lives in its companion State object.",
     "options": [
      "In the State object",
      "In the widget's constructor",
      "In a global variable",
      "In the build() method"
     ],
     "q": "Where does mutable state live in a StatefulWidget?"
    },
    {
     "answer": 3,
     "explanation": "Without setState(), Flutter doesn't know anything changed, so the screen stays stale — the classic beginner bug.",
     "options": [
      "The app crashes",
      "The variable refuses to change",
      "setState() is called automatically",
      "The variable changes but the UI doesn't update"
     ],
     "q": "What happens if you change a state variable without calling setState()?"
    }
   ],
   "title": "Quiz: State & Interactivity"
  },
  {
   "id": "quiz-5",
   "lessonId": "lesson-5",
   "questions": [
    {
     "q": "Which declaration can be assigned once at run time?",
     "options": [
      "var",
      "final",
      "const",
      "dynamic"
     ],
     "answer": 1,
     "explanation": "`final` is assigned once at run time, while `const` must already be known at compile time."
    },
    {
     "q": "Which type stores true or false?",
     "options": [
      "String",
      "double",
      "bool",
      "int"
     ],
     "answer": 2,
     "explanation": "`bool` stores one of two values: true or false."
    },
    {
     "q": "What does `?` mean in `String? selectedColor;`?",
     "options": [
      "The value may be null",
      "The value is constant",
      "The value is a List",
      "The value is private"
     ],
     "answer": 0,
     "explanation": "The question mark marks a nullable type."
    },
    {
     "q": "In `CourseModule(this.topic, this.lessons)`, what is `CourseModule(...)`?",
     "options": [
      "A loop",
      "A constructor",
      "A widget tree",
      "A package"
     ],
     "answer": 1,
     "explanation": "A constructor creates an object from the class blueprint."
    }
   ],
   "title": "Quiz: Dart Basics for Flutter"
  },
  {
   "id": "quiz-6",
   "lessonId": "lesson-6",
   "questions": [
    {
     "q": "What happens when `onPressed` is null?",
     "options": [
      "The button is disabled",
      "The app closes",
      "The button repeats",
      "The page scrolls"
     ],
     "answer": 0,
     "explanation": "A null callback disables the button."
    },
    {
     "q": "What reads the current value of a TextField?",
     "options": [
      "ThemeData",
      "TextEditingController",
      "Navigator",
      "MediaQuery"
     ],
     "answer": 1,
     "explanation": "A TextEditingController exposes the current text through `.text`."
    },
    {
     "q": "What should a valid validator return?",
     "options": [
      "true",
      "An empty widget",
      "null",
      "A number"
     ],
     "answer": 2,
     "explanation": "A validator returns null when the value is valid."
    },
    {
     "q": "Which widget adds a Material ripple to taps?",
     "options": [
      "InkWell",
      "Spacer",
      "Expanded",
      "Divider"
     ],
     "answer": 0,
     "explanation": "InkWell combines tap handling with Material touch feedback."
    }
   ],
   "title": "Quiz: Handling User Input"
  },
  {
   "id": "quiz-7",
   "lessonId": "lesson-7",
   "questions": [
    {
     "q": "Which call opens a new screen on top of the stack?",
     "options": [
      "Navigator.pop",
      "Navigator.push",
      "setState",
      "runApp"
     ],
     "answer": 1,
     "explanation": "`Navigator.push` adds a screen to the navigation stack."
    },
    {
     "q": "What usually happens when the system back button is pressed?",
     "options": [
      "The top screen is popped",
      "The app recompiles",
      "The route map is cleared",
      "The theme resets"
     ],
     "answer": 0,
     "explanation": "Back navigation removes the top screen from the stack."
    },
    {
     "q": "Why use route labels?",
     "options": [
      "To centralize screen destinations",
      "To store images",
      "To animate colors",
      "To validate forms"
     ],
     "answer": 0,
     "explanation": "A route map keeps destinations in one place."
    },
    {
     "q": "How can a second screen return a result?",
     "options": [
      "Call `runApp`",
      "Call `setState`",
      "Pass a value to `Navigator.pop`",
      "Restart the route"
     ],
     "answer": 2,
     "explanation": "Passing a value to `Navigator.pop` completes the Future returned by `push`."
    }
   ],
   "title": "Quiz: Navigation & Routes"
  },
  {
   "id": "quiz-8",
   "lessonId": "lesson-8",
   "questions": [
    {
     "answer": 2,
     "explanation": "Flutter only redraws when you call setState(), so the screen stays stale.",
     "options": [
      "The app crashes",
      "Flutter auto-detects it",
      "The screen keeps showing the old value",
      "The variable resets to zero"
     ],
     "q": "What happens if you change a state variable without calling setState()?"
    },
    {
     "answer": 0,
     "explanation": "the parent owns the data and passes it down to children that need it.",
     "options": [
      "Moving shared data to a common parent widget",
      "Making the font bigger",
      "Deleting unused widgets",
      "Using a bigger device to test"
     ],
     "q": "\"Lifting state up\" means:"
    },
    {
     "answer": 3,
     "explanation": "it's like setState() for the whole app; every Consumer rebuilds.",
     "options": [
      "Sends a push notification",
      "Prints to the console",
      "Saves data to disk",
      "Tells listening widgets to rebuild"
     ],
     "q": "In a ChangeNotifier class, what does notifyListeners() do?"
    },
    {
     "answer": 1,
     "explanation": "context.read() grabs the object without subscribing to rebuilds, perfect for button actions.",
     "options": [
      "When you want the widget to rebuild",
      "When you just need to call a method, like in a button tap",
      "When the app starts",
      "Never, it's deprecated"
     ],
     "q": "When should you use context.read() instead of Consumer?"
    }
   ],
   "title": "Quiz: State Management"
  },
  {
   "id": "quiz-9",
   "lessonId": "lesson-9",
   "questions": [
    {
     "answer": 3,
     "explanation": "ListView lazily builds visible rows; Column would build all 500 at once and slow the app.",
     "options": [
      "It looks prettier",
      "It loads faster internet",
      "It uses less code",
      "It only builds items visible on screen"
     ],
     "q": "Why is ListView better than Column for 500 items?"
    },
    {
     "answer": 0,
     "explanation": "index tells you which row to build, so you can grab items[index] from your data.",
     "options": [
      "The position of the row being built, starting at 0",
      "The total number of items",
      "The screen width",
      "A random number"
     ],
     "q": "In ListView.builder, what is `index`?"
    },
    {
     "answer": 2,
     "explanation": "without a unique key, Flutter can't tell items apart and may delete the wrong one.",
     "options": [
      "To make it colorful",
      "To make it scroll faster",
      "So Flutter can track exactly which item was swiped away",
      "Keys are optional"
     ],
     "q": "Why does Dismissible need a unique key?"
    },
    {
     "answer": 1,
     "explanation": "it returns a Future; the spinner shows until that Future completes, then hides.",
     "options": [
      "A String",
      "A Future",
      "An integer",
      "Nothing"
     ],
     "q": "What must onRefresh return in a RefreshIndicator?"
    }
   ],
   "title": "Quiz: Lists & Grids"
  },
  {
   "id": "quiz-10",
   "lessonId": "lesson-10",
   "questions": [
    {
     "answer": 2,
     "explanation": "GET means \"give me data\"; it's the most common request you'll make.",
     "options": [
      "Deletes data from the server",
      "Saves a file on the device",
      "Asks the server to send data back",
      "Closes the app"
     ],
     "q": "What does a GET request do?"
    },
    {
     "answer": 0,
     "explanation": "a Future represents work still in progress, like a network request; the value comes later.",
     "options": [
      "A promise that a value will arrive later",
      "A widget for animations",
      "A type of button",
      "A database table"
     ],
     "q": "What is a Future in Dart?"
    },
    {
     "answer": 3,
     "explanation": "every rebuild would re-fetch; creating it once in initState fetches only once.",
     "options": [
      "It's shorter to write",
      "initState is faster",
      "It doesn't matter",
      "build() can run many times, which would fire a new request every time"
     ],
     "q": "Why should you create your Future in initState instead of inside build()?"
    },
    {
     "answer": 1,
     "explanation": "while waiting, show a CircularProgressIndicator; when done, show data or error.",
     "options": [
      "Use a Timer",
      "Check snapshot.connectionState == ConnectionState.waiting",
      "Check snapshot.data == null always",
      "Show it after the data loads"
     ],
     "q": "In a FutureBuilder, how do you show a loading spinner?"
    }
   ],
   "title": "Quiz: Networking"
  },
  {
   "id": "quiz-11",
   "lessonId": "lesson-11",
   "questions": [
    {
     "answer": 1,
     "explanation": "Flutter hex colors are written as `Color(0xFF...)` where FF means fully visible.",
     "options": [
      "`Color('#02569B')`",
      "`Color(0xFF02569B)`",
      "`Colors.hex('02569B')`",
      "`Color.fromHex(02569B)`"
     ],
     "q": "How do you write a custom fully-opaque blue color from the hex code 02569B in Flutter?"
    },
    {
     "answer": 3,
     "explanation": "You set colors and styles once in `MaterialApp`'s theme, and every screen follows it.",
     "options": [
      "Change the device's system theme",
      "Download new fonts from Google",
      "Animate between screens",
      "Define your app's look once so all screens share it"
     ],
     "q": "What does `ThemeData` let you do?"
    },
    {
     "answer": 0,
     "explanation": "Define both themes and set `themeMode` to system so Flutter follows the device's setting.",
     "options": [
      "`theme`, `darkTheme`, `themeMode: ThemeMode.system`",
      "`light()`, `dark()`, `auto()`",
      "`ThemeData`, `ColorScheme`, `Brightness`",
      "`mode: auto`, `dark: true`"
     ],
     "q": "Which three settings together give you automatic light/dark mode?"
    },
    {
     "answer": 2,
     "explanation": "Foreground means \"what sits on top\" — the text and icons; the background is `backgroundColor`.",
     "options": [
      "The button's background color",
      "The button's border color",
      "The text and icon color on the button",
      "The shadow color under the button"
     ],
     "q": "In `ElevatedButton.styleFrom`, what does `foregroundColor` control?"
    }
   ],
   "title": "Quiz: Styling & Theming"
  },
  {
   "id": "quiz-12",
   "lessonId": "lesson-12",
   "questions": [
    {
     "answer": 1,
     "explanation": "Just change a property (width, color, etc.) in `setState`; Flutter animates from the old value to the new one.",
     "options": [
      "You call `animate()` on it",
      "You change one of its properties inside `setState` and it transitions automatically",
      "You wrap it in an `AnimationController`",
      "It animates constantly on its own"
     ],
     "q": "What makes `AnimatedContainer` animate?"
    },
    {
     "answer": 0,
     "explanation": "Invisible doesn't mean gone; it still occupies its place in the layout.",
     "options": [
      "The widget is fully invisible but still takes up space",
      "The widget is deleted",
      "The widget becomes half-transparent",
      "The app crashes"
     ],
     "q": "In `AnimatedOpacity`, what does `opacity: 0.0` mean?"
    },
    {
     "answer": 2,
     "explanation": "Matching tags tell Flutter which two widgets are the \"same\" one flying between screens.",
     "options": [
      "The same size",
      "The same color",
      "The same `tag` value",
      "The same screen"
     ],
     "q": "For a Hero animation to work, what must the two Hero widgets share?"
    },
    {
     "answer": 3,
     "explanation": "Moving text is hard to read and feels annoying; keep readable content still.",
     "options": [
      "Keeping animations around 300ms",
      "Using Hero for product images",
      "Fading a loading spinner out",
      "Animating text the viewer is trying to read"
     ],
     "q": "Which animation practice should you AVOID?"
    }
   ],
   "title": "Quiz: Animations"
  },
  {
   "id": "quiz-13",
   "lessonId": "lesson-13",
   "questions": [
    {
     "q": "Which option best fits a dark-mode setting?",
     "options": [
      "shared_preferences",
      "A video file",
      "SQLite with many tables",
      "A network socket"
     ],
     "answer": 0,
     "explanation": "A single small setting fits shared_preferences."
    },
    {
     "q": "Why await file operations?",
     "options": [
      "Storage work can take time",
      "It changes the theme",
      "It creates a widget",
      "It removes null safety"
     ],
     "answer": 0,
     "explanation": "File access is asynchronous so the interface stays responsive."
    },
    {
     "q": "Which option best fits many searchable topic records?",
     "options": [
      "A color constant",
      "SQLite",
      "A Text widget",
      "An animation controller"
     ],
     "answer": 1,
     "explanation": "SQLite is designed for structured records and queries."
    },
    {
     "q": "Why use `whereArgs` in a SQLite query?",
     "options": [
      "To safely pass values",
      "To increase font size",
      "To open a route",
      "To create a FutureBuilder"
     ],
     "answer": 0,
     "explanation": "`whereArgs` keeps values separate from the query text."
    }
   ],
   "title": "Quiz: Local Storage"
  },
  {
   "id": "quiz-15",
   "lessonId": "lesson-15",
   "questions": [
    {
     "q": "Which build should be distributed through Play Console?",
     "options": [
      "Release",
      "Debug",
      "Benchmark",
      "Test"
     ],
     "answer": 0,
     "explanation": "Release builds are optimized for distribution."
    },
    {
     "q": "What does platform signing protect?",
     "options": [
      "Update integrity",
      "Widget padding",
      "Theme colors",
      "Quiz scoring"
     ],
     "answer": 0,
     "explanation": "Signing lets the platform verify that updates come from the same publisher."
    },
    {
     "q": "Which file is uploaded for a standard Play Store release?",
     "options": [
      "A Dart source file",
      "A screenshot",
      "An Android App Bundle (.aab)",
      "A project archive"
     ],
     "answer": 2,
     "explanation": "The `.aab` lets Play generate optimized downloads."
    },
    {
     "q": "What must increase with every upload?",
     "options": [
      "The build number after `+`",
      "The screenshot count",
      "The font size",
      "The route count"
     ],
     "answer": 0,
     "explanation": "Play requires a higher build number for each new upload."
    }
   ],
   "title": "Quiz: Publishing Your App"
  }
 ],
 "quiz": {
  "passPercent": 70
 },
 "ranks": [
  {
   "name": "Hello Worlder",
   "need": 0
  },
  {
   "name": "Widget Tinkerer",
   "need": 5
  },
  {
   "name": "State Wrangler",
   "need": 10
  },
  {
   "name": "Layout Architect",
   "need": 15
  },
  {
   "name": "Animation Alchemist",
   "need": 20
  },
  {
   "name": "App Craftsman",
   "need": 25
  },
  {
   "name": "Flutter Master",
   "need": 30
  }
 ]
};


