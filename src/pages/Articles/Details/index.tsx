import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetArticleQuery } from '../../../services/articleApi';
import { useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from '../../../services/commentApi';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../../../features/authSlice';
import { Comment } from '../../../types/comment';
import { toast } from 'react-toastify';
import ArticleCommentForm from '../../../components/Article/ArticleCommentForm';
import ArticleCommentItem from '../../../components/Article/ArticleCommentItem';
import styles from './styles.module.css';

function ArticleDetails() {
  const { documentId } = useParams<{ documentId: string }>();
  const [page, setPage] = useState(1);
  const pageSize = 2;

  const { data: article, isLoading: isArticleLoading, isError: isArticleError, error: articleError } = useGetArticleQuery(documentId || '');
  const { 
    data: comments, 
    isLoading: isCommentsLoading, 
    isError: isCommentsError, 
    error: commentsError,
    refetch: refetchComments
  } = useGetCommentsQuery({ articleId: documentId || '', page, pageSize });

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  console.log('Current token:', currentToken);
  const articleData = article?.data;
  const commentsData = comments?.data;
  const pagination = comments?.meta?.pagination;

  const handleCreateComment = useCallback(async (content: string) => {
    if (!currentToken) {
      toast.error('You must be logged in to comment');
      return;
    }
    try {
      await createComment({
        data: {
          content,
          article: articleData?.id.toString() || '',
        },
      }).unwrap();
      toast.success('Comment posted successfully');
      refetchComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
      toast.error('Failed to post comment. Please try again.');
    }
  }, [currentToken, createComment, articleData, refetchComments]);
  
  const handleUpdateComment = useCallback(async (comment: Comment, newContent: string) => {
    if (!currentToken) {
      toast.error('You must be logged in to update a comment');
      return;
    }
    try {
      await updateComment({
        id: comment.documentId,
        data: { content: newContent },
      }).unwrap();
      toast.success('Comment updated successfully');
      refetchComments();
    } catch (err) {
      toast.error('Failed to update comment. Please try again.');
      console.error('Failed to update comment:', err);
    }
  }, [currentToken, updateComment, refetchComments]);
  
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!currentToken) {
      toast.error('You must be logged in to delete a comment');
      return;
    }
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId).unwrap();
        toast.success('Comment deleted successfully');
        refetchComments();
      } catch (err) {
        toast.error('Failed to delete comment. Please try again.');
        console.error('Failed to delete comment:', err);
      }
    }
  }, [currentToken, deleteComment, refetchComments]);

  if (isArticleLoading || isCommentsLoading) return <div className={styles.loading}>Loading...</div>;
  if (isArticleError) return <div className={styles.error}>Error: {articleError.toString()}</div>;
  if (isCommentsError) return <div className={styles.error}>Error loading comments: {commentsError.toString()}</div>;
  if (!article) return <div className={styles.error}>Article not found</div>;

  return (
    <div className={styles.articleDetails}>
      <Link to="/articles" className={styles.backLink}>Back to Articles</Link>
      <h1 className={styles.articleTitle}>{articleData?.title}</h1>
      <img src={articleData?.cover_image_url} alt={articleData?.title} className={styles.articleImage} />
      <p className={styles.articleDescription}>{articleData?.description}</p>
      <p className={styles.articlePublished}>Published: {articleData?.publishedAt ? new Date(articleData.publishedAt).toLocaleDateString() : 'Unknown'}</p>
      
      <div className={styles.commentsSection}>
        <h2>Comments</h2>
        <ArticleCommentForm onSubmit={handleCreateComment} isLoading={isCreatingComment} />
        
        {commentsData && commentsData.length > 0 ? (
          <ul className={styles.commentsList}>
            {commentsData.map((comment) => (
             <ArticleCommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onUpdate={handleUpdateComment}
                onDelete={() => handleDeleteComment(comment.documentId)}
                isUpdating={isUpdatingComment}
                isDeleting={isDeletingComment}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        )}
        {pagination && (
          <div className={styles.pagination}>
            <button 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1 || isCommentsLoading}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>Page {page} of {pagination.pageCount}</span>
            <button 
              onClick={() => setPage(prev => Math.min(pagination.pageCount, prev + 1))}
              disabled={page === pagination.pageCount || isCommentsLoading}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;
