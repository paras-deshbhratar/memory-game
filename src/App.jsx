import { useState, useEffect } from 'react';
import Form from './components/Form';
import MemoryCard from './components/MemoryCard';
import Header from './components/Header';
import Footer from './components/Footer';
import AssistiveTechInfo from './components/AssistiveTechInfo';
import GameOver from './components/GameOver';
import ErrorCard from './components/ErrorCard';
import Confetti from 'react-confetti';

export default function App() {
  const initialFormData = { category: 'animals-and-nature', number: 4 };
  const [formData, setFormData] = useState(initialFormData);
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojiData, setEmojiData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [areAllCardsMatched, setAreAllCardsMatched] = useState(false);
  const [isError, setIsError] = useState(false);
  console.log(formData);

  useEffect(() => {
    if (emojiData.length > 0 && matchedCards.length === emojiData.length) {
      setAreAllCardsMatched(true);
    }
  }, [matchedCards]);

  useEffect(() => {
    if (
      selectedCards.length === 2 &&
      selectedCards[0].name === selectedCards[1].name
    ) {
      setMatchedCards((prevMatchedCards) => [
        ...prevMatchedCards,
        ...selectedCards,
      ]);
    }
  }, [selectedCards]);

  function handleFormChange(e) {
    const { name, value } = e.currentTarget;
    console.log(name, value)
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function startGame(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://emojihub.yurace.pro/api/all/category/${formData.category}`
      );
      if (!response.ok) {
        throw new Error('Could not fetch data from API');
      }
      const data = await response.json();
      const dataSlice = getDataSlice(data, formData.number / 2);
      const emojjiArray = getEmojisArray(dataSlice);
      setEmojiData(emojjiArray);
      setIsGameOn(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
  }

  function getRandomIndices(data, numOfIndices) {
    const randomIndicies = [];
    for (let i = 0; i < numOfIndices; i++) {
      const randomNum = Math.floor(Math.random() * data.length);
      if (!randomIndicies.includes(randomNum)) {
        randomIndicies.push(randomNum);
      } else {
        i--;
      }
    }
    return randomIndicies;
  }

  function getDataSlice(data, number) {
    const randomIndices = getRandomIndices(data, number);
    return randomIndices.map((index) => data[index]);
  }

  function getEmojisArray(data) {
    const pairedEmojisArray = [...data, ...data];
    // Fisher Yates Algorithm to shuffle the array
    for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = pairedEmojisArray[i];
      pairedEmojisArray[i] = pairedEmojisArray[j];
      pairedEmojisArray[j] = temp;
    }
    return pairedEmojisArray;
  }

  function turnCard(name, index) {
    if (selectedCards.length < 2) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        { name, index },
      ]);
    } else if (selectedCards.length === 2) {
      setSelectedCards([{ name, index }]);
    }
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
          <MemoryCard
            handleClick={turnCard}
            data={emojiData}
            selectedCards={selectedCards}
            matchedCards={matchedCards}
          />
        )}
        {isError && <ErrorCard handleClick={resetError} />}
      </main>
      <Footer />
    </>
  );
}
