type Skill = {
  id: string
  name: string
  description?: string
}

type EmployeeSkill = Skill & {
  level: string
  acquiredAt?: Date | null
}

export type { Skill, EmployeeSkill }
