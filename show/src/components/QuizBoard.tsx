
import React, { useState } from 'react';
import { QuizData, Question, Difficulty, Player } from '@/types/Quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionCard from './QuestionCard';
import PlayersList from './PlayersList';
import { ArrowLeft } from 'lucide-react';

interface QuizBoardProps {
  quizData: QuizData;
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onBack: () => void;
}

const QuizBoard: React.FC<QuizBoardProps> = ({ quizData, players, onUpdatePlayers, onBack }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: Question;
    difficulty: Difficulty;
  } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const handleQuestionSelect = (question: Question, difficulty: Difficulty) => {
    setSelectedQuestion({ question, difficulty });
  };

  const handleAnswer = (points: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].pontos += points;
    onUpdatePlayers(updatedPlayers);
    
    // Move to next player
    setCurrentPlayer((prev) => (prev + 1) % players.length);
    setSelectedQuestion(null);
  };

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setSelectedQuestion(null)} variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Tabuleiro
            </Button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary">
                Vez de: {players[currentPlayer]?.nome}
              </h2>
            </div>
          </div>
          
          <QuestionCard
            question={selectedQuestion.question}
            difficulty={selectedQuestion.difficulty}
            onAnswer={handleAnswer}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Show da Macacada
            </h1>
            <p className="text-xl text-muted-foreground">
              Vez de: <span className="font-bold text-primary">{players[currentPlayer]?.nome}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid gap-6">
              {quizData.temas.map((tema, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {tema.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {(['facil', 'medio', 'dificil', 'muitodificil', 'impossivel'] as Difficulty[]).map((difficulty) => (
                        <div key={difficulty} className="space-y-2">
                          <h4 className="text-center font-semibold capitalize">{difficulty}</h4>
                          {tema.questoes[difficulty].map((question, qIndex) => (
                            <Button
                              key={qIndex}
                              onClick={() => handleQuestionSelect(question, difficulty)}
                              className={`w-full h-16 text-lg font-bold`}
                            >
                              {question.pontos} pts
                            </Button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <PlayersList players={players} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBoard;
