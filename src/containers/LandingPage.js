import React from "react";
import styled from "styled-components";
import NotesIllustration from "../Icons/NotesIllustration";

const LandingPage = () => {
  const Container = styled.div`
    min-height: 100%;
    position: relative;
  `;

  const Illustration = styled.h1`
    font-size: 800px;
    position: absolute;
    @media screen and (max-width: 1310px) {
      & {
        font-size: 600px;
      }
    }
  `;

  const Title = styled.h1`
    margin-top: 50px;
    font-size: 60px;
    z-index: 9999;
    color: ${props => props.theme.colors.primaryText};
    position: absolute;
  `;

  const getIllustrationStyle = () => {
    return {
      position: "absolute",
      left: "165px"
    };
  };
  return (
    <Container>
      <Title>Notes. Made. Easy.</Title>
      <Illustration>
        <NotesIllustration style={getIllustrationStyle()} />
      </Illustration>
    </Container>
  );
};

export default LandingPage;
