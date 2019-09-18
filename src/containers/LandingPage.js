import React from "react";
import styled from "styled-components";

const LandingPage = () => {
  const Container = styled.div`
    min-height: 1000px;
    vertical-align: middle;
  `;

  const Title = styled.h1`
    font-size: 126px;
    color: ${props => props.theme.colors.primaryText};
    text-align: left;
    vertical-align: middle;
  `;
  return (
    <Container>
      <Title>
        Notes.
        <br />
        Made.
        <br />
        Easy.
      </Title>
    </Container>
  );
};

export default LandingPage;
