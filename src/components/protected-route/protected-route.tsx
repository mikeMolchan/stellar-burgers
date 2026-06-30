import { FC, ReactElement } from 'react';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  return children;
};