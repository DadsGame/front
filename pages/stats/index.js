import GenericCard from '../../components/GenericCard.js';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import styles from '../../styles/Stats.module.css';

const Stats = ({ stats }) => {
  const stat = stats[0] ?? {};
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    currency: 'EUR',
    style: 'currency',
  });
  return (
    <>
      <h1>Global stats</h1>
      <div className={styles.cards}>
        <GenericCard>
          <h2>Average money spent on games by players</h2>
          <span style={{ color: 'red', fontSize: 'large' }}>
            {currencyFormatter.format(stat.avg_spent)}
          </span>
        </GenericCard>
        <GenericCard>
          <h2>Average money gained on games by players</h2>
          <span style={{ color: 'green', fontSize: 'large' }}>
            {currencyFormatter.format(stat.avg_revenue)}
          </span>
        </GenericCard>
        <GenericCard>
          <h2>Total of money spent by players</h2>
          <span style={{ color: 'red', fontSize: 'large' }}>
            {currencyFormatter.format(stat.total_spent_players)}
          </span>
        </GenericCard>
        <GenericCard>
          <h2>Total of money gained by players</h2>
          <span style={{ color: 'green', fontSize: 'large' }}>
            {currencyFormatter.format(stat.total_revenue_players)}
          </span>
        </GenericCard>
        <GenericCard>
          <h2>User with the biggest library</h2>
          <div className={styles.winner}>
            <EmojiEventsIcon />
            <span style={{ color: 'gold', fontSize: 'large' }}>
              {stat.user_with_max_games}
            </span>
          </div>
        </GenericCard>
        <GenericCard>
          <h2>Most used status for games</h2>
          <span style={{ fontSize: 'large', fontStyle: 'italic' }}>
            {stat.most_present_status}
          </span>
        </GenericCard>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const url = new URL(
    '/games/stats/global',
    process.env.NEXT_PUBLIC_MAIN_API_URL
  );
  const res = await fetch(url.toString());
  const stats = await res.json();

  return {
    props: {
      stats,
    },
  };
}

export default Stats;
