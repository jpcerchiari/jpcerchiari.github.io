
export interface Question {
  pergunta: string;
  resposta: string;
  resposta2?: string;
  resposta3?: string;
  pontos: number;
  imagem?: string;
  imagemresposta?: string;
  imagemresposta2?: string;
  imagemresposta3?: string;
}

export interface Theme {
  nome: string;
  questoes: {
    facil: Question[];
    medio: Question[];
    dificil: Question[];
    muitodificil: Question[];
    impossivel: Question[];
  };
}

export interface QuizData {
  temas: Theme[];
}

export interface Player {
  nome: string;
  pontos: number;
}

export interface PlayersData {
  jogadores: Player[];
}

export interface GameConfig {
  bombCount: number;
  bombsUsed: number;
}

export type Difficulty = 'facil' | 'medio' | 'dificil' | 'muitodificil' | 'impossivel';

export interface AnsweredQuestion {
  theme: string;
  difficulty: Difficulty;
  questionIndex: number;
  wasBomb: boolean;
}
