import React from "react"
import { Link, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

export default ({ data }) => {
  console.log(data)
  return (
    
    <Layout>
      <SEO title="Home" />
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Coffay House</title>
        <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"/>
      </Helmet> */}
        <div>
            <h1></h1>
            <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
            {data.allMarkdownRemark.edges.map(({ node }) => (
            <div 
              key={node.id}
              className="portfolio"
            >
              <Link to={node.fields.slug}>
                <h3> {node.frontmatter.title}{"  "} </h3>
              </Link>
                  <p className="publicationDate">{node.frontmatter.date}</p>
              
              <p>{node.excerpt}</p>
              
            </div>
            ))}
        </div>
    </Layout>
  )
}

export const query = graphql`
  query {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC}) {
        totalCount
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "DD MMMM, YYYY")
            }
            fields {
                slug
            }
            excerpt
          }
        }
      }
  }
`
