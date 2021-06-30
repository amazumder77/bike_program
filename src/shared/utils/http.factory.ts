import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as rax from 'retry-axios';

export const HttpFactory = (config?: AxiosRequestConfig, raxConfig?: rax.RetryConfig): AxiosInstance => {
  const axiosClient = Axios.create(config);

  if (raxConfig) {
    axiosClient.defaults.raxConfig = {
      instance: axiosClient,
      ...raxConfig,
    };
    rax.attach(axiosClient);
  }

  axiosClient.interceptors.response.use(
    (response: AxiosResponse): Promise<AxiosResponse> => Promise.resolve(response?.data),
    (error) => {
      return Promise.reject(error);
    },
  );

  return axiosClient;
};
