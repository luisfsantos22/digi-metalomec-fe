import { Table } from '@mantine/core'
import { useState } from 'react'
import ContainerCard from '../../../Card/ContainerCard'
import SearchInput from '../../../Input/SearchInput'
import Row from '../../../Row/Row'
import FormInput from '../../../Input/FormInput'
import FormDropdown from '../../../Dropdown/FormDropdown'
import ClearAllFiltersButton from '../../../Button/ClearAllFiltersButton'
import Text from '../../../Text/Text'

const EmployeesSection = () => {
  // States for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  // Mock data for dropdowns
  const roleChoices = [
    { label: 'Mecânico', value: 'mechanic' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Gestor', value: 'manager' },
  ]

  const departmentChoices = [
    { label: 'Oficina', value: 'workshop' },
    { label: 'Administração', value: 'admin' },
    { label: 'Vendas', value: 'sales' },
  ]

  // Clear all filters
  const handleClearFilters = () => {
    setNameFilter('')
    setRoleFilter('')
    setDepartmentFilter('')
  }

  // Filter employees based on filter values
  const getFilteredEmployees = () => {
    return employees.filter((emp) => {
      const nameMatch =
        !nameFilter || emp.name.toLowerCase().includes(nameFilter.toLowerCase())
      const roleMatch =
        !roleFilter || emp.role.toLowerCase().includes(roleFilter)
      const departmentMatch =
        !departmentFilter ||
        emp.department.toLowerCase().includes(departmentFilter)

      return nameMatch && roleMatch && departmentMatch
    })
  }

  // Mock employee data
  const employees = [
    {
      id: 1,
      name: 'João Silva',
      role: 'Mecânico',
      department: 'Oficina',
      email: 'joao@example.com',
    },
    {
      id: 2,
      name: 'Maria Santos',
      role: 'Supervisor',
      department: 'Administração',
      email: 'maria@example.com',
    },
    // Add more mock data as needed
  ]

  return (
    <ContainerCard
      padding="lg:p-8 p-4"
      styles="flex flex-col gap-4 w-full rounded-xl"
    >
      {/* Search Bar */}
      <SearchInput
        query={searchQuery}
        setQuery={setSearchQuery}
        placeholder="Pesquisar funcionários..."
        label="Pesquisar"
        data={employees.map((emp) => ({
          ...emp,
          searchValue: `${emp.name} - ${emp.role} (${emp.department})`,
        }))}
        setSelectedObj={(emp) => {
          if (emp) {
            setNameFilter(emp.name)
            setRoleFilter(emp.role.toLowerCase())
            setDepartmentFilter(emp.department.toLowerCase())
          }
        }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <Text
          text="Filtros"
          styles="text-digiblack1624-semibold"
        />
        <Row>
          <FormInput
            placeholder="Nome do funcionário"
            query={nameFilter}
            setQuery={setNameFilter}
            label="Nome"
          />
          <FormDropdown
            choices={roleChoices}
            selectedValue={roleFilter}
            setSelectedValue={setRoleFilter}
            label="Cargo"
            placeholder="Selecionar cargo"
          />
          <FormDropdown
            choices={departmentChoices}
            selectedValue={departmentFilter}
            setSelectedValue={setDepartmentFilter}
            label="Departamento"
            placeholder="Selecionar departamento"
          />
          <ClearAllFiltersButton
            onClick={handleClearFilters}
            id="clear-employee-filters"
          />
        </Row>
      </div>

      {/* Table */}
      <Table
        striped
        withTableBorder
        highlightOnHoverColor="bg-digiorange/10"
      >
        <Table.Thead className="bg-digiorange">
          <Table.Tr>
            <Table.Th className="text-digibrown1624-bold">Nome</Table.Th>
            <Table.Th className="text-digibrown1624-bold">Cargo</Table.Th>
            <Table.Th className="text-digibrown1624-bold">
              Departamento
            </Table.Th>
            <Table.Th className="text-digibrown1624-bold">Email</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {getFilteredEmployees().map((employee) => (
            <Table.Tr key={employee.id}>
              <Table.Td>
                <Text
                  text={employee.name}
                  styles="text-digibrown1624-normal"
                />
              </Table.Td>
              <Table.Td>
                <Text
                  text={employee.role}
                  styles="text-digibrown1624-normal"
                />
              </Table.Td>
              <Table.Td>
                <Text
                  text={employee.department}
                  styles="text-digibrown1624-normal"
                />
              </Table.Td>
              <Table.Td>
                <Text
                  text={employee.email}
                  styles="text-digibrown1624-normal"
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ContainerCard>
  )
}

export default EmployeesSection
