import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-light-surface dark:bg-dark-background text-light-text_primary dark:text-dark-text_primary">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
};

export default App;
