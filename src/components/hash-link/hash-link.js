/*
  Custom HashLink component for React Router that supports hashes in the URL
  Based on https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx#L321
*/

import { useLocation, useResolvedPath, Link } from "react-router-dom";

function HashLink({
  to,
  className: classNameProp,
  style: styleProp,
  inView: inViewProp,
  children,
  ...props
}) {
  const { hash: locationHash } = useLocation();
  const { hash: toHash } = useResolvedPath(to);

  let isActive = toHash ? locationHash === toHash : false;
  isActive = inViewProp;
  const style =
    typeof styleProp === "function" ? styleProp({ isActive }) : styleProp;

  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp({ isActive });
  } else {
    className = [classNameProp, isActive ? "active" : null]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <Link {...props} to={to} className={className} style={style}>
      {children}
    </Link>
  );
}

export default HashLink;
