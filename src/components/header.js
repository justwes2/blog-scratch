import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import profile from "../images/profile2.jpg"

export default () => (
  <header>
    <div className="Home">
      <div className="Home-header">
        <img src={profile} className="Home-logo" alt="profile" />
        <div>
          <h1 className="nameLogo">Wes Coffay</h1>
          <h3>Cloud Native Developer and DevOps Engineer</h3>
          <h4>Pronounced \ ˈkȯ-fē , ˈkä- \ </h4>
          <h4>Just like the drink (but with higher caffeine content)</h4>
          <h4><Link to="/pages/about">About Me</Link></h4>
        </div>
      </div>
    </div>
  </header>
)
// const Header = ({ siteTitle }) => (
//   <header
//     style={{
//       background: `rebeccapurple`,
//       marginBottom: `1.45rem`,
//     }}
//   >
    // <div
    //   style={{
    //     margin: `0 auto`,
    //     maxWidth: 960,
    //     padding: `1.45rem 1.0875rem`,
    //   }}
    // >
//       <h1 style={{ margin: 0 }}>
//         <Link
//           to="/"
//           style={{
//             color: `white`,
//             textDecoration: `none`,
//           }}
//         >
//           {siteTitle}
//         </Link>
//       </h1>
//     </div>
//   </header>
// )

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// }

// Header.defaultProps = {
//   siteTitle: ``,
// }

// export default Header
