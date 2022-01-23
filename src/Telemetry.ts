import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

export type TelemetryConfig = Partial<AxiosRequestConfig> & {
  serviceName: string;
};

export class Telemetry {
  constructor(public eventId: string, private requestConfig: TelemetryConfig) {}

  public async beacon(
    tag: string,
    message: Record<string, any>
  ): Promise<void> {
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
