import { apiClient } from "../client";

describe("apiClient", () => {
  const originalAdapter = apiClient.defaults.adapter;

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  it("attaches bearer token from localStorage when token exists", async () => {
    localStorage.setItem("token", JSON.stringify({ token: "secret-token" }));
    const adapter = jest.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    apiClient.defaults.adapter = adapter;

    await apiClient.get("/protected");

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe(
      "Bearer secret-token"
    );
  });

  it("does not attach Authorization header when no token exists", async () => {
    const adapter = jest.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    apiClient.defaults.adapter = adapter;

    await apiClient.get("/public");

    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined();
  });

  it("clears the token on 401 responses", async () => {
    localStorage.setItem("token", JSON.stringify({ token: "expired-token" }));
    apiClient.defaults.adapter = jest.fn(async (config) =>
      Promise.reject({
        response: { status: 401 },
        config,
      })
    );

    await expect(apiClient.get("/protected")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(localStorage.getItem("token")).toBeNull();
  });
});
