import { createSignal, createResource } from "solid-js";
import { render } from "solid-js/web";

const fetchUser = async (word) =>
  (await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}/`)).json();

const App = () => {
  const [wordId, setWordId] = createSignal();
  const [text] = createResource(wordId, fetchUser);

  return (
    <>
      <input
        type="text"
        placeholder="Type a word..."
        onInput={(e) => setWordId(e.currentTarget.value)}
      />
      <span>{text.loading && "Loading..."}</span>
      <div>
        <pre>{JSON.stringify(text(), null, 2)}</pre>
      </div>
    </>
  );
};

render(App, document.getElementById("wordapp"));