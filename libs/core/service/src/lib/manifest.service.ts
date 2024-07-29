import { ManifestRequest, ManifestResult } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class ManifestService extends CoreService {
  static async values(keys: string[]) {
    return await this.message<ManifestRequest, ManifestResult>({ messenger: 'manifest', methodName: 'values', message: keys });
  }

  static async value(key: string) {
    return await this.message<ManifestRequest, ManifestResult>({ messenger: 'manifest', methodName: 'value', message: key });
  }
}
