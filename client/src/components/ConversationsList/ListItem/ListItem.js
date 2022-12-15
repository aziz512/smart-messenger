import styles from './ListItem.module.css';

export const ListItem = ({ isActive, onClick, title, subtitle }) => {
    const generateColorClass = () => {
        const which = title.length % 4;
        const colorClasses = [styles.purple, styles.red, styles.yellow, styles.green];
        return colorClasses[which];
    };
    return <div className={[styles.listItem, isActive && styles.active].join(' ')} onClick={onClick}>
        <div className={`${styles.profileCircle} ${generateColorClass()}`}>{title.toUpperCase()[0]}</div>
        <div>
            <div>
                <span className={styles.name}>{title}</span>
            </div>
            <div>{subtitle}</div>
        </div>
    </div>;
};