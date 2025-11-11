// 1. Defina o tipo para a estrutura interna do objeto 'salary'
export type SalaryRange = {
  junior: string;
  pleno: string;
  senior: string;
};

// 2. Defina o tipo para a estrutura de dados de CADA PROFISSÃO
export type ProfessionMockData = {
  description: string;
  salary: SalaryRange;
  tags: string[];
};


// Função para gerar dados mockados baseados na profissão
 export const generateMockData = (profession: string) => {
    const professionData: { [key: string]: ProfessionMockData } = {
      "Cientista de Dados / I.A": {
        description: "Especialista em análise e interpretação de grandes volumes de dados, utilizando técnicas de machine learning, deep learning e inteligência artificial para gerar insights estratégicos e soluções inovadoras.",
        salary: { junior: "R$ 6.000", pleno: "R$ 12.000", senior: "R$ 22.000" },
        tags: ["Python", "Machine Learning", "TensorFlow", "Big Data", "IA", "Estatística", "SQL", "R"],
      },
      "Programador Backend": {
        description: "Desenvolve e mantém a lógica de servidor, APIs e bancos de dados. Responsável por criar sistemas robustos, escaláveis e seguros que processam e armazenam dados de forma eficiente.",
        salary: { junior: "R$ 4.500", pleno: "R$ 9.000", senior: "R$ 16.000" },
        tags: ["Node.js", "Java", "APIs REST", "SQL", "Docker", "Microservices", "AWS" ,"Python"],
      },
      "Programador Frontend": {
        description: "Cria interfaces interativas e responsivas que os usuários veem e interagem. Trabalha com frameworks modernos para desenvolver experiências web dinâmicas e acessíveis.",
        salary: { junior: "R$ 4.000", pleno: "R$ 8.000", senior: "R$ 14.000" },
        tags: ["React", "TypeScript", "CSS", "JavaScript", "Next.js", "TailwindCSS", "UX/UI", "Acessibilidade"],
      },
      "QA": {
        description: "Garante a qualidade do software através de testes manuais e automatizados. Identifica bugs, valida requisitos e assegura que o produto final atenda aos padrões de excelência.",
        salary: { junior: "R$ 3.500", pleno: "R$ 7.000", senior: "R$ 12.000" },
        tags: ["Testes", "Selenium", "Automação", "CI/CD", "Bug Tracking", "JIRA", "Cypress"],
      },
      "Gestão de Produtos": {
        description: "Profissional que colabora com a equipe para planejar e organizar o desenvolvimento. É quem ajusta prioridades, escuta os clientes, analisa feedbacks, define os próximos passos e prepara apresentações para os líderes da empresa.",
        salary: { junior: "R$ 5.000", pleno: "R$ 10.000", senior: "R$ 18.000" },
        tags: ["Backlog", "Feedback", "Equipe", "Estratégia", "Roadmap", "Scrum", "Métricas", "Stakeholders"],
      },
      "DevOps": {
        description: "Automatiza processos de desenvolvimento e infraestrutura, implementando práticas de integração e entrega contínua. Garante ambientes estáveis, seguros e escaláveis na nuvem.",
        salary: { junior: "R$ 5.500", pleno: "R$ 11.000", senior: "R$ 20.000" },
        tags: ["AWS", "Kubernetes", "CI/CD", "Linux", "Terraform", "Docker", "Pipelines"],
      }
    };

    // Retorna dados da profissão ou dados genéricos se não encontrar
    return professionData[profession] || {
      description: "Profissional especializado em tecnologia, contribuindo para o desenvolvimento de soluções inovadoras e transformação digital das empresas.",
      salary: { junior: "R$ 4.000", pleno: "R$ 8.000", senior: "R$ 14.000" },
      tags: ["Tecnologia", "Inovação", "Desenvolvimento", "Software", "Digital", "Soluções", "Transformação"],
    };
  };