import React, { useState } from "react";
import { Question, Player, Difficulty } from "@/types/Quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, Bomb } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  difficulty: Difficulty;
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onBack: () => void;
  isBomb?: boolean;
  onQuestionAnswered?: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  difficulty,
  players,
  onUpdatePlayers,
  onBack,
  isBomb = false,
  onQuestionAnswered,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case "facil":
        return "Fácil";
      case "medio":
        return "Médio";
      case "dificil":
        return "Difícil";
      case "muitodificil":
        return "Muito Difícil";
      case "impossivel":
        return "Impossível";
    }
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleRevealAnswer2 = () => {
    setShowAnswer2(true);
  };

  const handleRevealAnswer3 = () => {
    setShowAnswer3(true);
  };

  const markAsAnswered = () => {
    setAnswered(true);
    if (onQuestionAnswered) {
      onQuestionAnswered();
    }
  };

  const toggleMultiplier = () => {
    setMultiplier((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const handleBombEffect = (playerName: string) => {
    const updatedPlayers = players.map((player) => {
      if (player.nome === playerName) {
        if (player.pontos > 0) {
          // Reinicia a pontuação se for positiva
          return { ...player, pontos: 0 };
        } else if (player.pontos < 0) {
          // Dobra a pontuação se for negativa
          return { ...player, pontos: player.pontos * 2 };
        } else {
          // Se for zero, a pontuação que seria dada é negativa e multiplicada por dois
          return { ...player, pontos: -(question.pontos * 2) };
        }
      }
      return player;
    });

    onUpdatePlayers(updatedPlayers);
    markAsAnswered();
  };

  const handleScoreUpdate = (scoreType: "normal" | "negative" | "double") => {
    if (!selectedPlayer) return;

    const updatedPlayers = players.map((player) => {
      if (player.nome === selectedPlayer) {
        let pointsToAdd = 0;
        switch (scoreType) {
          case "normal":
            pointsToAdd = question.pontos * multiplier;
            break;
          case "negative":
            pointsToAdd = -question.pontos * multiplier;
            break;
        }
        return { ...player, pontos: player.pontos + pointsToAdd };
      }
      return player;
    });

    onUpdatePlayers(updatedPlayers);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Seleção
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl flex items-center gap-2">
                Questão
                {isBomb && showAnswer && (
                  <div className="flex items-center gap-2 text-orange-500">
                    <Bomb className="w-6 h-6" />
                    <span className="text-lg font-bold">BOMBA!</span>
                  </div>
                )}
              </CardTitle>
              <div
                className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
                  isBomb && showAnswer ? "bg-orange-600" : ""
                }`}
              >
                {isBomb && showAnswer
                  ? "💣 BOMBA"
                  : `${getDifficultyLabel(difficulty)} - ${
                      question.pontos
                    } pts`}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-xl font-medium leading-relaxed whitespace-pre-line">
              {question.pergunta}
            </div>

            {question.imagem && (
              <div className="flex justify-center">
                <img
                  src={question.imagem}
                  alt="Imagem da questão"
                  className="max-w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleRevealAnswer}
                variant="outline"
                className="w-full flex items-center gap-2 text-lg py-6"
                disabled={showAnswer}
              >
                {showAnswer ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                {showAnswer ? "Resposta Revelada" : "Revelar Resposta"}
              </Button>

              {showAnswer && (
                <Card
                  className={`${
                    isBomb
                      ? "bg-orange-500/20 border-orange-500"
                      : "bg-secondary/50"
                  }`}
                >
                  <CardContent className="pt-6">
                    <p className="font-semibold text-xl text-center whitespace-pre-line">
                      {question.resposta}
                    </p>
                    <div
                    className="flex justify-center"
                    >
                    <img
                      src={question.imagemresposta}
                      alt="Imagem da resposta"
                      className="max-w-full h-80 object-cover rounded-lg shadow-md mt-4"
                    />
                    </div>
                    {isBomb && (
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-orange-500 text-lg font-bold">
                          <Bomb className="w-6 h-6" />
                          QUESTÃO BOMBA!
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Esta questão aplicará efeitos especiais na pontuação!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {showAnswer && question.resposta2 && !isBomb && (
                <Button
                  onClick={handleRevealAnswer2}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-lg py-6"
                  disabled={showAnswer2}
                >
                  {showAnswer2 ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  {showAnswer2 ? "Resposta 2 Revelada" : "Revelar Resposta 2"}
                </Button>
              )}

              {showAnswer2 && (
                <Card
                  className={`${
                    isBomb
                      ? "bg-orange-500/20 border-orange-500"
                      : "bg-secondary/50"
                  }`}
                >
                  <CardContent className="pt-6">
                    <p className="font-semibold text-xl text-center whitespace-pre-line">
                      {question.resposta2}
                    </p>
                    <div
                    className="flex justify-center"
                    >
                    <img
                      src={question.imagemresposta2}
                      alt="Imagem da resposta 2"
                      className="max-w-full h-80 object-cover rounded-lg shadow-md mt-4"
                    />
                    </div>
                  </CardContent>
                </Card>
              )}

              {showAnswer2 && question.resposta3 && !isBomb && (
                <Button
                  onClick={handleRevealAnswer3}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-lg py-6"
                  disabled={showAnswer3}
                >
                  {showAnswer3 ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  {showAnswer3 ? "Resposta 3 Revelada" : "Revelar Resposta 3"}
                </Button>
              )}

              {showAnswer3 && (
                <Card
                  className={`${
                    isBomb
                      ? "bg-orange-500/20 border-orange-500"
                      : "bg-secondary/50"
                  }`}
                >
                  <CardContent className="pt-6">
                    <p className="font-semibold text-xl text-center whitespace-pre-line">
                      {question.resposta3}
                    </p>
                    <div
                    className="flex justify-center"
                    >
                    <img
                      src={question.imagemresposta3}
                      alt="Imagem da resposta 3"
                      className="max-w-full h-80 object-cover rounded-lg shadow-md mt-4"
                    />
                    </div>
                  </CardContent>
                </Card>
              )}

              {showAnswer && !answered && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">
                      {isBomb
                        ? "Selecionar Jogador para Efeito da Bomba"
                        : "Selecionar Jogador e Pontuação"}
                    </h3>
                    <Select
                      value={selectedPlayer}
                      onValueChange={setSelectedPlayer}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escolha um jogador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.nome} value={player.nome}>
                            {player.nome} ({player.pontos} pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPlayer && (
                    <div className="grid grid-cols-1 gap-4">
                      {isBomb ? (
                        <Button
                          onClick={() => handleBombEffect(selectedPlayer)}
                          className="bg-orange-600 hover:bg-orange-700 py-6"
                        >
                          💣 Aplicar Efeito da Bomba
                          <br />
                          <span className="text-sm">
                            {(() => {
                              const player = players.find(
                                (p) => p.nome === selectedPlayer
                              );
                              if (!player) return "";
                              if (player.pontos > 0)
                                return "Pontuação será zerada";
                              if (player.pontos < 0)
                                return `Pontuação será dobrada (${
                                  player.pontos * 2
                                })`;
                              return `Pontuação será -${question.pontos * 2}`;
                            })()}
                          </span>
                        </Button>
                      ) : (
                        <>
                          <div className="flex flex-row gap-4">
                            <Button
                              onClick={() => handleScoreUpdate("normal")}
                              className="bg-green-600 hover:bg-green-700 py-6 w-[45%]"
                            >
                              Correto
                              <br />
                              <span className="text-sm">
                                +{question.pontos * multiplier} pts
                              </span>
                            </Button>
                            <Button
                              onClick={() => handleScoreUpdate("negative")}
                              variant="destructive"
                              className="py-6 w-[45%]"
                            >
                              Incorreto
                              <br />
                              <span className="text-sm">
                                -{question.pontos * multiplier} pts
                              </span>
                            </Button>
                            <Button
                              onClick={toggleMultiplier}
                              className="bg-transparent text-white hover:bg-white hover:text-black border border-white py-6 w-[10%]"
                            >
                              {multiplier}x
                            </Button>
                          </div>
                          <Button
                            onClick={() => {
                              markAsAnswered();
                            }}
                            className="bg-purple-600 text-white hover:bg-purple-700 py-6"
                          >
                            Divisão de Pontos finalizada
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {answered && (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-green-400">
                    {isBomb
                      ? "Efeito da bomba aplicado!"
                      : "Pontuação atualizada!"}
                  </p>
                  <Button onClick={onBack} className="mt-4">
                    Próxima Questão
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDisplay;
