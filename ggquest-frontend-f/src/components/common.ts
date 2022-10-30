import styled from "styled-components";
import colors from "../lib/colors";

export const Title = styled.span<{
    color?: string;
    fontSize?: number;
    lineHeight?: number;
    letterSpacing?: number;
    normalCased?: boolean;
  }>`
    color: ${(props) => props.color || colors.primaryText};
    font-family: Soft, sans-serif;
    font-style: normal;
    font-weight: normal;
    ${(props) => (!props.normalCased ? `text-transform: uppercase;` : ``)}
    ${(props) => (props.fontSize ? `font-size: ${props.fontSize}px;` : ``)}
    ${(props) => (props.lineHeight ? `line-height: ${props.lineHeight}px;` : ``)}
    ${(props) =>
      props.letterSpacing ? `letter-spacing: ${props.letterSpacing}px;` : ""}
`;
