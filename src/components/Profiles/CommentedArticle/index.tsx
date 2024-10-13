import { useState, useMemo } from 'react';
import { useGetUserCommentsQuery } from '../../../services/commentApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './styles.module.css';
import { User } from '../../../types/auth';

function CommentedArticle({ user }: { user: User }) {
    const { isAuthenticated } = useAuth();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
    const { data: comments, isLoading, isError, error } = useGetUserCommentsQuery(
      { userId: user?.id?.toString() || '', page, pageSize },
      { skip: !isAuthenticated || !user }
    );

    const sortedComments = useMemo(() => {
      if (!comments || !comments.data) return [];
      return [...comments.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [comments]);

    if (!isAuthenticated) {
      return <div className={styles.error}>Please log in to view your commented articles.</div>;
    }

    if (isLoading) {
      return <div className={styles.loading}>Loading your commented articles...</div>;
    }

    if (isError) {
      let errorMessage = 'An error occurred while fetching your comments.';
      if (error && 'status' in error) {
        errorMessage += ` Status: ${error.status}`;
        if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage += ` Message: ${error.data.message}`;
        }
      }
      return <div className={styles.error}>{errorMessage}</div>;
    }

    if (!comments || comments.data.length === 0) {
      return <div className={styles.noComments}>You haven't commented on any articles yet.</div>;
    }

    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };

    return (
      <div className={styles.commentedArticles}>
        <h2>Your Commented Articles</h2>
        <ul className={styles.articleList}>
          {sortedComments.map((comment) => (
            <li key={comment.id} className={styles.articleItem}>
              {comment.article ? (
                <Link to={`/articles/${comment.article.documentId}`} className={styles.articleLink}>
                  <h3>{comment.article.title}</h3>
                </Link>
              ) : (
                <span className={styles.missingArticle}>Article no longer available</span>
              )}
              <p className={styles.commentContent}>{comment.content}</p>
              <span className={styles.commentDate}>
                Commented on: {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
        {comments.meta.pagination && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
            >
              Previous
            </button>
            <span>
              Page {page} of {comments.meta.pagination.pageCount}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === comments.meta.pagination.pageCount || isLoading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
}

export default CommentedArticle;