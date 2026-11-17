"use strict";

import { BadRequestError } from "../expressError";

// parses ID from route param -> must be a positive integer
export function parseId(value: string | string[] | undefined, label: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1)
    throw new BadRequestError(`${label} must be a positive integer`);
  return id;
}
