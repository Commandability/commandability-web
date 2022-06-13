/*
  Custom HashLink component for React Router that supports hashes in the URL
  Based on https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx#L321
*/

import { useLocation, useResolvedPath, Link } from "react-router-dom";

function HashLink({ to, className, style: styleProp, children, ...props }) {
  const { hash: locationHash } = useLocation();
  const { hash: toHash } = useResolvedPath(to);

  const isActive = toHash ? locationHash === toHash : false;
  const style =
    typeof styleProp === "function" ? styleProp({ isActive }) : styleProp;

  return (
    <Link {...props} to={to} className={className} style={style}>
      {children}
    </Link>
  );
}

export default HashLink;
