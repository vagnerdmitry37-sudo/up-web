import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { AttributeDefinition, ProductTypeDefinition } from "@/lib/product-types";
import { ProductFacts } from "./ProductFacts";

const attribute = (key: string, label: string): AttributeDefinition => ({
  key,
  label,
  kind: "Text",
  required: false,
  maxLength: null,
  min: null,
});

const definition: ProductTypeDefinition = {
  type: "GroupExcursion",
  label: "Group excursion",
  priceLabel: "Price per person",
  attributes: [
    attribute("duration", "Duration"),
    attribute("groupSize", "Group size"),
    attribute("meetingPoint", "Meeting point"),
  ],
};

const facts = () =>
  screen.queryAllByRole("term").map((term) => [term.textContent, term.nextElementSibling?.textContent]);

describe("ProductFacts", () => {
  afterEach(cleanup);

  it("lists each filled attribute with its label in the order the type defines", () => {
    render(
      <ProductFacts
        definition={definition}
        attributes={{ meetingPoint: "Main square", duration: "3 hours", groupSize: 12 }}
      />,
    );

    expect(facts()).toEqual([
      ["Duration", "3 hours"],
      ["Group size", "12"],
      ["Meeting point", "Main square"],
    ]);
  });

  it("shows zero as a value", () => {
    render(<ProductFacts definition={definition} attributes={{ groupSize: 0 }} />);

    expect(facts()).toEqual([["Group size", "0"]]);
  });

  it("skips missing, empty and non-text values", () => {
    render(
      <ProductFacts
        definition={definition}
        attributes={{ duration: "", groupSize: { min: 1 }, meetingPoint: true }}
      />,
    );

    expect(facts()).toEqual([]);
  });

  it("ignores attributes the product type does not define", () => {
    render(
      <ProductFacts definition={definition} attributes={{ duration: "2 hours", secret: "internal" }} />,
    );

    expect(facts()).toEqual([["Duration", "2 hours"]]);
    expect(screen.queryByText("internal")).toBeNull();
  });

  it.each([null, undefined, "text", 5, []])(
    "renders nothing when the attributes are %j",
    (attributes) => {
      const { container } = render(<ProductFacts definition={definition} attributes={attributes} />);

      expect(container.innerHTML).toBe("");
    },
  );
});
