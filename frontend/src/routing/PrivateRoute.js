import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, token, loading, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !token && !loading ? <Redirect to='/login' /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
