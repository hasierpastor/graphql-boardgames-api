import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';

const BoardGames = () => (
  <Query
    query={gql`
      {
        allBoardgames {
          name
          designer
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return data.allBoardgames.map(({ name, designer }, index) => (
        <div key={index}>
          <p>Name: {name}</p>
          <p>Designer: {designer}</p>
        </div>
      ));
    }}
  </Query>
);

export default BoardGames;
