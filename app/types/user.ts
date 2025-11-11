/**
 * Interface para representar os dados de salário de acordo com o nível de experiência.
 */
interface ISalary {
  junior: string;
  pleno: string;
  senior: string;
}

/**
 * Interface principal para o arquivo de dados do usuário/perfil.
 */
export interface IUserProfile {
  id: string;
  userName: string;
  userPhoto: string;
  profession: string;
  description: string;
  aiImage: string;
  salary: ISalary;
  tags: string[];
  courseStartDate: string;
  createdAt: string;
  isNew?: boolean;
}

export interface IUserResponse {
  id: string;
  userName: string;
  userPhoto: string;
  profession: string;
  createdAt: string;
}

// Exemplo de uso:
/*
const meuPerfil: IUserProfile = {
  id: 1,
  userName: "João Silva",
  userPhoto: "...",
  profession: "...",
  description: "...",
  aiImage: "...",
  salary: {
    junior: "R$3.000 a R$6.000",
    pleno: "R$6.000 a R$12.000",
    senior: "R$12.000 a R$20.000+"
  },
  tags: ["ROADMAP", "BACKLOG", "FEEDBACK", "DESENVOLVIMENTO ÁGIL"],
  courseStartDate: "2025-02-09",
  createdAt: "2025-11-06T14:30:00Z"
};
*/