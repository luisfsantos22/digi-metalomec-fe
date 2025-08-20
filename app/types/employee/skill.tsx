type Skill = {
  id: string
  name: string
  description?: string
}

type EmployeeSkill = Skill & {
  level: 'Beginner' | 'Intermediate' | 'Expert'
  acquiredAt?: Date | null
}

export type { Skill, EmployeeSkill }
