//const API_KEY = `cc2bda1a3ea248f1b146e45b36ce8d15`;
//`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
let news =[];
const getNews = async () => {
    //url instance만들기((
    const url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=아이유`);
    // console.log(url);
    const reponse = await fetch(url);
    const data = await reponse.json();
    news = data.articles;
    console.log(news);
    let p = document.querySelector("#author");
    p.innerHTML = news[0].author;
}
getNews();