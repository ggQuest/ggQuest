import { HeaderContainer, LinksContainer,HeaderAbsoluteContainer, renderLinkItem } from "../Header/Header";
import styled from "styled-components";

const FooterContainer = styled.div`
display: flex;
flex-wrap: wrap;
text-align: center;
justify-content: center;
`

export const Footer = () => {
    return (
        <FooterContainer
        className="d-flex align-items-center" 
        >
            {/* LINKS */}
            <HeaderAbsoluteContainer isFooter>
                <LinksContainer>
                    {renderLinkItem("DISCORD", "https://discord.gg/6pw7SCXE8N",true)}
                    {renderLinkItem("TWITTER", "https://twitter.com/gg_quest_gg",true)}
                </LinksContainer>
                
            </HeaderAbsoluteContainer>

        </FooterContainer>
    )
}