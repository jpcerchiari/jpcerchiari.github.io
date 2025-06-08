
import React, { useState, useEffect } from 'react';
import { QuizData, Question, Difficulty, Player, AnsweredQuestion } from '@/types/Quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bomb } from 'lucide-react';

interface QuizSelectorProps {
  quizData: QuizData;
  players: Player[];
  onQuestionSelect: (question: Question, difficulty: Difficulty, theme: string, questionIndex: number, isBomb?: boolean) => void;
  onBack: () => void;
  bombCount: number;
  bombsUsed: number;
  answeredQuestions: AnsweredQuestion[];
}

const QuizSelector: React.FC<QuizSelectorProps> = ({ 
  quizData, 
  players, 
  onQuestionSelect, 
  onBack,
  bombCount,
  bombsUsed,
  answeredQuestions
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [activeTab, setActiveTab] = useState<string>('theme');

  // Automatically switch to difficulty tab when theme is selected
  useEffect(() => {
    if (selectedTheme && activeTab === 'theme') {
      setActiveTab('difficulty');
    }
  }, [selectedTheme, activeTab]);

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName);
    setSelectedDifficulty(''); // Reset difficulty when changing theme
  };

  const handleBackToThemes = () => {
    setSelectedTheme(''); // Clear theme selection
    setSelectedDifficulty(''); // Reset difficulty when going back
    setActiveTab('theme');
  };

  const isQuestionAnswered = (theme: string, difficulty: Difficulty) => {
    return answeredQuestions.some(
      q => q.theme === theme && q.difficulty === difficulty
    );
  };

  const wasBombQuestion = (theme: string, difficulty: Difficulty) => {
    const answered = answeredQuestions.find(
      q => q.theme === theme && q.difficulty === difficulty
    );
    return answered?.wasBomb || false;
  };

  const getRandomBombQuestion = () => {
    const allThemes = quizData.temas;
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    const difficulties: Difficulty[] = ['facil', 'medio', 'dificil', 'muitodificil', 'impossivel'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const questions = randomTheme.questoes[randomDifficulty];
    
    if (questions.length === 0) {
      // If no questions in this difficulty, try another
      return getRandomBombQuestion();
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return { 
      question: randomQuestion, 
      difficulty: randomDifficulty, 
      theme: randomTheme.nome,
      questionIndex: randomIndex
    };
  };

  const handleSelectRandomQuestion = () => {
    if (!selectedTheme || !selectedDifficulty) return;

    const shouldBeBomb = bombsUsed < bombCount && Math.random() < 0.3; // 30% chance of bomb if bombs available

    if (shouldBeBomb) {
      const { question, difficulty, theme, questionIndex } = getRandomBombQuestion();
      onQuestionSelect(question, difficulty, theme, questionIndex, true);
    } else {
      const theme = quizData.temas.find(t => t.nome === selectedTheme);
      if (!theme) return;

      const questions = theme.questoes[selectedDifficulty as Difficulty];
      if (questions.length === 0) return;

      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];
      
      onQuestionSelect(randomQuestion, selectedDifficulty as Difficulty, selectedTheme, randomIndex, false);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Médio';
      case 'dificil':
        return 'Difícil';
      case 'muitodificil':
        return 'Muito Difícil';
      case 'impossivel':
        return 'Impossível';
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Seleção de Questão
            </h1>
            <p className="text-xl text-muted-foreground">
              Escolha o tema e a dificuldade para uma questão aleatória
            </p>
            {bombCount > 0 && (
              <p className="text-sm text-orange-400 mt-2">
                💣 Bombas restantes: {bombCount - bombsUsed}
              </p>
            )}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Configurar Questão</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theme">1. Selecionar Tema</TabsTrigger>
                <TabsTrigger value="difficulty" disabled={!selectedTheme}>2. Selecionar Dificuldade</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theme" className="space-y-4">
                <div className="grid gap-3">
                  {quizData.temas.map((tema, index) => (
                    <Button
                      key={index}
                      onClick={() => handleThemeSelect(tema.nome)}
                      variant={selectedTheme === tema.nome ? "default" : "outline"}
                      className="w-full text-lg py-6"
                    >
                      {tema.nome}
                    </Button>
                  ))}
                </div>
                {selectedTheme && (
                  <div className="text-center text-green-400 font-semibold">
                    ✓ Tema selecionado: {selectedTheme}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="difficulty" className="space-y-4">
                {selectedTheme && (
                  <div className="mb-4">
                    <Button onClick={handleBackToThemes} variant="outline" className="mb-4">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar aos Temas
                    </Button>
                    <div className="text-center text-muted-foreground mb-4">
                      Tema selecionado: <span className="font-semibold text-foreground">{selectedTheme}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid gap-3">
                  {(['facil', 'medio', 'dificil', 'muitodificil', 'impossivel'] as Difficulty[]).map((difficulty) => {
                    const isAnswered = isQuestionAnswered(selectedTheme, difficulty);
                    const wasBomb = wasBombQuestion(selectedTheme, difficulty);
                    
                    return (
                      <div key={difficulty} className="relative">
                        <Button
                          onClick={() => setSelectedDifficulty(difficulty)}
                          variant={selectedDifficulty === difficulty ? "default" : "outline"}
                          className={`w-full text-lg py-6 ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isAnswered}
                        >
                          {getDifficultyLabel(difficulty)}
                          {isAnswered && ' (Respondida)'}
                        </Button>
                        {wasBomb && (
                          <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-1">
                            <Bomb className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedDifficulty && !isQuestionAnswered(selectedTheme, selectedDifficulty) && (
                  <div className="text-center text-green-400 font-semibold">
                    ✓ Dificuldade selecionada: {getDifficultyLabel(selectedDifficulty)}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {selectedTheme && selectedDifficulty && !isQuestionAnswered(selectedTheme, selectedDifficulty) && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleSelectRandomQuestion}
                  size="lg" 
                  className="text-xl px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Sortear Questão Aleatória
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSelector;
