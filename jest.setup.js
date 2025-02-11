import "@testing-library/jest-dom";

// Add TextEncoder polyfill
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch if needed
global.fetch = jest.fn();
