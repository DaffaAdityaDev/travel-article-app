import { User } from '../../../types/auth';
import styles from './styles.module.css';

function DetailProfile({ user }: { user: User } ) {
  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.sectionTitle}>User Information</h2>
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Username:</span>
            <span className={styles.infoValue}>{user.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Joined:</span>
            <span className={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Account Status:</span>
            <span className={`${styles.infoValue} ${user.blocked ? styles.statusBlocked : styles.statusActive}`}>
              {user.blocked ? 'Blocked' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProfile;
