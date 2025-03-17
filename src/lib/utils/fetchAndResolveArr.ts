import { ApiResponse } from "../data/types";

type Fetcher<T> = (
  identifierKey: string,
  identifierValue: string,
  identifierFields?: string[],
  populatedFields?: string[]
) => Promise<ApiResponse<T>>;

export const fetchAndResolveArr = <RawDataType, ResolvedType>(
  fetcher: Fetcher<RawDataType[]>,
  identifierKey: string,
  identifierValue: string,
  identifierFields: string[],
  resolver: (items: RawDataType[]) => ResolvedType,
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
      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return resolver(dataArray);
    }
    throw new Error("Failed to fetch data");
  };
};
