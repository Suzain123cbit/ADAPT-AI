/**
 * Phase 3 Tutor Content Bank
 * Fully supporting: Loops, Functions, Parameters vs Arguments, Working with APIs
 * and additional roadmap concepts.
 */

export const TUTOR_LESSONS = {
  loops: {
    id: 'loops',
    roadmapId: 'loops',
    title: 'Loops & Iteration',
    category: 'Control Flow',
    defaultDifficulty: 'medium',
    
    explanations: {
      'Analogy': 'Think of a loop like a music playlist on repeat or an industrial conveyor belt. Instead of a technician inspecting 1,000 items in separate manual steps, the conveyor belt brings item after item through the exact same inspection station until the batch is empty.',
      'Step-by-step': '1. Identify the collection to iterate over (e.g., a list of image tokens or loss values).\n2. The loop selects the first item and assigns it to a loop variable.\n3. The indented block executes instructions using that item.\n4. Python advances to the next item and repeats until no elements remain.',
      'Code-first': 'In AI pipelines, loops process batches of tensors or prompt tokens:\n\nbatches = [16, 32, 64]\nfor batch_size in batches:\n    print(f"Training batch size: {batch_size}")\n# Output: Training batch size: 16 -> 32 -> 64',
      'Technical': 'Python for loops implement the Iterator Protocol. The statement calls iter(iterable) to return an iterator object, and repeatedly invokes next(iterator) on the evaluation stack until a StopIteration exception is raised internally, providing memory-efficient O(1) sequential retrieval.',
      'Socratic': 'If you had 10,000 token embeddings to normalize, would you copy and paste 10,000 lines of code, or would you instruct the runtime to apply one single normalization rule across the entire set? How does a loop determine both the boundary and current target?'
    },

    workedExample: {
      title: 'Filtering Model Predictions with List Comprehensions',
      description: 'A concise Python loop extracting high-confidence predictions above a threshold.',
      code: `predictions = [0.94, 0.42, 0.88, 0.35, 0.99]
threshold = 0.80

# List comprehension: for loop + condition
high_conf = [score for score in predictions if score >= threshold]

print("Accepted scores:", high_conf)
# Output: Accepted scores: [0.94, 0.88, 0.99]`,
      takeaway: 'List comprehensions combine iteration and filtering into a single, idiomatic Python expression.'
    },

    simplerExplanation: 'Simpler view: A loop is just visiting every item in a list one-by-one. "for x in [1, 2, 3]:" literally means "take 1, do something, take 2, do something, take 3, do something, then stop".',

    practiceQuestions: {
      easy: {
        id: 'loops_q_easy',
        difficulty: 'easy',
        difficultyLabel: 'Tier 1 • Fundamental',
        prompt: 'What will be printed when running this basic loop?',
        code: `for i in range(3):
    print(i, end=" ")`,
        options: [
          { id: 'A', text: '0 1 2' },
          { id: 'B', text: '1 2 3' },
          { id: 'C', text: '0 1 2 3' },
          { id: 'D', text: '3' },
        ],
        correctAnswer: 'A',
        hint: 'range(n) starts at 0 and stops right before reaching n (zero-indexed).',
        explanation: 'In Python, range(3) produces numbers 0, 1, and 2. It halts before reaching 3.'
      },
      medium: {
        id: 'loops_q_med',
        difficulty: 'medium',
        difficultyLabel: 'Tier 2 • Intermediate',
        prompt: 'What is the output of this conditional list comprehension?',
        code: `scores = [1, 2, 3, 4]
result = [x * 2 for x in scores if x > 2]
print(result)`,
        options: [
          { id: 'A', text: '[2, 4, 6, 8]' },
          { id: 'B', text: '[6, 8]' },
          { id: 'C', text: '[4, 6]' },
          { id: 'D', text: '[3, 4]' },
        ],
        correctAnswer: 'B',
        hint: 'First filter the numbers greater than 2 (leaving 3 and 4), then multiply each by 2.',
        explanation: 'The condition `x > 2` keeps [3, 4]. Each element is multiplied by 2, yielding [6, 8].'
      },
      hard: {
        id: 'loops_q_hard',
        difficulty: 'hard',
        difficultyLabel: 'Tier 3 • Advanced',
        prompt: 'In Python, when does the else block attached to a for loop execute?',
        code: `for item in batch:
    if check_halt(item):
        break
else:
    print("Batch complete")`,
        options: [
          { id: 'A', text: 'Whenever the loop breaks early' },
          { id: 'B', text: 'Only if the loop exhausts all items without encountering a break' },
          { id: 'C', text: 'Whenever an unhandled exception occurs' },
          { id: 'D', text: 'On every single iteration' },
        ],
        correctAnswer: 'B',
        hint: 'Loop else in Python means "run this only if no break statement interrupted the loop".',
        explanation: 'The else clause of a loop runs only if the iteration completes naturally without hitting a break statement.'
      }
    }
  },

  functions: {
    id: 'functions',
    roadmapId: 'functions',
    title: 'Functions',
    category: 'Modularity',
    defaultDifficulty: 'medium',

    explanations: {
      'Analogy': 'Think of a function like a kitchen blender. You load ingredients in (inputs), press a button executing a fixed internal process, and get a smoothie back (return value). You can reuse the blender anytime without rebuilding its internal motor.',
      'Step-by-step': '1. Define the reusable block with the "def" keyword, a name, and parentheses for parameters.\n2. Write the indented body containing the logic.\n3. Use "return" to send the computed outcome back to the caller.\n4. Call the function anywhere by passing values in parentheses.',
      'Code-first': 'Modular AI logic isolated into a clean, callable unit:\n\ndef calculate_token_cost(token_count, price_per_k=0.002):\n    cost = (token_count / 1000) * price_per_k\n    return round(cost, 4)\n\nprint(calculate_token_cost(2500))  # Output: 0.005',
      'Technical': 'Functions allocate local stack frames with private symbol tables adhering to the LEGB (Local, Enclosing, Global, Built-in) scope resolution hierarchy. First-class status allows functions to be assigned to variables, passed as higher-order callbacks, and wrapped by decorators.',
      'Socratic': 'Why do large AI pipelines separate tokenization, prompt formatting, and model inference into isolated functions rather than a single monolithic script? What happens to variables declared inside a function when it finishes running?'
    },

    workedExample: {
      title: 'Prompt Formatter with Default Fallback',
      description: 'Encapsulating prompt assembly logic with configurable roles.',
      code: `def format_prompt(query, role="System"):
    formatted = f"[{role}] Question: {query}\\nAnswer:"
    return formatted

# Calling with default role vs custom role
print(format_prompt("Explain neural nets"))
# Output: [System] Question: Explain neural nets\\nAnswer:`,
      takeaway: 'Functions allow setting sensible defaults that callers can override as needed.'
    },

    simplerExplanation: 'Simpler view: A function is a named recipe. You write it once using "def my_func():", give it inputs, and it hands you back a result with "return".',

    practiceQuestions: {
      easy: {
        id: 'fn_q_easy',
        difficulty: 'easy',
        difficultyLabel: 'Tier 1 • Fundamental',
        prompt: 'Which keyword in Python delivers a computed value back to the code that called the function?',
        code: `def get_model_name():
    name = "gemini-1.5-flash"
    ____ name`,
        options: [
          { id: 'A', text: 'send' },
          { id: 'B', text: 'return' },
          { id: 'C', text: 'yield_value' },
          { id: 'D', text: 'print' },
        ],
        correctAnswer: 'B',
        hint: 'print displays text to the screen; this keyword actually hands back the data.',
        explanation: 'The `return` statement immediately exits the function and passes the specified value back to the caller.'
      },
      medium: {
        id: 'fn_q_med',
        difficulty: 'medium',
        difficultyLabel: 'Tier 2 • Intermediate',
        prompt: 'What will be printed when calling this function with one argument?',
        code: `def compute_loss(y, scale=2):
    return y * scale

print(compute_loss(10))`,
        options: [
          { id: 'A', text: '10' },
          { id: 'B', text: '20' },
          { id: 'C', text: 'TypeError: missing argument' },
          { id: 'D', text: 'None' },
        ],
        correctAnswer: 'B',
        hint: 'scale has a default value of 2, which is used when not explicitly provided.',
        explanation: 'Passing 10 fills parameter y, while scale defaults to 2. Thus 10 * 2 = 20.'
      },
      hard: {
        id: 'fn_q_hard',
        difficulty: 'hard',
        difficultyLabel: 'Tier 3 • Advanced',
        prompt: 'What happens when modifying a mutable default argument across calls?',
        code: `def record_token(t, history=[]):
    history.append(t)
    return history

record_token("A")
print(record_token("B"))`,
        options: [
          { id: 'A', text: "['B']" },
          { id: 'B', text: "['A', 'B']" },
          { id: 'C', text: "['A']" },
          { id: 'D', text: "Raises DefaultArgumentError" },
        ],
        correctAnswer: 'B',
        hint: 'Default argument expressions in Python are evaluated once at definition time, not on every call.',
        explanation: 'The list history=[] is created once when the function is defined. Subsequent calls without passing history share and mutate that same list.'
      }
    }
  },

  parameters_vs_arguments: {
    id: 'parameters_vs_arguments',
    roadmapId: 'functions',
    title: 'Parameters vs Arguments',
    category: 'Functions & Signatures',
    defaultDifficulty: 'medium',

    explanations: {
      'Analogy': 'Think of a job application form. The blank fields labeled "Full Name" and "Years of Experience" are parameters (the placeholders). When you write "Ada Lovelace" and "5" on the paper, your entries are the arguments (the concrete data supplied).',
      'Step-by-step': '1. Parameter: The variable name written inside the parentheses of a function definition header ("def query(prompt, model):").\n2. Argument: The actual value passed into the function when invoking it ("query(\'Hi\', \'gemini\')").\n3. Python maps the passed arguments to the declared parameters when the call executes.',
      'Code-first': 'Distinguish signature placeholders from invocation values:\n\n# \'prompt\' and \'temp\' are PARAMETERS (placeholders)\ndef generate(prompt, temp=0.7):\n    return f"Running {prompt} at {temp}"\n\n# "Explain AI" and 0.2 are ARGUMENTS (concrete values)\nresult = generate("Explain AI", 0.2)',
      'Technical': 'Parameters are formal variables in the function code object (stored in func.__code__.co_varnames). Arguments are runtime evaluation stack values passed via positional or keyword binding mechanisms (*args, **kwargs).',
      'Socratic': 'When reading an architectural blueprint, does it contain real bricks, or designated slots where bricks will be laid? Which one exists at definition time, and which exists at call time?'
    },

    workedExample: {
      title: 'Distinguishing Parameters and Arguments in LLM Config',
      description: 'Inspecting definition signature vs invocation call.',
      code: `def configure_model(model_name, temperature):  # <-- PARAMETERS
    print(f"Model: {model_name}, Temp: {temperature}")

# Calling the function with concrete values
configure_model("gemini-1.5-pro", 0.5)            # <-- ARGUMENTS`,
      takeaway: 'Parameters live in the def declaration. Arguments live in the function call.'
    },

    simplerExplanation: 'Simpler view: Parameter = Placeholder in "def". Argument = Actual value passed when calling the function.',

    practiceQuestions: {
      easy: {
        id: 'pva_q_easy',
        difficulty: 'easy',
        difficultyLabel: 'Tier 1 • Fundamental',
        prompt: 'In the code `def run_agent(task): pass`, what is `task`?',
        code: `def run_agent(task):
    pass`,
        options: [
          { id: 'A', text: 'An Argument' },
          { id: 'B', text: 'A Parameter' },
          { id: 'C', text: 'A Return value' },
          { id: 'D', text: 'A Global variable' },
        ],
        correctAnswer: 'B',
        hint: 'It is written in the function definition header (the placeholder slot).',
        explanation: 'Because `task` is declared in the function signature `def run_agent(...)`, it is a parameter.'
      },
      medium: {
        id: 'pva_q_med',
        difficulty: 'medium',
        difficultyLabel: 'Tier 2 • Intermediate',
        prompt: 'In the call `embed_text("Machine Learning", model="text-embed-3")`, what are `"Machine Learning"` and `"text-embed-3"`?',
        code: `embed_text("Machine Learning", model="text-embed-3")`,
        options: [
          { id: 'A', text: 'Parameters' },
          { id: 'B', text: 'Arguments' },
          { id: 'C', text: 'Class methods' },
          { id: 'D', text: 'Module imports' },
        ],
        correctAnswer: 'B',
        hint: 'These are real data values passed at the time the function is called.',
        explanation: 'Values passed during a function call are arguments (one positional argument, one keyword argument).'
      },
      hard: {
        id: 'pva_q_hard',
        difficulty: 'hard',
        difficultyLabel: 'Tier 3 • Advanced',
        prompt: 'Which of the following function definitions will cause a Python SyntaxError due to parameter ordering rules?',
        code: `Option 1: def call(prompt, temp=0.7): pass
Option 2: def call(temp=0.7, prompt): pass`,
        options: [
          { id: 'A', text: 'Option 1 only' },
          { id: 'B', text: 'Option 2 (non-default parameter follows default parameter)' },
          { id: 'C', text: 'Neither, both are valid in Python' },
          { id: 'D', text: 'Both cause SyntaxError' },
        ],
        correctAnswer: 'B',
        hint: 'In Python, all parameters without default values must be placed before parameters with default values.',
        explanation: 'Python syntax forbids placing a required positional parameter (`prompt`) after a parameter with a default value (`temp=0.7`).'
      }
    }
  },

  apis: {
    id: 'apis',
    roadmapId: 'apis',
    title: 'Working with APIs',
    category: 'Integrations & Web',
    defaultDifficulty: 'medium',

    explanations: {
      'Analogy': 'Think of an API like a waiter at a restaurant. You are the customer at the table (the client), and the kitchen is the AI server. You cannot walk directly into the kitchen; you give your order to the waiter (the API request), the waiter delivers it to the kitchen, and brings back your prepared food (the API response).',
      'Step-by-step': '1. Construct the endpoint URL (e.g., https://api.example.com/v1/generate).\n2. Set request headers with your API key for authorization and specify "application/json".\n3. Package your prompt and options into a JSON dictionary.\n4. Send an HTTP POST request and await the HTTP status code (200 OK).\n5. Parse the returned JSON response to extract the generated text.',
      'Code-first': 'Sending and parsing an AI inference request:\n\nimport json\n\npayload = {"prompt": "What is AI?", "max_tokens": 100}\n# Serializing to JSON payload string\nraw_json = json.dumps(payload)\nprint(raw_json)  # {"prompt": "What is AI?", "max_tokens": 100}',
      'Technical': 'APIs operate over stateless HTTP/HTTPS protocols. Generative endpoints use REST POST verbs where payloads carry JSON-encoded tokens. Real-time token streaming uses HTTP Server-Sent Events (SSE) via persistent TCP sockets with chunked transfer encoding.',
      'Socratic': 'When an AI foundation model runs in a cloud data center thousands of miles away, how does your local Python script hand over your prompt and retrieve generated output without having direct access to the server GPUs?'
    },

    workedExample: {
      title: 'Parsing an AI Generation JSON Response',
      description: 'Traversing the nested dictionary structure returned by inference endpoints.',
      code: `mock_api_response = {
    "status": 200,
    "data": {
        "text": "Artificial Intelligence is transforming computing.",
        "tokens_used": 18
    }
}

# Accessing the generated response safely
result = mock_api_response["data"]["text"]
print("AI output:", result)
# Output: AI output: Artificial Intelligence is transforming computing.`,
      takeaway: 'API responses arrive as structured JSON, which Python parses into nested dictionaries.'
    },

    simplerExplanation: 'Simpler view: An API lets programs talk over the web. You send a letter (POST request with your prompt) and get back a reply (JSON with the AI answer).',

    practiceQuestions: {
      easy: {
        id: 'apis_q_easy',
        difficulty: 'easy',
        difficultyLabel: 'Tier 1 • Fundamental',
        prompt: 'Which data format is universally standard for exchanging structured data with AI model APIs?',
        code: `POST /v1/chat/completions
Content-Type: application/____`,
        options: [
          { id: 'A', text: 'xml' },
          { id: 'B', text: 'json' },
          { id: 'C', text: 'csv' },
          { id: 'D', text: 'plain_binary' },
        ],
        correctAnswer: 'B',
        hint: 'JavaScript Object Notation, which matches Python dictionaries in syntax.',
        explanation: 'JSON (JavaScript Object Notation) is the ubiquitous standard data format for REST API communication.'
      },
      medium: {
        id: 'apis_q_med',
        difficulty: 'medium',
        difficultyLabel: 'Tier 2 • Intermediate',
        prompt: 'If an AI endpoint returns HTTP status 401 Unauthorized, what is the root cause?',
        code: `HTTP/1.1 401 Unauthorized
{"error": "Invalid authentication credentials"}`,
        options: [
          { id: 'A', text: 'Prompt exceeded model context window' },
          { id: 'B', text: 'API Key is missing, expired, or invalid' },
          { id: 'C', text: 'Rate limit quota was exhausted' },
          { id: 'D', text: 'Server encountered an internal crash' },
        ],
        correctAnswer: 'B',
        hint: '401 specifically signals an authentication identity check failure.',
        explanation: 'HTTP 401 Unauthorized indicates that the request lacked valid authentication credentials (e.g., bad or missing API key).'
      },
      hard: {
        id: 'apis_q_hard',
        difficulty: 'hard',
        difficultyLabel: 'Tier 3 • Advanced',
        prompt: 'When streaming token generations token-by-token from an AI endpoint, what HTTP technique is used?',
        code: `response = requests.post(url, json=data, stream=True)
for chunk in response.iter_lines():
    # Process incoming token chunk`,
        options: [
          { id: 'A', text: 'Server-Sent Events (SSE) over an open HTTP stream' },
          { id: 'B', text: 'Sending 5,000 separate POST requests' },
          { id: 'C', text: 'Downloading the full file before displaying' },
          { id: 'D', text: 'DNS lookup polling' },
        ],
        correctAnswer: 'A',
        hint: 'It streams text events line-by-line as data: {...} over a single long-lived HTTP connection.',
        explanation: 'Streaming LLM APIs use Server-Sent Events (SSE) with `stream=True` to stream tokens in real-time as they are synthesized.'
      }
    }
  }
};

/**
 * List of primary demo topics for Phase 3
 */
export const PHASE_3_DEMO_TOPICS = [
  { id: 'loops', title: 'Loops & Iteration', category: 'Control Flow' },
  { id: 'functions', title: 'Functions', category: 'Modularity' },
  { id: 'parameters_vs_arguments', title: 'Parameters vs Arguments', category: 'Functions & Signatures' },
  { id: 'apis', title: 'Working with APIs', category: 'Integrations & Web' }
];
