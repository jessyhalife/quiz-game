import React, { useEffect, useState } from "react";
import Answer from "../../components/Answer";
import Item from "../../types";
import api from "./api";
import styles from "./styles.module.scss";
import Confetti from "react-dom-confetti";

enum Status {
  LOADING,
  ERROR,
  READY,
  FINISHED,
  PLAYING,
}

const Game: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [current, setCurrent] = useState<number>(-1);
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const [wasOk, setWasOk] = useState<boolean | undefined>(undefined);
  const [points, setPoints] = useState<number>(0);
  const [tiempo, setTiempo] = useState<number>(5);

  useEffect(() => {
    getData().catch(null);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      verify(undefined);
    }, 5000);

    const intervalId = setInterval(() => {
      setTiempo((tiempo) => tiempo - 1);
    }, 1000);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [current]);

  const restart = () => {
    setStatus(Status.LOADING);
    setCurrent(-1);
    setWasOk(undefined);
    setTiempo(5);
    setPoints(0);
    getData();
  };

  const getData = async () => {
    const data = await api.fetch(5);
    setItems(data);
    setStatus(Status.READY);
    if (data && data.length > 0) setCurrent(0);
  };

  function verify(selectedAnswer: string | undefined) {
    let ok = !selectedAnswer
      ? false
      : selectedAnswer === items[current].correct_answer;
    setWasOk(ok);
    if (ok) setPoints(points + 10);
    else setPoints(points - 10);
    setTimeout(() => {
      if (current === items.length - 1) setStatus(Status.FINISHED);
      setCurrent(current + 1);
      setTiempo(5);
      setWasOk(undefined);
    }, 1000);
  }

  return (
    <div className={styles.container}>
      <Confetti active={status === Status.FINISHED} />
      {status === Status.READY && (
        <button
          className={styles.play}
          onClick={() => setStatus(Status.PLAYING)}
        >
          Start Game
        </button>
      )}
      {status === Status.LOADING && <h1>loading</h1>}
      {status === Status.FINISHED && (
        <div className={styles.done}>
          <div> Done, you got {points} points! </div>
          <button onClick={restart}>
            {points > 0 ? "Play again" : "Try again :("}
          </button>
        </div>
      )}
      {status === Status.PLAYING && (
        <React.Fragment>
          <div className={styles.header}>
            <div className={styles.counter}>
              {current + 1}/{items.length}
            </div>
          </div>
          <div>{tiempo >= 0 ? tiempo : "Time's UP!"}</div>
          <div className={styles.difficulty}>{items[current]?.difficulty}</div>
          <div className={styles.category}>{items[current]?.category}</div>
          <div className={styles.question}>
            <span
              dangerouslySetInnerHTML={{ __html: items[current]?.question }}
            ></span>
          </div>

          <div className={styles.list}>
            {items[current]?.incorrect_answers
              .concat(items[current]?.correct_answer)
              .sort((a, b) => {
                return a.localeCompare(b);
              })
              .map((answ) => {
                return (
                  <Answer
                    valid={answ === items[current]?.correct_answer}
                    key={answ}
                    text={answ}
                    onClick={() => verify(answ)}
                    verified={wasOk}
                  />
                );
              })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Game;
