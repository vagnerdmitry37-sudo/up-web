import Form from "next/form";

export const SearchForm = ({ defaultValue = "" }: { defaultValue?: string }) => {
  return (
    <Form action="/" role="search" className="flex w-full gap-2">
      <label htmlFor="q" className="sr-only">
        Search products
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search products…"
        className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Search
      </button>
    </Form>
  );
};
