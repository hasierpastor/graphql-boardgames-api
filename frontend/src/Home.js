import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import Figure from 'react-bootstrap/Figure';
import FigureCaption from 'react-bootstrap/FigureCaption';

//TODO: Change styling, add overlay
const Home = () => (
  <Query
    query={gql`
      {
        allBoardgames {
          name
          designer
          rating
          image
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      const boardGames = data.allBoardgames.map(
        ({ name, designer, image, rating }, index) => (
          <div className="website grid mix col-md-4 col-sm-6 col-xs-12">
            <figure className="port-desc">
              <img src={image} className="img-responsive" alt="Work 1" />
              <figcaption>
                <h4>{name}</h4>
                <h5>{designer}</h5>
                <h5>{rating}</h5>
              </figcaption>
            </figure>
          </div>
        )
      );
      return (
        // <div className="container">
        //   <div className="row">
        //     <div data-aos="fade-up" />
        <div id="port-image" className="container">
          <div className="row">{boardGames}</div>
        </div>
        //   </div>
        // </div>
      );
    }}
  </Query>
);

export default Home;
