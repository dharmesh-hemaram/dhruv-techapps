type NavigationStep = {
  type: 'navigate';
  url: string;
};

type SetViewportStep = {
  type: 'setViewport';
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
};
type ChangeStep = {
  target: string;
  type: 'change';
  selectors: Array<Array<string>>;
  value: string;
};

type ClickStep = {
  target: string;
  type: 'click' | 'doubleClick';
  selectors: Array<Array<string>>;
  offsetY: number;
  offsetX: number;
};

type KeyStep = {
  target: string;
  type: 'keyDown' | 'keyUp';
  key: string;
};

type AssertedEvents = {
  type: string;
  url: string;
  title: string;
};

export type Step = (NavigationStep | SetViewportStep | ChangeStep | ClickStep | KeyStep) & { assertedEvents?: Array<AssertedEvents>; timeout: number };
export type Recording = {
  title: string;
  steps: Array<Step>;
};
