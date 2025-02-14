// If fieldsParam is not null and is not an empty string (after trimming whitespace), parseFields replaces all commas in the string with spaces. Otherwise, it returns undefined.
// function is useful when you want to convert a comma-separated list of fields into a space-separated list. In MongoDB queries, a space-separated list of field names is used to specify which fields to include in the returned documents.
export const parseFields = (fieldsParam: string | null): string | undefined => {
  return fieldsParam && fieldsParam.trim() !== ""
    ? fieldsParam.replace(/,/g, " ")
    : undefined;
};
