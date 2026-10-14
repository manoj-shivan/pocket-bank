/**
 * Converts an array of objects into a CSV string and triggers a download.
 * Headers are the keys of the first object; values are converted with toString().
 */
export function downloadCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          const stringValue =
            value === null || value === undefined ? '' : String(value)
          // Escape quotes and wrap values containing commas or quotes
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    ),
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
