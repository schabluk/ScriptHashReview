import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { react } from "@nosplatform/api-functions";
import { u, sc, wallet } from "@cityofzion/neon-js";
import { unhexlify } from "binascii";

const { injectNOS, nosProps } = react.default;

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class NOSActions extends React.Component {
  handleAlert = async func => alert(await func);

  // handleGetAddress = async () => alert(await this.props.nos.getAddress());

  handleClaimGas = () =>
    this.props.nos
      .claimGas()
      .then(alert)
      .catch(alert);

  handleGetReview = async () => {
    const { nos } = this.props;
    // Add your smart contract's scriptHash here
    const scriptHash = "f6329adf3ad3f0028b2c9ea63a3247ab51710bed";

    // The operation of your smart contract you want to (test)invoke
    const operation = "getReview";
    const encodedAddress = await unhexlify(
      u.reverseHex(wallet.getScriptHashFromAddress("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y"))
    );
    const args = [encodedAddress, "55526d13aa05b8c6f69b31028e11618351a68175"];
    nos
      .testInvoke({ scriptHash, operation, args })
      .then(script => alert(`Test invoke script: ${JSON.stringify(script)} `));
  };

  render() {
    const { classes, nos } = this.props;

    const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    const rpx = "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9";

    // Add your smart contract's scriptHash here
    const scriptHash = "f6329adf3ad3f0028b2c9ea63a3247ab51710bed";

    // The operation of your smart contract you want to (test)invoke
    const operation = "getReview";

    // The necessary arguments for you (test)invoke
    const args = [
      unhexlify(
        u.reverseHex(wallet.getScriptHashFromAddress("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y"))
      ),
      "55526d13aa05b8c6f69b31028e11618351a68175"
    ];

    // The storagekey you want to query
    const key = "";

    // The amount and recipient of your send function
    const recipient = "";
    const amount = "";

    const invoke = { scriptHash, operation, args }; // and testInvoke
    const getStorage = { scriptHash, key };
    const send = { amount, asset: gas, recipient };

    return (
      <React.Fragment>
        <button onClick={this.handleGetReview}>Get review</button>

        <button className={classes.button} onClick={() => this.handleAlert(nos.getAddress())}>
          Get Address
        </button>
        <button
          className={classes.button}
          onClick={() => this.handleAlert(nos.getBalance({ asset: neo }))}
        >
          Get NEO Balance
        </button>
        <button
          className={classes.button}
          onClick={() => this.handleAlert(nos.getBalance({ asset: gas }))}
        >
          Get GAS Balance
        </button>
        <button
          className={classes.button}
          onClick={() => this.handleAlert(nos.getBalance({ asset: rpx }))}
        >
          Get RPX Balance
        </button>

        <button className={classes.button} onClick={this.handleClaimGas}>
          Claim Gas
        </button>
        <button className={classes.button} onClick={() => this.handleAlert(nos.send(send))}>
          Send GAS to...
        </button>

        <button className={classes.button} onClick={() => this.handleAlert(nos.testInvoke(invoke))}>
          TestInvoke
        </button>

        {/*
          <button
            className={classes.button}
            onClick={() => this.handleAlert(nos.invoke(invoke))}
          >
            Invoke
          </button>
        */}
        <button
          className={classes.button}
          onClick={() => this.handleAlert(nos.getStorage(getStorage))}
        >
          GetStorage
        </button>
      </React.Fragment>
    );
  }
}

NOSActions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(NOSActions));
