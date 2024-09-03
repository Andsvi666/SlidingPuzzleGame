import React from 'react';
import style from './page.module.css';
import Image from 'next/image';

const Info = () => {
  return (
    <div className={style.container}>
      <div className={style.segment}>
        <div className={style.text}>
          <h1 className={style.header}>Sliding Puzzle</h1>
          <p className={style.parag}>Sliding puzzle is a game where you have to slide image 
          pieces into their correct positions. It features a square image segmented into 9, 16
          , or 25 equal square segments, with the bottom right segment removed to allow 
          neighboring pieces to be slid into the empty spot. The game is completed when 
          all segments are in their correct positions, and the image is fully visible.</p>
        </div>
        <div className={style.image}>
          <Image
            src="/info_image1.png"
            width={400}
            height={400}
            alt="sliding puzzle image 1"
          />
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.image}>
          <Image
            src="/info_image2.png"
            width={400}
            height={400}
            alt="sliding puzzle image 2"
          />
        </div>
        <div className={style.text}>
          <h1 className={style.header}>How to Play</h1>
          <p className={style.parag}>To play the game, you first need to register and log in 
          to the website at "Login" tab. Once you've done that, you'll be able to download the
           game from the "Download" tab and start playing. The game requires you to log in with
            the same information as your website login. It offers two game modes and is played
             until the image is completed.</p>
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.text}>
          <h1 className={style.header}>Game Modes</h1>
          <p className={style.parag}>Before you start the game, there are two game modes to 
          choose from: "Normal" mode allows you to select one of your game profiles that you 
          can set up in the "Profile" tab, while "Challenge" mode selects a random image for 
          you automatically. Both of these game modes have their own separate leaderboards 
          that can be viewed in the "Leaderboard" tab.</p>
        </div>
        <div className={style.image}>
          <Image
            src="/info_image3.png"
            width={400}
            height={400}
            alt="sliding puzzle image 3"
          />
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.image}>
          <Image
            src="/info_image4.png"
            width={400}
            height={400}
            alt="sliding puzzle image 4"
          />
        </div>
        <div className={style.text}>
          <h1 className={style.header}>Uploading Images</h1>
          <p className={style.parag}>Every user is allowed to upload a certain number of 
          images. This can be done in the "Profile" tab, which also provides a correct 
          image example, similar to ones you can see in these panels. Each uploaded image
           will need to be approved by an admin before it can be used in the game. 
           Different user types can upload different quantities of images.</p>
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.text}>
          <h1 className={style.header}>User Types</h1>
          <p className={style.parag}>There are three types of users: "Standard," "Premium,"
           and "Admin." The only difference between "Standard" and "Premium" users is
            that "Standard" users can upload only three images, while "Premium" users
             can upload up to ten. "Admin" users are special users who can upload an 
             unlimited number of pictures, but more importantly, they are responsible
              for managing data and have special privileges.</p>
        </div>
        <div className={style.image}>
          <Image
            src="/info_image5.png"
            width={400}
            height={400}
            alt="sliding puzzle image 5"
          />
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.image}>
          <Image
            src="/info_image6.png"
            width={400}
            height={400}
            alt="sliding puzzle image 6"
          />
        </div>
        <div className={style.text}>
          <h1 className={style.header}>How to Advance Your User Type</h1>
          <p className={style.parag}>Every new account starts as a "Standard" user.
           "Standard" users who demonstrate skill and dedication to the game may be
            rewarded by being upgraded to "Premium" users. Only the most trusted 
            and dedicated community members have a chance to become "Admin" once
             they earn the trust of other admins.</p>
        </div>
      </div>
      <div className={style.segment}>
        <div className={style.text}>
          <h1 className={style.header}>Game Scoring</h1>
          <p className={style.parag}>To have your name appear on top of the leaderboard,
           it's important to understand how scoring works. Each time a game is
            completed, the time in milliseconds is tracked from the beginning of the
             game to the moment the last puzzle piece is slid into its place. The
              actual game score is calculated based on both time and difficulty 
              settings. This means that you can earn more points by selecting a 
              harder difficulty setting, even if it takes longer to finish.</p>
        </div>
        <div className={style.image}>
          <Image
            src="/info_image7.png"
            width={400}
            height={400}
            alt="sliding puzzle image 7"
          />
        </div>
      </div>
    </div>
  );
}

export default Info;