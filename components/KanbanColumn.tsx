
import React from 'react';
import { Idea, Status } from '../types';
import IdeaCard from './IdeaCard';

interface KanbanColumnProps {
  status: Status;
  ideas: Idea[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onEditIdea: (idea: Idea) => void;
  onDeleteIdea: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, ideas, onDrop, onDragStart, onEditIdea, onDeleteIdea }) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
      setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, status);
    setIsOver(false);
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[300px] rounded-xl p-2 transition-colors duration-300 ${isOver ? 'bg-light-accent/10 dark:bg-dark-accent/10' : ''}`}
    >
      <div className="flex justify-between items-center p-2 mb-4">
        <h2 className="font-bold text-lg text-light-text_primary dark:text-dark-text_primary">{status}</h2>
        <span className="text-sm font-medium bg-light-border dark:bg-dark-border text-light-text_secondary dark:text-dark-text_secondary rounded-full px-3 py-1">{ideas.length}</span>
      </div>
      <div className="flex flex-col gap-4 h-full">
        {ideas.map(idea => (
          <IdeaCard 
            key={idea.id} 
            idea={idea} 
            onDragStart={onDragStart} 
            onEdit={onEditIdea}
            onDelete={onDeleteIdea}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
