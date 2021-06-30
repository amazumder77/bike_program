export const raxConstants = {
  retry: 3,
  httpMethodsToRetry: ['GET'],
  statusCodesToRetry: [
    [100, 199],
    [429, 429],
    [500, 599],
  ],
};

export const HQO_AUTHORIZATION_HEADER = 'hqo-authorization';
export const HQO_TRACE_ID = 'hqo-trace-id';
