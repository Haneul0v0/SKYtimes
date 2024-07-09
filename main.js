const API_KEY = `0c12040e60d948238f7f4c43e1b7b55f`;
let news=[];

const getLatestNews = async () => {
    const url = new URL(`https://glowing-beijinho-0abcf4.netlify.app/`);
    console.log("uuu", url);

    const response = await fetch(url);
    const data = await response.json();

    news = data.articles
    console.log("ddd", news);
}

getLatestNews();