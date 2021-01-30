import React, { useEffect, useState } from 'react';
import '../Components/styles.css/index.css';

const WeatherApp = () => {
    const [place, setPlace] = useState("");
    const [search, setSearch] = useState("");


    useEffect(() => {
        const fetchApi = async () => {
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=8f9b5c95e274770016c9537586e353c7`;
            const response = await fetch(url);

            const resJson = await response.json();

            setPlace(resJson.main);
        };

        fetchApi();
    }, [search]);

    const handleInput = (event) => { 
        setSearch(event.target.value);

    };

    return ( 
        <>
            <div className="box">
                <div className="inputData">
                    <input type="search" value={search} placeholder="City" onChange={handleInput} className="inputField" />
                </div>

                {
                    !place ? (
                    <p className="error"> Place not found !</p>
                ) : ( 
                    <div>
                        <div className="info">
                            <h2 className="location">
                                <i className="fas fa-street-view" /> {" "}
                                {search}
                            </h2>
                            <h1 className="temperature">
                                {place.temp}°C
                            </h1>
                            <h3 className="temp_min-max">
                                Min : {place.temp_min}°C | Max : {place.temp_max}°C
                            </h3>
                        </div>
                
                        <div className="wave -one" />
                        <div className="wave -two" />
                        <div className="wave -three" />
                    </div>
                )}
            </div>
        </>
    );
}
 
export default WeatherApp;