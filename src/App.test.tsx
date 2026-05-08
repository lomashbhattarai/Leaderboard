import App from "./App";

test("exports the app shell", () => {
  expect(App).toEqual(expect.any(Function));
});
