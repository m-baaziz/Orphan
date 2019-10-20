/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../api/environment';

function Areas(props) {
  const { render: RenderComponent, renderProps } = props;

  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query AreasQuery {
          parentPhenotypes {
            HPOId
            name
            description
          }
        }
      `}
      variables={{}}
      render={(res) => {
        const { error, props: data } = res;
        if (error) {
          return <div>Error!</div>;
        }
        if (!data) {
          return <div>Loading...</div>;
        }
        return <RenderComponent areas={data.parentPhenotypes} {...renderProps} />;
      }}
    />
  );
}

export default Areas;
