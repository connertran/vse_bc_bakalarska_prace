"use strict";

import { BadRequestError } from "../expressError";

// for trimming and cleaning the search text in the url query
export function parseSearchText(value: unknown, label: string) {
  if (value === undefined) return "";
  if (typeof value !== "string")
    throw new BadRequestError(`${label} must be a single text value`);

  const text = value.trim().replace(/\s+/g, " ");
  if (text.length > 155)
    throw new BadRequestError(`${label} must be at most 155 characters`);
  return text;
}

// parses ID from route param -> must be a positive integer
export function parseId(value: string | string[] | undefined, label: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1)
    throw new BadRequestError(`${label} must be a positive integer`);
  return id;
}
