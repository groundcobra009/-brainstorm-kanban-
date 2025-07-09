import React, { useState, useCallback } from 'react';
import { SparklesIcon } from './icons';
import { generateRelatedIdeas } from '../services/geminiService';
import { GeneratedIdea } from '../types';
import IdeaCard from './IdeaCard';

const KanbanBoard: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setGeneratedIdeas([]);

        try {
            const ideas = await generateRelatedIdeas(topic);
            setGeneratedIdeas(ideas);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AIによるアイデアの生成に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-light-text_primary dark:text-dark-text_primary mb-2">AI ブレインストーミング</h1>
                <p className="text-md sm:text-lg text-light-text_secondary dark:text-dark-text_secondary">
                    中心となるテーマを入力して、AIに関連アイデアを広げてもらいましょう。
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-8 sticky top-4 bg-light-surface/80 dark:bg-dark-background/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-light-border dark:border-dark-border z-10">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                    placeholder="例：チームの生産性を上げる新しい方法"
                    className="flex-grow bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-3 text-lg text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-shadow"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-light-accent text-white dark:bg-dark-accent dark:text-dark-text_primary rounded-md shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                    <SparklesIcon className="h-6 w-6" />
                    <span>{isLoading ? '生成中...' : 'アイデアを生成'}</span>
                </button>
            </div>
            
            <div className="flex-grow">
                {error && <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-md">{error}</div>}

                {isLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent mx-auto"></div>
                        <p className="mt-4 text-light-text_secondary dark:text-dark-text_secondary">AIがアイデアを考えています...</p>
                    </div>
                )}
                
                {generatedIdeas.length > 0 && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {generatedIdeas.map((idea, index) => (
                            <IdeaCard key={index} idea={idea} />
                        ))}
                    </div>
                )}
                
                {!isLoading && !error && generatedIdeas.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl h-full flex flex-col justify-center items-center">
                        <SparklesIcon className="h-16 w-16 mx-auto text-light-text_secondary dark:text-dark-text_secondary opacity-50 mb-4"/>
                        <h2 className="text-xl font-semibold text-light-text_primary dark:text-dark-text_primary">アイデアがここに表示されます</h2>
                        <p className="text-light-text_secondary dark:text-dark-text_secondary mt-2">上のボックスにトピックを入力して生成ボタンを押してください。</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanBoard;
