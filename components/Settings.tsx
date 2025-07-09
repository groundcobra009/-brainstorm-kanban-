import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('gemini_api_key', apiKey);
      // Reload the page to apply the new API key
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 500);
    } catch (error) {
      setSaveStatus('error');
      console.error('Failed to save API key:', error);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-light-text_primary dark:text-dark-text_primary">設定</h2>
          <button
            onClick={onClose}
            className="text-light-text_secondary dark:text-dark-text_secondary hover:text-light-text_primary dark:hover:text-dark-text_primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text_primary dark:text-dark-text_primary mb-2">
              Gemini API キー
            </label>
            <div className="flex items-center space-x-2">
              <KeyIcon className="w-5 h-5 text-light-text_secondary dark:text-dark-text_secondary" />
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 pr-10 border border-light-border dark:border-dark-border rounded-md bg-light-background dark:bg-dark-background text-light-text_primary dark:text-dark-text_primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-light-text_secondary dark:text-dark-text_secondary hover:text-light-text_primary dark:hover:text-dark-text_primary"
                >
                  {showApiKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-light-text_secondary dark:text-dark-text_secondary">
              Google AI StudioでAPIキーを取得してください。
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-light-accent dark:text-dark-accent hover:underline ml-1">
                APIキーを取得
              </a>
            </p>
          </div>

          <button
            onClick={handleSaveApiKey}
            disabled={!apiKey || saveStatus === 'saving' || saveStatus === 'saved'}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-light-accent dark:bg-dark-accent text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '保存しました！' : saveStatus === 'error' ? 'エラー' : '保存'}
          </button>

          {apiKey && (
            <div className="mt-4 p-3 bg-light-background dark:bg-dark-background rounded-md">
              <p className="text-sm text-light-text_secondary dark:text-dark-text_secondary">
                現在のAPIキー: <span className="font-mono">{maskApiKey(apiKey)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;