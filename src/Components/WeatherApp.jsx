import React from 'react';

const WeatherApp = () => {

    const handleInput = (event) => { };

    return ( 
        <>
            <div className="box">
                <div className="inputData">
                    <input type="search" onChange={handleInput} className="inputField" />
                </div>

                <div className="info">
                    <h2 className="location">
                        Uttarakhand
                    </h2>
                    <h1 className="temperature">
                        10°C
                    </h1>
                    <h3 className="temp_min-max">
                        Min : 9°C | Max : 11°C
                    </h3>
                    <div className="wave -one"></div>
                    <div className="wave -two"></div>
                    <div className="wave -three"></div>
                </div>
            </div>
        </>
    );
}
 
export default WeatherApp;