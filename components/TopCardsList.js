import {React} from 'react';
import styles from '../styles/TopCardsList.module.css';
import {Navigation, Keyboard} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import GameCard from "./GameCard.js";
import useBreakpoint from "../hooks/useBreakpoint.js";

const TOP_COLORS = {
    1: 'gold',
    2: 'silver',
    3: '#cd7f32',
    others: '#fff',
}

const TopCardsList = ({games}) => {

    const {breakPointName, slides} = useBreakpoint();

    return (
        <div className={styles['topten-card-container']}>
            <Swiper
                slidesPerView={slides}
                modules={[Keyboard, Navigation]}
                keyboard={{
                    enabled: true,
                }}
                navigation={true}
                className={styles.swiper}
            >
                    {games.map((game, index) => {
                        return (
                            <SwiperSlide className={styles['swiper-slide']}>
                                <div className={styles.card}>
                                    <GameCard title={game.name} score={game.aggregated_rating} cover={game.cover} scoreColor={TOP_COLORS[index+1] ?? TOP_COLORS.others}/>
                                </div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
        </div>
    );

};

export default TopCardsList;