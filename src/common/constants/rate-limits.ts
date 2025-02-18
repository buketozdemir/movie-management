const RATE_LIMITS = {
  LOGIN: [
    {
      ttl: 60, // 1 minute
      limit: 30,
      keyMap: {
        headers: [],
        body: ['userName'],
      },
    },
    {
      ttl: 120, // 2 minutes
      limit: 50,
      keyMap: {
        headers: [],
        body: ['userName'],
      },
    },
  ],
  REFRESH_TOKEN: [
    {
      ttl: 600, // 10 minutes
      limit: 20,
    },
  ],
  TEMP_USER: [
    {
      ttl: 60, // 1 minute
      limit: 30,
    },
  ],
};

export default RATE_LIMITS;
