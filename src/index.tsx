/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
// import { Router, Route } from "@solidjs/router";

render(
  () => (
    <App />
    // <Router>
    //   <Route path="/" component={App} />
    // </Router>
  ),
  document.getElementById("root")!,
);
