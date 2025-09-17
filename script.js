// const API_KEY = `cc2bda1a3ea248f1b146e45b36ce8d15`;
//`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=아이유
let newsList =[];

const getLatestNews = async () => {
    //url instance만들기((
    const url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=아이유`);
    // console.log(url);
    const reponse = await fetch(url);
    const data = await reponse.json();
    newsList = data.articles;
 
    render();
    console.log(newsList);
};

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
        console.log("html", newsHTML);

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