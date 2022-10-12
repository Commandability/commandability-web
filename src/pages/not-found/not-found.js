import * as React from "react";
import styled from "styled-components";

import Layout from "components/layout";

function NotFound() {
  return (
    <Layout>
      <Text>404: Not Found</Text>
    </Layout>
  );
}

const Text = styled.div`
  color: var(--color-white);
`;

export default NotFound;
