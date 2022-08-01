import styled from "styled-components";
import colors from "../../lib/colors";
import { Title } from "../common";

interface ButtonProps {
  overview? : any;
  variant?: any;
}

export const Button = styled.button<ButtonProps>`
  padding: 15px 2.4em;
  outline: none;
  border: none;
  border-radius: 28px;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  background-color: ${props=> 
    props.overview ? "black" : 
    props.variant === "Sandbox" ? "#fc0a54" :
    props.variant === "Axie Infinity" ? "rgba(29,216,231,1)" : 
    props.variant === "Illuvium" ? "rgba(232,168,29,1)" : 
    props.variant === "Evio" ? "black" : 
    props.variant === "Bigtime" ? "#aa6b3f" : 
    props.variant === "StarAtlas" ? "black" : 
    "#fc0a54"
  };
  background-color: linear-gradient(
    80deg,
    rgb(182, 199, 178) 0%,
    rgba(141, 167, 134, 1) 100%
  );
  cursor: pointer;
  transition: all 320ms ease-in-out;
  margin-bottom:20px;
  &:hover {
    background-color:	#3696CA;
  }
`;

export const transition = {
  type: "tween",
  duration: 0.8,
};

interface TitleTextProps {
  variant?: any; 
  insideCard?:any;
}

export const TitleText = styled(Title)<TitleTextProps>`
  letter-spacing: 1.5px;
  font-size: ${props => props.variant ? "30px" : props.insideCard ? "20px" : "50px" };
  padding-bottom : ${props => props.insideCard ? "30px" : "0px"};
`;
