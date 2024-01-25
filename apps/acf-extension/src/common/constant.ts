export const CONTEXT_MENU_ELEMENT_ID = 'element-mode';
export const CONTEXT_MENU_FORM_ID = 'form-mode';
export const ACTION_POPUP = 'action-popup';
export const CONTEXT_MENU_CONFIG_PAGE_ID = 'config-page-mode';
export const SANDBOX_INITIALIZED = 'sandbox-initialized';
export const PERMISSIONS = 'permissions';
export const TABS = 'tabs';

export const RADIO_CHECKBOX_NODE_NAME = /^(radio|checkbox)$/i;
export const BUTTON_FILE_SUBMIT_NODE_NAME = /^(button|file|submit)$/i;

export const getOrigin = (url: string) => {
  const pathArray = url.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + '//' + host + '/';
};
