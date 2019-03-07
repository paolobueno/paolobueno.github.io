import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5)
        }}
      >
        Written by <strong>{config.authorName}</strong>, a Brazilian based on Rotterdam, working as a software engineer at <a href='https://wearereasonablepeople.nl'>WEAREREASONABLEPEOPLE</a>.
      </p>
    )
  }
}

export default Bio
