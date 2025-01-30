/* eslint-disable react/prop-types */
function AssistiveTechInfo({ emojiData, matchedCards }) {
  return (
    <section className="sr-only" aria-live="polite" aria-atomic="true">
      <h2>Game status</h2>
      <p>Number of matched pairs: {matchedCards.length}</p>
      <p>
        Number of cards left to match: {emojiData.length - matchedCards.length}
      </p>
    </section>
  );
}

export default AssistiveTechInfo;
