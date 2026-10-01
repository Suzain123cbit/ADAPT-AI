export const CONCEPTS = [
  { id: 'python_basics', name: 'Python Basics', description: 'Core syntax, types, and variables' },
  { id: 'conditions', name: 'Conditions', description: 'Control flow, boolean logic, and branching' },
  { id: 'loops', name: 'Loops', description: 'Iteration, comprehensions, and sequences' },
  { id: 'functions', name: 'Functions', description: 'Signatures, arguments, scopes, and lambdas' },
  { id: 'data_structures', name: 'Data Structures', description: 'Lists, dictionaries, sets, and lookups' },
  { id: 'apis', name: 'APIs', description: 'HTTP protocols, REST payloads, and status codes' },
  { id: 'ai_api_concepts', name: 'AI API Concepts', description: 'LLM parameters, tokens, embeddings, and context' },
];

export const QUESTION_BANK = {
  python_basics: {
    easy: {
      id: 'pb_e1',
      conceptId: 'python_basics',
      conceptName: 'Python Basics',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'What is the data type of the expression `4 / 2` in Python 3?',
      code: `result = 4 / 2
print(type(result))`,
      options: [
        { id: 'A', text: 'int' },
        { id: 'B', text: 'float' },
        { id: 'C', text: 'double' },
        { id: 'D', text: 'number' },
      ],
      correctAnswer: 'B',
      explanation: 'In Python 3, standard division `/` always returns a `float` (2.0), whereas integer floor division `//` produces an `int`.'
    },
    medium: {
      id: 'pb_m1',
      conceptId: 'python_basics',
      conceptName: 'Python Basics',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What will be the output of this Python code snippet?',
      code: `a = [10, 20]
b = a
b.append(30)
print(len(a))`,
      options: [
        { id: 'A', text: '2 (lists are copied by value)' },
        { id: 'B', text: '3 (lists are mutable and assigned by reference)' },
        { id: 'C', text: 'Raises an AttributeError' },
        { id: 'D', text: 'None' },
      ],
      correctAnswer: 'B',
      explanation: 'In Python, assigning `b = a` creates a reference to the same list in memory. Modifying `b` directly modifies `a`.'
    },
    hard: {
      id: 'pb_h1',
      conceptId: 'python_basics',
      conceptName: 'Python Basics',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'Using extended iterable unpacking, what are the values of `head`, `middle`, and `tail`?',
      code: `values = [1, 2, 3, 4, 5]
head, *middle, tail = values`,
      options: [
        { id: 'A', text: 'head=1, middle=[2, 3, 4], tail=5' },
        { id: 'B', text: 'head=1, middle=(2, 3, 4), tail=5' },
        { id: 'C', text: 'head=[1], middle=[2, 3, 4], tail=[5]' },
        { id: 'D', text: 'SyntaxError: star expression not allowed' },
      ],
      correctAnswer: 'A',
      explanation: 'The `*middle` variable captures all remaining intermediary elements as a standard Python `list`: `[2, 3, 4]`.'
    }
  },

  conditions: {
    easy: {
      id: 'cond_e1',
      conceptId: 'conditions',
      conceptName: 'Conditions',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'Which of the following values evaluates to `False` in a Python `if` condition (falsy)?',
      code: `val = []
if val:
    print("Truthy")
else:
    print("Falsy")`,
      options: [
        { id: 'A', text: '"0" (string containing zero)' },
        { id: 'B', text: '[-1]' },
        { id: 'C', text: '[] (empty list)' },
        { id: 'D', text: '{"status": False}' },
      ],
      correctAnswer: 'C',
      explanation: 'Empty sequences like `[]`, `""`, `()`, and numeric `0` evaluate to `False` in Python boolean contexts.'
    },
    medium: {
      id: 'cond_m1',
      conceptId: 'conditions',
      conceptName: 'Conditions',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What is the evaluated output due to Python short-circuit evaluation?',
      code: `def ping():
    print("Pinged!", end=" ")
    return True

result = False and ping()
print(result)`,
      options: [
        { id: 'A', text: 'Pinged! False' },
        { id: 'B', text: 'False (ping is never executed)' },
        { id: 'C', text: 'Pinged! True' },
        { id: 'D', text: 'None' },
      ],
      correctAnswer: 'B',
      explanation: 'In an `and` expression, if the left operand is falsy, Python immediately short-circuits and never executes the right-hand function `ping()`.'
    },
    hard: {
      id: 'cond_h1',
      conceptId: 'conditions',
      conceptName: 'Conditions',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'What does this conditional comprehension return when checking AI model readiness flags?',
      code: `checks = [True, 1, "Ready", None]
is_deployable = all(bool(x) for x in checks)
print(is_deployable)`,
      options: [
        { id: 'A', text: 'True' },
        { id: 'B', text: 'False' },
        { id: 'C', text: 'TypeError: NoneType is not iterable' },
        { id: 'D', text: '"Ready"' },
      ],
      correctAnswer: 'B',
      explanation: '`all()` requires every element to be truthy. Because `None` is falsy (`bool(None) == False`), `all(...)` returns `False`.'
    }
  },

  loops: {
    easy: {
      id: 'loop_e1',
      conceptId: 'loops',
      conceptName: 'Loops',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'How many iterations will this `for` loop execute?',
      code: `for step in range(1, 6):
    pass`,
      options: [
        { id: 'A', text: '4 times' },
        { id: 'B', text: '5 times (step 1, 2, 3, 4, 5)' },
        { id: 'C', text: '6 times' },
        { id: 'D', text: 'Infinite loop' },
      ],
      correctAnswer: 'B',
      explanation: '`range(start, stop)` starts at 1 and stops before 6, yielding values 1, 2, 3, 4, and 5 (total 5 iterations).'
    },
    medium: {
      id: 'loop_m1',
      conceptId: 'loops',
      conceptName: 'Loops',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What is the output of this Python list comprehension filtering AI confidence scores?',
      code: `scores = [0.92, 0.45, 0.88, 0.31, 0.95]
high_conf = [s for s in scores if s >= 0.85]
print(len(high_conf))`,
      options: [
        { id: 'A', text: '2' },
        { id: 'B', text: '3' },
        { id: 'C', text: '5' },
        { id: 'D', text: 'SyntaxError' },
      ],
      correctAnswer: 'B',
      explanation: 'The three scores satisfying `s >= 0.85` are 0.92, 0.88, and 0.95. Thus the resulting list length is 3.'
    },
    hard: {
      id: 'loop_h1',
      conceptId: 'loops',
      conceptName: 'Loops',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'When will the `else` block of a Python `for` loop NOT execute?',
      code: `for item in batch:
    if check_anomaly(item):
        break
else:
    notify_training_complete()`,
      options: [
        { id: 'A', text: 'When the batch list is completely empty' },
        { id: 'B', text: 'When the loop finishes normally without hitting a break' },
        { id: 'C', text: 'When the loop terminates early via the `break` statement' },
        { id: 'D', text: 'When `continue` is invoked inside the loop' },
      ],
      correctAnswer: 'C',
      explanation: 'The `else` clause of a Python loop runs only if the loop finishes naturally without encountering a `break` statement.'
    }
  },

  functions: {
    easy: {
      id: 'fn_e1',
      conceptId: 'functions',
      conceptName: 'Functions',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'What is the difference between `print()` and `return` inside a Python function?',
      code: `def calculate_loss(y, y_pred):
    loss = (y - y_pred) ** 2
    return loss`,
      options: [
        { id: 'A', text: '`print()` outputs to console; `return` gives back a value to the caller'
        },
        { id: 'B', text: 'They are completely interchangeable in Python' },
        { id: 'C', text: '`return` displays text on the screen' },
        { id: 'D', text: 'A function cannot have both `print()` and `return`' },
      ],
      correctAnswer: 'A',
      explanation: '`return` yields a programmatic result that can be saved to variables or passed to other functions, whereas `print()` only outputs text to the standard console stream.'
    },
    medium: {
      id: 'fn_m1',
      conceptId: 'functions',
      conceptName: 'Functions',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What happens when using a mutable default argument across multiple calls?',
      code: `def add_token(token, prompt_history=[]):
    prompt_history.append(token)
    return prompt_history

print(add_token("Hello"))
print(add_token("World"))`,
      options: [
        { id: 'A', text: "['Hello'] then ['World']" },
        { id: 'B', text: "['Hello'] then ['Hello', 'World']" },
        { id: 'C', text: "Raises a DefaultArgumentError" },
        { id: 'D', text: "['Hello', 'Hello']" },
      ],
      correctAnswer: 'B',
      explanation: 'Default arguments in Python are evaluated once at function definition time. The list `prompt_history` is shared across subsequent calls if not explicitly passed.'
    },
    hard: {
      id: 'fn_h1',
      conceptId: 'functions',
      conceptName: 'Functions',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'What does this decorator do to the AI inference call?',
      code: `def retry_on_failure(fn):
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception:
            return fn(*args, **kwargs) # second attempt
    return wrapper`,
      options: [
        { id: 'A', text: 'It suppresses errors and re-executes the function once if the first attempt fails' },
        { id: 'B', text: 'It creates an infinite loop whenever an exception occurs' },
        { id: 'C', text: 'It converts the function into an asynchronous generator' },
        { id: 'D', text: 'It caches the return value using memoization' },
      ],
      correctAnswer: 'A',
      explanation: 'Decorators wrap the target function. Here `wrapper` catches any exception on the first run and retries the function call once before letting exceptions bubble.'
    }
  },

  data_structures: {
    easy: {
      id: 'ds_e1',
      conceptId: 'data_structures',
      conceptName: 'Data Structures',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'How do you safely access a key in a dictionary without throwing a `KeyError` if it is missing?',
      code: `model_config = {"model": "gpt-4o", "temperature": 0.7}`,
      options: [
        { id: 'A', text: 'model_config["max_tokens"]' },
        { id: 'B', text: 'model_config.get("max_tokens", 1000)' },
        { id: 'C', text: 'model_config.fetch("max_tokens")' },
        { id: 'D', text: 'model_config.find("max_tokens")' },
      ],
      correctAnswer: 'B',
      explanation: '`dict.get(key, default)` returns the default value (or `None`) without throwing a `KeyError` if the key does not exist.'
    },
    medium: {
      id: 'ds_m1',
      conceptId: 'data_structures',
      conceptName: 'Data Structures',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What is the average time complexity of looking up a token ID in a Python `dict` or `set`?',
      code: `vocab = {"transformer": 1024, "attention": 2048, "vector": 4096}
is_present = "attention" in vocab`,
      options: [
        { id: 'A', text: 'O(1) - Constant time due to hash tables' },
        { id: 'B', text: 'O(n) - Linear time scanning each element' },
        { id: 'C', text: 'O(log n) - Binary search time' },
        { id: 'D', text: 'O(n^2) - Quadratic time' },
      ],
      correctAnswer: 'A',
      explanation: 'Python dictionaries and sets are implemented as hash tables, giving average O(1) constant time complexity for key lookups.'
    },
    hard: {
      id: 'ds_h1',
      conceptId: 'data_structures',
      conceptName: 'Data Structures',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'What is the result of using `collections.defaultdict(list)` in token group aggregation?',
      code: `from collections import defaultdict
grouped = defaultdict(list)
data = [("prompt", "What is AI?"), ("prompt", "How does backprop work?")]
for k, v in data:
    grouped[k].append(v)
print(len(grouped["prompt"]), len(grouped["unknown"]))`,
      options: [
        { id: 'A', text: '2 and 0 (accessing "unknown" creates an empty list)' },
        { id: 'B', text: '2 and raises KeyError' },
        { id: 'C', text: '1 and 0' },
        { id: 'D', text: '2 and None' },
      ],
      correctAnswer: 'A',
      explanation: '`defaultdict(list)` automatically creates a new empty `list` when an unseen key like `"unknown"` is accessed, so `len([])` is 0.'
    }
  },

  apis: {
    easy: {
      id: 'api_e1',
      conceptId: 'apis',
      conceptName: 'APIs',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'Which HTTP method is typically used to submit prompt data to an AI model inference endpoint?',
      code: `POST /v1/chat/completions HTTP/1.1
Host: api.example.com
Content-Type: application/json`,
      options: [
        { id: 'A', text: 'GET' },
        { id: 'B', text: 'POST' },
        { id: 'C', text: 'DELETE' },
        { id: 'D', text: 'OPTIONS' },
      ],
      correctAnswer: 'B',
      explanation: '`POST` is used to send JSON request bodies (prompts, hyperparameters, images) to inference and generation endpoints.'
    },
    medium: {
      id: 'api_m1',
      conceptId: 'apis',
      conceptName: 'APIs',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What HTTP status code specifically indicates that your API key exceeded its rate limit quota?',
      code: `HTTP/1.1 429 Too Many Requests
Retry-After: 30`,
      options: [
        { id: 'A', text: '401 Unauthorized' },
        { id: 'B', text: '404 Not Found' },
        { id: 'C', text: '429 Too Many Requests' },
        { id: 'D', text: '500 Internal Server Error' },
      ],
      correctAnswer: 'C',
      explanation: '`429 Too Many Requests` indicates that the client has sent too many requests in a given amount of time (rate limit or token quota exceeded).'
    },
    hard: {
      id: 'api_h1',
      conceptId: 'apis',
      conceptName: 'APIs',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'How do production LLM clients stream tokens incrementally using Python requests?',
      code: `import requests
response = requests.post(url, json=payload, stream=True)
for chunk in response.iter_lines():
    # Process SSE (Server-Sent Events) tokens`,
      options: [
        { id: 'A', text: 'By enabling `stream=True` and consuming Server-Sent Events (SSE) line-by-line' },
        { id: 'B', text: 'By creating 100 parallel TCP sockets for each character' },
        { id: 'C', text: 'By polling the server every 10 milliseconds via GET' },
        { id: 'D', text: 'By downloading the entire response into RAM before printing' },
      ],
      correctAnswer: 'A',
      explanation: 'Setting `stream=True` keeps the HTTP connection open, allowing real-time streaming of tokens chunk-by-chunk using Server-Sent Events (`data: {...}`).'
    }
  },

  ai_api_concepts: {
    easy: {
      id: 'ai_e1',
      conceptId: 'ai_api_concepts',
      conceptName: 'AI API Concepts',
      difficulty: 'easy',
      difficultyLabel: 'Tier 1 • Fundamental',
      question: 'What is the effect of setting `temperature=0` when calling an LLM API?',
      code: `response = client.chat(
    model="gemini-2.5",
    messages=[{"role": "user", "content": "Explain gravity"}],
    temperature=0.0
)`,
      options: [
        { id: 'A', text: 'The model gives maximum creative and random outputs' },
        { id: 'B', text: 'The model outputs become deterministic and focused on top probability tokens' },
        { id: 'C', text: 'The model rejects the request as an invalid temperature' },
        { id: 'D', text: 'The API responds with zero latency' },
      ],
      correctAnswer: 'B',
      explanation: 'A temperature of 0.0 minimizes randomness (greedy decoding), making the AI responses consistent, focused, and deterministic.'
    },
    medium: {
      id: 'ai_m1',
      conceptId: 'ai_api_concepts',
      conceptName: 'AI API Concepts',
      difficulty: 'medium',
      difficultyLabel: 'Tier 2 • Intermediate',
      question: 'What is an "Embedding" in the context of modern AI APIs (`/v1/embeddings`)?',
      code: `vector = client.embeddings.create(
    input="Machine Learning",
    model="text-embedding-3"
).data[0].embedding`,
      options: [
        { id: 'A', text: 'A dense numerical vector representing semantic meaning for search & RAG' },
        { id: 'B', text: 'An encrypted hash of the user password' },
        { id: 'C', text: 'A compressed audio file representation' },
        { id: 'D', text: 'A pre-compiled Python binary bytecode' },
      ],
      correctAnswer: 'A',
      explanation: 'Text embeddings convert concepts into high-dimensional numerical vectors, allowing semantic similarity calculations, vector search, and Retrieval-Augmented Generation (RAG).'
    },
    hard: {
      id: 'ai_h1',
      conceptId: 'ai_api_concepts',
      conceptName: 'AI API Concepts',
      difficulty: 'hard',
      difficultyLabel: 'Tier 3 • Advanced',
      question: 'What happens when an LLM prompt plus generation exceeds the model\'s `context window` limit?',
      code: `prompt_tokens = 125000
model_max_context = 128000
requested_max_tokens = 4096`,
      options: [
        { id: 'A', text: 'The API automatically increases its context window for free' },
        { id: 'B', text: 'The API returns a context length exceeded error (or truncates according to policy)' },
        { id: 'C', text: 'The model generates negative tokens to balance the budget' },
        { id: 'D', text: 'The request is routed to an offline tape backup system' },
      ],
      correctAnswer: 'B',
      explanation: 'Total tokens (prompt tokens + max generation tokens) cannot exceed the model\'s maximum context window limit (125k + 4096 = 129096 > 128000), causing a context length error.'
    }
  }
};

/**
 * Ordered sequence of concepts tested in the 7-question diagnostic test
 */
export const DIAGNOSTIC_SEQUENCE = [
  'python_basics',
  'conditions',
  'loops',
  'functions',
  'data_structures',
  'apis',
  'ai_api_concepts'
];
