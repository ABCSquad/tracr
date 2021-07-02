import React from 'react';
import { Col, Row } from 'react-bootstrap';
import LottieComp from "./LottieComp";
import stepI from '../static/lotties/step-i';
import stepII from '../static/lotties/step-ii';
import stepIII from '../static/lotties/step-iii';
import stepIV from '../static/lotties/step-iv';
import stepsBG from '../static/images/dot-bg.png';

const Steps = (props) => {
    return (
        <div style={{ backgroundImage: `url(${stepsBG})` }}>
            <Col md={{ span:8, offset:2 }} style={{ paddingTop: 80 }}>
                <h2 className='text-center'>Using tracr can be boiled down to 4 simple steps</h2>
                <Step no={1} />
                <Step no={2} />
                <Step no={3} />
                <Step no={4} />
            </Col>
        </div>
    );
}

const Step = (props) => {

    let lottieName, stepTitle, stepText;

    switch(props.no) {
        case 1: 
        stepTitle='Step I'
        lottieName=stepI;
        stepText=`Switch your front camera on and use your hand to write math equations in the air 
        while making sure that you are visible. Meanwhile, tracr while write this down onto your screen.`
        break;
        case 2: 
        stepTitle='Step II'
        lottieName=stepII;
        stepText=`tracr will then convert your hand-drawn text into machine-encoded text using optical
        character recognition and optionally solve the problem for you.`
        break;
        case 3: 
        stepTitle='Step III'
        lottieName=stepIII;
        stepText=`After you're done with your session you can save it in the form of a PDF which you 
        can download and refer to at any time.`
        break;
        case 4: 
        stepTitle='Step IV'
        lottieName=stepIV;
        stepText=`Finally, you or anyone you wish to, can refer to your past sessions to track your
        learning and download their respective PDFs.`
        break;
    }

    if (props.no%2===0) {
        return (
            <div>
                <hr />
                <Row className='step-padding'>
                    <Col md={{ span:4, offset:1 }}>
                        <LottieComp name={lottieName} height={230} />
                    </Col>
                    <Col md={{ span:6 }}>
                        <h3>{stepTitle}</h3>
                        <p>{stepText}</p>
                    </Col>
                </Row>
            </div>
        );
    }

    else {
        return (
            <div>
                <hr />
                <Row className='step-padding'>
                    <Col md={{ span:6 }}>
                        <h3>{stepTitle}</h3>
                        <p>{stepText}</p>
                    </Col>
                    <Col md={{ span:4, offset:1 }}>
                        <LottieComp name={lottieName} height={230} />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Steps;