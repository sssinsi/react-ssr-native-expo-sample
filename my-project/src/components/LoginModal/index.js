import React, { Component } from 'react'
import styled from 'styled-components'

import { Modal } from 'src/containers'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 0.5rem;
  }
`

class LoginModal extends Component{
  componentWillReceiveProps(nextProps){
    if(!this.props.user && nextProps.user){
      this.props.onClose()
    }
  }
  
  render(){
    const {onFacebookLogin, onGoogleLogin, ...props} = this.props
    return (
      <Modal titile="Login" name="login" closeable {...props}>
        <Wrapper>
          <IconButton onClick={onFacebookLogin} icon="facebook">Connect with Facebook</IconButton>
          <IconButton onClick={onGoogleLogin} icon="google">Connect with Google</IconButton>
        </Wrapper>
      </Modal>
    )
  }
}

export default LoginModal