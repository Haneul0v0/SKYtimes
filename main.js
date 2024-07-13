let newsList = [];

let baseUrl = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
let url = new URL(baseUrl);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const setUrlParams = (params = {}) => {
    Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
};

const getNews = async () => {
    try {
        setUrlParams({ page, pageSize });

        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No result for this search");
            }

            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

const getLatestNews = async () => {
    url = new URL(baseUrl);
    await getNews();
};

const getNewsByCategory = async (event) => {
    const category = event
        .target
        .textContent
        .toLowerCase();

    setUrlParams({ category });
    await getNews();
};

const getNewsByKeyword = async () => {
    const keyword = document
        .getElementById("search-input")
        .value;

    if (keyword.trim() === "") 
        return;

    setUrlParams({ q: keyword });
    document
        .getElementById("search-input")
        .value = "";
    await getNews();
};

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
            const sourceName = news.source && news.source.name
                ? news.source.name
                : 'no source';
            const timeAgo = formatTimeAgo(news.publishedAt);

            return `
            <div class="container">
                <div class="row news">
                    <div class="article-card d-flex flex-column flex-lg-row">
                        <div class="news-img-container col-12 col-lg-4">
                            <img class="news-img" src="${news.urlToImage || './images/image-not-available.png'}" onerror="this.onerror=null; this.src='./images/image-not-available.png';">
                        </div>
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

const paginationRender = () => {
    let paginationHTML = ``;
    let totalPages = Math.ceil(totalResults / pageSize);
    let pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;
    let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    if (lastPage > totalPages) {
        lastPage = totalPages;
    }

    if (page > 1) {
        paginationHTML += `
            <li class="page-item" onclick="moveToPage(1)">
                <a class="page-link">&lt;&lt;</a>
            </li>`;
    }

    if (page > 1) {
        paginationHTML += `
            <li class="page-item" onclick="moveToPage(${page - 1})">
                <a class="page-link">&lt;</a>
            </li>`;
    }

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})">
                <a class="page-link">${i}</a>
            </li>`;
    }

    if (page < totalPages) {
        paginationHTML += `
            <li class="page-item" onclick="moveToPage(${page + 1})">
                <a class="page-link">&gt;</a>
            </li>`;
    }

    if (page < totalPages) {
        paginationHTML += `
            <li class="page-item" onclick="moveToPage(${totalPages})">
                <a class="page-link">&gt;&gt;</a>
            </li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
};


const moveToPage = (pageNum) => {
    console.log("moveToPage", pageNum);
    page = pageNum;
    getNews();
};

getLatestNews();

document.getElementById('logo').addEventListener('click', getLatestNews);

const menus = document.querySelectorAll(".menus button");
menus.forEach(
    menu => menu.addEventListener("click", (event) => getNewsByCategory(event))
);

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

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            getNewsByKeyword();
        }
    });
});