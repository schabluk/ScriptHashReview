import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Route, Router, Switch, Link, NavLink } from 'react-router-dom';
import { Layout } from 'antd'

import AddReview from './../../components/ScriptHashReviewActions/AddReview';
import GetReview from './../../components/ScriptHashReviewActions/GetReview';
import Home from '../Home'
import NotFound from '../NotFound'

// import styles from '../../stylesheets/styles.scss';
// import '../../stylesheets/bootstrap/css/bootstrap.min.css';
import 'antd/dist/antd.css'
import '../../stylesheets/index.css';

const { Header, Content } = Layout

class App extends React.Component {
  static propTypes = {
     history: PropTypes.object.isRequired,
     service: PropTypes.object.isRequired,
   }

  // HoC for Router, to pass Service to the pages Component.
  StoreRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={
      props => <Component {...props} service={this.props.service} />
    } />
  )

  render () {
    const { StoreRoute } = this
    const { classes, history } = this.props

    return (
      <Router history={history}>
        <Layout className='app'>
          <Header className='header'>
            {/* this.renderLogo() */}
            {/* this.renderMenu() */}
          </Header>
          <Content>
            <Switch>
              <StoreRoute exact path='/' component={Home} />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Router>
    )
  }
}

// Any JavaScript styles to inject.
const styles = {
  Body: {
    backgroundColor: 'white'
  }
}

export default injectSheet(styles)(App);
