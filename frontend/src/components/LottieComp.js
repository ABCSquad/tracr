import React from 'react';
import Lottie from 'react-lottie';

const LottieComp = (props) => {
    return (
        <div className='centered'>
            <Lottie options={getOptions(props.name)} height={props.height} />
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

export default LottieComp;