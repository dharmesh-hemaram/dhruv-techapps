import { ManifestRequest, ManifestResult } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class ManifestService extends CoreService {
  static async values(extensionId: string, keys: string[]) {
    return await this.message<ManifestRequest, ManifestResult>(extensionId, { messenger: 'manifest', methodName: 'values', message: keys });
  }

  static async value(extensionId: string, key: string) {
    return await this.message<ManifestRequest, ManifestResult>(extensionId, { messenger: 'manifest', methodName: 'value', message: key });
  }
}
