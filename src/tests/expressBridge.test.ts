import ExpressBridge from '../ExpressBridge';
import type { handlerType } from '../EventPattern';
import messages from './expressBridge.data';

const basePattern = {
  source: 'aws.*',
};

describe('Test ExpressBridge', () => {
  test('should always run hooks when option is set', async () => {
    const preHook = jest.fn((event) => Promise.resolve(event));
    const postHook = jest.fn((event) => Promise.resolve(event));
    const expressBridge = new ExpressBridge({ alwaysRunHooks: true });

    const handler = jest.fn((event) => Promise.resolve(event));
    const errorHandler = jest.fn((err) => {
      console.log(err);
      throw err;
    });

    expressBridge.pre(preHook as handlerType);
    expressBridge.post(postHook as handlerType);

    expressBridge.use(basePattern, [handler as handlerType], errorHandler);

    await expressBridge.process(messages.instanceTerminatedMessage);

    expect(preHook).toHaveBeenCalledWith(messages.instanceTerminatedMessage);
    expect(postHook).toHaveBeenCalledWith(messages.instanceTerminatedMessage);
  });
});