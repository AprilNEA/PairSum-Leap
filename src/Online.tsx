import { nanoid } from "nanoid";
import { createSignal, onCleanup, onMount } from "solid-js";

function Online() {
  /* User Input */
  const [answer, setAnswer] = createSignal("");

  /* Server Response*/
  const [number, setNumber] = createSignal<number>();
  const [score, setScore] = createSignal(0);

  const updateNumber = () => {
    fetch("/game", {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("id"),
        answer: answer(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNumber(data.number);
        setScore(data.score);
      });

    setAnswer("");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.code === "Space" ||
      event.code === "ArrowDown" ||
      event.code === "Enter"
    ) {
      updateNumber();
    } else if (/^Digit[0-9]$/.test(event.code)) {
      setAnswer((prev) => prev + event.key);
    } else if (event.code === "Backspace") {
      setAnswer((prev) => prev.slice(0, -1));
    }
  };

  onMount(() => {
    if (!localStorage.getItem("id")) {
      localStorage.setItem("id", nanoid());
    }
    updateNumber();
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div class="flex flex-col justify-between h-screen" onClick={updateNumber}>
      <div class="text-9xl text-center mt-0">{number()}</div>
      <div class="text-5xl text-center mt-0">{answer()}</div>
      <div class="text-xl text-left mb-0 ml-0">{score()}</div>
    </div>
  );
}

export default Online;
