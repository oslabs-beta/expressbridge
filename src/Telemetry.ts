import axios from 'axios';
import { v4 } from 'uuid';
import { AxiosRequestConfig } from 'axios';

export type TelemetryConfig = Partial<AxiosRequestConfig> & {
  serviceName: string;
};

export class Telemetry {
  constructor(
    public eb_event_id: string,
    private requestConfig: TelemetryConfig
  ) {}

  public async beacon(
    tag: string,
    message: Record<string, any>
  ): Promise<void> {
    try {
      const { serviceName, ...requestConfig } = this.requestConfig;
      await axios({
        ...requestConfig,
        data: {
          tag,
          eb_event_id: this.eb_event_id,
          serviceName,
          message,
        },
      });
    } catch (err) {
      console.log('Error calling telemetry beacon', err);
    }
  }

  public tagEvent(event: Record<string, any>): Record<string, any> {
    const { body, detail, Records } = event;
    let payload = body ?? detail ?? Records;

    const tag = v4();
    if (Array.isArray(payload)) {
      for (const record of payload) {
        record.eb_event_id = record.eb_event_id || tag;
      }
    } else {
      payload = typeof payload === 'string' ? JSON.parse(payload) : payload;
      payload.eb_event_id = payload.eb_event_id || tag;
    }
    return event;
  }
}
