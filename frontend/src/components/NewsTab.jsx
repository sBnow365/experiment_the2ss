console.log("NewsTab mounted");
import { useEffect, useState } from "react";
import "./NewsTab.css";
import { API_BASE } from "../config/env";


function NewsTab({ placeContext }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!placeContext) return;
    console.log("Running useEffect", placeContext);
    fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: placeContext.city,
        country: placeContext.country,
      }),
    })
      .then((res) => res.json())
      .then((data) => setArticles(data.news));
  }, [placeContext]);

  return (
    <div className="news-container">
      <h2 style={{color:"#CCC"}}>
        Latest News near {placeContext?.city}, {placeContext?.country}
      </h2>

      <div className="news-grid">
        {articles.map((article, i) => (
            // console.log(article);
          <div className="news-card" key={i}>

            {article.image && (
                <img src={article.image} alt="news"/>
            )}

            <h3 style={{color:"#BBB"}}>{article.title || "News Article"}</h3>
            {article.description && (
                <p className="desc">{article.description}</p>
            )}

            <p className="source">{article.source}</p>

            <a href={article.url} target="_blank">
                Read More
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsTab;