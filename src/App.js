import "./App.css";
import Wave from "react-wavify";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  //Speech recognition
  const { transcript, resetTranscript, browserSupportsContinuousListening } =
    useSpeechRecognition();

  //Timer for transcript reset
  const [resetTimeout, setResetTimeout] = useState(null);

  //Does Iris animation show
  const [irisActive, setIrisActive] = useState(false);

  let irisIndex = -1;

  const responses = {
    hello: "Hi there!!!",
    "how are you":
      "I'm okay, although I dont really like being stuck in this computer",
    "who is your creator": "My creator is Marco.",
    "who are you": "I am the worlds worst voice assistant",
    undefined: "I'm sorry I didn't understand that",
  };

  //Continous speech recognition
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  //Split the transcript into words
  const words = transcript.split(" ");

  //Find the index of the word "Iris"
  irisIndex = words.indexOf("Iris");
  // Display only the words after "iris" or the entire transcript if "iris" is not found
  let relevantTranscript = "";
  if (irisIndex !== -1) {
    relevantTranscript = words.slice(irisIndex + 1).join(" ");
  }

  function speak(text) {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    synth.speak(u);
  }

  //Read response and reset transcript when user has finished speaking
  useEffect(() => {
    if (transcript !== "") {
      if (irisIndex !== -1) {
        setIrisActive(true);
      }
      //Clear the existing resetTimeout when the user speaks again
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }

      //Set a new timer to reset the transcript after 1 second of silence
      const newResetTimeout = setTimeout(() => {
        resetTranscript();
        setIrisActive(false);

        //Speak the response
        speak(responses[relevantTranscript.toLowerCase()]);
      }, 2000);

      setResetTimeout(newResetTimeout);
    }
    // eslint-disable-next-line
  }, [transcript, resetTranscript]);

  //Does the browser support speech recognition
  if (!browserSupportsContinuousListening) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <div className="upper-container">
        <h1>Say 'Iris' to get started</h1>
        <p>{relevantTranscript}</p>
      </div>
      <Wave
        fill="#f79902"
        paused={false}
        className="wave"
        options={{
          amplitude: !irisActive ? 15 : 25,
          speed: !irisActive ? 0.25 : 1.25,
          points: 3,
        }}
      />
    </div>
  );
}

export default App;
