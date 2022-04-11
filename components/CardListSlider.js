import {React} from 'react';
import styles from '../styles/CardListSlider.module.css'
import {Navigation, Keyboard} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react'
import GameCard from './GameCard';

import 'swiper/css';
import 'swiper/css/navigation';


const CardListSlider = ({games}) => {
    return(
        <div>
            <div className={styles['default-title']}>Top games</div>
            <Swiper
                slidesPerView={5}
                spaceBetween={20}
                modules={[Keyboard, Navigation]}
                keyboard={{
                    enabled: true,
                }}
                navigation={true}
                className={styles.swiper}
            >
                {games.map((game) => {
                    console.log(game);
                    return(
                        <SwiperSlide className={styles['swiper-slide']}>
                                <GameCard key={game.id} game={game}/>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};
export default CardListSlider;
