import { EventPattern } from '../EventPattern';

describe('Test EventPattern', () => {
  const stringScenarios = [
    ['market*', 'marketplaceOffers', true],
    ['aws.*', 'aws.ec2', true],
    ['*.postfix', 'service.postfix', true],
    ['*.postfix', 'service.postmix', false],
    ['market*', 'elephant', false],
    ['*narwhal', 'goose', false],
    ['cool*beans', 'coolxbeans', true],
    ['cool*beans', 'coolxbeanz', false],
    ['*beans', 'coolxbeans', true],
    ['beans', 'coolxbeans', false],
  ];
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
