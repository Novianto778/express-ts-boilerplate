import type { Request } from "express";

export function parseQueryParams<T extends Record<string, any>>(req: Request): T {
  const queryParams = Object.entries(req.query).reduce(
    (acc, [key, value]) => {
      if (typeof value === "string") {
        if (!Number.isNaN(Number(value))) {
          acc[key] = Number(value); // Parse numbers
        } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
          acc[key] = value.toLowerCase() === "true"; // Parse booleans
        } else {
          acc[key] = value; // Keep as string
        }
      } else {
        acc[key] = value; // Handle other cases (e.g., arrays)
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return queryParams as T;
}

export type QueryFilter<T> = Record<string, T[keyof T]>;
