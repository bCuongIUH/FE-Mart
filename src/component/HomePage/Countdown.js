import React, { useRef, useState, useEffect } from "react";

const Countdown = () => {
  const [countdownHours, setCountdownHours] = useState("00");
  const [countdownMinutes, setCountdownMinutes] = useState("00");
  const [countdownSeconds, setCountdownSeconds] = useState("00");

  let interval = useRef();

  // Đếm ngược 24 giờ (86400000 milliseconds)
  const startTimer = () => {
    const countdownDuration = 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
    const endTime = new Date().getTime() + countdownDuration; // Thời gian kết thúc

    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      if (distance < 0) {
        clearInterval(interval.current);
        setCountdownHours("00");
        setCountdownMinutes("00");
        setCountdownSeconds("00");
      } else {
        setCountdownHours(hours);
        setCountdownMinutes(minutes);
        setCountdownSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(interval.current);
    };
  }, []); // Chỉ chạy 1 lần khi component được mount

  return (
    <div className="countdown d-flex">
      <div className="text">
        <p>Kết thúc sau:</p>
      </div>
      <div className="items d-flex justify-content-center align-items-center">
        <div className="box hour">
          <span>{countdownHours}</span>
        </div>
        <span className="colon-symbol">:</span>
        <div className="box minute">
          <span>{countdownMinutes}</span>
        </div>
        <span className="colon-symbol">:</span>
        <div className="box second">
          <span>{countdownSeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
