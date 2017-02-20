import React from 'react'
import { Link } from 'react-router'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import { rhythm, scale } from 'utils/typography'
import Helmet from 'react-helmet'
import { config } from 'config'
import include from 'underscore.string/include'
import Bio from 'components/Bio'
import { prefixLink } from 'gatsby-helpers'
import ptBrFlag from '../images/flags/br.png'
import enFlag from '../images/flags/gb.png'

const langFlags = {
  'pt-BR': ptBrFlag,
  'en': enFlag
}

class BlogIndex extends React.Component {
  render () {
    // Sort pages.
    const sortedPages = sortBy(this.props.route.pages, 'data.date')
    // Posts are those with md extension that are not 404 pages OR have a date (meaning they're a react component post).
    const visiblePages = sortedPages.filter(page => (
      get(page, 'file.ext') === 'md' && !include(page.path, '/404') || get(page, 'data.date')
    ))

    function liStyle (page) {
      const style = {
        marginBottom: rhythm(1 / 4)
      }
      const lang = get(page, 'data.lang')
      if (lang) {
        style.listStyle = `url(${prefixLink(langFlags[lang])})`
      }
      return style
    }
    return (
      <div>
        <Helmet
          title={config.blogTitle}
          meta={[
            {'name': 'description', 'content': "Paolo Bueno's developer blog"},
            {'name': 'keywords', 'content': 'blog, articles, technology'}
          ]}
        />
        <Bio />
        <ul>
          {visiblePages.map((page) => (
            <li
              key={page.path}
              style={liStyle(page)}
            >
              <p style={{marginBottom: rhythm(1 / 16)}}>
                <Link style={{boxShadow: 'none'}} to={page.path}>
                  {get(page, 'data.title', page.path)}
                </Link>
              </p>
              <p style={{...scale(-0.4)}}>{page.data.tagline}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

BlogIndex.propTypes = {
  route: React.PropTypes.object
}

export default BlogIndex
