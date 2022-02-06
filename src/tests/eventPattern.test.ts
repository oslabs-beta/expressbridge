import { stringScenarios, nestedScenarios } from './eventPattern.data';
import { EventPattern } from '../EventPattern';

describe('Test EventPattern.test', () => {
  test.each(stringScenarios)(
    'should produce correct test results given string pattern',
    (patternString, actual, output) => {
      const basePattern = {
        source: patternString, //'orders.*'
      };
      const pattern = new EventPattern(
        basePattern,
        [(input) => input],
        (err) => {
          throw err;
        }
      );

      const result = pattern.test({
        // incoming eventm
        source: actual, // 'orders.canada'
      });

      expect(result).toBe(output);
    }
  );

  test.each(nestedScenarios)(
    'should correctly match nested objects',
    (patternObj, actual, output) => {
      const pattern = new EventPattern(
        patternObj as any,
        [(input) => input],
        (err) => {
          throw err;
        }
      );

      const result = pattern.test(actual as any);

      expect(result).toBe(output);
    }
  );
});
