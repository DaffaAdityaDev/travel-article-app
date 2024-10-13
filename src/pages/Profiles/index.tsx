import { useGetMeQuery } from '../../services/authApi';
import DetailProfile from '../../components/Profiles/DetailProfile';
import CommentedArticle from '../../components/Profiles/CommentedArticle';
import styles from './styles.module.css';

function Profiles() {
  const { data: user, isLoading, isError, error } = useGetMeQuery();

  if (isLoading) return <div className={styles.loading}>Loading profile...</div>;
  if (isError) return <div className={styles.error}>Error: {error.toString()}</div>;
  if (!user) return <div className={styles.error}>User not found</div>;

  return (
    <div className={styles.profilesContainer}>
      <h1 className={styles.pageTitle}>User Profile</h1>
      <div className={styles.profileContent}>
        <DetailProfile user={user} />
        <CommentedArticle user={user} />
      </div>
    </div>
  );
}

export default Profiles;