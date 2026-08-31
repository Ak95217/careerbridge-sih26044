import { SkillAssessment } from '../types';

export const ASSESSMENT_BANK: SkillAssessment[] = [
  {
    id: 'assess-react',
    skillId: 'sk-1',
    skillName: 'React.js',
    category: 'Frameworks',
    title: 'React 19 & Component Architecture Assessment',
    description: 'Test your understanding of React hooks, component lifecycle, state management, render optimization, and concurrent features.',
    durationMinutes: 10,
    totalQuestions: 5,
    passingScorePercentage: 60,
    questions: [
      {
        id: 'q-react-1',
        questionText: 'What happens when you pass a state setter function to `useEffect` dependency array in React?',
        options: [
          'It causes an infinite re-render loop on every render.',
          'The state setter has a stable identity across renders and does not trigger extra effect executions.',
          'It throws a runtime error in StrictMode.',
          'It forces the component to remount its DOM tree.'
        ],
        correctOptionIndex: 1,
        explanation: 'In React, setState functions returned by useState are guaranteed to have stable references across re-renders, so including them does not trigger unnecessary effect runs.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-react-2',
        questionText: 'Which React hook is specifically designed to memoize the result of an expensive calculation between re-renders?',
        options: [
          'useCallback',
          'useRef',
          'useMemo',
          'useReducer'
        ],
        correctOptionIndex: 2,
        explanation: '`useMemo` caches the calculated return value of a function between re-renders until one of its dependencies changes.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-react-3',
        questionText: 'When updating state based on the previous state value in React, what is the best practice?',
        options: [
          'Directly mutate the state object and call forceUpdate()',
          'Pass an updater function `setState(prev => prev + 1)`',
          'Read the state from DOM attributes before setting',
          'Assign the new value directly to `this.state`'
        ],
        correctOptionIndex: 1,
        explanation: 'Using the functional updater form `setState(prev => ...)` ensures you are working with the most up-to-date state even when batching or asynchronous updates occur.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-react-4',
        questionText: 'Why should you avoid using array index as `key` prop when rendering a dynamic list that can be reordered or filtered?',
        options: [
          'Keys must be numbers, not strings',
          'Using indices can cause subtle component state bugs, incorrect input focus, and inefficient DOM reconciliations',
          'React does not allow numbers as keys',
          'Indices cause network requests on each list item'
        ],
        correctOptionIndex: 1,
        explanation: 'When item order changes, an index key causes React to mutate existing component instances rather than moving them, leading to state leaks in inputs and extra re-renders.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-react-5',
        questionText: 'In React 19 / Server Components architecture, what is the primary role of `"use client"` directive?',
        options: [
          'It compiles the file into WebAssembly',
          'It marks a module boundary indicating that the component and its imports run on the browser runtime',
          'It disables JavaScript for that component',
          'It creates an HTTP client for fetching REST APIs'
        ],
        correctOptionIndex: 1,
        explanation: 'The `"use client"` directive defines the boundary between Server Components and Client Components in modern React, enabling browser interactivity and React state hooks.',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'assess-ts',
    skillId: 'sk-2',
    skillName: 'TypeScript',
    category: 'Programming Languages',
    title: 'TypeScript Type Systems & Generics Assessment',
    description: 'Verify your proficiency in TypeScript utility types, type narrowing, interfaces, discriminated unions, and generics.',
    durationMinutes: 10,
    totalQuestions: 5,
    passingScorePercentage: 60,
    questions: [
      {
        id: 'q-ts-1',
        questionText: 'What is the primary difference between `unknown` and `any` types in TypeScript?',
        options: [
          '`unknown` is only available in JavaScript, not TypeScript',
          '`unknown` is type-safe: you must perform type narrowing/checking before accessing properties on it, whereas `any` disables all type checks',
          '`any` can only hold primitive values',
          '`unknown` automatically converts all values to strings'
        ],
        correctOptionIndex: 1,
        explanation: '`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` isn’t assignable to anything else without type narrowing.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-ts-2',
        questionText: 'Which TypeScript utility type constructs a type with all properties of Type set to optional?',
        options: [
          'Required<Type>',
          'Readonly<Type>',
          'Partial<Type>',
          'Record<Type>'
        ],
        correctOptionIndex: 2,
        explanation: '`Partial<T>` returns a type with all properties of `T` marked as optional (`?`).',
        difficulty: 'Beginner'
      },
      {
        id: 'q-ts-3',
        questionText: 'What is a "Discriminated Union" in TypeScript?',
        options: [
          'A union of object types that share a common literal property with unique values used for type narrowing',
          'A union type that only accepts boolean values',
          'An error caused by incompatible enum declarations',
          'A method to merge two database tables'
        ],
        correctOptionIndex: 0,
        explanation: 'A Discriminated Union uses a shared literal property (discriminant tag like `kind: "circle" | "square"`) that allows TypeScript to narrow down the specific variant in switch statements.',
        difficulty: 'Advanced'
      },
      {
        id: 'q-ts-4',
        questionText: 'Which keyword is used to create a type from the return type of a function?',
        options: [
          'typeof',
          'keyof',
          'ReturnType<typeof fn>',
          'infer<fn>'
        ],
        correctOptionIndex: 2,
        explanation: '`ReturnType<typeof fn>` extracts the return type of the function value `fn`.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-ts-5',
        questionText: 'What does the `never` type represent in TypeScript?',
        options: [
          'A value that can be null or undefined',
          'A value that never occurs (e.g., return type of a function that always throws or has an infinite loop)',
          'A deprecated variable',
          'An optional function parameter'
        ],
        correctOptionIndex: 1,
        explanation: 'The `never` type indicates values that will never happen, and is used for exhaustive type checking in switch/if constructs.',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'assess-sql',
    skillId: 'sk-5',
    skillName: 'SQL & PostgreSQL',
    category: 'Tools',
    title: 'SQL, Relational Modeling & Query Optimization',
    description: 'Assess relational database querying, joins, indexing, normalization, transactions, and performance optimization.',
    durationMinutes: 10,
    totalQuestions: 5,
    passingScorePercentage: 60,
    questions: [
      {
        id: 'q-sql-1',
        questionText: 'Which SQL JOIN returns all rows from the left table, and matching rows from the right table (filling with NULL if no match exists)?',
        options: [
          'INNER JOIN',
          'LEFT JOIN (LEFT OUTER JOIN)',
          'RIGHT JOIN',
          'CROSS JOIN'
        ],
        correctOptionIndex: 1,
        explanation: 'LEFT JOIN returns all records from the left table and matched records from the right table, with NULLs for unmatched rows on the right.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-sql-2',
        questionText: 'What is the primary purpose of a B-Tree database index in PostgreSQL?',
        options: [
          'To encrypt database columns at rest',
          'To speed up data retrieval queries with O(log n) lookups on equality and range conditions',
          'To automatically back up data to the cloud',
          'To enforce primary key names in snake_case'
        ],
        correctOptionIndex: 1,
        explanation: 'B-Tree indexes provide logarithmic time lookups for equality (`=`) and range operators (`<`, `<=`, `>`, `>=`, `BETWEEN`).',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-sql-3',
        questionText: 'In ACID transaction properties, what does "Isolation" ensure?',
        options: [
          'That database files are isolated from the operating system',
          'That concurrent transactions execute without interfering with one another, preventing dirty reads or phantom reads based on isolation level',
          'That all data is stored on a single CPU core',
          'That the server cannot connect to the internet'
        ],
        correctOptionIndex: 1,
        explanation: 'Isolation ensures that concurrent transactions do not observe intermediate inconsistent states produced by other transactions.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-sql-4',
        questionText: 'Which clause is used in SQL to filter the results of an aggregate function (e.g. `COUNT() > 5`)?',
        options: [
          'WHERE',
          'ORDER BY',
          'HAVING',
          'GROUP BY'
        ],
        correctOptionIndex: 2,
        explanation: '`WHERE` filters individual rows before aggregation, while `HAVING` filters aggregated group records.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-sql-5',
        questionText: 'In PostgreSQL, what is the benefit of using `EXPLAIN ANALYZE` before a query?',
        options: [
          'It converts SQL to Python code',
          'It executes the query and prints the actual execution time, plan nodes, row counts, and buffer hits',
          'It automatically indexes all columns in the table',
          'It cancels long-running transactions'
        ],
        correctOptionIndex: 1,
        explanation: '`EXPLAIN ANALYZE` runs the query and displays the actual execution plan with exact timings and cost estimations.',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'assess-dsa',
    skillId: 'sk-10',
    skillName: 'Problem Solving & DSA',
    category: 'Technical',
    title: 'Data Structures & Algorithmic Complexity',
    description: 'Evaluate your algorithmic foundation in time/space complexity, sorting, graph traversals, and dynamic programming.',
    durationMinutes: 10,
    totalQuestions: 5,
    passingScorePercentage: 60,
    questions: [
      {
        id: 'q-dsa-1',
        questionText: 'What is the average and worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black)?',
        options: [
          'Average: O(1), Worst: O(n)',
          'Average: O(log n), Worst: O(log n)',
          'Average: O(n), Worst: O(n log n)',
          'Average: O(n^2), Worst: O(n^2)'
        ],
        correctOptionIndex: 1,
        explanation: 'Because the tree is strictly balanced, both the average and worst-case search times are bounded by O(log n) tree height.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-dsa-2',
        questionText: 'Which data structure follows the First-In, First-Out (FIFO) principle and is commonly used for Breadth-First Search (BFS)?',
        options: [
          'Stack',
          'Queue',
          'Min-Heap',
          'Disjoint Set'
        ],
        correctOptionIndex: 1,
        explanation: 'A Queue processes elements in FIFO order, making it the canonical data structure for level-order and BFS traversals.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-dsa-3',
        questionText: 'What is the space complexity of finding the shortest path using Dijkstra algorithm with an adjacency list and binary min-heap for V vertices and E edges?',
        options: [
          'O(1)',
          'O(V + E)',
          'O(V * E)',
          'O(2^V)'
        ],
        correctOptionIndex: 1,
        explanation: 'Storing the graph in an adjacency list takes O(V + E), and the distance array and priority queue take O(V) space.',
        difficulty: 'Intermediate'
      },
      {
        id: 'q-dsa-4',
        questionText: 'What algorithmic technique breaks a problem down into overlapping subproblems and stores solutions to avoid recomputation?',
        options: [
          'Greedy Approach',
          'Divide and Conquer (without memoization)',
          'Dynamic Programming (Memoization / Tabulation)',
          'Backtracking'
        ],
        correctOptionIndex: 2,
        explanation: 'Dynamic Programming solves subproblems once and stores their results in a lookup table to solve overlapping subproblems efficiently.',
        difficulty: 'Beginner'
      },
      {
        id: 'q-dsa-5',
        questionText: 'What is the time complexity of QuickSort in the absolute worst case (when poor pivots like smallest/largest elements are chosen)?',
        options: [
          'O(log n)',
          'O(n log n)',
          'O(n^2)',
          'O(n!)'
        ],
        correctOptionIndex: 2,
        explanation: 'When the partition produces 0 elements on one side and n-1 on the other every time, QuickSort degrades to O(n^2).',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export function getProficiencyFromScore(scorePercentage: number) {
  if (scorePercentage >= 90) return 'Expert';
  if (scorePercentage >= 75) return 'Advanced';
  if (scorePercentage >= 50) return 'Intermediate';
  return 'Beginner';
}
