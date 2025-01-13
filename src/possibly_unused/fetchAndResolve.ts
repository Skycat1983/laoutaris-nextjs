type Fetcher<T> = (
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
) => Promise<ApiResponse<T>>;

type Resolver<RawDataType, ResolvedType> = (item: RawDataType) => ResolvedType;

export const fetchAndResolve = <RawDataType, ResolvedType>(
  fetcher: Fetcher<RawDataType>,
  identifierKey: string,
  identifierValue: string,
  fields: string[],
  resolver: Resolver<RawDataType, ResolvedType>
): (() => Promise<ResolvedType[]>) => {
  return async () => {
    const response = await fetcher(identifierKey, identifierValue, fields);

    if (response.success) {
      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return dataArray.map(resolver);
    }
    throw new Error("Failed to fetch data");
  };
};
