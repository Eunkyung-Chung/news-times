
//`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}
// https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=아이유
// https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=science
let newsList =[];
//1. 메뉴 버튼들에 클릭이벤트 주기
const menus = document.querySelectorAll(".menus button");
console.log("mmm", menus);
menus.forEach((menu) => menu.addEventListener("click", (event) => 
    getNewsByCategory(event)));

//1-1. side-menu버튼에 클릭이벤트
const sideMenus = document.querySelectorAll(".side-menu-list button");
console.log("sss", sideMenus);
sideMenus.forEach((menu) => menu.addEventListener("click", (event) =>
    getNewsByCategory(event)));

//1-2.검색창 GO 버튼에 클릭이벤트 주기
const searchButton = document.querySelector(".input-area button");
// console.log("search",searchButton);
searchButton.addEventListener("click", (event) => 
getNewsByKeyword(event));

const getLatestNews = async () => {
    //url instance만들기((
    const url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
    // console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log(newsList);
};


//2.카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase(); 
    console.log("category", category);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`)

    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    console.log("ddd", newsList);
    //3. 그 뉴스 가져오기
    render();
};

//2-1.키워드별 뉴스 가져오기
const getNewsByKeyword = async(event) => {
    // console.log("goclick");
    const keyword = document.querySelector(".search-input").value;
    // console.log("keyword",keyword);
    const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);

    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    console.log("kkk", newsList);
    //3-1.그 뉴스 가져오기
    render();
}

const render = () => {

    const newsHTML =  newsList.map(news => `
            <div class="row news">
               <div class="col-lg-4">
                  <img
                     class="news-img-size"
                     src="${news.urlToImage || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}"
                     alt="image"
                  />
               </div>
               <div class="col-lg-8">
                  <h2>${news.title}</h2>
                  <p class="context">
                    ${news.description ? news.description : "내용없음"}
                  </p>
                  <div>${news.source.name ? news.source.name : "no source"} * ${moment(news.publishedAt).fromNow()}</div>
               </div>
            </div>
        `).join('');

        // console.log("html", newsHTML);

    document.getElementById('news-board').innerHTML = newsHTML;
};

getLatestNews();

//사이드 메뉴 열리기
function openSideMenu () {
    document.querySelector(".side-menu").style.width = '300px';
}
//사이드메뉴 닫히기
function closeSideMenu () {
    document.querySelector(".side-menu").style.width = '0px';
}
//검색창 나타나기 사라지기
function toggleSearch () {
    document.querySelector(".input-area").classList.toggle("active");
}

//200자 이상에서 ...축약
document.querySelectorAll(".context").forEach((v) => {
    let text = v.innerText;
    if(text.length > 200) {
        v.innerText = text.substring(0, 200) + "..."
    }
});