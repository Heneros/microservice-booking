module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  testMatch: ['**/*.spec.ts'],
  roots: ['<rootDir>/apps', '<rootDir>/libs'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: './coverage/unit',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/app/common$': '<rootDir>/libs/common/src',
    '^@/app/common/(.*)$': '<rootDir>/libs/common/src/$1',
    '^@/api-gateway$': '<rootDir>/apps/api-gateway/src',
    '^@/api-gateway/(.*)$': '<rootDir>/apps/api-gateway/src/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePaths: ['<rootDir>', '<rootDir>/node_modules'],

  testPathIgnorePatterns: ['/node_modules/', 'ignore/', 'upload'],
};
