"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useId, useRef, useState, type ToggleEvent } from "react";
import { SearchForm } from "@/components/SearchForm";

const ICON_TRANSITION =
  "absolute size-5 transition duration-200 ease-out motion-reduce:transition-none";

export const SearchMenu = () => {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuToggle = (event: ToggleEvent<HTMLDivElement>) => {
    const isOpening = event.newState === "open";
    setIsOpen(isOpening);
    if (isOpening) inputRef.current?.focus();
  };

  const closeMenu = () => menuRef.current?.hidePopover();

  return (
    <>
      <button
        type="button"
        popoverTarget={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close search" : "Search products"}
        className="group relative flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <SearchIcon
          aria-hidden
          className={`${ICON_TRANSITION} group-aria-expanded:-rotate-90 group-aria-expanded:scale-50 group-aria-expanded:opacity-0`}
        />
        <XIcon
          aria-hidden
          className={`${ICON_TRANSITION} rotate-90 scale-50 opacity-0 group-aria-expanded:rotate-0 group-aria-expanded:scale-100 group-aria-expanded:opacity-100`}
        />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        onToggle={handleMenuToggle}
        className="fixed inset-x-4 top-auto bottom-[calc(4.5rem+env(safe-area-inset-bottom))] m-0 w-auto rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg sm:left-auto sm:right-[calc(max(0px,(100vw-64rem)/2)+1rem)] sm:w-96 md:right-[calc(max(0px,(100vw-64rem)/2)+1.5rem)]"
      >
        <SearchForm inputRef={inputRef} onSubmit={closeMenu} />
      </div>
    </>
  );
};
