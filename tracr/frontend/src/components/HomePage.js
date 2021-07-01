import React from 'react';
import { Col} from 'react-bootstrap';
import Lottie from 'react-lottie';
import animationData from '../../static/lotties/maths-homepage';

const HomePage = (props) => {
    return (
        <div>
            <Col md={{ span:8, offset:2 }} style={{ marginTop: 100 }}>
                <h1 className='text-center'>Assisted teaching using gestures and OCR.</h1>
                <p className='text-center'>tracr makes use of gesture recognition and OCR to make teaching simpler.</p>
                <Lottie options={defaultOptions} height={500} width={800} />
            </Col>
        </div>
    );
}

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      // preserveAspectRatio: "xMidYMid slice"
    }
  };

export default HomePage;