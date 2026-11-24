import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { ProductImage } from "@/lib/products";
import { ProductGallery } from "./ProductGallery";

const image = (sortOrder: number): ProductImage => ({
  id: `img-${sortOrder}`,
  entityType: "Product",
  entityId: "p1",
  sortOrder,
  fileName: "",
  url: `https://img.test/${sortOrder}.webp`,
});

class ObserverStub {
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
  takeRecords = () => [];
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ObserverStub);
  vi.stubGlobal("IntersectionObserver", ObserverStub);
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
    })),
  );
});

describe("ProductGallery", () => {
  afterEach(cleanup);

  it("shows a placeholder when the product has no photos", () => {
    const { container } = render(<ProductGallery images={[]} productName="Old Town Walk" />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg[aria-hidden='true']")).not.toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("shows a single photo without navigation or a counter", () => {
    render(<ProductGallery images={[image(0)]} productName="Old Town Walk" />);

    const photo = screen.getByRole("img", { name: "Old Town Walk, photo 1 of 1" });
    expect(photo.getAttribute("src")).toBe("https://img.test/0.webp");
    expect(screen.queryByRole("button", { name: /slide/i })).toBeNull();
    expect(screen.queryByText("1 / 1")).toBeNull();
  });

  it("shows every photo in order with navigation and a counter", () => {
    render(<ProductGallery images={[image(0), image(1), image(2)]} productName="Old Town Walk" />);

    expect(screen.getByRole("region", { name: "Old Town Walk photos" })).toBeTruthy();
    expect(screen.getAllByRole("img").map((photo) => photo.getAttribute("alt"))).toEqual([
      "Old Town Walk, photo 1 of 3",
      "Old Town Walk, photo 2 of 3",
      "Old Town Walk, photo 3 of 3",
    ]);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeTruthy();
    expect(screen.getByText("1 / 3")).toBeTruthy();
  });
});
