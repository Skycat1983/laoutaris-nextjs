type Fetcher<T> = (
  identifierKey: string,
  identifierValue: string,
  identifierFields?: string[],
  populatedFields?: string[]
) => Promise<ApiResponse<T>>;

export const fetchAndResolveObj = <RawDataType, ResolvedType>(
  fetcher: Fetcher<RawDataType>,
  identifierKey: string,
  identifierValue: string,
  identifierFields: string[],
  resolver: (item: RawDataType) => ResolvedType,
  populatedFields?: string[]
): (() => Promise<ResolvedType>) => {
  return async () => {
    const response = await fetcher(
      identifierKey,
      identifierValue,
      identifierFields,
      populatedFields
    );

    if (response.success) {
      if (!response.data || Array.isArray(response.data)) {
        throw new Error(
          "Expected a single object but received an array or undefined."
        );
      }

      return resolver(response.data);
    }
    throw new Error("Failed to fetch data");
  };
};
