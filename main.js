const API_KEY = `0c12040e60d948238f7f4c43e1b7b55f`;
let newsList = [];

// let url = new URL(
// `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}` )
let url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us`
);

const menus = document.querySelectorAll(".menus button");
menus.forEach(
    menu => menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getNews = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {

            if (data.articles.length === 0) {
                throw new Error("No result for this search");

            }
            newsList = data.articles;
            render();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
}

const getLatestNews = async () => {
    // url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}` );
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us`

    );

    getNews();
}

const getNewsByCategory = async (event) => {
    const category = event
        .target
        .textContent
        .toLowerCase();

    // url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    // );
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}`
    );
    getNews();
}

const getNewsByKeyword = async () => {
    const keyword = document
        .getElementById("search-input")
        .value;

    // url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
    // )
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}`

    )

    getNews();
}

const render = () => {
    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else if (text) {
            return text;
        } else {
            return 'No content';
        }
    };

    const formatTimeAgo = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    const newsHTML = newsList
        .map(news => {
            const imageSrc = news.urlToImage
                ? news.urlToImage
                : './images/image-not-available.jpg';
            const sourceName = news.source && news.source.name
                ? news.source.name
                : 'no source';
            const timeAgo = formatTimeAgo(news.publishedAt);

            return `
            <div class="container">
                <div class="row news">
                    <div class="article-card d-flex flex-column flex-lg-row">
                        <div class="news-img-container col-12 col-lg-4">
                            <img
                                class="news-img"
                                src="${imageSrc}"
                                onerror="this.onerror=null; this.src='./images/image-not-available.jpg';"></div>
                            <div class="article-content col-12 col-lg-8">
                                <h3>${news.title}</h3>
                                <p>
                                    ${truncateText(
                news.description,
                200
            )}
                                </p>
                                <div>
                                    ${sourceName} * ${timeAgo}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        })
        .join('');

    console.log("html", newsHTML);

    document
        .getElementById("news-board")
        .innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;

    document
        .getElementById("news-board")
        .innerHTML = errorHTML;
}

document.addEventListener("DOMContentLoaded", getLatestNews);

document.addEventListener('DOMContentLoaded', function () {
    let menuIcon = document.getElementById('menu-icon');
    let menus = document.querySelector('.menus');

    menuIcon.addEventListener('click', function () {
        menus
            .classList
            .toggle('show');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let searchIcon = document.getElementById('search-icon');
    let searchInput = document.getElementById('search-input');
    let searchButton = document.getElementById('search-button');

    searchIcon.addEventListener('click', function () {
        searchInput
            .classList
            .toggle('show');
        searchButton
            .classList
            .toggle('show');
    });
});