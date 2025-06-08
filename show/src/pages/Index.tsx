import React, { useState } from 'react';
import { QuizData, PlayersData, Player, Question, Difficulty, GameConfig, AnsweredQuestion } from '@/types/Quiz';
import FileUpload from '@/components/FileUpload';
import QuizSelector from '@/components/QuizSelector';
import QuestionDisplay from '@/components/QuestionDisplay';
import BombConfig from '@/components/BombConfig';
import PlayersList from '@/components/PlayersList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import sampleQuestions from '@/data/sampleQuestions.json';

type GameState = 'setup' | 'bombConfig' | 'selection' | 'question';

const Index = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameConfig, setGameConfig] = useState<GameConfig>({ bombCount: 0, bombsUsed: 0 });
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: Question;
    difficulty: Difficulty;
    theme: string;
    questionIndex: number;
    isBomb: boolean;
  } | null>(null);

  const handleQuizLoad = (data: QuizData) => {
    setQuizData(data);
  };

  const handlePlayersLoad = (data: PlayersData) => {
    setPlayers(data.jogadores.map(player => ({ ...player, pontos: player.pontos || 0 })));
  };

  const handleUseSampleData = () => {
    setQuizData(sampleQuestions as QuizData);
  };

  const startBombConfig = () => {
    if (quizData && players.length > 0) {
      setGameState('bombConfig');
    } else {
      alert('Por favor, carregue os dados do quiz e dos jogadores antes de começar.');
    }
  };

  const handleBombConfigComplete = (bombCount: number) => {
    setGameConfig({ bombCount, bombsUsed: 0 });
    setAnsweredQuestions([]);
    setGameState('selection');
  };

  const handleQuestionSelect = (question: Question, difficulty: Difficulty, theme: string, questionIndex: number, isBomb: boolean = false) => {
    setCurrentQuestion({ question, difficulty, theme, questionIndex, isBomb });
    setGameState('question');
  };

  const handleQuestionAnswered = () => {
    if (currentQuestion) {
      const newAnsweredQuestion: AnsweredQuestion = {
        theme: currentQuestion.theme,
        difficulty: currentQuestion.difficulty,
        questionIndex: currentQuestion.questionIndex,
        wasBomb: currentQuestion.isBomb
      };
      
      setAnsweredQuestions(prev => [...prev, newAnsweredQuestion]);
      
      if (currentQuestion.isBomb) {
        setGameConfig(prev => ({ ...prev, bombsUsed: prev.bombsUsed + 1 }));
      }
    }
  };

  const handleBackToSelection = () => {
    setCurrentQuestion(null);
    setGameState('selection');
  };

  const handleBackToSetup = () => {
    setGameState('setup');
    setCurrentQuestion(null);
    setGameConfig({ bombCount: 0, bombsUsed: 0 });
    setAnsweredQuestions([]);
  };

  const handleBackToBombConfig = () => {
    setGameState('bombConfig');
  };

  if (gameState === 'question' && currentQuestion && quizData) {
    return (
      <QuestionDisplay
        question={currentQuestion.question}
        difficulty={currentQuestion.difficulty}
        players={players}
        onUpdatePlayers={setPlayers}
        onBack={handleBackToSelection}
        isBomb={currentQuestion.isBomb}
        onQuestionAnswered={handleQuestionAnswered}
      />
    );
  }

  if (gameState === 'selection' && quizData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-3">
            <QuizSelector
              quizData={quizData}
              players={players}
              onQuestionSelect={handleQuestionSelect}
              onBack={handleBackToBombConfig}
              bombCount={gameConfig.bombCount}
              bombsUsed={gameConfig.bombsUsed}
              answeredQuestions={answeredQuestions}
            />
          </div>
          <div className="lg:col-span-1">
            <PlayersList players={players} />
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'bombConfig') {
    return (
      <BombConfig
        onConfigComplete={handleBombConfigComplete}
        onBack={handleBackToSetup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img
           src="../../logo.webp" 
           alt="Show da Macacada"
           className='w-[50%] mx-auto mb-4'
           />
          <p className="text-xl text-muted-foreground">
            Carregue seus arquivos JSON e comece a jogar!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Dados do Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {!quizData ? (
                <div className="space-y-4">
                  <FileUpload
                    onFileLoad={handleQuizLoad}
                    accept=".json"
                    title="Carregar Questões"
                    description="Arquivo JSON com temas e questões"
                  />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">ou</p>
                    <Button onClick={handleUseSampleData} variant="outline">
                      Usar Dados de Exemplo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-green-400 text-lg font-semibold">✓ Quiz carregado!</div>
                  <p className="text-sm text-muted-foreground">
                    {quizData.temas.length} tema(s) disponível(eis)
                  </p>
                  <Button onClick={() => setQuizData(null)} variant="outline" size="sm">
                    Carregar outro arquivo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Lista de Jogadores</CardTitle>
            </CardHeader>
            <CardContent>
              {players.length === 0 ? (
                <FileUpload
                  onFileLoad={handlePlayersLoad}
                  accept=".json"
                  title="Carregar Jogadores"
                  description="Arquivo JSON com lista de jogadores"
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-green-400 text-lg font-semibold">✓ Jogadores carregados!</div>
                  <p className="text-sm text-muted-foreground">
                    {players.length} jogador(es): {players.map(p => p.nome).join(', ')}
                  </p>
                  <Button onClick={() => setPlayers([])} variant="outline" size="sm">
                    Carregar outros jogadores
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {quizData && players.length > 0 && (
          <div className="text-center">
            <Button onClick={startBombConfig} size="lg" className="text-xl px-8 py-4">
              Configurar Jogo e Começar!
            </Button>
          </div>
        )}

        <div className="mt-12 bg-card/70 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Formato dos Arquivos JSON:</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Questões (quiz.json):</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "temas": [
    {
      "nome": "História",
      "questoes": {
        "facil": [
          {
            "pergunta": "Pergunta aqui?",
            "resposta": "Resposta aqui",
            "resposta2": "Resposta opcional aqui",
            "resposta3": "Resposta opcional aqui",
            "pontos": 10,
            "imagem": "url_opcional",
            "imagemresposta": "url_opcional",
            "imagemresposta2": "url_opcional",
            "imagemresposta3": "url_opcional"
          }
        ],
        "medio": [...],
        "dificil": [...],
        "muitodificil": [...],
        "impossivel": [...]
      }
    }
  ]
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Jogadores (players.json):</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "jogadores": [
    {
      "nome": "João",
      "pontos": 0
    },
    {
      "nome": "Maria",
      "pontos": 0
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
