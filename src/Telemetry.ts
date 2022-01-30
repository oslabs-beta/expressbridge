import axios from 'axios';
import { v4 } from 'uuid';
import { AxiosRequestConfig } from 'axios';

export type TelemetryConfig = Partial<AxiosRequestConfig> & {
  serviceName: string;
};

export class Telemetry {
  private eb_event_id: string;

  constructor(private requestConfig: TelemetryConfig) {}

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

  public tagEvent(event: Record<string, any>): string {
    const { body, detail, Records } = event;
    let payload = body ?? detail ?? Records;

    let tag = v4();
    if (Array.isArray(payload)) {
      for (const record of payload) {
        tag = record.eb_event_id || tag;
        record.eb_event_id = tag;
      }
    } else if (payload) {
      payload = typeof payload === 'string' ? JSON.parse(payload) : payload;
      tag = payload.eb_event_id || tag;
      payload.eb_event_id = tag;
      event[body ? 'body' : 'detail'] = payload;
    } else {
      tag = event.eb_event_id || tag;
      event.eb_event_id = tag;
    }

    this.eb_event_id = tag;

    return tag;
  }
}
