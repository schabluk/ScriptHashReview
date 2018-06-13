import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import { Route, Router, Switch, Link, NavLink } from 'react-router-dom'
import { Layout, Menu, Card, Rate } from 'antd'
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

class App extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
  }

  state = {
    tokens: [],
    reviews: [],
    tokenIndex: 0
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
    this.setState({reviews: []})

    this.slider.slickGoTo(this.state.tokens.findIndex(t => t.hash === hash))
  }

  fetchReviews = debounce(() => {
    const { service: { contract: api } } = this.props
    const { hash } = this.selectedToken

    this.setState({reviews: []}, () => {
      api.getReviews(hash).then(reviews => this.setState({reviews}))
    })
  }, 1000)

  componentWillMount () {
    const { service: { contract: api } } = this.props

    api.getTokens().then(tokens => this.setState({tokens})).then(() => {
      const { hash } = this.selectedToken

      api.getReviews(hash).then(reviews => this.setState({reviews}))
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
      return Array.from({length: 5}).map((v, i) => {
        return <Placeholder.Token key={i} />
      })
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

  reference = node => { this.slider = node }

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
