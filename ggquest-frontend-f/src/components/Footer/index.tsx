import { HeaderContainer, LinksContainer,HeaderAbsoluteContainer, renderLinkItem } from "./../Header";

export const Footer = () => {
    return (
        <HeaderContainer
        className="d-flex align-items-center" 
        >
            {/* LINKS */}
            <HeaderAbsoluteContainer isFooter>
                <LinksContainer>
                    {renderLinkItem("DISCORD", "https://discord.gg/6pw7SCXE8N",true)}
                    {renderLinkItem("TWITTER", "https://twitter.com/gg_quest_gg",true)}
                </LinksContainer>
                
            </HeaderAbsoluteContainer>

        </HeaderContainer>
    )
}