// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    'form-container': 'w-full max-w-md p-6 space-y-4 bg-zinc-800 rounded-xl shadow-xl',
    'form-group': 'flex flex-col space-y-1',
    'form-label': 'text-sm font-medium text-white',
    'input-base': 'w-full py-2 px-4 bg-zinc-800 text-white rounded placeholder:text-gray-400 border border-zinc-700 focus:border-purple-500',
    'btn-primary': 'w-full py-2 text-white rounded bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90',
  },
  safelist: ['input-base', 'btn-primary', 'form-container', 'rounded', 'w-full', 'text-white'],
})




