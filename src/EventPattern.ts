/* eslint-disable */
export type handlerType = <T>(context: T) => Partial<T>;
export type errorHandlerType = (exception: unknown) => never;

export class EventPattern<PatternType> {
  constructor(
    private pattern: Partial<PatternType>,
    private handlers: handlerType[],
    private errorHandler: errorHandlerType
  ) {}

  public getPattern(): Partial<PatternType> {
    return this.pattern;
  }

  public getHandlers(): handlerType[] {
    return this.handlers;
  }

  public getErrorHandler(): errorHandlerType {
    return this.errorHandler;
  }

  public setPattern(pattern: Partial<PatternType>): void {
    this.pattern = pattern;
  }

  public setHandlers(handlers: handlerType[]): void {
    this.handlers = handlers;
  }

  public setErrorHandler(errorHandler: errorHandlerType): void {
    this.errorHandler = errorHandler;
  }

  public test(incomingEvent: Object): boolean {
    const incomingEventStr: string = ;

    return false;
  }
}
