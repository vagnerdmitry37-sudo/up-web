import { Separator } from "@/components/ui/separator";
import type { ProductTypeDefinition } from "@/lib/product-types";

type ProductFactsProps = {
  definition: ProductTypeDefinition;
  attributes: unknown;
};

const attributeValue = (attributes: unknown, key: string): string => {
  if (typeof attributes !== "object" || attributes === null) return "";
  const value = (attributes as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
};

export const ProductFacts = ({ definition, attributes }: ProductFactsProps) => {
  const facts = definition.attributes
    .map((attribute) => ({
      key: attribute.key,
      label: attribute.label,
      value: attributeValue(attributes, attribute.key),
    }))
    .filter((fact) => fact.value !== "");

  if (facts.length === 0) return null;

  return (
    <>
      <Separator />
      <dl className="flex flex-col gap-3">
        {facts.map((fact) => (
          <div
            key={fact.key}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <dt className="text-sm text-muted-foreground">{fact.label}</dt>
            <dd className="min-w-0 text-base font-medium break-words sm:text-right">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
};
