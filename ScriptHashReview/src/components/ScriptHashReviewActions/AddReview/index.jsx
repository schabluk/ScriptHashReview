import React from "react";
import injectSheet from "react-jss";
import { PropTypes, string } from "prop-types";
import { react } from "@nosplatform/api-functions";
import { u, wallet } from "@cityofzion/neon-js";
import { unhexlify } from "binascii";

const { injectNOS, nosProps } = react.default;

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

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
alert(args)
    nos
      .testInvoke({ scriptHash, operation, args })
      .then(script => alert(`Test invoke script: ${JSON.stringify(script)} `));
  };

  render() {
    return (
      <div>
        <label>
          ScriptHash:
          <input
            type="text"
            value={this.state.scriptHashReview}
            onChange={this.handleChangeScriptHashReview}
          />
        </label>
        <label>
          Rate this script hash:
          <select value={this.state.rating} onChange={this.handleChangeRating}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Comment:
          <textarea value={this.state.comment} onChange={this.handleChangeComment} />
        </label>
        <button onClick={this.handleAddReview}>Add review</button>
        <p>fqsdfs</p>
      </div>
    );
  }
}

AddReview.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(AddReview));
