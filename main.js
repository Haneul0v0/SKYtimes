const API_KEY = `0c12040e60d948238f7f4c43e1b7b55f`;
let newsList = [];

const getLatestNews = async () => {
    // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us`);
    console.log("url", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        newsList = data.articles;
        render();
        console.log("data", newsList);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const render = () => {
    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else if (text) {
            return text;
        } else {
            return '내용없음';
        }
    };

    const formatTimeAgo = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    const newsHTML = newsList.map(news => {
        const imageSrc = news.urlToImage ? news.urlToImage : './images/image-not-available.jpg';
        const sourceName = news.source && news.source.name ? news.source.name : 'no source';
        const timeAgo = formatTimeAgo(news.publishedAt);

        return `<div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${imageSrc}" onerror="this.onerror=null;this.src='./images/image-not-available.jpg';">
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                    ${truncateText(news.description, 200)}
                </p>
                <div>
                    ${sourceName} * ${timeAgo}
                </div>
            </div>
        </div>`;
    }).join('');

    console.log("html", newsHTML);

    document.getElementById("news-board").innerHTML = newsHTML;
};

document.addEventListener("DOMContentLoaded", getLatestNews);