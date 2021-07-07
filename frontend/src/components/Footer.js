import React from 'react';
import { Col, Row } from 'react-bootstrap';
import linkedin from '../static/images/linkedin.svg'
import github from '../static/images/github.svg'
import facebook from '../static/images/facebook.svg'
import twitter from '../static/images/twitter.svg'
import instagram from '../static/images/instagram.svg'

const Footer = (props) => {
    return (
        <div className='davys-bg'>
            <Col md={{ span:8, offset:2 }} className='step-padding'>
                <Row className="centered">
                    <a href='https://www.facebook.com/' target="_blank" rel="noreferrer"><img src={facebook} className='social m-3' alt='facebook'/></a>
                    <a href='https://www.instagram.com/' target="_blank" rel="noreferrer"><img src={instagram} className='social m-3' alt='instagram'/></a>
                    <a href='https://twitter.com/' target="_blank" rel="noreferrer"><img src={twitter} className='social m-3' alt='twitter'/></a>
                    <a href='https://www.linkedin.com/' target="_blank" rel="noreferrer"><img src={linkedin} className='social m-3' alt='linkedin'/></a>
                    <a href='https://github.com/ABCSquad/tracr' target="_blank" rel="noreferrer"><img src={github} className='social m-3' alt='github'/></a>
                </Row>
                <h6 className='text-center mb-md-4 gainsboro-color'>Copyright &copy; 2021 CRAB Inc. All rights reserved.</h6>
            </Col>
        </div>
    );
}

export default Footer;