/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gtmStart } from 'store/actions'
import { gtmId } from '../config'

class GoogleTagManager extends Component {
  componentDidMount() {
    this.props.startGTM()
  }
  
  render() {
    const iframe = `
      <iframe
        src="//www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0"
        width="0"
        style="display:none;visibility:hidden">
      </iframe>
    `
    return <noscript dangerouslySetInnerHTML={{ __html: iframe }} />
  }
}

const mapDispatchToProps = dispatch => ({
  startGTM: () => dispatch(gtmStart(gtmId)),
})

export default connect(null, mapDispatchToProps)(GoogleTagManager)
