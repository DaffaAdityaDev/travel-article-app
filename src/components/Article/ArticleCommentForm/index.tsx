import React, { useState } from 'react';
import styles from './styles.module.css';

interface ArticleCommentFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

function ArticleCommentForm({ onSubmit, isLoading }: ArticleCommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        className={styles.commentInput}
        required
      />
      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

export default ArticleCommentForm;
