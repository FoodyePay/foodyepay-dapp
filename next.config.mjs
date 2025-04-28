// next.config.mjs ✅ 正确写法
import { withUnoConfig } from 'unocss/next'
import unoConfig from './uno.config.ts'

const withUno = withUnoConfig(unoConfig)

export default withUno({
  reactStrictMode: true,
})
