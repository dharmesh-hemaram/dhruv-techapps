import { GoogleAnalyticsBackground } from '@dhruv-techapps/google-analytics';
import { API_SECRET, MEASUREMENT_ID, VARIANT } from '../common/environments';

export const googleAnalytics = new GoogleAnalyticsBackground(MEASUREMENT_ID, API_SECRET, VARIANT === 'LOCAL');
