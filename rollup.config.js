import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

const config = (initial = false) => ({
  plugins: [
    resolve(),
    external(),
    typescript({ typescript: require('typescript') }),
    commonjs(),
    ...(initial ? [del({ targets: 'dist/*', force: true })] : [])
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
})

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'cjs',
      exports: 'named',
      dir: 'dist'
    },
    plugins: [
      external(),
      resolve(),
      typescript({ typescript: require('typescript') }),
      commonjs()
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]
  },
  {
    input: './dist/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
]
