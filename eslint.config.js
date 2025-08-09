import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    typescript: false,
  },
  {
    rules: {
      'no-console': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'react-dom/no-missing-button-type': 'off',
    },
  },
)
