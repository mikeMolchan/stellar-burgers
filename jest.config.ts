import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@slices$': '<rootDir>/src/services/slices/index.ts',
    '^@components$': '<rootDir>/src/components/index.ts',
    '^@ui$': '<rootDir>/src/components/ui/index.ts',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages/index.ts',
    '^@pages$': '<rootDir>/src/pages/index.ts'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }]
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/__tests__/**/*.test.tsx'
  ],
  clearMocks: true
};

export default config;