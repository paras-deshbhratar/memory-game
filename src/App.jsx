import { useState, useEffect, useRef } from 'react';
import Form from './components/Form';
import MemoryCard from './components/MemoryCard';
import Header from './components/Header';
import Footer from './components/Footer';
import AssistiveTechInfo from './components/AssistiveTechInfo';
import GameOver from './components/GameOver';
import ErrorCard from './components/ErrorCard';
import Confetti from 'react-confetti';
import flip from './assets/flip.mp3';
import correct from './assets/correct.mp3';
import cheer from './assets/cheer.mp3';

export default function App() {
  const [formData, setFormData] = useState(() => ({
    category: 'animals-and-nature',
    number: 10,
  }));
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojiData, setEmojiData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [areAllCardsMatched, setAreAllCardsMatched] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const soundRefs = useRef({
    flip: new Audio(flip),
    correct: new Audio(correct),
    cheer: new Audio(cheer),
  });

  useEffect(() => {
    if (emojiData.length > 0 && matchedCards.length === emojiData.length) {
      setAreAllCardsMatched(true);
      playSound('cheer');
    }
  }, [matchedCards, emojiData]);

  useEffect(() => {
    if (
      selectedCards.length === 2 &&
      selectedCards[0].name === selectedCards[1].name
    ) {
      playSound('correct');
      setMatchedCards((prevMatchedCards) => [
        ...prevMatchedCards,
        ...selectedCards,
      ]);
    }
  }, [selectedCards]);

  function handleFormChange(e) {
    const { name, value } = e.currentTarget;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function startGame(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://emojihub.yurace.pro/api/all/category/${formData.category}`
      );
      if (!response.ok) throw new Error('Could not fetch data from API');
      const data = await response.json();
      const slicedData = getDataSlice(data, formData.number / 2);
      setEmojiData(getEmojisArray(slicedData));
      setIsGameOn(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
  }

  function getDataSlice(data, number) {
    const indices = getRandomIndices(data, number);
    return indices.map((i) => data[i]);
  }

  function getRandomIndices(data, numOfIndices) {
    const indices = new Set();
    while (indices.size < numOfIndices) {
      indices.add(Math.floor(Math.random() * data.length));
    }
    return [...indices];
  }

  function getEmojisArray(data) {
    const pairedEmojis = [...data, ...data];
    // Fisher Yates Algorithm to shuffle the array
    for (let i = pairedEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedEmojis[i], pairedEmojis[j]] = [pairedEmojis[j], pairedEmojis[i]];
    }
    return pairedEmojis;
  }

  function turnCard(name, index) {
    playSound('flip');
    setSelectedCards((prev) =>
      prev.length < 2 ? [...prev, { name, index }] : [{ name, index }]
    );
  }

  function resetGame() {
    setIsGameOn(false);
    setAreAllCardsMatched(false);
    setSelectedCards([]);
    setMatchedCards([]);
    setAreAllCardsMatched(false);
  }

  function resetError() {
    setIsError(false);
  }

  function handleOnChangeShowNumber() {
    setShowNumber(!showNumber);
  }

  const playSound = (soundName) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.currentTime = 0; // Reset the sound to the beginning
      sound.play();
    }
  };

  return (
    <>
      <main>
        <Header />
        {!isGameOn && !isError && (
          <Form handleSubmit={startGame} handleChange={handleFormChange} />
        )}
        {isGameOn && !areAllCardsMatched && (
          <AssistiveTechInfo
            emojiData={emojiData}
            matchedCards={matchedCards}
          />
        )}
        {areAllCardsMatched && <Confetti />}
        {areAllCardsMatched && <GameOver handleClick={resetGame} />}

        {isGameOn && (
          <>
            {!areAllCardsMatched && (
              <form className="wrapper showNumber">
                <input
                  type="checkbox"
                  id="showNumber"
                  name="showNumber"
                  value="showNumber"
                  checked={showNumber}
                  onChange={handleOnChangeShowNumber}
                />
                <label htmlFor="showNumber">Show number</label>
              </form>
            )}

            <MemoryCard
              handleClick={turnCard}
              data={emojiData}
              selectedCards={selectedCards}
              matchedCards={matchedCards}
              showNumber={showNumber}
            />
          </>
        )}
        {isError && <ErrorCard handleClick={resetError} />}
      </main>
      <Footer />
    </>
  );
}
