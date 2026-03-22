export interface NormalizedHttpResponse {
  detail: string;
  status: number;
  module: string;
  type: string;
  title: string;
  instance: string;
}

type apiStatus = 'loading' | 'success' | 'error' | undefined;

export interface ServiceApiStatus {
  normalizedSarifHttpResponse?: Partial<NormalizedHttpResponse>;
  status: apiStatus;
}
