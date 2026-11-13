import type { DOMNode, Element } from "html-react-parser";

export const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
]);

export const DROPPED_TAGS = new Set(["script", "style", "template", "iframe", "object", "embed", "noscript"]);

const ELEMENT_NODE_TYPES = new Set(["tag", "script", "style"]);

const SAFE_HREF = /^(https?:|mailto:|\/(?!\/))/i;

export const isElement = (node: DOMNode): node is Element => ELEMENT_NODE_TYPES.has(node.type);

export const isSafeHref = (href: string | undefined): href is string =>
  href !== undefined && SAFE_HREF.test(href.trim());

export const isEmptyHtml = (html: string | null | undefined): boolean =>
  !html || html.replace(/<[^>]*>|&nbsp;/g, "").trim() === "";
