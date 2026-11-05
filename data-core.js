const DATA={module:{description:"Everything you need to learn Flutter, from setup to shipping: how apps are structured, what widgets are, how layout works, and how UI becomes interactive.",title:"Module 1: Flutter Foundations"},lessons:[],quizzes:[
  {
    "id": "quiz-01-setup",
    "lessonId": "lesson-01-setup",
    "title": "Quiz: Setup & Your First App",
    "questions_en": [
      {
        "q": "Which function does Flutter look for first when an app starts?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "runApp()",
          "main()",
          "build()",
          "Scaffold()"
        ],
        "answer": 1,
        "explanation": "main() is the entry point — Flutter starts there, and main() then calls runApp() to show your app."
      },
      {
        "q": "What does runApp() do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It checks if Flutter is installed correctly",
          "It lists the packages in pubspec.yaml",
          "It puts your app's root widget on the screen",
          "It restarts the whole app"
        ],
        "answer": 2,
        "explanation": "runApp() takes your root widget and displays it — without it, nothing appears on screen, even if main() runs."
      },
      {
        "q": "What does MaterialApp provide for your app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The app shell — theme, title, and first screen (home)",
          "Only the top bar of one screen",
          "A list of installed packages",
          "The emulator for testing"
        ],
        "answer": 0,
        "explanation": "MaterialApp is the shell around everything — it holds the theme, title, and home screen, so every screen inside shares them."
      },
      {
        "q": "Hot reload keeps the app's state, like a counter value, when the UI updates.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Hot reload only updates the changed UI in seconds, so state stays — that is why it feels fast while building UI."
      },
      {
        "q": "A screen needs a top bar title and its main content. Which Scaffold parts do you use?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "appBar and floatingActionButton",
          "body and theme",
          "home and runApp",
          "appBar and body"
        ],
        "answer": 3,
        "explanation": "appBar is the top bar for the title and body is where the real content lives — the button is optional, not the content."
      },
      {
        "q": "What is flutter doctor used for?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "To create a new project",
          "To check whether your Flutter setup is correct",
          "To run the app on a phone",
          "To add a package to pubspec.yaml"
        ],
        "answer": 1,
        "explanation": "flutter doctor checks your SDK, editor, and Android setup and shows green ticks, or exactly what is missing to fix."
      },
      {
        "q": "You open a fresh terminal and type flutter doctor, but it says 'flutter: command not found'. What is the correct fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Reinstall Android Studio",
          "Delete the project and create it again",
          "Add the Flutter folder's bin folder to your system's PATH, then open a fresh terminal",
          "Run flutter run instead"
        ],
        "answer": 2,
        "explanation": "The error only means the system cannot find the flutter tool — adding bin to PATH tells the terminal where it lives, so no reinstall is needed."
      },
      {
        "q": "pubspec.yaml lists your app's packages, along with its name and version.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "pubspec.yaml is where your app's name, version, and package list live — that is why you check it when adding a package."
      },
      {
        "q": "You want to start a brand-new Flutter project called my_first_app. Which command do you run?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "flutter run my_first_app",
          "flutter doctor my_first_app",
          "flutter pub get my_first_app",
          "flutter create my_first_app"
        ],
        "answer": 3,
        "explanation": "flutter create builds a complete project for you — run and doctor do not create anything, they run or check an existing setup."
      },
      {
        "q": "Hot reload and hot restart both fail to show your change, and nothing else makes sense. What is the best next step?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Keep trying hot reload",
          "Do a full restart — it starts everything fresh, as a last option",
          "Delete the project",
          "Reinstall the editor"
        ],
        "answer": 1,
        "explanation": "Full restart is the last option because it wipes state and starts fresh — use it only when hot reload and hot restart cannot show the change."
      }
    ],
    "questions_hi": [
      {
        "q": "Flutter app shuru hote hi sabse pehle kaunsa function dhoondhta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "runApp()",
          "main()",
          "build()",
          "Scaffold()"
        ],
        "answer": 1,
        "explanation": "main() entry point hai — Flutter yahan se shuru hota hai, aur main() hi runApp() ko call karke tumhara app dikhata hai."
      },
      {
        "q": "runApp() kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye check karta hai ki Flutter sahi install hai ya nahi",
          "Ye pubspec.yaml ke packages ki list banata hai",
          "Ye tumhare app ke root widget ko screen par dikhata hai",
          "Ye poora app restart karta hai"
        ],
        "answer": 2,
        "explanation": "runApp() root widget ko lekar screen par dikhata hai — iske bina main() chal bhi jaye to screen par kuch nahi dikhega."
      },
      {
        "q": "MaterialApp tumhare app ke liye kya deta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App ka shell — theme, title, aur pehli screen (home)",
          "Sirf ek screen ka top bar",
          "Installed packages ki list",
          "Testing ke liye emulator"
        ],
        "answer": 0,
        "explanation": "MaterialApp sab kuch ke upar ka shell hai — theme, title aur home screen isi me rehte hain, isliye andar ki har screen unhe share karti hai."
      },
      {
        "q": "Hot reload ke baad app ka state, jaise counter ki value, bacha rehta hai jab UI update hoti hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Hot reload sirf badli hui UI ko seconds me update karta hai, isliye state bacha rehta hai — UI banate waqt yehi isko fast banata hai."
      },
      {
        "q": "Ek screen ko upar title wali patti aur uska main content chahiye. Scaffold ke kaunse parts use karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "appBar aur floatingActionButton",
          "body aur theme",
          "home aur runApp",
          "appBar aur body"
        ],
        "answer": 3,
        "explanation": "appBar upar ki patti hai title ke liye aur body me screen ka asli content hota hai — button optional hai, content nahi."
      },
      {
        "q": "flutter doctor kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Naya project banane ke liye",
          "Ye check karne ke liye ki tumhara Flutter setup sahi hai ya nahi",
          "Phone par app chalane ke liye",
          "pubspec.yaml me package add karne ke liye"
        ],
        "answer": 1,
        "explanation": "flutter doctor SDK, editor aur Android setup ko check karta hai aur green tick deta hai, ya batata hai ki exactly kya missing hai."
      },
      {
        "q": "Tum fresh terminal kholkar flutter doctor likhte ho, par likha aata hai 'flutter: command not found'. Sahi fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Android Studio dobara install karo",
          "Project delete karke dobara banao",
          "Flutter folder ke bin folder ko system ke PATH me add karo, phir fresh terminal kholo",
          "Iske bajay flutter run chalao"
        ],
        "answer": 2,
        "explanation": "Ye error sirf ye batata hai ki system ko flutter tool mil nahi raha — bin ko PATH me add karne se terminal ko uska address mil jata hai, reinstall ki zaroorat nahi."
      },
      {
        "q": "pubspec.yaml me tumhare app ke packages ki list hoti hai, uske naam aur version ke saath.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "pubspec.yaml me app ka naam, version aur packages ki list rehti hai — isliye package add karte waqt isi file ko check karte hain."
      },
      {
        "q": "Tum my_first_app naam ka bilkul naya Flutter project shuru karna chahte ho. Kaunsi command chalaoge?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "flutter run my_first_app",
          "flutter doctor my_first_app",
          "flutter pub get my_first_app",
          "flutter create my_first_app"
        ],
        "answer": 3,
        "explanation": "flutter create poora project bana deta hai — run aur doctor kuch naya nahi banate, wo maujooda setup ko chalate ya check karte hain."
      },
      {
        "q": "Hot reload aur hot restart dono tumhara change nahi dikha rahe, aur kuch aur samajh nahi aa raha. Agla sahi step kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Hot reload ko baar baar try karte raho",
          "Full restart karo — ye sab kuch fresh start karta hai, last option ke roop me",
          "Project delete kar do",
          "Editor dobara install karo"
        ],
        "answer": 1,
        "explanation": "Full restart last option hai kyunki ye state mita kar sab kuch fresh start karta hai — use tabhi karo jab hot reload aur hot restart se change na dikhe."
      }
    ]
  },
  {
    "id": "quiz-02-dart-basics",
    "lessonId": "lesson-02-dart-basics",
    "title": "Quiz: Dart Basics",
    "questions_en": [
      {
        "q": "What is the difference between var city = 'Kota'; and String city = 'Kota';?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "var lets the type change later, String does not",
          "var is only for numbers",
          "var lets Dart guess the type from the first value, then it stays fixed; String states the type directly",
          "There is no difference at all"
        ],
        "answer": 2,
        "explanation": "var is a shortcut, not a free type — Dart fixes it to String at the first value, so assigning a number later fails just like with an explicit type."
      },
      {
        "q": "You need to store students' marks so you can look up a mark by a student's name. Which collection fits best?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Map<String, int>",
          "List<String>",
          "A single int variable",
          "A bool"
        ],
        "answer": 0,
        "explanation": "A Map finds a value by its key, like a dictionary finds a meaning by a word — the name is the key and the mark is the value, so a Map fits, not a position-based List."
      },
      {
        "q": "A function declared as int add(int a, int b) gives a value back to whoever calls it.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "The return type int means the function gives a value back — the caller can print it or use it further, otherwise the value is lost."
      },
      {
        "q": "You must print 'Round 1' to 'Round 3' — exactly 3 times, and you know the count in advance. Which loop fits best?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "while loop",
          "if/else",
          "A function call with no loop",
          "for loop"
        ],
        "answer": 3,
        "explanation": "When the count is known in advance, a for loop is best — start, condition, and step sit in one place, so repeating exactly 3 times stays clear."
      },
      {
        "q": "String name = 'Asha'; Which code prints 'Hello, Asha!'?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "print('Hello, name!');",
          "print('Hello, $name!');",
          "print('Hello, + name');",
          "print(name + Hello);"
        ],
        "answer": 1,
        "explanation": "$name puts the variable's value inside the string — without $, Dart prints the letters n-a-m-e literally."
      },
      {
        "q": "What does this print? List<String> fruits = ['apple', 'banana']; fruits.add('mango'); print(fruits.length);",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "2",
          "4",
          "3",
          "'mango'"
        ],
        "answer": 2,
        "explanation": "The list starts with 2 items and add() puts one more at the end, so length becomes 3 — length counts items, not letters."
      },
      {
        "q": "int marks = 75; if (marks >= 90) print('A grade'); else if (marks >= 60) print('B grade'); else print('Keep practising'); What prints?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "'B grade'",
          "'A grade'",
          "'Keep practising'",
          "Nothing"
        ],
        "answer": 0,
        "explanation": "Only the first true branch runs — 75 is not >= 90, so it skips A, matches >= 60, and prints B."
      },
      {
        "q": "In a Map, each key can appear only once — adding the same key again updates its value.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "The key is the Map's identity — one key holds one value, so giving the same key again does not create a new entry, it replaces the old value."
      },
      {
        "q": "List<String> fruits = ['apple', 'banana', 'mango']; for (int i = 0; i <= fruits.length; i++) { print(fruits[i]); } Why does this crash?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "The list is empty",
          "print cannot print a List item",
          "The list should be a Map",
          "The loop reads fruits[3], but a 3-item list has no index 3 — use i < fruits.length"
        ],
        "answer": 3,
        "explanation": "Counting starts at 0, so the last valid index is length - 1 (2) — using <= reaches index 3, which does not exist, so the app crashes."
      },
      {
        "q": "You must keep the order of steps in a recipe — first step, second step, third step — and read them by position. Which collection fits?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Map<String, int>",
          "List<String>",
          "A single String",
          "bool"
        ],
        "answer": 1,
        "explanation": "A List keeps order and lets you read by position — a Map is for looking things up by name, not for ordered steps."
      }
    ],
    "questions_hi": [
      {
        "q": "var city = 'Kota'; aur String city = 'Kota'; me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "var se type baad me badal sakta hai, String se nahi",
          "var sirf numbers ke liye hai",
          "var me Dart pehli value se type guess karta hai, phir wo fixed ho jata hai; String me type seedha likha hota hai",
          "Dono me koi farq nahi hai"
        ],
        "answer": 2,
        "explanation": "var shortcut hai, free type nahi — Dart pehli value se use String fix kar deta hai, isliye baad me number dena waisa hi fail hoga jaise explicit type me."
      },
      {
        "q": "Students ke marks store karne hain taaki kisi student ke naam se uska mark dhoondha ja sake. Kaunsi collection sabse sahi hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Map<String, int>",
          "List<String>",
          "Ek akela int variable",
          "Ek bool"
        ],
        "answer": 0,
        "explanation": "Map key se value dhoondhta hai, jaise dictionary word se meaning — naam key hai aur mark value hai, isliye Map sahi hai, position wali List nahi."
      },
      {
        "q": "int add(int a, int b) jaisa function use call karne wale ko ek value wapas deta hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Return type int ka matlab hai function ek value wapas dega — caller use print kar sakta hai ya aage use kar sakta hai, warna value kho jati."
      },
      {
        "q": "Tumhe 'Round 1' se 'Round 3' tak — exactly 3 baar print karna hai, aur count pehle se pata hai. Kaunsa loop sabse sahi hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "while loop",
          "if/else",
          "Ek function call bina loop ke",
          "for loop"
        ],
        "answer": 3,
        "explanation": "Jab count pehle se pata ho to for loop best hai — start, condition aur step ek jagah likhe hote hain, isliye 3 baar chalana saaf rehta hai."
      },
      {
        "q": "String name = 'Asha'; Kaunsa code 'Hello, Asha!' print karega?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "print('Hello, name!');",
          "print('Hello, $name!');",
          "print('Hello, + name');",
          "print(name + Hello);"
        ],
        "answer": 1,
        "explanation": "$name string ke andar variable ki value daal deta hai — $ ke bina Dart n-a-m-e letters ko hi print kar dega."
      },
      {
        "q": "Ye kya print karega? List<String> fruits = ['apple', 'banana']; fruits.add('mango'); print(fruits.length);",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "2",
          "4",
          "3",
          "'mango'"
        ],
        "answer": 2,
        "explanation": "List me shuru me 2 items hain aur add() end me ek aur jod deta hai, isliye length 3 ho jati hai — length items ginata hai, letters nahi."
      },
      {
        "q": "int marks = 75; if (marks >= 90) print('A grade'); else if (marks >= 60) print('B grade'); else print('Keep practising'); Kya print hoga?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "'B grade'",
          "'A grade'",
          "'Keep practising'",
          "Kuch nahi"
        ],
        "answer": 0,
        "explanation": "Sirf pehli true wali branch chalti hai — 75, 90 se kam hai isliye A skip hota hai, 60 se zyada hai isliye B print hota hai."
      },
      {
        "q": "Map me har key sirf ek baar aa sakti hai — wahi key dobara dene se uski value update ho jati hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Key hi Map ki pehchaan hai — ek key ka ek hi value hota hai, isliye dobara dena naya entry nahi banata, purani value badal deta hai."
      },
      {
        "q": "List<String> fruits = ['apple', 'banana', 'mango']; for (int i = 0; i <= fruits.length; i++) { print(fruits[i]); } Ye crash kyon hota hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "List khaali hai",
          "print List ka item print nahi kar sakta",
          "List ke bajay Map hona chahiye tha",
          "Loop fruits[3] ko padhta hai, par 3-item wali list me index 3 hota hi nahi — i < fruits.length hona chahiye"
        ],
        "answer": 3,
        "explanation": "Counting 0 se shuru hoti hai, isliye aakhri sahi index length - 1 (2) hai — <= use karne se loop index 3 tak pahunch jata hai jo maujood hi nahi, isliye app crash hota hai."
      },
      {
        "q": "Recipe ke steps ka order sambhalna hai — pehla step, doosra step, teesra step — aur unhe position se padhna hai. Kaunsi collection sahi hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Map<String, int>",
          "List<String>",
          "Ek akela String",
          "bool"
        ],
        "answer": 1,
        "explanation": "List order sambhal ke rakhta hai aur position se padhne deta hai — Map naam se dhoondhne ke liye hai, order wale steps ke liye nahi."
      }
    ]
  },
  {
    "id": "quiz-03-dart-oop",
    "lessonId": "lesson-03-dart-oop",
    "title": "Quiz: Dart OOP + Null Safety",
    "questions_en": [
      {
        "q": "What is the difference between a class and an object?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A class is one real thing, an object is the blueprint",
          "A class is the blueprint, an object is one thing built from it",
          "They are the same thing",
          "A class holds only code, an object holds only data"
        ],
        "answer": 1,
        "explanation": "The blueprint is written once, but many objects can be built from it — each object holds its own data while sharing the same structure."
      },
      {
        "q": "What does a constructor do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It deletes an object",
          "It prints the object's data",
          "It builds an object and makes sure it starts out valid",
          "It copies one class into another"
        ],
        "answer": 2,
        "explanation": "A constructor sets the object's essential fields when it is built — so an object never starts half-made or in a wrong state."
      },
      {
        "q": "String? means the variable can never be null.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "It is the opposite — ? is what says the value may be missing (null), so a String? can hold a string or null."
      },
      {
        "q": "class Dog extends Animal — what is inheritance used for here?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It lets a new class reuse an old class and add its own extras",
          "It deletes the parent class",
          "It turns every class into a widget",
          "It hides all parent methods forever"
        ],
        "answer": 0,
        "explanation": "Inheritance gives Dog everything from Animal, so only what is different needs writing — the same code is not copied again."
      },
      {
        "q": "A student's nickname may be missing. Which declaration fits best?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "late String nickname;",
          "String nickname;",
          "String! nickname;",
          "String? nickname;"
        ],
        "answer": 3,
        "explanation": "? marks the type as nullable, so missing is allowed — plain String forbids null, and ! is a force, not a type."
      },
      {
        "q": "What does this print? String? nickname = null; print(nickname?.length);",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "It crashes",
          "null",
          "0",
          "An empty string"
        ],
        "answer": 1,
        "explanation": "?. is a safe call — when the value is null the whole expression becomes null instead of crashing, so print shows null."
      },
      {
        "q": "A mixin adds behaviour to a class with 'with', without making that class inherit from the mixin.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "with adds the mixin's methods while the class keeps its own parent — that is why a mixin is for 'can do', not 'is a'."
      },
      {
        "q": "When should you use late?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "When a value may be missing forever",
          "When you want to allow null",
          "When you want the app to crash",
          "When a value will be set before its first use, but not at creation"
        ],
        "answer": 3,
        "explanation": "late is a promise to set the value before using it — use it only when something else must set it first, not as a way to allow null."
      },
      {
        "q": "String? name = null; print(name!.length); The app crashes. What caused it?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "print cannot show a length",
          "The ? crashed the app by itself",
          "The ! forced a null value, promising it was not null — and the promise was wrong",
          "late was missing"
        ],
        "answer": 2,
        "explanation": "! means 'I promise this is not null' — here the value was null, so the broken promise crashes the app, while ?. would have safely given null."
      },
      {
        "q": "A field has no value when the object is created, but it will definitely be set before anyone reads it, and after that it will never be missing. Which fits best?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "String? field;",
          "String field;",
          "late String field;",
          "String! field;"
        ],
        "answer": 2,
        "explanation": "late fits a value that arrives later but is guaranteed before use — ? would wrongly say it may stay missing, and plain String needs a value at creation."
      }
    ],
    "questions_hi": [
      {
        "q": "Class aur object me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Class ek asli cheez hai, object blueprint hai",
          "Class blueprint hai, object usse bani ek cheez hai",
          "Dono ek hi cheez hain",
          "Class sirf code rakhta hai, object sirf data rakhta hai"
        ],
        "answer": 1,
        "explanation": "Blueprint ek baar likha jata hai, usse kai objects ban sakte hain — har object ka apna data hota hai, par structure wahi rehta hai."
      },
      {
        "q": "Constructor kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Object ko delete karta hai",
          "Object ka data print karta hai",
          "Object banata hai aur ye pakka karta hai ki wo shuru se sahi ho",
          "Ek class ko doosri class me copy karta hai"
        ],
        "answer": 2,
        "explanation": "Constructor object banate waqt uske zaroori fields ko set karta hai — isliye object kabhi aadha ya galat state me shuru nahi hota."
      },
      {
        "q": "String? ka matlab hai ki variable kabhi null nahi ho sakta.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ulta hai — ? hi batata hai ki value missing (null) ho sakti hai, isliye String? me string bhi ho sakta hai aur null bhi."
      },
      {
        "q": "class Dog extends Animal se kya fayda hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Nayi class purani class ko reuse karke apne extras jod leti hai",
          "Parent class delete ho jati hai",
          "Har class widget ban jati hai",
          "Parent ke methods hamesha ke liye chhup jate hain"
        ],
        "answer": 0,
        "explanation": "Inheritance se Dog ko Animal ki har cheez mil jati hai, sirf jo alag hai wo jodna padta hai — wahi code dobara likhne ki zaroorat nahi."
      },
      {
        "q": "Ek student ka nickname missing ho sakta hai. Kaunsi declaration sabse sahi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "late String nickname;",
          "String nickname;",
          "String! nickname;",
          "String? nickname;"
        ],
        "answer": 3,
        "explanation": "? type ko nullable banata hai, isliye missing allowed hai — plain String null ko mana karta hai aur ! type nahi, force hai."
      },
      {
        "q": "Ye kya print karega? String? nickname = null; print(nickname?.length);",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Crash hoga",
          "null",
          "0",
          "Ek khaali string"
        ],
        "answer": 1,
        "explanation": "?. safe call hai — value null ho to poora expression null ban jata hai, crash nahi hota, isliye print null dikhata hai."
      },
      {
        "q": "Mixin 'with' se class me behaviour jodta hai, bina us class ko mixin se inherit karaye.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "with se mixin ke methods mil jate hain aur class apna parent bhi rakh leti hai — isliye mixin 'can do' ke liye hai, 'is a' ke liye nahi."
      },
      {
        "q": "late kab use karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Jab value hamesha missing reh sakti ho",
          "Jab null allow karna ho",
          "Jab app ko crash karana ho",
          "Jab value banate waqt nahi, par pehli baar use karne se pehle pakka set ho jayegi"
        ],
        "answer": 3,
        "explanation": "late ek vaada hai ki value use se pehle set kar di jayegi — isliye use sirf tab karo jab koi aur cheez use pehle set karti ho, null allow karne ke liye nahi."
      },
      {
        "q": "String? name = null; print(name!.length); App crash ho gaya. Wajah kya hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "print length nahi dikha sakta",
          "? ne app ko akele crash kara diya",
          "! ne null value ko force kiya, ye vaada karke ki ye null nahi hai — aur vaada galat nikla",
          "late missing tha"
        ],
        "answer": 2,
        "explanation": "! ka matlab hai 'main vaada karta hoon ye null nahi hai' — yahan value null thi, isliye toota hua vaada crash ban gaya, jabki ?. safely null de deta."
      },
      {
        "q": "Ek field banate waqt uski value nahi hai, par use padhne se pehle wo pakka set ho jayegi, aur uske baad kabhi missing nahi hogi. Kaunsa sabse sahi hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "String? field;",
          "String field;",
          "late String field;",
          "String! field;"
        ],
        "answer": 2,
        "explanation": "late us value ke liye hai jo baad me aati hai par use se pehle guaranteed hai — ? galat ye kahega ki wo missing reh sakti hai, aur plain String ko banate waqt hi value chahiye."
      }
    ]
  },
  {
    "id": "quiz-04-widgets",
    "lessonId": "lesson-04-widgets",
    "title": "Quiz: Everything Is a Widget",
    "questions_en": [
      {
        "q": "In Flutter, what is everything you see on screen — text, buttons, images, even empty space?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A widget",
          "A pixel",
          "An activity",
          "A native view"
        ],
        "answer": 0,
        "explanation": "A widget is the blueprint for what appears on screen; Flutter turns that blueprint into pixels, so the whole UI is widgets."
      },
      {
        "q": "A screen shows a title that never changes. Which widget type fits it best?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A StatefulWidget",
          "A platform view",
          "A StatelessWidget",
          "A StreamBuilder"
        ],
        "answer": 2,
        "explanation": "A StatelessWidget never changes after it is built, so it is perfect for UI that depends only on what is passed in, like a title."
      },
      {
        "q": "The build() method returns the UI a widget shows.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "build() describes what the widget looks like; Flutter calls it when the widget first appears and again when its parent rebuilds."
      },
      {
        "q": "Read this tree top to bottom: MaterialApp > Scaffold > body: Center > Column > Text. Which widget is the Text's parent?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Scaffold",
          "MaterialApp",
          "Column",
          "Center"
        ],
        "answer": 2,
        "explanation": "In a widget tree, the widget directly above is the parent — here Column sits directly above Text, so Column is its parent."
      },
      {
        "q": "Why should you add const to a widget whose inputs are all fixed, like const Text('Hello!')?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "It changes the font",
          "It is required for all Text widgets",
          "It makes the widget private",
          "Flutter reuses it instead of rebuilding it"
        ],
        "answer": 3,
        "explanation": "const means the value is known at compile time, so Flutter can reuse the widget instead of rebuilding it — less work, faster UI."
      },
      {
        "q": "You need a tappable button that shows a label. Which widget do you pick?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Text, styled bold",
          "ElevatedButton with a Text child",
          "Container with a colour",
          "Icon with no tap handling"
        ],
        "answer": 1,
        "explanation": "ElevatedButton is the button widget: it handles taps and shows a label, while Text or Container alone do not respond to taps."
      },
      {
        "q": "A parent widget controls its children's size, position and style.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "That is how the widget tree works: a parent decides how its children are sized and placed, so a layout bug is often fixed at the parent."
      },
      {
        "q": "Why build a big screen from small widgets instead of one giant widget?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Small widgets run on older phones only",
          "It makes the app file smaller on disk",
          "Reuse, readability and fix-once-fixed-everywhere",
          "Flutter forbids widgets over 50 lines"
        ],
        "answer": 2,
        "explanation": "Small widgets can be reused in many places, are easy to read, and a fix in one widget is fixed everywhere it is used."
      },
      {
        "q": "This tree should show a profile card, but the screen shows a plain blue box instead of the avatar: ProfileCard > Card > Row > [CircleAvatar, Column > Text, Text]. Where is the most likely wrong widget?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "ProfileCard",
          "Card",
          "Row",
          "The widget where CircleAvatar should be"
        ],
        "answer": 3,
        "explanation": "When a screen looks wrong, find the wrong widget in the tree: the avatar branch is missing, so the widget in the CircleAvatar spot is the suspect, not the card or row around it."
      },
      {
        "q": "When should you NOT use a StatelessWidget?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "When the UI is a fixed title",
          "When the UI must change on its own, like a counter",
          "When the widget has a final field",
          "When the widget is inside a Column"
        ],
        "answer": 1,
        "explanation": "A StatelessWidget is immutable and cannot change its own data, so anything that must update itself — a counter, a form — needs a StatefulWidget."
      }
    ],
    "questions_hi": [
      {
        "q": "Flutter me screen par jo kuch dikhta hai — text, button, image, khaali space bhi — wo kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek widget",
          "Ek pixel",
          "Ek activity",
          "Ek native view"
        ],
        "answer": 0,
        "explanation": "Widget wo blueprint hai jo batata hai kya dikhana hai; Flutter us blueprint ko pixels me badalta hai, isliye poora UI widgets se banta hai."
      },
      {
        "q": "Ek screen par ek title dikhta hai jo kabhi nahi badalta. Uske liye kaunsa widget type best hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek StatefulWidget",
          "Ek platform view",
          "Ek StatelessWidget",
          "Ek StreamBuilder"
        ],
        "answer": 2,
        "explanation": "StatelessWidget banne ke baad kabhi nahi badalta, isliye jo UI sirf pass ki hui cheez par depend kare, jaise title, uske liye yehi sahi hai."
      },
      {
        "q": "build() method wo UI return karta hai jo widget dikhayega.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "build() batata hai widget kaisa dikhega; Flutter use tab call karta hai jab widget pehli baar dikhe aur jab uska parent rebuild ho."
      },
      {
        "q": "Is tree ko upar se neeche padho: MaterialApp > Scaffold > body: Center > Column > Text. Text ka parent kaunsa widget hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Scaffold",
          "MaterialApp",
          "Column",
          "Center"
        ],
        "answer": 2,
        "explanation": "Widget tree me seedha upar wala widget parent hota hai — yahan Column seedha Text ke upar hai, isliye Column hi parent hai."
      },
      {
        "q": "const Text('Hello!') jaise widget par const kyon lagana chahiye, jab saare inputs fixed hon?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ye font badal deta hai",
          "Ye har Text widget ke liye zaroori hai",
          "Ye widget ko private bana deta hai",
          "Flutter use dobara banane ki bajay reuse kar leta hai"
        ],
        "answer": 3,
        "explanation": "const ka matlab value compile time par hi pata hai, isliye Flutter us widget ko dobara banane ki bajay reuse kar leta hai — kam kaam, fast UI."
      },
      {
        "q": "Tumko ek tappable button chahiye jo label dikhaye. Kaunsa widget choose karoge?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Bold style wala Text",
          "Text child ke saath ElevatedButton",
          "Colour wala Container",
          "Bina tap handling ke Icon"
        ],
        "answer": 1,
        "explanation": "ElevatedButton hi button widget hai: ye taps handle karta hai aur label dikhata hai, jabki akele Text ya Container tap par react nahi karte."
      },
      {
        "q": "Ek parent widget apne children ka size, position aur style control karta hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Widget tree aise hi kaam karta hai: parent tay karta hai uske children kaise size honge aur kahan lagenge, isliye layout bug aksar parent par fix hota hai."
      },
      {
        "q": "Ek badi screen ko ek giant widget ki bajay chhote widgets se kyon banana chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Chhote widgets sirf purane phones par chalte hain",
          "Isse app file disk par chhoti ho jaati hai",
          "Reuse, readability aur ek jagah fix karo to har jagah fix",
          "Flutter 50 lines se bade widgets allow nahi karta"
        ],
        "answer": 2,
        "explanation": "Chhote widgets kai jagah reuse ho sakte hain, padhne me aasaan hote hain, aur ek widget me fix karne se wo har jagah fix ho jaata hai."
      },
      {
        "q": "Is tree me profile card dikhna chahiye, par screen par avatar ki jagah plain blue box dikh raha hai: ProfileCard > Card > Row > [CircleAvatar, Column > Text, Text]. Sabse likely galat widget kahan hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "ProfileCard",
          "Card",
          "Row",
          "Us jagah wala widget jahan CircleAvatar hona chahiye"
        ],
        "answer": 3,
        "explanation": "Jab screen kharab dikhe to tree me galat widget dhoondho: avatar wali branch missing hai, isliye CircleAvatar ki jagah wala widget suspect hai, uske aas paas ka card ya row nahi."
      },
      {
        "q": "StatelessWidget kab use NAHI karna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Jab UI ek fixed title ho",
          "Jab UI ko khud badalna ho, jaise counter",
          "Jab widget ka field final ho",
          "Jab widget Column ke andar ho"
        ],
        "answer": 1,
        "explanation": "StatelessWidget immutable hota hai aur apna data khud nahi badal sakta, isliye jo cheez khud update ho — counter, form — uske liye StatefulWidget chahiye."
      }
    ]
  },
  {
    "id": "quiz-05-layout",
    "lessonId": "lesson-05-layout",
    "title": "Quiz: Layout: Row, Column & Container",
    "questions_en": [
      {
        "q": "Which widget places its children side by side, left to right?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Column",
          "Row",
          "Stack",
          "ListView"
        ],
        "answer": 1,
        "explanation": "Row flows horizontally, left to right; Column is the one that stacks children top to bottom."
      },
      {
        "q": "In a Row, which axis is the main axis?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The diagonal axis",
          "The depth axis",
          "The cross axis",
          "The horizontal axis"
        ],
        "answer": 3,
        "explanation": "The main axis is the direction children flow in — for a Row that is horizontal, so its cross axis is vertical."
      },
      {
        "q": "Padding is space outside a box, and margin is space inside it.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "It is the other way round: padding is space inside the box, between border and child, and margin is space outside it, between neighbours."
      },
      {
        "q": "What does Expanded do to its child inside a Row or Column?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It hides the child",
          "It makes the child scroll",
          "It gives the child all the leftover space",
          "It centres the child on screen"
        ],
        "answer": 2,
        "explanation": "Expanded tells its child to take whatever space is left in the Row or Column, which is how a title between two icons never overflows."
      },
      {
        "q": "A Row shows a yellow-and-black striped overflow: an icon, a long title, and an icon do not fit. What is the best fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Wrap the title Text in Expanded",
          "Wrap the whole Row in a Container",
          "Delete the second icon",
          "Make the title font size 6"
        ],
        "answer": 0,
        "explanation": "The title is the flexible part, so wrapping it in Expanded lets it take the leftover space instead of overflowing; shrinking text hides the problem."
      },
      {
        "q": "You want the three items in a Row centred horizontally as a group. Which property do you set?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "crossAxisAlignment: CrossAxisAlignment.center",
          "mainAxisAlignment: MainAxisAlignment.center",
          "mainAxisSize: MainAxisSize.min",
          "alignment: Alignment.centerLeft"
        ],
        "answer": 1,
        "explanation": "In a Row the main axis is horizontal, so mainAxisAlignment.center centres the group left to right; cross alignment would only centre them vertically."
      },
      {
        "q": "Flexible differs from Expanded because Flexible lets its child stay smaller than its share when its content is small.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "That is the real difference: Expanded forces the child to fill its share, while Flexible allows a smaller child to stay small."
      },
      {
        "q": "You only need 16 pixels of space around a Text, with no colour, border or rounded corners. What should you use?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A Container with a decoration",
          "A Stack",
          "A Card",
          "A Padding widget"
        ],
        "answer": 3,
        "explanation": "For plain spacing with no styling, Padding (or a SizedBox gap) is the right tool; a Container is for a styled box, not bare spacing."
      },
      {
        "q": "Lay out this card row: a square thumbnail on the left, then a title above a subtitle on the right. Which structure fits?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A Column holding two Rows",
          "A Row holding an image and a Column of two Texts",
          "A Stack of three Texts",
          "A Container holding a single Text"
        ],
        "answer": 1,
        "explanation": "The row runs left to right, so the outer widget is a Row; the title and subtitle stack vertically, so they belong in a Column inside it."
      },
      {
        "q": "Why does overflow happen in a Row or Column?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Because the widgets are too colourful",
          "Because the children together are bigger than the space the Row or Column has",
          "Because the screen is in dark mode",
          "Because Expanded was used"
        ],
        "answer": 1,
        "explanation": "Overflow means the children need more width or height than their parent offers — the layout, not the colours or theme, is too big for its space."
      }
    ],
    "questions_hi": [
      {
        "q": "Kaunsa widget apne children ko side by side, left se right rakhta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Column",
          "Row",
          "Stack",
          "ListView"
        ],
        "answer": 1,
        "explanation": "Row horizontally behta hai, left se right; Column children ko upar se neeche stack karta hai."
      },
      {
        "q": "Ek Row me main axis kaunsi hoti hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Diagonal axis",
          "Depth axis",
          "Cross axis",
          "Horizontal axis"
        ],
        "answer": 3,
        "explanation": "Main axis wo direction hai jisme children behte hain — Row ke liye ye horizontal hai, isliye uski cross axis vertical hoti hai."
      },
      {
        "q": "Padding box ke bahar ki jagah hai, aur margin andar ki jagah hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ulta hai: padding box ke andar ki jagah hai, border aur child ke beech, aur margin bahar ki jagah hai, neighbours ke beech."
      },
      {
        "q": "Row ya Column ke andar Expanded apne child ke saath kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Child ko chhupa deta hai",
          "Child ko scrollable bana deta hai",
          "Child ko bachi hui saari jagah de deta hai",
          "Child ko screen par centre kar deta hai"
        ],
        "answer": 2,
        "explanation": "Expanded apne child se kehta hai Row ya Column me jo jagah bachi hai wo sab le lo, isliye do icons ke beech title kabhi overflow nahi karta."
      },
      {
        "q": "Ek Row me peeli-kaali striped overflow dikh rahi hai: ek icon, lamba title aur ek icon fit nahi ho rahe. Sabse achha fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Title Text ko Expanded me wrap karo",
          "Poori Row ko Container me wrap karo",
          "Doosra icon delete karo",
          "Title ka font size 6 kar do"
        ],
        "answer": 0,
        "explanation": "Title hi flexible part hai, isliye use Expanded me wrap karne se wo bachi hui jagah le lega, overflow nahi karega; text chhota karna problem ko chhupana hai."
      },
      {
        "q": "Row ke teen items ko group me horizontally centre karna hai. Kaunsi property set karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "crossAxisAlignment: CrossAxisAlignment.center",
          "mainAxisAlignment: MainAxisAlignment.center",
          "mainAxisSize: MainAxisSize.min",
          "alignment: Alignment.centerLeft"
        ],
        "answer": 1,
        "explanation": "Row me main axis horizontal hai, isliye mainAxisAlignment.center group ko left se right centre karta hai; cross alignment sirf vertically centre karta."
      },
      {
        "q": "Flexible, Expanded se isliye alag hai kyunki Flexible apne child ko apne hisse se chhota rehne deta hai jab uska content chhota ho.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Yehi asli farak hai: Expanded child ko poora hissa bharne par majboor karta hai, jabki Flexible chhote child ko chhota rehne deta hai."
      },
      {
        "q": "Text ke aas paas sirf 16 pixels ki jagah chahiye, bina colour, border ya rounded corners ke. Kya use karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Decoration wala Container",
          "Ek Stack",
          "Ek Card",
          "Ek Padding widget"
        ],
        "answer": 3,
        "explanation": "Sirf spacing ke liye, bina styling ke, Padding (ya SizedBox gap) sahi tool hai; Container styled box ke liye hai, khaali spacing ke liye nahi."
      },
      {
        "q": "Is card row ka layout banao: left me square thumbnail, right me title ke upar subtitle. Kaunsi structure sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Do Rows ko hold karta hua Column",
          "Image aur do Texts wale Column ko hold karta hua Row",
          "Teen Texts ka Stack",
          "Ek Text ko hold karta hua Container"
        ],
        "answer": 1,
        "explanation": "Row left se right chalti hai, isliye outer widget Row hai; title aur subtitle vertically stack hote hain, isliye wo andar wale Column me aayenge."
      },
      {
        "q": "Row ya Column me overflow kyon hota hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Kyunki widgets bahut colourful hain",
          "Kyunki children milke Row ya Column ki jagah se bade hain",
          "Kyunki screen dark mode me hai",
          "Kyunki Expanded use hua hai"
        ],
        "answer": 1,
        "explanation": "Overflow ka matlab hai children ko parent ki jagah se zyada width ya height chahiye — layout jagah se bada hai, colours ya theme ki galti nahi."
      }
    ]
  },
  {
    "id": "quiz-06-stack-scroll-responsive",
    "lessonId": "lesson-06-stack-scroll-responsive",
    "title": "Quiz: Stack, Scroll & Responsive UI",
    "questions_en": [
      {
        "q": "What is the key difference between a Stack and a Row?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Stack is faster than Row",
          "Row layers children on top of each other; Stack puts them side by side",
          "Stack layers children on top of each other; Row puts them side by side",
          "Stack only holds images"
        ],
        "answer": 2,
        "explanation": "Stack overlaps its children like papers on a desk, while Row arranges them side by side — use Stack only when things must overlap."
      },
      {
        "q": "What does Positioned do inside a Stack?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It pins a child to an exact spot, like bottom: 12, left: 12",
          "It makes the child scroll",
          "It gives the child a shadow",
          "It hides the child behind the Stack"
        ],
        "answer": 0,
        "explanation": "Positioned sets top, bottom, left or right for a child, so a caption can sit exactly at the bottom-left of an image."
      },
      {
        "q": "SingleChildScrollView is the right choice for a list of thousands of items.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "It builds everything at once, so thousands of items would be slow and heavy — long or data-driven lists belong to ListView."
      },
      {
        "q": "What does MediaQuery.of(context).size give you?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The number of widgets on screen",
          "The device brand name",
          "The app version",
          "The screen width and height in logical pixels"
        ],
        "answer": 3,
        "explanation": "MediaQuery reads the screen itself, so a card sized as 90% of screen width works on small and large phones alike."
      },
      {
        "q": "You need the width available inside a card, not the whole screen. Which tool fits?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "MediaQuery.of(context).size",
          "LayoutBuilder, reading constraints.maxWidth",
          "Stack",
          "Positioned.fill"
        ],
        "answer": 1,
        "explanation": "LayoutBuilder reports the space your parent gave you, while MediaQuery would wrongly give the full screen size inside a card."
      },
      {
        "q": "A feed screen needs a collapsing app bar, then a list, then a grid, all scrolling together as one page. What do you choose?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "A Column inside a SingleChildScrollView",
          "A Row of three ListViews",
          "A CustomScrollView with SliverAppBar, SliverList and SliverGrid",
          "Three separate Scaffolds"
        ],
        "answer": 2,
        "explanation": "Slivers are scrollable pieces that join into one smooth scroll, so the app bar can shrink while the list and grid scroll with it."
      },
      {
        "q": "Responsive design means taking one layout and stretching it to fit every screen.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Responsive means adapting: stack and scroll on phones, use the extra width on tablets — stretching one layout leaves tablet screens empty and phone text cramped."
      },
      {
        "q": "On a tablet-width screen, what should the same content do, by the lesson's rules?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Use the extra width: two columns, a side panel, or a wider grid",
          "Show the phone layout stretched wider",
          "Hide half the content",
          "Shrink all text to fit one column"
        ],
        "answer": 0,
        "explanation": "Tablets get a layout that uses their width, while phones stack vertically and scroll — the breakpoint rule is below 600 for phones, 600 and above for tablets."
      },
      {
        "q": "A settings page is clipped at the bottom on small phones — the lowest fields cannot be reached. What is the right fix?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Put the fields in a smaller font",
          "Delete the lowest fields",
          "Wrap the Column in a SingleChildScrollView",
          "Wrap the Column in a Stack"
        ],
        "answer": 2,
        "explanation": "The content is taller than the screen but fixed and small, which is exactly the SingleChildScrollView job — shrinking text only hides the problem."
      },
      {
        "q": "In a Stack, which child appears on top?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "The first child",
          "The last child",
          "The biggest child",
          "The child with Positioned"
        ],
        "answer": 1,
        "explanation": "Stack paints children in order, so the last child is the highest layer — that is why a badge listed last sits above the avatar."
      }
    ],
    "questions_hi": [
      {
        "q": "Stack aur Row me main farak kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Stack, Row se fast hota hai",
          "Row children ko ek ke upar ek rakhta hai; Stack side by side rakhta hai",
          "Stack children ko ek ke upar ek rakhta hai; Row side by side rakhta hai",
          "Stack me sirf images aa sakti hain"
        ],
        "answer": 2,
        "explanation": "Stack apne children ko desk par kagaz ki tarah overlap karta hai, jabki Row unko side by side lagata hai — Stack sirf tab use karo jab cheezein overlap honi hon."
      },
      {
        "q": "Stack ke andar Positioned kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Child ko exact jagah par pin karta hai, jaise bottom: 12, left: 12",
          "Child ko scrollable bana deta hai",
          "Child ko shadow deta hai",
          "Child ko Stack ke peeche chhupa deta hai"
        ],
        "answer": 0,
        "explanation": "Positioned child ke liye top, bottom, left ya right set karta hai, isliye caption image ke bottom-left par exactly baith sakta hai."
      },
      {
        "q": "Hazaaron items ki list ke liye SingleChildScrollView sahi choice hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ye sab kuch ek saath bana deta hai, isliye hazaaron items slow aur heavy ho jayenge — lambi ya data-driven lists ListView ki hain."
      },
      {
        "q": "MediaQuery.of(context).size tumko kya deta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Screen par widgets ki sankhya",
          "Device ka brand naam",
          "App ka version",
          "Screen ki width aur height, logical pixels me"
        ],
        "answer": 3,
        "explanation": "MediaQuery screen ko khud padhta hai, isliye 90% screen width wala card chhote aur bade dono phones par kaam karta hai."
      },
      {
        "q": "Card ke andar available width chahiye, poori screen nahi. Kaunsa tool sahi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "MediaQuery.of(context).size",
          "LayoutBuilder, constraints.maxWidth padh ke",
          "Stack",
          "Positioned.fill"
        ],
        "answer": 1,
        "explanation": "LayoutBuilder batata hai parent ne tumko kitni jagah di, jabki MediaQuery card ke andar bhi poori screen ka size de dega, jo galat hoga."
      },
      {
        "q": "Ek feed screen chahiye: collapsing app bar, phir list, phir grid — sab ek page ki tarah ek saath scroll hon. Kya choose karoge?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "SingleChildScrollView ke andar Column",
          "Teen ListViews wali Row",
          "SliverAppBar, SliverList aur SliverGrid ke saath CustomScrollView",
          "Teen alag Scaffolds"
        ],
        "answer": 2,
        "explanation": "Slivers scrollable tukde hain jo ek smooth scroll me jud jaate hain, isliye app bar sikud sakta hai jabki list aur grid uske saath scroll karte hain."
      },
      {
        "q": "Responsive design ka matlab hai ek hi layout ko har screen par stretch karke fit kar dena.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Responsive ka matlab adapt karna hai: phone par stack aur scroll, tablet par extra width ka use — ek layout ko stretch karne se tablet khaali aur phone ka text dabba hua lagega."
      },
      {
        "q": "Tablet-width screen par wahi content, lesson ke rules ke hisaab se, kya kare?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Extra width ka use kare: do columns, side panel, ya chauda grid",
          "Phone layout ko hi chauda stretch kar de",
          "Aadha content chhupa de",
          "Saara text chhota karke ek column me fit kar de"
        ],
        "answer": 0,
        "explanation": "Tablet ko uski width ka use karta hua layout milta hai, jabki phone vertically stack karke scroll karta hai — breakpoint rule hai 600 se neeche phone, 600 aur upar tablet."
      },
      {
        "q": "Ek settings page chhote phones par neeche se kat raha hai — sabse neeche wale fields tak pahuncha hi nahi ja sakta. Sahi fix kya hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Fields ka font chhota kar do",
          "Sabse neeche wale fields delete kar do",
          "Column ko SingleChildScrollView me wrap karo",
          "Column ko Stack me wrap karo"
        ],
        "answer": 2,
        "explanation": "Content screen se lamba hai par fixed aur thoda hai, jo bilkul SingleChildScrollView ka kaam hai — font chhota karna problem ko chhupana hai."
      },
      {
        "q": "Stack me kaunsa child sabse upar dikhta hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Pehla child",
          "Aakhri child",
          "Sabse bada child",
          "Positioned wala child"
        ],
        "answer": 1,
        "explanation": "Stack children ko order me paint karta hai, isliye aakhri child sabse upar wali layer hoti hai — isliye aakhir me likha badge avatar ke upar baithta hai."
      }
    ]
  },
  {
    "id": "quiz-07-app-structure",
    "lessonId": "lesson-07-app-structure",
    "title": "Quiz: App Structure: Bars, Tabs & Drawers",
    "questions_en": [
      {
        "q": "What is the AppBar's job on a screen?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It shows the list of all screens",
          "It handles network calls",
          "It stores the app theme",
          "It is the top bar holding the title and action buttons"
        ],
        "answer": 3,
        "explanation": "The AppBar is the top bar users look at first to know where they are, with a short title and 1-2 action icons on the right."
      },
      {
        "q": "An app has Home, Search and Profile as daily sections, plus Settings and Help used rarely. Which pattern fits?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Bottom navigation for the daily sections, Drawer for Settings and Help",
          "Drawer for everything",
          "Bottom navigation with all five sections",
          "A TabBar for all five"
        ],
        "answer": 0,
        "explanation": "Primary daily destinations belong in visible bottom tabs, while secondary destinations like settings belong in the drawer, not hidden away."
      },
      {
        "q": "A TabBar must be paired with a TabBarView to show the selected tab's content.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "TabBar is only the row of tabs; TabBarView shows the content, and both must share the same controller and length."
      },
      {
        "q": "Where does the FloatingActionButton sit on a screen?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "In the centre of the body",
          "Inside the AppBar actions",
          "Floating above the bottom-right corner",
          "Inside the Drawer header"
        ],
        "answer": 2,
        "explanation": "The FAB floats above the bottom-right of the screen, and it belongs to Scaffold.floatingActionButton for the screen's single most common action."
      },
      {
        "q": "An app needs 5 top-level sections that users switch between often. What should you choose?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A BottomNavigationBar with 5 items",
          "A Drawer with 5 items",
          "5 FloatingActionButtons",
          "A TabBar with 5 tabs across sections"
        ],
        "answer": 0,
        "explanation": "Bottom navigation fits 2-5 frequently switched top-level sections; more than 5 shrinks labels and hurts tapping, so that is the limit."
      },
      {
        "q": "Pick the correct Scaffold structure for a screen with a top bar, a side menu and bottom tabs.",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Scaffold(appBar: AppBar(...), body: ..., bottomNavigationBar: ...)",
          "Scaffold(appBar: AppBar(...), drawer: Drawer(...), body: ..., bottomNavigationBar: ...)",
          "Scaffold(body: AppBar(...), drawer: Drawer(...))",
          "Scaffold(appBar: Drawer(...), body: BottomNavigationBar(...))"
        ],
        "answer": 1,
        "explanation": "Scaffold has named slots: appBar on top, drawer on the side, body for content, bottomNavigationBar at the bottom — fill the slots you need."
      },
      {
        "q": "Every screen in an app needs a Drawer.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "A drawer is only for secondary destinations; many screens need no drawer at all, and hiding daily screens in one makes them hard to find."
      },
      {
        "q": "What is the TabController's job for a TabBar and TabBarView?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "It fetches the tab data",
          "It keeps the tab row and its content in sync, with a length matching the tab count",
          "It styles the tabs",
          "It adds the back button"
        ],
        "answer": 1,
        "explanation": "Both widgets share one controller so tapping a tab shows the right page; a mismatched length, like 3 tabs with length 2, crashes the app."
      },
      {
        "q": "Structure a 3-tab profile screen with Posts, Saved and Tagged views of the same section. What fits?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Three separate Scaffolds with bottom navigation",
          "DefaultTabController(length: 3) with a TabBar of 3 tabs and a TabBarView of 3 pages",
          "A Drawer with 3 items",
          "Three FloatingActionButtons"
        ],
        "answer": 0,
        "explanation": "Tabs are for views of the same section, and swiping between them feels right; DefaultTabController length must equal the 3 tabs."
      },
      {
        "q": "An app grows to 8 sections. Why move the extra sections from bottom navigation into a drawer?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Drawers load faster",
          "Bottom navigation supports at most 5 items, so more labels shrink and become hard to tap",
          "Drawers do not need state",
          "Bottom navigation only works with 3 items"
        ],
        "answer": 1,
        "explanation": "Bottom navigation is capped at 5 items for accurate tapping; beyond that, the overflow sections belong in a drawer or inside the main sections."
      }
    ],
    "questions_hi": [
      {
        "q": "Screen par AppBar ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Saari screens ki list dikhana",
          "Network calls handle karna",
          "App theme store karna",
          "Upar ki patti jisme title aur action buttons hon"
        ],
        "answer": 3,
        "explanation": "AppBar wo top bar hai jise user sabse pehle dekh ke samajhta hai wo kahan hai, chhote title aur right me 1-2 action icons ke saath."
      },
      {
        "q": "Ek app me Home, Search aur Profile roz ki sections hain, aur Settings aur Help kabhi kabhi use hote hain. Kaunsa pattern sahi hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Roz ki sections ke liye bottom navigation, Settings aur Help ke liye Drawer",
          "Sab kuch ke liye Drawer",
          "Saari paanch sections ke liye bottom navigation",
          "Saari paanch ke liye TabBar"
        ],
        "answer": 0,
        "explanation": "Roz ki primary destinations visible bottom tabs me honi chahiye, jabki settings jaise secondary destinations drawer me, chhupe hue nahi."
      },
      {
        "q": "TabBar ko selected tab ka content dikhane ke liye TabBarView ke saath pair karna zaroori hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "TabBar sirf tabs ki row hai; TabBarView content dikhata hai, aur dono ko ek hi controller aur length share karni chahiye."
      },
      {
        "q": "FloatingActionButton screen par kahan baithta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Body ke centre me",
          "AppBar actions ke andar",
          "Bottom-right corner ke upar tairta hua",
          "Drawer header ke andar"
        ],
        "answer": 2,
        "explanation": "FAB screen ke bottom-right ke upar tairta hai, aur ye Scaffold.floatingActionButton me lagta hai, us screen ke ek sabse common action ke liye."
      },
      {
        "q": "Ek app ko 5 top-level sections chahiye jinme user baar baar switch karta hai. Kya choose karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "5 items wala BottomNavigationBar",
          "5 items wala Drawer",
          "5 FloatingActionButtons",
          "Sections ke liye 5 tabs wala TabBar"
        ],
        "answer": 0,
        "explanation": "Bottom navigation 2-5 baar switch hone wali top-level sections ke liye hai; 5 se zyada par labels chhote ho jaate hain aur tap karna mushkil ho jaata hai."
      },
      {
        "q": "Top bar, side menu aur bottom tabs wali screen ke liye sahi Scaffold structure chuno.",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Scaffold(appBar: AppBar(...), body: ..., bottomNavigationBar: ...)",
          "Scaffold(appBar: AppBar(...), drawer: Drawer(...), body: ..., bottomNavigationBar: ...)",
          "Scaffold(body: AppBar(...), drawer: Drawer(...))",
          "Scaffold(appBar: Drawer(...), body: BottomNavigationBar(...))"
        ],
        "answer": 1,
        "explanation": "Scaffold me naam wale slots hote hain: appBar upar, drawer side me, body me content, bottomNavigationBar neeche — jo chahiye wo bharo."
      },
      {
        "q": "App ki har screen ko ek Drawer chahiye.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Drawer sirf secondary destinations ke liye hai; kai screens ko drawer ki zaroorat hi nahi hoti, aur roz ki screens ko usme chhupane se wo milti nahi."
      },
      {
        "q": "TabBar aur TabBarView ke liye TabController ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Tab ka data fetch karna",
          "Tab row aur uske content ko sync me rakhna, length tabs ki sankhya ke barabar ho",
          "Tabs ko style dena",
          "Back button add karna"
        ],
        "answer": 1,
        "explanation": "Dono widgets ek controller share karte hain taaki tab par tap karne se sahi page dikhe; length ka mismatch, jaise 3 tabs par length 2, app ko crash kar dega."
      },
      {
        "q": "Ek hi section ke 3 views — Posts, Saved aur Tagged — wali profile screen ka structure banao. Kya sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Bottom navigation ke saath teen alag Scaffolds",
          "3 tabs wali TabBar aur 3 pages wali TabBarView ke saath DefaultTabController(length: 3)",
          "3 items wala Drawer",
          "Teen FloatingActionButtons"
        ],
        "answer": 0,
        "explanation": "Tabs ek hi section ke views ke liye hote hain, aur unme swipe karna natural lagta hai; DefaultTabController ki length 3 tabs ke barabar honi chahiye."
      },
      {
        "q": "App badh ke 8 sections ki ho jaaye to extra sections ko bottom navigation se drawer me kyon le jaayein?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Drawer fast load hota hai",
          "Bottom navigation zyada se zyada 5 items support karta hai, usse zyada par labels chhote ho ke tap karna mushkil ho jaata hai",
          "Drawer ko state nahi chahiye",
          "Bottom navigation sirf 3 items par kaam karta hai"
        ],
        "answer": 1,
        "explanation": "Bottom navigation accurate tapping ke liye 5 items par capped hai; usse zyada sections drawer me ya main sections ke andar honi chahiye."
      }
    ]
  },
  {
    "id": "quiz-08-navigation",
    "lessonId": "lesson-08-navigation",
    "title": "Quiz: Navigation & Routes",
    "questions_en": [
      {
        "q": "What is the difference between Navigator.push and Navigator.pop?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Push closes the app; pop opens a screen",
          "Push puts a new screen on top of the stack; pop removes the top screen",
          "Push deletes the stack; pop rebuilds it",
          "Push works only with named routes"
        ],
        "answer": 1,
        "explanation": "Screens live in a stack: push adds one on top, pop takes the top one off and returns to the screen below."
      },
      {
        "q": "How do you pass data forward to a new screen?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Through the new screen's constructor when you push it",
          "Through the AppBar title only",
          "By writing it to a file",
          "Through Navigator.pop"
        ],
        "answer": 0,
        "explanation": "Give the new screen a field like title and pass it in the push — for example DetailsScreen(title: 'Shoes') — so the screen arrives with its data."
      },
      {
        "q": "The AppBar back button pops the current route.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "The back button calls pop for you, removing the top screen and returning to the one below — you do not add it yourself."
      },
      {
        "q": "Why use named routes instead of building every screen inline?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "They make the app faster to install",
          "They remove the need for a stack",
          "One definition in MaterialApp(routes: ...) can be opened from many places with pushNamed",
          "They work without MaterialApp"
        ],
        "answer": 2,
        "explanation": "Named routes give each screen one name, like '/details', so many callers can open it with pushNamed without duplicating builder code."
      },
      {
        "q": "When is go_router worth learning, by the lesson's intro?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "For every single-screen app",
          "For apps that need deep links and web URLs, or route guards",
          "Only for iOS apps",
          "Only when named routes are banned"
        ],
        "answer": 1,
        "explanation": "go_router declares all routes as URL paths up front, so deep links and web URLs work naturally and a redirect can guard routes like '/login'."
      },
      {
        "q": "A details screen opens, but its title shows blank. The push looks like this: Navigator.push(context, MaterialPageRoute(builder: (context) => DetailsScreen())); What is the most likely cause?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The route name is wrong",
          "The data was never passed: DetailsScreen needs its title in the constructor",
          "PopScope is missing",
          "The AppBar is missing"
        ],
        "answer": 1,
        "explanation": "Data travels forward through the constructor, so pushing DetailsScreen() without its title means the screen has nothing to show — pass it at push time."
      },
      {
        "q": "PopScope replaces the deprecated WillPopScope for intercepting the back button.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "PopScope is the current widget for handling back, for example asking about unsaved changes, while WillPopScope is deprecated and should not be used."
      },
      {
        "q": "What is a deep link?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A link to a settings page inside the OS",
          "A link that opens your app directly on a specific screen, like a product page",
          "A link that closes the app",
          "A route with no name"
        ],
        "answer": 1,
        "explanation": "A deep link hands the OS a URL-like path, and the router opens the matching screen instead of just the home screen."
      },
      {
        "q": "Choose the route setup for a small multi-screen app with Home, Details and Settings, where many places open Details.",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A new MaterialPageRoute built inline in every button",
          "A drawer with no routes",
          "A named route table in MaterialApp(routes: ...) with '/details' and '/settings', opened by pushNamed",
          "A single screen with three Stacks"
        ],
        "answer": 2,
        "explanation": "When many places open the same screen, one named-route definition beats duplicated inline builders, and pushNamed keeps every caller short."
      },
      {
        "q": "When should you pop with a result, like Navigator.pop(context, result)?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "When opening the first screen",
          "When returning data to the screen that pushed this one, like an edited value",
          "When closing the whole app",
          "When pushing a replacement screen"
        ],
        "answer": 1,
        "explanation": "Pop with a result sends a value back, and the caller receives it with await Navigator.push(...) — that is how an edit screen returns its change."
      }
    ],
    "questions_hi": [
      {
        "q": "Navigator.push aur Navigator.pop me farak kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Push app band karta hai; pop screen kholta hai",
          "Push stack ke upar nayi screen rakhta hai; pop upar wali screen hata deta hai",
          "Push stack delete karta hai; pop use dobara banata hai",
          "Push sirf named routes par kaam karta hai"
        ],
        "answer": 1,
        "explanation": "Screens ek stack me rehti hain: push ek nayi screen upar rakhta hai, pop upar wali ko hata ke neeche wali par wapas le jaata hai."
      },
      {
        "q": "Nayi screen ko data aage kaise pass karte hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Push karte waqt nayi screen ke constructor se",
          "Sirf AppBar title se",
          "File me likh ke",
          "Navigator.pop se"
        ],
        "answer": 0,
        "explanation": "Nayi screen ko title jaisa field do aur push karte waqt pass karo — jaise DetailsScreen(title: 'Shoes') — taaki screen apne data ke saath aaye."
      },
      {
        "q": "AppBar ka back button current route ko pop karta hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Back button tumhare liye pop call kar deta hai, upar wali screen hata ke neeche wali par wapas le jaata hai — use khud add karne ki zaroorat nahi."
      },
      {
        "q": "Har screen ko inline banane ki bajay named routes kyon use karein?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Isse app install fast hoti hai",
          "Isse stack ki zaroorat khatam ho jaati hai",
          "MaterialApp(routes: ...) me ek definition kai jagah se pushNamed se khul sakti hai",
          "Ye MaterialApp ke bina kaam karte hain"
        ],
        "answer": 2,
        "explanation": "Named routes har screen ko ek naam dete hain, jaise '/details', isliye kai callers use pushNamed se khol sakte hain bina builder code duplicate kiye."
      },
      {
        "q": "Lesson ke intro ke hisaab se go_router kab seekhna worth hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Har single-screen app ke liye",
          "Jab app ko deep links aur web URLs chahiye hon, ya route guards",
          "Sirf iOS apps ke liye",
          "Sirf jab named routes banned hon"
        ],
        "answer": 1,
        "explanation": "go_router saare routes ko URL paths ki tarah pehle se declare karta hai, isliye deep links aur web URLs naturally kaam karte hain aur redirect '/login' jaise routes ko guard kar sakta hai."
      },
      {
        "q": "Details screen khul rahi hai, par uska title blank dikh raha hai. Push aisa hai: Navigator.push(context, MaterialPageRoute(builder: (context) => DetailsScreen())); Sabse likely cause kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Route ka naam galat hai",
          "Data kabhi pass hi nahi hua: DetailsScreen ko uska title constructor me chahiye",
          "PopScope missing hai",
          "AppBar missing hai"
        ],
        "answer": 1,
        "explanation": "Data aage constructor se jaata hai, isliye DetailsScreen() ko bina title ke push karne ka matlab screen ke paas dikhane ko kuch nahi hai — push karte waqt pass karo."
      },
      {
        "q": "Back button ko intercept karne ke liye PopScope, deprecated WillPopScope ki jagah leta hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "PopScope hi current widget hai back handle karne ke liye, jaise unsaved changes par poochhna, jabki WillPopScope deprecated hai aur use nahi karna chahiye."
      },
      {
        "q": "Deep link kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "OS ke andar settings page ka link",
          "Wo link jo tumhara app seedha kisi specific screen par khole, jaise product page",
          "Wo link jo app band kar de",
          "Bina naam wala route"
        ],
        "answer": 1,
        "explanation": "Deep link OS ko URL jaisa path deta hai, aur router home screen ki bajay matching screen khol deta hai."
      },
      {
        "q": "Home, Details aur Settings wali chhoti multi-screen app ke liye route setup chuno, jahan kai jagah se Details khulti hai.",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har button me inline banaya hua naya MaterialPageRoute",
          "Bina routes wala drawer",
          "MaterialApp(routes: ...) me '/details' aur '/settings' wali named route table, pushNamed se kholi jaaye",
          "Teen Stacks wali ek screen"
        ],
        "answer": 2,
        "explanation": "Jab kai jagah se wahi screen khulti hai, to ek named-route definition duplicate inline builders se behtar hai, aur pushNamed har caller ko chhota rakhta hai."
      },
      {
        "q": "Navigator.pop(context, result) jaise result ke saath pop kab karna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Pehli screen kholte waqt",
          "Jab us screen ko data wapas bhejna ho jisne ye screen push ki thi, jaise edited value",
          "Poora app band karte waqt",
          "Replacement screen push karte waqt"
        ],
        "answer": 1,
        "explanation": "Result ke saath pop value wapas bhejta hai, aur caller use await Navigator.push(...) se paata hai — isi tarah edit screen apna change wapas bhejti hai."
      }
    ]
  },
  {
    "id": "quiz-09-theming",
    "lessonId": "lesson-09-theming",
    "title": "Quiz: Theming Your App",
    "questions_en": [
      {
        "q": "What is ThemeData's job in an app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It fetches data from an API",
          "It stores the list of screens",
          "It holds the app's whole look — colours, fonts and button styles — in one object",
          "It manages navigation"
        ],
        "answer": 2,
        "explanation": "ThemeData is the single source of truth for style: set it once on MaterialApp and every widget below reads from it automatically."
      },
      {
        "q": "How do you offer both a light and a dark theme?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "By writing two apps",
          "By setting theme for light and darkTheme for dark, with themeMode choosing which is active",
          "By changing colours in every screen",
          "By using only dark colours"
        ],
        "answer": 1,
        "explanation": "MaterialApp takes both themes, and themeMode picks light, dark or system — build the dark one from the same seed with Brightness.dark."
      },
      {
        "q": "Image and font assets must be declared in pubspec.yaml before they will load.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Assets ship inside the app only when listed under flutter: assets: in pubspec.yaml; undeclared assets simply will not load."
      },
      {
        "q": "Where do you set the font family for the whole app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "In each Text widget",
          "In pubspec.yaml assets",
          "In the AppBar title",
          "In ThemeData's fontFamily or textTheme"
        ],
        "answer": 3,
        "explanation": "Fonts live in the theme: fontFamily sets the family app-wide, and TextTheme sets sizes per role like headline, body and label."
      },
      {
        "q": "One card on a screen needs a different background from the theme, but the rest must stay themed. What do you do?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Rewrite the whole ThemeData",
          "Override just that widget's style directly, leaving the theme for everything else",
          "Create a second app",
          "Delete the theme"
        ],
        "answer": 1,
        "explanation": "Overrides are for single exceptions: style that one widget directly, while the rest of the app keeps reading the central theme."
      },
      {
        "q": "A button's colour does not change when the theme changes, but every other widget follows the theme. What is the most likely cause?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The theme file is too big",
          "The button has a hard-coded colour instead of reading the theme",
          "The button is inside a Scaffold",
          "The app needs a restart"
        ],
        "answer": 1,
        "explanation": "A hard-coded colour ignores the theme, so it never updates; widgets that read the theme, like Theme.of(context).colorScheme.primary, follow it automatically."
      },
      {
        "q": "Theme.of(context) reads the current theme for the widget that calls it.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "That is its job: any widget can read colours, fonts and styles from the active theme through Theme.of(context)."
      },
      {
        "q": "A screen needs a home icon and the app's own logo image that ships inside the app. Which pair is correct?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Icon(Icons.home) and Image.asset('assets/images/logo.png')",
          "Image.network for both",
          "Text('home') and Icon(Icons.logo)",
          "Container for both"
        ],
        "answer": 0,
        "explanation": "Icons come from the Material set with Icon, while bundled images are assets shown with Image.asset; photos from the internet use Image.network instead."
      },
      {
        "q": "Build a consistent theme for a new app. Which plan follows the lesson?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Hard-code a colour in each screen as you go",
          "Pick one seed colour and one font pair, put both in a theme file with light and dark variants, and let screens read it",
          "Copy colours from Figma into every widget",
          "Use a different colour per screen"
        ],
        "answer": 1,
        "explanation": "One seed colour generates a matching palette, one font pair covers headings and body, and a theme file means rebranding edits one place, not fifty."
      },
      {
        "q": "Why does a central theme beat setting colours on each widget?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "It makes the app smaller to download",
          "It removes the need for widgets",
          "Changing one value updates every screen, so the app stays consistent and rebranding is one edit",
          "It makes colours brighter"
        ],
        "answer": 2,
        "explanation": "With no theme, rebranding means editing every screen; with a theme, one value changes everywhere, which keeps the look consistent."
      }
    ],
    "questions_hi": [
      {
        "q": "App me ThemeData ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "API se data fetch karna",
          "Screens ki list store karna",
          "App ka poora look — colours, fonts aur button styles — ek object me rakhna",
          "Navigation manage karna"
        ],
        "answer": 2,
        "explanation": "ThemeData style ka ek source of truth hai: use ek baar MaterialApp par set karo aur neeche ke saare widgets usse automatically padhte hain."
      },
      {
        "q": "Light aur dark theme dono kaise offer karte hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Do apps bana ke",
          "theme light ke liye aur darkTheme dark ke liye set karke, themeMode se choose karke kaunsi active hai",
          "Har screen me colours badal ke",
          "Sirf dark colours use karke"
        ],
        "answer": 1,
        "explanation": "MaterialApp dono themes leta hai, aur themeMode light, dark ya system choose karta hai — dark theme ko wahi seed se Brightness.dark ke saath banao."
      },
      {
        "q": "Image aur font assets load hone se pehle pubspec.yaml me declare karne zaroori hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Assets app ke andar sirf tab aate hain jab pubspec.yaml me flutter: assets: ke neeche list hon; undeclared assets load hi nahi honge."
      },
      {
        "q": "Poori app ke liye font family kahan set karte hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Har Text widget me",
          "pubspec.yaml assets me",
          "AppBar title me",
          "ThemeData ke fontFamily ya textTheme me"
        ],
        "answer": 3,
        "explanation": "Fonts theme me rehte hain: fontFamily poori app ke liye family set karta hai, aur TextTheme headline, body aur label jaise roles ke liye size set karta hai."
      },
      {
        "q": "Ek screen par ek card ko theme se alag background chahiye, par baaki sab themed rehna chahiye. Kya karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Poora ThemeData dobara likh do",
          "Sirf us widget ki style directly override kar do, baaki sab theme se hi rahe",
          "Doosra app bana do",
          "Theme delete kar do"
        ],
        "answer": 1,
        "explanation": "Override sirf ek exception ke liye hota hai: us ek widget ko directly style karo, jabki baaki app central theme ko hi padhti rahe."
      },
      {
        "q": "Theme badalne par ek button ka colour nahi badalta, par baaki saare widgets theme ko follow karte hain. Sabse likely cause kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Theme file bahut badi hai",
          "Button par hard-coded colour hai, theme se padha nahi ja raha",
          "Button Scaffold ke andar hai",
          "App ko restart chahiye"
        ],
        "answer": 1,
        "explanation": "Hard-coded colour theme ko ignore karta hai, isliye wo kabhi update nahi hota; jo widgets theme padhte hain, jaise Theme.of(context).colorScheme.primary, wo automatically follow karte hain."
      },
      {
        "q": "Theme.of(context) us widget ke liye current theme padhta hai jo use call karta hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Yehi uska kaam hai: koi bhi widget Theme.of(context) se active theme ke colours, fonts aur styles padh sakta hai."
      },
      {
        "q": "Ek screen ko home icon aur app ka apna logo image chahiye jo app ke andar ship hota hai. Kaunsa pair sahi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Icon(Icons.home) aur Image.asset('assets/images/logo.png')",
          "Dono ke liye Image.network",
          "Text('home') aur Icon(Icons.logo)",
          "Dono ke liye Container"
        ],
        "answer": 0,
        "explanation": "Icons Material set se Icon se aate hain, jabki bundled images assets hain jo Image.asset se dikhti hain; internet ki photos ke liye Image.network use hota hai."
      },
      {
        "q": "Nayi app ke liye consistent theme banao. Lesson ke hisaab se kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har screen me jaate jaate colour hard-code karo",
          "Ek seed colour aur ek font pair chuno, dono ko light aur dark variants ke saath theme file me rakho, aur screens use wahin se padhein",
          "Figma se colours copy karke har widget me daalo",
          "Har screen par alag colour use karo"
        ],
        "answer": 1,
        "explanation": "Ek seed colour se matching palette ban jaati hai, ek font pair headings aur body cover kar leta hai, aur theme file ka matlab hai rebranding ek jagah edit hogi, pachaas jagah nahi."
      },
      {
        "q": "Central theme har widget par colours set karne se behtar kyon hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Isse app download me chhoti ho jaati hai",
          "Isse widgets ki zaroorat khatam ho jaati hai",
          "Ek value badalne se har screen update ho jaati hai, isliye app consistent rehta hai aur rebranding ek edit hai",
          "Isse colours bright ho jaate hain"
        ],
        "answer": 2,
        "explanation": "Bina theme ke rebranding ka matlab hai har screen edit karna; theme ke saath ek value har jagah badal jaati hai, jo look ko consistent rakhta hai."
      }
    ]
  },
  {
    "id": "quiz-10-figma",
    "lessonId": "lesson-10-figma",
    "title": "Quiz: Design to Code: Figma Basics",
    "questions_en": [
      {
        "q": "In Figma, how do you read the spacing between an element and its neighbours?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "By guessing from the screenshot",
          "From the red measurement lines, or the element's position values",
          "From the file name",
          "From the widget tree in Flutter"
        ],
        "answer": 0,
        "explanation": "Selecting an element shows red measurement lines to its neighbours, and its position values — note the gaps, like 8, 16 or 24, because they repeat across the design."
      },
      {
        "q": "A design uses one blue for buttons, headings and links. How should that colour reach your Flutter code?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Copy its hex code into every widget",
          "Take a screenshot of it",
          "Collect it once as a theme colour token and use the theme everywhere",
          "Hard-code it only in the AppBar"
        ],
        "answer": 2,
        "explanation": "Collecting the 4-6 colours the design actually uses into a theme means one change updates every button and heading, instead of editing each widget."
      },
      {
        "q": "Pixel-perfect copying of a Figma design on every device is a realistic goal.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Phones differ in size, font scaling and safe areas, so exact pixels are impossible — aim for faithful, not identical: same structure, same spacing rhythm, same colours."
      },
      {
        "q": "A horizontal Auto Layout group in Figma usually maps to which Flutter widget?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Column",
          "Stack",
          "ListView",
          "Row"
        ],
        "answer": 3,
        "explanation": "Horizontal groups flow left to right, which is a Row; vertical groups become Columns, text layers become Text, and rounded rectangles become Containers."
      },
      {
        "q": "A Figma card has a thumbnail on the left and a title above a price on the right. Which widget maps to the card?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A single Text widget",
          "A Row holding the image and a Column of title and price",
          "A Stack of two buttons",
          "A Scaffold with no body"
        ],
        "answer": 1,
        "explanation": "Map top-down: the card's left-to-right shape is a Row, and the title-over-price pair inside it stacks vertically, so it is a Column."
      },
      {
        "q": "Estimate the widgets for this Figma screen: a header row with a back icon and title, a profile card with avatar, name and bio, and a full-width button. What is the best top-down estimate?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Scaffold > Column > [Row, Card-like Container with a Row inside, ElevatedButton]",
          "One Stack holding everything",
          "Three separate Scaffolds",
          "A single Container with one Text"
        ],
        "answer": 0,
        "explanation": "Work outside in: the screen frame is a Scaffold, its sections stack in a Column, and each section maps to the Row or card it visibly is."
      },
      {
        "q": "A Figma file is the same thing as Flutter code.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Figma is a design, not code: you read its layers, spacing, colours and type, then build matching widgets yourself — the file never runs as an app."
      },
      {
        "q": "A Figma text layer is 28px bold for headings and 16px regular for body. How does that map to Flutter?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Both become TextStyle(fontSize: 16)",
          "Headings and body become separate hard-coded sizes in every screen",
          "headlineLarge in TextTheme for headings and bodyMedium for body text",
          "Headings become icons"
        ],
        "answer": 2,
        "explanation": "Type roles belong in the theme's TextTheme, so every heading shares one size and weight and every body line shares another."
      },
      {
        "q": "Convert this Figma row to Flutter: an icon, then a name, then a trailing arrow, all on one horizontal line. What fits?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Column(children: [Icon, Text, Icon])",
          "Stack(children: [Icon, Text, Icon])",
          "ListView(children: [Icon, Text, Icon])",
          "Row(children: [Icon, Text, Spacer(), Icon])"
        ],
        "answer": 3,
        "explanation": "A horizontal line of elements is a Row, and the Spacer pushes the trailing arrow to the far end, matching the design's left-right spread."
      },
      {
        "q": "What is the most common Figma-to-code mistake in this lesson?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Using too few widgets",
          "Spending an hour nudging a widget by 1-2 pixels instead of fixing structure and spacing first",
          "Reading the Layers panel",
          "Writing a spec list first"
        ],
        "answer": 1,
        "explanation": "A 2-pixel difference nobody notices is wasted time; structure and spacing first, pixel polish last — and only if time remains."
      }
    ],
    "questions_hi": [
      {
        "q": "Figma me kisi element aur uske neighbours ke beech ki spacing kaise padhte hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Screenshot dekh ke guess karke",
          "Red measurement lines se, ya element ki position values se",
          "File ke naam se",
          "Flutter ke widget tree se"
        ],
        "answer": 0,
        "explanation": "Element select karne par uske neighbours tak red measurement lines dikhti hain, aur position values bhi — gaps note karo, jaise 8, 16 ya 24, kyunki ye poore design me repeat hote hain."
      },
      {
        "q": "Ek design me buttons, headings aur links ke liye ek hi blue use hota hai. Wo colour Flutter code tak kaise pahunche?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Uska hex code har widget me copy karke",
          "Uska screenshot le ke",
          "Use ek baar theme colour token bana ke, aur har jagah theme use karke",
          "Sirf AppBar me hard-code karke"
        ],
        "answer": 2,
        "explanation": "Design me actually use hone wale 4-6 colours ko theme me collect karne ka matlab hai ek change se har button aur heading update ho jaayega, har widget edit karne ki bajay."
      },
      {
        "q": "Har device par Figma design ki pixel-perfect copy ek realistic goal hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Phones size, font scaling aur safe areas me alag hote hain, isliye exact pixels impossible hain — faithful bano, identical nahi: wahi structure, wahi spacing rhythm, wahi colours."
      },
      {
        "q": "Figma ka horizontal Auto Layout group aksar kaunse Flutter widget me map hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Column",
          "Stack",
          "ListView",
          "Row"
        ],
        "answer": 3,
        "explanation": "Horizontal groups left se right behte hain, jo Row hai; vertical groups Columns bante hain, text layers Text bante hain, aur rounded rectangles Containers bante hain."
      },
      {
        "q": "Ek Figma card me left me thumbnail hai aur right me title ke upar price hai. Card kaunsa widget banega?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ek Text widget",
          "Image aur title-price wale Column ko hold karta hua Row",
          "Do buttons ka Stack",
          "Bina body wala Scaffold"
        ],
        "answer": 1,
        "explanation": "Top-down map karo: card ki left-to-right shape Row hai, aur uske andar title-over-price vertically stack hota hai, isliye wo Column hai."
      },
      {
        "q": "Is Figma screen ke widgets estimate karo: back icon aur title wali header row, avatar, naam aur bio wala profile card, aur full-width button. Sabse achha top-down estimate kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Scaffold > Column > [Row, Row ke andar Card jaisa Container, ElevatedButton]",
          "Sab kuch hold karta hua ek Stack",
          "Teen alag Scaffolds",
          "Ek Text wala ek Container"
        ],
        "answer": 0,
        "explanation": "Bahar se andar kaam karo: screen ka frame Scaffold hai, uske sections Column me stack hote hain, aur har section us Row ya card me map hota hai jo wo dikhta hai."
      },
      {
        "q": "Ek Figma file, Flutter code ke barabar hi hoti hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Figma ek design hai, code nahi: tum uski layers, spacing, colours aur type padhte ho, phir matching widgets khud banate ho — file kabhi app ki tarah run nahi hoti."
      },
      {
        "q": "Figma ka text layer headings ke liye 28px bold hai aur body ke liye 16px regular. Ye Flutter me kaise map hoga?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Dono TextStyle(fontSize: 16) ban jayenge",
          "Headings aur body har screen me alag hard-coded sizes ban jayenge",
          "Headings ke liye TextTheme me headlineLarge aur body text ke liye bodyMedium",
          "Headings icons ban jayenge"
        ],
        "answer": 2,
        "explanation": "Type roles theme ke TextTheme me rehte hain, isliye har heading ek hi size aur weight share karti hai aur har body line doosri."
      },
      {
        "q": "Is Figma row ko Flutter me convert karo: ek icon, phir naam, phir trailing arrow, sab ek horizontal line par. Kya sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Column(children: [Icon, Text, Icon])",
          "Stack(children: [Icon, Text, Icon])",
          "ListView(children: [Icon, Text, Icon])",
          "Row(children: [Icon, Text, Spacer(), Icon])"
        ],
        "answer": 3,
        "explanation": "Elements ki horizontal line Row hoti hai, aur Spacer trailing arrow ko far end tak dhakel deta hai, jo design ke left-right spread se match karta hai."
      },
      {
        "q": "Is lesson ke hisaab se Figma-to-code ki sabse common galti kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Bahut kam widgets use karna",
          "Structure aur spacing pehle fix karne ki bajay ek widget ko 1-2 pixels ke liye ek ghanta nudge karna",
          "Layers panel padhna",
          "Pehle spec list likhna"
        ],
        "answer": 1,
        "explanation": "2-pixel ka farak jo koi notice nahi karta, wo waste time hai; pehle structure aur spacing, pixel polish aakhir me — aur sirf tab jab time bache."
      }
    ]
  },
  {
    "id": "quiz-11-lists-grids",
    "lessonId": "lesson-11-lists-grids",
    "title": "Quiz: Lists & Grids",
    "questions_en": [
      {
        "q": "A settings page has 6 fixed rows. Why is ListView a better fit than a plain Column for it?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "ListView needs no children",
          "ListView is scrollable, so the rows can scroll if they do not fit the screen",
          "Column cannot hold ListTiles",
          "ListView uses less code for one row"
        ],
        "answer": 1,
        "explanation": "A Column does not scroll, so rows that overflow the screen break; ListView is a scrollable column that handles that automatically."
      },
      {
        "q": "What is the benefit of ListView.builder over a plain ListView with children?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It builds only the rows on screen, on demand",
          "It needs no itemCount",
          "It shows rows in a grid",
          "It adds pull-to-refresh automatically"
        ],
        "answer": 0,
        "explanation": "The builder creates rows only when they appear and discards old ones, so a data list of any size costs about as much as the visible rows."
      },
      {
        "q": "GridView is the widget for showing items in a grid of rows and columns.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "That is GridView's job — photo galleries and shop catalogues — controlled by a delegate like SliverGridDelegateWithFixedCrossAxisCount."
      },
      {
        "q": "What does ListView.separated add between items?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A separator, usually a Divider, between every two items",
          "A header above the list",
          "A footer below the list",
          "An extra item at the end"
        ],
        "answer": 0,
        "explanation": "separatorBuilder runs between every two items, so a Divider gives each row a visual boundary without adding one after the last row."
      },
      {
        "q": "What is itemBuilder's job in ListView.builder?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "It counts the total items",
          "It adds the scrollbar",
          "It builds the widget for row number index, reading items[index]",
          "It sorts the data"
        ],
        "answer": 2,
        "explanation": "itemBuilder is a function that receives an index and returns that row's widget, which is how data turns into visible rows on demand."
      },
      {
        "q": "A ListView inside a Column shows nothing and throws a layout error. What is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Wrap the ListView in Expanded so it gets a bounded height",
          "Wrap the Column in a Text widget",
          "Remove itemCount",
          "Add more items to the list"
        ],
        "answer": 0,
        "explanation": "The list wants infinite height and the Column cannot give it, so Expanded gives the list the leftover height it needs to lay out."
      },
      {
        "q": "ListView.builder builds every item at once, even ones off screen.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "That is the plain ListView behaviour; the builder builds only visible rows on demand and discards rows that scroll away."
      },
      {
        "q": "Which widget adds pull-to-refresh to a list?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Divider",
          "GridView",
          "Scaffold",
          "RefreshIndicator"
        ],
        "answer": 3,
        "explanation": "Wrap the ListView in RefreshIndicator: dragging down shows a spinner and calls your refresh function, which returns a Future."
      },
      {
        "q": "A photo gallery screen shows hundreds of photos from data. Should it be a list or a grid, and with what?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A plain ListView with children",
          "A GridView.builder with a 2-column delegate",
          "A Column of Images",
          "A SingleChildScrollView of Rows"
        ],
        "answer": 1,
        "explanation": "Photos belong in a grid, and data-driven hundreds of items need the lazy builder, with a delegate setting the column count and aspect ratio."
      },
      {
        "q": "What is the first performance rule for a very large list?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Use a plain ListView with all children",
          "Use a builder so only visible rows exist, and keep row widgets cheap with const where parts are fixed",
          "Load all data at once",
          "Avoid keys entirely"
        ],
        "answer": 1,
        "explanation": "Builders are the first win because 10,000 items then cost about as much as 10 visible rows; cheap rows and const parts keep scrolling smooth."
      }
    ],
    "questions_hi": [
      {
        "q": "Ek settings page me 6 fixed rows hain. Uske liye plain Column ki bajay ListView kyon behtar hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "ListView ko children nahi chahiye",
          "ListView scrollable hai, isliye rows screen par fit na hon to scroll kar sakti hain",
          "Column ListTiles hold nahi kar sakta",
          "Ek row ke liye ListView kam code leta hai"
        ],
        "answer": 1,
        "explanation": "Column scroll nahi karta, isliye screen se zyada rows overflow karke toot jaati hain; ListView ek scrollable column hai jo ye automatically handle karta hai."
      },
      {
        "q": "Plain ListView (children wali) ki bajay ListView.builder ka fayda kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye sirf screen par dikhne wali rows on demand banata hai",
          "Ise itemCount nahi chahiye",
          "Ye rows ko grid me dikhata hai",
          "Ye pull-to-refresh automatically add kar deta hai"
        ],
        "answer": 0,
        "explanation": "Builder rows sirf tab banata hai jab wo dikhein, aur purani rows discard kar deta hai, isliye kisi bhi size ki data list lagbhag visible rows jitni hi costly hoti hai."
      },
      {
        "q": "GridView rows aur columns wali grid me items dikhane ka widget hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Yehi GridView ka kaam hai — photo galleries aur shop catalogues — jo SliverGridDelegateWithFixedCrossAxisCount jaise delegate se control hota hai."
      },
      {
        "q": "ListView.separated items ke beech me kya add karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Har do items ke beech ek separator, aksar ek Divider",
          "List ke upar ek header",
          "List ke neeche ek footer",
          "Aakhir me ek extra item"
        ],
        "answer": 0,
        "explanation": "separatorBuilder har do items ke beech chalta hai, isliye Divider har row ko visual boundary deta hai bina aakhri row ke baad ek extra line ke."
      },
      {
        "q": "ListView.builder me itemBuilder ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Total items ginna",
          "Scrollbar add karna",
          "Row number index ka widget banana, items[index] padh ke",
          "Data ko sort karna"
        ],
        "answer": 2,
        "explanation": "itemBuilder ek function hai jo index leta hai aur us row ka widget return karta hai — isi tarah data on demand visible rows me badalta hai."
      },
      {
        "q": "Column ke andar ListView kuch dikhata nahi aur layout error deta hai. Fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "ListView ko Expanded me wrap karo taaki use bounded height mile",
          "Column ko Text widget me wrap karo",
          "itemCount hata do",
          "List me aur items add karo"
        ],
        "answer": 0,
        "explanation": "List ko infinite height chahiye aur Column de nahi sakta, isliye Expanded list ko bachi hui height de deta hai jo use layout ke liye chahiye."
      },
      {
        "q": "ListView.builder saare items ek saath bana deta hai, off screen wale bhi.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ye plain ListView ka behaviour hai; builder sirf visible rows on demand banata hai aur scroll hoke gayi rows ko discard kar deta hai."
      },
      {
        "q": "List par pull-to-refresh kaunsa widget add karta hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Divider",
          "GridView",
          "Scaffold",
          "RefreshIndicator"
        ],
        "answer": 3,
        "explanation": "ListView ko RefreshIndicator me wrap karo: neeche drag karne par spinner dikhta hai aur tumhara refresh function call hota hai, jo ek Future return karta hai."
      },
      {
        "q": "Ek photo gallery screen me data se sau photos dikhane hain. List ya grid, aur kiske saath?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Children wali plain ListView",
          "2-column delegate ke saath GridView.builder",
          "Images wala Column",
          "Rows wala SingleChildScrollView"
        ],
        "answer": 1,
        "explanation": "Photos grid me belong karti hain, aur data se aane wale sau items ke liye lazy builder chahiye, jisme delegate column count aur aspect ratio set kare."
      },
      {
        "q": "Bahut badi list ke liye pehla performance rule kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Saare children wali plain ListView use karo",
          "Builder use karo taaki sirf visible rows exist karein, aur row widgets ko cheap rakho, fixed parts par const ke saath",
          "Saara data ek saath load karo",
          "Keys se poori tarah bacho"
        ],
        "answer": 1,
        "explanation": "Builders pehla win hain kyunki 10,000 items tab lagbhag 10 visible rows jitne costly hote hain; cheap rows aur const parts scrolling ko smooth rakhte hain."
      }
    ]
  },
  {
    "id": "quiz-12-forms",
    "lessonId": "lesson-12-forms",
    "title": "Quiz: Forms & User Input",
    "questions_en": [
      {
        "q": "When should you use a TextField instead of a Text widget?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "When the text never changes",
          "When the user needs to type something in",
          "When the text is a heading",
          "When the text is inside a ListView"
        ],
        "answer": 1,
        "explanation": "Text only displays words, while TextField is the input box the user types into, with a label, hint and keyboard control."
      },
      {
        "q": "What does a TextEditingController do for a field?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It styles the field's border",
          "It validates the input",
          "It submits the form",
          "It holds the field's text, readable anytime with controller.text"
        ],
        "answer": 3,
        "explanation": "Attach the controller to the field and read controller.text whenever you need the value — one controller per field, created as a State field."
      },
      {
        "q": "Form validation runs when the form is submitted, not on every keystroke.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Validate on submit: erroring while the user is still typing feels like being scolded mid-sentence, so checks run when they press submit."
      },
      {
        "q": "What is the GlobalKey<FormState>'s job for a Form?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It styles the form",
          "It lets the submit button reach into the Form and call validate() on all its fields at once",
          "It holds the field text",
          "It moves focus to the next field"
        ],
        "answer": 1,
        "explanation": "The key gives the button access to the FormState, so _formKey.currentState!.validate() runs every field's validator and returns true only if all pass."
      },
      {
        "q": "What must a validator function return for a good value?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "An error string",
          "False",
          "null, meaning valid; an error string means invalid",
          "An empty Text widget"
        ],
        "answer": 2,
        "explanation": "The rule is simple: return an error string if the value is bad, or null if it is good — null is how the Form knows the field passed."
      },
      {
        "q": "A login button reads the email controller, but the text is always empty even though the user typed. What is the most likely cause?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The controller was never attached to the TextField with controller: myController",
          "The keyboard type is wrong",
          "The Form has no key",
          "The button is inside a Column"
        ],
        "answer": 0,
        "explanation": "A controller only holds text when attached: without controller: on the field, it stays empty no matter what the user types."
      },
      {
        "q": "Focus automatically moves to the next field when the user finishes typing in one.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Focus only moves when you move it — with textInputAction: TextInputAction.next and FocusScope.of(context).nextFocus(), or by tapping the next field."
      },
      {
        "q": "A field asks for a phone number. Which keyboard type should it use?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "TextInputType.emailAddress",
          "TextInputType.visiblePassword",
          "TextInputType.number",
          "TextInputType.multiline"
        ],
        "answer": 2,
        "explanation": "keyboardType picks the right keyboard: number for numbers, emailAddress for email, visiblePassword for passwords with obscureText."
      },
      {
        "q": "Build a login-form validation flow: email + password fields and a submit button. Which flow is correct?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Read the controllers on every keystroke and show errors immediately",
          "Put both fields in a Form with a GlobalKey, give each a validator, and call _formKey.currentState!.validate() on submit",
          "Validate only the email field",
          "Show a SnackBar before checking anything"
        ],
        "answer": 1,
        "explanation": "The Form groups the fields so one validate() call checks both validators at once, and error messages appear automatically only where a field fails."
      },
      {
        "q": "How should a field error message be shown and worded?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "In red with no explanation, above the form",
          "As an instruction under the field, like 'Enter a valid email', one error per field at a time",
          "As a popup blocking the screen",
          "Only after three failed submits"
        ],
        "answer": 0,
        "explanation": "Errors appear automatically under the field when the validator returns a string, so word them as what to do — 'Enter a valid email' beats 'Invalid input'."
      }
    ],
    "questions_hi": [
      {
        "q": "Text widget ki bajay TextField kab use karna chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Jab text kabhi nahi badalta",
          "Jab user ko kuch type karna ho",
          "Jab text ek heading ho",
          "Jab text ListView ke andar ho"
        ],
        "answer": 1,
        "explanation": "Text sirf words display karta hai, jabki TextField wo input box hai jisme user type karta hai, label, hint aur keyboard control ke saath."
      },
      {
        "q": "Ek field ke liye TextEditingController kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Field ka border style karta hai",
          "Input ko validate karta hai",
          "Form ko submit karta hai",
          "Field ka text hold karta hai, controller.text se kabhi bhi padha ja sakta hai"
        ],
        "answer": 3,
        "explanation": "Controller ko field se attach karo aur jab value chahiye ho to controller.text padho — har field ke liye ek controller, State field bana ke."
      },
      {
        "q": "Form validation submit par run hoti hai, har keystroke par nahi.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Submit par validate karo: user ke type karte waqt error dikhana aise lagta hai jaise beech sentence me daant pad rahi ho, isliye checks submit press par chalte hain."
      },
      {
        "q": "Form ke liye GlobalKey<FormState> ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Form ko style karna",
          "Submit button ko Form ke andar pahunch ke saare fields par ek saath validate() call karne dena",
          "Field ka text hold karna",
          "Focus ko next field par le jaana"
        ],
        "answer": 1,
        "explanation": "Key button ko FormState tak access deti hai, isliye _formKey.currentState!.validate() har field ka validator chalata hai aur sirf tab true return karta hai jab sab pass hon."
      },
      {
        "q": "Achhi value ke liye validator function ko kya return karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ek error string",
          "False",
          "null, matlab valid; error string ka matlab invalid",
          "Ek khaali Text widget"
        ],
        "answer": 2,
        "explanation": "Rule simple hai: value kharab ho to error string return karo, achhi ho to null — null se hi Form jaanta hai field pass ho gaya."
      },
      {
        "q": "Login button email controller padhta hai, par text hamesha khaali milta hai jabki user ne type kiya tha. Sabse likely cause kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Controller kabhi TextField se controller: myController se attach hi nahi hua",
          "Keyboard type galat hai",
          "Form ki key nahi hai",
          "Button Column ke andar hai"
        ],
        "answer": 0,
        "explanation": "Controller tabhi text hold karta hai jab attach ho: field par controller: lagaye bina wo khaali hi rahega, user kuch bhi type kare."
      },
      {
        "q": "Ek field me type khatam karte hi focus automatically next field par chala jaata hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Focus tabhi move hota hai jab tum use move karo — textInputAction: TextInputAction.next aur FocusScope.of(context).nextFocus() se, ya next field par tap karke."
      },
      {
        "q": "Ek field phone number maangta hai. Kaunsa keyboard type use karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "TextInputType.emailAddress",
          "TextInputType.visiblePassword",
          "TextInputType.number",
          "TextInputType.multiline"
        ],
        "answer": 2,
        "explanation": "keyboardType sahi keyboard choose karta hai: numbers ke liye number, email ke liye emailAddress, passwords ke liye visiblePassword ke saath obscureText."
      },
      {
        "q": "Login-form validation flow banao: email + password fields aur submit button. Kaunsa flow sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har keystroke par controllers padho aur turant errors dikhao",
          "Dono fields ko GlobalKey wale Form me rakho, har ek ko validator do, aur submit par _formKey.currentState!.validate() call karo",
          "Sirf email field validate karo",
          "Kuch check karne se pehle SnackBar dikhao"
        ],
        "answer": 1,
        "explanation": "Form fields ko group karta hai taaki ek validate() call dono validators ko ek saath check kare, aur error messages automatically sirf wahan dikhein jahan field fail ho."
      },
      {
        "q": "Field ka error message kaise dikhana aur likhna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Bina explanation ke red me, form ke upar",
          "Field ke neeche instruction ki tarah, jaise 'Enter a valid email', ek waqt me ek field par ek error",
          "Screen block karne wale popup ki tarah",
          "Sirf teen failed submits ke baad"
        ],
        "answer": 0,
        "explanation": "Validator string return kare to errors automatically field ke neeche dikhte hain, isliye unko karne wali baat ki tarah likho — 'Enter a valid email', 'Invalid input' se behtar hai."
      }
    ]
  },
  {
    "id": "quiz-13-state",
    "lessonId": "lesson-13-state",
    "title": "Quiz: State & Interactivity",
    "questions_en": [
      {
        "q": "A screen shows a number that must increase when a button is tapped. Which widget should hold that number?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A StatelessWidget, stored in a final field",
          "A StatefulWidget, stored in its State object",
          "A plain Container widget",
          "A Text widget on its own"
        ],
        "answer": 1,
        "explanation": "Only a State object holds data that changes and survives rebuilds; a StatelessWidget's fields are final, so it cannot hold a changing number."
      },
      {
        "q": "What is the job of setState()?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It saves the value to disk",
          "It deletes the State object",
          "It marks the widget as dirty so Flutter calls build() again",
          "It creates a new screen"
        ],
        "answer": 2,
        "explanation": "Changing a value alone changes nothing on screen; setState tells Flutter to rebuild so the new value is drawn."
      },
      {
        "q": "Calling setState() rebuilds the whole app.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "setState only marks that widget dirty; Flutter compares the old and new trees, so only the parts depending on the changed value update on screen."
      },
      {
        "q": "A counter is used by only one button widget and nothing else. Where should its state live?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "In a global variable",
          "Always at the very top of the app",
          "Inside the build() method",
          "In that button widget's own State"
        ],
        "answer": 3,
        "explanation": "State belongs in the lowest widget that needs it; lifting it higher than needed causes extra rebuilds for no benefit."
      },
      {
        "q": "You tap the + button in the counter app. What happens, in order?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Tap → setState changes _count → build() runs again → the screen shows the new number",
          "Tap → build() runs → setState changes _count → the screen updates",
          "Tap → a new State object is created → _count resets to 0",
          "Tap → the widget is deleted and rebuilt from scratch"
        ],
        "answer": 0,
        "explanation": "The tap runs setState, which changes the value and schedules a rebuild; build() then reads the new value, which is why the screen shows the next number."
      },
      {
        "q": "This counter never updates on screen, even though the button works:\n\nvoid _increment() { _count++; }\n\nWhat is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Move _count inside build()",
          "Change the widget to a StatelessWidget",
          "Wrap the change in setState: setState(() { _count++; })",
          "Call build() directly from the button"
        ],
        "answer": 2,
        "explanation": "The value changes in memory but Flutter was never told to redraw; wrapping the change in setState schedules the rebuild that shows the new number."
      },
      {
        "q": "build() is called only once, when the widget is first created.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "build() runs again after every setState; that repeated build is exactly how the screen shows new values."
      },
      {
        "q": "Where should you create something like a TextField controller, or set a State object's starting value?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Inside another widget's build() method",
          "Inside main() after runApp()",
          "In the State object, as a field or in initState()",
          "Inside build(), so it is fresh each time"
        ],
        "answer": 2,
        "explanation": "initState runs once, but build() runs on every rebuild; creating a controller in build() recreates it each time, so typed text vanishes."
      },
      {
        "q": "A counter value is shown in a display widget and changed by a separate + button widget, both on the same page. Where should the state live?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Inside the display widget only",
          "Inside the button widget only",
          "In a new screen's State object",
          "In their nearest common parent, passed down to both"
        ],
        "answer": 3,
        "explanation": "Both widgets need the same value, so the smallest place covering both is their common parent; state kept too low cannot be shared."
      },
      {
        "q": "Why must you never call setState() inside build()?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Because build() cannot read state values",
          "Because it deletes the State object",
          "Because it makes the app slightly slower",
          "Because setState triggers another build, so build() would call setState forever in a loop"
        ],
        "answer": 3,
        "explanation": "setState schedules a rebuild and build() is the rebuild; calling one from the other loops endlessly instead of drawing the screen once."
      }
    ],
    "questions_hi": [
      {
        "q": "Ek screen par ek number hai jo button tap karne par badhna chahiye. Ye number kis widget ke paas hona chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek StatelessWidget, final field me rakha hua",
          "Ek StatefulWidget, uske State object me rakha hua",
          "Ek plain Container widget",
          "Akela ek Text widget"
        ],
        "answer": 1,
        "explanation": "Badalta hua data sirf State object sambhal sakta hai aur rebuilds me zinda rehta hai; StatelessWidget ke fields final hote hain, isliye wo badalta number nahi rakh sakta."
      },
      {
        "q": "setState() ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Value ko disk par save karna",
          "State object ko delete karna",
          "Widget ko dirty mark karna taaki Flutter build() dobara chalaye",
          "Ek nayi screen banana"
        ],
        "answer": 2,
        "explanation": "Sirf value badalne se screen par kuch nahi badalta; setState Flutter ko rebuild karne ke liye batata hai, tabhi nayi value dikhti hai."
      },
      {
        "q": "setState() call karne se poori app rebuild hoti hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "setState sirf us widget ko dirty mark karta hai; Flutter purani aur nayi tree compare karta hai, isliye screen par sirf wahi hisse update hote hain jo badli value par depend karte hain."
      },
      {
        "q": "Ek counter sirf ek button widget use karta hai, aur koi nahi. Uski state kahan rehni chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek global variable me",
          "Hamesha app ke bilkul top par",
          "build() method ke andar",
          "Usi button widget ke apne State me"
        ],
        "answer": 3,
        "explanation": "State sabse neeche wale widget me rehni chahiye jisko uski zaroorat hai; use zyada upar rakhne se bekaar me zyada rebuild hoga."
      },
      {
        "q": "Counter app me + button tap karte ho. Sahi order me kya hota hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Tap → setState _count badalta hai → build() dobara chalta hai → screen par naya number dikhta hai",
          "Tap → build() chalta hai → setState _count badalta hai → screen update hoti hai",
          "Tap → naya State object banta hai → _count 0 par reset ho jaata hai",
          "Tap → widget delete ho kar scratch se dobara banta hai"
        ],
        "answer": 0,
        "explanation": "Tap par setState chalta hai, jo value badal kar rebuild schedule karta hai; phir build() nayi value padh ke dikhata hai, isliye screen par agla number aata hai."
      },
      {
        "q": "Ye counter screen par kabhi update nahi hota, jabki button kaam karta hai:\n\nvoid _increment() { _count++; }\n\nFix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "_count ko build() ke andar le jao",
          "Widget ko StatelessWidget bana do",
          "Change ko setState me lapeto: setState(() { _count++; })",
          "Button se seedha build() call karo"
        ],
        "answer": 2,
        "explanation": "Value memory me badal gayi par Flutter ko redraw karne ke liye bataya hi nahi gaya; setState me lapetne se wo rebuild schedule hota hai jo naya number dikhata hai."
      },
      {
        "q": "build() sirf ek baar chalta hai, jab widget pehli baar banta hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Har setState ke baad build() dobara chalta hai; ye dobara build hona hi screen ko nayi values dikhane deta hai."
      },
      {
        "q": "TextField controller jaisi cheez kahan banani chahiye, ya State object ki starting value kahan set karni chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Kisi doosre widget ke build() method me",
          "main() me, runApp() ke baad",
          "State object me, field ke taur par ya initState() me",
          "build() ke andar, taaki har baar fresh mile"
        ],
        "answer": 2,
        "explanation": "initState sirf ek baar chalta hai, par build() har rebuild par chalta hai; controller build() me banoge to har rebuild par wo dobara banega aur likha hua text gayab ho jayega."
      },
      {
        "q": "Ek counter value ek display widget me dikhti hai aur ek alag + button widget se badalti hai, dono ek hi page par hain. State kahan rehni chahiye?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Sirf display widget ke andar",
          "Sirf button widget ke andar",
          "Ek nayi screen ke State object me",
          "Unke nazdeek common parent me, dono ko neeche pass karke"
        ],
        "answer": 3,
        "explanation": "Dono widgets ko ek hi value chahiye, isliye dono ko cover karne wali sabse chhoti jagah unka common parent hai; state zyada neeche rakhoge to share hi nahi ho payegi."
      },
      {
        "q": "build() ke andar setState() kyon nahi call karna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Kyunki build() state values padh nahi sakta",
          "Kyunki ye State object ko delete kar deta hai",
          "Kyunki isse app thodi slow ho jaati hai",
          "Kyunki setState ek aur build trigger karta hai, to build() hamesha ke liye setState call karta rahega"
        ],
        "answer": 3,
        "explanation": "setState rebuild schedule karta hai aur build() wahi rebuild hai; ek ko doosre se call karoge to loop kabhi khatam nahi hoga aur screen ek baar bhi sahi se draw nahi hogi."
      }
    ]
  },
  {
    "id": "quiz-14-state-at-scale",
    "lessonId": "lesson-14-state-at-scale",
    "title": "Quiz: Managing State at Scale",
    "questions_en": [
      {
        "q": "What does \"lifting state up\" mean?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Making the state global so any widget can grab it",
          "Deleting the state from the children",
          "Moving shared state to the nearest common parent and passing it down",
          "Moving the state into the build() method"
        ],
        "answer": 2,
        "explanation": "Lifting state up means moving shared state to the nearest common parent and passing it down; children display it and call back up to change it."
      },
      {
        "q": "What is the prop drilling problem?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Passing a value directly to the widget that uses it",
          "Passing a value through widgets that do not use it, just so it reaches a deep widget",
          "Sharing state through a global variable",
          "Reading state from an InheritedWidget"
        ],
        "answer": 1,
        "explanation": "Prop drilling is the chain of forwarding a value through widgets that never use it; it is workable for 1–2 levels but painful at 4–5."
      },
      {
        "q": "An InheritedWidget lets widgets deep in the tree read shared data without passing it down step by step.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "An InheritedWidget sits high in the tree and any widget below can read it directly, skipping the middle widgets entirely."
      },
      {
        "q": "When does lifting state up fail?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "When only one widget needs the value",
          "When two siblings on one screen share it",
          "When the value never changes",
          "When state is needed on many unrelated screens or must survive navigation"
        ],
        "answer": 3,
        "explanation": "A cart that must survive navigation cannot live in one page's State, and lifting it to the very top tangles the root widget — that is when a shared state tool is needed."
      },
      {
        "q": "A filter value is used by two sibling widgets on the same screen and nowhere else. What is the right move?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Use a state-management package right away",
          "Make the value global",
          "Lift the value to their common parent and pass it down with a callback",
          "Keep a separate copy of the value in each sibling"
        ],
        "answer": 2,
        "explanation": "Two siblings on one screen are the classic lift case: one level up covers both, while a package would add concepts the screen does not need."
      },
      {
        "q": "Two sibling widgets each show a counter, but tapping + in one leaves the other unchanged. What is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Lift the count to the common parent, pass it down to both, and pass an onIncrement callback to the button",
          "Give each widget its own counter and hope they match",
          "Store the count in a global variable",
          "Move the count into the build() method"
        ],
        "answer": 0,
        "explanation": "Each sibling owns its own copy, so tapping one never changes the other; one shared value in the parent, passed down with a callback, keeps them in sync."
      },
      {
        "q": "Lifting state up always scales, no matter how many screens share the value.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Lifting works while the sharing is small; once state spans many screens or survives navigation, lifting to the top rebuilds too much and tangles the root."
      },
      {
        "q": "How is an InheritedWidget different from passing a value down through constructors?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "InheritedWidget rebuilds the whole app on every change",
          "With an InheritedWidget, a deep widget reads the value directly instead of every middle widget forwarding it",
          "Constructor passing is only for theme data",
          "InheritedWidget stores data on disk"
        ],
        "answer": 1,
        "explanation": "Constructor passing forces every middle widget to accept and forward the value; an InheritedWidget lets the deep widget read it directly, so middle widgets are skipped."
      },
      {
        "q": "A cart counter is shown on the home screen, changed from a details screen, and must not empty when the user navigates away. Where should its state live?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "In the home page's State, lifted to the top widget",
          "In each screen's own State, copied between screens",
          "In a shared state object outside the widget tree, such as a Provider model",
          "In the build() method of the cart icon"
        ],
        "answer": 2,
        "explanation": "The cart is shared across screens and must survive leaving a page, so it cannot live in any page's State; it needs a shared state object outside the widget tree, like Provider."
      },
      {
        "q": "What is the state-choice decision diagram used for?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "One widget needs it → setState; siblings share it → lift to the parent; many screens share it → a package like Provider",
          "Every screen → BLoC from day one; simple screens → a global variable",
          "One widget needs it → a package; many screens share it → setState",
          "Siblings share it → global state; many screens share it → prop drilling"
        ],
        "answer": 0,
        "explanation": "The diagram asks in order: one widget, then siblings, then many screens — and only the last answer justifies a package, which stops over-engineering simple screens."
      }
    ],
    "questions_hi": [
      {
        "q": "\"Lifting state up\" ka matlab kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "State ko global banana taaki koi bhi widget use utha le",
          "Children se state delete kar dena",
          "Shared state ko nazdeek common parent me le jaana aur neeche pass karna",
          "State ko build() method me rakh dena"
        ],
        "answer": 2,
        "explanation": "Lifting state up matlab shared state ko nazdeek common parent me le jaana aur neeche pass karna; children use dikhate hain aur badalne ke liye callback upar bhejte hain."
      },
      {
        "q": "Prop drilling problem kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Value ko seedha us widget ko dena jo use istemal karta hai",
          "Value ko un widgets se pass karna jo use istemal nahi karte, sirf taaki wo deep widget tak pahunche",
          "Global variable se state share karna",
          "InheritedWidget se state padhna"
        ],
        "answer": 1,
        "explanation": "Prop drilling matlab value ko un widgets se aage badhana jo use istemal hi nahi karte; 1–2 level tak chalta hai, par 4–5 level par dard ban jaata hai."
      },
      {
        "q": "InheritedWidget neeche ke widgets ko shared data seedha padhne deta hai, step-by-step pass kiye bina.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "InheritedWidget tree me upar baithta hai aur neeche ka koi bhi widget use seedha padh sakta hai, beech ke widgets ko skip karke."
      },
      {
        "q": "Lifting state up kab fail hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Jab sirf ek widget ko value chahiye",
          "Jab ek screen par 2 siblings share karte hon",
          "Jab value kabhi badalti hi na ho",
          "Jab state kai unrelated screens par chahiye ya navigation ke baad bhi zinda rehni ho"
        ],
        "answer": 3,
        "explanation": "Navigation ke baad bhi zinda rehne wala cart kisi ek page ke State me nahi reh sakta, aur use sabse upar uthane se root widget ulajh jayega — tabhi shared state tool chahiye hota hai."
      },
      {
        "q": "Ek filter value ek hi screen ke 2 sibling widgets use karte hain, aur kahin nahi. Sahi kadam kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Seedha state-management package use karo",
          "Value ko global bana do",
          "Value ko common parent me uthao aur callback ke saath neeche pass karo",
          "Har sibling me value ki alag copy rakho"
        ],
        "answer": 2,
        "explanation": "Ek hi screen par 2 siblings ke liye lift hi classic case hai: ek level upar dono ko cover kar deta hai, jabki package aise screen par extra concepts la dega jinki zaroorat nahi hai."
      },
      {
        "q": "2 sibling widgets me counter dikhta hai, par ek me + tap karne se doosra nahi badalta. Fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Count ko common parent me uthao, dono ko neeche pass karo, aur button ko onIncrement callback do",
          "Har widget ko apna counter do aur umeed karo ki match karenge",
          "Count ko global variable me rakho",
          "Count ko cart icon ke build() method me rakho"
        ],
        "answer": 0,
        "explanation": "Har sibling ke paas apni copy hai, isliye ek me tap karne se doosra kabhi nahi badalta; parent me ek shared value, neeche pass karke aur callback ke saath, dono ko sync me rakhti hai."
      },
      {
        "q": "Lifting state up hamesha scale karta hai, chahe kitni bhi screens value share karein.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Sharing chhoti ho tab tak lifting chalta hai; jab state kai screens par phail jaaye ya navigation ke baad zinda rehni ho, to top par uthane se bahut zyada rebuild hoga aur root ulajh jayega."
      },
      {
        "q": "InheritedWidget constructor se value pass karne se kaise alag hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "InheritedWidget har change par poori app rebuild karta hai",
          "InheritedWidget se deep widget value seedha padh leta hai, har beech ke widget ko forward karne ki bajay",
          "Constructor passing sirf theme data ke liye hota hai",
          "InheritedWidget data ko disk par store karta hai"
        ],
        "answer": 1,
        "explanation": "Constructor passing me har beech ka widget value accept karke aage badhata hai; InheritedWidget se deep widget use seedha padh leta hai, to beech ke widgets skip ho jaate hain."
      },
      {
        "q": "Ek cart counter home screen par dikhta hai, details screen se badalta hai, aur navigate karne par khaali nahi hona chahiye. Uski state kahan rehni chahiye?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Home page ke State me, top widget tak uthaya hua",
          "Har screen ke apne State me, screens ke beech copy karke",
          "Widget tree ke bahar ek shared state object me, jaise Provider model",
          "Cart icon ke build() method me"
        ],
        "answer": 2,
        "explanation": "Cart kai screens par share hota hai aur page chhodne par bhi zinda rehna chahiye, isliye wo kisi page ke State me nahi reh sakta; use widget tree ke bahar shared state object chahiye, jaise Provider model."
      },
      {
        "q": "State-choice decision diagram kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Ek widget ko chahiye → setState; siblings share karein → parent me uthao; kai screens share karein → Provider jaisa package",
          "Har screen → pehle din se BLoC; simple screens → global variable",
          "Ek widget ko chahiye → package; kai screens share karein → setState",
          "Siblings share karein → global state; kai screens share karein → prop drilling"
        ],
        "answer": 0,
        "explanation": "Diagram order me poochhta hai: ek widget, phir siblings, phir kai screens — aur sirf aakhri jawab package ko justify karta hai, jo simple screens ko over-engineer hone se bachata hai."
      }
    ]
  },
  {
    "id": "quiz-15-provider",
    "lessonId": "lesson-15-provider",
    "title": "Quiz: Provider Essentials",
    "questions_en": [
      {
        "q": "What is the job of a ChangeNotifier?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A widget that draws the screen",
          "A database for saving data to disk",
          "A replacement for MaterialApp",
          "A plain Dart class that holds state and announces changes with notifyListeners()"
        ],
        "answer": 3,
        "explanation": "A ChangeNotifier is a plain Dart class outside any widget that holds state and announces changes, so any screen can use it."
      },
      {
        "q": "What does calling notifyListeners() do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It rebuilds the whole app, including widgets that never listen",
          "It tells listening widgets to rebuild",
          "It saves the model's data to disk",
          "It creates a new model instance"
        ],
        "answer": 1,
        "explanation": "notifyListeners is the announcement; every Consumer and watcher then rebuilds, while widgets that never listen stay untouched."
      },
      {
        "q": "A Consumer rebuilds only the listening part of the UI, not the whole page.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "A Consumer wraps only the part that shows the value, so only that part rebuilds when the model notifies — not the whole page."
      },
      {
        "q": "What is MultiProvider used for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It replaces ChangeNotifier entirely",
          "It makes every model rebuild on every change",
          "It lists several models in one flat place instead of nesting providers",
          "It creates the widget tree automatically"
        ],
        "answer": 2,
        "explanation": "MultiProvider lists several models in one flat place instead of nesting providers five deep, and each model stays independent."
      },
      {
        "q": "A screen shows a cart count in a Text and has an Add button. Which is the right pick?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Use context.watch inside the button callback",
          "Use context.read inside the button callback, and context.watch or Consumer where the value is shown",
          "Use Consumer for the button and read for the text",
          "Use watch everywhere, so everything rebuilds"
        ],
        "answer": 1,
        "explanation": "Showing uses watch or Consumer because the UI must rebuild on change; doing uses read in the callback, which reads once without subscribing."
      },
      {
        "q": "A Provider counter changes in memory but the screen never updates:\n\nvoid increment() { _count++; }\n\nWhat is missing?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Wrap the method body in setState",
          "Use context.watch instead of context.read in the button",
          "Rebuild the whole app manually",
          "Add notifyListeners() at the end of increment()"
        ],
        "answer": 3,
        "explanation": "The value changes but nobody is told, so listeners never rebuild; this is the Provider version of forgetting setState."
      },
      {
        "q": "A Provider creates the widget tree for you.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "A provider exposes a model above the widgets that need it; the widgets themselves still build the tree, and the provider also disposes the model when it is no longer needed."
      },
      {
        "q": "Which is the correct ChangeNotifierProvider setup for a CounterModel?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "ChangeNotifierProvider(create: (_) => CounterModel(), child: MyApp()) placed near the top of the app",
          "Provider(create: (_) => CounterModel()) placed below the widget that reads it",
          "A plain CounterModel() created inside build() on every rebuild",
          "ChangeNotifierProvider placed inside the Consumer's builder"
        ],
        "answer": 0,
        "explanation": "ChangeNotifierProvider creates the model above the widgets that need it, usually near the top of the app, and disposes it when it goes away."
      },
      {
        "q": "Wire a cart counter with Provider: a badge shows the item count and an Add button increases it. Which wiring is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Put the count in the button's State and pass it up with callbacks",
          "Keep the cart count in a global variable and rebuild the app on every tap",
          "CartModel extends ChangeNotifier with addItem() + notifyListeners(); ChangeNotifierProvider above the app; Consumer for the badge; context.read for the Add button",
          "Wrap the whole page in a Consumer and use context.watch inside the Add button's callback"
        ],
        "answer": 2,
        "explanation": "The model owns the count and announces changes, the provider sits above the app, the badge listens with Consumer, and the button acts with read — each piece does one job."
      },
      {
        "q": "When is Provider enough, and when is it not?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Provider is enough for every app, including the largest team projects",
          "Provider is enough for theme, cart and settings in a small or medium app, but not when logic gets complex or a large team needs strict separation",
          "Provider should never be used once an app has more than one screen",
          "Provider is only for theme, never for a cart"
        ],
        "answer": 1,
        "explanation": "Provider is the default for most small and medium apps, but complex async steps, event logging, or strict logic separation for a large team are where BLoC earns its boilerplate."
      }
    ],
    "questions_hi": [
      {
        "q": "ChangeNotifier ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek widget jo screen banata hai",
          "Disk par data save karne ka database",
          "MaterialApp ka replacement",
          "Ek simple Dart class jo state rakhti hai aur notifyListeners() se changes batati hai"
        ],
        "answer": 3,
        "explanation": "ChangeNotifier ek simple Dart class hai, kisi widget ke bahar, jo state rakhti hai aur changes ki ghoshna karti hai, isliye koi bhi screen use istemal kar sakti hai."
      },
      {
        "q": "notifyListeners() call karne se kya hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Poori app rebuild karta hai, un widgets samet jo kabhi sunte nahi",
          "Sunne wale widgets ko rebuild karne ke liye batata hai",
          "Model ka data disk par save karta hai",
          "Model ka naya instance banata hai"
        ],
        "answer": 1,
        "explanation": "notifyListeners hi ghoshna hai; har Consumer aur watcher phir rebuild hota hai, jabki jo widgets kabhi sunte nahi wo waise ke waise rehte hain."
      },
      {
        "q": "Consumer sirf UI ke sunne wale hisse ko rebuild karta hai, poora page nahi.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Consumer sirf us hisse ko lapet ta hai jo value dikhata hai, isliye notify hone par sirf wahi hissa rebuild hota hai — poora page nahi."
      },
      {
        "q": "MultiProvider kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye ChangeNotifier ko poori tarah replace karta hai",
          "Ye har change par har model ko rebuild karta hai",
          "Ye kai models ko ek flat jagah list karta hai, nesting ki bajay",
          "Ye widget tree apne aap banata hai"
        ],
        "answer": 2,
        "explanation": "MultiProvider kai models ko ek flat jagah list kar deta hai, 5 level deep nesting ki bajay, aur har model azaad rehta hai."
      },
      {
        "q": "Ek screen par Text me cart count dikhta hai aur ek Add button hai. Sahi pick kaunsi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Button callback ke andar context.watch use karo",
          "Button callback me context.read, aur value dikhane wali jagah par context.watch ya Consumer",
          "Button ke liye Consumer aur text ke liye read use karo",
          "Har jagah watch use karo, taaki sab rebuild ho"
        ],
        "answer": 1,
        "explanation": "Dikhane ke liye watch ya Consumer chahiye kyunki UI ko change par rebuild hona hai; karne ke liye callback me read chahiye, jo bina subscribe kiye ek baar padhta hai."
      },
      {
        "q": "Provider counter memory me badalta hai par screen kabhi update nahi hoti:\n\nvoid increment() { _count++; }\n\nKya missing hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Method body ko setState me lapeto",
          "Button me context.read ki jagah context.watch use karo",
          "Poori app ko manually rebuild karo",
          "increment() ke end me notifyListeners() add karo"
        ],
        "answer": 3,
        "explanation": "Value badal gayi par kisi ko bataya hi nahi gaya, isliye listeners kabhi rebuild nahi hote; ye Provider wala setState bhoolne jaisa hai."
      },
      {
        "q": "Provider tumhare liye widget tree banata hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Provider model ko un widgets ke upar rakhta hai jinko uski zaroorat hai; widgets khud tree banate hain, aur provider zaroorat khatam hone par model ko dispose bhi karta hai."
      },
      {
        "q": "CounterModel ke liye sahi ChangeNotifierProvider setup kaunsa hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "ChangeNotifierProvider(create: (_) => CounterModel(), child: MyApp()) app ke top ke paas rakha hua",
          "Provider(create: (_) => CounterModel()) us widget ke neeche rakha hua jo use padhta hai",
          "Ek plain CounterModel() har rebuild par build() ke andar banaya hua",
          "Consumer ke builder ke andar rakha hua ChangeNotifierProvider"
        ],
        "answer": 0,
        "explanation": "ChangeNotifierProvider model ko un widgets ke upar rakhta hai jinko uski zaroorat hai, aam taur par app ke top ke paas, aur jaane par use dispose karta hai."
      },
      {
        "q": "Provider se cart counter wiring karo: ek badge item count dikhata hai aur ek Add button use badhata hai. Sahi wiring kaunsi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Count ko button ke State me rakho aur callbacks se upar pass karo",
          "Cart count ko global variable me rakho aur har tap par poori app rebuild karo",
          "CartModel extends ChangeNotifier, addItem() + notifyListeners() ke saath; app ke upar ChangeNotifierProvider; badge ke liye Consumer; Add button ke liye context.read",
          "Poora page Consumer me lapeto aur Add button ke callback me context.watch use karo"
        ],
        "answer": 2,
        "explanation": "Model count ka malik hai aur changes batata hai, provider app ke upar baithta hai, badge Consumer se sunta hai, aur button read se kaam karta hai — har hisse ka ek hi kaam hai."
      },
      {
        "q": "Provider kab kaafi hai, aur kab nahi?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Provider har app ke liye kaafi hai, sabse bade team projects samet",
          "Chhote ya medium app me theme, cart aur settings ke liye Provider kaafi hai, par logic complex ho ya badi team ko sakht separation chahiye to nahi",
          "Ek se zyada screen hote hi Provider kabhi use nahi karna chahiye",
          "Provider sirf theme ke liye hai, cart ke liye kabhi nahi"
        ],
        "answer": 1,
        "explanation": "Provider zyadatar chhote aur medium apps ke liye default hai, par complex async steps, event logging, ya badi team ke liye sakht logic separation wahan hai jahan BLoC apna boilerplate justify karta hai."
      }
    ]
  },
  {
    "id": "quiz-16-riverpod",
    "lessonId": "lesson-16-riverpod",
    "title": "Quiz: Riverpod",
    "questions_en": [
      {
        "q": "Why would you pick Riverpod over Provider?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Riverpod needs no setup at all",
          "Riverpod is shorter to type",
          "Riverpod providers work without BuildContext and fail at compile time, not runtime",
          "Riverpod removes the need for widgets"
        ],
        "answer": 2,
        "explanation": "Provider needs a BuildContext to read state and a missing provider fails only at runtime; Riverpod providers live outside widgets, so they work anywhere and mistakes surface at compile time."
      },
      {
        "q": "What is the difference between a Riverpod Provider and a Notifier?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Provider holds a fixed value or service; Notifier holds changeable state with methods",
          "Provider holds changeable state; Notifier holds only fixed values",
          "They are the same thing with different names",
          "Notifier is only for async work, Provider is only for sync work"
        ],
        "answer": 0,
        "explanation": "A plain Provider holds a fixed value or service that never changes on its own; a Notifier holds changeable state with methods that update state directly."
      },
      {
        "q": "A ConsumerWidget watches providers with ref.watch and rebuilds when they change.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "A ConsumerWidget's build receives a WidgetRef, and ref.watch inside build listens to providers and rebuilds the widget when they change."
      },
      {
        "q": "What is AsyncNotifier for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "AsyncNotifier is only for sync counters",
          "AsyncNotifier is the old name for FutureProvider",
          "AsyncNotifier cannot show a loading state",
          "AsyncNotifier holds async state you also want to change, like refreshing or retrying"
        ],
        "answer": 3,
        "explanation": "FutureProvider covers one async job, while AsyncNotifier is for async state you also want to change — refresh, update or retry — with state set to loading, data or error."
      },
      {
        "q": "When should you use a FutureProvider?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "To hold a counter that changes on tap",
          "To fetch something once, like a user, and expose loading, error and data states",
          "To replace ProviderScope",
          "To navigate without context"
        ],
        "answer": 1,
        "explanation": "A FutureProvider runs one async job and exposes an AsyncValue; the UI renders each state with .when instead of manual isLoading booleans."
      },
      {
        "q": "Every provider read fails with \"provider not found\", even though the providers are declared correctly. What is the most likely fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Wrap the app in a ProviderScope",
          "Add a BuildContext parameter to the provider",
          "Call setState before reading the provider",
          "Import the provider file twice"
        ],
        "answer": 0,
        "explanation": "Riverpod providers are only available below a ProviderScope; without that wrapper around the app, no provider can be found at all."
      },
      {
        "q": "Riverpod requires code generation; you cannot write providers by hand.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "This lesson teaches the plain, non-codegen style: providers are written by hand as global variables, and code generation is only an optional alternative."
      },
      {
        "q": "Which is the correct ref.watch vs ref.read rule?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Use ref.watch everywhere, including callbacks",
          "Use ref.read in build and ref.watch in callbacks",
          "Use ref.watch in build to listen and rebuild, and ref.read in callbacks to call a method once",
          "Use neither; call the notifier directly from the widget"
        ],
        "answer": 2,
        "explanation": "watch belongs in build because it subscribes and rebuilds; in callbacks you want a one-time call, so read is correct and watch there rebuilds things that should not rebuild."
      },
      {
        "q": "Build a posts screen with Riverpod: fetch posts from an API, show a spinner while loading, show an error message on failure, and support refresh. Which flow is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Put the API call inside build() and guard it with an isLoading boolean",
          "Store the posts in a StatefulWidget and fetch in setState",
          "A Provider holds the API client; a FutureProvider fetches with it; the UI renders with .when for data, loading and error; refresh uses ref.invalidate",
          "Fetch in the button callback and pass the result down through constructors"
        ],
        "answer": 1,
        "explanation": "Each layer has one job: the Provider holds the client, the FutureProvider fetches with it, and the UI draws one widget per AsyncValue state with .when; ref.invalidate reruns the fetch for refresh."
      },
      {
        "q": "A new app needs its state readable from a background service outside the widget tree, and providers must be easy to swap for fakes in tests. Which pick fits, and why?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Always Riverpod, even for a one-screen app",
          "Always Provider, because Riverpod is only for large apps",
          "Riverpod for a new app whose state must be read outside the widget tree and tested by swapping providers; Provider stays fine for a small app the team already knows",
          "Riverpod only when the app has no async work at all"
        ],
        "answer": 3,
        "explanation": "Riverpod's wins — no BuildContext needed, compile-time errors, easy provider swapping in tests — matter most when state is read outside the tree or tested heavily; a tiny app the team already knows Provider for gains little."
      }
    ],
    "questions_hi": [
      {
        "q": "Provider ke mukable Riverpod kyon chuno?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Riverpod ko koi setup hi nahi chahiye",
          "Riverpod type karne me chhota hai",
          "Riverpod providers BuildContext ke bina kaam karte hain aur galti runtime par nahi, compile time par pakdi jaati hai",
          "Riverpod widgets ki zaroorat khatam kar deta hai"
        ],
        "answer": 2,
        "explanation": "Provider ko state padhne ke liye BuildContext chahiye aur missing provider ki galti sirf runtime par pata chalti hai; Riverpod providers widgets ke bahar rehte hain, isliye kahin se bhi kaam karte hain aur galti compile time par pakdi jaati hai."
      },
      {
        "q": "Riverpod Provider aur Notifier me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Provider fixed value ya service rakhta hai; Notifier methods ke saath badalne wali state rakhta hai",
          "Provider badalne wali state rakhta hai; Notifier sirf fixed values rakhta hai",
          "Dono ek hi cheez hain, bas naam alag hai",
          "Notifier sirf async kaam ke liye hai, Provider sirf sync kaam ke liye"
        ],
        "answer": 0,
        "explanation": "Plain Provider fixed value ya service rakhta hai jo khud kabhi nahi badalta; Notifier badalne wali state rakhta hai, methods ke saath jo state ko seedha update karte hain."
      },
      {
        "q": "ConsumerWidget ref.watch se providers ko watch karta hai aur badalne par rebuild hota hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "ConsumerWidget ke build ko WidgetRef milta hai, aur build me ref.watch providers ko sunta hai aur badalne par widget ko rebuild karta hai."
      },
      {
        "q": "AsyncNotifier kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "AsyncNotifier sirf sync counters ke liye hai",
          "AsyncNotifier FutureProvider ka purana naam hai",
          "AsyncNotifier loading state dikha hi nahi sakta",
          "AsyncNotifier async state rakhta hai jise badalna bhi hai, jaise refresh ya retry"
        ],
        "answer": 3,
        "explanation": "FutureProvider ek async kaam ke liye hai, jabki AsyncNotifier async state ke liye hai jise badalna bhi hai — refresh, update ya retry — jisme state loading, data ya error par set hoti hai."
      },
      {
        "q": "FutureProvider kab use karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Tap par badalne wala counter rakhne ke liye",
          "Ek baar kuch fetch karne ke liye, jaise user, aur loading, error aur data states dene ke liye",
          "ProviderScope ko replace karne ke liye",
          "Context ke bina navigate karne ke liye"
        ],
        "answer": 1,
        "explanation": "FutureProvider ek async kaam chalata hai aur AsyncValue deta hai; UI har state ko .when se banati hai, manual isLoading boolean ki bajay."
      },
      {
        "q": "Har provider read \"provider not found\" se fail ho raha hai, jabki providers sahi declare kiye hain. Sabse likely fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "App ko ProviderScope me lapeto",
          "Provider ko BuildContext parameter do",
          "Provider padhne se pehle setState call karo",
          "Provider file ko do baar import karo"
        ],
        "answer": 0,
        "explanation": "Riverpod providers sirf ProviderScope ke neeche milte hain; app ko us wrapper me lapete bina koi provider mil hi nahi sakta."
      },
      {
        "q": "Riverpod me code generation zaroori hai; providers haath se likhe hi nahi ja sakte.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ye lesson plain, non-codegen style sikhata hai: providers haath se global variables ke taur par likhe jaate hain, aur code generation sirf ek optional alternative hai."
      },
      {
        "q": "ref.watch vs ref.read ka sahi rule kaunsa hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Callbacks samet har jagah ref.watch use karo",
          "Build me ref.read aur callbacks me ref.watch use karo",
          "Build me sunne aur rebuild ke liye ref.watch, aur callbacks me ek baar method call ke liye ref.read use karo",
          "Kuch bhi use mat karo; notifier ko widget se seedha call karo"
        ],
        "answer": 2,
        "explanation": "watch build me hona chahiye kyunki wo subscribe karke rebuild karta hai; callbacks me ek baar ka call chahiye hota hai, isliye read sahi hai aur galat jagah watch un cheezon ko rebuild karega jo rebuild nahi honi chahiye."
      },
      {
        "q": "Riverpod se posts screen banao: API se posts fetch karo, loading me spinner dikhao, fail hone par error message dikhao, aur refresh bhi support karo. Sahi flow kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "API call build() ke andar rakho aur isLoading boolean se guard karo",
          "Posts ko StatefulWidget me rakho aur setState me fetch karo",
          "Provider me API client rakho; FutureProvider usse fetch kare; UI data, loading aur error ke liye .when se render kare; refresh ke liye ref.invalidate use karo",
          "Button callback me fetch karo aur result constructors se neeche pass karo"
        ],
        "answer": 1,
        "explanation": "Har layer ka ek hi kaam hai: Provider me API client, FutureProvider usse fetch karta hai, aur UI .when se har AsyncValue state ke liye ek widget banati hai; refresh ke liye ref.invalidate fetch dobara chalata hai."
      },
      {
        "q": "Ek naye app ki state widget tree ke bahar background service se padhni hai, aur tests me providers ko fake se badalna aasaan hona chahiye. Kaunsi pick fit baithti hai, aur kyon?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Hamesha Riverpod, ek screen wale app ke liye bhi",
          "Hamesha Provider, kyunki Riverpod sirf bade apps ke liye hai",
          "Naye app ke liye Riverpod, jiski state widget tree ke bahar padhni ho aur tests me providers fake se badalne hon; chhote app ke liye jise team Provider se jaanti hai, Provider theek hai",
          "Riverpod sirf tab jab app me koi async kaam hi na ho"
        ],
        "answer": 3,
        "explanation": "Riverpod ke fayde — BuildContext ki zaroorat nahi, compile-time errors, tests me providers ko fake se badalna aasaan — sabse zyada matter karte hain jab state tree ke bahar padhni ho ya heavily test karni ho; chhote app ko jise team Provider se jaanti hai, isse zyada fayda nahi hoga."
      }
    ]
  },
  {
    "id": "quiz-17-bloc",
    "lessonId": "lesson-17-bloc",
    "title": "Quiz: BLoC / Cubit",
    "questions_en": [
      {
        "q": "What is the difference between an event and a state in BLoC?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Events are UI widgets and states are data models",
          "Events and states are the same thing",
          "Events are things that happened (inputs); states are what the UI should show (outputs)",
          "Events are outputs and states are inputs"
        ],
        "answer": 2,
        "explanation": "Events are inputs — things that happened, like a tap or a submit — and states are outputs — snapshots of what the UI should show right now, like loading or success."
      },
      {
        "q": "How is a Cubit different from a Bloc?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A Cubit uses events and a Bloc uses methods",
          "A Cubit is BLoC without events: direct method calls that emit states",
          "A Cubit cannot emit states at all",
          "A Cubit is only for navigation"
        ],
        "answer": 1,
        "explanation": "A Cubit skips events: you call methods directly and it emits new states, giving the same logic-UI separation with about half the code."
      },
      {
        "q": "BlocBuilder rebuilds the UI when the bloc emits a new state.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "BlocBuilder subscribes to the bloc's state stream and rebuilds its builder whenever a new state is emitted."
      },
      {
        "q": "What is BlocListener used for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "To draw widgets on screen",
          "To replace BlocProvider",
          "To hold the bloc's state",
          "To run one-off side effects like navigation and snackbars on state change"
        ],
        "answer": 3,
        "explanation": "BlocListener never rebuilds its child; it runs one-off actions like navigation, snackbars or dialogs when a state arrives."
      },
      {
        "q": "Pick the correct BLoC event flow for a login button tap.",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "UI changes state directly, then the bloc logs an event",
          "Bloc emits a state, then the UI sends an event",
          "UI adds an event → the handler runs → a new state is emitted → BlocBuilder rebuilds",
          "UI calls build() and the bloc watches the widget tree"
        ],
        "answer": 2,
        "explanation": "Data flows one way: the UI adds an event, the registered on<Event> handler runs the logic, it emits a new state, and BlocBuilder redraws the UI."
      },
      {
        "q": "A Cubit counter never updates the screen:\n\nvoid increment() { _count++; }\n\nThe UI listens with BlocBuilder. What is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Change the method to emit(state + 1) instead of changing a field without emitting",
          "Wrap the method in setState",
          "Make the cubit a StatelessWidget",
          "Call build() from inside the cubit"
        ],
        "answer": 0,
        "explanation": "Changing a field without emit never notifies anyone; the UI only reacts to emitted states, so the fix is to emit the new value."
      },
      {
        "q": "A Cubit uses events, just like a Bloc.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "A Cubit has no events at all; only a full Bloc takes events, while a Cubit exposes plain methods that emit states directly."
      },
      {
        "q": "What is the role of BlocProvider, and where does it go?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "BlocProvider must be placed below every widget that uses the bloc",
          "BlocProvider is only for navigation",
          "BlocProvider replaces BlocBuilder",
          "BlocProvider creates the bloc above the widgets that use it, so they can read or build from it"
        ],
        "answer": 3,
        "explanation": "BlocProvider creates the bloc above the widgets that use it, so any widget below can read it or build from it; a widget above the provider cannot see it."
      },
      {
        "q": "Model a login flow with BLoC: the user submits, a spinner shows, then the app navigates home on success or shows an error on failure. Which model is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "One event LoginStarted and one state LoginDone, with navigation inside BlocBuilder",
          "Events LoginSubmitted, states LoginLoading, LoginSuccess and LoginFailure; navigate on Success and show a snackbar on Failure inside BlocListener",
          "A single Cubit method that navigates directly and never emits states",
          "States for every button tap, with navigation inside BlocBuilder"
        ],
        "answer": 1,
        "explanation": "Login is a rich flow, so it gets one event per thing that happens and one state per thing the UI must show; navigation and snackbars are side effects, so they belong in the Listener, never the Builder."
      },
      {
        "q": "When does BLoC beat simpler state solutions?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "For every app, even a one-screen solo counter",
          "Only when the app uses Firebase",
          "For a large app with several developers, complex business rules, or a need for an event log for debugging and testing",
          "Only for apps with no state at all"
        ],
        "answer": 2,
        "explanation": "BLoC pays off when the app is large, several developers share it, rules are complex, or the event log aids debugging and testing; for a small solo app its boilerplate slows you down more than it helps."
      }
    ],
    "questions_hi": [
      {
        "q": "BLoC me event aur state me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Events UI widgets hain aur states data models hain",
          "Events aur states ek hi cheez hain",
          "Events wo hain jo ho chuke hain (inputs); states wo hain jo UI ko dikhana hai (outputs)",
          "Events outputs hain aur states inputs hain"
        ],
        "answer": 2,
        "explanation": "Events inputs hain — jo ho chuka hai, jaise tap ya submit — aur states outputs hain — snapshots jo batate hain UI ko abhi kya dikhana hai, jaise loading ya success."
      },
      {
        "q": "Cubit Bloc se kaise alag hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Cubit events use karta hai aur Bloc methods use karta hai",
          "Cubit BLoC hai, bina events ke: seedha method calls jo states emit karte hain",
          "Cubit states emit kar hi nahi sakta",
          "Cubit sirf navigation ke liye hai"
        ],
        "answer": 1,
        "explanation": "Cubit events ko skip karta hai: methods seedha call karo aur wo nayi states emit karta hai, aadhe code me wahi logic-UI separation deta hai."
      },
      {
        "q": "BlocBuilder UI ko rebuild karta hai jab bloc nayi state emit karta hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "BlocBuilder bloc ki state stream ko subscribe karta hai aur nayi state emit hote hi apna builder dobara banata hai."
      },
      {
        "q": "BlocListener kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Screen par widgets banane ke liye",
          "BlocProvider ko replace karne ke liye",
          "Bloc ki state rakhne ke liye",
          "State change par navigation aur snackbar jaise ek baar wale side effects ke liye"
        ],
        "answer": 3,
        "explanation": "BlocListener apne child ko kabhi rebuild nahi karta; wo state aane par ek baar wale kaam karta hai, jaise navigation, snackbar ya dialog."
      },
      {
        "q": "Login button tap ke liye sahi BLoC event flow chuno.",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "UI seedha state badalti hai, phir bloc event log karta hai",
          "Bloc state emit karta hai, phir UI event bhejti hai",
          "UI event add karti hai → handler chalta hai → nayi state emit hoti hai → BlocBuilder rebuild karta hai",
          "UI build() call karti hai aur bloc widget tree ko watch karta hai"
        ],
        "answer": 2,
        "explanation": "Data ek hi direction me behta hai: UI event add karti hai, registered on<Event> handler logic chalata hai, wo nayi state emit karta hai, aur BlocBuilder UI dobara banata hai."
      },
      {
        "q": "Ek Cubit counter screen ko kabhi update nahi karta:\n\nvoid increment() { _count++; }\n\nUI BlocBuilder se sun rahi hai. Fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Method ko emit(state + 1) karne ke liye badlo, bina emit kiye field badalne ki bajay",
          "Method ko setState me lapeto",
          "Cubit ko StatelessWidget bana do",
          "Cubit ke andar se build() call karo"
        ],
        "answer": 0,
        "explanation": "Emit kiye bina field badalne se kisi ko pata hi nahi chalta; UI sirf emitted states par react karti hai, isliye fix nayi value emit karna hai."
      },
      {
        "q": "Cubit events use karta hai, bilkul Bloc ki tarah.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Cubit me events hote hi nahi hain; sirf full Bloc events leta hai, jabki Cubit plain methods deta hai jo states ko seedha emit karte hain."
      },
      {
        "q": "BlocProvider ka role kya hai, aur wo kahan lagta hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "BlocProvider har us widget ke neeche hona chahiye jo bloc use karta hai",
          "BlocProvider sirf navigation ke liye hai",
          "BlocProvider BlocBuilder ko replace karta hai",
          "BlocProvider bloc ko un widgets ke upar banata hai jo use istemal karte hain, taaki wo read ya build kar sakein"
        ],
        "answer": 3,
        "explanation": "BlocProvider bloc ko un widgets ke upar banata hai jo use istemal karte hain, taaki neeche ka koi bhi widget use read kar sake ya usse build kar sake; provider ke upar wala widget use dekh nahi sakta."
      },
      {
        "q": "BLoC se login flow model karo: user submit karta hai, spinner dikhta hai, phir success par app home par navigate karta hai ya failure par error dikhata hai. Sahi model kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Ek event LoginStarted aur ek state LoginDone, navigation BlocBuilder ke andar",
          "Events LoginSubmitted, states LoginLoading, LoginSuccess aur LoginFailure; Success par navigate karo aur Failure par snackbar dikhao, BlocListener ke andar",
          "Ek hi Cubit method jo seedha navigate karta hai aur kabhi states emit nahi karta",
          "Har button tap ke liye states, navigation BlocBuilder ke andar"
        ],
        "answer": 1,
        "explanation": "Login ek rich flow hai, isliye har hone wali cheez ke liye ek event aur UI ko dikhane wali har cheez ke liye ek state hoti hai; navigation aur snackbar side effects hain, isliye wo Listener me honge, Builder me kabhi nahi."
      },
      {
        "q": "BLoC simpler state solutions ko kab beat karta hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Har app ke liye, ek screen wale solo counter ke liye bhi",
          "Sirf jab app Firebase use kare",
          "Bade app ke liye, jisme kai developers hon, complex business rules hon, ya debugging aur testing ke liye event log chahiye",
          "Sirf un apps ke liye jinme koi state hi na ho"
        ],
        "answer": 2,
        "explanation": "BLoC tab fayda deta hai jab app badi ho, kai developers share karte hon, rules complex hon, ya event log debugging aur testing me madad kare; chhote solo app ke liye uska boilerplate madad se zyada slow karega."
      }
    ]
  },
  {
    "id": "quiz-18-getx",
    "lessonId": "lesson-18-getx",
    "title": "Quiz: GetX",
    "questions_en": [
      {
        "q": "What does GetX give you, all in one package?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Only state management",
          "State management, navigation and dependency injection in one package",
          "Only navigation",
          "Only dependency injection"
        ],
        "answer": 1,
        "explanation": "GetX bundles state management, navigation and dependency injection in one small package with very little boilerplate — that three-in-one pitch is its whole appeal."
      },
      {
        "q": "What triggers an Obx widget to rebuild?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "When setState is called",
          "When the app restarts",
          "When any widget on the screen changes",
          "When an .obs variable used inside it changes"
        ],
        "answer": 3,
        "explanation": "Obx watches the .obs variables used inside it; when one of them changes, Obx rebuilds — a plain variable inside Obx rebuilds nothing."
      },
      {
        "q": "GetX navigation needs a BuildContext everywhere.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Get.to, Get.back and Get.snackbar work from anywhere without a context; that context-free navigation is one of GetX's main selling points."
      },
      {
        "q": "What is the job of Get.put?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It deletes a controller",
          "It navigates to a new page",
          "It registers a controller once so Get.find can retrieve it from any screen",
          "It rebuilds the widget tree"
        ],
        "answer": 2,
        "explanation": "Get.put registers a controller once so any screen can retrieve the same instance with Get.find; without the put, find has nothing to return."
      },
      {
        "q": "How do you navigate to a new page with GetX, without a BuildContext?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Get.to(() => SecondPage()) with GetMaterialApp instead of MaterialApp",
          "Navigator.of(context).push with a plain MaterialApp",
          "Get.find(() => SecondPage()) with a plain MaterialApp",
          "Get.back() with a plain MaterialApp"
        ],
        "answer": 0,
        "explanation": "Get.to needs no context, but it only works when the app uses GetMaterialApp instead of MaterialApp, which wires up GetX's navigation."
      },
      {
        "q": "A screen crashes on Get.find<CartController>() with \"controller not found\". What is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Replace Get.find with setState",
          "Wrap the page in a Consumer",
          "Register the controller first with Get.put before any Get.find call",
          "Make the controller a StatelessWidget"
        ],
        "answer": 2,
        "explanation": "Get.find only retrieves what was registered; if Get.put (or lazyPut) never ran first, find throws because nothing is registered."
      },
      {
        "q": "GetX is an official package from the Flutter team.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "GetX is a popular community package, not an official Flutter team package; Provider is the one the Flutter team recommends as a starting point."
      },
      {
        "q": "Which is the correct reactive-variable pattern in GetX?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "var count = 0.obs; show it inside Obx, and change it with count++",
          "var count = 0; show it inside Obx, and change it with count++",
          "var count = 0.obs; show it in a plain Text, and change it with setState",
          "var count = 0.obs; show it inside Obx, and change it by recreating the controller"
        ],
        "answer": 0,
        "explanation": "Adding .obs makes a variable observable, so Obx rebuilds when it changes; assigning uses count.value++ or the count++ shorthand on the Rx variable itself."
      },
      {
        "q": "Build a small GetX app: a counter screen with a button, plus navigation to a details screen. Which flow is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Keep the count in a StatefulWidget, navigate with Navigator.of(context), and use Get.find without Get.put",
          "Use a plain variable in Obx and call update() to refresh it",
          "Register the controller on every page with Get.put and read it with context.watch",
          "A GetxController holds var count = 0.obs; Get.put registers it once; Obx shows it; a button calls increment(); Get.to navigates, with GetMaterialApp at the root"
        ],
        "answer": 3,
        "explanation": "Each GetX piece does one job: the controller holds the .obs count, Get.put registers it once, Obx displays it reactively, and Get.to navigates without context under a GetMaterialApp."
      },
      {
        "q": "Pick the honest GetX trade-off: a solo prototype versus a large team app.",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "GetX is best for every app because it is the fastest to write",
          "GetX is best for a solo prototype where speed matters, but a large team app should prefer a stricter tool because global Get.find hides data sources",
          "GetX should never be used, even for prototypes",
          "GetX is best for large teams because hidden dependencies make review easier"
        ],
        "answer": 1,
        "explanation": "GetX wins on speed and small code for solo work, but global Get.find hides where data comes from, which makes large-team code harder to test and review — so the trade-off is speed versus structure."
      }
    ],
    "questions_hi": [
      {
        "q": "GetX ek package me tumhe kya-kya deta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Sirf state management",
          "Ek package me state management, navigation aur dependency injection",
          "Sirf navigation",
          "Sirf dependency injection"
        ],
        "answer": 1,
        "explanation": "GetX ek hi chhote package me state management, navigation aur dependency injection deta hai, bahut kam boilerplate ke saath — ye three-in-one pitch hi uski poori appeal hai."
      },
      {
        "q": "Obx widget ko rebuild kis cheez se trigger hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Jab setState call hota hai",
          "Jab app restart hoti hai",
          "Jab screen par koi bhi widget badalta hai",
          "Jab uske andar use hua .obs variable badalta hai"
        ],
        "answer": 3,
        "explanation": "Obx apne andar use hone wale .obs variables ko watch karta hai; jab unme se ek badalta hai to Obx rebuild hota hai — Obx ke andar plain variable kuch rebuild nahi karta."
      },
      {
        "q": "GetX navigation ko har jagah BuildContext chahiye hota hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Get.to, Get.back aur Get.snackbar kahin se bhi context ke bina kaam karte hain; ye context-free navigation GetX ke main selling points me se ek hai."
      },
      {
        "q": "Get.put ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye controller ko delete karta hai",
          "Ye naye page par navigate karta hai",
          "Ye controller ko ek baar register karta hai taaki Get.find use kisi bhi screen se nikal sake",
          "Ye widget tree ko rebuild karta hai"
        ],
        "answer": 2,
        "explanation": "Get.put controller ko ek baar register karta hai taaki koi bhi screen Get.find se wahi instance nikal sake; put ke bina find ke paas return karne ke liye kuch nahi hota."
      },
      {
        "q": "GetX se BuildContext ke bina naye page par kaise navigate karte ho?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Get.to(() => SecondPage()), MaterialApp ki jagah GetMaterialApp ke saath",
          "Plain MaterialApp ke saath Navigator.of(context).push",
          "Plain MaterialApp ke saath Get.find(() => SecondPage())",
          "Plain MaterialApp ke saath Get.back()"
        ],
        "answer": 0,
        "explanation": "Get.to ko context nahi chahiye, par ye sirf tab kaam karta hai jab app MaterialApp ki jagah GetMaterialApp use kare, jo GetX ki navigation ko wire karta hai."
      },
      {
        "q": "Ek screen Get.find<CartController>() par \"controller not found\" se crash ho rahi hai. Fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Get.find ko setState se replace karo",
          "Page ko Consumer me lapeto",
          "Kisi bhi Get.find call se pehle controller ko Get.put se register karo",
          "Controller ko StatelessWidget bana do"
        ],
        "answer": 2,
        "explanation": "Get.find sirf wahi nikal sakta hai jo register hua ho; agar Get.put (ya lazyPut) pehle kabhi chala hi nahi, to find throw karega kyunki kuch register hi nahi hua."
      },
      {
        "q": "GetX Flutter team ka official package hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "GetX ek popular community package hai, Flutter team ka official package nahi hai; Flutter team starting point ke taur par Provider recommend karti hai."
      },
      {
        "q": "GetX me reactive variable ka sahi pattern kaunsa hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "var count = 0.obs; Obx ke andar dikhao, aur count++ se badlo",
          "var count = 0; Obx ke andar dikhao, aur count++ se badlo",
          "var count = 0.obs; plain Text me dikhao, aur setState se badlo",
          "var count = 0.obs; Obx ke andar dikhao, aur controller ko dobara banakar badlo"
        ],
        "answer": 0,
        "explanation": ".obs lagane se variable observable ban jaata hai, to badalne par Obx rebuild hota hai; assign karne ke liye count.value++ ya Rx variable par seedha count++ shorthand use hota hai."
      },
      {
        "q": "GetX se chhota app banao: button wali counter screen, aur details screen par navigation. Sahi flow kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Count ko StatefulWidget me rakho, Navigator.of(context) se navigate karo, aur Get.put ke bina Get.find use karo",
          "Obx me plain variable use karo aur refresh ke liye update() call karo",
          "Har page par Get.put se controller register karo aur context.watch se padho",
          "Ek GetxController me var count = 0.obs rakho; Get.put use ek baar register kare; Obx use dikhaye; button increment() call kare; Get.to navigate kare, root par GetMaterialApp ke saath"
        ],
        "answer": 3,
        "explanation": "GetX ka har hissa ek kaam karta hai: controller me .obs count hota hai, Get.put use ek baar register karta hai, Obx use reactively dikhata hai, aur Get.to GetMaterialApp ke neeche context ke bina navigate karta hai."
      },
      {
        "q": "GetX ka imaandaar trade-off chuno: solo prototype versus badi team app.",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "GetX har app ke liye best hai kyunki use likhna sabse fast hai",
          "Solo prototype ke liye GetX best hai jahan speed matter karti hai, par badi team app ke liye sakht tool prefer karna chahiye kyunki global Get.find data sources chhupata hai",
          "GetX kabhi use nahi karna chahiye, prototypes ke liye bhi nahi",
          "GetX badi teams ke liye best hai kyunki chhupi hui dependencies review ko aasaan banati hain"
        ],
        "answer": 1,
        "explanation": "GetX solo kaam me speed aur chhote code se jeetta hai, par global Get.find chhupata hai ki data kahan se aaya, jo badi team ke code ko test aur review karna mushkil bana deta hai — to trade-off speed versus structure ka hai."
      }
    ]
  },
  {
    "id": "quiz-19-async",
    "lessonId": "lesson-19-async",
    "title": "Quiz: Async in Dart",
    "questions_en": [
      {
        "q": "What does a Future<String> mean in Dart?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A String that already exists right now",
          "A promise that a String will arrive later",
          "A list of Strings that grows over time",
          "A String stored on the device"
        ],
        "answer": 1,
        "explanation": "A Future is a promise of a value later, not the value itself — the app keeps running while it is still pending."
      },
      {
        "q": "What is the job of async and await when working with a Future?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "async makes code run faster, await makes it run slower",
          "async saves data to disk, and await reads it back",
          "async marks a function as returning a Future, and await pauses that function until the Future finishes",
          "async starts a new app, and await closes it"
        ],
        "answer": 2,
        "explanation": "async says the function returns a Future, and await pauses only that function until the result arrives — then you get the plain value."
      },
      {
        "q": "True or False: await freezes the whole app until the slow work finishes.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — only the awaiting function pauses; buttons, animations and the rest of the app keep running while it waits."
      },
      {
        "q": "How does .then() differ from await?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          ".then() only works for errors, while await only works for success",
          ".then() freezes the app, while await never pauses anything",
          ".then() returns a Stream, while await returns a List",
          ".then() runs a function when the Future succeeds, while await pauses the function and gives the plain value directly"
        ],
        "answer": 3,
        "explanation": ".then() attaches a callback for success without needing async on the caller, while await lets you read the same code top to bottom."
      },
      {
        "q": "A network call can fail. Which is the correct way to handle its error with async/await?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ignore the error and hope the network never fails",
          "Put the call inside build() so errors rebuild the screen",
          "Wrap the awaited call in try/catch, and show a friendly message in catch",
          "Call the function twice so the second call fixes the first"
        ],
        "answer": 2,
        "explanation": "try/catch turns a failed Future into a message instead of a crash — real work like network and files must always handle errors."
      },
      {
        "q": "What does this code print, and in what order?\nvoid main() {\n  print('Start');\n  Future.delayed(const Duration(seconds: 1), () => 'Data').then((v) => print('Got $v'));\n  print('End');\n}",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Start, End, Got Data",
          "Start, Got Data, End",
          "Got Data, Start, End",
          "End, Start, Got Data"
        ],
        "answer": 0,
        "explanation": "The delayed Future runs in the background, so 'End' prints at once and 'Got Data' only arrives a second later — the code does not wait without an await."
      },
      {
        "q": "True or False: A Future completes instantly, as soon as it is created.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — a Future starts pending and completes later, with either a value or an error; that waiting time is the whole point of it."
      },
      {
        "q": "You need one user profile from an API, shown once when a screen opens. Should you use a Future or a Stream?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A Stream, because every API call needs a Stream",
          "A Stream, because a Future cannot carry API data",
          "A Future, because Streams cannot be shown on screen",
          "A Future, because it delivers one value once"
        ],
        "answer": 3,
        "explanation": "One answer, once, is exactly a Future's job — a Stream is for values that keep arriving over time, like chat messages."
      },
      {
        "q": "You must fetch a user first, then fetch that user's posts using the user's id. Which code sequences the two calls correctly?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "final user = await fetchUser(); final posts = await fetchPosts(user.id);",
          "final posts = await fetchPosts(user.id); final user = await fetchUser();",
          "final user = fetchUser(); final posts = fetchPosts(user.id);",
          "final posts = fetchPosts(0); final user = await fetchUser();"
        ],
        "answer": 0,
        "explanation": "The second call depends on the first call's result, so you must await the user first — only then does user.id exist to pass into the posts call."
      },
      {
        "q": "A screen must show loading, then the value or an error message. What does the async flow diagram in this lesson say the correct order is?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Show the value first, then loading, then the error",
          "Block the UI until the work finishes, then show the result",
          "Start the work, show loading while it runs, then show the value or the error",
          "Show an error first, then retry, then show loading"
        ],
        "answer": 2,
        "explanation": "The flow is start, loading, then result or error — never block the UI thread waiting, because a frozen screen looks broken."
      }
    ],
    "questions_hi": [
      {
        "q": "Dart me Future<String> ka kya matlab hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek String jo abhi maujood hai",
          "Ek vaada ki String baad me milegi",
          "Ek list of Strings jo time ke saath badhti hai",
          "Device par saved ek String"
        ],
        "answer": 1,
        "explanation": "Future baad me milne wale value ka vaada hai, khud value nahi — jab tak wo pending hai, app chalti rehti hai."
      },
      {
        "q": "Future ke saath kaam karte waqt async aur await ka kya kaam hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "async code ko fast banata hai, await use slow karta hai",
          "async data ko disk par save karta hai, aur await use wapas padhta hai",
          "async batata hai function ek Future return karega, aur await us function ko tab tak rokta hai jab tak Future complete na ho",
          "async naya app start karta hai, aur await use band karta hai"
        ],
        "answer": 2,
        "explanation": "async ka matlab function Future return karega, aur await sirf us function ko rokta hai jab tak result na aa jaye — phir seedha plain value milta hai."
      },
      {
        "q": "True ya False: await poori app ko freeze kar deta hai jab tak slow kaam khatam na ho.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — sirf await karne wala function rukta hai; button, animation aur baaki app wait ke dauraan chalti rehti hai."
      },
      {
        "q": ".then() aur await me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          ".then() sirf error ke liye hai, jabki await sirf success ke liye hai",
          ".then() app ko freeze karta hai, jabki await kuch rokta hi nahi",
          ".then() ek Stream return karta hai, jabki await ek List return karta hai",
          ".then() Future success hone par ek function chalata hai, jabki await function ko rok kar seedha plain value deta hai"
        ],
        "answer": 3,
        "explanation": ".then() caller par async lagaye bina success ka callback attach karta hai, jabki await se wahi code upar se neeche seedha padha ja sakta hai."
      },
      {
        "q": "Ek network call fail ho sakti hai. async/await ke saath uska error handle karne ka sahi tareeqa kaunsa hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Error ko ignore karo aur ummeed karo network kabhi fail na ho",
          "Call ko build() ke andar daalo taaki error screen ko rebuild kar de",
          "Await wali call ko try/catch me lapeto, aur catch me ek friendly message dikhao",
          "Function ko do baar call karo taaki doosri call pehli ko fix kar de"
        ],
        "answer": 2,
        "explanation": "try/catch failed Future ko crash ki jagah ek message bana deta hai — network aur file jaise real kaam me error handle karna zaroori hai."
      },
      {
        "q": "Ye code kya print karega, aur kis order me?\nvoid main() {\n  print('Start');\n  Future.delayed(const Duration(seconds: 1), () => 'Data').then((v) => print('Got $v'));\n  print('End');\n}",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Start, End, Got Data",
          "Start, Got Data, End",
          "Got Data, Start, End",
          "End, Start, Got Data"
        ],
        "answer": 0,
        "explanation": "Delayed Future background me chalta hai, isliye 'End' turant print hota hai aur 'Got Data' ek second baad aata hai — bina await ke code wait nahi karta."
      },
      {
        "q": "True ya False: Ek Future banate hi turant complete ho jata hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — Future pehle pending hota hai aur baad me complete hota hai, value ke saath ya error ke saath; ye wait hi uska asli matlab hai."
      },
      {
        "q": "Screen khulte hi API se ek user profile ek baar dikhani hai. Future use karna chahiye ya Stream?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Stream, kyunki har API call ke liye Stream chahiye",
          "Stream, kyunki Future API data carry nahi kar sakta",
          "Future, kyunki Stream ko screen par dikhaya nahi ja sakta",
          "Future, kyunki ye ek value ek baar deta hai"
        ],
        "answer": 3,
        "explanation": "Ek answer, ek baar, bilkul Future ka kaam hai — Stream un values ke liye hai jo time ke saath aati rehti hain, jaise chat messages."
      },
      {
        "q": "Pehle user fetch karna hai, phir us user ki id se uske posts fetch karne hain. Dono calls ko sahi order me kaunsa code chalata hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "final user = await fetchUser(); final posts = await fetchPosts(user.id);",
          "final posts = await fetchPosts(user.id); final user = await fetchUser();",
          "final user = fetchUser(); final posts = fetchPosts(user.id);",
          "final posts = fetchPosts(0); final user = await fetchUser();"
        ],
        "answer": 0,
        "explanation": "Doosri call pehli call ke result par depend karti hai, isliye pehle user ko await karna zaroori hai — tabhi user.id posts wali call me bheja ja sakta hai."
      },
      {
        "q": "Ek screen par loading, phir value ya error message dikhana hai. Is lesson ke async flow diagram ke hisaab se sahi order kaunsa hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Pehle value dikhao, phir loading, phir error",
          "Kaam khatam hone tak UI ko block karo, phir result dikhao",
          "Kaam start karo, chalte waqt loading dikhao, phir value ya error dikhao",
          "Pehle error dikhao, phir retry karo, phir loading dikhao"
        ],
        "answer": 2,
        "explanation": "Flow hai start, loading, phir result ya error — UI thread ko wait karke kabhi block mat karo, kyunki frozen screen tooti hui lagti hai."
      }
    ]
  },
  {
    "id": "quiz-20-json",
    "lessonId": "lesson-20-json",
    "title": "Quiz: Working with JSON Data",
    "questions_en": [
      {
        "q": "What is JSON, structurally?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A Dart class with methods",
          "A binary file that only servers can read",
          "Text shaped like Dart Maps and Lists, with objects in { } and lists in [ ]",
          "A database table stored on the phone"
        ],
        "answer": 2,
        "explanation": "JSON is text shaped like Maps and Lists: curly braces make an object and square brackets make a list, with string keys in double quotes."
      },
      {
        "q": "What is the job of a model's fromJson factory?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "fromJson converts a JSON Map into a typed model object",
          "fromJson converts a model object into JSON text",
          "fromJson sends JSON to a server",
          "fromJson checks whether JSON text is valid English"
        ],
        "answer": 0,
        "explanation": "fromJson takes a JSON Map in and gives a typed object out — it is used when data arrives, so the rest of the app never touches raw keys."
      },
      {
        "q": "True or False: toJson converts a model object into JSON.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — toJson is the reverse of fromJson: object in, JSON Map out, used when data is sent or saved locally."
      },
      {
        "q": "What states does FutureBuilder move through for a Future, in the order you should check them?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Loading, then data, then error",
          "Waiting, then data only",
          "Waiting, then error, then data",
          "Error, then waiting, then data"
        ],
        "answer": 2,
        "explanation": "FutureBuilder rebuilds as its Future changes state — waiting shows a spinner, an error shows a message, and data shows the real UI."
      },
      {
        "q": "An API sometimes leaves out a user's nickname. What is the null-safe way to parse that field in fromJson?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Make every field required and let the app crash if one is missing",
          "Make an optional field nullable, or give it a ?? fallback value",
          "Parse the JSON twice, once for each missing field",
          "Use dynamic for every field so types never matter"
        ],
        "answer": 1,
        "explanation": "An optional field should be nullable (String?) or carry a ?? fallback — deciding for every field beats hoping the API always sends it."
      },
      {
        "q": "This fromJson crashes when the API response has no 'nickname' field. What is the correct fix?\nfactory User.fromJson(Map<String, dynamic> json) {\n  return User(name: json['name'] as String, nickname: json['nickname'] as String);\n}",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "nickname: json['nickname'] as String,",
          "nickname: json['nickname']! as String,",
          "nickname: json['nickname'] as int,",
          "nickname: json['nickname'] as String?,"
        ],
        "answer": 3,
        "explanation": "json['nickname'] as String crashes when the field is missing, because a null cannot be cast to String — as String? accepts the missing value."
      },
      {
        "q": "True or False: FutureBuilder needs a Future to work.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — FutureBuilder needs a Future to watch; without one there is no waiting, error or data state for it to show."
      },
      {
        "q": "Why should you check snapshot.hasData before reading snapshot.data?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "snapshot.data is never null, so no check is needed",
          "Check hasError last, after reading the data",
          "Check snapshot.hasData before using snapshot.data!",
          "Skip the check and always show a loading spinner"
        ],
        "answer": 2,
        "explanation": "snapshot.hasData confirms real data exists before you read snapshot.data! — checking data first can show a stale or empty state."
      },
      {
        "q": "You receive this API JSON text: {\"name\": \"Asha\", \"age\": 21}. Which code correctly turns it into a User model?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "final user = User(jsonText);",
          "final user = User.fromJson(jsonDecode(jsonText));",
          "final user = jsonEncode(jsonText);",
          "final user = User.toJson(jsonDecode(jsonText));"
        ],
        "answer": 1,
        "explanation": "jsonDecode turns the text into a Map, and fromJson turns that Map into a typed User — the two steps together are the standard parse path."
      },
      {
        "q": "Why is a model class better than passing the raw JSON Map around the app?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "A model gives compiler-checked field access and autocomplete, while a raw Map lets a typo'd key fail only at runtime",
          "A model makes JSON smaller when sent over the network",
          "A model removes the need for fromJson entirely",
          "A raw Map cannot hold numbers, only Strings"
        ],
        "answer": 0,
        "explanation": "A raw Map lets you typo a key like json['nmae'] and only find out at runtime, while a model gives compiler-checked user.name and autocomplete."
      }
    ],
    "questions_hi": [
      {
        "q": "Structure ke hisaab se JSON kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Methods wali ek Dart class",
          "Ek binary file jo sirf server padh sakta hai",
          "Text jo Dart Map aur List jaisa dikhta hai, object { } me aur list [ ] me",
          "Phone par stored ek database table"
        ],
        "answer": 2,
        "explanation": "JSON text hai jo Map aur List jaisa dikhta hai: curly braces se object banta hai aur square brackets se list, keys double quotes me strings hoti hain."
      },
      {
        "q": "Ek model ke fromJson factory ka kya kaam hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "fromJson JSON Map ko typed model object banata hai",
          "fromJson model object ko JSON text banata hai",
          "fromJson JSON ko server par bhejta hai",
          "fromJson check karta hai ki JSON text sahi English hai ya nahi"
        ],
        "answer": 0,
        "explanation": "fromJson JSON Map lekar typed object deta hai — ye data aane par use hota hai, taaki baaki app kabhi raw keys ko na chhoo."
      },
      {
        "q": "True ya False: toJson model object ko JSON me convert karta hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — toJson fromJson ka ulta hai: object andar, JSON Map bahar, jo data bhejte ya locally save karte waqt use hota hai."
      },
      {
        "q": "FutureBuilder ek Future ke liye kin states se guzarta hai, aur unhe kis order me check karna chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Loading, phir data, phir error",
          "Sirf waiting, phir data",
          "Waiting, phir error, phir data",
          "Error, phir waiting, phir data"
        ],
        "answer": 2,
        "explanation": "FutureBuilder Future ki state badalne par rebuild karta hai — waiting par spinner, error par message, aur data par asli UI."
      },
      {
        "q": "API kabhi-kabhi user ka nickname nahi bhejti. fromJson me us field ko null-safe tareeqe se kaise parse karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Har field ko required banao aur field missing ho to app crash hone do",
          "Optional field ko nullable banao, ya use ?? fallback value do",
          "JSON ko do baar parse karo, har missing field ke liye ek baar",
          "Har field ke liye dynamic use karo taaki types kabhi matter na karein"
        ],
        "answer": 1,
        "explanation": "Optional field ko nullable (String?) banana chahiye ya ?? fallback dena chahiye — har field ke liye faisla karna, ummeed karne se behtar hai ki API use hamesha bhejegi."
      },
      {
        "q": "Ye fromJson tab crash karta hai jab API response me 'nickname' field nahi hoti. Sahi fix kaunsa hai?\nfactory User.fromJson(Map<String, dynamic> json) {\n  return User(name: json['name'] as String, nickname: json['nickname'] as String);\n}",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "nickname: json['nickname'] as String,",
          "nickname: json['nickname']! as String,",
          "nickname: json['nickname'] as int,",
          "nickname: json['nickname'] as String?,"
        ],
        "answer": 3,
        "explanation": "json['nickname'] as String tab crash karta hai jab field missing ho, kyunki null ko String me cast nahi kiya ja sakta — as String? missing value ko accept kar leta hai."
      },
      {
        "q": "True ya False: FutureBuilder ko kaam karne ke liye ek Future chahiye.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — FutureBuilder ko dekhne ke liye ek Future chahiye; uske bina na waiting state hogi, na error, na data state."
      },
      {
        "q": "snapshot.data padhne se pehle snapshot.hasData kyon check karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "snapshot.data kabhi null nahi hota, isliye koi check zaroori nahi",
          "hasError ko sabse aakhir me check karo, data padhne ke baad",
          "snapshot.data! use karne se pehle snapshot.hasData check karo",
          "Check skip karo aur hamesha loading spinner dikhao"
        ],
        "answer": 2,
        "explanation": "snapshot.hasData confirm karta hai ki asli data maujood hai, tabhi snapshot.data! padhna safe hai — pehle data check karne se stale ya khaali state dikh sakti hai."
      },
      {
        "q": "Tumhe ye API JSON text milta hai: {\"name\": \"Asha\", \"age\": 21}. Ise User model me sahi tareeqe se kaunsa code badalta hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "final user = User(jsonText);",
          "final user = User.fromJson(jsonDecode(jsonText));",
          "final user = jsonEncode(jsonText);",
          "final user = User.toJson(jsonDecode(jsonText));"
        ],
        "answer": 1,
        "explanation": "jsonDecode text ko Map banata hai, aur fromJson us Map ko typed User banata hai — dono steps mil kar standard parse path hai."
      },
      {
        "q": "Poori app me raw JSON Map ghumane se model class kyon behtar hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Model compiler-checked field access aur autocomplete deta hai, jabki raw Map me typo wali key sirf runtime par fail hoti hai",
          "Model network par JSON ko chhota bana deta hai",
          "Model se fromJson ki zaroorat hi khatam ho jati hai",
          "Raw Map me number nahi hote, sirf Strings hote hain"
        ],
        "answer": 0,
        "explanation": "Raw Map me json['nmae'] jaisi typo sirf runtime par pata chalti hai, jabki model compiler-checked user.name aur autocomplete deta hai."
      }
    ]
  },
  {
    "id": "quiz-21-apis",
    "lessonId": "lesson-21-apis",
    "title": "Quiz: Fetching from APIs",
    "questions_en": [
      {
        "q": "What is the difference between a GET request and a POST request?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "GET sends data, POST reads data",
          "GET and POST both only read data",
          "GET reads data, POST sends data",
          "GET deletes data, POST updates data"
        ],
        "answer": 2,
        "explanation": "GET only reads data and POST sends data to create something — mixing them up means a read could accidentally create data on the server."
      },
      {
        "q": "What does http.get() return?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A Response right away, with no waiting",
          "A Future that completes with a Response",
          "A Stream of Responses over time",
          "A JSON Map already parsed"
        ],
        "answer": 1,
        "explanation": "Network calls take time, so http.get returns a Future<Response> — you await it, then check its statusCode and body."
      },
      {
        "q": "True or False: It is safe to hardcode an API key directly in your Dart code.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — anything shipped in the app can be read out of it, so a key in code is a key already shared; real keys belong behind a backend proxy."
      },
      {
        "q": "What does a response status code of 200 mean?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "200 means OK, the request succeeded",
          "200 means the page was not found",
          "200 means the server crashed",
          "200 means the user is not allowed"
        ],
        "answer": 0,
        "explanation": "Status 200 means OK — the request succeeded, so only then is it safe to parse the body as JSON."
      },
      {
        "q": "A screen fetches users from an API. Which states must its UI handle?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Only the data state, because loading and errors are rare",
          "Loading, error and data — all three states",
          "Only loading and data, because errors are handled by the server",
          "Only the error state, because success is assumed"
        ],
        "answer": 1,
        "explanation": "A network screen is unfinished with only the data state — loading must show a spinner, and an error must show a message plus a Retry button."
      },
      {
        "q": "A request can fail with no internet, a 404, or a 500. What is the correct error-handling path for it?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Parse response.body as JSON first, then check the status code",
          "Show the raw SocketException text to the user",
          "Retry the request forever until it works",
          "Check the statusCode before parsing, inside try/catch, and show a friendly retry message on failure"
        ],
        "answer": 3,
        "explanation": "Checking the status first avoids parsing an HTML error page as JSON, and try/catch turns a lost connection into a friendly message instead of a crash."
      },
      {
        "q": "True or False: Dio is like the http package but with extras, such as interceptors.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — Dio is an HTTP client like http, but it adds extras: a baseUrl set once, timeouts, automatic JSON decoding, and interceptors."
      },
      {
        "q": "What is a Dio interceptor used for?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "An interceptor adds the login token header to every request automatically",
          "An interceptor makes the internet connection faster",
          "An interceptor stores API keys safely in the app",
          "An interceptor replaces the need for a server"
        ],
        "answer": 0,
        "explanation": "An interceptor runs on every request in one place, so one fix to the token logic fixes every API call instead of copy-pasting it into each screen."
      },
      {
        "q": "You are building a full API screen for a list of posts from https://example.com/api/posts. Which sequence is the correct full call flow?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Parse the body first, then show loading, then check the status",
          "Show loading, send the request, check the statusCode, then show data or an error with Retry",
          "Show data first, then fetch it in the background",
          "Show an error, then loading, then retry automatically forever"
        ],
        "answer": 1,
        "explanation": "The full flow is: show loading, send the request, check the status before parsing, then show data — or an error message with Retry on failure."
      },
      {
        "q": "A small app makes one simple GET call, but a bigger app will need auth headers on every request. Which http vs Dio choice is right?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Dio is always required, even for one simple GET call",
          "http is enough for a simple app; Dio is the better pick when the app grows and needs interceptors, timeouts and a shared baseUrl",
          "http cannot make GET requests, only Dio can",
          "Dio is only for sending images, never for JSON APIs"
        ],
        "answer": 1,
        "explanation": "http is deliberately small and enough for simple apps, while Dio earns its place when an app grows and needs interceptors, timeouts and a shared baseUrl."
      }
    ],
    "questions_hi": [
      {
        "q": "GET request aur POST request me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "GET data bhejta hai, POST data padhta hai",
          "GET aur POST dono sirf data padhte hain",
          "GET data padhta hai, POST data bhejta hai",
          "GET data delete karta hai, POST data update karta hai"
        ],
        "answer": 2,
        "explanation": "GET sirf data padhta hai aur POST data bhej kar kuch create karta hai — inhe ulta karne se ek read galti se server par data create kar sakta hai."
      },
      {
        "q": "http.get() kya return karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Turant ek Response, bina wait kiye",
          "Ek Future jo Response ke saath complete hota hai",
          "Time ke saath Responses ka ek Stream",
          "Pehle se parsed ek JSON Map"
        ],
        "answer": 1,
        "explanation": "Network call me time lagta hai, isliye http.get ek Future<Response> return karta hai — use await karo, phir uska statusCode aur body check karo."
      },
      {
        "q": "True ya False: Apni Dart code me API key seedha hardcode karna safe hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — app me shipped koi bhi cheez app se padhi ja sakti hai, isliye code me key matlab pehle se shared key; asli keys backend proxy ke peeche honi chahiye."
      },
      {
        "q": "Response ka status code 200 kya batata hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "200 ka matlab OK hai, request success hui",
          "200 ka matlab page nahi mila",
          "200 ka matlab server crash ho gaya",
          "200 ka matlab user ko permission nahi hai"
        ],
        "answer": 0,
        "explanation": "Status 200 ka matlab OK hai — request success hui, isliye tabhi body ko JSON ki tarah parse karna safe hai."
      },
      {
        "q": "Ek screen API se users fetch karti hai. Uski UI ko kin states ko handle karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Sirf data state, kyunki loading aur error rare hote hain",
          "Loading, error aur data — teeno states",
          "Sirf loading aur data, kyunki error server handle karta hai",
          "Sirf error state, kyunki success assume ki jati hai"
        ],
        "answer": 1,
        "explanation": "Sirf data state wali network screen adhoori hai — loading par spinner dikhna chahiye, aur error par message ke saath Retry button."
      },
      {
        "q": "Ek request no internet, 404, ya 500 se fail ho sakti hai. Uske liye sahi error-handling path kaunsa hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Pehle response.body ko JSON parse karo, phir status code check karo",
          "User ko raw SocketException text dikhao",
          "Request ko hamesha retry karte raho jab tak wo kaam na kare",
          "Parse karne se pehle statusCode check karo, try/catch ke andar, aur fail hone par friendly retry message dikhao"
        ],
        "answer": 3,
        "explanation": "Pehle status check karne se HTML error page ko JSON samajh kar parse karne se bacha ja sakta hai, aur try/catch lost connection ko crash ki jagah friendly message bana deta hai."
      },
      {
        "q": "True ya False: Dio http package jaisa hai, par usme interceptors jaise extras hain.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — Dio http jaisa HTTP client hai, par usme extras hain: ek baar set hone wala baseUrl, timeouts, automatic JSON decoding, aur interceptors."
      },
      {
        "q": "Dio interceptor kis kaam aata hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Interceptor har request par login token header automatically add karta hai",
          "Interceptor internet connection ko fast bana deta hai",
          "Interceptor API keys ko app me safely store karta hai",
          "Interceptor server ki zaroorat khatam kar deta hai"
        ],
        "answer": 0,
        "explanation": "Interceptor har request par ek hi jagah chalta hai, isliye token logic ka ek fix har API call ko fix kar deta hai, har screen me copy-paste karne ki jagah."
      },
      {
        "q": "Tum https://example.com/api/posts se posts ki list ke liye ek poori API screen bana rahe ho. Sahi poora call flow kaunsa sequence hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Pehle body parse karo, phir loading dikhao, phir status check karo",
          "Loading dikhao, request bhejo, statusCode check karo, phir data ya Retry ke saath error dikhao",
          "Pehle data dikhao, phir use background me fetch karo",
          "Error dikhao, phir loading dikhao, phir hamesha automatically retry karo"
        ],
        "answer": 1,
        "explanation": "Poora flow hai: loading dikhao, request bhejo, parse karne se pehle status check karo, phir data dikhao — ya fail hone par Retry ke saath error message."
      },
      {
        "q": "Ek chhoti app ek simple GET call karti hai, par ek badi app ko har request par auth headers chahiye. http vs Dio me sahi choice kaunsi hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Dio hamesha zaroori hai, ek simple GET call ke liye bhi",
          "Simple app ke liye http kaafi hai; jab app badi ho aur har request par interceptors, timeouts aur shared baseUrl chahiye, tab Dio behtar pick hai",
          "http GET request nahi kar sakta, sirf Dio kar sakta hai",
          "Dio sirf images bhejne ke liye hai, JSON API ke liye kabhi nahi"
        ],
        "answer": 1,
        "explanation": "http jaanboojh kar chhota hai aur simple app ke liye kaafi hai, jabki Dio tab apni jagah banata hai jab app badi ho aur use interceptors, timeouts aur shared baseUrl chahiye."
      }
    ]
  },
  {
    "id": "quiz-22-streams",
    "lessonId": "lesson-22-streams",
    "title": "Quiz: Streams & Real-time Data",
    "questions_en": [
      {
        "q": "What is the difference between a Stream and a Future?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A Future gives many values over time, a Stream gives one value once",
          "A Stream gives many values over time, a Future gives one value once",
          "Both give exactly one value once",
          "Both give values forever, with no difference"
        ],
        "answer": 1,
        "explanation": "A Future gives one value once, while a Stream keeps delivering values over time — that ongoing flow is what makes live data live."
      },
      {
        "q": "What is the job of StreamBuilder?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "StreamBuilder rebuilds the UI on every new Stream event, using the latest value",
          "StreamBuilder only builds the UI once and never updates",
          "StreamBuilder converts a Stream into a Future",
          "StreamBuilder only works for chat apps"
        ],
        "answer": 0,
        "explanation": "StreamBuilder rebuilds the UI on every new Stream event, with snapshot.data always holding the latest value."
      },
      {
        "q": "True or False: A broadcast Stream can have many listeners at the same time.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — a broadcast Stream allows many listeners at once, unlike a default single-subscription Stream that allows only one."
      },
      {
        "q": "What is the job of a StreamController?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A StreamController only stores the latest value on disk",
          "A StreamController converts a Future into a Widget",
          "A StreamController creates a Stream and pushes values into it with add(), and must be closed when done",
          "A StreamController replaces StreamBuilder entirely"
        ],
        "answer": 2,
        "explanation": "The controller is the tap that feeds values in with add(), its stream is the pipe listeners subscribe to, and it must be closed in dispose."
      },
      {
        "q": "When should you pick a broadcast Stream over a single-subscription Stream?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Always use broadcast, because it is the default",
          "Use broadcast when two parts of the app need the same live feed; a single screen is fine with single-subscription",
          "Never use broadcast, because it replays old events",
          "Use broadcast only for Futures, never for Streams"
        ],
        "answer": 1,
        "explanation": "Broadcast is for when two parts of the app need the same live feed, like a chat list and an unread-count badge — a single screen is fine with single-subscription."
      },
      {
        "q": "Two StreamBuilders listen to the same Stream and the app throws 'Stream has already been listened to.' What is the correct fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Delete one StreamBuilder and show only half the UI",
          "Convert the Stream to a Future",
          "Convert the Stream with asBroadcastStream() so both listeners can listen",
          "Call StreamBuilder twice with the same widget key"
        ],
        "answer": 2,
        "explanation": "Two StreamBuilders mean two listeners on a single-subscription Stream, which throws — converting it with asBroadcastStream() allows both listeners."
      },
      {
        "q": "True or False: StreamBuilder needs initial data to work.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — StreamBuilder does not need initial data; 'waiting' only means no value has arrived yet, and the Stream may keep going for hours."
      },
      {
        "q": "What is the difference between using StreamBuilder and calling listen() on a Stream?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "StreamBuilder subscribes, rebuilds on each event and unsubscribes for you; listen() means you manage the subscription yourself",
          "listen() rebuilds widgets automatically, StreamBuilder does not",
          "listen() is for UI and StreamBuilder is for background work",
          "There is no difference; they are the same API"
        ],
        "answer": 0,
        "explanation": "StreamBuilder handles subscribing, rebuilding on each event, and unsubscribing when the widget leaves — manual listen means managing all of that yourself."
      },
      {
        "q": "You are building a real-time chat screen where new messages must appear the moment they arrive. Which flow is correct?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A FutureBuilder that fetches the messages once when the screen opens",
          "A Stream of chat messages shown with a StreamBuilder that rebuilds on every new message",
          "A timer plus setState that polls the server every second",
          "A StreamController that is never closed"
        ],
        "answer": 1,
        "explanation": "The chat messages are an ongoing Stream, StreamBuilder rebuilds the list on each new message, and the UI never cares where the values come from."
      },
      {
        "q": "When does a Stream beat a Future for showing live data like scores or chat messages?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "A Stream is only useful for timers, never for live data",
          "A Stream pushes each update the moment it exists, while polling wastes work asking again and again",
          "A Future is faster because it never waits",
          "A Stream works offline, while a Future needs the internet"
        ],
        "answer": 1,
        "explanation": "Polling asks again and again, which is wasteful and laggy — a Stream pushes each update the moment it exists, which is what real-time actually means."
      }
    ],
    "questions_hi": [
      {
        "q": "Stream aur Future me kya farq hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Future time ke saath kai values deta hai, Stream ek value ek baar deta hai",
          "Stream time ke saath kai values deta hai, Future ek value ek baar deta hai",
          "Dono bilkul ek value ek baar dete hain",
          "Dono hamesha values dete hain, koi farq nahi"
        ],
        "answer": 1,
        "explanation": "Future ek value ek baar deta hai, jabki Stream time ke saath values deta rehta hai — ye lagataar flow hi live data ko live banata hai."
      },
      {
        "q": "StreamBuilder ka kya kaam hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "StreamBuilder har naye Stream event par UI rebuild karta hai, latest value ke saath",
          "StreamBuilder UI ko sirf ek baar banata hai aur kabhi update nahi karta",
          "StreamBuilder Stream ko Future me convert karta hai",
          "StreamBuilder sirf chat app ke liye kaam karta hai"
        ],
        "answer": 0,
        "explanation": "StreamBuilder har naye Stream event par UI rebuild karta hai, aur snapshot.data me hamesha latest value hoti hai."
      },
      {
        "q": "True ya False: Ek broadcast Stream par ek saath kai listeners ho sakte hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — broadcast Stream par ek saath kai listeners ho sakte hain, jabki default single-subscription Stream par sirf ek listener hota hai."
      },
      {
        "q": "StreamController ka kya kaam hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "StreamController sirf latest value ko disk par store karta hai",
          "StreamController Future ko Widget me convert karta hai",
          "StreamController ek Stream banata hai aur add() se usme values daalta hai, aur kaam khatam hone par use close karna zaroori hai",
          "StreamController StreamBuilder ko poori tarah replace kar deta hai"
        ],
        "answer": 2,
        "explanation": "Controller wo tap hai jo add() se values daalta hai, uska stream wo pipe hai jise listeners subscribe karte hain, aur use dispose me close karna zaroori hai."
      },
      {
        "q": "Single-subscription Stream ki jagah broadcast Stream kab pick karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Hamesha broadcast use karo, kyunki ye default hai",
          "Broadcast tab use karo jab app ke do hisso ko wahi live feed chahiye; ek screen ke liye single-subscription kaafi hai",
          "Broadcast kabhi use mat karo, kyunki ye purane events replay karta hai",
          "Broadcast sirf Future ke liye use karo, Stream ke liye kabhi nahi"
        ],
        "answer": 1,
        "explanation": "Broadcast tab chahiye jab app ke do hisso ko wahi live feed chahiye, jaise chat list aur unread-count badge — ek screen ke liye single-subscription kaafi hai."
      },
      {
        "q": "Do StreamBuilder ek hi Stream ko sun rahe hain aur app 'Stream has already been listened to.' error deti hai. Sahi fix kaunsa hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Ek StreamBuilder delete karo aur sirf aadhi UI dikhao",
          "Stream ko Future me convert karo",
          "Stream ko asBroadcastStream() se convert karo taaki dono listeners sun sakein",
          "Dono StreamBuilder ko wahi widget key de kar do baar call karo"
        ],
        "answer": 2,
        "explanation": "Do StreamBuilder matlab single-subscription Stream par do listeners, jo error deta hai — use asBroadcastStream() se convert karne par dono listeners sun sakte hain."
      },
      {
        "q": "True ya False: StreamBuilder ko kaam karne ke liye initial data chahiye.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — StreamBuilder ko initial data ki zaroorat nahi; 'waiting' ka matlab sirf ye hai ki abhi tak koi value nahi aayi, aur Stream ghanton chal sakta hai."
      },
      {
        "q": "Stream par StreamBuilder use karne aur listen() call karne me kya farq hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "StreamBuilder subscribe karta hai, har event par rebuild karta hai aur khud unsubscribe karta hai; listen() me subscription khud manage karni padti hai",
          "listen() widgets ko automatically rebuild karta hai, StreamBuilder nahi karta",
          "listen() UI ke liye hai aur StreamBuilder background kaam ke liye hai",
          "Koi farq nahi; dono wahi API hain"
        ],
        "answer": 0,
        "explanation": "StreamBuilder subscribe karta hai, har event par rebuild karta hai, aur widget hatne par unsubscribe kar deta hai — manual listen me ye sab khud manage karna padta hai."
      },
      {
        "q": "Tum ek real-time chat screen bana rahe ho jahan naye messages aate hi dikhne chahiye. Sahi flow kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Ek FutureBuilder jo screen khulte hi messages ko ek baar fetch kare",
          "Chat messages ka ek Stream jo StreamBuilder se dikhaya jaye aur har naye message par rebuild ho",
          "Ek timer plus setState jo har second server ko poll kare",
          "Ek StreamController jo kabhi close na ho"
        ],
        "answer": 1,
        "explanation": "Chat messages ek lagataar Stream hain, StreamBuilder har naye message par list rebuild karta hai, aur UI ko farq nahi padta ki values kahan se aa rahi hain."
      },
      {
        "q": "Scores ya chat messages jaise live data dikhane ke liye Stream Future se kab behtar hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Stream sirf timer ke liye useful hai, live data ke liye kabhi nahi",
          "Stream har update usi waqt push karta hai jab wo hoti hai, jabki polling baar-baar poochh kar kaam waste karta hai",
          "Future fast hai kyunki wo kabhi wait nahi karta",
          "Stream offline kaam karta hai, jabki Future ko internet chahiye"
        ],
        "answer": 1,
        "explanation": "Polling baar-baar poochhta hai, jo wasteful aur slow hai — Stream har update usi waqt push karta hai jab wo hoti hai, aur real-time ka asli matlab yehi hai."
      }
    ]
  },
  {
    "id": "quiz-23-local-save",
    "lessonId": "lesson-23-local-save",
    "title": "Quiz: Saving Data Locally",
    "questions_en": [
      {
        "q": "What does SharedPreferences store?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "SharedPreferences stores simple key-value pairs on the device",
          "SharedPreferences stores full SQL tables with joins",
          "SharedPreferences stores files on a server",
          "SharedPreferences stores only images"
        ],
        "answer": 0,
        "explanation": "SharedPreferences stores simple key-value pairs on the device — one key, one simple value, with no tables and no queries."
      },
      {
        "q": "Which calls correctly save and read a dark-mode setting with SharedPreferences?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "prefs.save('dark_mode', true) and prefs.load('dark_mode')",
          "SharedPreferences.open() and prefs.readBool()",
          "prefs.set('dark_mode') with no await",
          "await SharedPreferences.getInstance(), then await prefs.setBool('dark_mode', true) to save and prefs.getBool('dark_mode') to read"
        ],
        "answer": 3,
        "explanation": "You await SharedPreferences.getInstance() once, then await setBool() to save and use getBool() to read — every save returns a Future."
      },
      {
        "q": "True or False: SharedPreferences is a good fit for large data like hundreds of notes that must be searched.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — key-value storage has no queries, so lists of user content that must be searched or sorted quickly outgrow it; that is Lesson 24's database job."
      },
      {
        "q": "Which of these is a good use case for SharedPreferences?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A searchable list of 500 notes",
          "A theme choice, an onboarding-done flag, or a language setting",
          "Orders linked to their items",
          "Photos that must be sorted by date"
        ],
        "answer": 1,
        "explanation": "Settings are the classic use case: each setting has one key, like 'dark_mode' or 'seen_intro', and is never queried across other values."
      },
      {
        "q": "Saved values are read asynchronously. How should an app handle reading them so the UI does not flash from the default to the saved value?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Read the value inside build() every time, with no caching",
          "Load saved values early, before the first screen builds, so the UI never flashes from default to saved",
          "Read the value only after the user taps a button",
          "Save the value twice, so the second save acts as the read"
        ],
        "answer": 2,
        "explanation": "Reads are async even though they are fast, so load saved values early — before the first screen builds — or the UI flashes from the default to the saved value."
      },
      {
        "q": "On the very first launch, nothing is saved yet. Which code reads the dark-mode setting safely?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "final darkMode = prefs.getBool('dark_mode')!;",
          "final darkMode = prefs.getBool('dark_mode') ?? false;",
          "final darkMode = prefs.getBool('dark_mode') as bool;",
          "final darkMode = prefs.setBool('dark_mode', false);"
        ],
        "answer": 1,
        "explanation": "On first launch nothing is saved yet, so getBool returns null — the ?? fallback is what turns that null into a safe default instead of a crash."
      },
      {
        "q": "True or False: SharedPreferences is a database.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — SharedPreferences is key-value storage, not a database: it has no tables, no rows and no queries."
      },
      {
        "q": "How do you persist a theme choice so it survives restarts?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Save only, never load, so the theme resets on restart",
          "Load in build() and save in dispose()",
          "setState first, then save whenever the app closes",
          "Load the saved value in initState, then in the toggle handler save first and call setState after"
        ],
        "answer": 3,
        "explanation": "Persisting a theme means: load the saved value in initState, save it in the toggle handler first, then setState — so the stored value and the screen never disagree."
      },
      {
        "q": "Build the save flow for a settings screen with a dark-mode switch that remembers itself across restarts. Which flow is correct?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Load in build() on every rebuild, save in dispose(), and use ! on the read",
          "Load once in initState via a helper, save in the toggle handler before setState, with a ?? fallback for first launch",
          "Save only when the app closes, and never load at all",
          "Read synchronously in initState without await, then save after setState"
        ],
        "answer": 1,
        "explanation": "Load once in initState through a helper (initState itself cannot be async), save in the toggle handler before setState, and always fall back with ?? for the first launch."
      },
      {
        "q": "When is SharedPreferences enough, and when should you move to a database instead?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "SharedPreferences is enough when each value has one key and you never need to query across values",
          "SharedPreferences is enough for any amount of data, as long as it is saved slowly",
          "SharedPreferences is enough only when the app never restarts",
          "SharedPreferences is enough when the data must be searched and sorted"
        ],
        "answer": 0,
        "explanation": "If every value has one key and you never need to query across values, key-value is enough — the moment you encode a whole list under one key, you need a database."
      }
    ],
    "questions_hi": [
      {
        "q": "SharedPreferences kya store karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "SharedPreferences device par simple key-value pairs store karta hai",
          "SharedPreferences joins wali poori SQL tables store karta hai",
          "SharedPreferences server par files store karta hai",
          "SharedPreferences sirf images store karta hai"
        ],
        "answer": 0,
        "explanation": "SharedPreferences device par simple key-value pairs store karta hai — ek key, ek simple value, na table, na query."
      },
      {
        "q": "SharedPreferences se dark-mode setting ko save aur read karne wali sahi calls kaunsi hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "prefs.save('dark_mode', true) aur prefs.load('dark_mode')",
          "SharedPreferences.open() aur prefs.readBool()",
          "Bina await ke prefs.set('dark_mode')",
          "await SharedPreferences.getInstance(), phir save ke liye await prefs.setBool('dark_mode', true) aur read ke liye prefs.getBool('dark_mode')"
        ],
        "answer": 3,
        "explanation": "Ek baar await SharedPreferences.getInstance() karo, phir save ke liye await setBool() aur read ke liye getBool() use karo — har save ek Future return karta hai."
      },
      {
        "q": "True ya False: SharedPreferences bade data ke liye achha fit hai, jaise search karne wale sau notes.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — key-value storage me query nahi hoti, isliye search karne wali badi lists jaise sau notes usse jaldi badi ho jati hain; wo Lesson 24 ke database ka kaam hai."
      },
      {
        "q": "Inme se SharedPreferences ke liye achha use case kaunsa hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Search karne wali 500 notes ki list",
          "Ek theme choice, onboarding-done flag, ya language setting",
          "Apne items se linked orders",
          "Date se sort karne wali photos"
        ],
        "answer": 1,
        "explanation": "Settings classic use case hain: har setting ki ek key hoti hai, jaise 'dark_mode' ya 'seen_intro', aur use doosri values ke saath kabhi query nahi karna padta."
      },
      {
        "q": "Saved values asynchronously read hoti hain. UI ko default se saved value par flash hone se bachane ke liye unhe kaise handle karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Har baar build() ke andar value read karo, bina caching ke",
          "Saved values ko jaldi load karo, pehli screen banne se pehle, taaki UI default se saved value par flash na kare",
          "Value sirf tab read karo jab user button tap kare",
          "Value ko do baar save karo, taaki doosri save hi read ka kaam kare"
        ],
        "answer": 2,
        "explanation": "Read fast hone ke baad bhi async hai, isliye saved values ko jaldi load karo — pehli screen banne se pehle — warna UI default se saved value par flash karegi."
      },
      {
        "q": "Bilkul pehli launch par abhi kuch save nahi hua hai. Dark-mode setting ko safely padhne wala kaunsa code hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "final darkMode = prefs.getBool('dark_mode')!;",
          "final darkMode = prefs.getBool('dark_mode') ?? false;",
          "final darkMode = prefs.getBool('dark_mode') as bool;",
          "final darkMode = prefs.setBool('dark_mode', false);"
        ],
        "answer": 1,
        "explanation": "Pehli launch par kuch save nahi hota, isliye getBool null return karta hai — ?? fallback hi us null ko crash ki jagah safe default banata hai."
      },
      {
        "q": "True ya False: SharedPreferences ek database hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — SharedPreferences key-value storage hai, database nahi: isme na table hoti hai, na row, na query."
      },
      {
        "q": "Theme choice ko restart ke baad bhi yaad rakhne ke liye use kaise persist karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Sirf save karo, kabhi load mat karo, taaki theme restart par reset ho jaye",
          "build() me load karo aur dispose() me save karo",
          "Pehle setState karo, phir app band hone par kabhi save karo",
          "initState me saved value load karo, phir toggle handler me pehle save karo aur uske baad setState call karo"
        ],
        "answer": 3,
        "explanation": "Theme persist karne ka matlab hai: initState me saved value load karo, toggle handler me pehle save karo, phir setState karo — taaki stored value aur screen kabhi disagree na karein."
      },
      {
        "q": "Ek settings screen ka save flow banao jisme dark-mode switch restart ke baad bhi khud ko yaad rakhe. Sahi flow kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har rebuild par build() me load karo, dispose() me save karo, aur read par ! lagao",
          "initState me helper se ek baar load karo, toggle handler me setState se pehle save karo, pehli launch ke liye ?? fallback ke saath",
          "Sirf tab save karo jab app band ho, aur kabhi load mat karo",
          "initState me bina await ke synchronously read karo, phir setState ke baad save karo"
        ],
        "answer": 1,
        "explanation": "initState me helper se ek baar load karo (initState khud async nahi ho sakta), toggle handler me setState se pehle save karo, aur pehli launch ke liye hamesha ?? fallback rakho."
      },
      {
        "q": "SharedPreferences kab kaafi hai, aur database par kab move karna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "SharedPreferences tab kaafi hai jab har value ki ek key ho aur values ke across kabhi query na karni ho",
          "SharedPreferences kisi bhi amount ke data ke liye kaafi hai, bas use dheere save karo",
          "SharedPreferences tabhi kaafi hai jab app kabhi restart na ho",
          "SharedPreferences tab kaafi hai jab data ko search aur sort karna ho"
        ],
        "answer": 0,
        "explanation": "Agar har value ki ek key hai aur values ke across kabhi query nahi karni, to key-value kaafi hai — jis waqt ek key ke neeche poori list encode karne lago, tab database chahiye."
      }
    ]
  },
  {
    "id": "quiz-24-local-database",
    "lessonId": "lesson-24-local-database",
    "title": "Quiz: Local Database",
    "questions_en": [
      {
        "q": "Why does a real database beat SharedPreferences for lists of user content like notes?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A database needs the internet, while SharedPreferences does not",
          "Key-value has no queries, so searching and sorting real lists gets slow and messy — a database gives tables and real queries",
          "A database stores fewer items than SharedPreferences",
          "A database is only for settings, not for user content"
        ],
        "answer": 1,
        "explanation": "Key-value has no queries, so finding one note means loading everything and searching by hand — a database gives structured tables and real queries instead."
      },
      {
        "q": "In a database table, what are columns and rows?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Columns are notes and rows are databases",
          "Columns are users and rows are apps",
          "Columns are fields (id, title, body) and rows are individual notes",
          "Columns are queries and rows are tables"
        ],
        "answer": 2,
        "explanation": "A table is a spreadsheet: columns are fields like id, title and body, and each row is one individual note."
      },
      {
        "q": "True or False: sqflite is SQL running on the device.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — sqflite is Flutter's SQLite plugin: a real relational database stored as one file on the device, working fully offline with no server."
      },
      {
        "q": "What does CRUD stand for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Copy, Read, Upload, Download",
          "Create, Rename, Undo, Delete",
          "Create, Read, Update, Delete",
          "Connect, Run, Update, Debug"
        ],
        "answer": 2,
        "explanation": "CRUD is the four operations every database app needs: Create, Read, Update and Delete."
      },
      {
        "q": "Which query correctly reads only the note with id 3 from the 'notes' table?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "await db.query('notes');",
          "await db.query('notes', where: 'id = ?', whereArgs: [3]);",
          "await db.delete('notes');",
          "await db.insert('notes', {'id': 3});"
        ],
        "answer": 1,
        "explanation": "db.query with where 'id = ?' and whereArgs [3] asks for exactly that row, safely — the ? placeholder is filled from whereArgs, which also guards against SQL injection."
      },
      {
        "q": "You add a new column to the notes table in an update. How do you handle the schema change for users who already have the app?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Raise the database version and handle the schema change in onUpgrade, for example with ALTER TABLE",
          "Delete the database file so the app recreates it empty",
          "Keep version at 1 and hope old users never update",
          "Tell users to uninstall and reinstall the app"
        ],
        "answer": 0,
        "explanation": "Raising the version and handling the change in onUpgrade migrates the existing table safely — deleting the user's data to 'fix' a schema change destroys their notes."
      },
      {
        "q": "True or False: Hive is a SQL database.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — Hive is NoSQL: it stores Dart objects directly in boxes, with no tables and no SQL."
      },
      {
        "q": "What is the offline-first rule?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "The local database is the truth; the UI reads locally and the network only syncs in the background",
          "The app never uses the internet at all",
          "All data lives only on the server",
          "The app shows a blank screen until the server replies"
        ],
        "answer": 0,
        "explanation": "Offline-first means the local database is the truth: the UI always reads locally, and the network only syncs in the background, so the app works with no connection."
      },
      {
        "q": "Design storage for a notes app with 500 notes that must be searchable, sortable by date, and editable one at a time. Which design is correct?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Store all 500 notes as one JSON string under a single SharedPreferences key",
          "Use a sqflite 'notes' table with id, title and body columns, queried and sorted by the database",
          "Store each note in a separate file with no index",
          "Keep the notes only in memory while the app is open"
        ],
        "answer": 1,
        "explanation": "Notes must be searched and sorted, which key-value cannot do — a sqflite table with id, title and body gives queries, sorting and per-row updates and deletes."
      },
      {
        "q": "When should you pick sqflite over Hive, and vice versa?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Always pick sqflite, because Hive cannot store objects",
          "Pick Hive for simple object lists with no searching, and sqflite when you need filtering, sorting or joins",
          "Always pick Hive, because sqflite cannot work offline",
          "Pick by which package name is shorter"
        ],
        "answer": 1,
        "explanation": "Choose by query need, not fashion: objects in and out with no searching suits Hive, while filtering, sorting and joining relations suit sqflite."
      }
    ],
    "questions_hi": [
      {
        "q": "Notes jaise user content ki lists ke liye asli database SharedPreferences se kyon behtar hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Database ko internet chahiye, jabki SharedPreferences ko nahi",
          "Key-value me query nahi hoti, isliye asli lists ko search aur sort karna slow aur messy ho jata hai — database tables aur asli queries deta hai",
          "Database SharedPreferences se kam items store karta hai",
          "Database sirf settings ke liye hai, user content ke liye nahi"
        ],
        "answer": 1,
        "explanation": "Key-value me query nahi hoti, isliye ek note dhoondhne ke liye sab kuch load karke haath se search karna padta hai — database structured tables aur asli queries deta hai."
      },
      {
        "q": "Ek database table me columns aur rows kya hote hain?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Columns notes hote hain aur rows databases hoti hain",
          "Columns users hote hain aur rows apps hoti hain",
          "Columns fields hote hain (id, title, body) aur rows alag-alag notes hoti hain",
          "Columns queries hote hain aur rows tables hoti hain"
        ],
        "answer": 2,
        "explanation": "Table ek spreadsheet hai: columns fields hote hain jaise id, title aur body, aur har row ek alag note hoti hai."
      },
      {
        "q": "True ya False: sqflite device par chalne wala SQL hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "True — sqflite Flutter ka SQLite plugin hai: device par ek file me stored asli relational database, jo bina server ke poori tarah offline kaam karta hai."
      },
      {
        "q": "CRUD ka full form kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Copy, Read, Upload, Download",
          "Create, Rename, Undo, Delete",
          "Create, Read, Update, Delete",
          "Connect, Run, Update, Debug"
        ],
        "answer": 2,
        "explanation": "CRUD wo chaar operations hain jo har database app ko chahiye: Create, Read, Update aur Delete."
      },
      {
        "q": "'notes' table se sirf id 3 wala note padhne wali sahi query kaunsi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "await db.query('notes');",
          "await db.query('notes', where: 'id = ?', whereArgs: [3]);",
          "await db.delete('notes');",
          "await db.insert('notes', {'id': 3});"
        ],
        "answer": 1,
        "explanation": "where 'id = ?' aur whereArgs [3] ke saath db.query bilkul wahi row maangta hai, safely — ? placeholder whereArgs se bharta hai, jo SQL injection se bhi bachata hai."
      },
      {
        "q": "Ek update me notes table me naya column add kar rahe ho. Jo users ke paas app pehle se hai, unke liye schema change kaise handle karna chahiye?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Database version badhao aur schema change ko onUpgrade me handle karo, jaise ALTER TABLE se",
          "Database file delete karo taaki app use khaali dobara banaye",
          "Version 1 par hi rakho aur ummeed karo purane users kabhi update na karein",
          "Users ko app uninstall karke dobara install karne ko kaho"
        ],
        "answer": 0,
        "explanation": "Version badhana aur change ko onUpgrade me handle karna maujooda table ko safely migrate karta hai — schema change 'fix' karne ke liye user ka data delete karne se unke notes khatam ho jayenge."
      },
      {
        "q": "True ya False: Hive ek SQL database hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "False — Hive NoSQL hai: ye Dart objects ko seedha boxes me store karta hai, bina table aur bina SQL ke."
      },
      {
        "q": "Offline-first rule kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Local database hi sach hai; UI locally padhti hai aur network sirf background me sync karta hai",
          "App internet ka kabhi use hi nahi karti",
          "Saara data sirf server par rehta hai",
          "App server ke reply tak blank screen dikhati hai"
        ],
        "answer": 0,
        "explanation": "Offline-first ka matlab hai local database hi sach hai: UI hamesha locally padhti hai, aur network sirf background me sync karta hai, isliye app bina connection ke bhi kaam karti hai."
      },
      {
        "q": "Ek notes app ka storage design karo jisme 500 notes hon, jo searchable hon, date se sortable hon, aur ek-ek karke editable hon. Sahi design kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Saare 500 notes ko ek JSON string ki tarah ek hi SharedPreferences key ke neeche store karo",
          "id, title aur body columns wali sqflite 'notes' table use karo, jise database query aur sort kare",
          "Har note ko bina index ke alag file me store karo",
          "Notes ko sirf tab tak memory me rakho jab tak app khuli hai"
        ],
        "answer": 1,
        "explanation": "Notes ko search aur sort karna hai, jo key-value nahi kar sakta — id, title aur body columns wali sqflite table queries, sorting aur ek-ek row ka update aur delete deti hai."
      },
      {
        "q": "sqflite ko Hive par kab pick karna chahiye, aur vice versa?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Hamesha sqflite pick karo, kyunki Hive objects store nahi kar sakta",
          "Bina searching wali simple object lists ke liye Hive pick karo, aur filtering, sorting ya joins ke liye sqflite",
          "Hamesha Hive pick karo, kyunki sqflite offline kaam nahi kar sakta",
          "Us package ko pick karo jiska naam chhota ho"
        ],
        "answer": 1,
        "explanation": "Query need se choose karo, fashion se nahi: bina searching ke simple object lists ke liye Hive suit karta hai, jabki filtering, sorting aur joins ke liye sqflite suit karta hai."
      }
    ]
  },
  {
    "id": "quiz-25-firebase",
    "lessonId": "lesson-25-firebase",
    "title": "Quiz: Firebase Integration",
    "questions_en": [
      {
        "q": "What is the main job of Firebase Auth in a Flutter app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Storing photos in the cloud",
          "Drawing the app's user interface",
          "Speeding up app animations",
          "Handling sign-in and the signed-in user"
        ],
        "answer": 3,
        "explanation": "Firebase Auth owns login and the current user, so your app only checks currentUser instead of managing passwords itself."
      },
      {
        "q": "In Firestore, how is data organised?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Tables, then rows, then columns",
          "Collections, then documents, then fields",
          "Folders, then apps, then screens",
          "Lists, then widgets, then states"
        ],
        "answer": 1,
        "explanation": "Firestore groups data into collections of documents, and each document holds fields — that shape is why it is called a document database."
      },
      {
        "q": "Firestore real-time listeners update the UI automatically whenever the data changes.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "A snapshots() stream pushes each change to the UI, so no refresh button or repeat get() call is needed for live data."
      },
      {
        "q": "In Google sign-in, what happens after Google confirms who the user is?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The app stores the user's Google password",
          "The app creates its own separate password database",
          "Google's proof of identity is handed to Firebase as a credential",
          "The user must also type an email and password"
        ],
        "answer": 2,
        "explanation": "Google only proves identity; Firebase still owns the account, so the result ends at the same currentUser as email sign-in."
      },
      {
        "q": "What is the purpose of Firestore security rules?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Deciding on Google's servers who can read or write each document",
          "Making the app's screens look consistent",
          "Storing user passwords safely in the app",
          "Compressing data so downloads are faster"
        ],
        "answer": 0,
        "explanation": "Rules are checked on the server, not in app code, because anyone can call Firestore directly — app-side checks alone are never security."
      },
      {
        "q": "A signed-in user tries to read a note and gets a 'permission denied' error, but other users' notes load fine for them. What is the most likely cause?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The note's ownerId does not match the signed-in user's ID, so the rule blocks it",
          "The user forgot to call runApp",
          "The note was never added to the collection",
          "The phone has no internet connection at all"
        ],
        "answer": 0,
        "explanation": "Owner-only rules compare resource.data.ownerId with request.auth.uid, so a document owned by someone else is refused even for a signed-in user."
      },
      {
        "q": "Firebase Auth stores user passwords inside your Flutter app.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Your app only sends the password to Firebase, which stores it securely — never keep passwords in your own app code or database."
      },
      {
        "q": "Which Firestore call updates only the 'text' field of a note, leaving its other fields untouched?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "doc(id).delete()",
          "collection('notes').get()",
          "doc(id).set({'text': text})",
          "doc(id).update({'text': text})"
        ],
        "answer": 3,
        "explanation": "update() changes only the fields you pass, while plain set() without merge would wipe the document's other fields."
      },
      {
        "q": "A new user signs up in your notes app, writes a note, then logs in on another phone. Which flow makes their note appear there?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Save the note only on the first phone's local storage",
          "Save the note under a shared document that every user can edit",
          "Save the note in Firestore with the user's ownerId, then read it back with a query on that ownerId after sign-in",
          "Ask the user to retype the note on the second phone"
        ],
        "answer": 2,
        "explanation": "Auth identifies the same user on both phones, and the ownerId links their documents to them, so the query returns exactly their notes anywhere."
      },
      {
        "q": "Which setup order is correct before using Firebase Auth or Firestore?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Use Auth first, then run flutterfire configure",
          "Run flutterfire configure to generate firebase_options.dart, then await Firebase.initializeApp in main() before any Firebase service is used",
          "Edit firebase_options.dart by hand, then skip initializeApp",
          "Add firebase_auth only, then call Firestore without firebase_core"
        ],
        "answer": 1,
        "explanation": "The CLI generates the config, and initializeApp must finish first — calling a Firebase service before it gives a 'not initialized' error."
      }
    ],
    "questions_hi": [
      {
        "q": "Flutter app me Firebase Auth ka main kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Photos ko cloud me store karna",
          "App ka user interface banana",
          "App ke animations ko fast karna",
          "Sign-in aur login hue user ko handle karna"
        ],
        "answer": 3,
        "explanation": "Firebase Auth login aur current user ko sambhalta hai, isliye app ko khud passwords manage karne ki zaroorat nahi hoti."
      },
      {
        "q": "Firestore me data kaise organise hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Tables, phir rows, phir columns",
          "Collections, phir documents, phir fields",
          "Folders, phir apps, phir screens",
          "Lists, phir widgets, phir states"
        ],
        "answer": 1,
        "explanation": "Firestore data ko documents ki collections me rakhta hai, aur har document me fields hoti hain — isi shape ki wajah se ye document database kehlata hai."
      },
      {
        "q": "Firestore ke real-time listeners data badalte hi UI ko apne aap update kar dete hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "snapshots() stream har change ko UI tak pahuncha deta hai, isliye live data ke liye refresh button ya baar-baar get() ki zaroorat nahi hoti."
      },
      {
        "q": "Google sign-in me Google ki pehchaan confirm hone ke baad kya hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App user ka Google password store kar leti hai",
          "App apna alag password database bana leti hai",
          "Google ki pehchaan ka proof Firebase ko credential ke roop me diya jaata hai",
          "User ko email aur password bhi type karna hi padta hai"
        ],
        "answer": 2,
        "explanation": "Google sirf pehchaan prove karta hai; account phir bhi Firebase ka hi hota hai, isliye end me wahi currentUser milta hai jo email sign-in me milta hai."
      },
      {
        "q": "Firestore security rules ka purpose kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Google ke servers par ye tay karna ki kaun sa document kaun padh ya likh sakta hai",
          "App ki screens ko ek jaisa dikhana",
          "User ke passwords ko app me safely store karna",
          "Data ko compress karna taaki download fast ho"
        ],
        "answer": 0,
        "explanation": "Rules server par check hoti hain, app code me nahi, kyunki koi bhi Firestore ko seedha call kar sakta hai — sirf app-side check kabhi security nahi hota."
      },
      {
        "q": "Ek login hua user ek note padhne ki koshish karta hai aur 'permission denied' error milta hai, jabki doosre users ke notes usko dikh jaate hain. Sabse likely wajah kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Us note ka ownerId login hue user ki ID se match nahi karta, isliye rule usko rok deta hai",
          "User runApp call karna bhool gaya",
          "Wo note kabhi collection me add hi nahi hua tha",
          "Phone me internet hi nahi hai"
        ],
        "answer": 0,
        "explanation": "Owner-only rules resource.data.ownerId ko request.auth.uid se match karti hain, isliye kisi aur ke document ko login user bhi nahi khol sakta."
      },
      {
        "q": "Firebase Auth user ke passwords ko tumhari Flutter app ke andar store karta hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Tumhari app password sirf Firebase ko bhejti hai, jo use securely rakhta hai — passwords ko kabhi apne app code ya database me mat rakho."
      },
      {
        "q": "Firestore me note ka sirf 'text' field update karne ke liye, baaki fields ko chhede bina, kaun sa call use hoga?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "doc(id).delete()",
          "collection('notes').get()",
          "doc(id).set({'text': text})",
          "doc(id).update({'text': text})"
        ],
        "answer": 3,
        "explanation": "update() sirf wahi fields badalta hai jo tum doge, jabki bina merge ke set() document ke baaki saare fields mita dega."
      },
      {
        "q": "Ek naya user notes app me sign up karta hai, ek note likhta hai, phir doosre phone par login karta hai. Kaun sa flow uska note wahan dikhayega?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Note ko sirf pehle phone ke local storage me save karo",
          "Note ko ek shared document me save karo jise har user edit kar sake",
          "Note ko Firestore me user ke ownerId ke saath save karo, phir sign-in ke baad usi ownerId par query karke wapas padho",
          "User se doosre phone par note dobara likhwao"
        ],
        "answer": 2,
        "explanation": "Auth dono phones par ek hi user ko pehchanta hai, aur ownerId uske documents ko usse jodta hai, isliye query sirf uske notes wapas laati hai, kahin bhi."
      },
      {
        "q": "Firebase Auth ya Firestore use karne se pehle kaun sa setup order sahi hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Pehle Auth use karo, phir flutterfire configure chalao",
          "flutterfire configure chalakar firebase_options.dart banao, phir main() me Firebase.initializeApp ka await poora karo, uske baad hi koi Firebase service use karo",
          "firebase_options.dart ko haath se edit karo, phir initializeApp skip kar do",
          "Sirf firebase_auth add karo, phir firebase_core ke bina Firestore call karo"
        ],
        "answer": 1,
        "explanation": "CLI config banata hai, aur initializeApp pehle poora hona chahiye — usse pehle koi Firebase service call karoge to 'not initialized' error aayega."
      }
    ]
  },
  {
    "id": "quiz-26-storage-push",
    "lessonId": "lesson-26-storage-push",
    "title": "Quiz: Firebase Storage & Push Notifications",
    "questions_en": [
      {
        "q": "What is Firebase Storage mainly for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Small text values in documents",
          "Profile photos and other large files",
          "Security rules for the whole app",
          "The app's navigation routes"
        ],
        "answer": 2,
        "explanation": "Firestore is built for small structured data, while Storage is built for big files like photos and documents — using each for its job keeps the app fast."
      },
      {
        "q": "Which order describes the image upload flow?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Pick the file, upload it with putFile, then get the download URL",
          "Get the download URL first, then upload the file",
          "Save the image bytes inside a Firestore document",
          "Upload the file, then delete the Storage reference"
        ],
        "answer": 0,
        "explanation": "The upload puts the file in Storage, and only after it finishes does getDownloadURL() give you a link you can show and save."
      },
      {
        "q": "Firestore security rules also protect files in Firebase Storage.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Storage has its own rules, checked separately — securing Firestore carefully leaves Storage wide open if you forget its rules."
      },
      {
        "q": "What does FCM use to find the right phone for a push notification?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The user's email address",
          "The device's FCM token",
          "The app's version number",
          "The user's password"
        ],
        "answer": 1,
        "explanation": "FCM finds exactly one phone by its token, so without a saved token the server has no address to send that phone's notification to."
      },
      {
        "q": "What is the correct flow for saving a user's new profile photo so it shows on any device?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Upload with putFile, get the download URL, then save that URL in Firestore",
          "Save the image bytes in Firestore and skip Storage",
          "Upload the file and show the local file path on every device",
          "Save the URL in Storage and the file in Firestore"
        ],
        "answer": 0,
        "explanation": "The file lives in Storage and the link lives in Firestore, so the app shows the link with Image.network and can find the photo again later."
      },
      {
        "q": "An image upload succeeds, but the profile photo never shows in the app. What is the most likely cause?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The phone's camera is broken",
          "The upload used the wrong image format",
          "The user is not signed in at all",
          "The download URL was never saved in Firestore, or a Storage rule blocks reading the file"
        ],
        "answer": 3,
        "explanation": "A successful upload only proves Storage received the file; a missing URL in Firestore, or a Storage rule blocking reads, means the app has nothing valid to display."
      },
      {
        "q": "Push notifications can reach a phone even if the app never obtained an FCM token.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "With no token, FCM has no address for that phone — permission plus a saved token are both required before delivery can work."
      },
      {
        "q": "A notification message arrives while the app is open in the foreground, but nothing appears on screen. What should the app do?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Listen with onMessage and display the notification yourself, for example with flutter_local_notifications",
          "Wait — the system shows foreground notifications on its own",
          "Send the notification again from the server",
          "Restart the app so the notification appears"
        ],
        "answer": 0,
        "explanation": "In foreground, FCM delivers the message but never displays it — your onMessage handler must show it yourself, commonly with flutter_local_notifications."
      },
      {
        "q": "Plan the full profile-photo upload flow: pick, upload, then what, so the photo still shows after the user logs in again?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Pick the image and upload it, then stop — the photo will appear by itself",
          "Pick the image, upload it with putFile, get the download URL, and save that URL in the user's Firestore document",
          "Save the local file path in Firestore and skip the upload",
          "Upload the image to Firestore as document bytes"
        ],
        "answer": 1,
        "explanation": "Upload, URL, and Firestore save are three separate steps — skipping the save leaves the next login with no link to show, even though the file exists."
      },
      {
        "q": "Which statement correctly picks between a notification message and a data message?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "A notification message always needs your code to display it, and a data message always shows itself",
          "A notification message has a title and body and is shown automatically in background; a data message carries only data and shows nothing on its own",
          "Both types are shown automatically in every app state",
          "A data message cannot carry navigation information"
        ],
        "answer": 1,
        "explanation": "A notification message carries title and body and is shown by the system in background, while a data message carries only key-value data and your code decides everything."
      }
    ],
    "questions_hi": [
      {
        "q": "Firebase Storage mainly kis kaam ke liye hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Documents me chhote text values",
          "Profile photos aur doosri badi files",
          "Poori app ke security rules",
          "App ke navigation routes"
        ],
        "answer": 2,
        "explanation": "Firestore chhote structured data ke liye bana hai, jabki Storage photos aur documents jaisi badi files ke liye hai — har ek ko uske kaam par lagao to app fast rehti hai."
      },
      {
        "q": "Image upload flow ka sahi order kaun sa hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "File chuno, putFile se upload karo, phir download URL lo",
          "Pehle download URL lo, phir file upload karo",
          "Image ke bytes ko Firestore document me save karo",
          "File upload karo, phir Storage reference delete kar do"
        ],
        "answer": 0,
        "explanation": "Upload file ko Storage me daalta hai, aur upload poora hone ke baad hi getDownloadURL() wo link deta hai jise tum dikha aur save kar sakte ho."
      },
      {
        "q": "Firestore ke security rules Firebase Storage ki files ko bhi protect karte hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Storage ke apne alag rules hote hain, jo alag se check hote hain — Firestore ko carefully secure karne ke baad bhi Storage khula reh jaata hai agar uske rules bhool jao."
      },
      {
        "q": "FCM sahi phone tak push notification pahunchane ke liye kya use karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "User ka email address",
          "Device ka FCM token",
          "App ka version number",
          "User ka password"
        ],
        "answer": 1,
        "explanation": "FCM ek phone ko uske token se dhoondhta hai, isliye saved token ke bina server ke paas us phone par notification bhejne ka address hi nahi hota."
      },
      {
        "q": "User ki nayi profile photo ko kisi bhi device par dikhane ke liye sahi flow kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "putFile se upload karo, download URL lo, phir wo URL Firestore me save karo",
          "Image ke bytes Firestore me save karo aur Storage skip kar do",
          "File upload karo aur har device par local file path dikhao",
          "URL Storage me save karo aur file Firestore me"
        ],
        "answer": 0,
        "explanation": "File Storage me rehti hai aur link Firestore me, isliye app us link ko Image.network se dikhati hai aur photo ko baad me bhi dhoondh sakti hai."
      },
      {
        "q": "Image upload success ho jaata hai, par profile photo app me kabhi nahi dikhti. Sabse likely wajah kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Phone ka camera kharab hai",
          "Upload me galat image format use hua",
          "User bilkul login hi nahi hai",
          "Download URL kabhi Firestore me save hi nahi hua, ya Storage rule file padhne se rok raha hai"
        ],
        "answer": 3,
        "explanation": "Upload ka success hona sirf ye prove karta hai ki Storage ko file mil gayi; agar Firestore me URL save nahi hua ya Storage rule read rok raha hai, to app ke paas dikhane ko kuch valid nahi hai."
      },
      {
        "q": "Push notifications phone tak pahunch sakti hain, bhale hi app ne kabhi FCM token liya hi na ho.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Token ke bina FCM ke paas us phone ka address hi nahi hota — delivery ke liye permission aur saved token dono chahiye hote hain."
      },
      {
        "q": "App khuli hui ho tab notification message aata hai, par screen par kuch nahi dikhta. App ko kya karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "onMessage se suno aur notification khud dikhao, jaise flutter_local_notifications se",
          "Intezaar karo — system foreground notifications apne aap dikha deta hai",
          "Server se notification dobara bhejwao",
          "App restart karo taaki notification dikh jaaye"
        ],
        "answer": 0,
        "explanation": "Foreground me FCM message to pahuncha deta hai par use display kabhi nahi karta — tumhare onMessage handler ko use khud dikhana padta hai, aam taur par flutter_local_notifications se."
      },
      {
        "q": "Profile-photo upload ka poora flow plan karo: pick, upload, phir kya, taaki dobara login karne par bhi photo dikhe?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Image chuno aur upload karo, phir ruk jao — photo apne aap dikh jayegi",
          "Image chuno, putFile se upload karo, download URL lo, aur wo URL user ke Firestore document me save karo",
          "Local file path ko Firestore me save karo aur upload skip kar do",
          "Image ko document bytes ke roop me Firestore me upload karo"
        ],
        "answer": 1,
        "explanation": "Upload, URL aur Firestore save teen alag steps hain — save skip kar doge to dobara login par dikhane ko koi link hi nahi milega, bhale hi file maujood ho."
      },
      {
        "q": "Notification message aur data message ke beech kaun sa statement sahi farak batata hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Notification message ko dikhane ke liye hamesha tumhara code chahiye, aur data message hamesha apne aap dikh jaata hai",
          "Notification message me title aur body hoti hai aur background me wo apne aap dikhta hai; data message me sirf data hota hai aur wo apne aap kuch nahi dikhata",
          "Dono types har app state me apne aap dikh jaate hain",
          "Data message me navigation ki jaankari nahi ho sakti"
        ],
        "answer": 1,
        "explanation": "Notification message me title aur body hoti hai aur background me system use apne aap dikha deta hai, jabki data message me sirf key-value data hota hai aur tumhara code sab kuch tay karta hai."
      }
    ]
  },
  {
    "id": "quiz-27-backend-choices",
    "lessonId": "lesson-27-backend-choices",
    "title": "Quiz: Backend Choices: Supabase & REST",
    "questions_en": [
      {
        "q": "What is the core idea behind Firebase versus Supabase?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Only Firebase offers login and storage",
          "Firebase uses Firestore (NoSQL) and Supabase uses Postgres (SQL), but both are backend-as-a-service",
          "Supabase only works offline",
          "Firebase is open source and Supabase runs only on Google"
        ],
        "answer": 1,
        "explanation": "Both give you auth, database, storage and realtime without a server; the difference is the database underneath — Firestore documents versus Postgres tables."
      },
      {
        "q": "Which pair describes Supabase's auth and database?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Google Auth with Firestore documents",
          "Email login with SQLite on the phone",
          "Supabase Auth with a Postgres database of tables and rows",
          "Anonymous login with Hive boxes"
        ],
        "answer": 2,
        "explanation": "Supabase pairs its own Auth with a Postgres database, and one client — Supabase.instance.client — reaches auth, database, storage and realtime."
      },
      {
        "q": "A custom REST backend is always better than Firebase or Supabase.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "A custom backend adds hosting, security, scaling and upkeep — it is worth it only for a specific need, not by default."
      },
      {
        "q": "When do you actually need your own custom backend?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The app has only two screens",
          "The app needs complex payment logic with refunds and taxes, or must talk to an existing internal system",
          "The app is fully offline",
          "The developer prefers writing Dart code"
        ],
        "answer": 2,
        "explanation": "Payments with refunds and taxes, existing company systems, strict data rules, or special processing are the cases the lesson names — simple apps do not need that cost."
      },
      {
        "q": "How do you use the backend-choice decision diagram?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Check popularity first, then price",
          "Start with a custom backend, then try hosted options",
          "Pick whichever has the most features",
          "Ask in order: need a backend, custom server forced, linked tables, otherwise Firebase"
        ],
        "answer": 3,
        "explanation": "The diagram asks in order: backend needed, custom server forced, linked tables, otherwise Firebase — the first 'yes' that fits ends the search."
      },
      {
        "q": "A small hotel-booking app stores customers, rooms and bookings that link to each other, and must sync across devices. Which backend fits best?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "A custom backend, because every app needs one",
          "Firebase, because bookings are just documents",
          "Supabase, because the data is linked tables like customers, bookings and payments",
          "Local storage only, because bookings never sync"
        ],
        "answer": 2,
        "explanation": "Bookings link customers, rooms and payments, so relation-shaped data fits Postgres tables — while a simple notes app could stay local."
      },
      {
        "q": "Supabase is a Firebase-style backend-as-a-service, but with a SQL database instead of a NoSQL one.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Supabase is Firebase-style — auth, database, storage and realtime without your own server — but its database is SQL tables, not NoSQL documents."
      },
      {
        "q": "What is the safety rule for Supabase keys in a Flutter app?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "The anon key is safe in the app because RLS limits what it can do; the service-role key must never ship in app code",
          "Both keys are safe to ship in the app",
          "The service-role key is the safe one and the anon key must stay secret",
          "No key should ever be used in a Flutter app"
        ],
        "answer": 0,
        "explanation": "The anon key is designed to be public, and Row Level Security decides what it can do — the service-role key bypasses all security and must never ship in app code."
      },
      {
        "q": "You are building a chat app with fast-moving messages and no linked-table structure. Walk it through the decision diagram — where does it land?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Firebase, because chat data is document-shaped and realtime",
          "Supabase, because chat needs SQL joins",
          "A custom REST backend, because chat cannot use hosted backends",
          "Local storage only, because chat messages never leave the phone"
        ],
        "answer": 0,
        "explanation": "The lesson's own walk-through lands chat on Firebase: its data is document-shaped and realtime, with no linked-table structure forcing Supabase."
      },
      {
        "q": "What is the real trade-off between a managed backend and your own backend?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Managed backends are always cheaper at every scale",
          "Your own backend needs no maintenance at all",
          "Managed backends cannot do realtime features",
          "Managed means less work but less control; your own backend means full control but you own hosting, security, scaling and uptime"
        ],
        "answer": 3,
        "explanation": "Managed backends handle hosting, scaling and backups for you, while your own backend gives full control at the price of owning all of that work yourself."
      }
    ],
    "questions_hi": [
      {
        "q": "Firebase vs Supabase ka core idea kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Sirf Firebase login aur storage deta hai",
          "Firebase Firestore (NoSQL) use karta hai aur Supabase Postgres (SQL), par dono backend-as-a-service hain",
          "Supabase sirf offline kaam karta hai",
          "Firebase open source hai aur Supabase sirf Google par chalta hai"
        ],
        "answer": 1,
        "explanation": "Dono auth, database, storage aur realtime dete hain bina server ke; farak sirf andar ke database me hai — Firestore documents vs Postgres tables."
      },
      {
        "q": "Supabase ke auth aur database ka kaun sa pair sahi hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Google Auth ke saath Firestore documents",
          "Phone par SQLite ke saath email login",
          "Supabase Auth ke saath Postgres database, jisme tables aur rows hoti hain",
          "Anonymous login ke saath Hive boxes"
        ],
        "answer": 2,
        "explanation": "Supabase apne Auth ko Postgres database ke saath jodta hai, aur ek hi client — Supabase.instance.client — auth, database, storage aur realtime sab tak pahunchata hai."
      },
      {
        "q": "Custom REST backend hamesha Firebase ya Supabase se better hota hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Custom backend ke saath hosting, security, scaling aur upkeep bhi aata hai — ye sirf tab worth hai jab koi specific zaroorat ho, default me nahi."
      },
      {
        "q": "Apna custom backend asal me kab chahiye hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App me sirf do screens hon",
          "App ko refunds aur taxes wali complex payment logic chahiye, ya use maujood internal system se baat karni hai",
          "App poori tarah offline ho",
          "Developer ko Dart code likhna pasand ho"
        ],
        "answer": 2,
        "explanation": "Refunds aur taxes ke saath payments, maujood company systems, strict data rules, ya special processing — yehi cases lesson me bataye gaye hain, simple apps ko ye cost nahi chahiye."
      },
      {
        "q": "Backend-choice decision diagram ko kaise use karte hain?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Pehle popularity check karo, phir price",
          "Pehle custom backend se shuru karo, phir hosted options try karo",
          "Jo sabse zyada features de, use chuno",
          "Order me poochho: backend chahiye, custom server forced hai, linked tables hain, warna Firebase"
        ],
        "answer": 3,
        "explanation": "Diagram order me poochhta hai: backend chahiye, custom server forced hai, linked tables hain, warna Firebase — pehla 'haan' jo fit ho jaaye, search wahin khatam ho jaati hai."
      },
      {
        "q": "Ek chhota hotel-booking app customers, rooms aur bookings store karta hai jo ek doosre se linked hain, aur devices par sync bhi hona chahiye. Kaun sa backend sabse fit hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Custom backend, kyunki har app ko ek chahiye hi",
          "Firebase, kyunki bookings sirf documents hain",
          "Supabase, kyunki data linked tables hai jaise customers, bookings aur payments",
          "Sirf local storage, kyunki bookings kabhi sync nahi hoti"
        ],
        "answer": 2,
        "explanation": "Bookings customers, rooms aur payments se link hoti hain, isliye relation wala data Postgres tables ko suit karta hai — jabki simple notes app local hi reh sakti thi."
      },
      {
        "q": "Supabase ek Firebase-style backend-as-a-service hai, par NoSQL ki bajay SQL database ke saath.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Supabase Firebase-style hai — bina apne server ke auth, database, storage aur realtime — par uska database SQL tables hai, NoSQL documents nahi."
      },
      {
        "q": "Flutter app me Supabase keys ke liye safety rule kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Anon key app me safe hai kyunki RLS uski limit tay karta hai; service-role key kabhi app code me nahi aani chahiye",
          "Dono keys app me ship karna safe hai",
          "Service-role key safe wali hai aur anon key secret rakhni chahiye",
          "Flutter app me koi key kabhi use hi nahi karni chahiye"
        ],
        "answer": 0,
        "explanation": "Anon key public hone ke liye hi bani hai, aur Row Level Security tay karti hai ki wo kya kar sakti hai — service-role key saari security bypass kar deti hai aur kabhi app code me nahi aani chahiye."
      },
      {
        "q": "Tum ek chat app bana rahe ho, jisme tezi se badalne wale messages hain aur koi linked-table structure nahi hai. Decision diagram se guzaro — ye kahan jaata hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Firebase, kyunki chat data document jaisa aur realtime hai",
          "Supabase, kyunki chat ko SQL joins chahiye",
          "Custom REST backend, kyunki chat hosted backends use nahi kar sakta",
          "Sirf local storage, kyunki chat messages phone se bahar hi nahi jaate"
        ],
        "answer": 0,
        "explanation": "Lesson ka apna walk-through chat ko Firebase par le jaata hai: uska data document jaisa aur realtime hai, aur koi linked-table structure Supabase force nahi karta."
      },
      {
        "q": "Managed backend aur apne backend ke beech asal trade-off kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Managed backends har scale par hamesha saste hote hain",
          "Apne backend ko koi maintenance hi nahi chahiye",
          "Managed backends realtime features nahi de sakte",
          "Managed matlab kam kaam par kam control; apna backend matlab poora control, par hosting, security, scaling aur uptime tumhare zimme"
        ],
        "answer": 3,
        "explanation": "Managed backends tumhare liye hosting, scaling aur backups sambhalte hain, jabki apne backend par tumhe poora control milta hai, par us saare kaam ki zimmedari bhi tumhari hoti hai."
      }
    ]
  },
  {
    "id": "quiz-28-animations",
    "lessonId": "lesson-28-animations",
    "title": "Quiz: Animations",
    "questions_en": [
      {
        "q": "What does an implicit animation do for you?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "You give the new end value and Flutter animates smoothly from the old value to the new one",
          "You control every single frame by hand with a controller",
          "It only works for transitions between two screens",
          "It runs once when the app starts and never again"
        ],
        "answer": 0,
        "explanation": "Implicit means you describe the end state, not the frames — Flutter fills in the movement between old and new values."
      },
      {
        "q": "When does an AnimatedContainer actually animate?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Only the first time the screen opens",
          "When you call an animate() method on it",
          "When one of its properties, like width or colour, changes to a new value",
          "Only when the user taps directly on it"
        ],
        "answer": 2,
        "explanation": "AnimatedContainer watches its own properties — a changed width, colour or padding is what triggers the animation."
      },
      {
        "q": "A Hero animation needs the same tag on both screens.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "The tag is how Flutter matches the two widgets — different tags mean no shared-element flight."
      },
      {
        "q": "What is the job of a curve in an animation?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It sets how long the animation lasts",
          "It controls the speed pattern over time, like easing in slowly or bouncing at the end",
          "It chooses which widget gets animated",
          "It changes the widget's colour"
        ],
        "answer": 1,
        "explanation": "Duration sets the length; the curve shapes the feel — fast start, slow finish, bounce, and so on."
      },
      {
        "q": "A button should smoothly grow when pressed and shrink when released, and you need no frame-by-frame control. What do you pick?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A Hero transition to a new screen",
          "A Tween on its own, with no widget",
          "An explicit animation with an AnimationController",
          "An AnimatedContainer, changing its size value on press and release"
        ],
        "answer": 3,
        "explanation": "Two simple states and no manual control is exactly the implicit case — change the value, let the widget animate."
      },
      {
        "q": "A box should grow when tapped, but nothing moves. The tap handler sets _big = true, yet the width stays the same. What is the most likely bug?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The value changed without setState, so Flutter never rebuilt the widget",
          "The curve chosen is wrong for a growing box",
          "The duration is too long to notice",
          "The Container is not inside a Scaffold"
        ],
        "answer": 0,
        "explanation": "No rebuild means no new value reaches the widget — setState is what tells Flutter to rebuild with the changed value."
      },
      {
        "q": "More animation always means a better user experience.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Animation should guide attention — too much of it distracts, slows the feel, and annoys users."
      },
      {
        "q": "What is the correct basic setup for a Hero transition?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Call Navigator.push with a Hero argument",
          "Add an AnimationController to both screens",
          "Wrap the widget in a Hero with the same tag on both the source and destination screens",
          "Use the same widget type on both screens, with no tag needed"
        ],
        "answer": 2,
        "explanation": "The matching tag is the link — Flutter then flies the widget from one screen to the other."
      },
      {
        "q": "A card should lift and deepen its shadow while pressed, then settle back on release. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A Hero transition to a detail screen on every tap",
          "A static Container with one fixed shadow, changed by rebuilding the whole app",
          "An AnimationController with a Tween, even though only two states exist",
          "AnimatedContainer whose elevation and padding change with the pressed state, toggled in setState"
        ],
        "answer": 3,
        "explanation": "A press is just two states, so an implicit widget is the simplest correct tool — a controller adds work for no gain."
      },
      {
        "q": "What is the over-animation trap?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Choosing a duration that is too short to see",
          "Animating everything on screen, which makes the app feel slow and distracting instead of polished",
          "Using animations always improves an app's store rating",
          "Adding more curves to every animation"
        ],
        "answer": 1,
        "explanation": "Animation is seasoning, not the meal — when everything moves, nothing stands out and the app feels heavy."
      }
    ],
    "questions_hi": [
      {
        "q": "Implicit animation tumhare liye kya karti hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Tum nayi end value de do, aur Flutter purani value se nayi value tak smoothly animate kar deta hai",
          "Tum controller se har ek frame haath se control karte ho",
          "Ye sirf do screens ke beech transition me kaam karti hai",
          "Ye sirf ek baar app start hote waqt chalti hai, phir kabhi nahi"
        ],
        "answer": 0,
        "explanation": "Implicit ka matlab hai end state batao, frames nahi — beech ka movement Flutter khud handle karta hai."
      },
      {
        "q": "AnimatedContainer asal me kab animate hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Sirf pehli baar screen khulne par",
          "Jab tum us par animate() method call karte ho",
          "Jab uski koi property, jaise width ya colour, nayi value me badal jaati hai",
          "Sirf jab user us par directly tap karta hai"
        ],
        "answer": 2,
        "explanation": "AnimatedContainer apni properties par nazar rakhta hai — badli hui width, colour ya padding hi animation trigger karti hai."
      },
      {
        "q": "Hero animation ke liye dono screens par same tag hona zaroori hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Tag hi wo link hai jisse Flutter dono widgets ko match karta hai — alag tags ka matlab koi shared-element flight nahi."
      },
      {
        "q": "Animation me curve ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye tay karta hai animation kitni der chalegi",
          "Ye waqt ke saath speed ka pattern control karta hai, jaise dheere start ya end me bounce",
          "Ye choose karta hai kaunsa widget animate hoga",
          "Ye widget ka colour badalta hai"
        ],
        "answer": 1,
        "explanation": "Duration length tay karti hai, curve feel banata hai — fast start, slow finish, bounce, wagera."
      },
      {
        "q": "Ek button press par smoothly bada ho aur release par chhota ho jaaye, aur tumhe frame-by-frame control nahi chahiye. Tum kya chunoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Nayi screen par Hero transition",
          "Akela Tween, bina kisi widget ke",
          "AnimationController ke saath explicit animation",
          "AnimatedContainer, jisme press aur release par size value badle"
        ],
        "answer": 3,
        "explanation": "Sirf do simple states aur manual control nahi — ye bilkul implicit case hai, value badlo aur widget animate kar dega."
      },
      {
        "q": "Ek box tap par bada hona chahiye, lekin kuch hilta hi nahi. Tap handler _big = true set karta hai, phir bhi width wahi rehti hai. Sabse likely bug kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Value bina setState ke badli, isliye Flutter ne widget ko rebuild hi nahi kiya",
          "Growing box ke liye galat curve chuna gaya hai",
          "Duration itni lambi hai ki dikhta nahi",
          "Container Scaffold ke andar nahi hai"
        ],
        "answer": 0,
        "explanation": "Rebuild nahi hoga to nayi value widget tak pahunchegi hi nahi — setState hi Flutter ko rebuild karne ko kehta hai."
      },
      {
        "q": "Zyaada animation ka matlab hamesha behtar user experience hota hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Animation ka kaam attention guide karna hai — zyaada animation distract karta hai, app slow lagta hai aur users ko pareshan karta hai."
      },
      {
        "q": "Hero transition ka sahi basic setup kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Navigator.push ko Hero argument ke saath call karo",
          "Dono screens par AnimationController add karo",
          "Widget ko Hero me wrap karo, aur source aur destination dono screens par same tag rakho",
          "Dono screens par same widget type use karo, tag ki zaroorat nahi"
        ],
        "answer": 2,
        "explanation": "Matching tag hi link hai — Flutter phir widget ko ek screen se doosri tak uda kar le jaata hai."
      },
      {
        "q": "Ek card press par upar uthe aur uski shadow gehri ho, phir release par wapas settle ho jaaye. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har tap par detail screen tak Hero transition",
          "Ek fixed shadow wala static Container, poora app rebuild karke badla jaaye",
          "AnimationController ke saath Tween, halanki sirf do states hain",
          "AnimatedContainer jiski elevation aur padding pressed state ke saath badle, setState me toggle ho"
        ],
        "answer": 3,
        "explanation": "Press sirf do states hai, isliye implicit widget sabse simple sahi tool hai — controller yahan bina wajah extra kaam hai."
      },
      {
        "q": "Over-animation trap kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Itni chhoti duration chunna jo dikhe hi nahi",
          "Screen par sab kuch animate karna, jisse app slow aur distracting lagta hai, polished nahi",
          "Animations use karne se app ki store rating hamesha badhti hai",
          "Har animation me aur curves add karna"
        ],
        "answer": 1,
        "explanation": "Animation masala hai, khana nahi — jab sab kuch hilta hai to kuch bhi standout nahi karta aur app bhaari lagta hai."
      }
    ]
  },
  {
    "id": "quiz-29-explicit-animations",
    "lessonId": "lesson-29-explicit-animations",
    "title": "Quiz: Explicit Animations",
    "questions_en": [
      {
        "q": "What is the job of an AnimationController?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It draws shapes on a canvas",
          "It drives an animation over time — starting, stopping, repeating, and reversing it",
          "It changes a widget's colour directly",
          "It moves a widget between two screens"
        ],
        "answer": 1,
        "explanation": "The controller owns the timeline — without it, an explicit animation has nothing telling it when to run."
      },
      {
        "q": "What does a Tween do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It disposes the controller when the screen closes",
          "It sets how many frames per second the app renders",
          "It links two screens for a Hero transition",
          "It maps the controller's 0-to-1 progress onto a real range, like 0 to 200 pixels"
        ],
        "answer": 3,
        "explanation": "A controller only counts 0 to 1 — a Tween turns that count into the size, colour or position you actually want."
      },
      {
        "q": "Calling dispose() on an AnimationController prevents memory leaks.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "A live controller keeps ticking after its screen is gone — dispose stops it and frees its resources."
      },
      {
        "q": "What is the job of vsync in an explicit animation?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It picks the animation's curve",
          "It ties animation ticks to the screen's refresh rate so frames are smooth and no work is wasted off-screen",
          "It disposes the controller automatically",
          "It converts a Tween into pixels"
        ],
        "answer": 1,
        "explanation": "Vsync syncs ticks with the display — that is why a TickerProvider is required and why off-screen animation stops."
      },
      {
        "q": "How do you build a staggered animation, where list items fade in one after another?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "One AnimatedContainer per item with the same duration",
          "A Hero tag on every item",
          "One controller, with each item's animation using an Interval that starts later than the previous one",
          "One separate controller per item, all started at the exact same moment"
        ],
        "answer": 2,
        "explanation": "Staggering is one timeline sliced into intervals — each item gets its own slice of the same controller."
      },
      {
        "q": "A screen creates its AnimationController in initState, but the app slowly gets slower after visiting that screen many times. What is the most likely bug?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The controller is never disposed, so every visit leaves a ticking controller behind",
          "The Tween range is too large",
          "The curve is too slow for repeated visits",
          "The controller is created in build() instead of initState"
        ],
        "answer": 0,
        "explanation": "Each leaked controller keeps ticking forever — that is why dispose() must release it when the screen goes away."
      },
      {
        "q": "Explicit animations give you full control over an animation.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "With a controller you choose start, stop, reverse, repeat and exact timing — that control is the whole point of going explicit."
      },
      {
        "q": "How do a curve and a Tween work together in an explicit animation?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "The curve sets the range and the Tween sets the speed",
          "They are two names for the same thing",
          "The Tween disposes the controller and the curve starts it",
          "The Tween maps 0-to-1 progress to a value range, and the curve reshapes that progress over time"
        ],
        "answer": 3,
        "explanation": "Tween answers 'what values', curve answers 'at what pace' — together they define the motion."
      },
      {
        "q": "You must animate a list so items slide in one after another when the screen opens. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A Hero transition for each row",
          "One AnimationController driving per-item animations, each wrapped in an Interval with a later start than the last",
          "A separate controller per item, each started with its own Timer guess",
          "One AnimatedContainer around the whole list with a single duration"
        ],
        "answer": 1,
        "explanation": "Intervals on one controller keep the stagger exact and in sync — separate timers drift and are hard to manage."
      },
      {
        "q": "A loading spinner must loop forever, and a button should only pulse once on tap. What is the right pick?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Implicit animation for both, since both are simple",
          "Explicit animation for both, because looping and one-shot timing need controller control",
          "Explicit for the spinner only; the pulse is also explicit since its timing must be triggered exactly on tap",
          "Hero transitions for both"
        ],
        "answer": 2,
        "explanation": "Looping forever and firing exactly on tap both need a controller's repeat and forward — implicit widgets cannot express that control."
      }
    ],
    "questions_hi": [
      {
        "q": "AnimationController ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye canvas par shapes draw karta hai",
          "Ye animation ko waqt ke saath chalata hai — start, stop, repeat aur reverse karta hai",
          "Ye widget ka colour directly badalta hai",
          "Ye widget ko do screens ke beech move karta hai"
        ],
        "answer": 1,
        "explanation": "Controller timeline ka malik hai — iske bina explicit animation ko chalane wala koi nahi hota."
      },
      {
        "q": "Tween kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye screen band hote waqt controller ko dispose karta hai",
          "Ye tay karta hai app ek second me kitne frames render karegi",
          "Ye Hero transition ke liye do screens ko jodta hai",
          "Ye controller ki 0-to-1 progress ko asli range me badalta hai, jaise 0 se 200 pixels"
        ],
        "answer": 3,
        "explanation": "Controller sirf 0 se 1 tak ginta hai — Tween us ginati ko wo size, colour ya position bana deta hai jo tumhe chahiye."
      },
      {
        "q": "AnimationController par dispose() call karne se memory leaks rokti hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Zinda controller screen jaane ke baad bhi tick karta rehta hai — dispose use rokta hai aur resources free karta hai."
      },
      {
        "q": "Explicit animation me vsync ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye animation ka curve choose karta hai",
          "Ye animation ticks ko screen ke refresh rate se jodta hai, taaki frames smooth rahen aur off-screen kaam waste na ho",
          "Ye controller ko automatically dispose karta hai",
          "Ye Tween ko pixels me convert karta hai"
        ],
        "answer": 1,
        "explanation": "Vsync ticks ko display se sync karta hai — isliye TickerProvider zaroori hai aur off-screen animation ruk jaati hai."
      },
      {
        "q": "Staggered animation kaise banate ho, jisme list items ek ke baad ek fade in hon?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Har item ke liye ek AnimatedContainer, sabki same duration",
          "Har item par ek Hero tag",
          "Ek controller, aur har item ki animation ek Interval use kare jo pichhle item se baad me start ho",
          "Har item ke liye alag controller, sab ek hi waqt par start hon"
        ],
        "answer": 2,
        "explanation": "Staggering matlab ek timeline ko intervals me kaatna — har item ko usi controller ka apna slice milta hai."
      },
      {
        "q": "Ek screen initState me AnimationController banati hai, lekin us screen par baar-baar jaane se app dheere-dheere slow ho jaati hai. Sabse likely bug kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Controller kabhi dispose nahi hota, isliye har visit ek tick karta hua controller chhod jaata hai",
          "Tween ki range bahut badi hai",
          "Baar-baar visits ke liye curve bahut slow hai",
          "Controller initState ki jagah build() me ban raha hai"
        ],
        "answer": 0,
        "explanation": "Har leaked controller hamesha tick karta rehta hai — isliye screen jaate waqt dispose() se use free karna zaroori hai."
      },
      {
        "q": "Explicit animations tumhe animation par poora control deti hain.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Controller ke saath tum start, stop, reverse, repeat aur exact timing choose karte ho — ye control hi explicit ka poora point hai."
      },
      {
        "q": "Explicit animation me curve aur Tween ek saath kaise kaam karte hain?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Curve range tay karta hai aur Tween speed tay karta hai",
          "Ye dono ek hi cheez ke do naam hain",
          "Tween controller ko dispose karta hai aur curve use start karta hai",
          "Tween 0-to-1 progress ko value range me badalta hai, aur curve us progress ko waqt ke saath reshape karta hai"
        ],
        "answer": 3,
        "explanation": "Tween batata hai 'kaunsi values', curve batata hai 'kis pace par' — dono milkar motion define karte hain."
      },
      {
        "q": "Tumhe ek list aise animate karni hai ki screen khulte waqt items ek ke baad ek slide in hon. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Har row ke liye ek Hero transition",
          "Ek AnimationController jo har item ki animation chalaye, har ek Interval me wrap ho aur pichhle se baad me start ho",
          "Har item ke liye alag controller, har ek apne Timer guess se start ho",
          "Poori list ke around ek AnimatedContainer, ek hi duration ke saath"
        ],
        "answer": 1,
        "explanation": "Ek controller par Intervals stagger ko exact aur sync me rakhte hain — alag timers drift karte hain aur manage karna mushkil hai."
      },
      {
        "q": "Ek loading spinner hamesha loop karna chahiye, aur ek button tap par sirf ek baar pulse karna chahiye. Sahi pick kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Dono ke liye implicit animation, kyunki dono simple hain",
          "Dono ke liye explicit animation, kyunki looping aur one-shot timing ko controller control chahiye",
          "Sirf spinner ke liye explicit; pulse bhi explicit hai kyunki uski timing tap par exactly trigger honi chahiye",
          "Dono ke liye Hero transitions"
        ],
        "answer": 2,
        "explanation": "Hamesha loop karna aur tap par exactly fire hona dono ko controller ka repeat aur forward chahiye — implicit widgets ye control de hi nahi sakte."
      }
    ]
  },
  {
    "id": "quiz-30-custom-ui",
    "lessonId": "lesson-30-custom-ui",
    "title": "Quiz: Custom UI: Painters & Clippers",
    "questions_en": [
      {
        "q": "What is the job of a CustomPainter?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It animates a widget between two states",
          "It clips a widget into a custom shape",
          "It draws anything you want — lines, curves, shapes — directly on a canvas",
          "It builds the widget tree for a screen"
        ],
        "answer": 2,
        "explanation": "When no built-in widget can draw what you need, CustomPainter lets you paint it yourself, pixel by pixel."
      },
      {
        "q": "What does ClipPath do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It animates a widget's size",
          "It adds a shadow to a widget",
          "It draws a shape on a canvas",
          "It cuts a widget into a custom shape, hiding everything outside the clip path"
        ],
        "answer": 3,
        "explanation": "Clipping is about the outline — the widget keeps its content, but only the part inside your path stays visible."
      },
      {
        "q": "Custom UI should be used for every screen to make an app look unique.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Custom painting costs time and complexity — standard widgets already look good and are tested, so custom UI is for special cases only."
      },
      {
        "q": "How is paint() different from build()?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "build() describes widgets; paint() issues drawing commands on a canvas",
          "They are the same method with two names",
          "paint() runs once, build() runs on every frame",
          "paint() returns a widget tree, build() draws pixels"
        ],
        "answer": 0,
        "explanation": "Build describes what exists, paint draws how it looks — that split is why a painter is a delegate, not a widget."
      },
      {
        "q": "You need a wavy header that clips a coloured banner, and separately a hand-drawn chart line. Which tool for each?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "CustomPainter for the header, ClipPath for the chart line",
          "CustomPainter for both",
          "ClipPath for the wavy header, CustomPainter for the chart line",
          "ClipPath for both"
        ],
        "answer": 2,
        "explanation": "Clipping shapes an existing widget; painting draws new content — the header is a shape, the chart is a drawing."
      },
      {
        "q": "A custom shape is drawn in a CustomPainter but nothing shows on screen. The painter code looks right. What should you check first?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Whether the CustomPaint widget actually has a size — with no child and no size, it paints into zero space",
          "Whether the colour chosen is bright enough",
          "Whether setState was called in paint()",
          "Whether the shape should be a ClipPath instead"
        ],
        "answer": 0,
        "explanation": "A painter can only draw inside the space it is given — zero size means zero visible output, however correct the drawing code is."
      },
      {
        "q": "CustomPainter is itself a widget.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "CustomPainter is a delegate handed to a CustomPaint widget — the widget hosts it, the painter only draws."
      },
      {
        "q": "In canvas coordinates, where is the origin (0, 0) and which way does y grow?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Centre of the screen, y grows outward",
          "Top-right, x grows left and y grows downward",
          "Bottom-left, y grows upward",
          "Top-left, x grows right and y grows downward"
        ],
        "answer": 3,
        "explanation": "Canvas coordinates start at the top-left corner — forgetting that y grows downward flips every shape you draw."
      },
      {
        "q": "You must build a header with a curved bottom edge that holds normal text and a button inside it. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Wrap a coloured Container in a ClipPath with a custom clipper that cuts the curved bottom edge",
          "Use a Container with a large border radius on all corners",
          "Stack a curved image under the text and hope the sizes match",
          "Draw the curve with CustomPainter and place the text on top of the painting"
        ],
        "answer": 0,
        "explanation": "The header is a shaped container with live content inside — clipping keeps the content real and interactive, painting would only draw a picture."
      },
      {
        "q": "When is custom UI actually worth it?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Whenever a designer asks for any rounded corner",
          "Whenever you want the app to look different from other apps",
          "When a distinctive shape or drawing is core to the design and no built-in widget can produce it",
          "On every screen, so the design stays consistent"
        ],
        "answer": 2,
        "explanation": "Custom UI pays off only when it buys something standard widgets cannot — otherwise it adds bugs and maintenance for no gain."
      }
    ],
    "questions_hi": [
      {
        "q": "CustomPainter ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye widget ko do states ke beech animate karta hai",
          "Ye widget ko custom shape me clip karta hai",
          "Ye canvas par jo chaho draw karta hai — lines, curves, shapes, directly",
          "Ye screen ke liye widget tree banata hai"
        ],
        "answer": 2,
        "explanation": "Jab koi built-in widget wo draw nahi kar sakta jo tumhe chahiye, CustomPainter tumhe khud paint karne deta hai, pixel by pixel."
      },
      {
        "q": "ClipPath kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye widget ke size ko animate karta hai",
          "Ye widget par shadow add karta hai",
          "Ye canvas par shape draw karta hai",
          "Ye widget ko custom shape me kaat deta hai, path ke bahar ka sab kuch chhupa deta hai"
        ],
        "answer": 3,
        "explanation": "Clipping outline ke baare me hai — widget ka content wahi rehta hai, lekin sirf path ke andar ka hissa dikhta hai."
      },
      {
        "q": "App ko unique dikhane ke liye har screen par custom UI use karni chahiye.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Custom painting me waqt aur complexity lagti hai — standard widgets pehle se hi achhe dikhte hain aur tested hain, isliye custom UI sirf special cases ke liye hai."
      },
      {
        "q": "paint() build() se kaise alag hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "build() widgets describe karta hai; paint() canvas par drawing commands deta hai",
          "Ye dono ek hi method ke do naam hain",
          "paint() ek baar chalta hai, build() har frame par chalta hai",
          "paint() widget tree return karta hai, build() pixels draw karta hai"
        ],
        "answer": 0,
        "explanation": "Build batata hai kya exists karta hai, paint batata hai wo dikhta kaise hai — isi split ki wajah se painter ek delegate hai, widget nahi."
      },
      {
        "q": "Tumhe ek wavy header chahiye jo coloured banner ko clip kare, aur alag se ek haath se bani chart line chahiye. Har ek ke liye kaunsa tool?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Header ke liye CustomPainter, chart line ke liye ClipPath",
          "Dono ke liye CustomPainter",
          "Wavy header ke liye ClipPath, chart line ke liye CustomPainter",
          "Dono ke liye ClipPath"
        ],
        "answer": 2,
        "explanation": "Clipping maujooda widget ko shape deta hai; painting naya content draw karta hai — header ek shape hai, chart ek drawing hai."
      },
      {
        "q": "Ek custom shape CustomPainter me draw ki gayi hai lekin screen par kuch dikhta hi nahi. Painter ka code sahi lagta hai. Pehle kya check karna chahiye?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Kya CustomPaint widget ko asal me size mila hai — bina child aur bina size ke wo zero space me paint karta hai",
          "Kya chuna gaya colour kaafi bright hai",
          "Kya paint() me setState call hua tha",
          "Kya shape ko ClipPath hona chahiye tha"
        ],
        "answer": 0,
        "explanation": "Painter sirf utni space me draw kar sakta hai jitni use mili hai — zero size ka matlab zero visible output, chahe drawing code kitna bhi sahi ho."
      },
      {
        "q": "CustomPainter khud ek widget hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "CustomPainter ek delegate hai jo CustomPaint widget ko diya jaata hai — widget use host karta hai, painter sirf draw karta hai."
      },
      {
        "q": "Canvas coordinates me origin (0, 0) kahan hai aur y kis direction me badhta hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Screen ke centre me, y bahar ki taraf badhta hai",
          "Top-right, x left ki taraf aur y neeche ki taraf badhta hai",
          "Bottom-left, y upar ki taraf badhta hai",
          "Top-left, x right ki taraf aur y neeche ki taraf badhta hai"
        ],
        "answer": 3,
        "explanation": "Canvas coordinates top-left corner se start hote hain — ye bhoolna ki y neeche badhta hai, har shape ko ulta kar deta hai."
      },
      {
        "q": "Tumhe ek header banana hai jiski bottom edge curved ho aur uske andar normal text aur button ho. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Coloured Container ko ClipPath me wrap karo, custom clipper ke saath jo curved bottom edge kaate",
          "Saare corners par badi border radius wala Container use karo",
          "Text ke neeche ek curved image stack kar do aur umeed karo sizes match ho jaayein",
          "Curve ko CustomPainter se draw karo aur text ko painting ke upar rakh do"
        ],
        "answer": 0,
        "explanation": "Header ek shaped container hai jisme live content hai — clipping content ko real aur interactive rakhta hai, painting sirf ek picture draw karta."
      },
      {
        "q": "Custom UI asal me kab worth it hoti hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Jab bhi designer koi rounded corner maange",
          "Jab bhi tum chaho app doosre apps se alag dikhe",
          "Jab koi distinctive shape ya drawing design ka core ho aur koi built-in widget use bana na sake",
          "Har screen par, taaki design consistent rahe"
        ],
        "answer": 2,
        "explanation": "Custom UI sirf tab faayda deti hai jab wo kuch de jo standard widgets nahi de sakte — warna wo bina faayde ke bugs aur maintenance badhati hai."
      }
    ]
  },
  {
    "id": "quiz-31-performance",
    "lessonId": "lesson-31-performance",
    "title": "Quiz: Performance",
    "questions_en": [
      {
        "q": "What is the DevTools profiler mainly used for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Publishing the app to the store",
          "Writing widget tests automatically",
          "Finding what is slow — which widgets rebuild too much and where frames are dropped",
          "Designing app icons and splash screens"
        ],
        "answer": 2,
        "explanation": "Profiling shows real measurements instead of guesses — you see the culprit before you try to fix anything."
      },
      {
        "q": "What most commonly causes a widget to rebuild?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Its parent rebuilding, or setState being called on it or an ancestor",
          "The app going into the background",
          "A new version of Flutter being installed",
          "The user rotating the phone"
        ],
        "answer": 0,
        "explanation": "Rebuilds flow down the tree — a parent's rebuild rebuilds its children unless they are shielded by const or a separate widget."
      },
      {
        "q": "Adding const everywhere always fixes performance problems.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Const only skips rebuilds of widgets that never change — it cannot fix heavy work, bad lists, or main-thread blocking."
      },
      {
        "q": "What is the key rule for a long scrolling list's performance?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Use a Column inside a SingleChildScrollView for any list",
          "Give every item a unique animation",
          "Build every item up front so scrolling is instant",
          "Build only the items on screen with a builder constructor, so off-screen items cost nothing"
        ],
        "answer": 3,
        "explanation": "A builder lazily creates visible items only — building thousands of items up front wastes time and memory."
      },
      {
        "q": "One screen feels slow but you do not know why. What is the right first step in DevTools?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Increase the animation durations",
          "Add const to every widget and hope it helps",
          "Open the widget rebuild counts and the performance view to find which widget rebuilds most",
          "Rewrite the screen with a different state package"
        ],
        "answer": 2,
        "explanation": "Measure first, fix second — rebuild counts point at the real culprit instead of a guessed one."
      },
      {
        "q": "A list of 500 items scrolls jerkily. Each row is built eagerly in a Column inside a scroll view, and rows contain heavy images. What is the best fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Switch to ListView.builder so only visible rows are built, and keep row widgets const where possible",
          "Add a loading spinner above the list",
          "Reduce the list to 50 items",
          "Make the images smaller in an editor"
        ],
        "answer": 0,
        "explanation": "The jank comes from building everything at once — a builder plus cheap rows attacks the cause, not the symptom."
      },
      {
        "q": "60fps means the app rebuilds 60 widgets every second.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "60fps means 60 frames drawn per second — a frame is a rendered picture, not a count of widget rebuilds."
      },
      {
        "q": "When should you move work to compute(), an Isolate?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "For every setState call",
          "For showing a dialog",
          "For any network request",
          "For heavy CPU work, like parsing a huge JSON file, that would block the UI thread and drop frames"
        ],
        "answer": 3,
        "explanation": "The UI thread must stay free to draw frames — heavy computation on it freezes the screen, so it goes to an Isolate."
      },
      {
        "q": "A screen drops frames while scrolling and on first open. Apply the 60fps checklist — what is the right order?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Move all work to Isolates first, then check the result",
          "Rewrite the screen, then measure if it feels better",
          "Profile in DevTools first, fix the biggest rebuild and list problems found, then re-measure to confirm",
          "Add const everywhere, then profile only if it still feels slow"
        ],
        "answer": 2,
        "explanation": "Profile, fix what the profile proves, re-measure — that loop is the checklist, and it stops guesswork from becoming the fix."
      },
      {
        "q": "Why is 'profile before optimising' a rule, not just advice?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Because optimising the wrong thing wastes effort and can make code more complex without fixing the real bottleneck",
          "Because const only works after profiling",
          "Because users check DevTools output",
          "Because DevTools is required for release builds"
        ],
        "answer": 0,
        "explanation": "A guessed optimisation often fixes nothing — measurement tells you where the time actually goes before you change code."
      }
    ],
    "questions_hi": [
      {
        "q": "DevTools profiler mainly kis liye use hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App ko store par publish karne ke liye",
          "Widget tests automatically likhne ke liye",
          "Ye pata lagane ke liye kya slow hai — kaunse widgets zyaada rebuild hote hain aur kahan frames drop hote hain",
          "App icons aur splash screens design karne ke liye"
        ],
        "answer": 2,
        "explanation": "Profiling guesses ki jagah asli measurements deta hai — fix karne se pehle tum culprit dekh lete ho."
      },
      {
        "q": "Widget ke rebuild hone ka sabse common kaaran kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Uske parent ka rebuild hona, ya us par ya uske ancestor par setState call hona",
          "App ka background me jaana",
          "Flutter ka naya version install hona",
          "User ka phone rotate karna"
        ],
        "answer": 0,
        "explanation": "Rebuilds tree me neeche behette hain — parent ka rebuild bachchon ko bhi rebuild karta hai, jab tak const ya alag widget unhe shield na kare."
      },
      {
        "q": "Har jagah const add karne se performance problems hamesha fix ho jaati hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Const sirf un widgets ke rebuilds skip karta hai jo kabhi badalte nahi — ye heavy kaam, kharab lists ya main-thread blocking fix nahi kar sakta."
      },
      {
        "q": "Lambi scrolling list ki performance ka key rule kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Kisi bhi list ke liye SingleChildScrollView ke andar Column use karo",
          "Har item ko ek unique animation do",
          "Saare items pehle se build kar lo taaki scrolling instant ho",
          "Builder constructor se sirf screen par dikhne wale items build karo, taaki off-screen items ka koi cost na ho"
        ],
        "answer": 3,
        "explanation": "Builder lazily sirf visible items banata hai — hazaaron items pehle se banana waqt aur memory waste karta hai."
      },
      {
        "q": "Ek screen slow lagti hai lekin tumhe pata nahi kyon. DevTools me sahi pehla step kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Animation durations badha do",
          "Har widget par const add karo aur umeed karo ki help hogi",
          "Widget rebuild counts aur performance view kholo, taaki pata chale kaunsa widget sabse zyaada rebuild hota hai",
          "Screen ko doosre state package se dobara likho"
        ],
        "answer": 2,
        "explanation": "Pehle measure karo, phir fix karo — rebuild counts guess ki jagah asli culprit ki taraf ishara karte hain."
      },
      {
        "q": "500 items ki list jerkily scroll hoti hai. Har row scroll view ke andar Column me eagerly build hoti hai, aur rows me heavy images hain. Best fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "ListView.builder par switch karo taaki sirf visible rows banen, aur row widgets ko jahan possible const rakho",
          "List ke upar ek loading spinner add kar do",
          "List ko 50 items tak ghata do",
          "Images ko editor me chhota kar do"
        ],
        "answer": 0,
        "explanation": "Jank isliye hai kyunki sab kuch ek saath build hota hai — builder plus cheap rows cause par attack karte hain, symptom par nahi."
      },
      {
        "q": "60fps ka matlab hai app har second 60 widgets rebuild karti hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "60fps ka matlab hai har second 60 frames draw hona — frame ek rendered picture hai, widget rebuilds ki ginati nahi."
      },
      {
        "q": "Kaam ko compute(), yaani Isolate, par kab bhejna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Har setState call ke liye",
          "Dialog dikhane ke liye",
          "Kisi bhi network request ke liye",
          "Heavy CPU kaam ke liye, jaise bada JSON parse karna, jo UI thread ko block karke frames drop kar dega"
        ],
        "answer": 3,
        "explanation": "UI thread frames draw karne ke liye free rehna chahiye — us par heavy computation screen ko freeze kar deta hai, isliye wo Isolate par jaata hai."
      },
      {
        "q": "Ek screen scrolling aur pehli baar khulne par frames drop karti hai. 60fps checklist apply karo — sahi order kya hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Pehle saara kaam Isolates par bhejo, phir result check karo",
          "Screen dobara likho, phir measure karo ki behtar lagta hai ya nahi",
          "Pehle DevTools me profile karo, mili sabse badi rebuild aur list problems fix karo, phir re-measure karke confirm karo",
          "Har jagah const add karo, phir sirf tab profile karo jab abhi bhi slow lage"
        ],
        "answer": 2,
        "explanation": "Profile karo, profile jo prove kare use fix karo, re-measure karo — ye loop hi checklist hai, aur ye guesswork ko fix banne se rokta hai."
      },
      {
        "q": "'Profile before optimising' ek rule kyon hai, sirf advice nahi?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Kyunki galat cheez optimise karna mehnat waste karta hai aur code ko complex bana sakta hai bina asli bottleneck fix kiye",
          "Kyunki const sirf profiling ke baad kaam karta hai",
          "Kyunki users DevTools output check karte hain",
          "Kyunki DevTools release builds ke liye required hai"
        ],
        "answer": 0,
        "explanation": "Guess par based optimisation aksar kuch fix nahi karta — measurement batata hai waqt asal me kahan ja raha hai, code badalne se pehle."
      }
    ]
  },
  {
    "id": "quiz-32-testing",
    "lessonId": "lesson-32-testing",
    "title": "Quiz: Testing",
    "questions_en": [
      {
        "q": "What does a unit test check?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The app running on a real phone",
          "How fast the app starts",
          "A whole screen with taps and scrolling",
          "One small piece of logic in isolation, like a function or a validator"
        ],
        "answer": 3,
        "explanation": "Unit means small and isolated — one function, one input, one expected output, no widgets involved."
      },
      {
        "q": "What does a widget test check?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The app's network speed",
          "A single pure function with no UI",
          "One widget in a test environment — finding it, tapping it, and checking what it shows",
          "The full app on a real device from launch to logout"
        ],
        "answer": 2,
        "explanation": "Widget tests pump a widget into a fake screen — you can tap and assert without ever launching the real app."
      },
      {
        "q": "An integration test runs on a real device or emulator.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Integration tests drive the whole real app end to end, so they need a device or emulator to run on."
      },
      {
        "q": "What makes code testable?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Keeping logic separate from UI, in small functions that take inputs and return outputs",
          "Using as many global variables as possible",
          "Writing longer functions that do everything",
          "Putting all logic inside widget build methods"
        ],
        "answer": 0,
        "explanation": "Separated, pure logic can be called directly by a test — logic buried in UI cannot be reached without the whole screen."
      },
      {
        "q": "You want to test that tapping a button increases a counter shown on screen. Which test type fits?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "No test — this must be checked by hand",
          "A unit test on the counter variable alone",
          "A widget test that pumps the screen, taps the button, and checks the displayed number",
          "An integration test on a real phone"
        ],
        "answer": 2,
        "explanation": "Tap plus visible result is widget behaviour — a widget test covers it fast, without a device."
      },
      {
        "q": "A widget test taps a button, but the updated text never appears in the test. The app works fine by hand. What is the most likely fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Change the button's colour",
          "Run the test on a real phone instead",
          "Reinstall the app on the test device",
          "After the tap, await tester.pumpAndSettle() so the widget rebuilds and the new frame is checked"
        ],
        "answer": 3,
        "explanation": "A test checks the frame it is given — without pumping after the tap, it still sees the old frame."
      },
      {
        "q": "Tests fully replace manual testing.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Tests catch regressions fast, but feel, layout on real devices, and real-world quirks still need a human eye."
      },
      {
        "q": "What is a mock used for in tests?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Faking a dependency, like an API service, so the test runs fast and does not need the network",
          "Copying the whole app for a demo",
          "Making the UI look better in screenshots",
          "Speeding up the device's processor"
        ],
        "answer": 0,
        "explanation": "A mock stands in for the real service — the test then checks your logic, not the network's mood."
      },
      {
        "q": "You must test a login form: email validation, error messages on submit, and the full login flow. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Unit tests for the validators, widget tests for the form interaction and errors, one integration test for the full flow",
          "Only unit tests, since they run fastest",
          "Only manual testing, since forms are too complex to test",
          "Only integration tests for everything, since they cover the most"
        ],
        "answer": 0,
        "explanation": "Each layer tests what it is good at — cheap unit tests for rules, widget tests for interaction, one integration test for the journey."
      },
      {
        "q": "What is the main benefit of running tests in CI?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "CI replaces the need for code review",
          "Tests run faster on a server than on a laptop",
          "Every change is checked automatically before it can merge, so broken code is caught early and consistently",
          "CI writes the tests for you"
        ],
        "answer": 2,
        "explanation": "CI makes testing automatic and unavoidable — a broken change fails the pipeline instead of reaching users."
      }
    ],
    "questions_hi": [
      {
        "q": "Unit test kya check karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Real phone par chalti hui app",
          "App kitni fast start hoti hai",
          "Taps aur scrolling ke saath poori ek screen",
          "Logic ka ek chhota tukda, akela, jaise ek function ya validator"
        ],
        "answer": 3,
        "explanation": "Unit ka matlab chhota aur isolated hai — ek function, ek input, ek expected output, koi widgets nahi."
      },
      {
        "q": "Widget test kya check karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App ki network speed",
          "Bina UI ke ek single pure function",
          "Test environment me ek widget — use dhoondhna, tap karna, aur check karna wo kya dikhata hai",
          "Launch se logout tak real device par poori app"
        ],
        "answer": 2,
        "explanation": "Widget tests widget ko ek fake screen me pump karte hain — tum tap kar sakte ho aur assert kar sakte ho, bina real app launch kiye."
      },
      {
        "q": "Integration test real device ya emulator par chalta hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Integration tests poori real app ko end to end chalate hain, isliye unhe chalne ke liye device ya emulator chahiye."
      },
      {
        "q": "Code testable kya banata hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Logic ko UI se alag rakhna, chhote functions me jo inputs lein aur outputs dein",
          "Jitne ho sake utne global variables use karna",
          "Lambhe functions likhna jo sab kuch karein",
          "Saara logic widget build methods ke andar rakhna"
        ],
        "answer": 0,
        "explanation": "Alag, pure logic ko test directly call kar sakta hai — UI me daba hua logic poori screen ke bina reach hi nahi hota."
      },
      {
        "q": "Tum test karna chahte ho ki button tap karne par screen par dikhne wala counter badhta hai. Kaunsa test type fit hoga?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Koi test nahi — ye haath se hi check karna padega",
          "Counter variable par akela unit test",
          "Widget test jo screen ko pump kare, button tap kare, aur dikhne wala number check kare",
          "Real phone par integration test"
        ],
        "answer": 2,
        "explanation": "Tap plus visible result widget behaviour hai — widget test use fast cover karta hai, bina device ke."
      },
      {
        "q": "Ek widget test button tap karta hai, lekin updated text test me kabhi dikhta hi nahi. App haath se theek kaam karti hai. Sabse likely fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Button ka colour badal do",
          "Test ko real phone par chalao",
          "App ko test device par dobara install karo",
          "Tap ke baad await tester.pumpAndSettle() karo, taaki widget rebuild ho aur nayi frame check ho"
        ],
        "answer": 3,
        "explanation": "Test wahi frame check karta hai jo use mili hai — tap ke baad pump kiye bina wo purani frame hi dekhta hai."
      },
      {
        "q": "Tests manual testing ko poori tarah replace kar dete hain.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Tests regressions fast pakadte hain, lekin feel, real devices par layout, aur real-world quirks ke liye abhi bhi insaan ki nazar chahiye."
      },
      {
        "q": "Tests me mock kis liye use hota hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ek dependency ko fake karne ke liye, jaise API service, taaki test fast chale aur network ki zaroorat na pade",
          "Demo ke liye poori app copy karne ke liye",
          "Screenshots me UI ko behtar dikhane ke liye",
          "Device ke processor ko fast karne ke liye"
        ],
        "answer": 0,
        "explanation": "Mock asli service ki jagah khada hota hai — test phir tumhara logic check karta hai, network ka mood nahi."
      },
      {
        "q": "Tumhe ek login form test karna hai: email validation, submit par error messages, aur poora login flow. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Validators ke liye unit tests, form interaction aur errors ke liye widget tests, poore flow ke liye ek integration test",
          "Sirf unit tests, kyunki wo sabse fast chalte hain",
          "Sirf manual testing, kyunki forms test karne ke liye bahut complex hain",
          "Sab kuch ke liye sirf integration tests, kyunki wo sabse zyaada cover karte hain"
        ],
        "answer": 0,
        "explanation": "Har layer wo test karti hai jisme wo achhi hai — saste unit tests rules ke liye, widget tests interaction ke liye, ek integration test journey ke liye."
      },
      {
        "q": "CI me tests chalane ka main faayda kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "CI code review ki zaroorat khatam kar deta hai",
          "Tests server par laptop se fast chalte hain",
          "Har change merge se pehle automatically check hota hai, isliye toota hua code jaldi aur consistently pakda jaata hai",
          "CI tumhare liye tests likh deta hai"
        ],
        "answer": 2,
        "explanation": "CI testing ko automatic aur unavoidable bana deta hai — toota hua change pipeline me fail ho jaata hai, users tak pahunchne se pehle."
      }
    ]
  },
  {
    "id": "quiz-33-device-features",
    "lessonId": "lesson-33-device-features",
    "title": "Quiz: Device Features",
    "questions_en": [
      {
        "q": "What is the basic flow for taking a photo with the camera package?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Save a blank image and let the user draw on it",
          "Open the gallery, pick any file, and show it",
          "Check permission, open the camera, capture the photo, and use the returned file",
          "Call the camera directly with no permission step"
        ],
        "answer": 2,
        "explanation": "The camera is a protected device feature — permission first, then capture, then the file you can display or upload."
      },
      {
        "q": "What is the correct permission request flow?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Declare the permission, check its status, request it if needed, and handle a denial gracefully",
          "Ask for every permission at app install time",
          "Assume permission is granted because the user installed the app",
          "Use the feature first and ask only if it crashes"
        ],
        "answer": 0,
        "explanation": "Permissions are requested at the moment of use, and a denial must be handled — otherwise the feature just silently fails."
      },
      {
        "q": "Once a user grants a permission, it stays granted forever.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Users can revoke permissions anytime from settings — your app must handle a permission disappearing."
      },
      {
        "q": "What is a platform channel, in one line?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A faster way to draw widgets",
          "A channel for sending push notifications",
          "A package downloaded from pub.dev",
          "A bridge that lets Dart code call native Android or iOS code and get results back"
        ],
        "answer": 3,
        "explanation": "Flutter cannot do everything itself — a platform channel is the bridge to native features with no Dart API."
      },
      {
        "q": "Before adding a package from pub.dev, what should you check?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Only how many stars it has on social media",
          "Only its download size",
          "Its popularity, pub points, recent updates, documentation, and whether it supports your platforms",
          "Only whether its name sounds good"
        ],
        "answer": 2,
        "explanation": "A package becomes part of your app — health checks now prevent an abandoned or broken dependency later."
      },
      {
        "q": "A user denied the camera permission permanently ('don't ask again'). The camera button now does nothing. What is the right fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Guide the user to the app's system settings, where a permanently denied permission can be re-enabled",
          "Remove the camera feature from the app",
          "Restart the app and hope the permission resets",
          "Keep requesting the permission on every tap until the user gives in"
        ],
        "answer": 0,
        "explanation": "A permanent denial blocks future requests — only the system settings screen can turn that permission back on."
      },
      {
        "q": "Native code is never needed in a Flutter app.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Packages cover most features, but a feature with no plugin — or a device-specific capability — still needs native code."
      },
      {
        "q": "What are the steps of a location flow?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Read the position, then ask permission if it fails",
          "Enable GPS in code, then read the position directly",
          "Request permission, then read the location",
          "Check location services are on, check and request permission, then read the position"
        ],
        "answer": 3,
        "explanation": "Location needs two green lights — services on and permission granted — before a position can be read."
      },
      {
        "q": "You must build a photo-capture feature: take a photo, preview it, and save it. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Capture in the background without showing a preview",
          "Open the camera, save whatever it returns, and skip permission handling",
          "Request camera permission, capture via the camera package, show a preview for confirmation, then save the file — with a settings path if permission is denied",
          "Let the user type a photo path by hand"
        ],
        "answer": 2,
        "explanation": "The full feature is permission plus capture plus preview plus save — skipping any step leaves a broken or rude experience."
      },
      {
        "q": "When do you actually need a platform channel?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "When you need a native capability that no existing plugin provides, like a device-specific sensor or system API",
          "Whenever the app is slow",
          "For every camera or location feature",
          "Whenever you use any package from pub.dev"
        ],
        "answer": 0,
        "explanation": "Channels are the escape hatch for the missing piece — if a good plugin exists, use it instead of writing native code."
      }
    ],
    "questions_hi": [
      {
        "q": "Camera package se photo lene ka basic flow kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek blank image save karo aur user ko us par draw karne do",
          "Gallery kholo, koi file pick karo, aur use dikha do",
          "Permission check karo, camera kholo, photo capture karo, aur mili hui file use karo",
          "Bina permission step ke camera ko directly call karo"
        ],
        "answer": 2,
        "explanation": "Camera ek protected device feature hai — pehle permission, phir capture, phir wo file jise tum display ya upload kar sakte ho."
      },
      {
        "q": "Permission request ka sahi flow kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Permission declare karo, uska status check karo, zaroorat ho to request karo, aur denial ko gracefully handle karo",
          "App install hote waqt hi saari permissions maang lo",
          "Maan lo permission mil gayi hai kyunki user ne app install ki hai",
          "Pehle feature use karo aur sirf crash hone par poochho"
        ],
        "answer": 0,
        "explanation": "Permissions use ke waqt maangi jaati hain, aur denial handle karna zaroori hai — warna feature bas chupchaap fail ho jaata hai."
      },
      {
        "q": "Ek baar user permission de de, to wo hamesha ke liye granted rehti hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Users settings se kabhi bhi permissions revoke kar sakte hain — tumhari app ko permission gayab hone ka handle karna aana chahiye."
      },
      {
        "q": "Platform channel ek line me kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Widgets ko fast draw karne ka tareeqa",
          "Push notifications bhejne ka ek channel",
          "pub.dev se download kiya gaya ek package",
          "Ek bridge jo Dart code ko native Android ya iOS code call karne aur results wapas paane deta hai"
        ],
        "answer": 3,
        "explanation": "Flutter sab kuch khud nahi kar sakta — platform channel native features tak ka bridge hai jinke liye koi Dart API nahi hai."
      },
      {
        "q": "pub.dev se package add karne se pehle kya check karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Sirf social media par uske kitne stars hain",
          "Sirf uska download size",
          "Uski popularity, pub points, recent updates, documentation, aur kya wo tumhare platforms support karta hai",
          "Sirf kya uska naam achha lagta hai"
        ],
        "answer": 2,
        "explanation": "Package tumhari app ka hissa ban jaata hai — abhi health checks baad me abandoned ya tooti dependency se bachate hain."
      },
      {
        "q": "User ne camera permission permanently deny kar di hai ('don't ask again'). Camera button ab kuch nahi karta. Sahi fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "User ko app ki system settings tak guide karo, jahan permanently denied permission dobara enable ho sakti hai",
          "App se camera feature hi hata do",
          "App restart karo aur umeed karo permission reset ho jaaye",
          "Har tap par permission maangte raho jab tak user maan na jaaye"
        ],
        "answer": 0,
        "explanation": "Permanent denial future requests ko block kar deta hai — sirf system settings screen hi us permission ko wapas on kar sakti hai."
      },
      {
        "q": "Flutter app me native code ki kabhi zaroorat nahi hoti.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Packages zyaadatar features cover karte hain, lekin bina plugin wala feature — ya device-specific capability — abhi bhi native code maangta hai."
      },
      {
        "q": "Location flow ke steps kya hain?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Position padho, phir fail hone par permission maango",
          "Code me GPS enable karo, phir position directly padho",
          "Permission request karo, phir location padho",
          "Check karo location services on hain, permission check aur request karo, phir position padho"
        ],
        "answer": 3,
        "explanation": "Location ko do green lights chahiye — services on aur permission granted — tabhi position padhi ja sakti hai."
      },
      {
        "q": "Tumhe ek photo-capture feature banana hai: photo lo, preview dikhao, aur save karo. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Bina preview dikhaye background me capture karo",
          "Camera kholo, jo mile use save karo, aur permission handling skip kar do",
          "Camera permission request karo, camera package se capture karo, confirmation ke liye preview dikhao, phir file save karo — aur permission denied ho to settings ka path do",
          "User ko photo ka path haath se type karne do"
        ],
        "answer": 2,
        "explanation": "Poora feature permission plus capture plus preview plus save hai — koi step skip karna toota ya rude experience chhodta hai."
      },
      {
        "q": "Platform channel ki asal me kab zaroorat hoti hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Jab tumhe aisi native capability chahiye jo koi maujooda plugin na de, jaise device-specific sensor ya system API",
          "Jab bhi app slow ho",
          "Har camera ya location feature ke liye",
          "Jab bhi tum pub.dev se koi package use karo"
        ],
        "answer": 0,
        "explanation": "Channels missing piece ke liye escape hatch hain — agar achha plugin maujood hai, to native code likhne ki jagah use hi use karo."
      }
    ]
  },
  {
    "id": "quiz-34-production-essentials",
    "lessonId": "lesson-34-production-essentials",
    "title": "Quiz: Production Essentials",
    "questions_en": [
      {
        "q": "What is the basic API key safety rule?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Keys only need protection in paid apps",
          "Keys are safe in code as long as the app is not published",
          "Never put real keys in app code or in a public repo — they can be extracted and abused",
          "Keys are safe if the variable name is hard to guess"
        ],
        "answer": 2,
        "explanation": "Shipped code can be read — a key inside it is a public key, whatever you name the variable."
      },
      {
        "q": "What is analytics mainly for?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Understanding how users actually use the app, so you can improve what matters and fix what breaks",
          "Making the app run faster",
          "Backing up user data",
          "Showing ads to users"
        ],
        "answer": 0,
        "explanation": "Analytics turns guesses into evidence — you learn which screens people use and where they drop off."
      },
      {
        "q": "Accessibility is only about making fonts bigger.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Accessibility covers screen readers, contrast, touch targets, and semantics — font size is only one small part."
      },
      {
        "q": "What does i18n (internationalisation) mean for an app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Adding a language picker to the settings screen",
          "Supporting only the two most common languages",
          "Translating the app's name only",
          "Designing the app so its text and formats can switch languages without rewriting code"
        ],
        "answer": 3,
        "explanation": "I18n separates text from code — new languages then become new string files, not new code."
      },
      {
        "q": "Where should an auth token be stored in a production app?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Hard-coded in the app code for fast access",
          "In SharedPreferences, alongside other settings",
          "In secure storage, which encrypts it in the device's protected keystore",
          "In a plain text file in the app's documents folder"
        ],
        "answer": 2,
        "explanation": "Tokens are secrets — plain storage can be read, but secure storage keeps them encrypted by the OS."
      },
      {
        "q": "You discover a real API key was committed to the app's code and pushed to a public repo. What is the right fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Rotate (revoke and replace) the key, remove it from the code and its history, and move it to a safe store",
          "Rename the variable holding the key",
          "Make the repo private and leave the key in place",
          "Delete the line from the code and push again"
        ],
        "answer": 0,
        "explanation": "A pushed key is already exposed — deleting the line does not un-expose it, only rotation kills its value."
      },
      {
        "q": "An app icon and a splash screen are optional polish you can add after release.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Stores require an icon, and a splash screen is part of a finished first launch — both belong in the release checklist."
      },
      {
        "q": "What are semantic labels for?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Improving search ranking in the store",
          "Labelling code for other developers",
          "Making text bold for sighted users",
          "Telling screen readers what a widget is and does, so users who cannot see it can still use it"
        ],
        "answer": 3,
        "explanation": "A screen reader can only announce what you label — without semantics, an icon button is just 'button' with no meaning."
      },
      {
        "q": "A production checklist for your app includes: keys out of code, analytics wired, accessibility labels added, icon and splash ready, and i18n set up. One item is missing — what completes it?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "A bigger app icon",
          "A longer app description for the store",
          "A release test on a real device in release mode, since debug-only bugs hide until release",
          "More animations on the home screen"
        ],
        "answer": 2,
        "explanation": "Release mode behaves differently from debug — a checklist that never runs the real release build misses release-only bugs."
      },
      {
        "q": "A feature would be more convenient if the app stored a secret in plain settings, but that risks exposure. What is the right trade-off?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Choose security for secrets: a small amount of extra work in secure storage beats a leaked token",
          "Store it in plain settings but hide the settings screen",
          "Skip the feature entirely",
          "Choose convenience — users prefer fast features"
        ],
        "answer": 0,
        "explanation": "Convenience never justifies an exposed secret — secure storage costs little, a leak costs trust and money."
      }
    ],
    "questions_hi": [
      {
        "q": "API key safety ka basic rule kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Keys ko sirf paid apps me protection chahiye",
          "Keys code me safe hain jab tak app publish na ho",
          "Real keys ko kabhi app code me ya public repo me mat rakho — unhe nikaal kar misuse kiya ja sakta hai",
          "Keys safe hain agar variable ka naam guess karna mushkil ho"
        ],
        "answer": 2,
        "explanation": "Shipped code ko padha ja sakta hai — uske andar ki key public key hai, chahe variable ka naam kuch bhi ho."
      },
      {
        "q": "Analytics mainly kis liye hoti hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye samajhne ke liye users app ko asal me kaise use karte hain, taaki tum wo improve kar sako jo matter karta hai aur wo fix kar sako jo tootta hai",
          "App ko fast chalane ke liye",
          "User data ka backup lene ke liye",
          "Users ko ads dikhane ke liye"
        ],
        "answer": 0,
        "explanation": "Analytics guesses ko evidence me badal deti hai — tum seekhte ho kaunsi screens log use karte hain aur kahan drop off hote hain."
      },
      {
        "q": "Accessibility sirf fonts bade karne ke baare me hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Accessibility me screen readers, contrast, touch targets aur semantics sab aate hain — font size sirf ek chhota hissa hai."
      },
      {
        "q": "App ke liye i18n (internationalisation) ka matlab kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Settings screen me language picker add karna",
          "Sirf do sabse common languages support karna",
          "Sirf app ka naam translate karna",
          "App ko aise design karna ki uska text aur formats code dobara likhe bina languages switch kar sakein"
        ],
        "answer": 3,
        "explanation": "I18n text ko code se alag karta hai — nayi languages phir naya code nahi, nayi string files ban jaati hain."
      },
      {
        "q": "Production app me auth token kahan store karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Fast access ke liye app code me hard-code karke",
          "SharedPreferences me, baaki settings ke saath",
          "Secure storage me, jo use device ke protected keystore me encrypt karke rakhta hai",
          "App ke documents folder me plain text file me"
        ],
        "answer": 2,
        "explanation": "Tokens secrets hain — plain storage ko padha ja sakta hai, lekin secure storage unhe OS se encrypted rakhta hai."
      },
      {
        "q": "Tumhe pata chalta hai ek real API key app ke code me commit ho gayi aur public repo par push ho gayi. Sahi fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Key ko rotate karo (revoke karke replace karo), use code aur history se hatao, aur safe store me le jaao",
          "Key wale variable ka naam badal do",
          "Repo ko private kar do aur key ko waise hi chhod do",
          "Code se line delete karo aur dobara push karo"
        ],
        "answer": 0,
        "explanation": "Push ki hui key pehle se expose ho chuki hai — line delete karne se wo un-expose nahi hoti, sirf rotation uski value khatam karta hai."
      },
      {
        "q": "App icon aur splash screen optional polish hain jo release ke baad bhi add ki ja sakti hain.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Stores ko icon chahiye hota hai, aur splash screen finished first launch ka hissa hai — dono release checklist me aate hain."
      },
      {
        "q": "Semantic labels kis liye hote hain?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Store me search ranking improve karne ke liye",
          "Doosre developers ke liye code label karne ke liye",
          "Sighted users ke liye text ko bold karne ke liye",
          "Screen readers ko batane ke liye widget kya hai aur kya karta hai, taaki jo users dekh nahi sakte wo bhi use kar sakein"
        ],
        "answer": 3,
        "explanation": "Screen reader sirf wahi announce kar sakta hai jo tum label karo — bina semantics ke, ek icon button sirf 'button' hai, bina kisi matlab ke."
      },
      {
        "q": "Tumhari app ki production checklist me ye sab hai: keys code se bahar, analytics wired, accessibility labels added, icon aur splash ready, i18n set up. Ek item missing hai — use kya poora karta hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Bada app icon",
          "Store ke liye lambi app description",
          "Release mode me real device par release test, kyunki debug-only bugs release tak chhupe rehte hain",
          "Home screen par aur animations"
        ],
        "answer": 2,
        "explanation": "Release mode debug se alag behave karta hai — jo checklist asli release build ko kabhi run hi na kare, wo release-only bugs miss kar deti hai."
      },
      {
        "q": "Ek feature zyaada convenient hoga agar app secret ko plain settings me store kare, lekin usse exposure ka risk hai. Sahi trade-off kya hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Secrets ke liye security chuno: secure storage me thoda extra kaam leaked token se kahin behtar hai",
          "Use plain settings me store karo lekin settings screen ko chhupa do",
          "Feature ko poori tarah skip kar do",
          "Convenience chuno — users fast features pasand karte hain"
        ],
        "answer": 0,
        "explanation": "Convenience kabhi exposed secret ko justify nahi karta — secure storage ki cost kam hai, leak ki cost trust aur paisa hai."
      }
    ]
  },
  {
    "id": "quiz-35-beyond-mobile",
    "lessonId": "lesson-35-beyond-mobile",
    "title": "Quiz: Beyond Mobile: Web & Desktop",
    "questions_en": [
      {
        "q": "What does building for web actually produce?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A second mobile app",
          "An APK file that runs in a browser",
          "A web app compiled to JavaScript and assets that a browser can load",
          "A desktop installer"
        ],
        "answer": 2,
        "explanation": "Flutter web compiles your Dart code to web technology — the browser runs it like any other website."
      },
      {
        "q": "Which platforms does Flutter desktop target?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Only macOS",
          "Windows and Android tablets",
          "Only Windows",
          "Windows, macOS, and Linux"
        ],
        "answer": 3,
        "explanation": "Desktop means all three desktop operating systems — one codebase, three native shells."
      },
      {
        "q": "The same Flutter code runs everywhere with no changes at all.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Shared code is the starting point, but screen sizes, input methods, and platform features still need adaptive tweaks."
      },
      {
        "q": "What is the difference between responsive and adaptive design?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Responsive adjusts layout to available size; adaptive changes the layout pattern itself for a platform or form factor",
          "Responsive is for mobile only, adaptive is for web only",
          "Responsive uses fixed sizes, adaptive uses flexible sizes",
          "They are the same thing"
        ],
        "answer": 0,
        "explanation": "Stretching is responsive; switching from bottom nav to side nav on desktop is adaptive — size alone does not decide the pattern."
      },
      {
        "q": "A screen shows a single column of cards on a phone. On a wide desktop window, what layout should it use?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "The phone layout, shrunk to phone size in the corner",
          "The same single column, stretched to full width",
          "A centred content column with a sensible max width, or a multi-column grid that uses the extra space",
          "A horizontal scrolling row of all cards"
        ],
        "answer": 2,
        "explanation": "Wide screens punish stretched single columns — a max-width column or grid keeps lines readable and space useful."
      },
      {
        "q": "A plugin works on mobile but the web build fails, saying the plugin is missing. What should you check first?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Whether the plugin actually supports web — not every plugin has a web implementation",
          "Whether the phone's OS version is too old",
          "Whether the web build needs an APK",
          "Whether the plugin's name is spelled correctly in the code"
        ],
        "answer": 0,
        "explanation": "Platform support is per-plugin — a mobile-only plugin cannot run on web, and needs a web-capable alternative or a conditional path."
      },
      {
        "q": "A mobile UI fits a desktop window as it is, with no changes.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Touch targets, bottom nav, and phone-width columns feel wrong with a mouse on a wide window — desktop needs its own layout."
      },
      {
        "q": "How do you check the platform in code, in a way that also works on web?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Check the screen width and guess the platform",
          "Use the device's brand name",
          "Use Platform.isWindows from dart:io everywhere",
          "Use kIsWeb for web, and dart:io Platform checks only where web is excluded"
        ],
        "answer": 3,
        "explanation": "Dart:io is unavailable on web, so kIsWeb must gate the web case — a raw Platform check breaks the web build."
      },
      {
        "q": "You must adapt a mobile screen — bottom nav, single column, thumb-sized buttons — to desktop. Which plan is right?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Replace bottom nav with a side rail or side nav, use a centred max-width multi-column layout, and size controls for mouse use",
          "Show the phone layout inside a phone-shaped frame on the desktop screen",
          "Build a separate desktop app from scratch",
          "Keep the bottom nav and single column, just make everything wider"
        ],
        "answer": 0,
        "explanation": "Desktop adaptation changes the pattern, not just the size — navigation, columns, and controls all follow desktop conventions."
      },
      {
        "q": "When is it worth building a web or desktop version of your app?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Never — mobile alone is always enough",
          "Always — every app should ship on every platform",
          "When your users actually need it there, like a dashboard used at desks or a tool shared by link",
          "Only when the mobile app is finished and perfect"
        ],
        "answer": 2,
        "explanation": "New platforms cost testing and maintenance — they pay off when real users need the app on that screen, not on principle."
      }
    ],
    "questions_hi": [
      {
        "q": "Web ke liye build karna asal me kya produce karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek doosri mobile app",
          "Ek APK file jo browser me chalti hai",
          "JavaScript aur assets me compile ki hui ek web app, jise browser load kar sakta hai",
          "Ek desktop installer"
        ],
        "answer": 2,
        "explanation": "Flutter web tumhare Dart code ko web technology me compile karta hai — browser use kisi bhi website ki tarah chalata hai."
      },
      {
        "q": "Flutter desktop kin platforms ko target karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Sirf macOS",
          "Windows aur Android tablets",
          "Sirf Windows",
          "Windows, macOS, aur Linux"
        ],
        "answer": 3,
        "explanation": "Desktop ka matlab teeno desktop operating systems hai — ek codebase, teen native shells."
      },
      {
        "q": "Wahi Flutter code bina kisi change ke har jagah chal jaata hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Shared code starting point hai, lekin screen sizes, input methods aur platform features ko abhi bhi adaptive tweaks chahiye."
      },
      {
        "q": "Responsive aur adaptive design me farq kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Responsive layout ko available size ke hisaab se adjust karta hai; adaptive layout pattern hi badal deta hai, platform ya form factor ke liye",
          "Responsive sirf mobile ke liye hai, adaptive sirf web ke liye hai",
          "Responsive fixed sizes use karta hai, adaptive flexible sizes use karta hai",
          "Ye dono ek hi cheez hain"
        ],
        "answer": 0,
        "explanation": "Stretch karna responsive hai; desktop par bottom nav se side nav par switch karna adaptive hai — size akela pattern decide nahi karta."
      },
      {
        "q": "Ek screen phone par cards ka single column dikhati hai. Wide desktop window par use kaunsa layout use karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Phone layout, corner me phone size tak shrink karke",
          "Wahi single column, full width tak stretch karke",
          "Sensible max width ke saath centred content column, ya multi-column grid jo extra space use kare",
          "Saare cards ki horizontal scrolling row"
        ],
        "answer": 2,
        "explanation": "Wide screens stretched single columns ko punish karti hain — max-width column ya grid lines ko readable aur space ko useful rakhta hai."
      },
      {
        "q": "Ek plugin mobile par kaam karta hai lekin web build fail ho jaata hai, kehta hai plugin missing hai. Pehle kya check karna chahiye?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Kya plugin asal me web support karta hai — har plugin ka web implementation nahi hota",
          "Kya phone ka OS version bahut purana hai",
          "Kya web build ko APK chahiye",
          "Kya code me plugin ka naam sahi spell hai"
        ],
        "answer": 0,
        "explanation": "Platform support har plugin ke liye alag hai — mobile-only plugin web par nahi chal sakta, use web-capable alternative ya conditional path chahiye."
      },
      {
        "q": "Mobile UI desktop window me waise hi fit ho jaati hai, bina kisi change ke.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Touch targets, bottom nav aur phone-width columns mouse ke saath wide window par galat lagte hain — desktop ko apna layout chahiye."
      },
      {
        "q": "Code me platform kaise check karte ho, aise tareeqe se jo web par bhi kaam kare?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Screen width check karo aur platform guess karo",
          "Device ka brand name use karo",
          "Har jagah dart:io se Platform.isWindows use karo",
          "Web ke liye kIsWeb use karo, aur dart:io Platform checks sirf wahan jahan web excluded ho"
        ],
        "answer": 3,
        "explanation": "Dart:io web par available nahi hai, isliye kIsWeb ko web case gate karna chahiye — raw Platform check web build ko tod deta hai."
      },
      {
        "q": "Tumhe ek mobile screen ko desktop ke liye adapt karna hai — bottom nav, single column, thumb-sized buttons. Kaunsa plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Bottom nav ki jagah side rail ya side nav laao, centred max-width multi-column layout use karo, aur controls ko mouse use ke liye size karo",
          "Desktop screen par phone-shaped frame ke andar phone layout dikhao",
          "Scratch se alag desktop app banao",
          "Bottom nav aur single column rakho, bas sab kuch wide kar do"
        ],
        "answer": 0,
        "explanation": "Desktop adaptation sirf size nahi, pattern badalta hai — navigation, columns aur controls sab desktop conventions follow karte hain."
      },
      {
        "q": "Apni app ka web ya desktop version banana kab worth it hota hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Kabhi nahi — sirf mobile hi hamesha kaafi hai",
          "Hamesha — har app ko har platform par ship karna chahiye",
          "Jab tumhare users ko wahan asal me zaroorat ho, jaise desks par use hone wala dashboard ya link se share kiya jaane wala tool",
          "Sirf jab mobile app finish aur perfect ho"
        ],
        "answer": 2,
        "explanation": "Naye platforms testing aur maintenance cost karte hain — wo tab payoff dete hain jab real users ko app us screen par chahiye, sirf principle par nahi."
      }
    ]
  },
  {
    "id": "quiz-36-architecture",
    "lessonId": "lesson-36-architecture",
    "title": "Quiz: App Architecture",
    "questions_en": [
      {
        "q": "In Clean Architecture, which layer holds the business rules and knows nothing about Flutter or HTTP?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Presentation (UI + state)",
          "Data (APIs and databases)",
          "Domain (business rules, pure Dart)",
          "Core (shared theme and widgets)"
        ],
        "answer": 2,
        "explanation": "Domain holds entities and use cases in pure Dart, so business rules stay untouched when you change an API or a widget — that is the whole point of the Dependency Rule."
      },
      {
        "q": "What is the job of a Repository?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It is the single door for data — the UI asks it for data without caring whether it comes from an API, a cache, or a database",
          "It compiles Dart code to native code",
          "It signs the app for release",
          "It animates screen transitions"
        ],
        "answer": 0,
        "explanation": "The UI asks one door for data and never cares where it comes from, so caching or switching APIs becomes a change inside the Repository only."
      },
      {
        "q": "MVVM and MVC are exactly the same pattern, just two names for it.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "MVVM has a ViewModel bridging View and Model, while MVC has a Controller — different bridges with different responsibilities, so the names are not interchangeable."
      },
      {
        "q": "What does GetIt do in an app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "It builds widget trees faster",
          "It is a service locator: register services once and fetch them anywhere with getIt<Type>()",
          "It stores user data in a database",
          "It creates app icons"
        ],
        "answer": 1,
        "explanation": "You register services once and fetch them anywhere, so objects receive their dependencies instead of creating them — which makes them easy to swap in tests."
      },
      {
        "q": "Your app is growing to several features and a new developer must find any file fast. Which folder structure should you pick?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "One giant lib/ folder with all files mixed together",
          "Layer-first, with only shared presentation, domain, and data folders for all features",
          "One folder per screen, with API code copied into each screen",
          "Feature-first: each feature gets its own folder with its own presentation/domain/data, and shared code lives in core/"
        ],
        "answer": 3,
        "explanation": "One folder per feature means adding a feature touches one place, and a new developer finds any file in under a minute; only truly shared code lives in core/."
      },
      {
        "q": "A widget calls the API directly with http.get, shows the data, and now the screen is impossible to test without the internet. Which fix is right?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Copy the API call into every screen that needs the data",
          "Move the API call behind a Repository: the widget talks to a ViewModel, the ViewModel talks to the Repository, and the Repository talks to the API",
          "Delete the API and hardcode the data in the widget",
          "Call the API twice so one copy can be tested"
        ],
        "answer": 1,
        "explanation": "Putting a Repository between UI and API keeps widgets dumb and testable — a fake Repository can stand in for the network in tests."
      },
      {
        "q": "Even a tiny demo app should use full Clean Architecture with all three layers.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Architecture scales to need — full layers for a growing app, lighter MVVM for a small one; over-building a demo wastes the effort the structure was meant to save."
      },
      {
        "q": "One class fetches data from an API, formats it, and draws it on screen. Which SOLID principle does it break?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Open/Closed",
          "Dependency Inversion",
          "Liskov Substitution",
          "Single Responsibility"
        ],
        "answer": 3,
        "explanation": "One class, one reason to change — fetching, formatting, and drawing are three reasons, so split them before every change risks breaking all three."
      },
      {
        "q": "You are layering a login feature. Which split follows Clean Architecture?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "The login widget calls the API, checks the response, and saves the token itself",
          "The Domain layer imports the HTTP client and calls the API directly",
          "Presentation: login screen + ViewModel; Domain: Login use case, AuthRepository contract, User entity; Data: repository implementation + API data source",
          "The Data layer holds the login screen widgets and navigation"
        ],
        "answer": 2,
        "explanation": "Each layer does only its job, so swapping the login API changes Data alone — Domain never imports HTTP and the UI never sees the network."
      },
      {
        "q": "A team app keeps growing: new features every month, tests required, and the backend API may change. Which architecture should you pick, and why?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Keep all API calls in widgets — fastest right now",
          "MVVM only, with API calls inside the ViewModels",
          "Clean Architecture: Presentation/Domain/Data layers, Repository contracts, and GetIt for dependencies",
          "No structure at all until the app is finished"
        ],
        "answer": 2,
        "explanation": "Layers plus Repository contracts plus DI isolate change and make testing possible — exactly what a growing team app needs, even though it is more setup than MVVM alone."
      }
    ],
    "questions_hi": [
      {
        "q": "Clean Architecture me business rules kis layer me hote hain, jo Flutter ya HTTP ke baare me kuch nahi jaanti?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Presentation (UI + state)",
          "Data (APIs aur databases)",
          "Domain (business rules, pure Dart)",
          "Core (shared theme aur widgets)"
        ],
        "answer": 2,
        "explanation": "Domain me entities aur use cases pure Dart me hote hain, isliye API ya widget badalne par business rules ko haath nahi lagana padta — yehi Dependency Rule ka poora point hai."
      },
      {
        "q": "Repository ka kaam kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye data ka ek hi darwaza hai — UI usse data maangta hai, usko farak nahi padta ki wo API se aaye, cache se, ya database se",
          "Ye Dart code ko native code me compile karta hai",
          "Ye app ko release ke liye sign karta hai",
          "Ye screen transitions animate karta hai"
        ],
        "answer": 0,
        "explanation": "UI ek darwaze se data maangta hai aur source ki parwah nahi karta, isliye caching ya API badalna sirf Repository ke andar ka change ban jata hai."
      },
      {
        "q": "MVVM aur MVC bilkul ek hi pattern hain, bas do naam hain.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "MVVM me View aur Model ke beech ViewModel bridge hota hai, jabki MVC me Controller hota hai — alag bridges, alag responsibilities, isliye naam interchangeable nahi hain."
      },
      {
        "q": "GetIt app me kya karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ye widget trees ko fast banata hai",
          "Ye ek service locator hai: services ek baar register karo aur kahin bhi getIt<Type>() se le lo",
          "Ye user data ko database me store karta hai",
          "Ye app icons banata hai"
        ],
        "answer": 1,
        "explanation": "Services ek baar register karke kahin bhi le sakte ho, isliye objects apni dependencies khud banane ki bajay paate hain — aur tests me unko swap karna aasaan ho jata hai."
      },
      {
        "q": "Tumhara app kai features tak badh raha hai aur naye developer ko koi bhi file jaldi milni chahiye. Kaunsi folder structure chunoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ek bada lib/ folder jisme saari files mili hui hon",
          "Layer-first, sirf shared presentation, domain, aur data folders saare features ke liye",
          "Har screen ka ek folder, aur API code har screen me copy kiya hua",
          "Feature-first: har feature ka apna folder, usme apni presentation/domain/data, aur shared code core/ me"
        ],
        "answer": 3,
        "explanation": "Ek feature ka ek folder matlab naya feature ek jagah add hota hai, aur naya developer koi bhi file ek minute me dhoondh leta hai; sirf sach me shared code core/ me rehta hai."
      },
      {
        "q": "Ek widget seedha http.get se API call karta hai, data dikhata hai, aur ab us screen ko bina internet ke test karna impossible hai. Sahi fix kaunsa hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "API call ko har screen me copy kar do jisko data chahiye",
          "API call ko Repository ke peeche le jao: widget ViewModel se baat kare, ViewModel Repository se, aur Repository API se",
          "API delete karke data widget me hardcode kar do",
          "API ko 2 baar call karo taaki ek copy test ho sake"
        ],
        "answer": 1,
        "explanation": "UI aur API ke beech Repository rakhne se widgets dumb aur testable rehte hain — tests me asli network ki jagah fake Repository lag sakta hai."
      },
      {
        "q": "Ek chhote demo app me bhi full Clean Architecture honi chahiye, teeno layers ke saath.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Architecture zaroorat ke hisaab se scale hoti hai — badhte app ke liye full layers, chhote app ke liye halka MVVM; demo ko over-build karna wahi mehnat waste karta hai jisko structure bachane ke liye tha."
      },
      {
        "q": "Ek class API se data fetch bhi karti hai, format bhi karti hai, aur screen par draw bhi karti hai. Ye kis SOLID principle ko todti hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Open/Closed",
          "Dependency Inversion",
          "Liskov Substitution",
          "Single Responsibility"
        ],
        "answer": 3,
        "explanation": "Ek class, ek badalne ki wajah — fetch karna, format karna aur draw karna 3 wajahen hain, isliye unko todo warna har change teeno ko todne ka risk ban jayega."
      },
      {
        "q": "Tum login feature ko layer kar rahe ho. Kaunsa split Clean Architecture ke hisaab se sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Login widget khud API call kare, response check kare, aur token save kare",
          "Domain layer HTTP client import karke seedha API call kare",
          "Presentation: login screen + ViewModel; Domain: Login use case, AuthRepository contract, User entity; Data: repository implementation + API data source",
          "Data layer me login screen ke widgets aur navigation rakho"
        ],
        "answer": 2,
        "explanation": "Har layer sirf apna kaam karti hai, isliye login API badalne par sirf Data badalta hai — Domain kabhi HTTP import nahi karta aur UI ko network dikhta hi nahi."
      },
      {
        "q": "Ek team app lagatar badh raha hai: har mahine naye features, tests zaroori hain, aur backend API badal sakta hai. Kaunsi architecture chunoge, aur kyon?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Saari API calls widgets me hi rakho — abhi ke liye sabse fast",
          "Sirf MVVM, API calls ViewModels ke andar",
          "Clean Architecture: Presentation/Domain/Data layers, Repository contracts, aur dependencies ke liye GetIt",
          "App complete hone tak koi structure hi mat rakho"
        ],
        "answer": 2,
        "explanation": "Layers plus Repository contracts plus DI change ko isolate karte hain aur testing possible banate hain — badhte team app ko exactly yehi chahiye, bhale setup MVVM se zyada ho."
      }
    ]
  },
  {
    "id": "quiz-37-ship-it",
    "lessonId": "lesson-37-ship-it",
    "title": "Quiz: Ship It",
    "questions_en": [
      {
        "q": "Which build should you send to real users and testers as 'the app'?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A debug build, because it has debugging tools attached",
          "A release build: optimised, small, fast, with debugging stripped out",
          "A profile build, because it is in the middle",
          "Whichever build happens to be on your laptop"
        ],
        "answer": 1,
        "explanation": "Users judge your app by the release build — a debug build lags and behaves differently, so it is never 'the app' you send out."
      },
      {
        "q": "Which file do you upload to Google Play for a new app?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "APK",
          "AAB (Android App Bundle)",
          "IPA",
          "ZIP of the source code"
        ],
        "answer": 1,
        "explanation": "AAB is a publishing format, not directly installable — Play builds a small optimised APK per device from it, and requires it for new apps."
      },
      {
        "q": "A Play Store listing needs an app icon and a description before you can publish.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "The listing is your sales page — the icon and description tell users what the app does before they ever install it."
      },
      {
        "q": "In version 1.2.3+45, what is the +45?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "The count of features in the app",
          "The app's download size in MB",
          "The build number, which must increase with every store upload",
          "The number of screenshots in the listing"
        ],
        "answer": 2,
        "explanation": "Users see 1.2.3, but stores refuse a build whose build number did not go up — Android maps it to versionCode, iOS to CFBundleVersion."
      },
      {
        "q": "Which order is right before a production release?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Upload a debug build straight to production",
          "Go to production first, then test with users",
          "Screenshots only — testing can wait until after launch",
          "Bump the version and build number, get analyze and tests green, test the release build on a real device, then Internal Testing, then staged production"
        ],
        "answer": 3,
        "explanation": "Checklist first, a real-device test, then small test tracks before staged production — every skipped step is how production incidents happen."
      },
      {
        "q": "Your app works in debug but crashes on launch in the release build, and the crash log has no useful names. What is the most likely cause and fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "The phone is too old — tell users to buy a new phone",
          "Release builds strip debugging info and can expose missing assets or wrong config; test the release build on a real phone, check assets and config, and use logs and DevTools to find it",
          "Re-upload the debug build to the store as the fix",
          "Delete the crash logs so the crash stops appearing"
        ],
        "answer": 1,
        "explanation": "Release-only bugs hide in missing assets or wrong config, and only show up in a real release build — that is why testing it on a real phone is a checklist step."
      },
      {
        "q": "To publish an iOS app you need an Apple Developer account (plus a Mac and Xcode).",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "There is no way around the Mac and the account for a real App Store build — TestFlight and review both run through App Store Connect."
      },
      {
        "q": "Which store assets matter most after the app icon?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A ZIP of your source code",
          "Your debug logs",
          "Screenshots of real screens, in order, telling what the app does in the first three images",
          "A list of your dependencies"
        ],
        "answer": 2,
        "explanation": "After the icon, screenshots sell the app — real screens in story order beat any description most users never read past line two."
      },
      {
        "q": "You have a finished app. Which ship plan follows this lesson?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Go straight to 100% of production users",
          "Share the debug build as the final app",
          "Internal Testing with a few real users, then Closed Testing, then staged production — watching crash reports for 24 hours before widening",
          "Upload without an icon or description to save time"
        ],
        "answer": 2,
        "explanation": "Small test tracks catch real-device problems before all users meet them, and a staged rollout plus crash-watching limits the damage if something slips through."
      },
      {
        "q": "A bug only appears sometimes and you cannot explain it yet. What should you do first?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Guess a fix and hope it works",
          "Reproduce it on demand, then observe with DevTools, breakpoints, and logs, form a theory, test it, fix it, and verify the fix",
          "Change three things at once and ship",
          "Ignore it until users complain"
        ],
        "answer": 1,
        "explanation": "Debugging is a loop, not guessing — if you cannot reproduce a bug, you cannot prove you fixed it, and changing three things at once hides which one worked."
      }
    ],
    "questions_hi": [
      {
        "q": "Asli users aur testers ko 'ye app hai' keh ke kaunsi build bhejni chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Debug build, kyunki usme debugging tools attached hote hain",
          "Release build: optimised, chhota, fast, debugging hata hua",
          "Profile build, kyunki wo beech me hai",
          "Jo build laptop par pada ho, wahi"
        ],
        "answer": 1,
        "explanation": "Users tumhare app ko release build se judge karte hain — debug build slow chalta hai aur alag behave karta hai, isliye wo kabhi 'ye app hai' nahi hota."
      },
      {
        "q": "Naye app ke liye Google Play par kaunsi file upload karte ho?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "APK",
          "AAB (Android App Bundle)",
          "IPA",
          "Source code ka ZIP"
        ],
        "answer": 1,
        "explanation": "AAB publishing format hai, seedha install nahi hota — Play usse har device ke liye chhota optimised APK banata hai, aur naye apps ke liye yehi zaroori hai."
      },
      {
        "q": "Play Store listing ke liye publish se pehle app icon aur description chahiye hota hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Listing tumhara sales page hai — icon aur description users ko install se pehle batate hain ki app kya karta hai."
      },
      {
        "q": "Version 1.2.3+45 me +45 kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App me features ki ginati",
          "App ka download size MB me",
          "Build number, jo har store upload ke saath badhna chahiye",
          "Listing me screenshots ki ginati"
        ],
        "answer": 2,
        "explanation": "Users 1.2.3 dekhte hain, par stores us build ko reject kar dete hain jiska build number nahi badha — Android me ye versionCode, iOS me CFBundleVersion banta hai."
      },
      {
        "q": "Production release se pehle sahi order kaunsa hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Debug build seedha production par upload karo",
          "Pehle production par jao, phir users se test karwao",
          "Sirf screenshots — testing launch ke baad ho jayegi",
          "Version aur build number badhao, analyze aur tests green karo, release build ko asli phone par test karo, phir Internal Testing, phir staged production"
        ],
        "answer": 3,
        "explanation": "Pehle checklist, phir asli device par test, phir chhote test tracks, phir staged production — har skipped step hi production incidents ki wajah banti hai."
      },
      {
        "q": "Tumhara app debug me chalta hai par release build me launch par crash ho jata hai, aur crash log me koi useful naam nahi hai. Sabse likely wajah aur fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Phone bahut purana hai — users ko naya phone lene ko kaho",
          "Release builds debugging info hata dete hain aur missing assets ya galat config saamne la sakte hain; release build ko asli phone par test karo, assets aur config check karo, aur logs aur DevTools se dhoondho",
          "Debug build ko store par dobara upload kar do, fix ho jayega",
          "Crash logs delete kar do taaki crash dikhna band ho jaye"
        ],
        "answer": 1,
        "explanation": "Release-only bugs missing assets ya galat config me chhupte hain, aur sirf asli release build me dikhte hain — isi liye usko real phone par test karna checklist ka step hai."
      },
      {
        "q": "iOS app publish karne ke liye Apple Developer account chahiye hota hai (plus Mac aur Xcode).",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "Asli App Store build ke liye Mac aur account se bachne ka rasta nahi hai — TestFlight aur review dono App Store Connect se chalte hain."
      },
      {
        "q": "App icon ke baad kaunse store assets sabse zyada matter karte hain?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Tumhare source code ka ZIP",
          "Tumhare debug logs",
          "Asli screens ke screenshots, order me, jo pehli 3 images me batayen ki app kya karta hai",
          "Tumhari dependencies ki list"
        ],
        "answer": 2,
        "explanation": "Icon ke baad screenshots app ko bechte hain — story order me asli screens kisi bhi description se behtar hain, jisko zyadatar users 2 lines se zyada padhte hi nahi."
      },
      {
        "q": "Tumhara app finished hai. Is lesson ke hisaab se sahi ship plan kaunsa hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Seedha 100% production users par jao",
          "Debug build ko final app keh ke share kar do",
          "Pehle kuch asli users ke saath Internal Testing, phir Closed Testing, phir staged production — widen karne se pehle 24 ghante crash reports dekho",
          "Time bachane ke liye bina icon ya description ke upload karo"
        ],
        "answer": 2,
        "explanation": "Chhote test tracks asli-device problems ko saare users se pehle pakad lete hain, aur staged rollout plus crash-watching nuksaan ko limit kar deta hai agar kuch slip ho bhi jaye."
      },
      {
        "q": "Ek bug kabhi kabhi hi aata hai aur tum usko abhi explain nahi kar sakte. Pehle kya karna chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Guess karke fix karo aur umeed karo ki chal jayega",
          "Pehle on demand reproduce karo, phir DevTools, breakpoints aur logs se observe karo, theory banao, test karo, fix karo, aur verify karo",
          "Ek saath 3 cheezen badal ke ship kar do",
          "Users ke complain karne tak ignore karo"
        ],
        "answer": 1,
        "explanation": "Debugging ek loop hai, guessing nahi — agar bug ko reproduce nahi kar sakte to ye prove nahi kar sakte ki fix kiya hai, aur ek saath 3 cheezen badalne se pata nahi chalta ki kisne kaam kiya."
      }
    ]
  },
  {
    "id": "quiz-38-release-engineering",
    "lessonId": "lesson-38-release-engineering",
    "title": "Quiz: Release Engineering",
    "questions_en": [
      {
        "q": "What is a flavor in Flutter?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "A UI theme colour",
          "A variant of your app built from the same code — dev, staging, or prod — with a different name, icon, API URL, or backend",
          "A new programming language",
          "A type of screen animation"
        ],
        "answer": 1,
        "explanation": "Same code, different config — dev, staging, and prod builds differ in name, icon, API URL, and Firebase project, so a dev build can never accidentally talk to real user data."
      },
      {
        "q": "Why must a release build be signed?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "To make the app file smaller",
          "To add animations to the app",
          "To make Dart code run faster",
          "To prove the app came from you — Android and iOS both refuse unsigned or wrongly signed release builds"
        ],
        "answer": 3,
        "explanation": "Signing is identity: it proves the app came from you, and losing a self-managed signing key can mean you never update that app again."
      },
      {
        "q": "CI runs your checks and builds on the developer's own laptop.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "CI runs on a server on every push, so a build that only works on one developer's laptop never reaches testers."
      },
      {
        "q": "What does Fastlane automate?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Writing new app features for you",
          "Building, signing, taking screenshots, and uploading to the stores, described as lanes in a Fastfile",
          "Designing app icons only",
          "Answering user reviews on the stores"
        ],
        "answer": 1,
        "explanation": "You describe steps as lanes in a Fastfile, and Fastlane runs them on your machine or inside CI — it is a tool, not a hosted service by itself."
      },
      {
        "q": "Your prod build must talk to the real API and your dev build to the test API. How do you set that up?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Define flavors and pass the URL with --dart-define, read in Dart with String.fromEnvironment('API_URL')",
          "Edit the API URL by hand in the code before each release",
          "Put both URLs in the UI and let users pick one",
          "Use the same URL for dev and prod, to keep it simple"
        ],
        "answer": 0,
        "explanation": "Config picked at build time can never be forgotten in a manual edit — one forgotten edit ships prod pointed at test data."
      },
      {
        "q": "Your prod build is showing test data. What went wrong, and how do you fix it?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Users are on the wrong phones",
          "The prod build was built with the dev flavor or dev API URL; rebuild with --flavor prod and the prod --dart-define value, and confirm flavor and URL in the release checklist",
          "Delete the database to clear the test data",
          "Ask users to install the dev build instead"
        ],
        "answer": 1,
        "explanation": "The bug is a build-time config mistake, not bad data — rebuilding with the right flavor and checking flavor plus URL in the release checklist stops it happening again."
      },
      {
        "q": "Signing is optional for Google Play uploads.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Play refuses unsigned builds, and with Play App Signing your upload key is what proves the build is yours — signing is never optional."
      },
      {
        "q": "You have no Mac but need iOS builds. Which CI choice fits, and why?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "GitHub Actions running only on your own laptop",
          "No CI at all — build by hand every time",
          "Codemagic, a hosted mobile CI that provides Mac and Android build machines",
          "Fastlane alone on a Windows PC, for App Store builds"
        ],
        "answer": 2,
        "explanation": "Hosted CI gives you build machines you do not own — handy for iOS when you have no Mac, while Fastlane alone still needs a machine to run on."
      },
      {
        "q": "Put this CI pipeline in the right order: push code, analyze and tests, build release, upload to testers.",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Upload to the store, then build, then test, then push",
          "Build first, push second, upload third, test last",
          "Push, then upload, then build, then test",
          "Push code, then analyze and tests, then build the release, then upload to testers"
        ],
        "answer": 3,
        "explanation": "Cheap checks first fail a typo in seconds, and a failed step stops the pipeline — so no broken build ever reaches testers."
      },
      {
        "q": "Why does the lesson insist on a release checklist instead of memory?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Checklists make the app file smaller",
          "It turns releases into a repeatable process — every production incident traces back to a skipped checklist step",
          "Checklists replace testing entirely",
          "The stores require you to upload a checklist file"
        ],
        "answer": 1,
        "explanation": "Memory skips steps under pressure; a checklist makes version bumps, flavor checks, real-device tests, and staged rollout happen every single time."
      }
    ],
    "questions_hi": [
      {
        "q": "Flutter me flavor kya hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek UI theme colour",
          "Wahi code se bana tumhare app ka ek variant — dev, staging, ya prod — alag naam, icon, API URL, ya backend ke saath",
          "Ek nayi programming language",
          "Ek tarah ka screen animation"
        ],
        "answer": 1,
        "explanation": "Wahi code, alag config — dev, staging aur prod builds naam, icon, API URL aur Firebase project me alag hote hain, taaki dev build galti se bhi asli users ke data se baat na kare."
      },
      {
        "q": "Release build ko sign karna kyon zaroori hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "App ki file ko chhota karne ke liye",
          "App me animations add karne ke liye",
          "Dart code ko fast chalane ke liye",
          "Ye prove karne ke liye ki app tumhari hai — Android aur iOS dono unsigned ya galat signed release builds ko reject kar dete hain"
        ],
        "answer": 3,
        "explanation": "Signing identity hai: ye prove karta hai ki app tumhari hai, aur self-managed signing key kho jaye to ho sakta hai us app ko kabhi update na kar pao."
      },
      {
        "q": "CI tumhare checks aur builds developer ke apne laptop par chalata hai.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "CI har push par server par chalta hai, isliye jo build sirf ek developer ke laptop par chalta hai wo kabhi testers tak nahi pahunchta."
      },
      {
        "q": "Fastlane kya automate karta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Tumhare liye naye app features likhna",
          "Build, signing, screenshots lena, aur stores par upload karna, Fastfile me lanes ke roop me",
          "Sirf app icons design karna",
          "Stores par user reviews ka jawaab dena"
        ],
        "answer": 1,
        "explanation": "Steps ko Fastfile me lanes keh ke likhte hain, aur Fastlane unko tumhari machine par ya CI ke andar chalata hai — ye ek tool hai, khud koi hosted service nahi."
      },
      {
        "q": "Tumhara prod build asli API se baat kare aur dev build test API se. Ye setup kaise karoge?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Flavors define karo aur URL ko --dart-define se pass karo, Dart me String.fromEnvironment('API_URL') se padho",
          "Har release se pehle code me API URL haath se edit karo",
          "Dono URLs UI me daal do aur users ko chunne do",
          "Dev aur prod ke liye wahi URL use karo, simple rakhne ke liye"
        ],
        "answer": 0,
        "explanation": "Build time par chuni gayi config manual edit me kabhi bhool nahi sakti — ek bhoola hua edit prod build ko test data par pahuncha deta hai."
      },
      {
        "q": "Tumhara prod build test data dikha raha hai. Kya galat hua, aur fix kaise karoge?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Users galat phones par hain",
          "Prod build dev flavor ya dev API URL ke saath bana tha; --flavor prod aur prod --dart-define value ke saath dobara build karo, aur release checklist me flavor aur URL confirm karo",
          "Test data saaf karne ke liye database delete kar do",
          "Users se kaho ki dev build install kar lein"
        ],
        "answer": 1,
        "explanation": "Ye galti build-time config ki hai, kharab data ki nahi — sahi flavor ke saath dobara build karna aur release checklist me flavor plus URL check karna isko dobara hone se rokta hai."
      },
      {
        "q": "Google Play uploads ke liye signing optional hai.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Play unsigned builds ko refuse karta hai, aur Play App Signing ke saath tumhari upload key hi prove karti hai ki build tumhari hai — signing kabhi optional nahi hai."
      },
      {
        "q": "Tumhare paas Mac nahi hai par iOS builds chahiye. Kaunsi CI choice fit baithti hai, aur kyon?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "GitHub Actions sirf apne laptop par chalana",
          "Koi CI hi nahi — har baar haath se build karo",
          "Codemagic, ek hosted mobile CI jo Mac aur Android build machines deti hai",
          "App Store builds ke liye Windows PC par akele Fastlane"
        ],
        "answer": 2,
        "explanation": "Hosted CI tumhe wo build machines deti hai jo tumhare paas nahi hain — jab Mac nahi hai to iOS ke liye kaam aati hai, jabki Fastlane akele ko bhi chalne ke liye ek machine chahiye."
      },
      {
        "q": "Is CI pipeline ko sahi order me lagao: push code, analyze aur tests, release build, testers ko upload.",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Pehle store par upload, phir build, phir test, phir push",
          "Pehle build, phir push, phir upload, phir test",
          "Push, phir upload, phir build, phir test",
          "Push code, phir analyze aur tests, phir release build, phir testers ko upload"
        ],
        "answer": 3,
        "explanation": "Saste checks pehle chalenge to typo seconds me fail ho jayega, aur koi step fail ho to pipeline ruk jati hai — isliye toota build kabhi testers tak nahi pahunchta."
      },
      {
        "q": "Lesson memory ki bajay release checklist par kyon zor deta hai?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Checklists app ki file ko chhota banati hain",
          "Ye releases ko repeatable process bana deti hai — har production incident ke peeche ek skipped checklist step hota hai",
          "Checklists testing ko poori tarah replace kar deti hain",
          "Stores tumse checklist file upload karwate hain"
        ],
        "answer": 1,
        "explanation": "Pressure me memory steps skip kar deti hai; checklist version bumps, flavor checks, real-device tests aur staged rollout ko har baar pakka kar deti hai."
      }
    ]
  },
  {
    "id": "quiz-39-monetization",
    "lessonId": "lesson-39-monetization",
    "title": "Quiz: Monetization",
    "questions_en": [
      {
        "q": "Which earning model fits 'free app, users pay once to remove ads forever'?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Banner ads only",
          "A subscription that renews monthly",
          "A non-consumable in-app purchase (buy once, keep forever)",
          "Rewarded ads only"
        ],
        "answer": 2,
        "explanation": "Consumable is bought again and again, like coins; non-consumable is bought once and kept forever — 'remove ads' is the classic non-consumable."
      },
      {
        "q": "What is the correct in-app purchase flow order?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Query products, show the store price, buy, listen to purchaseStream, deliver the item, then completePurchase",
          "Buy first, then create the products in the store",
          "Hardcode the price in the app, then deliver the item",
          "Deliver the item first and ask the store about payment later"
        ],
        "answer": 0,
        "explanation": "You never hardcode the store price, and you only finish the purchase after delivering the item — that order is what keeps purchases honest and complete."
      },
      {
        "q": "You may place ads anywhere in your app, even disguised as app buttons.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ads must be clearly ads — a fake Download button that is really an ad is a policy violation that can get the app removed."
      },
      {
        "q": "A user with an active subscription reinstalls the app on a new phone and their premium is gone. What should the app do?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Make them pay again",
          "Delete their premium access permanently",
          "Wait until their next billing date",
          "Restore and verify their subscription status (on your server) so their premium access returns"
        ],
        "answer": 3,
        "explanation": "Subscriptions live with the store account, not the device — restoring and server-verifying status returns what the user already paid for."
      },
      {
        "q": "A notes app people open daily, with sync and extra storage as its premium value. Which monetization model fits best?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "A one-time paid app nobody can try first",
          "An interstitial ad after every tap",
          "A free app with a subscription for premium sync and storage, with a clear free tier",
          "Charging users per note they save"
        ],
        "answer": 2,
        "explanation": "Daily use plus ongoing premium value fits recurring revenue, and a clear free tier keeps the app tryable — matching the model to how often users open the app is a product decision, not a technical one."
      },
      {
        "q": "A user buys 'remove ads', reinstalls the app, and the ads are back. What is the fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Tell the user to buy it again",
          "Offer a restore-purchases flow and verify the purchase (on your server for anything valuable) so the non-consumable is returned",
          "Show even more ads as a penalty",
          "Change the product ID and hope the old purchase reappears"
        ],
        "answer": 1,
        "explanation": "A non-consumable is bought once and kept forever, so the app must be able to return it — and for anything valuable, verification belongs on your server, not only on the device."
      },
      {
        "q": "Policy traps are minor details you can sort out after a rejection.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Digital goods must use store payments, and ad fraud can ban accounts permanently — reading policies before you build beats fixing a removal after one."
      },
      {
        "q": "How should you use test ad IDs and real ad IDs?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Real ad IDs everywhere, even in testing",
          "Test ad IDs in production",
          "Test ad IDs while testing, real IDs only in production — and never click your own real ads",
          "Ask friends to click your real ads to help you earn"
        ],
        "answer": 2,
        "explanation": "Test IDs exist so testing never touches real money or real advertisers — and clicking your own real ads is fraud, not help."
      },
      {
        "q": "Plan monetization for a notes app. Which plan is honest and complete?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Interstitial on app open plus an outside payment link to dodge the store cut",
          "Free tier with banner ads at natural breaks, a subscription for sync and storage, store payments for digital goods, prices and renewal terms shown clearly, and policies re-read before launch",
          "Fake download-button ads plus self-clicks to boost earnings",
          "Five confusing tiers with hidden renewal terms"
        ],
        "answer": 1,
        "explanation": "This plan earns without annoying users or breaking rules: free tier stays usable, full-screen ads only at natural breaks, digital goods go through store payments, and terms are shown before purchase."
      },
      {
        "q": "What should decide your price?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "What the feature cost to build",
          "The highest price any other app charges",
          "User value, what similar apps charge, conversion testing, and the store cut — summed up as: the user pays X because they get Y every Z",
          "Your favourite number"
        ],
        "answer": 2,
        "explanation": "Price follows value, not build cost — and the one-sentence test ('user pays X because they get Y every Z') proves the offer is ready before any price is set."
      }
    ],
    "questions_hi": [
      {
        "q": "'Free app, users ek baar pay karke hamesha ke liye ads hatayen' — iske liye kaunsa earning model fit hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Sirf banner ads",
          "Monthly renew hone wala subscription",
          "Non-consumable in-app purchase (ek baar khareedo, hamesha rahega)",
          "Sirf rewarded ads"
        ],
        "answer": 2,
        "explanation": "Consumable baar baar khareeda jata hai, jaise coins; non-consumable ek baar khareedo aur hamesha rahega — 'remove ads' classic non-consumable hai."
      },
      {
        "q": "In-app purchase ka sahi flow order kya hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Products query karo, store ka price dikhao, khareedo, purchaseStream suno, item deliver karo, phir completePurchase karo",
          "Pehle khareedo, phir store me products banao",
          "Price app me hardcode karo, phir item deliver karo",
          "Pehle item deliver karo aur payment ke baare me store se baad me poochho"
        ],
        "answer": 0,
        "explanation": "Store ka price kabhi hardcode nahi karte, aur purchase tabhi complete karte ho jab item deliver ho jaye — yehi order purchases ko honest aur complete rakhta hai."
      },
      {
        "q": "Tum app me kahin bhi ads laga sakte ho, bhale wo app ke buttons jaise disguise hon.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Ads saaf taur par ads dikhne chahiye — fake Download button jo asal me ad hai, policy violation hai jo app ko remove karwa sakta hai."
      },
      {
        "q": "Ek user jiska subscription active hai, naya phone par app reinstall karta hai aur uska premium gayab hai. App ko kya karna chahiye?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Unse dobara pay karwao",
          "Unka premium access hamesha ke liye delete kar do",
          "Agli billing date tak wait karo",
          "Unki subscription status ko restore aur verify karo (apne server par) taaki unka premium access wapas aa jaye"
        ],
        "answer": 3,
        "explanation": "Subscriptions device se nahi, store account se judi hoti hain — restore karke server par status verify karne se user ko wahi premium wapas milta hai jiske liye usne pay kiya tha."
      },
      {
        "q": "Ek notes app jisko log roz kholte hain, aur sync aur extra storage uski premium value hai. Kaunsa monetization model sabse fit hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Ek one-time paid app jisko koi pehle try hi na kar sake",
          "Har tap ke baad ek interstitial ad",
          "Free app plus premium sync aur storage ke liye subscription, saaf free tier ke saath",
          "Har note save karne par charge karna"
        ],
        "answer": 2,
        "explanation": "Roz use hone wala app plus ongoing premium value recurring revenue ke liye fit hai, aur saaf free tier app ko try karne layak rakhta hai — model ko users ke use se match karna product decision hai, technical nahi."
      },
      {
        "q": "Ek user 'remove ads' khareedta hai, app reinstall karta hai, aur ads wapas aa jate hain. Fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "User se kaho ki dobara khareed le",
          "Restore-purchases flow do aur purchase ko verify karo (valuable cheez ke liye apne server par) taaki non-consumable wapas mil jaye",
          "Saza ke taur par aur zyada ads dikhao",
          "Product ID badal do aur umeed karo ki purana purchase wapas aa jayega"
        ],
        "answer": 1,
        "explanation": "Non-consumable ek baar khareeda jata hai aur hamesha rehta hai, isliye app ko usko wapas laana aana chahiye — aur valuable cheez ke liye verification server par honi chahiye, sirf device par nahi."
      },
      {
        "q": "Policy traps chhoti details hain, rejection ke baad sort out kar lenge.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Digital goods ko store payments se hi jaana chahiye, aur ad fraud se accounts permanently ban ho sakte hain — build karne se pehle policies padhna, removal ke baad fix karne se behtar hai."
      },
      {
        "q": "Test ad IDs aur real ad IDs ko kaise use karna chahiye?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Testing me bhi har jagah real ad IDs",
          "Production me test ad IDs",
          "Testing me test ad IDs, production me hi real IDs — aur apne asli ads par kabhi khud click mat karo",
          "Doston se kaho ki tumhare real ads par click karke help karein"
        ],
        "answer": 2,
        "explanation": "Test IDs isi liye hain taaki testing me asli paisa ya asli advertisers involve na hon — aur apne asli ads par khud click karna fraud hai, help nahi."
      },
      {
        "q": "Ek notes app ke liye monetization plan banao. Kaunsa plan honest aur complete hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "App khulte hi interstitial plus store cut se bachne ke liye bahar ka payment link",
          "Free tier, natural breaks par banner ads, sync aur storage ke liye subscription, digital goods ke liye store payments, prices aur renewal terms saaf dikhaye hue, aur launch se pehle policies dobara padhi hui",
          "Fake download-button ads plus khud ke clicks se earning badhana",
          "Chhupi renewal terms ke saath 5 confusing tiers"
        ],
        "answer": 1,
        "explanation": "Ye plan users ko pareshan kiye bina aur rules tode bina earn karta hai: free tier usable rehta hai, full-screen ads sirf natural breaks par, digital goods store payments se, aur terms purchase se pehle saaf dikhte hain."
      },
      {
        "q": "Tumhara price kis cheez se decide hona chahiye?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Feature banane me kitna kharcha aaya",
          "Kisi bhi app ka sabse zyada price",
          "User value, milte-julte apps ke charges, conversion testing, aur store cut — ek sentence me: user X pay karta hai kyunki usko har Z me Y milta hai",
          "Tumhara favourite number"
        ],
        "answer": 2,
        "explanation": "Price build cost se nahi, value se banti hai — aur ek sentence ka test ('user X pay karta hai kyunki usko har Z me Y milta hai') prove karta hai ki offer taiyaar hai, price set karne se pehle."
      }
    ]
  },
  {
    "id": "quiz-40-job-ready",
    "lessonId": "lesson-40-job-ready",
    "title": "Quiz: Job-Ready: Portfolio & Interviews",
    "questions_en": [
      {
        "q": "What makes a strong fresher portfolio?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ten half-finished apps",
          "Two or three finished apps a stranger can open, understand, and enjoy in two minutes",
          "Twenty tutorial apps with no README or screenshots",
          "One giant unfinished app"
        ],
        "answer": 1,
        "explanation": "Recruiters judge what a stranger can open and enjoy in two minutes — three finished, documented apps prove far more than twenty undocumented ones."
      },
      {
        "q": "What signals quality on a GitHub profile?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "One giant 'final code' commit",
          "No README at all",
          "Pinned best repos with READMEs (what it does, screenshots, how to run it, tech used) and small regular commits with clear messages",
          "Only private repos nobody can see"
        ],
        "answer": 2,
        "explanation": "A README plus screenshots lets a stranger see and run your best work in 30 seconds, and small regular commits show how you actually work."
      },
      {
        "q": "A good fresher resume lists every tutorial you have ever followed.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "A one-page fresher resume shows 2–3 best projects with links — every line is a question waiting in the interview, so list only what you can explain."
      },
      {
        "q": "An interviewer asks 'setState vs Provider vs Bloc — which is best?' What answer do they actually want?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "One word: Bloc",
          "A textbook definition with no example",
          "Silence until the interviewer moves on",
          "Reasoning by case: small local state goes to setState, shared state to Provider/Riverpod, a large team app with complex events to Bloc — with an example and a trade-off"
        ],
        "answer": 3,
        "explanation": "There is no single best answer — the reasoning is the answer, delivered as short answer, then one example, then one trade-off."
      },
      {
        "q": "What is the right first move on a take-home task?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Start coding immediately",
          "Add every feature you can think of",
          "Read it twice, note what is required, optional, and deliberately vague, plan screens, data model, state choice, and folder structure — then ship a working core first",
          "Submit late with more features than asked for"
        ],
        "answer": 2,
        "explanation": "The task description is the spec — matching it first, with a plan reviewers can grade, beats impressing second with extra features."
      },
      {
        "q": "Your portfolio is twenty tutorial apps with no README or screenshots, and recruiters ignore it. What is the best fix?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "Add twenty more tutorial apps",
          "Cut it to three finished, documented apps: polish edge cases, and add a README, screenshots, and a 60-second video for each",
          "Hide the GitHub link from your resume",
          "Rename the repos to sound more impressive"
        ],
        "answer": 1,
        "explanation": "Cutting to three finished, documented pieces fixes the real problem: recruiters could not tell what you actually built, and polish plus video plus README makes each piece provable."
      },
      {
        "q": "Certificates beat real projects when a recruiter judges you.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Proof is finished apps a stranger can run — certificates never show what you actually built."
      },
      {
        "q": "Which interview prep plan matches the lesson?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Practise concept plus example plus trade-off answers (Stateless vs Stateful, const, state choices, Future vs Stream, debugging a slow list) and be ready to explain every resume line",
          "Memorise definitions only, with no examples",
          "Learn five new packages the night before",
          "Skip examples to save time"
        ],
        "answer": 0,
        "explanation": "Interviewers remember examples, not textbook lines — and any skill you cannot explain becomes a trap, not a strength."
      },
      {
        "q": "Which 30-day job-ready plan follows the lesson?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Watch tutorials for 30 days without building anything",
          "Polish 2–3 finished apps with README and video, pin them on GitHub, write a one-page resume, practise interview answers, and ship one app to a store",
          "List every skill you have ever heard of on your resume",
          "Build ten half-finished apps in 30 days"
        ],
        "answer": 1,
        "explanation": "This plan turns course work into proof: finished apps, a findable GitHub, a one-page resume, practised answers, and one real store release — exactly the portfolio-to-application path in the lesson."
      },
      {
        "q": "After this course, what should you learn next, in the lesson's order?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Five new packages at once",
          "Stop building and only read articles",
          "Deepen one state solution with a real app, ship and maintain one store app, then advanced animations, platform channels, deeper testing, and backend skills",
          "Only watch more tutorials"
        ],
        "answer": 2,
        "explanation": "Deepen, don't widen — real user bugs from a shipped app teach more than skimming five more packages, and the lesson orders the next topics after that foundation."
      }
    ],
    "questions_hi": [
      {
        "q": "Strong fresher portfolio kya hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "10 adhoore apps",
          "2 ya 3 finished apps jinhe koi ajnabi khol ke samajh sake aur 2 minute me enjoy kar sake",
          "Bina README ya screenshots ke 20 tutorial apps",
          "Ek bada adhoora app"
        ],
        "answer": 1,
        "explanation": "Recruiters wahi judge karte hain jo koi ajnabi 2 minute me khol ke enjoy kar sake — 3 finished, documented apps 20 undocumented apps se kahin zyada prove karte hain."
      },
      {
        "q": "GitHub profile par quality ka signal kya hota hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek bada 'final code' commit",
          "Bilkul koi README nahi",
          "Best repos pin kiye hue, READMEs ke saath (ye kya karta hai, screenshots, kaise run karein, kaunsi tech use hui) aur chhote regular commits saaf messages ke saath",
          "Sirf private repos jo koi dekh hi na sake"
        ],
        "answer": 2,
        "explanation": "README plus screenshots se ajnabi 30 seconds me tumhara best kaam dekh aur chala sakta hai, aur chhote regular commits dikhate hain ki tum asal me kaise kaam karte ho."
      },
      {
        "q": "Achhe fresher resume me har wo tutorial list hona chahiye jo tumne kabhi follow kiya ho.",
        "type": "tf",
        "difficulty": "easy",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Fresher ka ek page ka resume best 2–3 projects links ke saath dikhata hai — har line interview me poochha jaane wala sawaal hai, isliye sirf wahi list karo jo explain kar sakte ho."
      },
      {
        "q": "Interviewer poochhta hai 'setState vs Provider vs Bloc — kaunsa best hai?' Wo asal me kya jawaab chahta hai?",
        "type": "mcq",
        "difficulty": "easy",
        "options": [
          "Ek word: Bloc",
          "Bina example ke textbook definition",
          "Interviewer ke aage badhne tak chup rehna",
          "Case ke hisaab se reasoning: chhoti local state setState ko, shared state Provider/Riverpod ko, complex events wali badi team app Bloc ko — ek example aur ek trade-off ke saath"
        ],
        "answer": 3,
        "explanation": "Koi ek best jawaab nahi hai — reasoning hi jawaab hai, jo chhota jawaab, phir ek example, phir ek trade-off ke roop me diya jata hai."
      },
      {
        "q": "Take-home task par sahi pehla kadam kya hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Turant code shuru kar do",
          "Jo feature soch sakte ho, sab add kar do",
          "2 baar padho, note karo ki kya required hai, kya optional hai, aur kya jaanboojh ke vague hai, screens, data model, state choice aur folder structure plan karo — phir pehle working core ship karo",
          "Maange se zyada features ke saath late submit karo"
        ],
        "answer": 2,
        "explanation": "Task description hi spec hai — pehle usko match karna, ek plan ke saath jisko reviewers grade kar sakein, extra features se impress karne se behtar hai."
      },
      {
        "q": "Tumhara portfolio bina README ya screenshots ke 20 tutorial apps ka hai, aur recruiters usko ignore karte hain. Best fix kya hai?",
        "type": "applied",
        "difficulty": "medium",
        "options": [
          "20 aur tutorial apps add kar do",
          "3 finished, documented apps tak kaato: edge cases polish karo, aur har ek ke liye README, screenshots aur 60-second video add karo",
          "Resume se GitHub link chhupa do",
          "Repos ke naam badal ke zyada impressive banao"
        ],
        "answer": 1,
        "explanation": "3 finished, documented pieces tak kaatna asli problem ko fix karta hai: recruiters ko pata hi nahi chalta tha ki tumne asal me kya banaya hai, aur polish plus video plus README har piece ko provable bana deta hai."
      },
      {
        "q": "Recruiter ke judge karne par certificates asli projects se behtar hote hain.",
        "type": "tf",
        "difficulty": "medium",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "Proof wo finished apps hain jinhe koi ajnabi chala sake — certificates kabhi nahi dikhate ki tumne asal me kya banaya hai."
      },
      {
        "q": "Is lesson ke hisaab se kaunsa interview prep plan sahi hai?",
        "type": "mcq",
        "difficulty": "medium",
        "options": [
          "Concept plus example plus trade-off wale jawaab practise karo (Stateless vs Stateful, const, state choices, Future vs Stream, slow list ko debug karna) aur resume ki har line explain karne ke liye taiyaar raho",
          "Sirf definitions rat lo, bina examples ke",
          "Ek raat pehle 5 naye packages seekh lo",
          "Time bachane ke liye examples skip kar do"
        ],
        "answer": 0,
        "explanation": "Interviewers examples yaad rakhte hain, textbook lines nahi — aur jo skill explain nahi kar sakte wo strength nahi, trap ban jati hai."
      },
      {
        "q": "Is lesson ke hisaab se kaunsa 30-day job-ready plan sahi hai?",
        "type": "applied",
        "difficulty": "hard",
        "options": [
          "Bina kuch banaye 30 din tak sirf tutorials dekho",
          "2–3 finished apps ko README aur video ke saath polish karo, GitHub par pin karo, ek page ka resume likho, interview jawaab practise karo, aur ek app store par ship karo",
          "Resume par har wo skill list karo jo kabhi suni ho",
          "30 din me 10 adhoore apps banao"
        ],
        "answer": 1,
        "explanation": "Ye plan course work ko proof me badal deta hai: finished apps, dhoondhne layak GitHub, ek page ka resume, practise kiye hue jawaab, aur ek asli store release — lesson ka portfolio-to-application path exactly yehi hai."
      },
      {
        "q": "Is course ke baad aage kya seekhna chahiye, lesson ke order me?",
        "type": "mcq",
        "difficulty": "hard",
        "options": [
          "Ek saath 5 naye packages",
          "Building band karke sirf articles padho",
          "Ek state solution ko asli app ke saath deepen karo, ek store app ship karke maintain karo, phir advanced animations, platform channels, deeper testing, aur backend skills",
          "Sirf aur tutorials dekho"
        ],
        "answer": 2,
        "explanation": "Deepen karo, widen nahi — shipped app ke asli user bugs 5 naye packages ko upar upar dekhne se zyada sikhate hain, aur lesson agle topics ko isi foundation ke baad order karta hai."
      }
    ]
  }
],quiz:{passPercent:70},ranks:[{name:"Hello Worlder",need:0},{name:"Dart Explorer",need:3},{name:"Widget Tinkerer",need:7},{name:"Layout Architect",need:12},{name:"State Wrangler",need:18},{name:"Data Wizard",need:24},{name:"Backend Builder",need:27},{name:"Animation Alchemist",need:31},{name:"App Craftsman",need:35},{name:"Flutter Master",need:40}]};