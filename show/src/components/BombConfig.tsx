
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bomb } from 'lucide-react';

interface BombConfigProps {
  onConfigComplete: (bombCount: number) => void;
  onBack: () => void;
}

const BombConfig: React.FC<BombConfigProps> = ({ onConfigComplete, onBack }) => {
  const [bombCount, setBombCount] = useState<number>(0);

  const handleSubmit = () => {
    onConfigComplete(bombCount);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Configurar Bombas
            </h1>
            <p className="text-xl text-muted-foreground">
              Configure quantas questões bomba terá nesta partida
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Bomb className="w-6 h-6 text-orange-500" />
              Mecânica das Bombas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-orange-600">Como funcionam as bombas:</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Pontuação positiva:</strong> Volta para zero</li>
                <li>• <strong>Pontuação negativa:</strong> É dobrada (fica ainda mais negativa)</li>
                <li>• <strong>Pontuação zero:</strong> Recebe o valor negativo da questão multiplicado por 2</li>
                <li>• <strong>Seleção aleatória:</strong> Tema e dificuldade são escolhidos automaticamente</li>
                <li>• <strong>Revelação:</strong> A bomba só é revelada ao mostrar a resposta</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bombCount" className="text-lg font-medium">
                  Número de questões bomba
                </Label>
                <Input
                  id="bombCount"
                  type="number"
                  min="0"
                  max="20"
                  value={bombCount}
                  onChange={(e) => setBombCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-lg py-6 mt-2"
                  placeholder="Digite o número de bombas (0-20)"
                />
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {bombCount === 0 && "Nenhuma bomba será usada nesta partida"}
                {bombCount === 1 && "1 questão bomba será incluída aleatoriamente"}
                {bombCount > 1 && `${bombCount} questões bomba serão incluídas aleatoriamente`}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                size="lg" 
                className="w-full text-xl py-6 bg-gradient-to-r from-orange-600 to-red-600"
              >
                {bombCount > 0 ? `Começar com ${bombCount} bomba${bombCount > 1 ? 's' : ''}` : 'Começar sem bombas'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BombConfig;
