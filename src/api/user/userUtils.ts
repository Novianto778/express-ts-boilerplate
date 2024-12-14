export const userCacheKey = {
  all: "users",
  detail: (id: number) => `user:${id}`,
  email: (email: string) => `user:${email}`,
};
