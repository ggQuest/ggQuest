import React from "react";
import styled from "styled-components";
import colors from "../../lib/colors";
import { Title } from "../common";
import { BackgroundContainer, BackgroundText } from "../QuestCatalogue";
import { BCProps, ButtonContainer } from "../QuestCatalogue/claimQuest";
import { STable, STBody, STBodyTR, STD, STH, STHead, STHeadTR } from "./styles";

interface dataProps {
    name: string,
    email: string,
    age: string,
    food: string,
}
export const ButtonContainerT = styled.div<BCProps>`
  display: flex;
  align-items: center;
  background: rgba(252, 10, 84, 0.12);
  border-radius: 48px;
  width: ${props => props.close ? "9%" : "70%"};
  padding: 4px 4px;
`;

interface ContainerProps {
    home?: any
}
export const Container = styled(Title)<ContainerProps>`
    display: flex;
    align-items: center;
    justify-content:space-between;
    flex-direction: column;
    padding: ${props => props.home ? "0px" : "50px"};
`;

const Table = ({data} : any) => {
    const titles = {
        player :  "",
        score : ""
    }
    const keys = Object.keys(titles);
    return (
        <>
        <Container>
            
                <h1>Leaderboard</h1>
        <STable>

            <STHead>
                <STHeadTR>
                    {["#", ...keys].map((item, index) => (
                        
                            <STH key={index}>{item}</STH>
                        
                        
                    ))}
                </STHeadTR>
            </STHead>

            <STBody>
                {data.map((obj : any, index : any) => (
                    <STBodyTR key={index}>
                        <STD>{index + 1}</STD>
                        {keys.map((item, index) => {
                            const value = obj[item];
                            return <STD key={index}>{value}</STD>;
                        })}
                    </STBodyTR>
                ))}
            </STBody>
            
        </STable>
        </Container>
        <BackgroundContainer>
            <BackgroundText>GG QUEST</BackgroundText>
        </BackgroundContainer>
        </>
    );
};

export default Table;
