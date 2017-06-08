import React, {Component} from 'react'
import { connect } from 'react-redux'
import { fbAppId, googleClientId} from '../config'
import{ fromSocial} from '../store/selectors'
import {socialLoginPrepare, socialLoginRequest, modalHide} from '../store/actions'

import { LoginModal} from 'components'

class LgoinModalContainer extends Component{

}