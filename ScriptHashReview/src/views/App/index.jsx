import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import { Route, Router, Switch, Link, NavLink } from 'react-router-dom'
import { Layout, Menu, Card, Rate, Tag } from 'antd'
import Slider from 'react-slick'

import ImageLoader from './../../components/ImageLoader'
import Placeholder from './../../components/Placeholder'
import Home from '../Home'
import NotFound from '../NotFound'
import debounce from '../../utils/debounce'

import 'antd/dist/antd.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import '../../stylesheets/index.css'

const { Header, Content } = Layout

const NEO = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
const GAS = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
  }

  state = {
    tokens: [],
    reviews: [],
    tokenIndex: 0,
    loading: false,
    address: 'None',
    neo: 0,
    gas: 0,
  }

  get selectedToken () {
    return this.state.tokens[this.state.tokenIndex]
  }

  // Slider DOM node handler.
  slider = null

  // Slider Settings.
  SliderSettings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 350,
    swipeToSlide: true,
    focusOnSelect: true,
    initialSlide: this.state.tokenIndex,
    afterChange: index => {
      this.setState({tokenIndex: index}, this.fetchReviews)
    },
  }

  onChangeToken = hash => {
    this.setState({reviews: [], loading: true})

    this.slider.slickGoTo(this.state.tokens.findIndex(t => t.hash === hash))
  }

  fetchReviews = debounce(() => {
    const { service: { contract: api } } = this.props
    const { hash } = this.selectedToken

    this.setState({reviews: [], loading: true}, () => {
      api.getReviews(hash).then(
        reviews => this.setState({reviews, loading: false})
      )
    })
  }, 1000)

  componentWillMount () {
    const { service: { contract: api, nos } } = this.props

    nos.getAddress()
      .then(address => this.setState({address}))
      .then(
        () => Promise.all([
          nos.getBalance(NEO),
          nos.getBalance(GAS)
        ]).then(
          ([neo, gas]) => (neo || gas) && this.setState({neo, gas})
        )
      )

    api.getTokens().then(tokens => this.setState({tokens, loading: true})).then(() => {
      // if (!this.selectedToken) return
      //
      // const { hash } = this.selectedToken
      //
      // api.getReviews(hash).then(
      //   reviews => this.setState({reviews, loading: false})
      // )
    })
  }

  // HoC for Router, to pass Service to the pages Component.
  StoreRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={
      props => (
        <Component
          {...props}
          service={this.props.service}
          tokens={this.state.tokens}
          tokenIndex={this.state.tokenIndex}
          reviews={this.state.reviews}
          loading={this.state.loading}
          onChangeToken={this.onChangeToken}
        />
      )
    } />
  )

  handleMenu = ({key}) => { this.props.history.push(key) }

  renderMenu () {
    const { history: { location: { pathname } } } = this.props

    return (
      <Menu
        style={{ lineHeight: '62px' }}
        theme='light'
        mode='horizontal'
        defaultSelectedKeys={[pathname]}
        onClick={this.handleMenu}
      >
        <Menu.Item key='/'>Home</Menu.Item>
        <Menu.Item key='/page-a'>My Ratings</Menu.Item>
        <Menu.Item key='/page-b'>Ecosystem</Menu.Item>
      </Menu>
    )
  }

  renderTokens () {
    const { tokens } = this.state

    if (!tokens.length) {
      return Array.from({length: 5}).map((v, i) => (
        <Placeholder.Token key={i} />
      ))
    }

    return tokens.map(({hash, name, symbol, supply, image}, key) => {
      // ToDo: fetch from backend or avg of last ratings.
      const averageRating = Math.floor(Math.random()*(9-5+1)+5)/2

      return (
        <Card key={key}
          bordered={false}
          className='slide'
          title={<ImageLoader src={image} alt={name} />}
          extra={<div className='symbol'>{symbol}</div>}>
          <div className='name'>{name}</div>
          <Rate disabled allowHalf defaultValue={averageRating} />
        </Card>
      )
    })
  }

  renderAccount () {
    const { address, neo, gas } = this.state

    return (
      <Fragment>
        <Tag color='blue'>Address: {address}</Tag>
        <Tag color='green'>NEO: {neo}</Tag>
        <Tag color='gold'>GAS: {gas}</Tag>
      </Fragment>
    )
  }

  reference = node => { this.slider = node }

  render () {
    const { StoreRoute } = this
    const { classes, history } = this.props

    return (
      <Router history={history}>
        <Layout className='app'>
          <Header className='header'>
            {/* this.renderMenu() */}
            { this.renderAccount() }
          </Header>
          <Slider {...this.SliderSettings} ref={this.reference}>
            { this.renderTokens() }
          </Slider>
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

export default injectSheet(styles)(App)
