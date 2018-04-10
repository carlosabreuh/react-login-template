import React, { Component } from 'react'
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap'
import { Auth } from 'aws-amplify'
import LoaderButton from '../../components/LoaderButton'
import './index.css'

export default class Forgot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email: '',
      newPassword: '',
      confirmationCode: '',
      forgotResponse: null,
    }
  }

  validateForm() {
    return this.state.email.length > 0
  }

  validateConfirmationForm() {
    return (
      this.state.confirmationCode.length > 0 &&
      this.state.newPassword.length > 0
    )
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.forgotPassword(this.state.email).then(async data =>
        this.setState({ forgotResponse: data })
      )
    } catch (e) {
      alert(e.message)
    }

    this.setState({ isLoading: false })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.confirmationCode,
        this.state.newPassword
      ).then(async data => {
        await Auth.signIn(this.state.email, this.state.newPassword).then(
          data => {
            console.log('signIn: ', data)
            this.props.userHasAuthenticated(true)
            this.props.history.push('/')
          }
        )
      })
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="number"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <FormGroup controlId="newPassword" bsSize="large">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            value={this.state.newPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>

        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Submit"
          loadingText="Submitting…"
        />
      </form>
    )
  }

  render() {
    return (
      <div className="Forgot">
        <h1 style={{ textAlign: 'center' }}>Forgot your password?</h1>
        {this.state.forgotResponse === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    )
  }
}
