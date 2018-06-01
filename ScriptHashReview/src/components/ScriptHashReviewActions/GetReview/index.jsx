import React from "react";
import injectSheet from "react-jss";
import { PropTypes, string } from "prop-types";
import { react } from "@nosplatform/api-functions";
import { u, wallet } from "@cityofzion/neon-js";
import { unhexlify, hexlify } from "binascii";

const { injectNOS, nosProps } = react.default;

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class GetReview extends React.Component {
  static defaultProps = {
    scriptHash: "f6329adf3ad3f0028b2c9ea63a3247ab51710bed"
  };

  static propTypes = {
    scriptHash: string
  };

  constructor(props) {
    super(props);
    this.state = {
      address: "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y",
      scriptHashReview: "55526d13aa05b8c6f69b31028e11618351a68175",
      retrievedReviewOwner: "",
      retrievedScriptHash: "",
      retrievedRating: "",
      retrievedComment: ""
    };

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeScriptHashReview = this.handleChangeScriptHashReview.bind(this);

    this.handleGetReview = this.handleGetReview.bind(this);
  }

  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }
  handleChangeScriptHashReview(event) {
    this.setState({ scriptHashReview: event.target.value });
  }

  handleGetReview = async () => {
    const { nos, scriptHash } = this.props;
    const { address, scriptHashReview } = this.state;
    const operation = "getReview";
    const encodedAddress = await unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(address)));
    const args = [encodedAddress, scriptHashReview];

    nos
      .testInvoke({ scriptHash, operation, args })
      .then(script => this.handleDisplayReview(script));
  };

  handleDisplayReview(script) {
    const { retrievedReviewOwner, retrievedScriptHash, retrievedRating, retrievedComment } = this.state;

    const stringifiedJSON = JSON.stringify(script);
    const parsedJSON = JSON.parse(stringifiedJSON);



    const responseStack = parsedJSON.stack;
    const responseStackStringifiedJSON = JSON.stringify(responseStack);
    const parsedResponseStack = JSON.parse(responseStackStringifiedJSON);
    const stringifiedResponseValue = JSON.stringify(parsedResponseStack);
    const parsedResponseValue = JSON.parse(stringifiedResponseValue)[0];

    const reviewOwnerStringified = JSON.stringify(parsedResponseValue.value[0]);
    const reviewOwnerParsedValue = JSON.parse(reviewOwnerStringified).value;
    const reviewOwnerHexstring2str = u.hexstring2str(reviewOwnerParsedValue);
    const reviewOwnerHexlify = hexlify(reviewOwnerHexstring2str);
    const reviewOwnerReverseHex = u.reverseHex(reviewOwnerHexlify);
    const reviewOwner = wallet.getAddressFromScriptHash(reviewOwnerReverseHex);
    this.setState({ retrievedReviewOwner: reviewOwner });

    const scriptHashStringified = JSON.stringify(parsedResponseValue.value[1]);
    const scriptHash = u.hexstring2str(JSON.parse(scriptHashStringified).value);
    this.setState({ retrievedScriptHash: scriptHash });

    const ratingStringified = JSON.stringify(parsedResponseValue.value[2]);
    const rating = JSON.parse(ratingStringified).value;
    this.setState({ retrievedRating: rating });

    const commentStringified = JSON.stringify(parsedResponseValue.value[3]);
    const comment = u.hexstring2str(JSON.parse(commentStringified).value);
    this.setState({ retrievedComment: comment });

    const responseGas_consumed = parsedJSON.gas_consumed;
    const responseScript = parsedJSON.script;
    const responseState = parsedJSON.state;
    const responseTx = parsedJSON.tx;

  }

  render() {
    return (
      <div>
        <h1>Get review</h1>
        <p>
          Address:
          <input type="text" value={this.state.address} onChange={this.handleChangeAddress} />
        </p>
        <p>
          ScriptHash:
          <input
            type="text"
            value={this.state.scriptHashReview}
            onChange={this.handleChangeScriptHashReview}
          />
        </p>
        <button onClick={this.handleGetReview}>Get review</button>
        <h2>Retrieved review</h2>
        <p>
          Review owner
          <input type="text" value={this.state.retrievedReviewOwner} />
        </p>
        <p>
          Script Hash
          <input type="text" value={this.state.retrievedScriptHash} />
        </p>
        <p>
          Rating
          <input type="text" value={this.state.retrievedRating} />
        </p>
        <p>
          Comment
          <input type="text" value={this.state.retrievedComment} />
        </p>
      </div>
    );
  }
}

GetReview.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(GetReview));
