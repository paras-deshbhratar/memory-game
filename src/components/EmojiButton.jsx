/* eslint-disable react/prop-types */
import { decodeEntity } from 'html-entities';
export default function EmojiButton({
  emoji,
  handleClick,
  selectedCardEntry,
  matchedCardEntry,
  index,
}) {
  const btnContent =
    selectedCardEntry || matchedCardEntry
      ? decodeEntity(emoji.htmlCode[0])
      : '?';
  const btnAria = matchedCardEntry
    ? `${emoji.name} "Matched."`
    : selectedCardEntry
    ? `${emoji.name} "Not matched yet.`
    : 'Card upside down';

  const btnStyle = matchedCardEntry
    ? 'btn--emoji__back--matched'
    : selectedCardEntry
    ? 'btn--emoji__back--selected'
    : 'btn--emoji__front';

  return (
    <button
      aria-label={`Position ${index+1}:  ${btnAria}`}
      className={`btn btn--emoji ${btnStyle}`}
      onClick={selectedCardEntry ? null : handleClick}
      disabled={matchedCardEntry}
      aria-live='polite'
    >
      {btnContent}
    </button>
  );
}
