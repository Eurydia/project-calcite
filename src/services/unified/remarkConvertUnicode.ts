import { Root } from "mdast";
import { visitParents } from "unist-util-visit-parents";
import {
  toBoldItalicUnicode,
  toBoldUnicode,
  toItalicUnicode,
  toMonospaceUnicode,
} from "~services/unicode-converter";

export const remarkConvertUnicode = () => {
  return (tree: Root) => {
    visitParents(tree, (node, ancestors) => {
      switch (node.type) {
        case "strong": {
          const unicodeConverter = ancestors.some(
            (ancestor) => ancestor.type === "emphasis"
          )
            ? toBoldItalicUnicode
            : toBoldUnicode;
          node.children = node.children.map((child) => {
            if (child.type === "text") {
              const nextValue = child.value
                .split("")
                .map((char) => unicodeConverter(char))
                .join("");
              child.value = nextValue;
            }
            return child;
          });
          break;
        }
        case "emphasis": {
          const unicodeConverter = ancestors.some(
            (ancestor) => ancestor.type === "strong"
          )
            ? toBoldItalicUnicode
            : toItalicUnicode;
          node.children = node.children.map((child) => {
            if (child.type === "text") {
              const nextValue = child.value
                .split("")
                .map((char) => unicodeConverter(char))
                .join("");
              child.value = nextValue;
            }
            return child;
          });
          break;
        }
        case "code":
        case "inlineCode": {
          const convertedValue = node.value
            .split("")
            .map((char) => toMonospaceUnicode(char))
            .join("");
          node.value = convertedValue;
          break;
        }
      }
    });
  };
};
