import type { handlerType, errorHandlerType } from './EventPattern';
import { EventPattern } from './EventPattern';

type EventType = Record<string, unknown>;

interface ExpressBridgeOptions {
  alwaysRunHooks?: boolean;
}
export default class ExpressBridge {
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
      this.preHandlers.forEach((handler) => {
        handler(incomingEvent);
      });

      // run pattern handlers
      for (const pattern of matchedPatterns) {
        try {
          pipeline(incomingEvent, ...pattern.getHandlers());
        } catch (err) {
          pattern.getErrorHandler()(err);
        }
      }

      // run post handlers
      this.postHandlers.forEach((handler) => {
        handler(incomingEvent);
      });
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
  return functions.reduce((acc, func) => {
    return func(acc);
  }, message);
}
