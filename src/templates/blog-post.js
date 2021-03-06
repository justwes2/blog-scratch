import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => {
    {console.log(data)}
    const post = data.markdownRemark
    return (
        <Layout>
            <SEO title={post.frontmatter.title} />
            <div className="portfolio">
                <h1>{post.frontmatter.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <Link to="/">Back to Home</Link>
            </div>
        </Layout>
    )
}

export const query = graphql`
  query($slug: String!) {
      markdownRemark(fields: { slug: { eq: $slug } }) {
          html
          frontmatter {
              title
          }
      }
  }
`