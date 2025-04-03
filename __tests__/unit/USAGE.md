# Unit Testing Guide

## Test Syntax Explained

```typescript
test("description of what we are testing", () => {
  expect(actualValue).toBe(expectedValue);
});

// Or using describe for grouping related tests
describe("ComponentName or FunctionName", () => {
  test("specific behavior we are testing", () => {
    expect(actualValue).toBe(expectedValue);
  });
});
```

1. **Test Description** (first argument):

   - Human-readable description of what's being tested
   - Shows up in test results and debugging
   - Should be specific and clear
   - Examples:
     ```typescript
     test("adds two positive numbers correctly");
     test("returns false for empty string");
     test("formats date to DD/MM/YYYY");
     ```

2. **Test Function** (second argument):

   - Callback function containing test logic
   - Where you put your assertions
   - Can be async if testing async code

3. **Expect and Matchers**:
   ```typescript
   expect(value) // Jest function that returns expectation object
     .toBe(exactValue) // Exact equality (===)
     .toEqual(value) // Deep equality for objects
     .toBeTruthy() // Checks if value is truthy
     .toBeFalsy() // Checks if value is falsy
     .toContain(item) // Check array/string contains item
     .toThrow(); // Check if function throws error
   ```

## What to Unit Test

### DO Test:

1. Pure Functions

   ```typescript
   // Pure function - always same output for same input
   function add(a: number, b: number): number {
     return a + b;
   }
   ```

2. Data Transformations

   ```typescript
   // Data formatting, parsing, conversion
   function formatDate(date: Date): string {
     return date.toLocaleDateString();
   }
   ```

3. Business Logic

   ```typescript
   // Important business rules
   function calculateDiscount(price: number, membership: string): number {
     if (membership === "premium") return price * 0.8;
     return price * 0.95;
   }
   ```

4. Validation Functions
   ```typescript
   // Input validation
   function isValidEmail(email: string): boolean {
     return /^[^@]+@[^@]+\.[^@]+$/.test(email);
   }
   ```

### DON'T Test:

1. External Services (API calls)
2. Database Operations
3. File System Operations
4. Complex UI Rendering
5. Third-party Library Functions

## Testing Strategy

1. **Identify Test Candidates**:

   - Follow the code execution flow
   - Start with utility functions
   - Focus on frequently used code
   - Prioritize business-critical functions

2. **Test Organization**:

   ```typescript
   describe("UserValidation", () => {
     describe("email validation", () => {
       test("valid email passes", () => {});
       test("invalid email fails", () => {});
     });

     describe("password validation", () => {
       test("strong password passes", () => {});
       test("weak password fails", () => {});
     });
   });
   ```

3. **Test Cases to Include**:
   - Happy path (expected normal usage)
   - Edge cases (boundary values)
   - Error cases (invalid inputs)
   - Special cases (null, undefined, empty)

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test

# Run tests in watch mode (re-runs on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage
```

## Best Practices

1. **Test Names Should Be Clear**:

   ```typescript
   // Good
   test("returns false when input is empty string");

   // Bad
   test("empty string test");
   ```

2. **One Assertion Per Test**:

   ```typescript
   // Good
   test("adds positive numbers", () => {
     expect(add(2, 3)).toBe(5);
   });

   test("adds negative numbers", () => {
     expect(add(-2, -3)).toBe(-5);
   });

   // Bad
   test("adds numbers", () => {
     expect(add(2, 3)).toBe(5);
     expect(add(-2, -3)).toBe(-5);
   });
   ```

3. **Use Setup and Teardown**:

   ```typescript
   describe("UserService", () => {
     beforeEach(() => {
       // Setup before each test
     });

     afterEach(() => {
       // Cleanup after each test
     });

     test("creates user", () => {});
   });
   ```

4. **Keep Tests Simple**:
   - Tests should be easier to read than the code they're testing
   - Avoid complex logic in tests
   - If a test is complex, the code might need refactoring

## Common Patterns

1. **Testing Async Functions**:

   ```typescript
   test("async function", async () => {
     const result = await asyncFunction();
     expect(result).toBe(expected);
   });
   ```

2. **Testing Errors**:

   ```typescript
   test("throws error for invalid input", () => {
     expect(() => {
       validateInput("");
     }).toThrow("Input cannot be empty");
   });
   ```

3. **Testing with Mock Data**:

   ```typescript
   const mockUser = {
     id: 1,
     name: "Test User",
     email: "test@example.com",
   };

   test("formats user data", () => {
     expect(formatUser(mockUser)).toEqual({
       displayName: "Test User",
       contact: "test@example.com",
     });
   });
   ```
