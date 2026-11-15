import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RichText } from "./RichText";

const renderHtml = (html: string | null | undefined) => render(<RichText html={html} />).container;

describe("RichText", () => {
  afterEach(cleanup);

  it("keeps the allowed formatting", () => {
    const container = renderHtml(
      "<h2>Route</h2><p>Meet at the <strong>main</strong> <em>square</em>.<br>Bring water.</p><ul><li>Old town</li></ul>",
    );

    expect(screen.getByRole("heading", { level: 2, name: "Route" })).toBeTruthy();
    expect(container.querySelector("strong")?.textContent).toBe("main");
    expect(container.querySelector("em")?.textContent).toBe("square");
    expect(container.querySelector("br")).not.toBeNull();
    expect(screen.getByRole("listitem").textContent).toBe("Old town");
  });

  it("removes scripts, styles and embedded frames together with their content", () => {
    const container = renderHtml(
      "<p>Safe</p><script>alert('x')</script><style>body{display:none}</style><iframe src=\"https://evil.test\"></iframe><noscript>hidden</noscript>",
    );

    expect(container.textContent).toBe("Safe");
    expect(container.querySelector("script, style, iframe, noscript")).toBeNull();
  });

  it("unwraps unknown tags but keeps their text", () => {
    const container = renderHtml("<div><span>Kept</span> text</div><img src=x onerror=\"alert(1)\">");

    expect(container.textContent).toBe("Kept text");
    expect(container.firstElementChild?.children).toHaveLength(0);
  });

  it("drops every attribute from allowed tags", () => {
    const container = renderHtml(
      "<p onclick=\"alert(1)\" style=\"color:red\" class=\"x\" id=\"y\">Text</p>",
    );

    const paragraph = container.querySelector("p");
    expect(paragraph?.attributes).toHaveLength(0);
  });

  it("turns links with unsafe addresses into plain text", () => {
    const container = renderHtml(
      "<a href=\"javascript:alert(1)\">one</a><a href=\" JavaScript:alert(1)\">two</a><a href=\"data:text/html,x\">three</a><a href=\"//evil.test\">four</a><a>five</a>",
    );

    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toBe("onetwothreefourfive");
  });

  it("opens external links in a new tab without passing the opener or ranking", () => {
    renderHtml("<a href=\" https://example.test/tour \" onclick=\"alert(1)\">Tour</a>");

    const link = screen.getByRole("link", { name: "Tour" });
    expect(link.getAttribute("href")).toBe("https://example.test/tour");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer nofollow");
    expect(link.getAttribute("onclick")).toBeNull();
  });

  it("treats mailto links as external", () => {
    renderHtml("<a href=\"mailto:info@example.test\">Write us</a>");

    expect(screen.getByRole("link", { name: "Write us" }).getAttribute("target")).toBe("_blank");
  });

  it("opens links inside the site in the same tab", () => {
    renderHtml("<a href=\"/products/p1\">Other tour</a>");

    const link = screen.getByRole("link", { name: "Other tour" });
    expect(link.getAttribute("href")).toBe("/products/p1");
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
  });

  it.each([null, undefined, "", "<p></p>", "<p>&nbsp;</p>", "<p> <br> </p>"])(
    "renders nothing for empty content %j",
    (html) => {
      expect(renderHtml(html).innerHTML).toBe("");
    },
  );
});
