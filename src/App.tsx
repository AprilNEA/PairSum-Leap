import { createSignal, onCleanup, onMount } from "solid-js";

function App() {
  const [numbers, setNumbers] = createSignal<number[]>([]);
  const [sum, setSum] = createSignal(0);

  const [answer, setAnswer] = createSignal("");
  const [score, setScore] = createSignal(0);

  const updateNumber = () => {
    const newNumber = Math.round(Math.random() * 99);
    const newNumbers = setNumbers((prev) => {
      if (prev.length >= 4) {
        return [newNumber, ...prev.slice(0, 3)];
      }
      return [newNumber, ...prev];
    });

    if (newNumbers.length >= 4) {
      const newSum = setSum(newNumbers[1] + newNumbers[3]);

      if (answer() !== "" && parseInt(answer()) === newSum) {
        setScore((prev) => prev + 1);
      } else {
        setScore(0);
      }
    }

    setAnswer("");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space" || event.code === "ArrowDown") {
      updateNumber();
    } else if (/^Digit[0-9]$/.test(event.code)) {
      if (numbers().length >= 3) {
        setAnswer((prev) => prev + event.key);
      }
    } else if (event.code === "Backspace") {
      setAnswer((prev) => prev.slice(0, -1));
    }
  };

  // const preventUpdate = (event: MouseEvent) => {
  //   event.stopPropagation();
  // };

  onMount(() => {
    updateNumber();
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div class="flex flex-col justify-between h-screen" onClick={updateNumber}>
      <div class="text-9xl text-center mt-0">{numbers()[0]}</div>
      <div class="text-5xl text-center mt-0">{answer()}</div>
      <div class="flex flex-row justify-between items-center">
        <div class="text-xl text-left mb-0 ml-0">{score()}</div>
        <div class="text-2xl text-gray-600 text-center mb-0">
          {!!sum() && sum()}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default App;
