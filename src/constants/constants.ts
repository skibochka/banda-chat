const jwtConstants = {
  secret: 'superSecurity',
  expirationTime: {
    jwt: {
      default: {
        refreshToken: '7d',
        accessToken: '2m',
      },
      keepMeLocked: {
        refreshToken: '30d',
        accessToken: '2m',
      },
    },
    redis: {
      default: {
        refreshToken: 86400, // 24h|1d
        accountVerificationToken: 600, // 10m
        passwordRecoveryToken: 600, // 10m
      },
      keepMeLocked: {
        refreshToken: 2592000, // 30d
      },
    },
  },
};

export default jwtConstants;
