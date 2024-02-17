import { createSignal, createEffect, createResource } from "solid-js";
import { render } from "solid-js/web";

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const fetchUser = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}/`);
    if (!response.ok) {
      throw new Error("Word not found");
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

const App = () => {
  const [wordId, setWordId] = createSignal("");
  const [debouncedWordId, setDebouncedWordId] = createSignal("");
  const [text, { refetch }] = createResource(debouncedWordId, fetchUser);

  // Debounce the word input
  const debouncedSetWordId = debounce(setDebouncedWordId, 500);

  const handleInput = (e) => {
    const newWord = e.currentTarget.value;
    setWordId(newWord);
    debouncedSetWordId(newWord);
  };

  createEffect(() => {
    refetch();
  });

  return (
    <>
      <input
        type="text"
        placeholder="Type a word..."
        onInput={handleInput}
      />
      <span>{text.loading && "Loading..."}</span>
      <div>
        {text() && !text().error && text().length > 0 && (
          <div>
            <h3>Dictionary: {text()[0].word}</h3>
            <div>
              {text()[0].meanings.map((meaning, index) => (
                <div key={index}>
                  <h4>{meaning.partOfSpeech}</h4>
                  <ul>
                    {meaning.definitions.map((definition, idx) => (
                      <li key={idx}>
                        <p>Definition: {definition.definition}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {text()[0].phonetics && text()[0].phonetics.length > 0 && (
              <div>
                <h4>Dictionary Audio:</h4>
                <audio controls src={text()[0].phonetics[0].audio}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
        {text() && text().error && <div>Error: {text().error}</div>}
      </div>
    </>
  );
};

render(App, document.getElementById("wordapp"));
