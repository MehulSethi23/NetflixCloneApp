import React, { useState, useEffect } from 'react'
import axios from './axios';
import requests from './requests';
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseImgUrl = "https://image.tmdb.org/t/p/original";
const Row = ({ title, fetchUrl, islarge }) => {

    const [movies, setmovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // Options for react-youtube
    const opts = {
      height: "390",
      width: "100%",
      playerVars: {
        autoplay: 1,
      },
    };

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setmovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl])

    const handleClick = (movie) => {
        if (trailerUrl) {
          setTrailerUrl('');
        } else {
          movieTrailer(movie?.name || movie?.title || movie?.original_title || "").then((url) => 
            {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
            })
            .catch((error) => console.log(error));
          
          
        }
      };

    return (
        <>
            <div className="row">
                <h2>{title}</h2>
                <div className="rowposters">

                    {movies.map(movie => (
                        <img
                            key={movie.id}
                            className={`rowposter ${islarge && "rowislarge"}`}
                            src={`${baseImgUrl}${islarge ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} 
                            onClick={() => handleClick(movie)} />
                    ))}


                </div>
                { trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
            </div>
        </>

    )
}
export default Row;