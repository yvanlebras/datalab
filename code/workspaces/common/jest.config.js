module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': '../../babel_jest_transformer.js',
  },
};
