import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory as createHistory } from "history";

import { create as createJss } from "jss";
import camelCase from "jss-camel-case";
import globalStyles from "jss-global";
import vendorPrefixer from "jss-vendor-prefixer";
import { JssProvider } from "react-jss";

import App from "./views/App";
// import Service from "./Service";
import Service from "./Service.dev";

window.Service = Service

const jss = createJss();
jss.use(vendorPrefixer(), camelCase(), globalStyles());

const History = createHistory()

ReactDOM.render(
  <JssProvider jss={jss}>
    <App history={History} service={Service} />
  </JssProvider>,
  document.getElementById("root")
);
