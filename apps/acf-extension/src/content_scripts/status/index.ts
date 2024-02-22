export class StatusBar {
  private static instance: StatusBar;
  private statusBar: HTMLDivElement = document.createElement('div');
  private icon: HTMLSpanElement = document.createElement('span');
  private batch: HTMLSpanElement = document.createElement('span');
  private action: HTMLSpanElement = document.createElement('span');
  private addon: HTMLSpanElement = document.createElement('span');
  private timer: HTMLSpanElement = document.createElement('span');
  private text: HTMLSpanElement = document.createElement('span');

  private constructor() {
    this.statusBar = document.createElement('div');
    this.statusBar.id = 'auto-clicker-auto-fill-status';

    ['icon', 'text', 'batch', 'action', 'addon', 'timer'].forEach((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[el].className = el;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.statusBar.appendChild((this as any)[el]);
    });
    document.body.appendChild(this.statusBar);
  }

  public wait(type: string, text: number, name: string | number): void {
    this.timer.textContent = '';
    switch (type) {
      case 'Config wait':
        this.text.textContent = 'Config';
        break;
      case 'Batch wait':
      case 'Batch repeat':
      case 'Action wait':
        break;
      case 'Addon recheck':
        this.timer.textContent = `🔁${name} ~`;
        break;
      case 'Action repeat':
        this.timer.textContent = `🔁${name} ~`;
        break;
      default:
        this.timer.textContent = `🔍${name} ~`;
        break;
    }

    this.timer.textContent += '🕒' + text / 1000 + ' sec';
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

  public static getInstance(): StatusBar {
    if (!StatusBar.instance) {
      StatusBar.instance = new StatusBar();
    }
    return StatusBar.instance;
  }
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
