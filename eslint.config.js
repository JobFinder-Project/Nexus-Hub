import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { 
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  
  pluginJs.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    rules: {
      // aviso se houver console.log (bom para evitar sujeira em produção)
      'no-console': 'warn', 
      
      // permite variáveis não usadas se começarem com underline (ex: _req)
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    },
    // ignorar pastas específicas
    ignores: ['node_modules/', 'dist/']
  }
];