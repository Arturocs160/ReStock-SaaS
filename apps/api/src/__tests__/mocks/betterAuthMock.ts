export const betterAuth = () => {
  return {
    api: {
      getSession: jest.fn(),
    },
  };
};
