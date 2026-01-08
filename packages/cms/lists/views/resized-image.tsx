import { controller } from '@keystone-6/core/fields/types/virtual/views'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import Link from 'next/link'

export const Field = ({ value }: FieldProps<typeof controller>) => {
  if (typeof value === 'object' && value !== null) {
    return (
      <FieldContainer>
        <FieldLabel>Resized Images</FieldLabel>
        <table>
          <tbody>
            {Object.entries(value).map(([k, v]) => {
              if (k === '__typename') {
                return null
              }

              return (
                <tr key={k}>
                  <td>{k.charAt(0).toUpperCase() + k.slice(1)}</td>
                  <td>
                    <Link href={v as string} target="_blank">
                      {v as string}
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </FieldContainer>
    )
  }
  return null
}
