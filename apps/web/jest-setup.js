import '@testing-library/jest-dom';

jest.mock('better-auth/react', () => ({
  createAuthClient: jest.fn(() => ({
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn(() => ({ data: { user: { id: "1" } }, isPending: false }))
  })),
}));

jest.mock('better-auth/client/plugins', () => ({
  emailOTPClient: jest.fn(),
}));
