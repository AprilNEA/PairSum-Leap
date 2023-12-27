/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Online from "./Online";

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/online" component={Online} />
    </Router>
  ),
  document.getElementById("root")!,
);
