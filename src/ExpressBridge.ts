import type { handlerType, errorHandlerType } from './EventPattern';
import { EventPattern } from './EventPattern';

export default class ExpressBridge {
  /*
    data
        #comparableCollection 
          - a list of EventPattern
    methods
        constructor ()
        preHook
        postHook
        mapPatternToHandlers
        #match
        dispatch( pojo Event object)
  */
  private comparableCollection: EventPattern<any>[] = [];

  private preHookHandlers: handlerType[] = [];

  private postHookHandlers: handlerType[] = [];

  private matchEventToPattern(incomingEvent: Event);

  public pipelineEvent(incomingEvent: Object): void {
      // pipeline event through preHook handlers and save output
      // match pattern to handlers
      const matchedPattern: EventPattern = this.matchEventToPattern(incomingEvent: Event);
      // pipeline prehook output through handlers belonging to correct EventPattern
      // pipeline EventPattern output through postHook handlers


      // { alwaysRunHooks: true } // default is false
      // default behavior is... 
      // if pattern cannot be matched to existing EventPattern, throw exception
    // this requires some kind of pipeline
    // const collectionOfFunctions = [(event) => {}, (event) => {}];

    matchedPatterns.forEach(pattern => {
        pipeline(incomingEvent, pattern.handlers);
    });

    function pipeline (event: EventType, pattern: EventPattern) { 
      pattern.handlers.reduce((eventAccumulator: EventType, handler: handlerType) => {
        try {
            return handler(eventAccumulator)
        } catch(error: unknown) {
            pattern.getErrorHandler()(error);
        }
      }, event);
    }
  }

  public addPreHookHandlers(...handlers: handlerType[]): void {
    this.preHookHandlers.push(...handlers);
  }

  public mapPatternToHandlers(
    pattern: Record<string, RegExp>,
    handlers: handlerType[],
    errorHandler: errorHandlerType,
  ): void {
    // this is the most rudimentary, brute force implementation of this data structure
    const patternInstance = new EventPattern<typeof pattern>(pattern, handlers, errorHandler);
    this.comparableCollection.push(patternInstance);
  }
  
  public matchEventToPattern() {

  }

  public addPostHookHandlers(...handlers: handlerType[]): void {
    this.postHookHandlers.push(...handlers);
  }

};
