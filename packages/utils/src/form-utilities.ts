export function checkComponentValidity(internals: ElementInternals): boolean {
  return internals.checkValidity();
}

export function reportComponentValidity(internals: ElementInternals): boolean {
  return internals.reportValidity();
}

export function setComponentValidity(
  internals: ElementInternals,
  message: string,
) {
  internals.setValidity(message ? { customError: true } : {}, message);
}

export function handleComponentInvalid(
  event: Event,
  internals: ElementInternals,
) {
  const input = event.target as HTMLInputElement;
  internals.setValidity(
    input.validationMessage ? { customError: true } : {},
    input.validationMessage,
  );
}
