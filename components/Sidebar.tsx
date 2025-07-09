import React, { useState } from 'react';
import { BrainIcon } from './icons';
import Settings from './Settings';

const Sidebar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
    <div className="flex flex-col h-full bg-light-surface dark:bg-dark-background text-light-text_primary dark:text-dark-text_primary border-r border-light-border dark:border-dark-border w-64 p-4 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-8">
        <BrainIcon className="h-8 w-8 text-light-accent dark:text-dark-accent" />
        <h1 className="text-xl font-bold">おい、ファンファン大佐対策、ブレストしようぜ</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <a href="#" className="p-2 rounded-md font-medium bg-light-background dark:bg-dark-surface">
          ホーム
        </a>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-md font-medium text-light-text_secondary dark:text-dark-text_secondary hover:bg-light-background dark:hover:bg-dark-surface w-full text-left"
        >
          設定
        </button>
      </nav>
      <div className="mt-auto text-xs text-light-text_secondary dark:text-dark-text_secondary">
        <p>© 2024 Brainstorm App</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
    {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Sidebar;
