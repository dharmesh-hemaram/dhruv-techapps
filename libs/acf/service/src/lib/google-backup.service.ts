import { AUTO_BACKUP, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { AcfService } from './service';

export class GoogleBackupService extends AcfService {
  static async backup(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'backup', message: true });
  }

  static async autoBackup(extensionId: string, autoBackup?: AUTO_BACKUP) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'setAlarm', message: autoBackup });
  }

  static async list(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'list', message: true });
  }

  static async listWithContent(extensionId: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'listWithContent', message: true });
  }

  static async restore(extensionId: string, id: string, name: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'restore', message: { id, name } });
  }

  static async get(extensionId: string, id: string, name: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'get', message: { id, name } });
  }

  static async delete(extensionId: string, id: string, name: string) {
    return await this.message(extensionId, { messenger: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, methodName: 'delete', message: { id, name } });
  }
}
