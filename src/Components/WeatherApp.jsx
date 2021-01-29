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
                        Delhi
                    </h2>
                    <h1 className="temperature">
                        10°C
                    </h1>
                    <h3 className="temp_min-max">
                        Min : 9°C | Max : 11°C
                    </h3>
                </div>
            </div>
        </>
    );
}
 
export default WeatherApp;