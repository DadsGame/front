import React from "react";
import styles from '../styles/Home.module.css'

function Header (){
    const session = true;

    return (
        <header>
     <div className={styles.header}>
         <img src={"images/logo.png"} className={styles.logo}/>
         <div className={styles['label-container']}>
         <span className={styles.labels}>
             Home
         </span>
         <span className={styles.labels}>
             Library
         </span>
         <span className={styles.labels}>
             Stats
         </span>
         </div>
         <div className={styles['pp-container']} align="right">
             {!session ? (
                 <button onClick={signIn}>Login</button>
             ) : (
                 <img src={"images/pp.jpg"} onClick={signOut} className={styles.pp}/>
             )
             }
         </div>

     </div>
        </header>
    )
} export default Header;

function signIn(){
    console.log('login...')
}

function signOut() {
    console.log('logout...')
}
