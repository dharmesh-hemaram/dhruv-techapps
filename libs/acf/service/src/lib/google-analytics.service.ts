import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { AcfService } from './service';

export class GoogleAnalyticsService extends AcfService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fireEvent(extensionId: string, name: string, params?: Record<string, unknown>) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_ANALYTICS, methodName: 'fireEvent', message: { name, params } });
  }

  static async firePageViewEvent(extensionId: string, pageTitle: string, pageLocation: string, name?: string, additionalParams?: Record<string, unknown>) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_ANALYTICS, methodName: 'firePageViewEvent', message: { pageTitle, pageLocation, name, additionalParams } });
  }

  static async fireErrorEvent(extensionId: string, name: string, error: string, additionalParams?: Record<string, unknown>) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_ANALYTICS, methodName: 'fireErrorEvent', message: { error, name, additionalParams } });
  }
}
