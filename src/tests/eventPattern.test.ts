import { stringScenarios } from './eventPattern.data';
import { EventPattern } from '../EventPattern';

describe('Test EventPattern', () => {
  test.each(stringScenarios)(
    'should produce correct test results given string pattern',
    (patternString, actual, output) => {
      const basePattern = {
        source: patternString,
      };
      const pattern = new EventPattern(
        basePattern,
        [(input) => input],
        (err) => {
          throw err;
        }
      );

      const result = pattern.test({
        source: actual,
      });

      expect(result).toBe(output);
    }
  );
});
