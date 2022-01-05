/* eslint-disable */
export type handlerType = <T>(context: T) => Partial<T>;
export type errorHandlerType = (exception: unknown) => never;

export class EventPattern<T> {
  constructor(
    private pattern: Partial<T>,
    private handlers: handlerType[],
    private errorHandler: errorHandlerType
  ) {}

  public getPattern(): Partial<T> {
    return this.pattern;
  }

  public getHandlers(): handlerType[] {
    return this.handlers;
  }

  public getErrorHandler(): errorHandlerType {
    return this.errorHandler;
  }

  public setPattern(pattern: Partial<T>): void {
    this.pattern = pattern;
  }

  public setHandlers(handlers: handlerType[]): void {
    this.handlers = handlers;
  }

  public setErrorHandler(errorHandler: errorHandlerType): void {
    this.errorHandler = errorHandler;
  }

  public test(incomingEvent: Record<string, unknown>): boolean {
    const keysPresent = Object.keys(this.pattern).every(
      (key) => !!incomingEvent[key]
    );
    let result = false;
    if (keysPresent) {
      result = Object.entries(this.pattern).reduce(
        (acc: boolean, [key, value]: [string, unknown]) => {
          return acc && testValue(value, incomingEvent[key]);
        },
        true
      );
    }

    return result;
  }
}

function testValue(expected: unknown, actual: unknown): boolean {
  if (!expected || !actual) return false;
  let result = true;

  // if Object, iterate through keys and recursively validate each
  if (expected instanceof Object) {
    let key: keyof typeof expected;
    for (key in expected) {
      result = result && testValue(expected[key], actual[key]);
    }
  }

  // validate
  if (typeof expected === 'string') {
    // support simple wildcard-based matching
    const wildcard = expected.indexOf('*');
    if (wildcard === expected.length - 1) {
      result =
        result && (actual as string).includes(expected.substring(0, wildcard));
    } else if (wildcard === 0) {
      result =
        result &&
        (actual as string).includes(
          expected.substring(wildcard + 1, expected.length)
        );
    } else if (wildcard > 0 && wildcard < expected.length - 1) {
      result =
        (actual as string).startsWith(expected.substring(0, wildcard)) &&
        (actual as string).endsWith(
          expected.substring(wildcard + 1, expected.length)
        );
    } else {
      result = expected === actual;
    }
  } else if (typeof expected === 'number' || typeof expected === 'boolean') {
    // TODO: Match numbers/booleans
  } else if (expected instanceof RegExp) {
    // TODO: Match via RegEx
  } else {
    // TODO: This may not be necessary. Might also be ok to throw exception here.
  }

  return result;
}
