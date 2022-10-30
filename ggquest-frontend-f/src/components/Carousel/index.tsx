import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
flex-wrap: wrap;
padding-top: 30px ;
text-align: center;
justify-content: center;
`
function Carsl() {
    return (
        <Wrapper>
        <Carousel width="800px" centerSlidePercentage={100} autoPlay infiniteLoop showArrows={false} showThumbs={false} showStatus={false} showIndicators={false}>
                <div>
                    <img src="assets/image1.png" />
                </div>
                <div>
                    <img src="assets/image2.png" />
                </div>
                <div>
                    <img src="assets/image3.png" />
                </div>
                <div>
                    <img src="assets/image4.png" />
                </div>
        </Carousel>
        </Wrapper>
    )
}

export default Carsl;