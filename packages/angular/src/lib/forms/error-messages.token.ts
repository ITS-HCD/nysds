import { InjectionToken } from "@angular/core";

/**
 * Default error message functions for common validators.
 *
 * Consumers override by providing a new object or merging with the
 * default:
 *
 * ```ts
 * providers: [
 *   {
 *     provide: NYS_ERROR_MESSAGES,
 *     useValue: {
 *       required: () => "This field is required",
 *       email: () => "Enter a valid email",
 *     },
 *   },
 * ]
 * ```
 */
export const NYS_ERROR_MESSAGES = new InjectionToken<Record<string, (err: unknown) => string>>(
  "nysds.errorMessages",
  {
    factory: () => ({
      required: () => "This field is required",
      minlength: (err: any) => `Minimum length is ${err.requiredLength}`,
      maxlength: (err: any) => `Maximum length is ${err.requiredLength}`,
      pattern: () => "Invalid format",
      email: () => "Enter a valid email address",
      min: (err: any) => `Minimum value is ${err.min}`,
      max: (err: any) => `Maximum value is ${err.max}`,
    }),
  },
);
