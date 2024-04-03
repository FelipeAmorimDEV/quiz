import { useState, useRef, useEffect } from "react";

const CountdownTimer = ({ seconds, onTimerFinished }) => {
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const lastRenderTimeRef = useRef(new Date().getTime());

  useEffect(() => {
    const timerId = setTimeout(() => {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastRenderTimeRef.current;
      const newTimeRemaining = Math.max(0, timeRemaining - Math.floor(timeElapsed / 1000));
      setTimeRemaining(newTimeRemaining);
      lastRenderTimeRef.current = currentTime;

      if (newTimeRemaining === 0) {
        onTimerFinished();
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeRemaining, onTimerFinished]);

  const minutes = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  return <p>{`${String(minutes).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`}</p>
}

export { CountdownTimer }