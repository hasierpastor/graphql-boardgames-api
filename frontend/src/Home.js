import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';

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
      return data.allBoardgames.map(
        ({ name, designer, image, rating }, index) => (
          console.log(image),
          (
            <div key={index}>
              <p>Name: {name}</p>
              <p>Designer: {designer}</p>
              <p>Rating: {rating}</p>
              <img src={image} />
            </div>
          )
        )
      );
    }}
  </Query>
);

export default Home;
