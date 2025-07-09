import React from 'react';
import { GeneratedIdea } from '../types';

interface IdeaCardProps {
    idea: GeneratedIdea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
    return (
        <div className="bg-light-background dark:bg-dark-surface p-6 rounded-lg shadow-md border border-light-border dark:border-dark-border flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-bold text-lg text-light-text_primary dark:text-dark-text_primary">{idea.title}</h3>
            <p className="text-sm text-light-text_secondary dark:text-dark-text_secondary flex-grow">
                {idea.description}
            </p>
            {idea.tags && idea.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2 pt-2">
                    {idea.tags.map(tag => (
                        <span key={tag} className="bg-light-surface dark:bg-dark-background px-2.5 py-1 rounded-full text-xs font-medium text-light-text_secondary dark:text-dark-text_secondary">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IdeaCard;
