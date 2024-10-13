import { useState } from 'react';
import { Comment } from '../../../types/comment';
import { User } from '../../../types/auth';
import styles from './styles.module.css';

interface CommentItemProps {
    comment: Comment;
    currentUser: User | null;
    onUpdate: (comment: Comment, newContent: string) => void;
    onDelete: (commentId: string) => void;
    isUpdating: boolean;
    isDeleting: boolean;
}

function ArticleCommentItem({ comment, currentUser, onUpdate, onDelete, isUpdating, isDeleting }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleUpdate = () => {
    onUpdate(comment, editedContent);
    setIsEditing(false);
  };

  const isOwnComment = currentUser && comment.user.id === currentUser.id;

  return (
    <li className={styles.commentItem}>
      <p className={styles.commentAuthor}>{comment.user.username}</p>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className={styles.editInput}
          />
          <div className={styles.commentActions}>
            <button onClick={handleUpdate} disabled={isUpdating} className={styles.updateButton}>
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.commentContent}>{comment.content}</p>
          <p className={styles.commentDate}>Posted on: {new Date(comment.createdAt).toLocaleString()}</p>
          {isOwnComment && (
            <div className={styles.commentActions}>
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
              <button onClick={() => onDelete(comment.documentId)} disabled={isDeleting} className={styles.deleteButton}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default ArticleCommentItem;
