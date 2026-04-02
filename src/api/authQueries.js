import { gql } from './apollo.js';

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
        role
        tenant_id
        tenant {
          _id
          name
          code
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      role
      tenant_id
      tenant {
        _id
        name
        code
      }
    }
  }
`;
