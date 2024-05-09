export type FirePageViewEventParams = {
  name?: string;
  pageTitle: string;
  pageLocation: string;
  additionalParams?: Record<string, unknown>;
};

export type FireErrorEventParams = {
  error: string;
  name?: string;
  additionalParams?: Record<string, unknown>;
};

export type FireEventParams = {
  name: string;
  params?: {
    session_id?: string;
    engagement_time_msec?: number;
    user_id?: string;
    version?: string;
    client_id?: string;
    page_title?: string;
    page_location?: string;
    location?: string;
    data?: boolean;
    error?: string;
    events?: Array<{
      name: string;
      params: Record<string, unknown>;
    }>;
  };
};
