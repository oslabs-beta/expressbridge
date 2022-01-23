import { AxiosRequestConfig } from 'axios';
import { v4 } from 'uuid';
import type { handlerType, errorHandlerType } from './EventPattern';
import { EventPattern } from './EventPattern';
import { Telemetry } from './Telemetry';

type EventType = Record<string, any>;

interface ExpressBridgeOptions {
  alwaysRunHooks?: boolean;
  telemetry?: Partial<AxiosRequestConfig>;
}
export class ExpressBridge {
  private comparableCollection: EventPattern<unknown>[] = [];

  private preHandlers: handlerType[] = [];

  private postHandlers: handlerType[] = [];

  private telemetry: Telemetry;

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
    // if telemetry is defined, set uuid and call beacon
    console.log(
      'Telemetry enabled: ',
      process.env.EB_TELEMETRY && this.options.telemetry
    );
    if (process.env.EB_TELEMETRY && this.options.telemetry) {
      this.telemetry = new Telemetry(
        incomingEvent.data?.eventId || v4(),
        this.options.telemetry
      );
    }
    this.telemetry?.beacon('EB-PROCESS', {
      sourceEventId: incomingEvent.data?.uuid,
      description: 'Process function called. Generating process ID.',
      data: {
        event: incomingEvent,
      },
    });

    const matchedPatterns = this.comparableCollection.filter(
      (eventPattern: EventPattern<Partial<typeof incomingEvent>>) => {
        return eventPattern.test(incomingEvent);
      }
    );

    console.log('matchedPatterns', matchedPatterns);

    if (matchedPatterns.length > 0) {
      console.log('patterns matched. telemetry object', this.telemetry);

      this.telemetry?.beacon('EB-MATCH', {
        sourceEventId: incomingEvent.data?.uuid,
        description: 'Patterns matched for event. Calling assigned handlers.',
        data: {
          matchedPatterns,
        },
      });

      // run pre hook
      const output = await pipeline(incomingEvent, ...this.preHandlers);

      this.telemetry?.beacon('EB-PRE', {
        sourceEventId: incomingEvent.data?.uuid,
        data: output,
      });

      // run pattern handlers
      for (const pattern of matchedPatterns) {
        try {
          await pipeline(output, ...pattern.getHandlers());
        } catch (err) {
          pattern.getErrorHandler()(err);
        }
      }

      this.telemetry?.beacon('EB-HANDLERS', {
        sourceEventId: incomingEvent.data?.uuid,
        data: output,
      });

      // run post handlers
      if (this.postHandlers) pipeline(output, ...this.postHandlers);

      this.telemetry?.beacon('EB-POST', {
        sourceEventId: incomingEvent.data?.uuid,
        data: incomingEvent,
      });
    } else if (
      this.options.alwaysRunHooks &&
      (this.preHandlers || this.postHandlers)
    ) {
      await pipeline(incomingEvent, ...this.preHandlers, ...this.postHandlers);
    }
  }

  public pre(...handlers: handlerType[]): void {
    this.preHandlers.push(...handlers);
  }

  public post(...handlers: handlerType[]): void {
    this.postHandlers.push(...handlers);
  }

  public getTelemetryId() {
    return this.telemetry.eventId;
  }
}

function pipeline(message: EventType, ...functions: handlerType[]): EventType {
  const reduced = functions.reduce(async (acc, func) => {
    return func(await acc);
  }, message);

  return reduced;
}
