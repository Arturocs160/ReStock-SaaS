module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^better-auth/node$': '<rootDir>/src/__tests__/mocks/betterAuthNode.ts',
    '^better-auth$': '<rootDir>/src/__tests__/mocks/betterAuthMock.ts',
    '^better-auth/plugins$': '<rootDir>/src/__tests__/mocks/betterAuthPluginsMock.ts',
    '^@better-auth/redis-storage$': '<rootDir>/src/__tests__/mocks/redisStorageMock.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        isolatedModules: true,
      },
    }],
  },
};