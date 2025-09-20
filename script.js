
//`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}
// https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=아이유
// https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=science
let newsList =[];
//1. 메뉴 버튼들에 클릭이벤트 주기
const menus = document.querySelectorAll(".menus button");
// console.log("mmm", menus);
menus.forEach((menu) => menu.addEventListener("click", (event) => 
    getNewsByCategory(event)));

//1-1. side-menu버튼에 클릭이벤트
const sideMenus = document.querySelectorAll(".side-menu-list button");
// console.log("sss", sideMenus);
sideMenus.forEach((menu) => menu.addEventListener("click", (event) =>
    getNewsByCategory(event)));

//1-2.검색창 GO 버튼에 클릭이벤트 주기
const searchButton = document.querySelector(".input-area button");
// console.log("search",searchButton);
searchButton.addEventListener("click", (event) => 
getNewsByKeyword(event));

//head-line 클릭이벤트
document.querySelector(".head-line").addEventListener("click", () => {
    page = 1;
    getLatestNews();
})

//검색창에 enter key 눌렀을때 키워드별 뉴스 검색
function enterKey() {
    if (window.event.keyCode == 13){
        getNewsByKeyword();
    }
}

//code refactoring --> url을 전역변수로
let url = new URL (` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us`);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

//code refactoring --> 중복되는 코드 따로 모아서 함수로
const getNews = async() => {
    let data = null;
    try {
        url.searchParams.set("page", page) //&page=page
        url.searchParams.set("pageSize", pageSize); //&pageSize=pageSize 
        const response = await fetch(url);
        console.log("rrr",response);
        data = await response.json();
        console.log("ddd", data);
        //조건에 따라 강제로 에러 발생 시키기
        if (response.status !== 200) {
            throw new Error(data.message);
        } else if (data.articles.length === 0) {
            throw new Error("No matches for your search");
        }
       
    }catch(error) {
        render(error);
        console.log("error", error.message);
        return;
    }
     console.log("data", data);
     newsList = data.articles;
     totalResults = data.totalResults;
     console.log("newsList", newsList);
     render();
     paginationRender();
}

const getLatestNews = async () => {
    //url instance만들기
    url = new URL (` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us`);
    getNews();
};


//2.카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase(); 
    console.log("category", category);
    url = new URL(` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}`);
    page = 1;
    getNews();  
};

//2-1.키워드별 뉴스 가져오기
const getNewsByKeyword = async(event) => {
    // console.log("goclick");
    const keyword = document.querySelector(".search-input").value;
    // console.log("keyword",keyword);
    url = new URL(` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}`);
    getNews();
}

const render = (error) => {
    let newsHTML = '';
    if(error) {
        //bootstrap>component>alert
        newsHTML = ` 
        <div class="alert alert-danger" role="alert">
            ${error.message}
        </div>`;
    } else {

    newsHTML =  newsList.map(news => `
            <div class="row news">
               <div class="col-lg-4">
                  <img
                     class="news-img-size"
                     src="${news.urlToImage || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}"
                     alt="image"
                  />
               </div>
               <div class="col-lg-8">
                  <h2><a href="${news.url}">${news.title}</a></h2>
                  <p class="context">
                    ${news.description ? news.description : "내용없음"}
                  </p>
                  <div>${news.source.name ? news.source.name : "no source"} * ${moment(news.publishedAt).fromNow()}</div>
               </div>
            </div>
        `).join('');
    }
        // console.log("html", newsHTML);

    document.getElementById('news-board').innerHTML = newsHTML;
};

const paginationRender = () => {
    //totalResults :받아오는 총 데이터 개수, api에서 주어짐
    //page : 현재 보고 있는 페이지, api에서 주어짐
    //pageSize :한 페이지에 몇개씩 데이터 받을 것인가,내가 정함 
    //groupSize : 몇개의 페이지를 한 그룹으로 묶을까, 내가 정함

    //totalPage: 몇개의 페이지가 필요한가, Math.ceil(totalResult / pageSize)
    const totalPages = Math.ceil(totalResults / pageSize);
    //pageGroup: 몇번째 페이지 그룹인가(그룹 번호), Math.ceil(page / groupSize)
    const pageGroup = Math.ceil(page / groupSize);
    //lastPage : groupSize * pageGroup
    let lastPage = pageGroup * groupSize;
    if(lastPage > totalPages) {
        lastPage = totalPages;
    }

    // firstPage : lastPage - (groupSize - 1)
    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); 
  
    
  
    let paginationHTML = `<li class="page-item first-btn" onclick="moveToPage(1)">
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;

    paginationHTML += ` <li class="page-item previous-btn" onclick="moveToPage(${page-1})"><a class="page-link">Previous</a></li>`;

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML +=  `<li class="page-item ${i===page?"active":''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    paginationHTML += `<li class="page-item next-btn" onclick="moveToPage(${page+1})"><a class="page-link">Next</a></li>`;

    paginationHTML += `   <li class="page-item last-btn" onclick="moveToPage(${totalPages})">
      <a class="page-link" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;

    document.querySelector(".pagination").innerHTML = paginationHTML;

    //첫번째와 마지막 페이지에서 move-button 안보이기
    if(page === 1) {
       let movePageLi = document.querySelectorAll(".first-btn, .previous-btn");
       console.log(movePageLi);
        movePageLi.forEach((li) => {
            li.style.display = "none";
        });
    } 
    if (page === totalPages) {
         let movePageLi = document.querySelectorAll(".last-btn, .next-btn");
       console.log(movePageLi);
        movePageLi.forEach((li) => {
            li.style.display = "none";
        });
    }
}

//페이지 클릭했을때 그 페이지에 해당하는 뉴스 render
const moveToPage = (pageNum) => {
    console.log("movetopage", pageNum);
    page = pageNum;
    getNews();
}

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
