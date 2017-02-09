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
        Written by <strong>{config.authorName}</strong>, a Brazilian based in São Paulo, working as a software engineer at <a href='https://www.redhat.com'>Red Hat</a>.
      </p>
    )
  }
}

export default Bio
