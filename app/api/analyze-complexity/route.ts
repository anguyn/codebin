import { NextResponse } from 'next/server';

// Simple pattern matching for common complexity patterns
function analyzeComplexity(code: string): string {
  code = code.toLowerCase();

  // Remove comments and strings to avoid false positives
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  code = code.replace(/\/\/.*/g, '');
  code = code.replace(/"[^"]*"/g, '');
  code = code.replace(/'[^']*'/g, '');

  // Count nested loops
  const forLoops = (code.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (code.match(/\bwhile\s*\(/g) || []).length;
  const forEachLoops = (code.match(/\.foreach\s*\(/g) || []).length;
  const mapCalls = (code.match(/\.map\s*\(/g) || []).length;

  const totalLoops = forLoops + whileLoops + forEachLoops + mapCalls;

  // Check for nested loops by analyzing brackets
  let maxNesting = 0;
  let currentNesting = 0;
  const loopKeywords = ['for', 'while', 'foreach', 'map'];

  const tokens = code.split(/[\s\n;{}()]/);
  for (let i = 0; i < tokens.length; i++) {
    if (loopKeywords.some(keyword => tokens[i].includes(keyword))) {
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);
    }
  }

  // Check for specific patterns
  const hasRecursion = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)[\s\S]*?\1\s*\(/.test(code);
const hasSorting = /\.sort\s*\(/.test(code);
const hasBinarySearch = /binary.*search/i.test(code);
const hasHashMap = /(map|dict|set|hash)/i.test(code);
const hasLinearSearch = /\.find\s*\(|\.indexof\s*\(/.test(code);

  // Determine complexity
  if (hasRecursion) {
    if (code.includes('divide') || code.includes('split')) {
      return 'O(n log n)'; // Divide and conquer like merge sort
    }
    return 'O(2^n)'; // General recursion
  }

  if (maxNesting >= 3 || totalLoops >= 3) {
    return 'O(n³)';
  }

  if (maxNesting >= 2 || totalLoops >= 2) {
    return 'O(n²)';
  }

  if (hasSorting) {
    return 'O(n log n)';
  }

  if (hasBinarySearch) {
    return 'O(log n)';
  }

  if (totalLoops >= 1 || hasLinearSearch) {
    return 'O(n)';
  }

  if (hasHashMap) {
    return 'O(1)'; // Hash map operations
  }

  return 'O(1)'; // Constant time
}

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const complexity = analyzeComplexity(code);

    // Provide explanation
    const explanations: { [key: string]: string } = {
      'O(1)':
        'Constant time - operations execute in the same amount of time regardless of input size',
      'O(log n)':
        'Logarithmic time - typically involves dividing the problem in half each time (like binary search)',
      'O(n)':
        'Linear time - execution time grows linearly with input size (single loop)',
      'O(n log n)':
        'Linearithmic time - common in efficient sorting algorithms (merge sort, quick sort)',
      'O(n²)': 'Quadratic time - typically involves nested loops',
      'O(n³)': 'Cubic time - typically involves triple nested loops',
      'O(2^n)':
        'Exponential time - execution time doubles with each addition to input (recursive algorithms)',
    };

    return NextResponse.json({
      complexity,
      explanation: explanations[complexity] || 'Unable to determine complexity',
      confidence: complexity === 'O(1)' ? 'low' : 'medium',
      note: 'This is a basic estimation. For accurate analysis, consider the specific algorithm and data structures used.',
    });
  } catch (error) {
    console.error('Analyze complexity error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze complexity' },
      { status: 500 },
    );
  }
}
