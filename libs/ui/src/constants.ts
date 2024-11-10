// Application Links
export const APP_LINK = {
  DOCS: 'https://getautoclicker.com/docs/4.x/',
  BLOG: 'https://blog.getautoclicker.com/',
  CONFIGS: 'https://gist.github.com/dharmesh-hemaram',
  TEST: 'https://test.getautoclicker.com/',
  ISSUES: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/issues',
  DISCUSSIONS: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/discussions',
};
// Application Languages
export const APP_LANGUAGES = ['en', 'ar', 'de', 'es', 'fi', 'fr', 'id', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'sv', 'vi', 'zh_CN'];

export const SPONSORS = [
  {
    id: 'saroj-kitchen',
    link: 'https://www.youtube.com/@sarojskitchen',
    title: "Saroj's Kitchen",
    image: 'https://yt3.googleusercontent.com/ytc/AL5GRJXXSNx_TgWygPPxifjLMWl6De3YVmGwHAjOfhztgVA=s176-c-k-c0x00ffffff-no-rj',
  },
];

export const NO_EXTENSION_ERROR = ['Could not establish connection. Receiving end does not exist.', "Cannot read properties of undefined (reading 'sendMessage')"];
// Web store links
export const EDGE_WEB_STORE = 'https://microsoftedge.microsoft.com/addons/detail/';
export const CHROME_WEB_STORE = 'https://chrome.google.com/webstore/detail/';

const message = encodeURIComponent('Fill input field or click button or link anything anywhere. easy configure in few steps and work like PRO #AutoClickerAutoFill');
const webStore = CHROME_WEB_STORE;
const extensionId = process.env[`NX_PUBLIC_CHROME_EXTENSION_ID`];
const url = encodeURIComponent(webStore + extensionId);
// Social
export const SOCIAL_LINKS = {
  YOUTUBE: 'https://www.youtube.com/@autoclickerautofill/',
  INSTAGRAM: 'https://www.instagram.com/dharmeshhemaram/',
  DISCORD: 'https://discord.gg/ubMBeX3',
  GOOGLE_GROUP: 'https://groups.google.com/g/auto-clicker-autofill',
  TWITTER: `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
  GITHUB: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill',
  FACEBOOK: `https://www.facebook.com/sharer.php?u=${url}&quote=${message}`,
  WHATSAPP: `https://wa.me/?text=${message}%5Cn%20${url}`,
  RATE_US: `https://chromewebstore.google.com/detail/${extensionId}/reviews`,
};
