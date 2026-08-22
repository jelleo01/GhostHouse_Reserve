import { useCallback, useState } from 'react';
import DoneScreen from './screens/DoneScreen';
import FormScreen from './screens/FormScreen';
import HomeScreen from './screens/HomeScreen';
import SelectScreen from './screens/SelectScreen';
import { EVENT_DATE } from './constants/schedule';
import './styles/ui.css';
import './App.css';

/**
 * 선택 버튼 색 조합 (index.css 참고)
 * 'theme-yellow' | 'theme-navy' | 'theme-purple'
 */
const THEME = 'theme-yellow';

/** 화면 흐름: home → select → form → done */
const EMPTY_FORM = { people: null, time: null, name: '', phone: '' };

export default function App() {
  const [screen, setScreen] = useState('home');
  const [form, setForm] = useState(EMPTY_FORM);

  /** 서버가 돌려준 예약 정보 (예약번호 등). 지금은 mock 응답이 들어온다. */
  const [reservation, setReservation] = useState(null);

  const patchForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const selectPeople = useCallback((people) => patchForm({ people }), [patchForm]);
  const selectTime = useCallback((time) => patchForm({ time }), [patchForm]);

  const handleSubmitted = useCallback((created) => {
    setReservation(created);
    setScreen('done');
  }, []);

  const restart = useCallback(() => {
    setForm(EMPTY_FORM);
    setReservation(null);
    setScreen('home');
  }, []);

  return (
    <div className={`phone-frame ${THEME}`}>
      {screen === 'home' && <HomeScreen onStart={() => setScreen('select')} />}

      {screen === 'select' && (
        <SelectScreen
          date={EVENT_DATE}
          people={form.people}
          time={form.time}
          onSelectPeople={selectPeople}
          onSelectTime={selectTime}
          onBack={() => setScreen('home')}
          onNext={() => setScreen('form')}
        />
      )}

      {screen === 'form' && (
        <FormScreen
          date={EVENT_DATE}
          people={form.people}
          time={form.time}
          name={form.name}
          phone={form.phone}
          onChange={patchForm}
          onBack={() => setScreen('select')}
          onSubmitted={handleSubmitted}
        />
      )}

      {screen === 'done' && (
        <DoneScreen
          name={reservation?.name ?? form.name}
          phone={reservation?.phone ?? form.phone}
          people={reservation?.people ?? form.people}
          time={reservation?.time ?? form.time}
          onRestart={restart}
        />
      )}

      {/* 화면 전체에 깔리는 비네팅 */}
      <div className="phone-frame__vignette" />
    </div>
  );
}
