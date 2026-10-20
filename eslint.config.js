import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Bảng cảnh SVG minh họa từ: nhiều khối dựng nhỏ dùng nội bộ cùng bảng SCENES xuất ra.
    // Cố ý để chung một file nên tắt luật HMR (chỉ ảnh hưởng tải lại nóng khi dev) cho đúng file này.
    files: ['src/components/wordVisualScenes.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  }
);
