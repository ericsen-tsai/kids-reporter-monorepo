import { CodegenConfig } from '@graphql-codegen/cli'

const schemaPath =
  process.env.NODE_ENV === 'production'
    ? 'schema.graphql'
    : '../../packages/cms/schema.graphql'

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaPath,
  documents: 'src/api/graphql/**/*.ts',
  generates: {
    '__generated__/types.ts': {
      plugins: ['typescript'],
      config: {
        maybeValue: 'T | undefined',
        inputMaybeValue: 'T | undefined',
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
          JSON: 'any',
          PasswordState: 'string',
        },
      },
    },
    '__generated__/operations.ts': {
      plugins: ['typescript-operations'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '../types.ts',
        folder: '../../../__generated__/operations',
      },
      config: {
        maybeValue: 'T | undefined',
        inputMaybeValue: 'T | undefined',
        scalars: {
          DateTime: 'string',
          JSON: 'any',
          PasswordState: 'string',
        },
      },
    },
  },
}

export default config
