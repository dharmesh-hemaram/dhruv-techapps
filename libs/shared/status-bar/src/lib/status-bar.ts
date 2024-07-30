import { Timer } from '@dhruv-techapps/shared-util';
import { STATUS_BAR_LOCATION } from './status-bar.types';

export enum STATUS_BAR_TYPE {
  CONFIG_WAIT = 'Config wait',
  BATCH_WAIT = 'Batch wait',
  BATCH_REPEAT = 'Batch repeat',
  ACTION_WAIT = 'Action wait',
  ACTION_REPEAT = 'Action repeat',
  ADDON_RECHECK = 'Addon recheck',
}

export class StatusBar {
  private statusBar: HTMLDivElement = document.createElement('div');
  private icon: HTMLSpanElement = document.createElement('span');
  private batch: HTMLSpanElement = document.createElement('span');
  private action: HTMLSpanElement = document.createElement('span');
  private addon: HTMLSpanElement = document.createElement('span');
  private timer: HTMLSpanElement = document.createElement('span');
  private text: HTMLSpanElement = document.createElement('span');

  constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'hide';
    this.statusBar.id = 'auto-clicker-auto-fill-status';
    ['icon', 'text', 'batch', 'action', 'addon', 'timer'].forEach((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[el].className = el;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.statusBar.appendChild((this as any)[el]);
    });
  }

  public setLocation = async (location: STATUS_BAR_LOCATION) => {
    this.statusBar.className = location;
    document.body.appendChild(this.statusBar);
  };

  public async wait(text?: number | string, type?: STATUS_BAR_TYPE, name?: string | number): Promise<void> {
    this.timer.textContent = '';
    const waitTime = Timer.getWaitTime(text);
    if (!waitTime) {
      return;
    }
    switch (type) {
      case STATUS_BAR_TYPE.CONFIG_WAIT:
        this.text.textContent = 'Config';
        break;
      case STATUS_BAR_TYPE.BATCH_WAIT:
      case STATUS_BAR_TYPE.BATCH_REPEAT:
      case STATUS_BAR_TYPE.ACTION_WAIT:
        break;
      case STATUS_BAR_TYPE.ADDON_RECHECK:
        this.timer.textContent = `🔁${name} ~`;
        break;
      case STATUS_BAR_TYPE.ACTION_REPEAT:
        this.timer.textContent = `🔁${name} ~`;
        break;
      default:
        this.timer.textContent = `🔍${name} ~`;
        break;
    }

    this.timer.textContent += '🕒' + waitTime / 1000 + ' sec';
    await Timer.sleep(waitTime);
  }

  public addonUpdate(): void {
    this.addon.textContent = '❓';
    this.addon.title = 'Addon';
    this.text.textContent = '';
  }

  public actionUpdate(number: number, text: string | undefined): void {
    this.action.textContent = `🅰️${number}`;
    this.action.title = text || 'Action';
    this.addon.textContent = '';
  }

  public batchUpdate(text: string | number): void {
    this.batch.textContent = `🅱️${text}`;
    this.batch.title = 'Batch';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.text.textContent = '';
  }

  public error = (text: string): void => {
    this.icon.textContent = '❌';
    this.batch.textContent = '';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.timer.textContent = '';
    this.text.textContent = text;
  };

  public done = (): void => {
    this.icon.textContent = '✨';
    this.batch.textContent = '';
    this.action.textContent = '';
    this.addon.textContent = '';
    this.timer.textContent = '';
    this.text.textContent = 'Done';
  };
}

export class ManualStatusBar {
  private static instance: ManualStatusBar;
  private statusBar: HTMLDivElement;
  private manualContainer: HTMLUListElement = document.createElement('ul');

  private constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.id = 'auto-clicker-auto-fill-manual';

    this.manualSetup();
    document.body.appendChild(this.statusBar);
  }

  public manual = (text: string): void => {
    if (!this.manualContainer.textContent) {
      const li = document.createElement('li');
      li.textContent = '👋';
      this.manualContainer.appendChild(li);
    }
    const li = document.createElement('li');
    li.textContent = text;
    this.manualContainer.appendChild(li);
  };

  private manualSetup = (): void => {
    this.manualContainer.className = 'manual';
    this.statusBar.appendChild(this.manualContainer);
  };

  public static getInstance(): ManualStatusBar {
    if (!ManualStatusBar.instance) {
      ManualStatusBar.instance = new ManualStatusBar();
    }
    return ManualStatusBar.instance;
  }
}
