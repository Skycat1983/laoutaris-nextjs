export function transformToPick<T, K extends keyof T>(
  data: T,
  fields: readonly K[]
): Pick<T, K> {
  return fields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: data[field],
    }),
    {} as Pick<T, K>
  );
}
