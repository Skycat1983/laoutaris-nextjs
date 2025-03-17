import { ApiResponse } from "../data/types";

type Fetcher<T> = (
  identifierKey: string,
  identifierValue: string,
  identifierFields?: string[],
  populatedFields?: string[]
) => Promise<ApiResponse<T>>;

type Resolver<RawDataType, ResolvedType> = (item: RawDataType) => ResolvedType;

export const fetchAndResolve = <RawDataType, ResolvedType>(
  fetcher: Fetcher<RawDataType>,
  identifierKey: string,
  identifierValue: string,
  identifierFields: string[],
  resolver: Resolver<RawDataType, ResolvedType>,
  populatedFields?: string[]
): (() => Promise<ResolvedType[]>) => {
  return async () => {
    const response = await fetcher(
      identifierKey,
      identifierValue,
      identifierFields,
      populatedFields
    );

    if (response.success) {
      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return dataArray.map(resolver);
    }
    throw new Error("Failed to fetch data");
  };
};
