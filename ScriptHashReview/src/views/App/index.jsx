import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import Header from "./../../components/Header";
import ScriptHashReviewActions from "./../../components/ScriptHashReviewActions";
import AddReview from "./../../components/ScriptHashReviewActions/AddReview";
import GetReview from "./../../components/ScriptHashReviewActions/GetReview";

const styles = {
  "@import": "https://fonts.googleapis.com/css?family=Source+Sans+Pro",
  "@global html, body": {
    fontFamily: "Source Sans Pro",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff"
  },
  App: {
    textAlign: "center"
  },
  intro: {
    fontSize: "large"
  },
  lineBreak: {
    width: "75%",
    borderTop: "1px solid #333333",
    margin: "32px auto"
  }
};

const App = ({ classes }) => (
  <div className={classes.App}>
    <Header title="This dApp lets you review ScriptHash!" />
    <p className={classes.intro}>
      The main page is here: <code>src/views/App/index.js</code>
    </p>
    <hr className={classes.lineBreak} />
    <ScriptHashReviewActions />
    <AddReview />
    <GetReview />
  </div>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(App);
