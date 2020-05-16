const category=document.getElementById("categories")
fetch("https://opentdb.com/api_category.php")
    .then(res=>{
        return res.json();
    })
    .then(res=>{
        const categories=res.trivia_categories;
        Object.keys(categories).forEach(item=>{
            category.innerHTML+=`<option value = ${categories[item].id}>${categories[item].name}</option>`
        })
    })