import styled from "styled-components";
import { Link } from "react-router-dom";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
  margin-top: 10px;
  margin-left: 30px;
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <img src="assets/ggLogo.svg" width={150}></img>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;