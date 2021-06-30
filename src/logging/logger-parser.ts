const parseOutboundData = (data: string): Record<string, unknown> | string => {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export default parseOutboundData;
