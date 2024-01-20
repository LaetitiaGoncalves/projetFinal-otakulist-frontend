import { useState, useEffect } from "react";
import axios from "axios";

//import components
import AnimeCard from "../components/AnimeCard";

//import pictures
import feuillederable from "../images/feuillederable.png";
import sakura from "../images/sakura.png";
import snowflake from "../images/snowflake.png";
import sun from "../images/sun.png";
import medaille from "../images/medaille.png";
import augmenter from "../images/augmenter.png";
import feu from "../images/feu.png";
import ArrowLeft from "../images/arrowLeft.svg";
import ArrowRight from "../images/arrowRight.svg";
import arrowbottom from "../images/arrowbottom.svg";

const Home = ({ search }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [dataSeasonal, setDataSeasonal] = useState([]);
  const [dataUpcoming, setDataUpcoming] = useState([]);
  const [dataTopAnime, setDataTopAnime] = useState([]);
  const [dataAiring, setDataAiring] = useState([]);
  const [indexSeasonal, setIndexSeasonal] = useState(0);
  const [indexUpcoming, setIndexUpcoming] = useState(0);
  const [indexTopAnime, setIndexTopAnime] = useState(0);
  const [indexAiring, setIndexAiring] = useState(0);
  const [indexSearch, setIndexSearch] = useState(0);

  const itemsPerPage = 3;

  // URLs d'API

  const apiSearch = "http://localhost:3001/searchanime";
  const apiTopAnime = "http://localhost:3001/topanime";
  const apiSeasonal = "http://localhost:3001/seasonal";
  const apiUpcoming = "http://localhost:3001/upcoming";
  const apiAiring = "http://localhost:3001/seasonal"; //airing modifiée en upcoming pour cause de bug api

  // Fonction tronquer

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }

    const endOfSentence = text.lastIndexOf(".", maxLength);
    if (endOfSentence !== -1) {
      return text.substr(0, endOfSentence + 1) + "..";
    } else {
      return text.substr(0, maxLength);
    }
  };

  // Fonctions pour les carousels

  const handlePreviousSeasonal = () => {
    const newIndex = indexSeasonal - itemsPerPage;
    setIndexSeasonal(newIndex < 0 ? 0 : newIndex);
  };
  const handleNextSeasonal = () => {
    const newIndex = indexSeasonal + itemsPerPage;
    setIndexSeasonal(
      newIndex >= dataSeasonal.length ? indexSeasonal : newIndex
    );
  };

  const handlePreviousTopAnime = () => {
    const newIndex = indexTopAnime - itemsPerPage;
    setIndexTopAnime(newIndex < 0 ? 0 : newIndex);
  };
  const handleNextTopAnime = () => {
    const newIndex = indexTopAnime + itemsPerPage;
    setIndexTopAnime(
      newIndex >= dataTopAnime.length ? indexTopAnime : newIndex
    );
  };

  const handlePreviousUpComing = () => {
    const newIndex = indexUpcoming - itemsPerPage;
    setIndexUpcoming(newIndex < 0 ? 0 : newIndex);
  };
  const handleNextUpComing = () => {
    const newIndex = indexUpcoming + itemsPerPage;
    setIndexUpcoming(
      newIndex >= dataUpcoming.length ? indexUpcoming : newIndex
    );
  };

  const handlePreviousAiring = () => {
    const newIndex = indexAiring - itemsPerPage;
    setIndexAiring(newIndex < 0 ? 0 : newIndex);
  };
  const handleNextAiring = () => {
    const newIndex = indexAiring + itemsPerPage;
    setIndexAiring(newIndex >= dataAiring.length ? indexAiring : newIndex);
  };

  const handlePreviousSearch = () => {
    const newIndex = indexSearch - itemsPerPage;
    setIndexSearch(newIndex < 0 ? 0 : newIndex);
  };
  const handleNextSearch = () => {
    const newIndex = indexSearch + itemsPerPage;
    setIndexSearch(newIndex >= dataSearch.length ? indexSearch : newIndex);
  };

  const isLastPage = indexSearch + itemsPerPage >= filteredData.length;
  const isFirstPage = indexSearch === 0;

  useEffect(() => {
    const getSeason = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;

      if (currentMonth >= 3 && currentMonth <= 5) {
        setCurrentSeason("Spring");
      } else if (currentMonth >= 6 && currentMonth <= 8) {
        setCurrentSeason("Summer");
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        setCurrentSeason("Fall");
      } else {
        setCurrentSeason("Winter");
      }
    };

    getSeason();
  }, []);

  useEffect(() => {
    console.log("Search term:", search);
    const fetchData = async () => {
      try {
        const responseSeasonal = await axios.get(apiSeasonal);
        setDataSeasonal(responseSeasonal.data.data);
        const responseUpcoming = await axios.get(apiUpcoming);
        setDataUpcoming(responseUpcoming.data.data);
        const responseTopAnime = await axios.get(apiTopAnime);
        setDataTopAnime(responseTopAnime.data.data);
        const responseAiring = await axios.get(apiAiring);
        setDataAiring(responseAiring.data.data);

        if (search) {
          const responseSearch = await axios.get(
            `${apiSearch}?search=${search}`
          );
          console.log("API Search response:", responseSearch.data.data);
          setDataSearch(responseSearch.data.data);
        } else {
          setDataSearch([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [search]);

  useEffect(() => {
    const newFilteredData = search
      ? dataSearch.filter(
          (item) =>
            item.title_english &&
            item.title_english.toLowerCase().includes(search.toLowerCase())
        )
      : dataSearch;

    setFilteredData(newFilteredData);
    console.log("filteredData", newFilteredData);
  }, [search, dataSearch]);

  return (
    <div>
      {isLoading === true ? (
        <p>En cours de chargement</p>
      ) : (
        <>
          {dataAiring.map((data, index) => {
            if (index === 0) {
              return (
                <div className="banner">
                  <img src={data.trailer.images.maximum_image_url} alt="" />
                  <div>
                    <div className="banner-content">
                      <p>#1 Plus populaire du moment</p>
                      <h1>{truncateText(data.title_english, 25)}</h1>
                      <p className={"banner-truncate-text"}>
                        {truncateText(data.synopsis, 400)}
                      </p>
                      <div className="banner-button">
                        <button>En savoir plus</button>
                        <div className="button-addList">
                          <p> + Add to list</p>
                          <img src={arrowbottom} alt="arrow bottom" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {filteredData.length > 0 ? (
            <>
              <a href="/">Retour</a>
              <h2>Résultats de la recherche pour "{search}"</h2>
              <div className="background">
                <div className="carousel container">
                  <button onClick={handlePreviousSearch} disabled={isFirstPage}>
                    <img src={ArrowLeft} alt="" />
                  </button>
                  <div className="anime-card-carousel">
                    {filteredData
                      .slice(indexSearch, indexSearch + itemsPerPage)
                      .map((item, index) => (
                        <AnimeCard
                          key={index}
                          data={item}
                          currentIndex={indexSearch}
                          itemsPerPage={itemsPerPage}
                        />
                      ))}
                  </div>
                  <button onClick={handleNextSearch} disabled={isLastPage}>
                    <img src={ArrowRight} alt="" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>Le meilleur des animés</h2>
              <div className="background">
                <div className="title-container container">
                  <div>
                    {currentSeason === "Winter" ? (
                      <img src={snowflake} alt="snowflake" />
                    ) : currentSeason === "Fall" ? (
                      <img src={feuillederable} alt="feuille d'érable" />
                    ) : currentSeason === "Spring" ? (
                      <img src={sakura} alt="fleur de sakura" />
                    ) : (
                      <img src={sun} alt="soleil" />
                    )}
                    <h3>Animés de la saison</h3>
                  </div>
                  <a href="/">Voir plus</a>
                </div>
                <div className="carousel container">
                  <button onClick={handlePreviousSeasonal}>
                    <img src={ArrowLeft} alt="" />
                  </button>
                  {dataSeasonal.length > 0 && (
                    <AnimeCard
                      currentIndex={indexSeasonal}
                      itemsPerPage={itemsPerPage}
                      data={dataSeasonal}
                    />
                  )}
                  <button onClick={handleNextSeasonal}>
                    <img src={ArrowRight} alt="" />
                  </button>
                </div>

                <div className="title-container container">
                  <div>
                    <img src={feu} alt="flamme" />
                    <h3>Animés les plus attendus</h3>
                  </div>
                  <a href="/">Voir plus</a>
                </div>
                <div className="carousel container">
                  <button onClick={handlePreviousUpComing}>
                    <img src={ArrowLeft} alt="" />
                  </button>
                  {dataUpcoming.length > 0 && (
                    <AnimeCard
                      currentIndex={indexUpcoming}
                      itemsPerPage={itemsPerPage}
                      data={dataUpcoming}
                    />
                  )}
                  <button onClick={handleNextUpComing}>
                    <img src={ArrowRight} alt="" />
                  </button>
                </div>
                <div className="title-container container">
                  <div>
                    <img src={medaille} alt="medaille" />
                    <h3>Top 100 des meilleurs animés</h3>
                  </div>
                  <a href="/">Voir plus</a>
                </div>
                <div className="carousel container">
                  <button onClick={handlePreviousTopAnime}>
                    <img src={ArrowLeft} alt="" />
                  </button>
                  {dataTopAnime.length > 0 && (
                    <AnimeCard
                      currentIndex={indexTopAnime}
                      itemsPerPage={itemsPerPage}
                      data={dataTopAnime}
                    />
                  )}
                  <button onClick={handleNextTopAnime}>
                    <img src={ArrowRight} alt="" />
                  </button>
                </div>
                <div className="title-container container">
                  <div>
                    <img src={augmenter} alt="flèche en hausse" />
                    <h3>Animés les plus populaires du moment</h3>
                  </div>
                  <a href="/">Voir plus</a>
                </div>
                <div className="carousel container">
                  <button onClick={handlePreviousAiring}>
                    <img src={ArrowLeft} alt="" />
                  </button>
                  {dataAiring.length > 0 && (
                    <AnimeCard
                      currentIndex={indexAiring}
                      itemsPerPage={itemsPerPage}
                      data={dataAiring}
                    />
                  )}
                  <button onClick={handleNextAiring}>
                    <img src={ArrowRight} alt="" />
                  </button>
                </div>
              </div>
              <h2>Les dernières news</h2>
              <h2>Les animés awards de 2024</h2>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
