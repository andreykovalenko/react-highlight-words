/* @flow */
import { Chunk, findAll, FindChunksArgs } from "highlight-words-core";

import {
  createElement,
  FunctionComponent,
  HTMLElementType,
  useMemo,
} from "react";

export interface HighlighterProps {
  activeClassName?: string;
  activeIndex?: number;
  activeStyle?: object;
  autoEscape?: boolean;
  caseSensitive?: boolean;
  className?: string;
  findChunks?: (args: FindChunksArgs) => Chunk[];
  highlightClassName?: Record<string, string> | string;
  highlightStyle?: object;
  highlightTag?: HTMLElementType | FunctionComponent | string;
  sanitize?: (text: string) => string;
  searchWords: string[];
  textToHighlight: string;
  unhighlightTag?: HTMLElementType | FunctionComponent | string;
  unhighlightClassName?: string;
  unhighlightStyle?: object;
}
const reduceToLowerCaseMap = (obj: object) =>
  Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});
/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter({
  activeClassName = "",
  activeIndex = -1,
  activeStyle,
  autoEscape,
  caseSensitive = false,
  className,
  findChunks,
  highlightClassName = "",
  highlightStyle = {},
  highlightTag = "mark",
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightTag = "span",
  unhighlightClassName = "",
  unhighlightStyle,
  ...rest
}: HighlighterProps) {
  const chunks = findAll({
    autoEscape,
    caseSensitive,
    findChunks,
    sanitize,
    searchWords,
    textToHighlight,
  });
  let highlightIndex = -1;
  let highlightClassNames = "";
  let highlightStyles;
  const highlightClassNameMap = useMemo(
    () =>
      typeof highlightClassName === "object"
        ? reduceToLowerCaseMap(highlightClassName)
        : {},
    [highlightClassName]
  );

  return createElement("span", {
    className,
    ...rest,
    children: chunks.map((chunk, index) => {
      const text = textToHighlight.substring(chunk.start, chunk.end);
      if (chunk.highlight) {
        highlightIndex++;

        let highlightClass: string;
        if (typeof highlightClassName === "object") {
          if (!caseSensitive) {
            highlightClass = highlightClassNameMap[text.toLowerCase()];
          } else {
            highlightClass = highlightClassName[text];
          }
        } else {
          highlightClass = highlightClassName;
        }

        const isActive = highlightIndex === +activeIndex;

        highlightClassNames = `${highlightClass} ${
          isActive ? activeClassName : ""
        }`;
        highlightStyles =
          isActive === true && activeStyle != null
            ? Object.assign({}, highlightStyle, activeStyle)
            : highlightStyle;

        const props = {
          children: text,
          className: highlightClassNames,
          key: index,
          style: highlightStyles,
        };

        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
        // Only pass through the highlightIndex attribute for custom components.
        if (typeof highlightTag !== "string") {
          // @ts-expect-error ts(2769)
          props.highlightIndex = highlightIndex;
        }

        return createElement(highlightTag, props);
      }
      return createElement(
        unhighlightTag,
        {
          //@ts-expect-error ts(2769)
          className: unhighlightClassName,
          key: index,
          style: unhighlightStyle,
        },
        [text]
      );
    }),
  });
}
