import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import { injectNOS } from "../../nos";

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class NOSActions extends React.Component {
  handleGetAddress = async () => alert(await this.props.nos.getAddress());

  handleClaimGas = () =>
    this.props.nos
      .claimGas()
      .then(alert)
      .catch(alert);

  handleGetBalance = async scriptHash => alert(await this.props.nos.getBalance(scriptHash));

  handleTestInvoke = async (scriptHash, operation, args) =>
    alert(await this.props.nos.testInvoke(scriptHash, operation, args));

  handleInvoke = async (scriptHash, operation, args) =>
    alert(await this.props.nos.testInvoke(scriptHash, operation, args));

  handleGetStorage = async (scriptHash, key) =>
    alert(await this.props.nos.getStorage(scriptHash, key));

  render() {
    const { classes } = this.props;

    // Get Balance
    const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    // const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    // const rpx = "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9";

    // (test) Invoke
    const scriptHashNeoAuth = "2f228c37687d474d0a65d7d82d4ebf8a24a3fcbc";
    const operation = "9937f74e-1edc-40ae-96ad-1120166eab1b";
    const args = "ef68bcda-2892-491a-a7e6-9c4cb1a11732";

    // Get Storage
    const scriptHashNeoBlog = "85e9cc1f18fcebf9eb8211a128807e38d094542a";
    const key = "post.latest";

    return (
      <p>ok</p>
    );
  }
}

NOSActions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(NOSActions));

// import React from "react";
// import injectSheet from "react-jss";
// import { PropTypes, bool, string, func } from 'prop-types';
// import { nosPropTypes } from "@nosplatform/api-functions/es6";
//
//
// import { u, sc, wallet } from "@cityofzion/neon-js";
// import { unhexlify } from "binascii";
//
// import { injectNOS } from "../../nos";
//
// const styles = {
//   button: {
//     margin: "16px",
//     fontSize: "14px"
//   }
// };
//
// class ScriptHashReviewActions extends React.Component {
//
//   static propTypes = {
//     scriptHashScriptHashReview: string
//   };
//
//   static defaultProps = {
//     scriptHashScriptHashReview: '55526d13aa05b8c6f69b31028e11618351a68175'
//   };
//
//
//
//   handleGetAddress = async () => alert(await this.props.nos.getAddress());
//
//   handleClaimGas = () =>
//     this.props.nos
//       .claimGas()
//       .then(alert)
//       .catch(alert);
//
//   handleGetBalance = async scriptHash => alert(await this.props.nos.getBalance(scriptHash));
//
//   handleTestInvoke = async (scriptHash, operation, args) =>
//     alert(await this.props.nos.testInvoke(scriptHash, operation, args));
//
//   handleInvoke = async (scriptHash, operation, args) =>
//     alert(await this.props.nos.testInvoke(scriptHash, operation, args));
//
//   handleGetStorage = async (scriptHash, key) =>
//     alert(await this.props.nos.getStorage(scriptHash, key));
//
//
//     handleGetReview = async (address, scriptHash) =>
//     {
//       // const { scriptHashScriptHashReview } = this.props;
//       //
//       // const encodedAddress = await unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(address)));
//       // alert(encodedAddress);
//       // const args = [encodedAddress, scriptHash];
//       // alert(JSON.stringify(await this.props.nos.testInvoke(scriptHashScriptHashReview, 'getReview', args)));
//     };
//
//     handleAddReview = async (address, scriptHash, rating, text) =>
//     {
//       // const { scriptHashScriptHashReview } = this.props;
//       //
//       // // const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")));
//       // // const rating = u.int2hex(5);
//       // // const text = u.str2hexstring("Very good");
//       //
//       // const args = [address, scriptHash, rating, text];
//       // //const args = [address, 'bddc990a8f560ac78ca2645bc19e08de536f89c9']//, rating, text];
//       //
//       // alert(JSON.stringify(await this.props.nos.testInvoke(scriptHashScriptHashReview, 'getReview', args)));
//     };
//
//
//   render() {
//     const { classes } = this.props;
//
//     // Get Balance
//     const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
//     // const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
//     // const rpx = "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9";
//
//     // (test) Invoke
//     const scriptHashNeoAuth = "2f228c37687d474d0a65d7d82d4ebf8a24a3fcbc";
//     const operation = "9937f74e-1edc-40ae-96ad-1120166eab1b";
//     const args = "ef68bcda-2892-491a-a7e6-9c4cb1a11732";
//
//     // Get Storage
//     const scriptHashNeoBlog = "85e9cc1f18fcebf9eb8211a128807e38d094542a";
//     const key = "post.latest";
//
//     return (
//       <React.Fragment>
//     //   <form onSubmit={this.handleRegister}>
//     //     <Input
//     //       id="scriptHash"
//     //       label="Script Hash"
//     //       placeholder="Enter script hash"
//     //       value="ok1"
//     //     />
//     //     <Input
//     //       id="rating"
//     //       label="Rating"
//     //       placeholder="Give your rating"
//     //     />
//     //     <Input
//     //       id="comment"
//     //       label="Comment"
//     //       placeholder="Enter your comment"
//     //     />
//     //
//     //     <div>
//     //       <Button type="submit">Add review</Button>
//     //     </div>
//     // </form>
//         <div>
//
//           <button className={classes.button} onClick={this.handleFindReview}>
//           Find reviews for script hash
//           </button>
//         </div>
//
//         <div>
//           <button className={classes.button} onClick={this.handleAddReview}>
//           Add review
//           </button>
//         </div>
//
//         <div>
//           <button className={classes.button} onClick={() => this.handleGetReview('', 'bddc990a8f560ac78ca2645bc19e08de536f89c9')}>
//           Get review
//           </button>
//         </div>
//       </React.Fragment>
//     );
//   }
// }
//
// ScriptHashReviewActions.propTypes = {
//   classes: PropTypes.objectOf(PropTypes.any).isRequired,
//   nos: nosPropTypes.isRequired
// };
//
// export default injectNOS(injectSheet(styles)(ScriptHashReviewActions));
