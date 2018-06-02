import React from "react";
import injectSheet from "react-jss";

import AddReview from "./../../components/ScriptHashReviewActions/AddReview";
import GetReview from "./../../components/ScriptHashReviewActions/GetReview";

import styles from "../../stylesheets/styles.scss";
import "../../stylesheets/bootstrap/css/bootstrap.min.css";

const App = () => (
  <div className={styles.App}>
    <section className="mb-0">
      <div className="container">
        <h2 className="text-center mt-5 mb-5">What is ScriptHashReview?</h2>
        <div className="row">
          <div className="col-12">
            <p>
              ScriptHashReview aims at allowing users to review every smart contract and their
              script hash associated, that are made available on the NEO Smart Economy. For each
              unique script hash on the NEO Blockchain, every user (public key) can leave a review
              with containing a rating as well as a comment associated to it.
            </p>
            <p>
              Down below, you will find all the functionalities available at the moment that
              interact with the blockchain to store and retrieve information from it.
            </p>
          </div>
        </div>
      </div>
    </section>

    <hr className={styles.lineBreak} />
    <AddReview />
    <hr className={styles.lineBreak} />
    <GetReview />
  </div>
);

export default injectSheet(styles)(App);
