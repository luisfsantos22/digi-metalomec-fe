import { Table } from '@mantine/core'
import React from 'react'

type TableRowProps = {
  children: React.ReactNode
  customStyles?: string
}

const TableRow = (props: TableRowProps) => {
  const { children, customStyles = 'text-digibrown1624-normal' } = props

  return <Table.Td className={customStyles}>{children}</Table.Td>
}

export default TableRow
