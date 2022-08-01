import styled from "styled-components";
import colors from "../lib/colors";
import sizes from "../lib/sizes";
import theme from "../lib/theme";
import HeaderLogo from "./HeaderLogo";
import { MobileMenuOpenProps, NavItemProps } from "./types";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from "react-router-dom";
import { Title } from "./common";



const HeaderContainer = styled.div`
height: ${theme.header.height}px;
position: sticky;
top: 0;
border-bottom: 1px solid ${colors.border};

@media (max-width: ${sizes.xl}px) {
  padding: 16px 24px;
  border-bottom: none;
}

z-index: 10;

&:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  background: rgba(255, 255, 255, 0.01);
}
`;

const HeaderAbsoluteContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position:absolute;
  top:30px;
  justify-content: center;

  @media (max-width: ${sizes.xl}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const LogoContainer = styled.div`
  padding-top: 10px;
  margin-right: auto;
  z-index: 1000;

  @media (max-width: ${sizes.xl}px) {
    padding-left: 0;
  }
`;
const NavItem = styled.div.attrs({
    className: "d-flex align-items-center justify-content-center",
})`
    padding: 0px 16px;
    height: 100%;
    opacity: 0.48;
  
    &:hover {
      opacity: 1;
    }
  
    @media (max-width: ${sizes.xl}px) {
      padding: 0px 0px 40px 48px;
    }
`;

const ConnectItem = styled(Title)`
    padding: 0px 16px;
    height: 100%;
    opacity: 1;
    position:absolute;
    right:0;
    top:-10px;

    &:hover {
      opacity: 1;
    }
  
    @media (max-width: ${sizes.xl}px) {
      padding: 0px 0px 40px 48px;
    }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;


  @media (max-width: ${sizes.xl}px) {
    font-size: 24px;
  }
`;

const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean = true,
    primary: boolean = true,
    external: boolean = false
  ) => {
    return (
   
          <NavItem>
            <Link className="lien" to={`${to}`}>
              <NavLinkText>{title}</NavLinkText>
            </Link>
          </NavItem>
    
    );
  };

const Header = ()=> {

   
    return (
        <HeaderContainer
        className="d-flex align-items-center"
        >
            {/* LOGO */}
            <LogoContainer>
                    <HeaderLogo />
            </LogoContainer>

            {/* LINKS */}
            <HeaderAbsoluteContainer>
                <LinksContainer>
                {renderLinkItem("QUESTS", "/")}
                {renderLinkItem("LEADERBOARD", "/leaderboard")}
                {renderLinkItem("STATS", "/stats")}

                {/*
                    {chainId &&
                        isEthNetwork(chainId) &&
                        renderLinkItem("STAKING", "/staking")
                    }
                */}

                {/* RAINBOW BUTTON */}
                <ConnectItem>
                        <ConnectButton />
                </ConnectItem>
                
                </LinksContainer>
                
            </HeaderAbsoluteContainer>
            
            
            

        </HeaderContainer>
    )
}


export default Header;

