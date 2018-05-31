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
      scriptHashReview: "55526d13aa05b8c6f69b31028e11618351a68175"
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
      .then(script => alert(`Test invoke script: ${JSON.stringify(script)} `));
  };

  render() {
    return (
      <div>
        <h1>Get review</h1>
        <label>
          Address:
          <input type="text" value={this.state.address} onChange={this.handleChangeAddress} />
        </label>
        <label>
          ScriptHash:
          <input
            type="text"
            value={this.state.scriptHashReview}
            onChange={this.handleChangeScriptHashReview}
          />
        </label>
        <button onClick={this.handleGetReview}>Get review</button>
      </div>
    );
  }
}

GetReview.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(GetReview));
