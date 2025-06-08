
import React, { useState } from 'react';
import { Question } from '@/types/Quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  difficulty: string;
  onAnswer: (points: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, difficulty, onAnswer }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleCorrectAnswer = () => {
    onAnswer(question.pontos);
    setAnswered(true);
  };

  const handleWrongAnswer = () => {
    onAnswer(0);
    setAnswered(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Pergunta</CardTitle>
          <div className={`px-3 py-1 rounded-full text-white text-sm`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} - {question.pontos} pts
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium">{question.pergunta}</div>
        
        {question.imagem && (
          <div className="flex justify-center">
            <img 
              src={question.imagem} 
              alt="Imagem da questão" 
              className="max-w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => setShowAnswer(!showAnswer)}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? 'Ocultar Resposta' : 'Ver Resposta'}
          </Button>

          {showAnswer && (
            <div className="bg-secondary p-4 rounded-lg">
              <p className="font-semibold text-lg">{question.resposta}</p>
            </div>
          )}

          {showAnswer && !answered && (
            <div className="flex gap-4">
              <Button onClick={handleCorrectAnswer} className="flex-1 bg-green-600 hover:bg-green-700">
                Resposta Correta
              </Button>
              <Button onClick={handleWrongAnswer} variant="destructive" className="flex-1">
                Resposta Incorreta
              </Button>
            </div>
          )}

          {answered && (
            <div className="text-center py-2">
              <p className="text-lg font-semibold text-green-600">Questão respondida!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
