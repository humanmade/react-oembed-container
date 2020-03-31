module.exports = {
  'extends': 'humanmade',
  'plugins': [
    'jest'
  ],
  'env': {
    'browser': true,
    'jest/globals': true
  },
  'rules': {
    'arrow-parens': [ 'error', 'always' ],
    'semi': [ 'error', 'always' ],
    'react/jsx-filename-extension': [ 'off' ],
    'import/no-extraneous-dependencies': [ 'error', {
      'devDependencies': [ 'test/**/*.js', 'stories/**/*.js', '.storybook/**/*.js' ]
    } ],
    'jest/consistent-test-it': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/valid-expect': 'error',
    'jest/valid-expect-in-promise': 'error'
  }
};
