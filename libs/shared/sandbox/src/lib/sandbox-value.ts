import { Sandbox } from './sandbox';

export class SandboxValue {
  static async getFuncValue(value: string) {
    const result = await Sandbox.sandboxEval(value.replace(/^Func::/gi, ''));
    return result;
  }
}
