/* eslint-disable react/prop-types */
import EmojiButton from './EmojiButton';
export default function MemoryCard({
  handleClick,
  data,
  selectedCards,
  matchedCards,
}) {
  const emojiArray = [...data];
  const cardEl = emojiArray.map((emoji, index) => {
    const selectedCardEntry = selectedCards.find(
      (card) => card.index === index
    );
    const matchedCardEntry = matchedCards.find((card) => card.index === index);
    const cardStyle = matchedCardEntry
      ? 'card-item--matched'
      : selectedCardEntry
      ? 'card-item--selected'
      : '';

    return (
      <li key={index} className={`card-item ${cardStyle}`}>
        <EmojiButton
          selectedCardEntry={selectedCardEntry}
          matchedCardEntry={matchedCardEntry}
          handleClick={() => handleClick(emoji.name, index)}
          emoji={emoji}
          index={index}
        ></EmojiButton>
      </li>
    );
  });

  return <ul className="card-container">{cardEl}</ul>;
}
