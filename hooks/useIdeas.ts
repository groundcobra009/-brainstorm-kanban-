
import { useState, useCallback } from 'react';
import { Idea, Status, Priority } from '../types';

const initialIdeas: Idea[] = [
  {
    id: 'idea-1',
    title: 'リアルタイム共同編集機能',
    description: '複数ユーザーが同時にアイデアを編集できる機能。カーソルの位置も表示する。',
    tags: ['collaboration', 'feature'],
    priority: Priority.High,
    status: Status.InProgress,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'idea-2',
    title: 'AIによるアイデアサジェスト',
    description: '入力されたキーワードに基づいて、関連する新しいアイデアをAIが提案する。',
    tags: ['ai', 'feature', 'gemini'],
    priority: Priority.High,
    status: Status.Backlog,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'idea-3',
    title: 'カンバンボードビューの実装',
    description: 'アイデアをカードとして視覚的に管理するためのカンバンボード。',
    tags: ['ui', 'ux'],
    priority: Priority.Medium,
    status: Status.Done,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'idea-4',
    title: 'ダークモード対応',
    description: '目の疲れを軽減するためのダークテーマを実装する。',
    tags: ['ui', 'accessibility'],
    priority: Priority.Medium,
    status: Status.Done,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'idea-5',
    title: 'Notionからのインポート機能',
    description: '既存のNotionページをアプリにインポートできるようにする。',
    tags: ['integration', 'import'],
    priority: Priority.Low,
    status: Status.Backlog,
    createdAt: new Date().toISOString(),
  },
];

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

  const addIdea = useCallback((idea: Omit<Idea, 'id' | 'createdAt'>) => {
    const newIdea: Idea = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setIdeas(prevIdeas => [...prevIdeas, newIdea]);
  }, []);

  const updateIdea = useCallback((updatedIdea: Idea) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea => (idea.id === updatedIdea.id ? updatedIdea : idea))
    );
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== id));
  }, []);

  const moveIdea = useCallback((id: string, newStatus: Status) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === id ? { ...idea, status: newStatus } : idea
      )
    );
  }, []);

  return { ideas, addIdea, updateIdea, deleteIdea, moveIdea };
};
