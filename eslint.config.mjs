import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  nextjs: true,
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  },
  ignores: [
    'migrations/**',
    '*types.ts',
    '**/*.d.ts',
    '**/importMap.js',
  ],
})
