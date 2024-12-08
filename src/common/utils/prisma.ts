import type { z } from "zod";

export const generatePrismaSelect = (schema: z.ZodObject<any>) => {
  const shape = schema.shape;
  return Object.keys(shape).reduce(
    (selectObject, key) => {
      selectObject[key] = true;
      return selectObject;
    },
    {} as Record<string, boolean>,
  );
};
