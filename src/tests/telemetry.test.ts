import axios from 'axios';
import { Telemetry } from '../Telemetry';

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn(() => {
    Promise.resolve();
  }),
}));

describe('test telemetry functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should exercise telemetry functionality under correct conditions', async () => {
    expect(process.env.EB_TELEMETRY).toBe('true');

    const telemetry = new Telemetry({
      url: 'foo.com/telemetry',
      method: 'post',
      headers: {
        Authorization: 'bearer foo',
      },
      serviceName: 'orders',
    });

    const message = {
      name: 'Johnny Appleseed',
      item: 'Moleskine Notebooks',
      quantity: 2,
      price: 19.99,
      address: {
        street: '1000 Pennsylvania Ave.',
        city: 'Olympia',
        state: 'WA',
        zip: '98512',
      },
    };

    const tag = telemetry.tagEvent(message);
    telemetry.beacon('EB-TEST', message);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          tag: 'EB-TEST',
          message,
          eb_event_id: tag,
          serviceName: 'orders',
        },
      })
    );
  });
});
