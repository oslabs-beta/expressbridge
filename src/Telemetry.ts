import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

export class Telemetry {
  constructor(
    public eventId: string,
    private requestConfig: Partial<AxiosRequestConfig>
  ) {}

  public async beacon(
    tag: string,
    message: Record<string, any>
  ): Promise<void> {
    console.log('Called Telemetry Beacon');
    try {
      await axios({
        ...this.requestConfig,
        data: {
          tag,
          eventId: this.eventId,
          message,
        },
      });
    } catch (err) {
      console.log('Error calling telemetry beacon', err);
    }
  }
}
