import React, { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../services/categoryApi';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import { Category as CategoryType } from '../../types/category';

function Category() {
  const { data: categoriesData, isLoading, isError, error, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({ data: { name: newCategoryName } }).unwrap();
      setNewCategoryName('');
      toast.success('Category created successfully');
      refetch();
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category. Please try again.');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await updateCategory({ 
        id: editingCategory.documentId, 
        data: { name: editingCategory.name }
      }).unwrap();
      setEditingCategory(null);
      toast.success('Category updated successfully');
      refetch();
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully');
        refetch();
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (isError) return <div className={styles.error}>Error: {error.toString()}</div>;

  return (
    <div className={styles.categoryContainer}>
      <h1 className={styles.pageTitle}>Manage Categories as Admin</h1>
      <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className={styles.categoryForm}>
        <input
          type="text"
          value={editingCategory ? editingCategory.name : newCategoryName}
          onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          required
          className={styles.formInput}
        />
        <button type="submit" className={styles.submitButton}>
          {editingCategory ? 'Update Category' : 'Create Category'}
        </button>
        {editingCategory && (
          <button type="button" onClick={() => setEditingCategory(null)} className={styles.cancelButton}>
            Cancel Edit
          </button>
        )}
      </form>
      <div className={styles.categoriesList}>
        {categoriesData?.data.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            <span>{category.name}</span>
            <div className={styles.categoryActions}>
              <button onClick={() => setEditingCategory(category)} className={styles.editButton}>Edit</button>
              <button onClick={() => handleDeleteCategory(category.documentId)} className={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;