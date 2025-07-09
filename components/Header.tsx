import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-light-surface dark:bg-dark-background border-b border-light-border dark:border-dark-border sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-light-text_primary dark:text-dark-text_primary">
            AI ブレインストーミング
          </h2>
          <p className="text-xs text-light-text_secondary dark:text-dark-text_secondary">
            おい、ファンファン大佐対策、ブレストしようぜ！
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
