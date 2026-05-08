// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require("util");

Object.assign(global, { TextEncoder, TextDecoder });

const installMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    })),
  });
};

installMatchMedia();

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  const React = jest.requireActual("react");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      React.createElement("div", null, children)
    ),
  };
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  installMatchMedia();
});
