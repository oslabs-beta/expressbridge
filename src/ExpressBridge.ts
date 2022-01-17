import type { handlerType, errorHandlerType } from './EventPattern';
import { EventPattern } from './EventPattern';

type EventType = Record<string, any>;

interface ExpressBridgeOptions {
  alwaysRunHooks?: boolean;
}
export class ExpressBridge {
  private comparableCollection: EventPattern<unknown>[] = [];

  private preHandlers: handlerType[] = [];

  private postHandlers: handlerType[] = [];

  public constructor(public options: ExpressBridgeOptions) {}

  public use(
    pattern: Record<string, unknown>,
    handlers: handlerType[],
    errorHandler: errorHandlerType
  ): void {
    const patternInstance = new EventPattern<typeof pattern>(
      pattern,
      handlers,
      errorHandler
    );
    this.comparableCollection.push(patternInstance);
  }

  public async process(incomingEvent: EventType): Promise<void> {
    const matchedPatterns = this.comparableCollection.filter(
      (eventPattern: EventPattern<Partial<typeof incomingEvent>>) => {
        return eventPattern.test(incomingEvent);
      }
    );
    if (matchedPatterns.length > 0) {
      // run pre hook
      const output = pipeline(incomingEvent, ...this.preHandlers);

      // run pattern handlers
      console.log('incomingEvent', incomingEvent);
      for (const pattern of matchedPatterns) {
        try {
          pipeline(output, ...pattern.getHandlers());
        } catch (err) {
          pattern.getErrorHandler()(err);
        }
      }

      // run post handlers
      pipeline(incomingEvent, ...this.postHandlers);
    }
  }

  public pre(...handlers: handlerType[]): void {
    this.preHandlers.push(...handlers);
  }

  public post(...handlers: handlerType[]): void {
    this.postHandlers.push(...handlers);
  }
}

function pipeline(message: EventType, ...functions: handlerType[]): EventType {
  const reduced = functions.reduce((acc, func) => {
    return func(acc);
  }, message);
  console.log(reduced);
  return reduced;
}
