import axios from 'axios';
import { v4 } from 'uuid';
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

    const eventId = v4();
    const telemetry = new Telemetry(eventId, {
      url: 'foo.com/telemetry',
      method: 'post',
      headers: {
        Authorization: 'bearer foo',
      },
      serviceName: 'orders',
    });

    expect(telemetry.eb_event_id).toBeDefined();

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

    telemetry.beacon('EB-TEST', message);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          tag: 'EB-TEST',
          message,
          eb_event_id: eventId,
          serviceName: 'orders',
        },
      })
    );
  });
});
