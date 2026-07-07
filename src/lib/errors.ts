export interface FormErrors {
  nonFieldErrors: string | null;
  fieldErrors: Record<string, string>;
}

/**
 * Parses API validation error payloads.
 * Extracts "non_field_errors" as general form errors, and links other errors
 * directly to their respective input fields.
 */
export function parseFormErrors(error: any): FormErrors {
  const result: FormErrors = {
    nonFieldErrors: null,
    fieldErrors: {},
  };

  if (!error) return result;

  if (error.data && typeof error.data === "object") {
    const data = error.data;

    // Extract non_field_errors
    if (data.non_field_errors) {
      if (Array.isArray(data.non_field_errors)) {
        result.nonFieldErrors = data.non_field_errors.join(" ");
      } else if (typeof data.non_field_errors === "string") {
        result.nonFieldErrors = data.non_field_errors;
      }
    }

    // Extract specific field errors
    Object.entries(data).forEach(([key, val]) => {
      if (key === "non_field_errors") return;

      if (Array.isArray(val)) {
        result.fieldErrors[key] = val.join(" ");
      } else if (typeof val === "string") {
        result.fieldErrors[key] = val;
      }
    });
  }

  // Fallback to top-level message if no structured errors were found
  if (!result.nonFieldErrors && Object.keys(result.fieldErrors).length === 0) {
    result.nonFieldErrors = error.message || "An unexpected error occurred.";
  }

  return result;
}
