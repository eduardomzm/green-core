/**
 * Interface for backend errors grouped by field.
 */
export interface FieldErrors {
  [key: string]: string[];
}

/**
 * Parses error objects returned by the Django backend.
 * Django often returns errors in the format: { fieldName: ["Error message"] }
 * This function extracts these into a FieldErrors object.
 */
export const parseBackendErrors = (errorData: any): FieldErrors => {
  const result: FieldErrors = {};

  if (!errorData) {
    result["non_field_errors"] = ["Error desconocido"];
    return result;
  }

  // If it's already a string, put it in non_field_errors
  if (typeof errorData === "string") {
    result["non_field_errors"] = [errorData];
    return result;
  }

  // If it's an object, extract all messages per key
  if (typeof errorData === "object") {
    Object.keys(errorData).forEach((key) => {
      const value = errorData[key];
      if (Array.isArray(value)) {
        result[key] = value.map(msg => typeof msg === 'string' ? msg : JSON.stringify(msg));
      } else if (typeof value === "string") {
        result[key] = [value];
      } else if (typeof value === "object") {
        // Handle nested objects by merging them (rare in simple registrations but good for robustness)
        const nested = parseBackendErrors(value);
        Object.keys(nested).forEach(nestedKey => {
          result[`${key}.${nestedKey}`] = nested[nestedKey];
        });
      }
    });

    if (Object.keys(result).length === 0) {
      result["non_field_errors"] = ["Error de validación"];
    }
    return result;
  }

  result["non_field_errors"] = ["Error inesperado"];
  return result;
};

