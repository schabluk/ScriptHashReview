import React from "react";
import injectSheet from "react-jss";
import { string } from "prop-types";
import { react } from "@nosplatform/api-functions";
import { u, wallet } from "@cityofzion/neon-js";
import { unhexlify } from "binascii";

const { injectNOS, nosProps } = react.default;

class AddReview extends React.Component {
  static defaultProps = {
    scriptHash: "f6329adf3ad3f0028b2c9ea63a3247ab51710bed"
  };

  static propTypes = {
    scriptHash: string
  };

  constructor(props) {
    super(props);
    this.state = {
      scriptHashReview: "55526d13aa05b8c6f69b31028e11618351a681po",
      rating: "8",
      comment: "Veryyyyy good review"
    };

    this.handleChangeScriptHashReview = this.handleChangeScriptHashReview.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);

    this.handleAddReview = this.handleAddReview.bind(this);
  }

  handleChangeScriptHashReview(event) {
    this.setState({ scriptHashReview: event.target.value });
  }
  handleChangeRating(event) {
    this.setState({ rating: event.target.value });
  }
  handleChangeComment(event) {
    this.setState({ comment: event.target.value });
  }

  handleAddReview = async () => {
    const { scriptHashReview, rating, comment } = this.state;
    const { nos, scriptHash } = this.props;
    const operation = "addReview";
    const myAddress = await this.props.nos.getAddress();
    const myEncodedAddress = await unhexlify(
      u.reverseHex(wallet.getScriptHashFromAddress(myAddress))
    );

    const args = [myEncodedAddress, scriptHashReview, rating, comment];
    alert(args);
    nos
      .testInvoke({ scriptHash, operation, args })
      .then(script => alert(`Test invoke script: ${JSON.stringify(script)} `));
  };

  render() {
    return (
      <div>
        <section className="mb-0" id="resume">
          <div className="container">
            <h3 className="text-center mb-3">Add review</h3>
            <p>
              This function allows the user to write a review for a specific script hash. The user
              needs to mention the script hash they want to associate this rating to, its rating and
              a comment.
            </p>

            <div className="form-group">
              <b>
                <p>Script hash</p>
              </b>
              <input
                value={this.state.scriptHashReview}
                onChange={this.handleChangeScriptHashReview}
                type="text"
                className="form-control"
                placeholder="Script hash"
              />
            </div>
            <div className="form-group">
              <b>
                <p>Rating</p>
              </b>
              <select
                value={this.state.rating}
                onChange={this.handleChangeRating}
                className="form-control"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="1">6</option>
                <option value="2">7</option>
                <option value="3">8</option>
                <option value="4">9</option>
                <option value="5">10</option>
              </select>
            </div>
            <div className="form-group">
              <b>
                <p>Comment</p>
              </b>
              <textarea
                value={this.state.comment}
                onChange={this.handleChangeComment}
                className="form-control"
                rows="5"
                id="comment"
              />
            </div>
            <button
              onClick={this.handleAddReview}
              type="button"
              className="btn btn-outline-secondary btn-block"
            >
              Add review
            </button>
          </div>
        </section>
      </div>
    );
  }
}

AddReview.propTypes = {
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet()(AddReview));
