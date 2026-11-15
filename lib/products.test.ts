import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Product, ProductImage } from "@/lib/api/models";
import { apiUrl } from "@/lib/api/api-url";
import {
  getProduct,
  getProductCoverUrls,
  getProductImages,
  getProducts,
} from "@/lib/products";

const image = (entityId: string, sortOrder: number, url: string): ProductImage => ({
  id: `${entityId}-${sortOrder}`,
  entityType: "Product",
  entityId,
  sortOrder,
  url,
});

const product = (id: string): Product => ({
  id,
  type: "GroupExcursion",
  typeLabel: "Group excursion",
  name: `Product ${id}`,
  seoDescription: "",
  shortDescription: "",
  description: "",
  price: 25,
  attributes: {},
});

const products = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => product(`p${offset + index}`));

const respondWith = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const fetchMock = vi.fn<typeof fetch>();

const requestedUrl = (call: number) => new URL(String(fetchMock.mock.calls[call][0]));

beforeEach(() => {
  vi.stubEnv("API_URL", "https://api.example.test");
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("apiUrl", () => {
  it("builds the URL on the configured API address", () => {
    expect(apiUrl("/api/products?first=0").href).toBe(
      "https://api.example.test/api/products?first=0",
    );
  });

  it("fails with a clear message when API_URL is not set", () => {
    vi.stubEnv("API_URL", "");

    expect(() => apiUrl("/api/products")).toThrow("API_URL is not set");
  });
});

describe("getProducts", () => {
  it("loads every page until all products are fetched", async () => {
    fetchMock
      .mockResolvedValueOnce(respondWith({ items: products(200), totalRecords: 250 }))
      .mockResolvedValueOnce(respondWith({ items: products(50, 200), totalRecords: 250 }));

    const result = await getProducts();

    expect(result).toHaveLength(250);
    expect(result[249].id).toBe("p249");
    expect(requestedUrl(0).searchParams.get("first")).toBe("0");
    expect(requestedUrl(0).searchParams.get("rows")).toBe("200");
    expect(requestedUrl(1).searchParams.get("first")).toBe("200");
  });

  it("makes a single request when everything fits on one page", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({ items: products(3), totalRecords: 3 }));

    expect(await getProducts()).toHaveLength(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops when the API returns an empty page before the reported total", async () => {
    fetchMock
      .mockResolvedValueOnce(respondWith({ items: products(2), totalRecords: 10 }))
      .mockResolvedValueOnce(respondWith({ items: [], totalRecords: 10 }));

    expect(await getProducts()).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns no products for an empty catalog", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({ items: [], totalRecords: 0 }));

    expect(await getProducts()).toEqual([]);
  });

  it("fails when the API cannot return products", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({}, 503));

    await expect(getProducts()).rejects.toThrow("Failed to fetch products: 503");
  });
});

describe("getProduct", () => {
  it("returns the requested product", async () => {
    fetchMock.mockResolvedValueOnce(respondWith([product("p1")]));

    const result = await getProduct("p1");

    expect(result?.id).toBe("p1");
    expect(requestedUrl(0).pathname).toBe("/api/products/by-ids");
    expect(requestedUrl(0).searchParams.get("ids")).toBe("p1");
  });

  it("encodes the id so it cannot change the query", async () => {
    fetchMock.mockResolvedValueOnce(respondWith([]));

    await getProduct("p1&ids=p2");

    expect(requestedUrl(0).searchParams.getAll("ids")).toEqual(["p1&ids=p2"]);
  });

  it("returns nothing for an unknown product", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({}, 404));

    expect(await getProduct("missing")).toBeUndefined();
  });

  it("returns nothing for a malformed id", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({}, 400));

    expect(await getProduct("not-a-uuid")).toBeUndefined();
  });

  it("returns nothing when the API finds no match", async () => {
    fetchMock.mockResolvedValueOnce(respondWith([]));

    expect(await getProduct("p1")).toBeUndefined();
  });

  it("fails on a server error instead of showing not found", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({}, 500));

    await expect(getProduct("p1")).rejects.toThrow("Failed to fetch product p1: 500");
  });
});

describe("getProductImages", () => {
  it("asks for the images of one product", async () => {
    const images = [image("p1", 0, "https://img.test/a.webp")];
    fetchMock.mockResolvedValueOnce(respondWith(images));

    expect(await getProductImages("p1")).toEqual(images);
    expect(requestedUrl(0).pathname).toBe("/api/images");
    expect(requestedUrl(0).searchParams.get("entityType")).toBe("Product");
    expect(requestedUrl(0).searchParams.getAll("entityIds")).toEqual(["p1"]);
  });

  it("fails when the API cannot return the images", async () => {
    fetchMock.mockResolvedValueOnce(respondWith({}, 500));

    await expect(getProductImages("p1")).rejects.toThrow(
      "Failed to fetch images of product p1: 500",
    );
  });
});

describe("getProductCoverUrls", () => {
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
