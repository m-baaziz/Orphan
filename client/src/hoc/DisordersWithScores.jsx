/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../api/environment';

function DisordersWithScores(props) {
  const { statements, render: RenderComponent, renderProps } = props;

  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query DisordersWithScoresQuery($statements: [Statement]) {
          matchDisorders(statements: $statements) {
            disorder {
              orphaNumber
              name
              description
            }
            score
          }
        }
      `}
      variables={{ statements }}
      render={(res) => {
        const { error, props: data } = res;
        if (error) {
          return <div>Error!</div>;
        }
        if (!data) {
          return <div>Loading...</div>;
        }
        return <RenderComponent disordersWithScores={data.matchDisorders} {...renderProps} />;
      }}
    />
  );
}

export default DisordersWithScores;
