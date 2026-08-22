import DeadTree from '../components/DeadTree';
import Ghost from '../components/Ghost';
import HauntedHouse from '../components/HauntedHouse';
import NightSky from '../components/NightSky';
import './HomeScreen.css';

/**
 * 1단계: 홈
 * @param {{ onStart: () => void }} props
 */
export default function HomeScreen({ onStart }) {
  return (
    <div className="home">
      <NightSky />

      <HauntedHouse className="home__house" />

      <div className="home__tree home__tree--left">
        <DeadTree width={124} height={512} trunkWidth={22} />
      </div>
      <div className="home__tree home__tree--right">
        <DeadTree width={134} height={552} trunkWidth={24} />
      </div>

      {/* 떠다니는 유령 */}
      <div className="home__ghost home__ghost--a">
        <Ghost width={46} height={58} eyeRy={3.6} mouth className="ghost-glow--a" />
      </div>
      <div className="home__ghost home__ghost--b">
        <Ghost
          width={30}
          height={38}
          fill="#dfe6ff"
          eyeCx={[14.5, 25.5]}
          eyeRx={2.4}
          eyeRy={3.2}
          className="ghost-glow--b"
        />
      </div>

      <div className="home__fog home__fog--left" />
      <div className="home__fog home__fog--right" />

      <div className="home__title-block">
        <h1 className="home__title">귀신의 집</h1>
        <p className="home__subtitle">
          <span className="home__subtitle-brand">PULSE</span>
          <span className="home__subtitle-dot" />
          <span>세란제</span>
        </p>
      </div>

      <div className="home__cta-row">
        <Ghost width={24} height={30} className="ghost-bob--1" />
        <button type="button" className="home__cta" onClick={onStart}>
          <span>예약하기</span>
        </button>
        <Ghost width={20} height={25} className="ghost-bob--2" />
      </div>
    </div>
  );
}
