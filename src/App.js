import { useState, useEffect } from "react";
import BpmnJS from "bpmn-js";
import "./styles.css";

export default function App() {
  const API_URL_BASE =
    "https://n35ro2ic4d.execute-api.eu-central-1.amazonaws.com/prod/engine-rest/";
  const defaultInput = "508340974-dc12-11e8-a8e9-0242ac110002";

  const [input, setInput] = useState(defaultInput);
  const [definitionId, setDefinitionId] = useState("");
  const [clicked, setClicked] = useState(false);
  const [bpmnXML, setBpmnXML] = useState("");

  useEffect(() => {
    console.log("effect");
    console.log(clicked);
    // if(clicked){
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL_BASE}process-instance/${input}`
        );
        if (!response.ok) throw Error("Not Found");
        const data = await response.json();
        setDefinitionId(data.definitionId);
        console.log(definitionId);
        // setClicked(false)
      } catch (error) {
        console.log(error);
        setDefinitionId("");
      }
    };
    fetchData();

    const fetchBPM = async () => {
      try {
        const response = await fetch(
          `${API_URL_BASE}process-definition/${definitionId}/xml`
        );
        console.log("BPM response:", response);
        const data = await response.json();
        setBpmnXML(data.bpmn20Xml);
      } catch (error) {}
    };
    fetchBPM();

    // the diagram you are going to display

    // BpmnJS is the BPMN viewer instance
    const viewer = new BpmnJS({ container: "#canvas" });

    // import a BPMN 2.0 diagram
    const fetchDiagram = async () => {
      try {
        // we did well!
        await viewer.importXML(bpmnXML);
        viewer.get("canvas").zoom("fit-viewport");
      } catch (err) {
        // import failed :-(
      }
    };
    fetchDiagram();
    // }
  }, [input, definitionId, clicked, bpmnXML]);

  return (
    <div className="App">
      <div>
        <input
          name="id"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="button" onClick={() => setClicked(true)}>
          Go
        </button>
      </div>

      <div>{input && <p>{definitionId}</p>}</div>
      <div id="canvas"></div>
    </div>
  );
}
