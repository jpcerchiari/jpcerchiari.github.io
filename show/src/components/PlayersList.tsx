
import React from 'react';
import { Player } from '@/types/Quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, User } from 'lucide-react';

interface PlayersListProps {
  players: Player[];
}

const PlayersList: React.FC<PlayersListProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.pontos - a.pontos);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Placar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.nome}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-yellow-600/20 border-2 border-yellow-500' : 'bg-secondary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-500 text-black' : 'bg-muted'
                }`}>
                  {index === 0 ? <Trophy className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <span className="font-medium">{player.nome}</span>
              </div>
              <div className="font-bold text-lg">{player.pontos} pts</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
