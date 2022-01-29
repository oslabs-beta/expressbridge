import { v4 } from 'uuid';
import type { handlerType, errorHandlerType } from './EventPattern';
import type { TelemetryConfig } from './Telemetry';
import { EventPattern } from './EventPattern';
import { Telemetry } from './Telemetry';

type EventType = Record<string, any>;

interface ExpressBridgeOptions {
  alwaysRunHooks?: boolean;
  telemetry?: TelemetryConfig;
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
    console.log('Handling incoming event: ', incomingEvent);
    try {
      // if telemetry is defined, set uuid and call beacon
      console.log('Telemetry enabled: ', !!process.env.EB_TELEMETRY);
      if (process.env.EB_TELEMETRY && this.options.telemetry) {
        console.log('Telemetry enabled, setting trace tag on event.');
        this.telemetry = new Telemetry(this.options.telemetry);
        this.telemetry.tagEvent(incomingEvent);
      }

      await this.telemetry?.beacon('EB-PROCESS', {
        description: 'Process function called. Generating process ID.',
        data: {
          event: incomingEvent,
        },
      });

      const matchedPatterns = this.match(incomingEvent);

      console.log('Patterns matched: ', matchedPatterns);

      if (matchedPatterns.length > 0) {
        await this.telemetry?.beacon('EB-MATCH', {
          description: 'Patterns matched for event. Calling assigned handlers.',
          data: {
            matchedPatterns,
          },
        });

        // run pre hook
        const output = await pipeline(incomingEvent, ...this.preHandlers);

        await this.telemetry?.beacon('EB-PRE', {
          description: 'Pre hooks running',
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

        await this.telemetry?.beacon('EB-HANDLERS', {
          description: 'Handlers running',
          data: output,
        });

        // run post handlers
        if (this.postHandlers) pipeline(output, ...this.postHandlers);

        await this.telemetry?.beacon('EB-POST', {
          description: 'Post hooks running',
          data: incomingEvent,
        });
      } else if (
        this.options.alwaysRunHooks &&
        (this.preHandlers || this.postHandlers)
      ) {
        await pipeline(
          incomingEvent,
          ...this.preHandlers,
          ...this.postHandlers
        );
      }
    } catch (err: unknown) {
      console.log('Error occurred processing event: ', err);
      await this.telemetry?.beacon('EB-ERROR', {
        description: 'Error occurred in processing',
        data: err,
      });
    }
  }

  public pre(...handlers: handlerType[]): void {
    this.preHandlers.push(...handlers);
  }

  public post(...handlers: handlerType[]): void {
    this.postHandlers.push(...handlers);
  }
  /*  */
  private match(
    incomingEvent: Record<string, any>
  ): EventPattern<typeof incomingEvent>[] {
    return this.comparableCollection.filter(
      (eventPattern: EventPattern<Partial<typeof incomingEvent>>) => {
        return eventPattern.test(incomingEvent as any);
      }
    );
  }
}

function pipeline(message: EventType, ...functions: handlerType[]): EventType {
  const reduced = functions.reduce(async (acc, func) => {
    return func(await acc);
  }, message);

  return reduced;
}
