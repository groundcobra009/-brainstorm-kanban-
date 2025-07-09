
import React, { useState, useEffect, useCallback } from 'react';
import { Idea, Priority, Status } from '../types';
import { SparklesIcon } from './icons';
import { generateRelatedIdeas } from '../services/geminiService';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Idea) => void;
  ideaToEdit: Idea | null;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ isOpen, onClose, onSave, ideaToEdit }) => {
  const [idea, setIdea] = useState<Omit<Idea, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    tags: [],
    priority: Priority.Medium,
    status: Status.Backlog,
  });
  const [tagsInput, setTagsInput] = useState('');
  
  const [aiTopic, setAiTopic] = useState('');
  const [aiIdeas, setAiIdeas] = useState<{ title: string; description: string; tags: string[] }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (ideaToEdit) {
      setIdea(ideaToEdit);
      setTagsInput(ideaToEdit.tags.join(', '));
    } else {
      setIdea({
        title: '',
        description: '',
        tags: [],
        priority: Priority.Medium,
        status: Status.Backlog,
      });
      setTagsInput('');
    }
  }, [ideaToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIdea(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setIdea(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.title.trim() === '') return;
    onSave({
        ...idea,
        id: ideaToEdit?.id || `idea-${Date.now()}`,
        createdAt: ideaToEdit?.createdAt || new Date().toISOString()
    });
    onClose();
  };

  const handleGenerateIdeas = useCallback(async () => {
      if (!aiTopic) return;
      setIsGenerating(true);
      setAiError('');
      setAiIdeas([]);
      try {
          const results = await generateRelatedIdeas(aiTopic);
          setAiIdeas(results);
      } catch (error) {
          setAiError(error instanceof Error ? error.message : "不明なエラーが発生しました。");
      } finally {
          setIsGenerating(false);
      }
  }, [aiTopic]);

  const useAiIdea = (aiIdea: { title: string; description: string; tags: string[] }) => {
    setIdea(prev => ({ ...prev, title: aiIdea.title, description: aiIdea.description, tags: aiIdea.tags }));
    setTagsInput(aiIdea.tags.join(', '));
    setAiIdeas([]);
    setAiTopic('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-light-surface dark:bg-dark-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 m-4" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-light-text_primary dark:text-dark-text_primary mb-6">
            {ideaToEdit ? 'アイデアを編集' : '新しいアイデア'}
          </h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-light-text_secondary dark:text-dark-text_secondary mb-1">タイトル</label>
            <input type="text" name="title" id="title" value={idea.title} onChange={handleChange} required className="w-full bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent" />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-light-text_secondary dark:text-dark-text_secondary mb-1">詳細</label>
            <textarea name="description" id="description" value={idea.description} onChange={handleChange} rows={5} className="w-full bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-light-text_secondary dark:text-dark-text_secondary mb-1">優先度</label>
              <select name="priority" id="priority" value={idea.priority} onChange={handleChange} className="w-full bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent">
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-light-text_secondary dark:text-dark-text_secondary mb-1">ステータス</label>
              <select name="status" id="status" value={idea.status} onChange={handleChange} className="w-full bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent">
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
           <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-light-text_secondary dark:text-dark-text_secondary mb-1">タグ (カンマ区切り)</label>
            <input type="text" name="tags" id="tags" value={tagsInput} onChange={handleTagsChange} className="w-full bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent" />
          </div>
          
          <div className="bg-light-background dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-light-text_primary dark:text-dark-text_primary"><SparklesIcon className="text-light-accent dark:text-dark-accent"/> AIによるアイデア支援</h3>
            <p className="text-sm text-light-text_secondary dark:text-dark-text_secondary mb-3">トピックを入力して、関連するアイデアを生成します。</p>
            <div className="flex gap-2">
                <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="例：新しいマーケティング戦略" className="flex-grow bg-white dark:bg-dark-background border border-light-border dark:border-dark-border rounded-md p-2 text-light-text_primary dark:text-dark-text_primary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"/>
                <button type="button" onClick={handleGenerateIdeas} disabled={isGenerating || !aiTopic} className="px-4 py-2 bg-light-accent text-white dark:bg-dark-accent dark:text-dark-text_primary rounded-md shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? '生成中...' : '生成'}
                </button>
            </div>
             {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
             {aiIdeas.length > 0 && (
                <div className="mt-4 space-y-2">
                    {aiIdeas.map((aiIdea, index) => (
                        <div key={index} className="border border-light-border dark:border-dark-border rounded-md p-3">
                            <p className="font-bold">{aiIdea.title}</p>
                            <p className="text-sm text-light-text_secondary dark:text-dark-text_secondary">{aiIdea.description}</p>
                             <div className="flex gap-1 mt-1">
                                {aiIdea.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full text-xs text-light-text_secondary dark:text-dark-text_secondary">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <button type="button" onClick={() => useAiIdea(aiIdea)} className="text-sm text-light-accent dark:text-dark-accent font-semibold mt-2">このアイデアを使用</button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-light-border dark:bg-dark-border text-light-text_primary dark:text-dark-text_primary rounded-md hover:opacity-80">キャンセル</button>
            <button type="submit" className="px-4 py-2 bg-light-accent text-white dark:bg-dark-accent dark:text-dark-text_primary rounded-md shadow-sm hover:opacity-90">{ideaToEdit ? '更新' : '作成'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeaModal;
