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


  public pipelineEvent(incomingEvent: Object): void {
      // pipeline event through preHook handlers and save output
      // match pattern to handlers
      const matchedPatterns: EventPattern[] = this.matchEventToPattern(incomingEvent: Event);
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

  private matchEventToPattern(incomingEvent: Event): EventPattern[] {
    // iterate through comparableCollection
    /*
    Event {
      source: 'marketplace_offers',
      id: 1000
    }

    EventPattern{
      source: /market./ig
      id: /100[0-9]/g
    }

      [EventType { pattern: { source: /market./ig }}]
    
      1. How to test to see if the incomingEvent matches the pattern at position i
    */
    const matchedPatterns = this.comparableCollection.filter(eventPattern: EventPattern => {
      // what happens here
      // on a string, we have the match method
      // on a regexp instance, we have the test method
      let result = true;

      for (let key in eventPattern.pattern) {
        if (!incomingEvent[key]) return false;
      }

      for (let key in eventPattern.pattern) {
        if (eventPattern.pattern[key] instanceof RegExp) {
          result = result && eventPattern.pattern.test(incomingEvent[key])
        }
      }
      
      return result;
    });
    return []
  };

  public addPostHookHandlers(...handlers: handlerType[]): void {
    this.postHookHandlers.push(...handlers);
  }

};

const pattern = {
  source: 'marketplace*'
}

const eventPattern = new EventPattern<typeof pattern>(pattern, [() => {}], () => {})

/*
matchingFunction(incomingEvent) {
  return (incomingEvent[someKey] == val);
}

-- line 57:

matchedPatterns = .filter((eventPattern.test(incomingEvent)))

test(incomingEvent) {
  this.matchingFunction(incomingEvent)
}

*/