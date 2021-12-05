import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, token, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
