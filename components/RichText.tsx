import { createElement, type ReactNode } from "react";
import parse, { domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import { ALLOWED_TAGS, DROPPED_TAGS, isElement, isEmptyHtml, isSafeHref } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

type RichTextProps = {
  html: string | null | undefined;
  className?: string;
};

const renderChildrenOnly = (children: ReactNode) => <>{children}</>;

const renderLink = (href: string, children: ReactNode) => {
  const trimmedHref = href.trim();
  const isExternal = !trimmedHref.startsWith("/");
  return (
    <a
      href={trimmedHref}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer nofollow" })}
    >
      {children}
    </a>
  );
};

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (!isElement(node)) return;
    if (DROPPED_TAGS.has(node.name)) return <></>;

    const children = domToReact(node.children as DOMNode[], options);

    if (!ALLOWED_TAGS.has(node.name)) return renderChildrenOnly(children);
    if (node.name === "br") return <br />;
    if (node.name === "a") {
      const href = node.attribs.href;
      return isSafeHref(href) ? renderLink(href, children) : renderChildrenOnly(children);
    }

    return createElement(node.name, null, children);
  },
};

export const RichText = ({ html, className }: RichTextProps) => {
  if (!html || isEmptyHtml(html)) return null;

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none break-words dark:prose-invert prose-a:break-all",
        className,
      )}
    >
      {parse(html, options)}
    </div>
  );
};
