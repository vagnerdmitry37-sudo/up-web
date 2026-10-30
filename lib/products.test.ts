import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductImage } from "@/lib/api/models";
import { getProductCoverUrls } from "@/lib/products";

const image = (entityId: string, sortOrder: number, url: string): ProductImage => ({
  id: `${entityId}-${sortOrder}`,
  entityType: "Product",
  entityId,
  sortOrder,
  url,
});

const respondWith = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("getProductCoverUrls", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("API_URL", "https://api.example.test");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const requestedUrl = (call: number) => new URL(String(fetchMock.mock.calls[call][0]));

  it("uses the first image of each product as its cover", async () => {
    fetchMock.mockResolvedValue(
      respondWith([
        image("p1", 0, "https://img.test/p1-cover.webp"),
        image("p1", 1, "https://img.test/p1-second.webp"),
        image("p2", 0, "https://img.test/p2-cover.webp"),
      ]),
    );

    const covers = await getProductCoverUrls(["p1", "p2", "p3"]);

    expect(covers.get("p1")).toBe("https://img.test/p1-cover.webp");
    expect(covers.get("p2")).toBe("https://img.test/p2-cover.webp");
    expect(covers.has("p3")).toBe(false);
  });

  it("asks the API for the images of the given products only", async () => {
    fetchMock.mockResolvedValue(respondWith([]));

    await getProductCoverUrls(["p1", "p2"]);

    const url = requestedUrl(0);
    expect(url.origin + url.pathname).toBe("https://api.example.test/api/images");
    expect(url.searchParams.get("entityType")).toBe("Product");
    expect(url.searchParams.getAll("entityIds")).toEqual(["p1", "p2"]);
  });

  it("splits more than 100 products into several requests", async () => {
    fetchMock.mockImplementation(async () => respondWith([]));
    const ids = Array.from({ length: 150 }, (_, index) => `p${index}`);

    await getProductCoverUrls(ids);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requestedUrl(0).searchParams.getAll("entityIds")).toHaveLength(100);
    expect(requestedUrl(1).searchParams.getAll("entityIds")).toEqual(ids.slice(100));
  });

  it("makes no request when there are no products", async () => {
    const covers = await getProductCoverUrls([]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(covers.size).toBe(0);
  });

  it("fails when the API cannot return the images", async () => {
    fetchMock.mockResolvedValue(respondWith({}, 500));

    await expect(getProductCoverUrls(["p1"])).rejects.toThrow(
      "Failed to fetch product images: 500",
    );
  });
});
