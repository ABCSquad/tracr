import React from 'react';
import { Col, Button } from 'react-bootstrap';
import LottieComp from "./LottieComp";
import mathsAnimation from '../static/lotties/maths-homepage';

const Landing = (props) => {
    return (
        <div className='gainsboro-bg'>
            <Col md={{ span:8, offset:2 }} style={{ paddingTop: 80 }}>
                <h1 className='text-center'>Using solutions from tomorrow to solve problems of today</h1>
                <h4 className='text-center mb-md-4'>tracr makes use of gesture recognition and OCR to assist you in solving math effortlessly.</h4>
                <div className='centered' style={{ marginBottom: 15 }}>
                    <Button variant='warning' size='lg'>Get Started</Button>
                </div>
                <LottieComp name={mathsAnimation} height={500} />
            </Col>
        </div>
    );
}

export default Landing;

const getOptions = (name) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: name,
        rendererSettings: {
        // preserveAspectRatio: "xMidYMid slice"
        }
    };
    return defaultOptions;
}
