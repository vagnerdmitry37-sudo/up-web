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
        className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-base sm:text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-lg bg-primary px-4 text-base sm:text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Search
      </button>
    </Form>
  );
};
