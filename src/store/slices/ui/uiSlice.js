import React, { Component } from 'react'
import { connect } from 'react-redux'

export class uiSlice extends Component {
  render() {
    return (
      <div>uiSlice</div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(uiSlice)