import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'
import './index.css'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      notes: [],
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return
    }

    this.setState({ isLoading: false })
  }

  handleNoteClick = event => {
    event.preventDefault()
    this.props.history.push(event.currentTarget.getAttribute('href'))
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            width: '30%',
          }}
        >
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? 'Welcome!' : this.renderLander()}
      </div>
    )
  }
}
