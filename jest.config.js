module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
     "^axios$": "axios/dist/node/axios.cjs"
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
};
