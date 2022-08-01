import styled from "styled-components";
import { Link } from "react-router-dom";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <img src="assets/ggLogo.png" width={200}></img>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;