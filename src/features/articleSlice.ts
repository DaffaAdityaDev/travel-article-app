import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types/article';

interface ArticleState {
  articles: Article[];
}

const initialState: ArticleState = {
  articles: [],
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.push(action.payload);
    },
    updateArticle: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex(article => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    deleteArticle: (state, action: PayloadAction<number>) => {
      state.articles = state.articles.filter(article => article.id !== action.payload);
    },
  },
});

export const { setArticles, addArticle, updateArticle, deleteArticle } = articleSlice.actions;
export default articleSlice.reducer;

export const selectAllArticles = (state: { article: ArticleState }) => state.article.articles;