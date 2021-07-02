import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Lottie from 'react-lottie';
import mathsAnimation from '../static/lotties/maths-homepage';
import stepI from '../static/lotties/step-i';
import stepII from '../static/lotties/step-ii';
import stepIII from '../static/lotties/step-iii';
import stepIV from '../static/lotties/step-iv';

const HomePage = (props) => {
    return (
        <div>
            <div className='gainsboro-bg'>
                <Col md={{ span:8, offset:2 }} style={{ paddingTop: 80 }}>
                    <h1 className='text-center'>Using solutions from tomorrow to solve problems of today</h1>
                    <h4 className='text-center mb-md-4'>tracr makes use of gesture recognition and OCR to assist you in solving math effortlessly.</h4>
                    <div className='centered'>
                        <Button variant='warning' size='lg'>Get Started</Button>
                    </div>
                    <div className='centered'>
                        <Lottie options={getOptions(mathsAnimation)} height={500} style={{ marginTop: 15 }}/>
                    </div>
                </Col>
            </div>
            <div>
                <Col md={{ span:8, offset:2 }} style={{ paddingTop: 80 }}>
                    <h2 className='text-center'>Using tracr can be boiled down to 4 simple steps</h2>
                    <hr />
                    <Row style={{ paddingTop: 30 }}>
                        <Col md={{ span:6, offset:1 }}>
                            <h3>Step I</h3>
                            <p>
                                Switch your front camera on and use your hand to write math equations in 
                                the air while making sure that you are visible. Meanwhile, tracr while write this 
                                down onto your screen.
                            </p>
                        </Col>
                        <Col md={{ span:4 }}>
                            <div className='centered'>
                                <Lottie options={getOptions(stepI)} height={230} />
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row className='step-padding'>
                        <Col md={{ span:4, offset:1 }}>
                            <div className='centered'>
                                <Lottie options={getOptions(stepII)} height={230} />
                            </div>
                        </Col>
                        <Col md={{ span:6 }}>
                            <h3>Step II</h3>
                            <p>
                                tracr will then convert your hand-drawn text into machine-encoded text using optical
                                character recognition and optionally solve the problem for you.
                            </p>
                        </Col>
                    </Row>
                    <hr />
                    <Row className='step-padding'>
                        <Col md={{ span:6, offset:1 }}>
                            <h3>Step III</h3>
                            <p>
                                After you're done with your session you can save it in the form of a PDF which
                                you can download and refer to at any time.
                            </p>
                        </Col>
                        <Col md={{ span:4 }}>
                            <div className='centered'>
                                <Lottie options={getOptions(stepIII)} height={230} />
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row className='step-padding'>
                        <Col md={{ span:4, offset:1 }}>
                            <div className='centered'>
                                <Lottie options={getOptions(stepIV)} height={230} />
                            </div>
                        </Col>
                        <Col md={{ span:6 }}>
                            <h3>Step IV</h3>
                            <p>
                                Finally, you or anyone you wish to, can refer to your past sessions to track your learning and 
                                download their respective PDFs.
                            </p>
                        </Col>
                    </Row>
                </Col>
            </div>
        </div>
    );
}

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


export default HomePage;