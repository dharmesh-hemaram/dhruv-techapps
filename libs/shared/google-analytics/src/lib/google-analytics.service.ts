import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from './google-analytics.constant';

export class GoogleAnalyticsService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fireEvent(name: string, params?: Record<string, unknown>) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'fireEvent', message: { name, params } });
  }

  static async firePageViewEvent(pageTitle: string, pageLocation: string, name?: string, additionalParams?: Record<string, unknown>) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'firePageViewEvent', message: { pageTitle, pageLocation, name, additionalParams } });
  }

  static async fireErrorEvent(name: string, error: string, additionalParams?: Record<string, unknown>) {
    return await this.message({ messenger: RUNTIME_MESSAGE_GOOGLE_ANALYTICS, methodName: 'fireErrorEvent', message: { error, name, additionalParams } });
  }
}
