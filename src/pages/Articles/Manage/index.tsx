import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetArticlesQuery, useCreateArticleMutation, useUpdateArticleMutation, useDeleteArticleMutation } from '../../../services/articleApi';
import { useGetCategoriesQuery } from '../../../services/categoryApi';
import { selectCurrentUser } from '../../../features/authSlice';
import { Article, CreateArticleRequest } from '../../../types/article';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

function ManageArticles() {
    const currentUser = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
    const { data: articlesData, isLoading, isError, error, refetch } = useGetArticlesQuery({ 
        page, 
        pageSize, 
        userId: currentUser?.id
    });
    const { data: categories } = useGetCategoriesQuery();
    const [createArticle] = useCreateArticleMutation();
    const [updateArticle] = useUpdateArticleMutation();
    const [deleteArticle] = useDeleteArticleMutation();
    const navigate = useNavigate();

    console.log(articlesData);

    const [newArticle, setNewArticle] = useState<CreateArticleRequest['data']>({
        title: '',
        description: '',
        cover_image_url: '',
        category: null,
    });

    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const userArticles = articlesData?.data || [];
    const totalPages = articlesData?.meta?.pagination?.pageCount || 1;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editingArticle) {
            if (name === 'category') {
                const categoryId = value ? Number(value) : null;
                const selectedCategory = categories?.data.find(cat => cat.id === categoryId);
                setEditingArticle({
                    ...editingArticle,
                    category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null
                });
            } else {
                setEditingArticle({ ...editingArticle, [name]: value });
            }
        } else {
            setNewArticle(prev => ({ ...prev, [name]: name === 'category' ? (value ? Number(value) : null) : value }));
        }
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const articleData = {
                ...newArticle,
                category: newArticle.category ? Number(newArticle.category) : null,
            };
            await createArticle({ data: articleData }).unwrap();
            setNewArticle({ title: '', description: '', cover_image_url: '', category: null });
            toast.success('Article created successfully');
            refetch();
        } catch (err) {
            console.error('Error creating article:', err);
            toast.error('Failed to create article. Please try again.');
        }
    };

    const handleUpdateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArticle) return;
        try {
            const updateData = {
                title: editingArticle.title,
                description: editingArticle.description,
                cover_image_url: editingArticle.cover_image_url,
                category: editingArticle.category ? editingArticle.category.id : null,
            };
            await updateArticle({ 
                id: editingArticle.documentId, 
                data: updateData
            }).unwrap();
            setEditingArticle(null);
            toast.success('Article updated successfully');
            refetch();
        } catch (err) {
            console.error('Error updating article:', err);
            toast.error('Failed to update article. Please try again.');
        }
    };
  
    const handleDeleteArticle = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteArticle(id).unwrap();
                toast.success('Article deleted successfully');
                refetch();
            } catch (err) {
                console.error('Error deleting article:', err);
                toast.error('Failed to delete article. Please try again.');
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (isError) return <div className={styles.error}>Error: {error.toString()}</div>;

    return (
        <div className={styles.manageArticlesContainer}>
            <h1 className={styles.pageTitle}>Manage Your Articles</h1>
            <form onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle} className={styles.articleForm}>
                <input
                    type="text"
                    name="title"
                    value={editingArticle ? editingArticle.title : newArticle.title}
                    onChange={handleInputChange}
                    placeholder="Article Title"
                    required
                    className={styles.formInput}
                />
                <textarea
                    name="description"
                    value={editingArticle ? editingArticle.description : newArticle.description}
                    onChange={handleInputChange}
                    placeholder="Article Description"
                    required
                    className={styles.formTextarea}
                />
                <input
                    type="text"
                    name="cover_image_url"
                    value={editingArticle ? editingArticle.cover_image_url : newArticle.cover_image_url}
                    onChange={handleInputChange}
                    placeholder="Cover Image URL"
                    required
                    className={styles.formInput}
                />
                <select
                    name="category"
                    value={editingArticle ? (editingArticle.category ? editingArticle.category.id : '') : (newArticle.category || '')}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                >
                    <option value="">No Category</option>
                    {categories?.data.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className={styles.submitButton}>
                    {editingArticle ? 'Update Article' : 'Create Article'}
                </button>
                {editingArticle && (
                    <button type="button" onClick={() => setEditingArticle(null)} className={styles.cancelButton}>
                        Cancel Edit
                    </button>
                )}
            </form>
            <div className={styles.articlesList}>
                {userArticles.map((article) => (
                    <div key={article.id} className={styles.articleItem}>
                        <div 
                            className={styles.articleContent}
                            onClick={() => navigate(`/articles/${article.documentId}`)}
                        >
                            <div className={styles.imageContainer}>
                                {article.cover_image_url ? (
                                    <img 
                                        src={article.cover_image_url} 
                                        alt={article.title} 
                                        className={styles.articleImage}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/no-image.png';
                                            e.currentTarget.className = `${styles.articleImage} ${styles.placeholderImage}`;
                                        }}
                                    />
                                ) : (
                                    <div className={styles.noImage}>No Image Available</div>
                                )}
                            </div>
                            <div className={styles.articleDetails}>
                                <h3 className={styles.articleTitle}>{article.title}</h3>
                                <p className={styles.articleDescription}>{article.description.slice(0, 100)}...</p>
                                <p className={styles.articleMeta}>Category: {article.category?.name || 'Uncategorized'}</p>
                                <p className={styles.articleMeta}>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                                <p className={styles.articleMeta}>Updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
                                <p className={styles.articleMeta}>Published: {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}</p>
                                <p className={styles.articleMeta}>Locale: {article.locale || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className={styles.articleActions}>
                            <button onClick={() => setEditingArticle(article)} className={styles.editButton}>Edit</button>
                            <button onClick={() => handleDeleteArticle(article.documentId)} className={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1}
                    className={styles.paginationButton}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages}
                    className={styles.paginationButton}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManageArticles;
