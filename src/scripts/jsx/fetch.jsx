import { createSignal, createResource } from 'solid-js';
import { render, Show } from 'solid-js/web';

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const fetchWord = async (word) => {
  if (word != '') {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}/`
      );
      if (!response.ok) {
        throw new Error(`${word} is not in the dictionary.`);
      }
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }
};

const App = () => {
  const [wordId, setWordId] = createSignal('');
  const [debouncedWordId, setDebouncedWordId] = createSignal('');
  const [text] = createResource(debouncedWordId, fetchWord);

  // Debounce the word input
  const debouncedSetWordId = debounce(setDebouncedWordId, 500);

  const handleInput = (e) => {
    const newWord = e.currentTarget.value;
    setWordId(newWord);
    debouncedSetWordId(newWord);
  };

  return (
    <>
      <input type="text" placeholder="Type a word..." onInput={handleInput} />
      <Show when={text.loading}>
        <span>Loading...</span>
      </Show>
      <Show when={text() && text().error}>
        <div>Error: {text().error}</div>
      </Show>
      <Show
        when={text() && !text().error && !text.loading && text().length > 0}
      >
        <h3>Dictionary: {text()[0].word}</h3>

        {text()[0].meanings.map((meaning, index) => (
          <div key={index}>
            <h4>{meaning.partOfSpeech}</h4>
            <ul data-density-shift>
              {meaning.definitions.map((definition, idx) => (
                <li key={idx}>
                  <p>{definition.definition}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {text()[0].phonetics && text()[0].phonetics.length > 0 && (
          <>
            <h4>Dictionary Audio:</h4>
            <audio controls src={text()[0].phonetics[0].audio}>
              Your browser does not support the audio element.
            </audio>
          </>
        )}
      </Show>
    </>
  );
};

render(App, document.getElementById('wordapp'));